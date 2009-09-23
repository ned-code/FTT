/** 
 * Prototype's bindAsEventListener port
**/

$.extend(MTools, {
  update: function(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }
});

$.extend(Function.prototype, {
 bindAsEventListener: function(context) {
   var __method = this, args = Array.prototype.slice.call(arguments, 1);
   return function(event) {
     var a = MTools.update([event || window.event], args);
     return __method.apply(context, a);
   }
 }
});
