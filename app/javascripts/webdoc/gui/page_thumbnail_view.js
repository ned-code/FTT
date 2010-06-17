
//= require <mtools/record>
//= require <webdoc/model/item>
//= require <webdoc/gui/item_thumbnail_view>

(function(jQuery, undefined){

var pageThumbClass = "page-thumb",
    pageThumbSelector = ".page-thumb";

WebDoc.PageThumbnailView = $.klass({
  PER_CENT_PAGE_WIDTH: 1280,
  PER_CENT_PAGE_HEIGHT: 720,
  initialize: function(page, width, height) {
    this.page = page;
    this.width = width;
    this.height = height;
    this.domNode = $('<div>').attr({
      id: "thumb_" + page.uuid(),
      draggable: "true"
    });
    
    this.pageThumbNode = $('<div/>');
    if (this.page.data.data.externalPage) {
      var url = $("<div/>").addClass("page_thumb_url").css("textAlign", "center").text(this.page.data.data.externalPageUrl);
      this.pageThumbNode.append(url.get(0));
      this.domNode.addClass("page-thumb-external");
    }
    else {
      this.drawingDomNode = $(WebDoc.application.svgRenderer.createSurface());
      this.drawingDomNode.css("zIndex", 1000000);
      this.pageThumbNode.append(this.drawingDomNode.get(0));
      
      this.itemDomNode = $('<div>').attr({
        id: "thumb_items",
        'class': "layer"
      });
      this.pageThumbNode.append(this.itemDomNode.get(0));   
      var that = this;
      this.itemViews = {};
      if (page.items && $.isArray(page.items)) {
        $.each(page.items, function() {
          that.createItemView(this);
        });
      }
    }
    page.addListener(this);    
    this._initPageCss();
    this._initPageClass();
    this.domNode.append(this.pageThumbNode);
  },
  
  destroy: function() {
    ddd("destroy page thumb view", this);
    this.page.removeListener(this);
    this.domNode.remove();
  },
  
  _initPageCss: function() {
    // define scale factor
    var widthInPx = this.page.data.data.css.width? this.page.width().match(/.*px/) : false;
    var heightInPx = this.page.data.data.css.height? this.page.height().match(/.*px/) : false;
    var pageWidth = widthInPx? parseInt(this.page.data.data.css.width,10):this.PER_CENT_PAGE_WIDTH;
    var pageHeight = heightInPx? parseInt(this.page.data.data.css.height,10):this.PER_CENT_PAGE_HEIGHT;
    
    if (this.page.data.data.externalPage) {
      this.factor = 1;
      this.pageThumbNode.css({ width: this.width+"px", height: this.height+"px"});
    }
    else {
      var horizontalFactor = this.width / pageWidth;
      var verticalFactor = this.height / pageHeight;
      if (horizontalFactor < verticalFactor) {
        this.factor = horizontalFactor;
      }
      else {
        this.factor = verticalFactor;
      }
      this.pageThumbNode.css(this.page.data.data.css);
      if (!widthInPx) {
        this.pageThumbNode.css("width",this.PER_CENT_PAGE_WIDTH);  
      }      
      if (!heightInPx) {
        this.pageThumbNode.css("height",this.PER_CENT_PAGE_HEIGHT);  
      }            
      this.pageThumbNode.css("MozTransformOrigin", "0px 0px");
      this.pageThumbNode.css("MozTransform", "scaleX(" + this.factor + ") scaleY(" + this.factor + ")");
      this.pageThumbNode.css("WebkitTransformOrigin", "0px 0px");
      this.pageThumbNode.css("WebkitTransform", "scaleX(" + this.factor + ") scaleY(" + this.factor + ")");      
    }        
    var height = pageHeight * this.factor;
    var width = pageWidth * this.factor;
    
    this.domNode.css({
      //top: (this.height - height) / 2,
      width: width,
      height: height
    });
  },
  
  objectChanged: function(page, options) {
    if (page._isAttributeModified(options, 'css')) {
      this._initPageCss();
    }
    if (page._isAttributeModified(options, 'class')) {
      this._initPageClass();      
    }
  },
  
  itemAdded: function(addedItem, afterItem) {
    if (!this.page.data.data.externalPage) {
      var relatedItemView = this.itemViews[addedItem.uuid()];
      var afterItemView = afterItem? this.itemViews[afterItem.uuid()]: null;
      // be sure not to add twice the same item
      if (!relatedItemView) {
        this.createItemView(addedItem, afterItemView);
      }
      else {
        // be sure the related item is correct. If we recieve a item added and we already have of view for that item uuid
        // then we probaby have a view that is related to another version of the item.
        relatedItemView.item.removeListener(relatedItemView);
        relatedItemView.item = addedItem;
        relatedItemView.item.addListener(relatedItemView);
        relatedItemView.objectChanged(addedItem);
      }
    }
  },
  
  itemRemoved: function(removedItem) {
    if (!this.page.data.data.externalPage) {
      var relatedItemView = this.itemViews[removedItem.uuid()];
      if (relatedItemView) {
        relatedItemView.remove();
        delete this.itemViews[removedItem.uuid()];
      }
    }
  },
  
  createItemView: function(item, afterItem) {
    var itemView;
    
    switch (item.data.media_type) {
      case WebDoc.ITEM_TYPE_TEXT:
        itemView = new WebDoc.ItemThumbnailView(item, this, afterItem);
        break;
      case WebDoc.ITEM_TYPE_IMAGE:
        itemView = new WebDoc.ImageThumbnailView(item, this, afterItem);
        break;
      case WebDoc.ITEM_TYPE_DRAWING:
        itemView = new WebDoc.DrawingThumbnailView(item, this);
        break;
      case WebDoc.ITEM_TYPE_WIDGET:
      case WebDoc.ITEM_TYPE_HTML:
        itemView = new WebDoc.WidgetThumbnailView(item, this, afterItem);
        break;
      default:
        itemView = new WebDoc.ItemThumbnailView(item, this, afterItem);
        break;
    }
    this.itemViews[item.uuid()] = itemView;
    
    return itemView;
  },
  
  _initPageClass: function() {
    this.pageThumbNode.attr("class", pageThumbClass + " webdoc");
    this.pageThumbNode.addClass(this.page.data.data['class']);
    this.page.getLayout(function(layout) {
      if (layout) {
        this.pageThumbNode.addClass(layout.getModelPage().data.data['class']);
      }
    }.pBind(this));    
  }
});

})(jQuery);