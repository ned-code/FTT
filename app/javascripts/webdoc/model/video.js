
//= require <mtools/record>

WebDoc.Video = $.klass(MTools.Record, {
  initialize: function($super, json) {
    $super(json);
  }
});

$.extend(WebDoc.Video, {
  
  className: function() {
    return "video";
  },
  
  rootUrl: function(args) {
    return "";
  },
  classNameHttpPost: function() {
    return this.className() + "s";
  } 
});