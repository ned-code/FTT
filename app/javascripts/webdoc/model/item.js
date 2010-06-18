
WebDoc.ITEM_TYPE_TEXT    = "text";
WebDoc.ITEM_TYPE_IMAGE   = "image";
WebDoc.ITEM_TYPE_DRAWING = "drawing";
WebDoc.ITEM_TYPE_WIDGET  = "widget";
WebDoc.ITEM_TYPE_IFRAME  = "iframe";
WebDoc.ITEM_TYPE_APP     = "app";
WebDoc.ITEM_TYPE_HTML    = "html";

WebDoc.Item = $.klass(WebDoc.Record, 
{
  initialize: function($super, json, page, media) {
    this.page = page;
    this.media = media;

    this._classes = new Array();
    this._classes['other'] = '';
    this._classes['background'] = '';
    this._classes['border'] = '';
    this._classes['color'] = '';
    this._classes['font'] = '';
    
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

  /***************************************/
  /** Classes                            */
  /***************************************/

  // scope is optional
  // save optional, saved by default  
  setClass: function(newClass, scope, save) {
    if(newClass) {
      var needSave = false;

      if(!scope) {
        scope = this._getClassType(newClass);  
      }

      if(['background', 'border', 'color', 'font'].indexOf(scope) !== null) {
        if(this._classes[scope] !== newClass) {
          this._classes[scope] = newClass;
          needSave = true;
        }
      }
      else {
        if(this._classes['other'] !== newClass) {
          this._classes['other'] = newClass;
          needSave = true;
        }
      }
      if((save === undefined || save === true ) && needSave) {
        this.data.data['class'] = this.getClass();
        this.fireObjectChanged({ modifedAttribute: 'class' });
        this.save();
      }
    }
  },

  // optional scope, if not: all classes returned
  getClass: function(scope) {
    if(!scope) {
      var classes = '';
      for (var i in this._classes) {
        classes += this._classes[i]+' ';
      }
      return classes;
    }
    else {
      return this._classes[scope] || '';
    }
  },

  _getClassesArrayFromData: function() {
    if(this.data.data && this.data.data['class']) {
      return this.data.data['class'].split(' ');
    }
    else {
      return new Array();
    }
  },

  _getClassType: function(className) {
    var type = 'other';
    if(className.match("^theme_background_.*")) {
      type = 'background';
    }
    else if(className.match("^theme_border_.*")) {
      type = 'border';
    }
    else if(className.match("^theme_color_.*")) {
      type = 'color';
    }
    else if(className.match("^theme_font_.*")) {
      type = 'font';
    }
    return type;
  },

  _refreshClasses: function() {
    var classes = this._getClassesArrayFromData();
    if(classes.length > 0) {
      for(var aClass in classes) {
        if(classes[aClass]) {
          this.setClass(classes[aClass], this._getClassType(classes[aClass]), false);
        }
      }
    }
  },

  addCss: function(newCss) {
    if (newCss) {
      this.data.data.css = jQuery.extend( this.data.data.css, newCss );
      this.fireObjectChanged({ modifedAttribute: 'css' });
      this.save();
    }
  },

  getIsPlaceholder: function() {
    ddd('[item] get is placeholder');
    var classesArray = this._getClassesArrayFromData();
    if(classesArray.length > 0  && jQuery.inArray("placeholder", classesArray) !== -1){
      return true;
    }
    else {
      return false;
    }
  },

  setIsPlaceholder: function(isPlaceholder) {
    ddd('[item] set is placeholder with ' + isPlaceholder);
    var classesArray = this._getClassesArrayFromData();
    if(isPlaceholder) {
      if(classesArray.length === 0 || jQuery.inArray("placeholder", classesArray) === -1){
        classesArray.push('placeholder');
        this.data.data['class'] = classesArray.join(" ");
        this.fireObjectChanged({ modifedAttribute: 'class' });
        this.save();
      }
    }
    else {
      if(classesArray.length > 0 && jQuery.inArray("placeholder", classesArray) !== -1){
        var index = jQuery.inArray("placeholder", classesArray);
        var part1 = classesArray.slice(0, index);
        var part2 = classesArray.slice(index+1, classesArray.length);
        classesArray = part1.concat(part2);
        this.data.data['class'] = classesArray.join(" ");
        this.fireObjectChanged({ modifedAttribute: 'class' });
        this.save();
      }
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
    
    this._refreshClasses();

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
  
  getProperty: function(key) {
    if (this.data.data.properties) {
      return this.data.data.properties[key];
    }
    return null;
  },
  
  // TMP hack
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
      if (this.data.data.css.width) {
        return this.data.data.css.width.toString();
      }
      else { return ""; }
    }
    else {
      return parseFloat(this.data.data.css.width);
    }
  },
  height: function(unit) {
    if (!unit || unit !== "px") {
      if (this.data.data.css.height) {
        return this.data.data.css.height.toString();
      }
      else {
        return "";
      }
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
    WebDoc.application.inspectorController.refresh();    
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
    WebDoc.application.inspectorController.refresh();
  },
  
  changeThemeBgClass: function( currentClass ) {
    var regex = /theme_background_[0-9]+/,
        data = this.data.data;
    
    // Get rid of any theme_background_ classes
    // and add currentClass
    if (!data['class']) {
      data['class'] = '';
    }
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
      // be sure the previousCss contains the new css attribute. If the attribute was not present
      // we put '' as previous attribute value. We do that so that undo can remove the new property
      if (previousCss[property] === undefined) {
        previousCss[property] = '';
      }
      if ( cssObj[property] === '' ) {
        delete this.data.data.css[property];
      }
      else {
        this.data.data.css[property] = cssObj[property];
      }
    }
    
    this.save();
    this.fireObjectChanged({ modifedAttribute: 'css' });
    WebDoc.application.inspectorController.refresh();
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

  /***************************************/
  /** widget item                        */
  /***************************************/
  getInspectorUrl: function() {
    if (this.data.data.properties && this.data.data.properties.inspector_url) {
      return this.data.data.properties.inspector_url;
    }
    return null;      
  },
  
  /***************************************/
  /** text item                          */
  /***************************************/
 
  getInnerText: function() {
    return this._removeHtmlTags(this.data.data.innerHTML);
  },
  
  _removeHtmlTags: function(str) {
    var regExp = /<\/?[^>]+>/gi;
    str = str.replace(regExp,"");
    return str;
  },

  /***************************************/
  /** html item (widget)                 */
  /***************************************/
 
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
  
  /***************************************/
  /** Open social item                   */
  /***************************************/
  getAppUrl: function() {
    return this.property("gadgetUrl");  
  },
  
  setAppUrl: function(url) {
    this.setProperty("gadgetUrl", url);
    this.fireDomNodeChanged();
  },

  /***************************************/
  /** Image item                         */
  /***************************************/
     
  getZoom: function(){
    return parseFloat(this.getProperty('zoom')) || 0;
  },
  
  getDisplacement: function(){
    var result = this.getProperty('displacement') || { top: 0, left: 0 };
    result.top = parseFloat(result.top);
    result.left = parseFloat(result.left);
    return result;
  },
  
  setSrc: function(newSrc) {
    this.data.data.src = newSrc;
    this.save();
    this.fireDomNodeChanged();
    WebDoc.application.inspectorController.refresh();
  },

  getSrc: function() {
    return this.data.data.src;
  },
    
  zoom: function(zoom){
    var previousZoom = this.getZoom();
    var diffZoom = zoom - previousZoom;
    this.setProperty('zoom', zoom);
    var newLeft = this.getDisplacement().left + diffZoom/2;
    var newTop = this.getDisplacement().top + diffZoom/2;    
    this.displace({ left: newLeft, top: newTop});
    this.fireObjectChanged({ modifedAttribute: 'zoom' });
    WebDoc.application.inspectorController.refresh();
  },
  
  displace: function(coords) {
    var previousDisplacment = this.getProperty('displacement');
    var zoom = this.getZoom();
    if (!previousDisplacment) {
      this.setProperty('displacement', {});
    }
    if (coords.left < 0) { coords.left = 0; }
    if (coords.top < 0) { coords.top = 0; }
    if (coords.left > zoom) { coords.left = zoom; }
    if (coords.top > zoom) { coords.top = zoom; }    
    
    jQuery.extend(this.getProperty('displacement'), coords);
    this.fireObjectChanged({ modifedAttribute: 'displacement' });
    WebDoc.application.inspectorController.refresh();
  },
  
  preLoadImageWithCallback: function(callback){
    ddd('[item] preload image with callback');
    var image = document.createElement('img');
    jQuery(image).bind("load", callback);
    image.src = this.data.data.src;
  },

  getRatio: function() {
    var ratioWidth  = 1;
    var ratioHeight = 1;

    if(this.getProperty('ratio')) {
      if(this.getProperty('ratio').width) {
        ratioWidth = parseFloat(this.getProperty('ratio').width);
      }

      if(this.getProperty('ratio').height) {
        ratioHeight = parseFloat(this.getProperty('ratio').height)
      }
    }

    return {
      width:  ratioWidth,
      height: ratioHeight
    }
  },

  setRatio: function(ratio) {
    ddd('[item] set ratio with: x '+ratio.width+'; y '+ratio.height);
    this.setProperty('ratio', { width: ratio.width, height: ratio.height });
  },

  calcRatio: function(event) {
    ddd('[item] calc ratio');
    var ratioWidth = 1,
        ratioHeight = 1,
        ratio = (event.currentTarget.height / event.currentTarget.width) / (this.height('px') / this.width('px'));

    if(ratio < 1) {
      ratioWidth = (event.currentTarget.width / event.currentTarget.height) / (this.width('px') / this.height('px'));
      ratioHeight = 1;
    }
    else {
      ratioWidth = 1;
      ratioHeight = ratio;
    }

    return { width: ratioWidth, height: ratioHeight };
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