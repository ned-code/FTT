
WebDoc.ITEM_TYPE_TEXT    = "text";
WebDoc.ITEM_TYPE_IMAGE   = "image";
WebDoc.ITEM_TYPE_DRAWING = "drawing";
WebDoc.ITEM_TYPE_WIDGET  = "widget";
WebDoc.ITEM_TYPE_IFRAME  = "iframe";
WebDoc.ITEM_TYPE_APP     = "app";
WebDoc.ITEM_TYPE_HTML    = "html";

WebDoc.Item = $.klass(WebDoc.Record, 
{
  CLASS_TYPE_BACKGROUND: 'background',
  CLASS_TYPE_BORDER: 'border',
  CLASS_TYPE_COLOR: 'color',
  CLASS_TYPE_FONT: 'font',
  CLASS_TYPE_OTHER: 'other',


  initialize: function($super, json, page, media) {
    this.page = page;
    this.media = media;

    this._classes = new Array();
    this._classes[this.CLASS_TYPE_BACKGROUND] = '';
    this._classes[this.CLASS_TYPE_BORDER]     = '';
    this._classes[this.CLASS_TYPE_COLOR]      = '';
    this._classes[this.CLASS_TYPE_FONT]       = '';
    this._classes[this.CLASS_TYPE_OTHER]      = '';

    this._isPlaceholder = false;

    $super(json);
    if (!json) {
      this.data.data = {};
    }    
    if (!this.data.preferences || this.data.preferences == 'null') {
      this.data.preferences = {};
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

      if(this.getClassThemeTypeAllowed().indexOf(scope) !== null) {
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
      this.data.data['class'] = this.getClass();
      this.fireObjectChanged({ modifedAttribute: 'class' });
      
      if((save === undefined || save === true ) && needSave) {
        this.save();
      }
    }
  },

  clearClass: function(scope) {
    if(this.getClassThemeTypeAllowed().indexOf(scope) !== null) {
      if(this._classes[scope]) {
        this._classes[scope] = '';
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

  getClassThemeTypeAllowed: function() {
    return [
            this.CLASS_TYPE_BACKGROUND,
            this.CLASS_TYPE_BORDER,
            this.CLASS_TYPE_COLOR,
            this.CLASS_TYPE_FONT
    ];
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
    this._classes = {};
    if(classes.length > 0) {
      for(var aClassIndex in classes) {
        var aClass = classes[aClassIndex]; 
        if(aClass) {
          var scope = this._getClassType(aClass);
          if (!this._classes[scope]) {
            this._classes[scope] = aClass;
          }
          else {
            this._classes[scope] += " " + aClass;
          }
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

  setStyle: function(newStyle, scope){
    if(scope){
      if(jQuery.inArray(scope, this.page.CSS_AUTHORIZED_SCOPE) >= 0){
        if(!this.getStyle()){
          jQuery.extend(this.data.data, { style : {}});
        }
        
        if(scope == 'background'){ //don't set a background if there is a border with image
          if(this.data.data.style['border']){
            if(this.data.data.style['border'].match('border-image')){
              return;
            }
          }
        }
        
        var previousStyle = jQuery.extend({}, this.getStyle());
        var that = this;
        WebDoc.application.undoManager.registerUndo(function() {
          that.setStyle( previousStyle );
        });
        if(scope == 'border'){ //be sure to remove the background if there is a baground image in the border
          if( newStyle.match('border-image')) {
            this.removeBackground();
          }
        }
        this.data.data.style[scope] = newStyle;
        this.save();
        this.fireObjectChanged({ modifedAttribute: 'css' });
      }
    }
    else{
      if(!this.getStyle()){
        jQuery.extend(this.data.data, { style : {}});
      }
      var previousStyle = jQuery.extend({}, this.getStyle());
      var that = this;
      WebDoc.application.undoManager.registerUndo(function() {
        that.setStyle( previousStyle );
      });
      
      this.data.data.style = newStyle;
      this.save();
      this.fireObjectChanged({ modifedAttribute: 'css' });
    }
  },
  
  getStyle: function(){
    return this.data.data.style;
  },
  
  hasStyle: function(){
    if(this.data.data.style){ return true; }
    else { return false; }
  },
  
  getStyleString: function(){
    var styleHash = this.getStyle();
    var cssString = '';
    
    if(styleHash){
      for(i=0; i < this.page.CSS_AUTHORIZED_SCOPE.length; i++){
        if(styleHash[this.page.CSS_AUTHORIZED_SCOPE[i]]){
          ddd(this.page.CSS_AUTHORIZED_SCOPE[i]);
          cssString += styleHash[this.page.CSS_AUTHORIZED_SCOPE[i]];
        }
      }
    }
    return cssString;
  },
  
  getStylePropertyByScopeAndPropertyName: function(scope, property_name){
    var styleHash = this.getStyle();
    var propertyArray;
    if(styleHash && styleHash[scope]){
      var styleArray = styleHash[scope].split(';');
      for(i=0;i<styleArray.length;i++){
        propertyArray = styleArray[i].split(':');
        if(propertyArray[0] == property_name){
           return propertyArray[1];
        }
      }
    }
    return '';
  },
  
  setStylePropertyByScopeAndProperty: function(scope, property_name, property_value){
    var styleHash = this.getStyle();
    var propertyArray;
    var property = property_name + ':' + property_value + ';';
    
    if(styleHash && styleHash[scope]){
      var styleString = '';
      var styleArray = styleHash[scope].split(';');
      for(i=0;i<styleArray.length;i++){
        propertyArray = styleArray[i].split(':');
        if(styleArray[i] !== ''){
          if(propertyArray[0] == property_name){
            styleString += property;
          }
          else{
            styleString += propertyArray[0] + ':' + propertyArray[1] +';';
          }
          styleHash[scope] = styleString;
        }
      }
    }
    else if(styleHash){
      styleHash[scope] = property;
    }
    else{
      jQuery.extend(this.data.data, { style : {}});
      this.data.data.style[scope] = property;
    }
    this.save();
    this.fireObjectChanged({ modifedAttribute: 'css' });
  },
  
  setStyleBorderRadius: function(radius){
    this.setStylePropertyByScopeAndProperty('border', '-webkit-border-radius', radius);
    this.setStylePropertyByScopeAndProperty('border', '-moz-border-radius', radius);
    this.setStylePropertyByScopeAndProperty('border', 'border-radius', radius);
  },
  
  hasBackground: function(){
    if(this.hasStyle() && this.getStyle()['background']){ return true; }
    else{ return false; }
  },
  
  removeBackground: function(){
    if(this.hasBackground()){
      this.getStyle()['background'] = '';
      this.save();
      this.fireObjectChanged({ modifedAttribute: 'css' });
    }
  },
  
  //set the font to the item, css string contain the inline css.
  setFont: function(cssString, font_face_string){
    if(!this.hasStyle()){
      jQuery.extend(this.data.data, { style : {}});
    }
    this.data.data.style.font = cssString;
    this.data.data.style.font_face = font_face_string;
    this.save();
    this.fireObjectChanged({ modifedAttribute: 'css' });
  },
  
  hasFontFace: function(){
    return (this.hasStyle() && this.data.data.style.font_face);
  },
  
  getFontFace: function(){
    if(this.hasFontFace()){ return this.data.data.style.font_face ; }
    else{ return ''; }
  },
  
  getIsPlaceholder: function() {
    if(this._isPlaceholder === true) {
      return true;
    }
    else {
      return false;
    }
  },

  // save optional, saved by default
  setIsPlaceholder: function(isPlaceholder, save) {
    //ddd('[item] set is placeholder with ' + isPlaceholder);
    if(isPlaceholder === true || isPlaceholder === 'true'){
      this._isPlaceholder = true;
    }
    else {
      this._isPlaceholder = false;
    }

    if(save === undefined || save === true) {
      this.data.data.is_placeholder = this.getIsPlaceholder();
      this.save();
    }
  },

  replacePlaceholder: function(type, options) {
    if(options === undefined) {
      options = {};
    }
    if(type === WebDoc.ITEM_TYPE_IMAGE && options.imageUrl) {
      var oldSource = this.data.data.src;
      this.data.data.src = options['imageUrl'];
      this.preLoadImageWithCallback(function(event){
        this.setRatio(this.calcRatio(event));
        this.save(function() {
          this.fireDomNodeChanged();
          this.fireObjectChanged({ modifedAttribute: 'zoom' });
          WebDoc.application.undoManager.registerUndo(function() {
            this.replacePlaceholder(WebDoc.ITEM_TYPE_IMAGE, { imageUrl: oldSource });
          }.pBind(this));
        }.pBind(this));
      }.pBind(this));
    }
  },
  
  positionZ: function() {
    return this.data.position;
  },
  
  setPositionZ: function(newPosition) {
    this.data.position = newPosition;
    this.page._itemZMoved(this);
  },
  
  refresh: function($super, json, onlyMissingValues) {
    var refreshInnerHtml = false;
    var refreshPreferences = false;
    var refreshPositionZ = false;
    
    if (this.data && this.data.position && json.item.position != this.data.position) {
      refreshPositionZ = true;
    }
    if (json.item.inner_html === 'null') {
      json.item.inner_html = null;
    }
    if (this.data && json.item.inner_html != this.data.inner_html) {
      refreshInnerHtml = true;
    }
    if (this.data.preferences && json.item.preferences && $.toJSON(this.data.preferences) != $.toJSON(json.item.preferences)) {
      refreshPreferences = true;
    }
    
    $super(json, onlyMissingValues);

    //TODO JBA Hack because sometime innerHtml is null but it comes a null string in database.
    if (this.data.inner_html && this.data.inner_html === 'null') {
      this.data.inner_html = null;
    }
    this.setIsPlaceholder(this.data.data.is_placeholder, false); 

    this._refreshClasses();

    if (refreshInnerHtml) {
      this.fireDomNodeChanged();
    }
    
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
    if (this.data.properties) {
      return this.data.properties[key];
    }
    return null;
  },
  
  // TMP hack
  property: function(key) {
    if (this.data.properties) {
      return this.data.properties[key];
    }
    return null;
  },
  
  setProperty: function(key, value) {
    if (!this.data.properties) {
      this.data.properties = {};
    }
    this.data.properties[key] = value;
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
  
  setInnerHtml: function(html, force, skipSave) {
    if (html != this.data.inner_html || force) {
	    // Force to wmode transparent if necessary
      this.data.inner_html = this.checkForceWMode(html);      
      if (html.indexOf("<script") != -1 || html.match(/<html>(.|\n)*<\/html>/gi)) {
        ddd("replace tag");
        this.data.data.tag = "iframe";
        this.data.data.src = this.rootUrl() + "/items/" + this.uuid() + "?fullHTML=true";
        this.save();
        this.fireDomNodeChanged();
      }
      else {
        if (this.data.data.tag === "iframe") {
          this.data.data.tag = "div";
          delete this.data.data.src;
          this.fireDomNodeChanged();
        }
        else {
          this.fireInnerHtmlChanged();
        }
        if (!skipSave) {
          this.save();
        }
      }

    }
  },

  getInnerHtml: function() {
    if (this.data.inner_html && this.data.inner_html === 'null') {
      return null
    }
    return this.data.inner_html;
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
    newItem.data.properties = $.evalJSON($.toJSON(this.data.properties));
    newItem.data.preferences = $.evalJSON($.toJSON(this.data.preferences));
    newItem.data.media_type = this.data.media_type;
    newItem.data.media_id = this.data.media_id;
    newItem.data.kind = this.data.kind;
    newItem.data.inner_html = this.data.inner_html;
		newItem.data.position = this.data.position;
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
    if (this.data.properties && this.data.properties.inspector_url) {
      return this.data.properties.inspector_url;
    }
    return null;      
  },
  
  /***************************************/
  /** text item                          */
  /***************************************/
 
  getInnerText: function() {
    return this._removeHtmlTags(this.data.inner_html);
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