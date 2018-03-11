var _h = require('./helper');

/**
* Virtual-dom Element.
* @param {String} tagName
* @param {Object} props - element properties as key-value pair using object as store
* @param {Array<Element|String>} - children element that can be element instance or plain text
*/
function Element (tagName, props, children) {
    // Save current function scope to variable to prevent unforeseen side effects
    var me = this;

    // Check if current Element is'nt an instance of 'Element'
    if (!(me instanceof Element)) {
        // Check if children is'nt an array or isn't null
        if (!_h.isArray(children) && children != null) {
            // Slice children array
            children = _h.slice(arguments, 2).filter(_h.truther);
        }

        // Return new Element
        return new Element(tagName, props, children);
    }

    // Check if props is an array
    if (_h.isArray(props)) {
        children = props; // Set children to props
        props = {}; // Initialize empty props variable
    }

    me.tagName = tagName // Set tagName
    me.props = props || {} // Set current elements props if not empty, else initialize empty object
    me.children = children || [] // Set current elements children if not empty, else initialize empty array
    me.key = props ? props.key : void 42; // Set current elements key to props.key if props is not empty, else set undefined (void)

    var count = 0; // Initialize count with value of zero

    // Iterate trough current elements children and call function for each one
    _h.each(me.children, function (child, i) {
        // Check if current iterated child is an instance of Element,
        // else set value of child in children array to content of child
        if (child instanceof Element) {
            count += child.count; // Raise count variable with value of child count variable
        } else {
            children[i] = '' + child; // Set children element to content of child
        }

        count++; // Raise count
    })

    me.count = count; // Set current elements count to count
}

/**
* Render the hold element tree.
*/
Element.prototype.render = function () {
    // Save current function scope to variable to prevent unforeseen side effects
    var me = this;

    var el = document.createElement(me.tagName);
    var props = me.props;

    for (var propName in props) {
        var propValue = props[propName];
        _h.setAttr(el, propName, propValue);
    }

    _h.each(me.children, function (child) {
        var childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);
        el.appendChild(childEl);
    })

    return el;
}

module.exports = Element;