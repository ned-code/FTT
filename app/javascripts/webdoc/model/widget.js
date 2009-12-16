
//= require <mtools/record>

WebDoc.Widget = $.klass(MTools.Record, {
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
  }    
});
