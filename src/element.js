var _h = require('./helper');

/**
* Virtual-dom Element.
* @param {String} tagName
* @param {Object} props - element properties as key-value pair using object as store
* @param {Array<Element|String>} - children element that can be element instance or plain text
*/
function Element (tagName, props, children) {
    if (!(this instanceof Element)) {
        if (!_h.isArray(children) && children != null) {
            children = _h.slice(arguments, 2).filter(_h.truther);
        }

        return new Element(tagName, props, children);
    }

    if (_h.isArray(props)) {
        children = props;
        props = {};
    }

    this.tagName = tagName
    this.props = props || {}
    this.children = children || []
    this.key = props ? props.key : void 42;

    var count = 0;

    _h.each(this.children, function (child, i) {
        if (child instanceof Element) {
            count += child.count;
        } else {
            children[i] = '' + child;
        }
        count++;
    })

    this.count = count;
}

/**
* Render the hold element tree.
*/
Element.prototype.render = function () {
    var el = document.createElement(this.tagName);
    var props = this.props;

    for (var propName in props) {
        var propValue = props[propName];
        _h.setAttr(el, propName, propValue);
    }

    _h.each(this.children, function (child) {
        var childEl = (child instanceof Element) ? child.render() : document.createTextNode(child);
        el.appendChild(childEl);
    })

    return el;
}

module.exports = Element;