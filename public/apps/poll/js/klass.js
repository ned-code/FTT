// klass.js
//
// Class inheritance from the prototype library.
// Based on Alex Arnell's inheritance implementation.
//
// Original code from prototype.js at the bottom, for reference, because we got
// this second-hand, from the invalid, unfinished low-pro 'library'.
//
// ******* TODO: There is no reason to make this a jQuery extension - it has nothing to
// do with the DOM. Perhaps we could make it a part of WebDoc object, or even its
// own global object.


(function($) {
  
  function keys(obj) {
    var keysArray = [];
    for (var key in obj) {
      keysArray.push(key);
    }
    return keysArray;
  }
  
  function argumentNames(func) {
    var names = func.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(/, ?/);
    return names.length == 1 && !names[0] ? [] : names;
  }
  
  function bind(func, scope) {
    return function() {
      return func.apply(scope, $.makeArray(arguments));
    };
  }
  
  function wrap(func, wrapper) {
    var __method = func;
    return function() {
      return wrapper.apply(this, [bind(__method, this)].concat($.makeArray(arguments)));
    };
  }

  function subclass() {}

  function addMethods(source) {
    var ancestor   = this.superclass && this.superclass.prototype;
    var properties = keys(source);

    if (!keys({ toString: true }).length) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i], value = source[property];
      if (ancestor && $.isFunction(value) &&
          argumentNames(value)[0] == "$super") {
        
        var method = value;

        value = $.extend(wrap((function(m) {
          return function() { return ancestor[m].apply(this, arguments); };
        })(property), method), {
          valueOf:  function() { return method; },
          toString: function() { return method.toString(); }
        });
      }
      this.prototype[property] = value;
    }

    return this;
  }

  $.extend({
    klass: function() {
      var parent = null, properties = $.makeArray(arguments);
      if ($.isFunction(properties[0])) parent = properties.shift();

      var klass = function() {
        this.initialize.apply(this, arguments);
      };

      klass.superclass = parent;
      klass.subclasses = [];
      klass.addMethods = addMethods;

      if (parent) {
        subclass.prototype = parent.prototype;
        klass.prototype = new subclass();
        parent.subclasses.push(klass);
      }

      for (var i = 0; i < properties.length; i++)
        klass.addMethods(properties[i]);

      if (!klass.prototype.initialize)
        klass.prototype.initialize = function() {};

      klass.prototype.constructor = klass;

      return klass;
    }
  });

})(jQuery);




// ===================
// = Prototype ports =
// ===================

var MTools = {};

$.extend(MTools, {
  update: function(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) { array[arrayLength + length] = args[length];}
    return array;
  },
  merge: function(array, args) {
    array = Array.prototype.slice.call(array, 0);
    return MTools.update(array, args);
  }
});

$.extend(Function.prototype, {
  pBind: function(context) {
    if (arguments.length < 2 && typeof arguments[0] === "undefined") {return this;}
    var __method = this, args = Array.prototype.slice.call(arguments, 1);
    return function() {
      var a = MTools.merge(args, arguments);
      return __method.apply(context, a);
    };
  }
});
