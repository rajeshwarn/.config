Element.prototype.parents = function(s) {
    var l = [],
    e = this;
    if (s) {
        var t = s.charAt(0);
    }
    for (var q = 0; e && e !== document && !q; e = e.parentNode) {
        if (s) {
            if (t === '.' && e.classList.contains(s.substr(1))) q = 1;
            if (t === '#' && e.id === s.substr(1)) q = 1;
            if (t === '[' && e.hasAttribute(s.substr(1, s.length - 1))) q = 1;
            if (e.tagName.toLowerCase() === s) q = 1;
        }
        l.push(e);
    }
    return (!l.length || (l.reverse()[0].tagName == 'HTML' && s)) ? null : l;
};

Element.prototype.parent = function(s) {
    var list = this.parents(s);
    if (typeof s == "undefined") list.reverse();
    return (list && list.length) ? list[0] : null;
};

Element.prototype.prependChild = function(s) {
    this.insertBefore(s, this.firstChild);
};

Element.prototype.after = function(s) {
    this.parentNode.insertBefore(s, this.nextSibling);
};

Element.prototype.before = function(s) {
    this.parentNode.insertBefore(s, this);
};

Element.prototype.prevAll = function(s) {
    var element = this;
    var previous = [];

    while(element = element.previousElementSibling) {
        if(element.previousElementSibling && element.previousElementSibling.tagName === s.toUpperCase())
            previous.push(element.previousElementSibling);
    }

    return previous;
};

Element.prototype.outerHeight = function() {
    var height, margin;

    height = this.clientHeight;
    margin = parseInt(getComputedStyle(this).marginTop, 10) + parseInt(getComputedStyle(this).marginBottom, 10);

    return (height + margin);
}