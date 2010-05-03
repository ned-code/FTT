
WebDoc.Theme = $.klass(WebDoc.Record, {
  initialize: function($super, json) {
    this.layouts = [];
    $super(json);
  },
  
  refresh: function($super, json) {
    $super(json);
    var that = this;
    this.layouts = [];    
    if (this.data.layouts && $.isArray(this.data.layouts)) {
      for (var i = 0; i < this.data.layouts.length; i++) {
        var layoutData = this.data.layouts[i];
        this._createLayout({ layout: layoutData });
      }
    }   
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
  },
  
  _createLayout: function(layoutData) {
    var newLayout = new WebDoc.Layout(layoutData, this);
    this.layouts.push(newLayout);
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