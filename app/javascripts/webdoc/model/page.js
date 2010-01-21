
//= require <mtools/record>
//= require <webdoc/model/item>
//= require <webdoc/utils/inspector_fields_validator>

WebDoc.Page = $.klass(MTools.Record, 
{ 
  initialize: function($super, json, document) {
    // initialize relationship before super.
    this.items = [];
    this.document = document;
    $super(json);
  },
  
  getDocument: function() {
    return this.document;  
  },
  
  setDocument: function(document) {
    this.document = document;
  },
  
  setExternalPageMode: function(mode) {
    ddd("set mode", mode);  
    this.data.data.externalPage = mode;
    this.fireObjectChanged();    
  },
  
  setAllowAnnotation: function(mode) {
    ddd("set allow annotation", mode);
    this.data.data.allowAnnotation = mode;
    if (mode) {
      delete this.data.data.css.width;
      delete this.data.data.css.height;
    }
    this.fireObjectChanged();    
  },
  
  applyCss: function(newCss) {   
    if (newCss != this.data.data.css) {
      this.data.data.css = newCss;
      this.fireObjectChanged();
      this.save();
    }
  },

  setTitle: function(title) {
    if(this.data.title != title) {
      this.data.title = title;
      this.fireObjectChanged();
      this.save();
    }
  },
  
  setHeight: function(height) {
    WebDoc.InspectorFieldsValidator.validatePixelSize(height);
    if(this.data.data.css.height != height) {
      this.data.data.css.height = height;
      this.fireObjectChanged();
      this.save();
    }
  },
  
  setWidth: function(width) {
    WebDoc.InspectorFieldsValidator.validatePixelSize(width);
    if(this.data.data.css.width != width) {
      this.data.data.css.width = width;
      this.fireObjectChanged();
      this.save();
    }
  },

  setBackgroundColor: function(backgroundColor) {
    WebDoc.InspectorFieldsValidator.validateColor(backgroundColor);
    if(this.data.data.css.backgroundColor != backgroundColor) {
      this.data.data.css.backgroundColor = backgroundColor;
      this.fireObjectChanged();
      this.save();
    }
  },
  
  setBackgroundImageAndRepeatMode: function(backgroundUrl, repeatMode, position) { 
    var objectChanged = this.setBackgroundImage(backgroundUrl);
    objectChanged = this.setBackgroundRepeatMode(repeatMode) || objectChanged;
    objectChanged = this.setBackgroundPosition(position) || objectChanged;
    if(objectChanged) {
      this.fireObjectChanged();
      this.save();
    }
  },

  setBackgroundImage: function(backgroundUrl) {
    WebDoc.InspectorFieldsValidator.validateBackgroundUrl(backgroundUrl);
    if(this.data.data.css.backgroundImage != backgroundUrl) {
      this.data.data.css.backgroundImage = backgroundUrl;
      return true;
    }
    return false;
  },

  setBackgroundRepeatMode: function(repeatMode) {
    WebDoc.InspectorFieldsValidator.validateBackgroundRepeat(repeatMode);
    if(this.data.data.css.backgroundRepeat != repeatMode) {
      this.data.data.css.backgroundRepeat = repeatMode;
      return true;
    }
    return false;
  },

  setBackgroundPosition: function(position) {
    WebDoc.InspectorFieldsValidator.validateBackgroundPosition(position);
    if(this.data.data.css.backgroundPosition != position) {
      this.data.data.css.backgroundPosition = position;
      return true;
    }
    return false;
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
        removeItem(this.items[itemIndex]);
      }
    }
    var that = this;
    this.items = [];    
    if (this.data.items && $.isArray(this.data.items)) {
      $.each(this.data.items, function() {
        that.createOrUpdateItem({ item: this });
      });
    }    
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
  
  addItem: function(item) {
    item.page = this;
    this.items.push(item);
    this.fireItemAdded(item);    
  },
  
  removeItem: function(item) {    
    var index = $.inArray(item, this.items);
    if (index != -1) {
      this.items.splice(index, 1);
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
  
  toggleBkg: function() {
    ddd("toggle");
    var previousColor = this.data.data.css.backgroundColor;
    var newColor = "white";
    if (previousColor == "white") {
      newColor = "black";
    }
    this.data.data.css.backgroundColor = newColor;
    this.fireObjectChanged();
  },
  
  fireItemAdded: function(addedItem) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].itemAdded) {
        this.listeners[i].itemAdded(addedItem);
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
  
  copy: function($super) {
    newPage = $super();
    newPage.data.data = $.evalJSON($.toJSON(this.data.data));
    newPage.data.items = [];
    newPage.position = -1;
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
    for (var i = 0; i < this.items.length; i++) {
      if(this.items[i].type() == "text") {
        result++;
      }
    }
    return result;
  },

  getFirstTextItem: function() {
    for (var i = 0; i < this.items.length; i++) {
      if(this.items[i].type() == "text") {
        return this.items[i];
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
  }
});
