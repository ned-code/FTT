
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.PageView = $.klass(
{
  initialize: function(page) {
    this.page = page;
    this.domNode = $('<div>').attr({
      id: "board",
      style: "position:relative; top: 0px; left: 0px;z-index:0"
    }).css(page.data.data.css);
    
    this.drawingDomNode = $(WebDoc.application.svgRenderer.createSurface());
    this.drawingDomNode.css("zIndex", 999999);
    this.domNode.append($("<div/>").css({zIndex: 999999, position: "absolute", width: "100%", height: "100%"}));
    this.domNode.append(this.drawingDomNode.get(0));
    this.itemDomNode = $('<div>').attr({
      id: "items",
      style: "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
    });
    this.domNode.append(this.itemDomNode.get(0));
    
    var that = this;
    this.itemViews = {};
    if (page.items && $.isArray(page.items)) {
      $.each(page.items, function() {
       that.createItemView(this);
      });
    }
    page.addListener(this);
    
  },
  
  objectChanged: function(page) {
    this.domNode.animate(page.data.data.css, 'fast');
  },
  
  itemAdded: function(addedItem) {
    this.createItemView(addedItem);
  },
  
  itemRemoved: function(removedItem) {
    var relatedItemView = this.itemViews[removedItem.uuid()];
    if (relatedItemView) {
      relatedItemView.remove();
      delete this.itemViews[removedItem.uuid()];
    }
  },
  
  findItemView: function(uuid) {
   return this.itemViews[uuid];
  },
  
  findObjectAtPoint: function(point) {
    var i = 0;
    for (var itemId in this.itemViews) {
      var anItemView = this.itemViews[itemId];
      if (anItemView.coverPoint(point) && !anItemView.isBackground) {
        return anItemView;
      }
    }
    return null;
  },
  
  
  createItemView: function(item) {
    var itemView;
    switch (item.data.media_type) {
      case WebDoc.ITEM_TYPE_TEXT:
        itemView = new WebDoc.TextView(item, this);
        break;
      case  WebDoc.ITEM_TYPE_IMAGE:
        itemView = new WebDoc.ImageView(item, this);
        break;
      case  WebDoc.ITEM_TYPE_DRAWING:
        itemView = new WebDoc.DrawingView(item, this);
        break;
      case  WebDoc.ITEM_TYPE_WIDGET:
        itemView = new WebDoc.WidgetView(item, this);
        break;            
      default: 
        itemView = new WebDoc.ItemView(item, this);
        break;
    }
    this.itemViews[item.uuid()] = itemView;
    return itemView
  }
});
