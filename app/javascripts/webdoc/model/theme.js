
WebDoc.Theme = $.klass(WebDoc.Record, {
  
  initialize: function($super, json) {
    this.hasMany = { 
      layouts: WebDoc.Layout 
    };
    this.layouts = [];
    $super(json);
  },
  
  getTitle: function() {
    return this.data.title;
  },
  
  getStyleUrl: function() {
    return this.data.style_url;
  },
  
  getThumbnailUrl: function() {
    return this.data.thumbnail_url;
  },

  getElementsUrl: function() {
    return this.data.elements_url;
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