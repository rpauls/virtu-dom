/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("window.vd = __webpack_require__(/*! ./src/virtu-dom */ \"./src/virtu-dom.js\");\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./node_modules/list-diff2/index.js":
/*!******************************************!*\
  !*** ./node_modules/list-diff2/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./lib/diff */ \"./node_modules/list-diff2/lib/diff.js\").diff\n\n\n//# sourceURL=webpack:///./node_modules/list-diff2/index.js?");

/***/ }),

/***/ "./node_modules/list-diff2/lib/diff.js":
/*!*********************************************!*\
  !*** ./node_modules/list-diff2/lib/diff.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\r\n * Diff two list in O(N).\r\n * @param {Array} oldList - Original List\r\n * @param {Array} newList - List After certain insertions, removes, or moves\r\n * @return {Object} - {moves: <Array>}\r\n *                  - moves is a list of actions that telling how to remove and insert\r\n */\r\nfunction diff (oldList, newList, key) {\r\n  var oldMap = makeKeyIndexAndFree(oldList, key)\r\n  var newMap = makeKeyIndexAndFree(newList, key)\r\n\r\n  var newFree = newMap.free\r\n\r\n  var oldKeyIndex = oldMap.keyIndex\r\n  var newKeyIndex = newMap.keyIndex\r\n\r\n  var moves = []\r\n\r\n  // a simulate list to manipulate\r\n  var children = []\r\n  var i = 0\r\n  var item\r\n  var itemKey\r\n  var freeIndex = 0\r\n\r\n  // fist pass to check item in old list: if it's removed or not\r\n  while (i < oldList.length) {\r\n    item = oldList[i]\r\n    itemKey = getItemKey(item, key)\r\n    if (itemKey) {\r\n      if (!newKeyIndex.hasOwnProperty(itemKey)) {\r\n        children.push(null)\r\n      } else {\r\n        var newItemIndex = newKeyIndex[itemKey]\r\n        children.push(newList[newItemIndex])\r\n      }\r\n    } else {\r\n      var freeItem = newFree[freeIndex++]\r\n      children.push(freeItem || null)\r\n    }\r\n    i++\r\n  }\r\n\r\n  var simulateList = children.slice(0)\r\n\r\n  // remove items no longer exist\r\n  i = 0\r\n  while (i < simulateList.length) {\r\n    if (simulateList[i] === null) {\r\n      remove(i)\r\n      removeSimulate(i)\r\n    } else {\r\n      i++\r\n    }\r\n  }\r\n\r\n  // i is cursor pointing to a item in new list\r\n  // j is cursor pointing to a item in simulateList\r\n  var j = i = 0\r\n  while (i < newList.length) {\r\n    item = newList[i]\r\n    itemKey = getItemKey(item, key)\r\n\r\n    var simulateItem = simulateList[j]\r\n    var simulateItemKey = getItemKey(simulateItem, key)\r\n\r\n    if (simulateItem) {\r\n      if (itemKey === simulateItemKey) {\r\n        j++\r\n      } else {\r\n        // new item, just inesrt it\r\n        if (!oldKeyIndex.hasOwnProperty(itemKey)) {\r\n          insert(i, item)\r\n        } else {\r\n          // if remove current simulateItem make item in right place\r\n          // then just remove it\r\n          var nextItemKey = getItemKey(simulateList[j + 1], key)\r\n          if (nextItemKey === itemKey) {\r\n            remove(i)\r\n            removeSimulate(j)\r\n            j++ // after removing, current j is right, just jump to next one\r\n          } else {\r\n            // else insert item\r\n            insert(i, item)\r\n          }\r\n        }\r\n      }\r\n    } else {\r\n      insert(i, item)\r\n    }\r\n\r\n    i++\r\n  }\r\n\r\n  function remove (index) {\r\n    var move = {index: index, type: 0}\r\n    moves.push(move)\r\n  }\r\n\r\n  function insert (index, item) {\r\n    var move = {index: index, item: item, type: 1}\r\n    moves.push(move)\r\n  }\r\n\r\n  function removeSimulate (index) {\r\n    simulateList.splice(index, 1)\r\n  }\r\n\r\n  return {\r\n    moves: moves,\r\n    children: children\r\n  }\r\n}\r\n\r\n/**\r\n * Convert list to key-item keyIndex object.\r\n * @param {Array} list\r\n * @param {String|Function} key\r\n */\r\nfunction makeKeyIndexAndFree (list, key) {\r\n  var keyIndex = {}\r\n  var free = []\r\n  for (var i = 0, len = list.length; i < len; i++) {\r\n    var item = list[i]\r\n    var itemKey = getItemKey(item, key)\r\n    if (itemKey) {\r\n      keyIndex[itemKey] = i\r\n    } else {\r\n      free.push(item)\r\n    }\r\n  }\r\n  return {\r\n    keyIndex: keyIndex,\r\n    free: free\r\n  }\r\n}\r\n\r\nfunction getItemKey (item, key) {\r\n  if (!item || !key) return void 666\r\n  return typeof key === 'string'\r\n    ? item[key]\r\n    : key(item)\r\n}\r\n\r\nexports.makeKeyIndexAndFree = makeKeyIndexAndFree // exports for test\r\nexports.diff = diff\r\n\n\n//# sourceURL=webpack:///./node_modules/list-diff2/lib/diff.js?");

/***/ }),

