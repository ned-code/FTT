
//= require <mtools/record>

WebDoc.User = $.klass(MTools.Record, {
  initialize: function($super, json) {
    $super(json);
  }
});

$.extend(WebDoc.User, {
  
  className: function() {
    return "user";
  },
  
  rootUrl: function(args) {
    return "";
  },
  pluralizedClassName: function() {
    return this.className() + "s";
  }    
});