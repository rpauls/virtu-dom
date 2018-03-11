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
    var diffs = listDiff(oldChildren, newChildren, 'key'); // Diff two list in O(N)
    newChildren = diffs.children; // Assign diffed children to newChildren

    // Check if differences occured based on dfs walk moves
    if (diffs.moves.length) {
        var reorderPatch = { type: patch.REORDER, moves: diffs.moves }; // Patch state
        currentPatch[currentPatch.length] = reorderPatch; // Add reorderPatch to currentPatch
    }

    var leftNode = null; // Initialize with null
    var currentNodeIndex = index; // Initialize with value of index

    // Iterate trough old children and call function for each one
    _h.each(oldChildren, function (child, i) {
        var newChild = newChildren[i]; // Get new child
        currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1; // Get current node index
        dfsWalk(child, newChild, currentNodeIndex, patches); // Call depth-first search function for old and new child
        leftNode = child; // Assign child to leftNode
    });
}

/**
 * Differentiate old properties and new properties of a node
 *
 * @param {any} oldNode
 * @param {any} newNode
 * @returns
 */
function diffProps (oldNode, newNode) {
    var count = 0; // Initialize with value of zero
    var oldProps = oldNode.props; // Initialize with properties of old node
    var newProps = newNode.props; // Initialize with properties of new node

    var key;
    var propsPatches = {}; // Initialize with empty object

    // Iterate trough old properties
    for (key in oldProps) {
        // Check if properties differ
        if (newProps[key] !== oldProps[key]) {
            count++; // Raise counter
            propsPatches[key] = newProps[key]; // Assign changed property to propsPatches
        }
    }

    // Iterate trough new properties
    for (key in newProps) {
        // Check if old property has identical key of new property,
        // therefore check for new property
        if (!oldProps.hasOwnProperty(key)) {
            count++; // Raise counter
            propsPatches[key] = newProps[key]; // Assign new property to propsPatches
        }
    }

    // If properties are identical
    if (count === 0) {
        return null; // Return null
    }

    return propsPatches; // Return changes of properties
}

/**
 * Return bool if node has a properties with value 'ignore'
 *
 * @param {any} node
 * @returns
 */
function isIgnoreChildren (node) {
    return (node.props && node.props.hasOwnProperty('ignore')); // Return boolean value
}

// Export module as 'diff'
module.exports = diff;