/***/ "./src/diff.js":
/*!*********************!*\
  !*** ./src/diff.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var _h = __webpack_require__(/*! ./helper */ \"./src/helper.js\");\r\nvar patch = __webpack_require__(/*! ./patch */ \"./src/patch.js\");\r\nvar listDiff = __webpack_require__(/*! list-diff2 */ \"./node_modules/list-diff2/index.js\");\r\n\r\n/**\r\n * Differentiate old DOM tree with new DOM tree\r\n *\r\n * @param {any} oldTree\r\n * @param {any} newTree\r\n * @returns\r\n */\r\nfunction diff (oldTree, newTree) {\r\n    var index = 0; // Initialize with value zero\r\n    var patches = {}; // Initialize with empty object\r\n\r\n     // Call depth-first search function for new and old DOM tree\r\n     // and pass index and patches variables\r\n    dfsWalk(oldTree, newTree, index, patches);\r\n\r\n    return patches; // Return changes between old and new DOM tree\r\n}\r\n\r\n/**\r\n * Depth-first search\r\n *\r\n * @param {any} oldNode\r\n * @param {any} newNode\r\n * @param {any} index\r\n * @param {any} patches\r\n */\r\nfunction dfsWalk (oldNode, newNode, index, patches) {\r\n    var currentPatch = []; // Initialize with empty array\r\n\r\n    // Check if node is null, therefore removed\r\n    if (newNode === null) {\r\n        // If node ist removed, the real DOM node will be removed when reordering is perfomred\r\n    // TextNode content replacing\r\n    } else if (_h.isString(oldNode) && _h.isString(newNode)) {\r\n        if (newNode !== oldNode) {\r\n            currentPatch.push({ type: patch.TEXT, content: newNode });\r\n        }\r\n    // Check if old and new node are identical\r\n    } else if ( oldNode.tagName === newNode.tagName && oldNode.key === newNode.key ) {\r\n        // Check properties and children of old and new node\r\n        // and assign possible changes to propsPatches\r\n        var propsPatches = diffProps(oldNode, newNode);\r\n\r\n        // Check if propsPatches has a value/is not empty\r\n        if (propsPatches) {\r\n            // Add changed properties to currentPatch\r\n            currentPatch[currentPatch.length] = { type: patch.PROPS, props: propsPatches };\r\n        }\r\n\r\n        // Check if new node has 'ignore' property and should be ignored\r\n        if (!isIgnoreChildren(newNode)) {\r\n            // Diff children of old and new nodes\r\n            // and pass index, patches and currentPatch\r\n            diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);\r\n        }\r\n    // Nodes are not identical\r\n    } else {\r\n        // Replace old node with new node\r\n        currentPatch[currentPatch.length] = { type: patch.REPLACE, node: newNode };\r\n    }\r\n\r\n    // Check if any changes have been stores in currentPatch\r\n    if (currentPatch.length) {\r\n        // Add currentPatch (changes) to array of all changes at index position\r\n        patches[index] = currentPatch;\r\n    }\r\n}\r\n\r\n/**\r\n * Differentiate old children and new children of a node\r\n *\r\n * @param {any} oldChildren\r\n * @param {any} newChildren\r\n * @param {any} index\r\n * @param {any} patches\r\n * @param {any} currentPatch\r\n */\r\nfunction diffChildren (oldChildren, newChildren, index, patches, currentPatch) {\r\n    var diffs = listDiff(oldChildren, newChildren, 'key'); // Diff two list in O(N)\r\n    newChildren = diffs.children; // Assign diffed children to newChildren\r\n\r\n    if (diffs.moves.length) {\r\n        var reorderPatch = { type: patch.REORDER, moves: diffs.moves };\r\n        currentPatch.push(reorderPatch);\r\n    }\r\n\r\n    var leftNode = null;\r\n    var currentNodeIndex = index;\r\n\r\n    _h.each(oldChildren, function (child, i) {\r\n        var newChild = newChildren[i];\r\n        currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;\r\n        dfsWalk(child, newChild, currentNodeIndex, patches);\r\n        leftNode = child;\r\n    })\r\n}\r\n\r\n/**\r\n * Differentiate old properties and new properties of a node\r\n *\r\n * @param {any} oldNode\r\n * @param {any} newNode\r\n * @returns\r\n */\r\nfunction diffProps (oldNode, newNode) {\r\n    var count = 0; // Initialize with value of zero\r\n    var oldProps = oldNode.props; // Initialize with properties of old node\r\n    var newProps = newNode.props; // Initialize with properties of new node\r\n\r\n    var key;\r\n    var propsPatches = {}; // Initialize with empty object\r\n\r\n    // Iterate trough old properties\r\n    for (key in oldProps) {\r\n        // Check if properties differ\r\n        if (newProps[key] !== oldProps[key]) {\r\n            count++; // Raise counter\r\n            propsPatches[key] = newProps[key]; // Assign changed property to propsPatches\r\n        }\r\n    }\r\n\r\n    // Iterate trough new properties\r\n    for (key in newProps) {\r\n        // Check if old property has identical key of new property,\r\n        // therefore check for new property\r\n        if (!oldProps.hasOwnProperty(key)) {\r\n            count++; // Raise counter\r\n            propsPatches[key] = newProps[key]; // Assign new property to propsPatches\r\n        }\r\n    }\r\n\r\n    // If properties are identical\r\n    if (count === 0) {\r\n        return null; // Return null\r\n    }\r\n\r\n    return propsPatches; // Return changes of properties\r\n}\r\n\r\n/**\r\n * Return bool if node has a properties with value 'ignore'\r\n *\r\n * @param {any} node\r\n * @returns\r\n */\r\nfunction isIgnoreChildren (node) {\r\n    return (node.props && node.props.hasOwnProperty('ignore')); // Return boolean value\r\n}\r\n\r\n// Export module as 'diff'\r\nmodule.exports = diff;\n\n//# sourceURL=webpack:///./src/diff.js?");

