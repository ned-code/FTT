
//= require <mtools/record>
//= require <webdoc/model/item>
//= require <webdoc/utils/inspector_fields_validator>

WebDoc.Page = $.klass(WebDoc.Record, 
{ 
  DEFAULT_PAGE_HEIGHT_PX: 600,
  DEFAULT_PAGE_WIDTH_PX: 800,
  
  initialize: function($super, json, document, externalPageUrl) {
    // initialize relationship before super.
    this.firstPosition = 0;
    this.lastPosition = 0;
    this.items = [];
    this.nonDrawingItems = [];
    if (document.className() === WebDoc.Document.className()) {
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
    
  getLayoutId: function() {
    return this.data.layout_id;  
  },
  
  getLayout: function(callBack) {
    WebDoc.ServerManager.getRecords(WebDoc.Layout, this.data.layout_id, callBack);
  },
  
  applyCss: function(newCss) {   
    if (newCss != this.data.data.css) {
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

  height: function(unit) {
    //if (!this.data.data.css.height) {
    //  // this should not happend but old pages are in this case
    //  this.data.data.css.height = "600px";
    //}  
    if (!unit || unit !== "px") {
      return this.data.data.css.height.toString();
    }
    else {
      var result = parseFloat(this.data.data.css.height);
      if (this.data.data.css.height.match(/\%/)) {
        result = this.DEFAULT_PAGE_HEIGHT_PX * (result/100);
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
      var result = parseFloat(this.data.data.css.width);
      if (this.data.data.css.width.match(/\%/)) {
        result = this.DEFAULT_PAGE_WIDTH_PX * (result/100);
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

  setBackgroundColor: function(backgroundColor) {
    var css = this.data.data.css;
    
    if( css.backgroundColor != backgroundColor ) {
      css.backgroundColor = backgroundColor;
      this.fireObjectChanged({ modifedAttribute: 'css.backgroundColor' });
      this.save();
    }
  },

  setBackgroundImage: function(backgroundUrl) {
    if(this.data.data.css.backgroundImage != backgroundUrl) {
      var old_background = this.data.data.css.backgroundImage;
      this.data.data.css.backgroundImage = backgroundUrl;  
      
      this.fireObjectChanged({ modifedAttribute: 'css.backgroundImage' });
      this.save();
      WebDoc.application.undoManager.registerUndo(function() {
        this.setBackgroundImage(old_background);
      }.pBind(this));
    }
  },

  setBackgroundRepeatMode: function(repeatMode) {
    ddd('[Page] setBackgroundRepeatMode('+repeatMode+')')
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
  
  setExternalPageUrl: function(url) {
    WebDoc.InspectorFieldsValidator.validateUrl(url);
    if(this.data.data.externalPageUrl != url) {
      this.data.data.externalPageUrl = url;
      this.fireObjectChanged({ modifedAttribute: 'externalPageUrl' });
      this.save();
    }
  },

  removeBackgroundImage: function() {
    delete this.data.data.css.backgroundImage;
    delete this.data.data.css.backgroundRepeat;
    delete this.data.data.css.backgroundPosition;   
    this.fireObjectChanged({ modifedAttribute: 'css.background' });
    this.save();    
  },
  
  hasBackgroundImage: function() {
    return this.data.data.css.backgroundImage && this.data.data.css.backgroundImage;
  },
  
  refresh: function($super, json) {
    //backup previous items if we need to keep them
    var previousItems = [];
    $.each(this.items, function() {
      previousItems.push(this.getData());
    });
    ddd("previous items", previousItems);
    $super(json);
    if ((this.data.items === null || this.data.items === undefined) && previousItems) {
      ddd("restore previous tems");
      this.data.items = previousItems;
      //clear previous item view
      for (var itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
        this.removeItem(this.items[itemIndex]);
      }
    }
    var that = this;
    this.items = [];
    this.nonDrawingItems = [];    
    if (this.data.items && $.isArray(this.data.items)) {
      this.data.items.sort(function(a,b) {
        a.position = a.position?a.position:0;
        b.position = b.position?b.position:0;
        return a.position - b.position;
      });
      $.each(this.data.items, function() {
        that.createOrUpdateItem({ item: this });
      });
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
    if (item.data.media_type != WebDoc.ITEM_TYPE_DRAWING) {
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
      //ddd(this.items);
      this.fireItemRemoved(item);
    }
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
  
  assignLayout: function(layout) {
    // remove all previous items
    for (var itemIndex = this.items.length - 1; itemIndex >= 0; itemIndex--) {
      var item = this.items[itemIndex];
      this.removeItem(item);
      item.destroy();
    }
    this.data.layout_id = layout.id();
    this.data.data = $.evalJSON($.toJSON(layout.getModelPage().data.data));
    this.data.items = [];
    this.fireObjectChanged({ modifedAttribute: "class css"});
    this.save();
    if (layout.getModelPage().items && $.isArray(layout.getModelPage().items)) {
      for (var index = 0; index < layout.getModelPage().items.length; index++) {
        var itemToCopy = layout.getModelPage().items[index];
        var copiedItem = itemToCopy.copy();
        this.addItem(copiedItem);
        copiedItem.save();        
      }
    }                
  }
});

$.extend(WebDoc.Page, {
  className: function() {
    return "page";
  },
  
  rootUrl: function(args) {
    return "/documents/" + args.document_id;
  },
  pluralizedClassName: function() {
    return this.className() + "s";
  }  
});
