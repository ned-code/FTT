
//= require <mtools/record>

WebDoc.ITEM_TYPE_TEXT = "text";
WebDoc.ITEM_TYPE_IMAGE = "image";
WebDoc.ITEM_TYPE_DRAWING = "drawing";
WebDoc.ITEM_TYPE_WIDGET = "widget";

WebDoc.Item = $.klass(MTools.Record, 
{
  initialize: function($super, json) {
    $super(json);
    if (!json) {
      this.data.data = { preference: {}};
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
  },
  
  setInnerHtml: function(html) {
    this.data.data.innerHTML = html;
    this.fireInnerHtmlChanged();
  },
  
  fireInnerHtmlChanged: function() {
    if (this.listener) {
      this.listener.innerHtmlChanged();
    }
  },
  
  /*
   * uniboard API for widget
   */
  
  resizeContainer: function(width, height) {
    this.data.data.css.width = width + "px";
    this.data.data.css.height = height + "px";
    this.fireObjectChanged();
  },
  
  preference: function(key, value) {
    var result = this.data.data.preference[key];
    if (result) return result;
    return value;
  },
  
  setPreference: function(key, value) {
    var previous = this.data.data.preference[key];
    if (previous != value) {
      this.data.data.preference[key] = value;
      ddd("save widget pref");
      this.save();
    }
  },
});
