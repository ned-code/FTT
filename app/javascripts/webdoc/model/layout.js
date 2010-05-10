
WebDoc.Layout = $.klass(WebDoc.Record, {
  
  initialize: function($super, json, theme) {
    this.belongsTo = {
      model_page: WebDoc.Page  
    };
    this.theme = theme;
    $super(json);
  },
  
  getTheme: function() {
    return this.theme;
  },
  
  getModelPage: function() {
    return this.model_page;  
  },
  
  getTitle: function() {
    return this.data.title;
  },
  
  getThumbnailUrl: function() {
    return this.data.thumbnail_url;
  },
  
  getKind: function() {
    return this.data.kind;
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