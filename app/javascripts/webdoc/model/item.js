
//= require <mtools/record>

WebDoc.ITEM_TYPE_TEXT = "text";
WebDoc.ITEM_TYPE_IMAGE = "image";
WebDoc.ITEM_TYPE_DRAWING = "drawing";

WebDoc.Item = $.klass(MTools.Record, 
{
  initialize: function($super, json) {
    $super(json);
    if (!json) {
      this.data.data = {};
    }
  },
  
  className: function() {
    return "item";
  },
  
  rootUrl: function() {
    return "/documents/" + WebDoc.application.pageEditor.currentDocument.uuid() + "/pages/" + this.data.page_id;
  },
  
  refresh: function($super, json) {
    $super(json);
  },
  
  setPoints: function(points) {
    this.data.data.points = points;
    this.fireObjectChanged();
  },
  
  type: function() {
    if (this.data.media_type) 
      return this.data.media_type;
    return "object";
  },
  
  moveTo: function(newPosition) {
    this.data.data.css.left = this.position.left + "px";
    this.data.data.css.top = this.position.top + "px";
    this.fireObjectChanged();
  }
});
