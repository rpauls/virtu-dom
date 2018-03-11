var _h = require('./helper');

// Declare constants
const REPLACE = 0;
const REORDER = 1;
const PROPS = 2;
const TEXT = 3;


/**
 * Patch differences
 *
 * @param {any} node
 * @param {any} patches
 */
function patch (node, patches) {
    var walker = {index: 0}; // Initialize with object containing key 'index' with value of zero
    dfsWalk(node, walker, patches); // Call local depth-first search function passing node, walker and patches
}

/**
 * Depth-first search
 *
 * @param {any} node
 * @param {any} walker
 * @param {any} patches
 */
function dfsWalk (node, walker, patches) {
    var currentPatches = patches[walker.index]; // Initialize with value of current patches at walker index

    var len = node.childNodes ? node.childNodes.length : 0; // Get length of childNodes

    // Iterate trough child nodes based on child nodes length
    for (var i = 0; i < len; i++) {
        var child = node.childNodes[i]; // Current child node
        walker.index++; // Raise walker index
        dfsWalk(child, walker, patches); // Call local depth-first search function
    }

    // Check if changes exists
    if (currentPatches) {
        applyPatches(node, currentPatches); // Apply patches
    }
}

/**
 * Apply patches
 *
 * @param {any} node
 * @param {any} currentPatches
 */
function applyPatches (node, currentPatches) {
    // Iterate trough currentPatches and call function for each one
    _h.each(currentPatches, function (currentPatch) {
        // Check for type of current patch
        switch (currentPatch.type) {
            case REPLACE:
                // Get new node and check if node has to be rendered or is only a text node
                var newNode = (typeof currentPatch.node === 'string') ? document.createTextNode(currentPatch.node) : currentPatch.node.render();
                // Replace old node with new node
                node.parentNode.replaceChild(newNode, node);
                break
            case REORDER:
                // Reorder old node in new tree
                reorderChildren(node, currentPatch.moves);
                break
            case PROPS:
                // Set property of old node in new tree
                setProps(node, currentPatch.props)
                break
            case TEXT:
                // Check if node has text content
                if (node.textContent) {
                    node.textContent = currentPatch.content; // Assign text content from current patch content
                } else {
                    // IE makes problems
                    node.nodeValue = currentPatch.content; // Assign node value from current patch content
                }
                break
            default:
                // Thrwo error if patch type is unknown
                throw new Error('Unknown patch type ' + currentPatch.type);
        }
    })
}

/**
 * Set properties on node
 *
 * @param {any} node
 * @param {any} props
 */
function setProps (node, props) {
    // Iterate trough properties
    for (var key in props) {
        // Check if property is undefined
        if (props[key] === void 42) {
            node.removeAttribute(key); // Removed attribute from dom-element
        } else {
            _h.setAttr(node, key, props[key]); // Set attribute of dom-element to key: props[key]
        }
    }
}

/**
 * Reorder children of node
 *
 * @param {any} node
 * @param {any} moves
 */
function reorderChildren (node, moves) {
    var staticNodeList = _h.toArray(node.childNodes); // Initialize with array of child nodes
    var maps = {}; // Initialize with empty object

    // Iterate trough array of child nodes and call function for each one
    _h.each(staticNodeList, function (node) {
        // Check if type of node is REORDER ('1')
        if (node.nodeType === REORDER) {
            var key = node.getAttribute('key'); // Get attribute

            // Check if attribute key exists
            if (key) {
                maps[key] = node; // Add node to maps
            }
        }
    })

    // Iterate trough number of dfs walk moves and call function for each one
    _h.each(moves, function (move) {
        var index = move.index; // Initialize with index of current move

        // Remove item if type is 0
        if (move.type === REPLACE) {
            // Check if item has been removed for inserting
            if (staticNodeList[index] === node.childNodes[index]) {
                node.removeChild(node.childNodes[index]);
            }

            staticNodeList.splice(index, 1)
        // Insert item
        } else if (move.type === REORDER) {
            var insertNode = maps[move.item.key] ? maps[move.item.key].cloneNode(true) : ((typeof move.item === 'object') ? move.item.render() : document.createTextNode(move.item));

            staticNodeList.splice(index, 0, insertNode);

            node.insertBefore(insertNode, node.childNodes[index] || null);
        }
    });
}

// Assign values of constants
patch.REPLACE = REPLACE;
patch.REORDER = REORDER;
patch.PROPS = PROPS;
patch.TEXT = TEXT;

// Export module as 'patch'
module.exports = patch;