
//= require <mtools/record>

WebDoc.ITEM_TYPE_TEXT = "text";
WebDoc.ITEM_TYPE_IMAGE = "image";
WebDoc.ITEM_TYPE_DRAWING = "drawing";
WebDoc.ITEM_TYPE_WIDGET = "widget";

WebDoc.Item = $.klass(MTools.Record, 
{
  initialize: function($super, json, page, media) {
    this.page = page
    this.media = media;
    $super(json);
    if (!json) {
      this.data.data = { preference: {}};
    }
  },
  
  getPage: function() {
    return this.page;
  },
  
  setPage: function(page) {
    this.page = page;  
  },
  
  setPosition: function(newPosition) {
    this.data.position = newPosition;
    // position changed is not notified because it is always changed from the page. And this is that page that notifies
    // item position changed  
  },
  
  refresh: function($super, json) {
    var refreshInnerHtml = false;
    var refreshPreferences = false;

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
    
    // TODO: can remove this fecth. it ise used only for old item that were created before that inspector url is set in item properties.
    if (this.data.media_id && this.data.media_type == WebDoc.ITEM_TYPE_WIDGET) {
      MTools.ServerManager.getRecords(WebDoc.Widget, this.data.media_id, function(data) {
        if (data.length > 0) {
          this.media = data[0];
        }
      }.pBind(this));
    }
    // END of to do
    
    if (refreshPreferences) {
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

	setOpacity: function(newOpacity){
		if(parseFloat(newOpacity)){
			this.data.data.css.opacity = parseFloat(newOpacity);
			this.fireObjectChanged();
		}
	},
  
  setInnerHtml: function(html, force) {
    if (html != this.data.data.innerHTML || force) {
	    // Force to wmode transparent if necessary
      this.data.data.innerHTML = this.checkForceWMode(html);      
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

  getInnerHtml: function() {
    this.data.data.innerHTML;
  },

  getInnerText: function() {
    return this.removeHtmlTags(this.data.data.innerHTML);
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
    if (this.page) {
      return {
        document_id: WebDoc.application.pageEditor.currentDocument.uuid(),
        page_id: this.page.uuid()
      };
    }
    else {
      ddd("item without page !!!!!!!!!!!!!!!!");
      ddt();
      return {};
    }
  },

  removeHtmlTags: function(str) {
    var regExp = /<\/?[^>]+>/gi;
    str = str.replace(regExp,"");
    return str;
  },

  // If HTML code contains an embed tag of type Flash, will create or force the wmode property to transparent
  // so that Flash content will be viewable into WebDoc
  checkForceWMode: function(html) {
    var regexp = new RegExp("<embed[^>]*(/>|>(.*?)</embed>)");
      if(html.match(regexp)) {
        // Contains embed tag, must force its wmode attrib to transparent
        var match = regexp.exec(html);
        //ddd('Match:' + match[0]);
        var wrapper = $('<div>').append(match[0]);
        //ddd('Content wrapper:' + wrapper.html());
        var embedNode = $('embed', wrapper);
        if(embedNode.length > 0 && (embedNode.attr("type") == "application/x-shockwave-flash" || embedNode.attr("src").indexOf('.swf') != -1)) {
          $('embed', wrapper).attr("wmode", "transparent");
          //ddd('Must replace matched value with:' + wrapper.html());
          return html.replace(regexp, wrapper.html());
        }
      }
      return html;
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