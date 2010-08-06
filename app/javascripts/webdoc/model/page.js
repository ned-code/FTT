
//= require <mtools/record>
//= require <webdoc/model/item>
//= require <webdoc/utils/inspector_fields_validator>

WebDoc.Page = $.klass(WebDoc.Record, 
{ 
  DEFAULT_PAGE_HEIGHT_PX: 600,
  DEFAULT_PAGE_WIDTH_PX: 800,

  CLASS_TYPE_BACKGROUND: 'background',
  CLASS_TYPE_BORDER: 'border',
  CLASS_TYPE_COLOR: 'color',
  CLASS_TYPE_FONT: 'font',
  CLASS_TYPE_OTHER: 'other',

	CSS_AUTHORIZED_SCOPE: [ "background", "border", "color", "font", "other"],
    
  initialize: function($super, json, document, externalPageUrl) {
    // initialize relationship before super.
    this.firstPosition = 0;
    this.lastPosition = 0;
    this.lastDrawingItemPosition = -1;
    this._layout = undefined;
    this.items = [];
    this._itemsToRemoveAfterSave = [];
    this.nonDrawingItems = [];

    this._classes = new Array();
    this._classes[this.CLASS_TYPE_BACKGROUND] = '';
    this._classes[this.CLASS_TYPE_BORDER] = '';
    this._classes[this.CLASS_TYPE_COLOR] = '';
    this._classes[this.CLASS_TYPE_FONT] = '';
    this._classes[this.CLASS_TYPE_OTHER] = '';
    
    if (document && document.className() === WebDoc.Document.className()) {
      this.document = document;
    }
    $super(json);
    if (externalPageUrl) {
      if (!this.data.data) {
        this.data.data = {};
      }
      this.data.data.externalPage = true;
      this.data.data.externalPageUrl = externalPageUrl;
    }
  },
  
  getDocument: function() {
    return this.document;  
  },
  
  setDocument: function(document) {
    this.document = document;
  },
    
  getLayoutkind: function() {
    if (this.data.layout_kind && this.data.layout_kind !== 'null') {
      return this.data.layout_kind;
    }
    return null;
  },
  
  getLayout: function(callBack) {
    if (this._layout !== undefined) {
      callBack.call(this, this._layout);
    }
    else {
      this.document.getTheme(function(theme) {
        if (theme && theme.length === 1) {
          var aTheme = theme[0];
          for (var i = aTheme.getLayouts().length - 1; i >= 0; i--) {
            var aLayout = aTheme.getLayouts()[i];
            if (aLayout.getKind() === this.getLayoutkind()) {
              this._layout = aLayout;
              break;
            }
          }
          callBack.call(this, this._layout);
        }
        else {
          callBack.call(this, null);
        }
      }.pBind(this));
    }
    return this._layout;
  },
  
  applyCss: function(newCss) {   
    if (newCss != this.data.data.css) {
      
      var oldCss = jQuery.extend({}, this.data.data.css);
      var that = this;
      WebDoc.application.undoManager.registerUndo(function() {
        that.applyCss(oldCss);
      }.pBind(this));
      
      this.data.data.css = newCss;
      this.fireObjectChanged({ modifedAttribute: 'css' });
      this.save();
    }
  },

  getTitle: function() {
    // TODO: returns the string 'undefined' when title is not set.
    // That's a bit silly.  Should return value undefined.
    return this.data.title;
  },

  setTitle: function(title) {
    if(this.data.title != title) {
      this.data.title = title;
      this.fireObjectChanged({ modifedAttribute: 'title' });
      this.save();
    }
  },

  getThumbnailUrl: function() {
    return this.data.thumbnail_url;
  },

  height: function(unit) {
    //if (!this.data.data.css.height) {
    //  // this should not happend but old pages are in this case
    //  this.data.data.css.height = "600px";
    //}  
    if (!unit || unit !== "px") {
      return this.data.data.css.height.toString();
    }
    else {
      var pageHeight = this.data.data.css.height;
      var result = parseFloat(pageHeight);
      if (pageHeight.match(/\%/)) {
        var documentHeight = this.document.data.size.height;
        if (documentHeight.match(/\%/)) {
          result = this.DEFAULT_PAGE_HEIGHT_PX * (result / 100);
        }
        else {
          result = parseFloat(documentHeight);
        }
      }
      return result;
    }
  },
    
  setHeight: function(height) {
    if(this.data.data.css.height != height) {
      var old_height = this.data.data.css.height;
      this.data.data.css.height = height;
      this.fireObjectChanged({ modifedAttribute: 'css.height' });
      this.save();
      WebDoc.application.undoManager.registerUndo(function() {
        this.setHeight(old_height);
      }.pBind(this));
    }
  },
  
  width: function(unit) {
    //if (!this.data.data.css.width) {
    //  // this should not happend but old pages are in this case
    //  this.data.data.css.width = "800px";
    //}  
    if (!unit || unit !== "px") {
      return this.data.data.css.width.toString();
    }
    else {
      var pageWidth = this.data.data.css.width;
      var result = parseFloat(pageWidth);
      if (pageWidth.match(/\%/)) {
        var documentWidth = this.document.data.size.width;
        if (documentWidth.match(/\%/)) {
          result = this.DEFAULT_PAGE_WIDTH_PX * (result / 100);
        }
        else {
          result = parseFloat(documentWidth);
        }
      }
      return result;      
    }
  },
  
  setWidth: function(width) {
    if(this.data.data.css.width != width) {
      var old_width = this.data.data.css.width;
      this.data.data.css.width = width;
      this.fireObjectChanged({ modifedAttribute: 'css.width' });
      this.save();
      WebDoc.application.undoManager.registerUndo(function() {
        this.setWidth(old_width);
      }.pBind(this));
    }
  },

  // by default saved, but if save is false the page isnt saved
  // oldSize is optional too
  setSize: function(size, save, oldSize) {
    if(oldSize === undefined) {
      oldSize = { width: this.width(), height: this.height() };
    }
    if(size && (oldSize.width !== size['width'] || oldSize.height !== size['height'])) {

      this.data.data.css.width = size['width'];
      this.data.data.css.height = size['height'];
      this.fireObjectChanged({ modifedAttribute: 'css.width css.height' });

      if(save === undefined || save === true) {
        this.save();
        WebDoc.application.undoManager.registerUndo(function() {
          this.setSize(oldSize);
        }.pBind(this));
      }
    }
  },

  setBackgroundColor: function(backgroundColor) {
    this.removeBackgroundGradient();
    this.data.data.css.backgroundColor = backgroundColor;
    this.fireObjectChanged({ modifedAttribute: 'css.backgroundColor' });
    this.save();
  },

  setBackgroundImage: function(backgroundUrl) {
    if(this.data.data.css.backgroundImage != backgroundUrl) {
      
      if(this.hasBackgroundGradient()){
        this.removeBackgroundGradient();
      }
      var old_background = this.data.data.css.backgroundImage;
      this.data.data.css.backgroundImage = backgroundUrl;  
      
      this.fireObjectChanged({ modifedAttribute: 'css.backgroundImage' });
      this.save();
      WebDoc.application.undoManager.registerUndo(function() {
        if(old_background === undefined) {
          old_background = "url('')";
        }
        this.setBackgroundImage(old_background);
      }.pBind(this));
    }
  },

  setBackgroundRepeatMode: function(repeatMode) {
    ddd('[Page] setBackgroundRepeatMode('+repeatMode+')');
    if(this.data.data.css.backgroundRepeat != repeatMode) {
      this.data.data.css.backgroundRepeat = repeatMode;
      this.fireObjectChanged({ modifedAttribute: 'css.backgroundRepeat' });
      this.save();
    }
  },

  setBackgroundPosition: function(position) {
    if(this.data.data.css.backgroundPosition != position) {
      this.data.data.css.backgroundPosition = position;
      this.fireObjectChanged({ modifedAttribute: 'css.backgroundPosition' });
      this.save();
    }
  },

  setBackground: function(backgroundColor, backgroundImage, backgroundRepeat, backgroundPosition){
    this.setBackgroundColor(backgroundColor);
    this.setBackgroundImage(backgroundImage);
    this.setBackgroundRepeatMode(backgroundRepeat);
    this.setBackgroundPosition(backgroundPosition);
  },

  getBackgroundPosition: function(){
    if(this.hasCss()){
      return this.data.data.css.backgroundPosition;
    }
    else{ return '' ;}
  },
  
  getBackgroundRepeatMode: function(){
    if(this.hasCss()){
      return this.data.data.css.backgroundRepeat;
    }
    else{ return ''; }
  },
  
  getBackgroundColor: function(){
    if(this.hasCss()){
      return this.data.data.css.backgroundColor;
    }
    else{ return ''; }
  },
  
  getBackgroundColor: function(){
    if(this.hasCss()){
      return this.data.data.css.backgroundColor;
    }
    else{ return ''; }
  },
  
  getBackgroundImage: function(){
    if(this.hasBackgroundImage()){
      return this.data.data.css.backgroundImage;
    }
    else{ return ''; }
  },
  
  setBackgroundGradient: function(gradient){
    this.removeBackgroundImage();
    this.data.data.css.backgroundGradient = gradient;
    this.fireObjectChanged({ modifedAttribute: 'css.backgroundGradient' });
    this.save();
  },
  
  getBackgroundGradient: function(){
    if(this.hasBackgroundGradient()){ return this.data.data.css.backgroundGradient; }
    else{ return ''; }
  },

  setExternalPageUrl: function(url) {
    WebDoc.InspectorFieldsValidator.validateUrl(url);
    if(this.data.data.externalPageUrl != url) {
      this.data.data.externalPageUrl = url;
      this.fireObjectChanged({ modifedAttribute: 'externalPageUrl' });
      this.save();
    }
  },

  removeBackgroundImage: function() {
    this.data.data.css.backgroundImage = "";
    this.data.data.css.backgroundRepeat = "";
    this.data.data.css.backgroundPosition = "";   
    this.fireObjectChanged({ modifedAttribute: 'css.background' });
    this.save();    
  },

  removeBackgroundGradient: function(){
    this.data.data.css.backgroundGradient = '';
    this.fireObjectChanged({ modifedAttribute: 'css.background' });
    this.save();
  },
  
  hasBackgroundImage: function() {
    return this.hasCss() && this.data.data.css.backgroundImage;
  },

  hasCss: function(){
    if(this.data.data.css){ return true; }
    else{ return false;}
  },
  
  initSize: function() {
    if (!this.data.data) {
      this.data.data = {};
    }
    if (!this.data.data.css) {
      this.data.data.css = {};
    }
    if (!this.data.data.css.width) {
      this.data.data.css.width = this.document.data.size.width;
      if (!this.data.data.css.width.match(/px|\%/)) {
        this.data.data.css.width += "px";
      }
    }
    if (!this.data.data.css.height) {
      this.data.data.css.height = this.document.data.size.height;
      if (!this.data.data.css.height.match(/px|\%/)) {
        this.data.data.css.height += "px";
      }      
    }    
  },
  
  hasBackgroundGradient: function(){
    var backgroundGradient = false;
    if(this.hasCss() && this.data.data.css.backgroundGradient){
      if(this.data.data.css.backgroundGradient != '' || this.data.data.css.backgroundGradient != ""){
        backgroundGradient = true;
      }
    }
    return backgroundGradient;
  },
  

  refresh: function($super, json, onlyMissingValues) {
    this._layout = undefined;
    $super(json, onlyMissingValues);
    this.initSize();    
    this._refreshClasses();
    // if recieved json contains items then we create all items records.
    // if json does not contains items we leave all previous items as they were
    if (json.page.items && $.isArray(json.page.items)) {
      var that = this;
      this.items = [];
      this.nonDrawingItems = [];
      this.lastDrawingItemPosition = -1;     
      this.firstPosition = 0;
      this.lastPosition = 0;      
      this.data.items.sort(function(a,b) {
        a.position = a.position?a.position:0;
        b.position = b.position?b.position:0;
        return a.position - b.position;
      });
      for (var i = 0; i < this.data.items.length; i++) {
        var itemData = this.data.items[i];
        that.createOrUpdateItem({ item: itemData });
      }
    }    
  },
  
  // Returns backgroundImage CSS data without the url() container
  getBackgroundImagePath: function() {
    WebDoc.InspectorFieldsValidator.validateBackgroundUrl(this.data.data.css.backgroundImage);
    return this.data.data.css.backgroundImage.substring(4, this.data.data.css.backgroundImage.length-1);
  },
  
  getData: function($super, withRelationShips) {
    var dataObject = $super(withRelationShips);
    delete dataObject.items;
    if (withRelationShips && this.items.length) {
      dataObject.items = [];
      for (var i = 0; i < this.items.length; i++) {
        dataObject.items.push(this.items[i].getData(withRelationShips));
      }
    }
    return dataObject;
  },
  
  createOrUpdateItem: function(itemData) {
    var item = this.findItemWithUuid(itemData.item.uuid);
    if (itemData.action == "delete") {
      this.removeItem(item);
    }    
    else if (!item) {
      this.createItem(itemData);
    }
    else {
      item.refresh(itemData);
    }
  },
  
  createItem: function(itemData) {
    var newItem = new WebDoc.Item(itemData, this);
    this.addItem(newItem);
  },
  
  _itemZMoved: function(item) {
    this.nonDrawingItems.sort(function(a, b) {
      a.data.position = a.data.position?a.data.position:0;
      b.data.position = b.data.position?b.data.position:0;
      return a.data.position - b.data.position;
    });
    this.items.sort(function(a,b) {
      a.data.position = a.data.position?a.data.position:0;
      b.data.position = b.data.position?b.data.position:0;
      return a.data.position - b.data.position;
    });    
    var afterItemIndex = $.inArray(item, this.nonDrawingItems);
    this.fireItemPositionChanged(item, afterItemIndex > 0 ? this.nonDrawingItems[afterItemIndex - 1] : null);
  },
  
  moveFront: function(item) {
    if (this.nonDrawingItems.length > 1) {
      this.lastPosition += 1;
      item.setPositionZ(this.lastPosition);
    }
  },
  
  moveBack: function(item) {
    if (this.nonDrawingItems.length > 1) {
      this.firstPosition -= 1;
      item.setPositionZ(this.firstPosition);
    }
  },
  
  addItem: function(item) {
    item.page = this;

    this.items.push(item);
    this.items.sort(function(a,b) {
      a.data.position = a.data.position?a.data.position:0;
      b.data.position = b.data.position?b.data.position:0;
      return a.data.position - b.data.position;
    });    
    var afterItem = null;
    if (item.data.media_type !== WebDoc.ITEM_TYPE_DRAWING) {
      this.nonDrawingItems.push(item);
      this.nonDrawingItems.sort(function(a,b) {
        return a.data.position - b.data.position;
      });
      if (item.data.position > this.lastPosition) {
        this.lastPosition = item.data.position;
      }
      else if (item.data.position < this.firstPosition) {
        this.firstPosition = item.data.position;
      }  
      var afterItemIndex = $.inArray(item, this.nonDrawingItems) - 1;
      if (afterItemIndex > -1) {
        afterItem = this.nonDrawingItems[afterItemIndex];
      }
    }        
    else {
      if (item.data.position && item.data.position > this.lastDrawingItemPosition) {
        this.lastDrawingItemPosition = item.data.position;
      }
      else {
        this.lastDrawingItemPosition += 1;
        item.data.position = this.lastDrawingItemPosition;
      }
    }
    this.fireItemAdded(item, afterItem);    
  },
  
  removeItem: function(item) {
    var index = $.inArray(item, this.items);
    if (index != -1) {
      this.items.splice(index, 1);
      if (item.data.media_type != WebDoc.ITEM_TYPE_DRAWING) {
        var nonDrawingIndex = $.inArray(item, this.nonDrawingItems);
        if (nonDrawingIndex != -1) {
          this.nonDrawingItems.splice(nonDrawingIndex, 1);    
        }
      }
    }
    this.fireItemRemoved(item);
  },
  
  findItemWithUuid: function(pUuid) {
    var i = 0;
    for (; i < this.items.length; i++) {
      var anObject = this.items[i];
      if (anObject.uuid() == pUuid) {
        return anObject;
      }
    }
    return null;
  },
  
  fireItemAdded: function(addedItem, afterItem) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].itemAdded) {
        this.listeners[i].itemAdded(addedItem, afterItem);
      }      
    }     
  },
  
  fireItemRemoved: function(removedItem) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].itemRemoved) {
        this.listeners[i].itemRemoved(removedItem);
      }
    }     
  },
  
  fireItemPositionChanged: function(item, afterItem) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].itemMovedAfterItem) {
        this.listeners[i].itemMovedAfterItem(item, afterItem);
      }
    }         
  },
  
  copy: function($super) {
    newPage = $super();
    newPage.data.data = $.evalJSON($.toJSON(this.data.data));
    newPage.data.layout_kind = this.getLayoutkind();
    newPage.data.items = [];
    newPage.data.position = -1;
    newPage.data.title = this.data.title;
    if (this.items && $.isArray(this.items)) {
      $.each(this.items, function() {
        var copiedItem = this.copy();
        copiedItem.data.page_id = newPage.uuid();
        newPage.items.push(copiedItem);
        newPage.data.items.push(copiedItem.data);
      });
    }        
    ddd("copied page is ", newPage, new Date());
    return newPage;
  },

  rootUrlArgs: function() {
    if (this.document) {
      return {
        document_id: this.document.uuid()
      };
    }
    else {
      ddd("page without document !!!!!!!!!!!!!!!!!!!");
      ddt();
      return {};
    }
  },

  nbTextItems: function() {
	  var result = 0;
    for (var i = 0; i < this.nonDrawingItems.length; i++) {
      if(this.nonDrawingItems[i].type() == "text") {
        result++;
      }
    }
    return result;
  },

  getFirstTextItem: function() {
    for (var i = 0; i < this.nonDrawingItems.length; i++) {
      if(this.nonDrawingItems[i].type() == "text") {
        return this.nonDrawingItems[i];
      }
    }
  },
  
  assignLayout: function(layout, callBack) {
    // remove all previous items
    var previousItemsMap = {};
    for (var itemIndex = this.items.length - 1; itemIndex >= 0; itemIndex--) {
      var item = this.items[itemIndex];
      // we take only items that come from layout
      if (item.getKind() && item.getKind() !== 'null') {
        previousItemsMap[item.getKind()] = item;
      }
    }
    if (layout) {
      this.data.layout_kind = layout.getKind();
      this._layout = undefined;
      // JBA do not copy data of model page but page view will take value from model page.
      //    this.data.data = $.evalJSON($.toJSON(layout.getModelPage().data.data));
      //this.data.items = [];
      //this.save();

      if (layout.getModelPage().items && $.isArray(layout.getModelPage().items)) {
        for (var index = 0; index < layout.getModelPage().items.length; index++) {
          var itemToCopy = layout.getModelPage().items[index];
          var previousItemWithSameKind = previousItemsMap[itemToCopy.getKind()];
          var copiedItem;
          if (!previousItemWithSameKind) {
            copiedItem = itemToCopy.copy();
            this.addItem(copiedItem);
          }
          else {
            copiedItem = previousItemWithSameKind;
            copiedItem.setInnerHtmlPlaceholder(itemToCopy.getInnerHtmlPlaceholder());
            previousItemsMap[itemToCopy.getKind()] = null;
          }
        }
      }
    }
    else {
      this.data.layout_kind = null;
      this._layout = undefined;      
    }
    // remove unecessary items
    for (itemKind in previousItemsMap) {
      var itemToRemove = previousItemsMap[itemKind];
      if (itemToRemove) {
        // tell rails to remove this item
        itemToRemove.data._delete = true;
        this._itemsToRemoveAfterSave.push(itemToRemove);
      }
    }    
    this.save(callBack, true);
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

      if((save === undefined || save === true) && needSave) {
        this.data.data['class'] = this.getClass();
        this.fireObjectChanged({ modifedAttribute: 'class' });
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
    if(this.data.data['class']) {
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
  
  setStyle: function(newStyle, scope){    
    if(scope){
      if(scope == 'background'){
        //background is stored in the css hash properties, not in style hash
        var oldCss = jQuery.extend({}, this.data.data.css);
        var that = this;
        WebDoc.application.undoManager.registerUndo(function() {
          that.applyCss(oldCss);
        }.pBind(this));
        
        var backgroundArray = newStyle.split(';');
        var backgroundProperty;
        var backgroundGradient = '';
        
        for(i=0;i<backgroundArray.length;i++){
          backgroundProperty = backgroundArray[i].split(':');
          if(backgroundProperty[0] == 'background-image'){
            if(this._backgroundImageWithGradient(backgroundProperty[1])){
              backgroundGradient += backgroundProperty[0] + ':' + backgroundProperty[1] + ';';
            }
            else{
              this.setBackgroundImage(backgroundProperty[1]);
            }
          }
          else if(backgroundProperty[0] == 'background-color'){
            this.setBackgroundColor(backgroundProperty[1]);
          }
        }
        if(backgroundGradient != ''){
          this.setBackgroundGradient(backgroundGradient);
        }
      }
    }
    else{
      this.data.data.style = newStyle;
      this.save();
      this.fireObjectChanged({ modifedAttribute: 'css' });
    }
  },
  
  getStyle: function(){
    return this.data.data.style;
  },
  
  getStyleString: function(){
    var styleHash = this.getStyle();
    var cssString = '';
    
    if(styleHash){
      for(i=0; i < this.CSS_AUTHORIZED_SCOPE.length; i++){
        if(styleHash[this.CSS_AUTHORIZED_SCOPE[i]]){
          cssString += styleHash[this.CSS_AUTHORIZED_SCOPE[i]];
        }
      }
    }
    return cssString;
  },
  
  _backgroundImageWithGradient: function(backgroundImage){
    if(backgroundImage.match("gradient")){ return true; }
    else{ return false; }
  },

  save: function($super, callBack, withRelationships, synch) {
    $super(function(page, status) {
      for (var i = this._itemsToRemoveAfterSave.length - 1; i >= 0; i--) {
        var item = this._itemsToRemoveAfterSave[i];
        this.removeItem(item);
      }
      this._itemsToRemoveAfterSave = [];
      if (callBack) {
        callBack.apply(page, [page, status]);
      }
    }.pBind(this), withRelationships, synch);
    
  },

  // ***********
  // DISCUSSIONS
  // ***********

  getDiscussions: function(callback) {
    if (this.discussions !== undefined) {
      callback.call(this, this.discussions);
    }
    else {
      WebDoc.ServerManager.getRecords( WebDoc.Discussion, null, function(discussions) {
        this.discussions = discussions;
        callback.call(this, this.discussions);
      }.pBind(this), { ajaxParams: { page_id: this.uuid() } });
    }
  },

  createDiscussion: function(discussionData) {
    var newDiscussion = new WebDoc.Discussion(discussionData, 'page', this.uuid());
    this.addDiscussion(newDiscussion);
  },

  addDiscussion: function(discussion) {
    if(!this.discussions) {
      this.discussions = [];
    }
    this.discussions.push(discussion);
    this.fireDiscussionAdded(discussion);
  },

  removeDiscussion: function(discussion) {
    if(this.discussions !== undefined) {
      var index = jQuery.inArray(discussion, this.discussions);
      if (index > -1) {
        this.discussions.splice(index, 1);
      }
      this.fireDiscussionRemoved(discussion);
    }
  },

  fireDiscussionAdded: function(addedDiscussion) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].discussionAdded) {
        this.listeners[i].discussionAdded(addedDiscussion);
      }
    }
  },

  fireDiscussionRemoved: function(removedDiscussion) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].discussionRemoved) {
        this.listeners[i].discussionRemoved(removedDiscussion);
      }
    }
  },

  // for xmpp notification, see collaboration manager
  createOrUpdateOrDestroyDiscussion: function(discussionData) {
    var discussion = this.findDiscussionByUuid(discussionData.discussion.uuid);
    if (discussionData.action == "delete") {
      this.removeDiscussion(discussion);
    }
    else if (!discussion) {
      this.createDiscussion(discussionData);
    }
    else {
      discussion.refresh(discussionData);
    }
  },

  findDiscussionByUuid: function(uuid) {
    for (var i=0; i<this.discussions.length; i++) {
      var aDiscussion = this.discussions[i];
      if (aDiscussion.uuid() == uuid) {
        return aDiscussion;
      }
    }
    return null;
  }

});

$.extend(WebDoc.Page, {
  rootUrlValue: undefined,
  className: function() {
    return "page";
  },
  
  rootUrl: function(args) {
    if (this.rootUrlValue === undefined) {
      this.rootUrlValue = WebDoc.dataServer ? WebDoc.dataServer : "";
      this.rootUrlValue += "/documents/";  
    }         
    return this.rootUrlValue + args.document_id;
  },
  pluralizedClassName: function() {
    return this.className() + "s";
  }  
});
