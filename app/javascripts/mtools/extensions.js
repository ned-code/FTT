/** 
 * Some js or jquery extension that are missing in js or jquery
**/

/**
 * Prototype's bind and bindAsEventListener ports
**/
$.extend(MTools, {
  update: function(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  },
  merge: function(array, args) {
    array = Array.prototype.slice.call(array, 0);
    return MTools.update(array, args);
  },
  isUndefined: function(object) {
    return typeof object === "undefined";
  }
});

$.extend(Function.prototype, {
  pBindAsEventListener: function(context) {
    var __method = this, args = Array.prototype.slice.call(arguments, 1);
    return function(event) {
      var a = MTools.update([event || window.event], args);
      return __method.apply(context, a);
    }
  },
  pBind: function(context) {
    if (arguments.length < 2 && MTools.isUndefined(arguments[0])) return this;
    var __method = this, args = Array.prototype.slice.call(arguments, 1);
    return function() {
      var a = MTools.merge(args, arguments);
      return __method.apply(context, a);
    }
  }
});


/**!
 * unwrap - v0.1 - 7/18/2009
 * http://benalman.com/projects/jquery-unwrap-plugin/
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Licensed under the MIT license
 * http://benalman.com/about/license/
 **/

(function($) {
  '$:nomunge'; // Used by YUI compressor.
  $.fn.unwrap = function() {
    this.parent(':not(body)')
      .each(function(){
        $(this).replaceWith( this.childNodes );
      });
    
    return this;
  };
})(jQuery);