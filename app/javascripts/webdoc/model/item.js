
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
  
  recomputeInternalSizeAndPosition: function() {
    var t = this.data.data.css.top || "0px",
        l = this.data.data.css.left || "0px",
        w = this.data.data.css.width || "100px",
        h = this.data.data.css.height || "100px";
    this.position = {
      top: parseFloat(t.replace("px", "")),
      left: parseFloat(l.replace("px", ""))
    };
    this.size = {
      width: parseFloat(w.replace("px", "")),
      height: parseFloat(h.replace("px", ""))
    };
    WebDoc.application.inspectorController.refreshProperties();    
  },
  
  moveTo: function(newPosition) {
    this.data.data.css.left = newPosition.left + "px";
    this.data.data.css.top = newPosition.top + "px";
    this.fireObjectChanged();
  },
  
  resizeTo: function(newSize) {
    this.data.data.css.width = newSize.width + "px";
    this.data.data.css.height = newSize.height + "px";
    this.fireObjectChanged();    
  },
  
  setInnerHtml: function(html) {
    if (html != this.data.data.innerHTML) {
      this.data.data.innerHTML = html;
      this.save();
      if (html.indexOf("<script") != -1) {
        ddd("replace tag");
        this.data.data.tag = "iframe";
        this.data.data.src = this.rootUrl() + "/items/" + this.uuid() + "?fullHTML=true";
        this.fireDomNodeChanged();
      }
      else {
        this.fireInnerHtmlChanged();
      }

    }
  },
  
  fireObjectChanged: function($super) {
    this.recomputeInternalSizeAndPosition();
    $super();
  },
  
  fireInnerHtmlChanged: function() {
    if (this.listener) {
      this.listener.innerHtmlChanged();
    }
  },
  
  fireDomNodeChanged: function() {
    if (this.listener) {
      this.listener.domNodeChangedChanged();
    }
  },
  
  /*
   * uniboard API for widget
   */
  
  resize: function(width, height) {
      this.resizeContainer(width, height);
  },
  
  resizeContainer: function(width, height) {
    this.data.data.css.width = width + "px";
    this.data.data.css.height = height + "px";
    ddd("resize container to " + this.data.data.css.width + ":"  + this.data.data.css.height);
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
  
  setPenColor: function(color) {
    WebDoc.application.drawingTool.penColor = color;   
  }
});
