var _h = exports;

// Get type of object
_h.type = function (obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
}

// Check is type is array
_h.isArray = function isArray(lst) {
    return _.type(lst) === 'Array';
}

// Check if type is string
_h.isString = function isString(lst) {
    return _.type(lst) === 'String';
}

// Get boolean value of value
_h.truther = function truther(val) {
    return !!val;
}

// Slice array
_h.slice = function slice(arr, idx) {
    return Array.prototype.slice.call(arr, idx);
}

// Run trough each element of supplied array and call function with each element
_h.each = function each (arr, fn) {
    for (var i = 0, len = arr.length; i < len; i++) {
        fn(arr[i], i);
    }
}

_h.toArray = function toArray(lst) {
    if (!lst) {
        return [];
    }

    var l = [];

    for (var i = 0, len = lst.length; i < len; i++) {
        l[l.length] = lst[i];
    }

    return l;
}

// Set attribute of node
_h.setAttr = function setAttr (node, key, value) {
    switch (key) {
        case 'style':
            node.style.cssText = value;
            break;
        case 'value':
            var tagName = node.tagName || '';
            tagName = tagName.toLowerCase();
            if (tagName === 'input' || tagName === 'textarea') {
                node.value = value;
            } else {
                // Set attribute using 'setAttribute' if node is not an input or textarea
                node.setAttribute(key, value);
            }
            break;
        default:
            node.setAttribute(key, value);
            break;
    }
}