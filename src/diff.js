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
    var index = 0; // Initialize with value zero
    var patches = {}; // Initialize with empty object

     // Call depth-first search function for new and old DOM tree
     // and pass index and patches variables
    dfsWalk(oldTree, newTree, index, patches);

    return patches; // Return changes between old and new DOM tree
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
    var currentPatch = []; // Initialize with empty array

    // Check if node is null, therefore removed
    if (newNode === null) {
        // If node ist removed, the real DOM node will be removed when reordering is perfomred
    // TextNode content replacing
    } else if (_h.isString(oldNode) && _h.isString(newNode)) {
        if (newNode !== oldNode) {
            currentPatch.push({ type: patch.TEXT, content: newNode });
        }
    // Check if old and new node are identical
    } else if ( oldNode.tagName === newNode.tagName && oldNode.key === newNode.key ) {
        // Check properties and children of old and new node
        // and assign possible changes to propsPatches
        var propsPatches = diffProps(oldNode, newNode);

        // Check if propsPatches has a value/is not empty
        if (propsPatches) {
            // Add changed properties to currentPatch
            currentPatch[currentPatch.length] = { type: patch.PROPS, props: propsPatches };
        }

        // Check if new node has 'ignore' property and should be ignored
        if (!isIgnoreChildren(newNode)) {
            // Diff children of old and new nodes
            // and pass index, patches and currentPatch
            diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
        }
    // Nodes are not identical
    } else {
        // Replace old node with new node
        currentPatch[currentPatch.length] = { type: patch.REPLACE, node: newNode };
    }

    // Check if any changes have been stores in currentPatch
    if (currentPatch.length) {
        // Add currentPatch (changes) to array of all changes at index position
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