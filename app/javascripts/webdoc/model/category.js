
//= require <mtools/record>

WebDoc.Category = $.klass(MTools.Record, {
  initialize: function($super, json) {
    $super(json);
  }
});

$.extend(WebDoc.Category, {
  
  className: function() {
    return "category";
  },
  
  rootUrl: function(args) {
    return "";
  },
  pluralizedClassName: function() {
    return "categories";
  }
});