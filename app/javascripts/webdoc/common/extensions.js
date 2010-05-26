/** 
 * Some js extensions
**/

// typeOf function that distinguishes Objects from Arrays
// http://javascript.crockford.com/remedial.html

function typeOf(value) {
	var s = typeof value;
	if (s === 'object') {
		if (value) {
			if (value instanceof Array) {
				s = 'array';
			}
		} else {
			s = 'null';
		}
	}
	return s;
}

$.extend(WebDoc, {
  update: function(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) { array[arrayLength + length] = args[length];}
    return array;
  },
  merge: function(array, args) {
    array = Array.prototype.slice.call(array, 0);
    return WebDoc.update(array, args);
  }
});

/**
 * Prototype's bind and bindAsEventListener ports
**/

$.extend(Function.prototype, {
  pBindAsEventListener: function(context) {
    var __method = this, args = Array.prototype.slice.call(arguments, 1);
    return function(event) {
      var a = WebDoc.update([event || window.event], args);
      return __method.apply(context, a);
    };
  },
  pBind: function(context) {
    if (arguments.length < 2 && typeof arguments[0] === "undefined") {return this;}
    var __method = this, args = Array.prototype.slice.call(arguments, 1);
    return function() {
      var a = WebDoc.merge(args, arguments);
      return __method.apply(context, a);
    };
  }
});