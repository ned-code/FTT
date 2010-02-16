
//= require <mtools/record>

WebDoc.Image = $.klass(MTools.Record, {
  initialize: function($super, json) {
    $super(json);
  }
});

$.extend(WebDoc.Image, {
  
  className: function() {
    return "image";
  },
  
  rootUrl: function(args) {
    return "";
  },
  classNameHttpPost: function() {
    return this.className() + "s";
  }    
});