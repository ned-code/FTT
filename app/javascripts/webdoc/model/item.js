
WebDoc.ITEM_TYPE_TEXT = "text";
WebDoc.ITEM_TYPE_IMAGE = "image";
WebDoc.ITEM_TYPE_DRAWING = "drawing";
WebDoc.ITEM_TYPE_WIDGET = "widget";
WebDoc.ITEM_TYPE_IFRAME = "iframe";
WebDoc.ITEM_TYPE_OS_GADGET = "os_gadget";
WebDoc.ITEM_TYPE_APP = "app";

WebDoc.Item = $.klass(WebDoc.Record, 
{
  initialize: function($super, json, page, media) {
    this.page = page;
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
  
  setClass: function(newClass) {
    if (newClass != this.data.data['class']) {
      this.data.data['class'] = newClass;
      this.fireObjectChanged({ modifedAttribute: 'class' });
      this.save();
    }
  },

  addCss: function(newCss) {
    if (newCss) {
      this.data.data.css = jQuery.extend( this.data.data.css, newCss );
      this.fireObjectChanged({ modifedAttribute: 'css' });
      this.save();
    }
  },
  
  positionZ: function() {
    return this.data.position;  
  },
  
  setPositionZ: function(newPosition) {
    this.data.position = newPosition;
    this.page._itemZMoved(this);
  },
  
  refresh: function($super, json) {
    var refreshInnerHtml = false;
    var refreshPreferences = false;
    var refreshPositionZ = false;

    if (this.data && this.data.position && json.item.position != this.data.position) {
      refreshPositionZ = true;
    }
    if (this.data && this.data.data && json.item.data.innerHTML != this.data.data.innerHTML) {
      refreshInnerHtml = true;
    }
    if (this.data.data && this.data.data.preference && json.item.data.preference && $.toJSON(this.data.data.preference) != $.toJSON(json.item.data.preference)) {
      refreshPreferences = true;
    }
    
    $super(json);
    if (refreshInnerHtml) {
      this.fireDomNodeChanged();
    }
    
    // TODO: can remove this fecth. it ise used only for old item that were created before that inspector url is set in item properties.
//    if (this.data.media_id && this.data.media_type == WebDoc.ITEM_TYPE_WIDGET) {
//      WebDoc.ServerManager.getRecords(WebDoc.Widget, this.data.media_id, function(data) {
//        if (data.length > 0) {
//          this.media = data[0];
//        }
//      }.pBind(this));
//    }
    // END of to do
    
    if (refreshPreferences) {
      this.fireWidgetChanged();
    }
    if (refreshPositionZ) {
      this.page._itemZMoved(this);      
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
    this.fireObjectChanged({ modifedAttribute: 'points' });
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
    this.fireObjectChanged({ modifedAttribute: 'properties' });
  },
  
  top: function() {
    return this.data.data.css.top;
  },
  left: function() {
    return this.data.data.css.left;
  },
//  bottom: function() {
//    return this.data.data.css.bottom;
//  },
//  right: function() {
//    return this.data.data.css.right;
//  },
  width: function(unit) {
    if (!unit || unit !== "px") {
      return this.data.data.css.width.toString();
    }
    else {
      return parseFloat(this.data.data.css.width);
    }
  },
  height: function(unit) {
    if (!unit || unit !== "px") {
      return this.data.data.css.height.toString();
    }
    else {
      return parseFloat(this.data.data.css.height);
    }
  },
  
  shiftBy: function(offsetPosition) {
    var newTop = (parseFloat(this.data.data.css.top) + offsetPosition.top) + "px";
    var newLeft = (parseFloat(this.data.data.css.left) + offsetPosition.left) + "px";
    this.moveTo({ top: newTop, left: newLeft});
  },
  
  moveTo: function(newPosition) {
    if (newPosition.left && !jQuery.string(newPosition.left).empty()) {
      this.data.data.css.left = newPosition.left;
    }
    else {
      delete this.data.data.css.left;
    }
    if (newPosition.top && !jQuery.string(newPosition.top).empty()) {
      this.data.data.css.top = newPosition.top;
    }
    else {
      delete this.data.data.css.top;
    }
    this.fireObjectChanged({ modifedAttribute: 'css' });
    WebDoc.application.inspectorController.refreshSubInspectors();    
  },
  
  resizeTo: function(newSize) {    
    if (newSize.width && !jQuery.string(newSize.width).empty()) {
      this.data.data.css.width = newSize.width;
    }
    else {
      delete this.data.data.css.width;
    }
    if (newSize.height && !jQuery.string(newSize.height).empty()) {
      this.data.data.css.height = newSize.height;
    }
    else {
      delete this.data.data.css.height;
    }    
    
    this.fireObjectChanged({ modifedAttribute: 'css' });
    WebDoc.application.inspectorController.refreshSubInspectors();
  },
  
  changeThemeBgClass: function( currentClass ) {
    var regex = /theme_background_[0-9]+/,
        data = this.data.data;
    
    // Get rid of any theme_background_ classes
    // and add currentClass
    data['class'] = data['class'].replace( regex, '' ) + ' ' + currentClass;
    
    this.save();
    this.fireObjectChanged({ modifedAttribute: 'class' });
  },
  
  changeCss: function( cssObj ) {
    var that = this,
        previousCss = jQuery.extend({}, this.data.data.css),
        property;
    
    WebDoc.application.undoManager.registerUndo(function() {
      that.changeCss( previousCss );
    });
    
    for ( property in cssObj ) {
      if ( cssObj[property] === '' ) {
        delete this.data.data.css[property];
      }
      else {
        this.data.data.css[property] = cssObj[property];
      }
    }
    
    this.save();
    this.fireObjectChanged({ modifedAttribute: 'css' });
    WebDoc.application.inspectorController.refreshSubInspectors();
  },

  setOpacity: function(newOpacity){
    this.data.data.css.opacity = parseFloat(newOpacity);
    this.fireObjectChanged({ modifedAttribute: 'css' });
  },

  getKind: function() {
    return this.data.kind;  
  },
  
  setInnerHtml: function(html, force) {
    if (html != this.data.data.innerHTML || force) {
	    // Force to wmode transparent if necessary
      this.data.data.innerHTML = this.checkForceWMode(html);      
      if (!(this.property("noIframe") === "true") && (html.indexOf("<script") != -1 || html.match(/<html>(.|\n)*<\/html>/gi))) {
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
    return this.data.data.innerHTML;
  },


  getInnerHtmlPlaceholder: function() {
    return this.data.data.innerHTMLPlaceholder;
  },
  
  setInnerHtmlPlaceholder: function(html) {
    this.data.data.innerHTMLPlaceholder = html;
  },
  
  getInnerText: function() {
    return this.removeHtmlTags(this.data.data.innerHTML);
  },

  setSrc: function(newSrc) {
    this.data.data.src = this._consolidateSrc(newSrc);
    this.save();
    this.fireDomNodeChanged();
    WebDoc.application.inspectorController.refreshSubInspectors();
  },

  getSrc: function() {
    return this.data.data.src;
  },
  
  getGadgetUrl: function() {
    return this.property("gadgetUrl");  
  },
  
  setGadgetUrl: function(url) {
    this.setProperty("gadgetUrl", url);
    this.fireDomNodeChanged();
  },
  
  fireObjectChanged: function($super) {
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
      if (this.listeners[i].domNodeChanged) {
        this.listeners[i].domNodeChanged();
      }
    }    
  },
  
  copy: function($super) {
    var newItem = $super();
    newItem.data.data = $.evalJSON($.toJSON(this.data.data));
    newItem.data.media_type = this.data.media_type;
    newItem.data.media_id = this.data.media_id;
    newItem.data.kind = this.data.kind;
    newItem.media = this.media;
    return newItem;
  },
  
  rootUrlArgs: function() {
    if (this.page) {
      return {
        document_id:this.page.document.uuid(),
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
    var regexp = new RegExp("<embed[^>]*(/>|>(.*?)</embed>)", "g");
      if(html.match(regexp)) {
        // Contains embed tag, must force its wmode attrib to transparent
        var arrMatch = regexp.exec(html);
        while(arrMatch) {
          var wrapper = $('<div>').append(arrMatch[0]);
          var embedNode = $('embed', wrapper);
          if(embedNode.length > 0 && (embedNode.attr("type") == "application/x-shockwave-flash" || embedNode.attr("src").indexOf('.swf') != -1)) {
            $('embed', wrapper).attr("wmode", "transparent");
            replacedValue = wrapper.html();
            // Since jQuery might remove the closing tag, check if is still present
            if(!this._endsWith(replacedValue, '</embed>') && !this._endsWith(replacedValue, '/>')) {
              replacedValue += "</embed>";
            }
            html = html.replace(arrMatch[0], replacedValue);
          }
          arrMatch = regexp.exec(html);
        }
      }
      return html;
  },

  _endsWith: function(s, pattern) {
    var d = s.length - pattern.length;
    return d >= 0 && s.lastIndexOf(pattern) === d;
  },
  
  _consolidateSrc: function(src) {
        
    var pattern_url = /[A-Za-z0-9\.-]{3,}\.[A-Za-z]+/;
    var pattern_has_protocole = /^(ftp|http|https):\/\/?(\w*)/;

    if (src.match(pattern_url)) {
      if (src.match(pattern_has_protocole)) {
        return src;
      }
      else {
        return "http://" + src;
      }

    }
    else {
      return "";
    }
  }
});

$.extend(WebDoc.Item, {
  className: function() {
    return "item";
  },
  
  rootUrl: function(args) {
    return "/documents/" + args.document_id + "/pages/" + args.page_id;
  },
  pluralizedClassName: function() {
    return this.className() + "s";
  } 
});