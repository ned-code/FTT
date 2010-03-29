
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
    }).addClass( pageThumbClass );
    
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
        style: "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
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
    this.updateSize();
    this.domNode.append(this.pageThumbNode);
  },
  
  destroy: function() {
    ddd("destroy page thumb view", this);
    this.page.removeListener(this);
    this.domNode.remove();
  },
  
  updateSize: function() {
    // define scale factor
    var widthInPx = this.page.data.data.css.width? this.page.data.data.css.width.match(/.*px/) : false;
    var heightInPx = this.page.data.data.css.height? this.page.data.data.css.height.match(/.*px/) : false;
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
  
  objectChanged: function(page) {
    this.updateSize();
  },
  
  itemAdded: function(addedItem) {
    if (!this.page.data.data.externalPage) {
      this.createItemView(addedItem);
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
  
  createItemView: function(item) {
    var itemView;
    
    switch (item.data.media_type) {
      case WebDoc.ITEM_TYPE_TEXT:
        itemView = new WebDoc.ItemThumbnailView(item, this);
        break;
      case WebDoc.ITEM_TYPE_IMAGE:
        itemView = new WebDoc.ImageThumbnailView(item, this);
        break;
      case WebDoc.ITEM_TYPE_DRAWING:
        itemView = new WebDoc.DrawingThumbnailView(item, this);
        break;
      case WebDoc.ITEM_TYPE_WIDGET:
        itemView = new WebDoc.WidgetThumbnailView(item, this);
        break;
      default:
        itemView = new WebDoc.ItemThumbnailView(item, this);
        break;
    }
    this.itemViews[item.uuid()] = itemView;
    
    return itemView;
  }
});

})(jQuery);