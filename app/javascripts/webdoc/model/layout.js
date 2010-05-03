
WebDoc.Layout = $.klass(WebDoc.Record, {
  initialize: function($super, json, theme) {
    this.theme = theme;
    $super(json);
  },
  
  getTheme: function() {
    return this.theme;
  },
  
  getName: function() {
    return this.data.name;
  },

  getThumbnailUrl: function() {
    return this.data.thumbnail_url;
  }
  
});

$.extend(WebDoc.Layout, {
  
  className: function() {
    return "layout";
  },
  
  rootUrl: function(args) {
    return "";
  },
  pluralizedClassName: function() {
    return "layouts";
  }
});