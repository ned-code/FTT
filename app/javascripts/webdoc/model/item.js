
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
  
  refresh: function($super, json) {
    var refreshInnerHtml = false;
    var refreshPreferences = false;
    this.widget = null;
    if (this.data && this.data.data && json.item.data.innerHTML != this.data.data.innerHTML) {
      refreshInnerHtml = true;
    }
    if (this.data.data != null && this.data.data.preference != null && json.item.data.preference != null && $.toJSON(this.data.data.preference) != $.toJSON(json.item.data.preference)) {
      refreshPreferences = true;
    }
    $super(json);
    if (refreshInnerHtml) {
      this.fireDomNodeChanged();
    }
    if (this.type() == WebDoc.ITEM_TYPE_WIDGET) {
      if (this.data.media_id != null) {
        MTools.ServerManager.getRecords(WebDoc.Widget, this.data.media_id, function(data) {
          if (data.length > 0) {
            this.widget = data[0];
          }
        }.pBind(this));
      }
      this.fireWidgetChanged();
    }    
  },
  
  fireWidgetChanged: function() {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].widgetChanged) {
        this.listeners[i].widgetChanged();
      }
    }     
  },
  
  setPoints: function(points) {
    this.data.data.points = points;
    this.fireObjectChanged();
  },
  
  type: function() {
    if (this.data.media_type) { 
      return this.data.media_type;
    }
    return "object";
  },
  
  property: function(key) {
    if (this.data.data.properties) {
      return this.data.data.properties[key];
    }
    return null;
  },
  
  setProperty: function(key, value) {
    if (!this.data.data.properties) {
      this.data.data.properties = {};
    }
    this.data.data.properties[key] = value;
    this.fireObjectChanged();
  },
  
  recomputeInternalSizeAndPosition: function() {
    try {
      var t = this.data.data.css.top || "0px", l = this.data.data.css.left || "0px", w = this.data.data.css.width || "100px", h = this.data.data.css.height || "100px";
      this.position = {
        top: parseFloat(t.replace("px", "")),
        left: parseFloat(l.replace("px", ""))
      };
      this.size = {
        width: parseFloat(w.replace("px", "")),
        height: parseFloat(h.replace("px", ""))
      };
      WebDoc.application.inspectorController.refreshSubInspectors();
    }
    catch (e) {
      ddd("error while loading item", this);
    }    
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
  
  setInnerHtml: function(html, force) {
    if (html != this.data.data.innerHTML || force) {
      this.data.data.innerHTML = html;      
      if (!this.property("noIframe") && (html.indexOf("<script") != -1 || html.match(/<html>(.|\n)*<\/html>/gi))) {
        ddd("replace tag");
        this.data.data.tag = "iframe";
        this.data.data.src = this.rootUrl() + "/items/" + this.uuid() + "?fullHTML=true";
        this.save();
        this.fireDomNodeChanged();
      }
      else {
        if (this.data.data.tag == "iframe") {
          this.data.data.tag = "div";
          delete this.data.data.src;
          this.save();
          this.fireDomNodeChanged();
        }
        else {
          this.save();
          this.fireInnerHtmlChanged();
        }
      }

    }
  },
  
  fireObjectChanged: function($super) {
    this.recomputeInternalSizeAndPosition();
    $super();
  },
  
  fireInnerHtmlChanged: function() {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].innerHtmlChanged) {
        this.listeners[i].innerHtmlChanged();
      }
    }
  },
  
  fireDomNodeChanged: function() {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].domNodeChangedChanged) {
        this.listeners[i].domNodeChangedChanged();
      }
    }    
  },
  
  copy: function($super) {
    newItem = $super();
    newItem.data.data = $.evalJSON($.toJSON(this.data.data));
    newItem.data.media_type = this.data.media_type;
    return newItem;
  },
  
  rootUrlArgs: function() {
    return { 
      document_id: WebDoc.application.pageEditor.currentDocument.uuid(),
      page_id: this.data.page_id 
      };  
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
    if (result) {return result;}
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

$.extend(WebDoc.Item, {
  className: function() {
    return "item";
  },
  
  rootUrl: function(args) {
    return "/documents/" + args.document_id + "/pages/" + args.page_id;
  }
});