
//= require <mtools/record>

WebDoc.Image = $.klass(WebDoc.Record, {
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
  pluralizedClassName: function() {
    return this.className() + "s";
  }    
});