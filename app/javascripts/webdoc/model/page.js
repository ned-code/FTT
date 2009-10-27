
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.Page = $.klass(MTools.Record, 
{
  initialize: function($super, json) {
    $super(json);
  },
  
  className: function() {
    return "page";
  },
  
  rootUrl: function() {
    return "/documents/" + this.data.document_id;
  },
  
  applyCss: function(newCss) {   
    if (newCss != this.data.data.css) {
      this.data.data.css = newCss;
      this.fireObjectChanged();
      this.save();
    }
  },
  
  refresh: function($super, json) {
    $super(json);
    var that = this;
    this.items = [];    
    if (this.data.items && $.isArray(this.data.items)) {
      $.each(this.data.items, function() {
        that.createOrUpdateItem({ item: this });
      });
    }    
  },
  
  to_json: function($super) {
    var result = $super();
    delete result['page[items]'];
    return result;
  },
  
  previousPageId: function() {
    return null;
  },
  
  nextPageId: function() {
    return null;
  },
  
  createOrUpdateItem: function(itemData) {
    var item = this.findItemWithUuid(itemData.uuid);
    if (!item) {
      this.createItem(itemData);
    }
    else {
      item.refresh(itemData);
    }
  },
  
  createItem: function(itemData) {
    var newItem = new WebDoc.Item(itemData);
    this.addItem(newItem);
  },
  
  addItem: function(item) {
    item.data.page_id = this.uuid();
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
    if (this.listener) {
      this.listener.itemAdded(addedItem);
    }
  },
  
  fireItemRemoved: function(addedItem) {
    if (this.listener) {
      this.listener.itemRemoved(addedItem);
    }
  },
  
});
