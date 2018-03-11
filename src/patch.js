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
    var walker = {index: 0};
    dfsWalk(node, walker, patches);
}

/**
 * Depth-first search
 *
 * @param {any} node
 * @param {any} walker
 * @param {any} patches
 */
function dfsWalk (node, walker, patches) {
    var currentPatches = patches[walker.index];

    var len = node.childNodes ? node.childNodes.length : 0;

    for (var i = 0; i < len; i++) {
        var child = node.childNodes[i];
        walker.index++;
        dfsWalk(child, walker, patches);
    }

    if (currentPatches) {
        applyPatches(node, currentPatches);
    }
}

/**
 * Apply patches
 *
 * @param {any} node
 * @param {any} currentPatches
 */
function applyPatches (node, currentPatches) {
    _h.each(currentPatches, function (currentPatch) {
        switch (currentPatch.type) {
            case REPLACE:
                var newNode = (typeof currentPatch.node === 'string') ? document.createTextNode(currentPatch.node) : currentPatch.node.render();
                node.parentNode.replaceChild(newNode, node);
                break
            case REORDER:
                reorderChildren(node, currentPatch.moves);
                break
            case PROPS:
                setProps(node, currentPatch.props)
                break
            case TEXT:
                if (node.textContent) {
                    node.textContent = currentPatch.content;
                } else {
                    node.nodeValue = currentPatch.content;
                }
                break
            default:
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
    for (var key in props) {
        if (props[key] === void 42) {
            node.removeAttribute(key);
        } else {
            var value = props[key]
            _h.setAttr(node, key, value);
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
    var staticNodeList = _h.toArray(node.childNodes);
    var maps = {};

    _h.each(staticNodeList, function (node) {
        if (node.nodeType === 1) {
            var key = node.getAttribute('key');

            if (key) {
                maps[key] = node;
            }
        }
    })

    _h.each(moves, function (move) {
        var index = move.index;

        // Remove item if type is 0
        if (move.type === 0) {
            // Check if item has been removed for inserting
            if (staticNodeList[index] === node.childNodes[index]) {
                node.removeChild(node.childNodes[index]);
            }

            staticNodeList.splice(index, 1)
        // Insert item
        } else if (move.type === 1) {
            var insertNode = maps[move.item.key] ? maps[move.item.key].cloneNode(true) : ((typeof move.item === 'object') ? move.item.render() : document.createTextNode(move.item));

            staticNodeList.splice(index, 0, insertNode);
            node.insertBefore(insertNode, node.childNodes[index] || null);
        }
    })
}

// Assign values of constants
patch.REPLACE = REPLACE;
patch.REORDER = REORDER;
patch.PROPS = PROPS;
patch.TEXT = TEXT;

// Export module as 'patch'
module.exports = patch;