/***/ }),

/***/ "./src/element.js":
/*!************************!*\
  !*** ./src/element.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var _h = __webpack_require__(/*! ./helper */ \"./src/helper.js\");\n\n/**\n* Virtual DOM element\n*\n* @param {String} tagName\n* @param {Object} props - element properties as key-value pair using object as store\n* @param {Array<Element|String>} - children element that can be element instance or plain text\n*/\nfunction Element (tagName, props, children) {\n    // Save current function scope to variable to prevent unforeseen side effects\n    var me = this;\n\n    // Check if current Element is'nt an instance of 'Element'\n    if (!(me instanceof Element)) {\n        // Check if children is'nt an array or isn't null\n        if (!_h.isArray(children) && children != null) {\n            // Slice children array\n            children = _h.slice(arguments, 2).filter(_h.truther);\n        }\n\n        // Return new Element\n        return new Element(tagName, props, children);\n    }\n\n    // Check if props is an array\n    if (_h.isArray(props)) {\n        children = props; // Set children to props\n        props = {}; // Initialize empty props variable\n    }\n\n    me.tagName = tagName // Set tagName\n    me.props = props || {} // Set current elements props if not empty, else initialize empty object\n    me.children = children || [] // Set current elements children if not empty, else initialize empty array\n    me.key = props ? props.key : void 42; // Set current elements key to props.key if props is not empty, else set undefined (void)\n\n    var count = 0; // Initialize count with value of zero\n\n    // Iterate trough current elements children and call function for each one\n    _h.each(me.children, function (child, i) {\n        // Check if current iterated child is an instance of Element,\n        // else set value of child in children array to content of child\n        if (child instanceof Element) {\n            count += child.count; // Raise count variable with value of child count variable\n        } else {\n            children[i] = '' + child; // Set children element to content of child\n        }\n\n        count++; // Raise count\n    })\n\n    me.count = count; // Set current elements count to count\n}\n\n/**\n* Render element tree\n*\n* @returns dom-element\n*/\nElement.prototype.render = function () {\n    // Save current function scope to variable to prevent unforeseen side effects\n    var me = this;\n\n    var el = document.createElement(me.tagName); // Create a new dom-element based on tagName variable\n    var props = me.props; // Initialize local props value with current elements props value\n\n    // Iterate trough local props value as propName\n    for (var propName in props) {\n        _h.setAttr(el, propName, props[propName]); // Set properties name and value (propbs[propName]) of dom-element\n    }\n\n    // Iterate trough children of current element and call function\n    _h.each(me.children, function (child) {\n         // Check if child is instance of Element and call render function,\n         // else child is text and create a new dom-textnode\n        var childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);\n        el.appendChild(childEl); // Append child to dom-element\n    })\n\n    return el; // Return dom-element\n}\n\n// Export module as 'Element'\nmodule.exports = Element;\n\n//# sourceURL=webpack:///./src/element.js?");

