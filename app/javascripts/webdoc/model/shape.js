
//= require <mtools/record>

WebDoc.Shape = $.klass(WebDoc.Record, {
  initialize: function($super, json) {
    $super(json);
  },

  getPath: function() {
    return this.data.path;
  },

  getStroke: function() {
    return this.data.stroke;
  },

  getFill: function() {
    return this.data.fill;
  },

  getStrokeWidth: function() {
    return this.data.strokeWidth;
  },

  getTextTopOffset: function() {
    return this.data.textTopOffset;
  },
  getTextLeftOffset: function() {
    return this.data.textLeftOffset;
  },
  getTextRightOffset: function() {
    return this.data.textRightOffset;
  },
  getTextBottomOffset: function() {
    return this.data.textBottomOffset;
  }
  
});

$.extend(WebDoc.Shape, {
  
  className: function() {
    return "shape";
  },
  
  rootUrl: function(args) {
    return "";
  },
  pluralizedClassName: function() {
    return "shapes";
  }
});