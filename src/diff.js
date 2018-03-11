var _h = require('./helper');
var patch = require('./patch');
var listDiff = require('list-diff2');

/**
 * Differentiate old DOM tree with new DOM tree
 *
 * @param {any} oldTree
 * @param {any} newTree
 * @returns
 */
function diff (oldTree, newTree) {
    var index = 0;
    var patches = {};

    dfsWalk(oldTree, newTree, index, patches);

    return patches;
}

/**
 * Depth-first search
 *
 * @param {any} oldNode
 * @param {any} newNode
 * @param {any} index
 * @param {any} patches
 */
function dfsWalk (oldNode, newNode, index, patches) {
    var currentPatch = [];

    // Node is removed
    if (newNode === null) {
        // Real DOM node will be removed when perform reordering, so has no needs to do anthings in here
    // TextNode content replacing
    } else if (_h.isString(oldNode) && _h.isString(newNode)) {
        if (newNode !== oldNode) {
            currentPatch.push({ type: patch.TEXT, content: newNode });
        }
    // Nodes are the same, diff old node's props and children
    } else if ( oldNode.tagName === newNode.tagName && oldNode.key === newNode.key ) {
        // Diff props
        var propsPatches = diffProps(oldNode, newNode);

        if (propsPatches) {
            currentPatch.push({ type: patch.PROPS, props: propsPatches });
        }
        // Diff children. If the node has a `ignore` property, do not diff children
        if (!isIgnoreChildren(newNode)) {
            diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
        }
    // Nodes are not the same, replace the old node with new node
    } else {
        currentPatch.push({ type: patch.REPLACE, node: newNode });
    }

    if (currentPatch.length) {
        patches[index] = currentPatch;
    }
}

/**
 * Differentiate old children and new children of a node
 *
 * @param {any} oldChildren
 * @param {any} newChildren
 * @param {any} index
 * @param {any} patches
 * @param {any} currentPatch
 */
function diffChildren (oldChildren, newChildren, index, patches, currentPatch) {
    var diffs = listDiff(oldChildren, newChildren, 'key');
    newChildren = diffs.children;

    if (diffs.moves.length) {
        var reorderPatch = { type: patch.REORDER, moves: diffs.moves };
        currentPatch.push(reorderPatch);
    }

    var leftNode = null;
    var currentNodeIndex = index;

    _h.each(oldChildren, function (child, i) {
        var newChild = newChildren[i];
        currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
        dfsWalk(child, newChild, currentNodeIndex, patches);
        leftNode = child;
    })
}

/**
 * Differentiate old properties and new properties of a node
 *
 * @param {any} oldNode
 * @param {any} newNode
 * @returns
 */
function diffProps (oldNode, newNode) {
    var count = 0;
    var oldProps = oldNode.props;
    var newProps = newNode.props;

    var key, value;
    var propsPatches = {};

    // Find out different properties
    for (key in oldProps) {
        value = oldProps[key];

        if (newProps[key] !== value) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    // Find out new property
    for (key in newProps) {
        value = newProps[key];

        if (!oldProps.hasOwnProperty(key)) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    // If properties all are identical
    if (count === 0) {
        return null;
    }

    return propsPatches;
}

/**
 * Return bool if node has a properties with value 'ignore'
 *
 * @param {any} node
 * @returns
 */
function isIgnoreChildren (node) {
    return (node.props && node.props.hasOwnProperty('ignore'));
}

// Export module as 'diff'
module.exports = diff;