/***/ }),

/***/ "./src/helper.js":
/*!***********************!*\
  !*** ./src/helper.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var _h = exports;\n\n// Get type of object\n_h.type = function (obj) {\n    return Object.prototype.toString.call(obj).replace(/\\[object\\s|\\]/g, '');\n}\n\n// Check is type is array\n_h.isArray = function isArray(lst) {\n    return _h.type(lst) === 'Array';\n}\n\n// Check if type is string\n_h.isString = function isString(lst) {\n    return _h.type(lst) === 'String';\n}\n\n// Get boolean value of value\n_h.truther = function truther(val) {\n    return !!val;\n}\n\n// Slice array\n_h.slice = function slice(arr, idx) {\n    return Array.prototype.slice.call(arr, idx);\n}\n\n// Run trough each element of supplied array and call function with each element\n_h.each = function each (arr, fn) {\n    for (var i = 0, len = arr.length; i < len; i++) {\n        fn(arr[i], i);\n    }\n}\n\n_h.toArray = function toArray(lst) {\n    if (!lst) {\n        return [];\n    }\n\n    var l = [];\n\n    for (var i = 0, len = lst.length; i < len; i++) {\n        l[l.length] = lst[i];\n    }\n\n    return l;\n}\n\n// Set attribute of node\n_h.setAttr = function setAttr (node, key, value) {\n    console.log(node);\n    switch (key) {\n        case 'style':\n            node.style.cssText = value;\n            break;\n        case 'value':\n            var tagName = node.tagName || '';\n            tagName = tagName.toLowerCase();\n            if (tagName === 'input' || tagName === 'textarea') {\n                node.value = value;\n            } else {\n                // Set attribute using 'setAttribute' if node is not an input or textarea\n                node.setAttribute(key, value);\n            }\n            break;\n        default:\n            node.setAttribute(key, value);\n            break;\n    }\n}\n\n//# sourceURL=webpack:///./src/helper.js?");

/***/ }),

