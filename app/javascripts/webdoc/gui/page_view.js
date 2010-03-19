//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.PageView = $.klass({
  initialize: function(page, boardContainer) {
    var externalPage,
        domNode = $('<div>').id('page_' + page.uuid()),
        itemDomNode = $('<div/>').id('items_' + page.uuid()).addClass("layer").css({overflow: 'visible'}),
        drawingDomNode = $( WebDoc.application.svgRenderer.createSurface() ),
        eventCatcherNode = jQuery('<div/>').id("event-catcher_" + page.uuid()).addClass('screnn layer').hide(),
        that = this,
        boardContainerSize = {},
        boardCss = {};
    
    // Extend this
    this._boardContainer = boardContainer;
    this.page = page;
    this.domNode = domNode;
    this.drawingDomNode = drawingDomNode;
    this.itemDomNode = itemDomNode;
    this.eventCatcherNode = eventCatcherNode;
    this.itemViews = {};
    
    // Set up page view
    drawingDomNode.css("zIndex", 1000000);
    domNode.append( drawingDomNode );
    
    boardContainerSize.top = page.data.data.css.top;
    boardContainerSize.left = page.data.data.css.left;
    boardContainerSize.width = page.data.data.css.width;
    boardContainerSize.height = page.data.data.css.height; 
    $.extend(boardCss, page.data.data.css);
    delete boardCss.top;
    delete boardCss.left;
    delete boardCss.width;
    delete boardCss.height;
    boardContainer.css( boardContainerSize );
    this.domNode.css(boardCss);
    ddd( page.data.data.css );
    
    if (page.data.data.externalPage && !WebDoc.application.pageEditor.disableHtml) {
      // Handle case where page is an external webpage
      
      externalPage = $("<iframe/>").addClass('layer');
      
      if (page.data.data.externalPageUrl) {
        externalPage.attr("src", page.data.data.externalPageUrl);        
        this.itemDomNode.append(externalPage[0]);
      }
    }
    else {
      // Handle case where page is a webdoc
      ddd('Page is a webdoc page');
    }
    
    this.domNode.append( itemDomNode );
    this.domNode.append( eventCatcherNode );
    
    if (page.items && $.isArray(page.items)) {
        $.each(page.items, function() {
            that.createItemView(this, "end");
        });
    }
    
    page.addListener(this);
  },
  
  objectChanged: function(page) {
    //this.domNode.animate(page.data.data.css, 'fast');
    var boardContainerSize = {};
    var boardCss = {};
    boardContainerSize.top = page.data.data.css.top;
    boardContainerSize.left = page.data.data.css.left;
    boardContainerSize.width = page.data.data.css.width;
    boardContainerSize.height = page.data.data.css.height; 
    $.extend(boardCss, page.data.data.css);
    delete boardCss.top;
    delete boardCss.left;
    delete boardCss.width;
    delete boardCss.height;
    this._boardContainer.animate(boardContainerSize, 'fast');
    this.domNode.animate(boardCss, 'fast');    
  },
  
  itemAdded: function(addedItem, afterItem) {
    var relatedItemView = this.itemViews[addedItem.uuid()];
    var afterItemView = afterItem? this.itemViews[afterItem.uuid()]: null;
    // be sure not to add twice the same item
    if (!relatedItemView) {
      this.createItemView(addedItem, afterItemView);
    }
    else {
      relatedItemView.objectChanged(addedItem);
    }
  },
  
  itemRemoved: function(removedItem) {
    var relatedItemView = this.itemViews[removedItem.uuid()];
    if (relatedItemView) {
      relatedItemView.remove();
      delete this.itemViews[removedItem.uuid()];
    }
  },
  
  itemMovedAfterItem: function(item, afterItem) {
    var itemViewToMove = this.findItemView(item.uuid());
    
    var afterItemView = afterItem? this.findItemView(afterItem.uuid()):null;
    if (afterItemView && itemViewToMove != afterItemView) {
      afterItemView.domNode.after(itemViewToMove.domNode);
    }
    else if (!afterItemView) {
      this.itemDomNode.prepend(itemViewToMove.domNode);
    }
  },
   
  findItemView: function(uuid) {
    return this.itemViews[uuid];
  },
  
  createItemView: function(item, afterItem) {
    var itemView;
    switch (item.data.media_type) {
      case WebDoc.ITEM_TYPE_TEXT:
        itemView = new WebDoc.TextView(item, this, afterItem);
        break;
      case WebDoc.ITEM_TYPE_IMAGE:
        itemView = new WebDoc.ImageView(item, this, afterItem);
        break;
      case WebDoc.ITEM_TYPE_DRAWING:
        itemView = new WebDoc.DrawingView(item, this);
        break;
      case WebDoc.ITEM_TYPE_WIDGET:
        itemView = new WebDoc.WidgetView(item, this, afterItem);
        break;
      default:
        itemView = new WebDoc.ItemView(item, this, afterItem);
        break;
    }
    this.itemViews[item.uuid()] = itemView;
    return itemView;
  },
  
  destroy: function() {
    this.page.removeListener(this);
    for (var itemId in this.itemViews) {
      var anItemView = this.itemViews[itemId];
      anItemView.destroy();
    }
  },
  
  fitInContainer: function(width, height) {
    var zoomToFit = 1;
    var transform = {};
    var heightFactor = height  / this._boardContainer.height();
    var widthFactor = width  / this._boardContainer.width();      
    if (heightFactor < widthFactor) {
      zoomToFit =  heightFactor;
    }
    else {
      zoomToFit =  widthFactor;
    }

    transform.WebkitTransformOrigin = "0px 0px";
    transform.WebkitTransform = zoomToFit === 1 ? "" : "scale(" + zoomToFit + ")" ;
    transform.MozTransformOrigin = zoomToFit === 1 ? "" : "0px 0px" ;
    transform.MozTransform = transform.WebkitTransform;
    transform.width = 100/zoomToFit + '%';
    transform.height = 100/zoomToFit + '%';
    
    var containerChanges = {
        width: parseFloat(this._boardContainer.css("width")),
        height: parseFloat(this._boardContainer.css("height")),
        widthFlag: this._boardContainer.css("width").match(/px/)?"px":"%",
        heightFlag: this._boardContainer.css("height").match(/px/)?"px":"%"
    };
    
    boardContainerCss = {
      width: (containerChanges.width * zoomToFit) + containerChanges.widthFlag,
      height: (containerChanges.height * zoomToFit) + containerChanges.heightFlag
    };
    
    this.domNode.css( transform );
    this._boardContainer.css( boardContainerCss );
  }
});
