
WebDoc.Theme = $.klass(WebDoc.Record, {
  
  initialize: function($super, json) {
    this.hasMany = { 
      layouts: WebDoc.Layout 
    };
    this.layouts = [];
    $super(json);
  },
  
  getName: function() {
    return this.data.name;
  },
  
  getStyleUrl: function() {
    return this.data.style_url;
  },
  
  getThumbnailUrl: function() {
    return this.data.thumbnail_url;
  },
  
  getLayouts: function() {
    return this.layouts;
  }
});

$.extend(WebDoc.Theme, {
  
  className: function() {
    return "theme";
  },
  
  rootUrl: function(args) {
    return "";
  },
  pluralizedClassName: function() {
    return "themes";
  }
});