/***/ "./src/patch.js":
/*!**********************!*\
  !*** ./src/patch.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var _h = __webpack_require__(/*! ./helper */ \"./src/helper.js\");\n\n// Declare constants\nconst REPLACE = 0;\nconst REORDER = 1;\nconst PROPS = 2;\nconst TEXT = 3;\n\n\n/**\n * Patch differences\n *\n * @param {any} node\n * @param {any} patches\n */\nfunction patch (node, patches) {\n    var walker = {index: 0};\n    dfsWalk(node, walker, patches);\n}\n\n/**\n * Depth-first search\n *\n * @param {any} node\n * @param {any} walker\n * @param {any} patches\n */\nfunction dfsWalk (node, walker, patches) {\n    var currentPatches = patches[walker.index];\n\n    var len = node.childNodes ? node.childNodes.length : 0;\n\n    for (var i = 0; i < len; i++) {\n        var child = node.childNodes[i];\n        walker.index++;\n        dfsWalk(child, walker, patches);\n    }\n\n    if (currentPatches) {\n        applyPatches(node, currentPatches);\n    }\n}\n\n/**\n * Apply patches\n *\n * @param {any} node\n * @param {any} currentPatches\n */\nfunction applyPatches (node, currentPatches) {\n    _h.each(currentPatches, function (currentPatch) {\n        switch (currentPatch.type) {\n            case REPLACE:\n                var newNode = (typeof currentPatch.node === 'string') ? document.createTextNode(currentPatch.node) : currentPatch.node.render();\n                node.parentNode.replaceChild(newNode, node);\n                break\n            case REORDER:\n                reorderChildren(node, currentPatch.moves);\n                break\n            case PROPS:\n                setProps(node, currentPatch.props)\n                break\n            case TEXT:\n                if (node.textContent) {\n                    node.textContent = currentPatch.content;\n                } else {\n                    node.nodeValue = currentPatch.content;\n                }\n                break\n            default:\n                throw new Error('Unknown patch type ' + currentPatch.type);\n        }\n    })\n}\n\n/**\n * Set properties on node\n *\n * @param {any} node\n * @param {any} props\n */\nfunction setProps (node, props) {\n    for (var key in props) {\n        if (props[key] === void 42) {\n            node.removeAttribute(key);\n        } else {\n            var value = props[key]\n            _h.setAttr(node, key, value);\n        }\n    }\n}\n\n/**\n * Reorder children of node\n *\n * @param {any} node\n * @param {any} moves\n */\nfunction reorderChildren (node, moves) {\n    var staticNodeList = _h.toArray(node.childNodes);\n    var maps = {};\n\n    _h.each(staticNodeList, function (node) {\n        if (node.nodeType === 1) {\n            var key = node.getAttribute('key');\n\n            if (key) {\n                maps[key] = node;\n            }\n        }\n    })\n\n    _h.each(moves, function (move) {\n        var index = move.index;\n\n        // Remove item if type is 0\n        if (move.type === 0) {\n            // Check if item has been removed for inserting\n            if (staticNodeList[index] === node.childNodes[index]) {\n                node.removeChild(node.childNodes[index]);\n            }\n\n            staticNodeList.splice(index, 1)\n        // Insert item\n        } else if (move.type === 1) {\n            var insertNode = maps[move.item.key] ? maps[move.item.key].cloneNode(true) : ((typeof move.item === 'object') ? move.item.render() : document.createTextNode(move.item));\n\n            staticNodeList.splice(index, 0, insertNode);\n            node.insertBefore(insertNode, node.childNodes[index] || null);\n        }\n    })\n}\n\n// Assign values of constants\npatch.REPLACE = REPLACE;\npatch.REORDER = REORDER;\npatch.PROPS = PROPS;\npatch.TEXT = TEXT;\n\n// Export module as 'patch'\nmodule.exports = patch;\n\n//# sourceURL=webpack:///./src/patch.js?");

/***/ }),

/***/ "./src/virtu-dom.js":
/*!**************************!*\
  !*** ./src/virtu-dom.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports.element = __webpack_require__(/*! ./element */ \"./src/element.js\");\r\nexports.diff = __webpack_require__(/*! ./diff */ \"./src/diff.js\");\r\nexports.patch = __webpack_require__(/*! ./patch */ \"./src/patch.js\");\n\n//# sourceURL=webpack:///./src/virtu-dom.js?");

/***/ })

/******/ });