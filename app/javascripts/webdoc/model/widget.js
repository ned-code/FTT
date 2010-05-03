
//= require <mtools/record>

WebDoc.Widget = $.klass(WebDoc.Record, {
  initialize: function($super, json) {
    $super(json);
  }  
});

$.extend(WebDoc.Widget, {
  className: function() {
    return "widget";
  },
  
  rootUrl: function(args) {
    return "";
  },   
  pluralizedClassName: function() {
    return this.className() + "s";
  } 
});
