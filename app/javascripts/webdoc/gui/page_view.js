
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.PageView = $.klass({
  initialize: function(page) {
    var boardContainer = WebDoc.application.boardController.boardContainerNode,
        externalPage,
        domNode = $('<div>').id('board'),
        itemDomNode = $('<div/>').id('items').addClass("layer").css({overflow: 'visible'}),
        drawingDomNode = $( WebDoc.application.svgRenderer.createSurface() ),
        //boardScreenNodes = jQuery('<div/>').addClass('screen layer')
        //    .add( jQuery('<div/>').addClass('screen layer') )
        //    .add( jQuery('<div/>').addClass('screen layer') )
        //    .add( jQuery('<div/>').addClass('screen layer') ),
        boardScreenNodes = boardContainer.children('.screen'),
        that = this;
    
    // Extend this
    this.page = page;
    this.domNode = domNode;
    this.drawingDomNode = drawingDomNode;
    this.itemDomNode = itemDomNode;
    this.itemViews = {};
    this.boardScreenNodes = boardScreenNodes;
    
    // Set up page view
    drawingDomNode.css("zIndex", 1000000);
    domNode.append( drawingDomNode );
    
    if (page.data.data.externalPage && !page.data.data.allowAnnotation) {
    //  this.domNode.css({
    //    width: "100%",
    //    height: "100%"
    //  });
    }
    else {
        boardContainer
        .css(page.data.data.css);
        //this.domNode.css(page.data.data.css);
    }
    
    if (page.data.data.externalPage && !WebDoc.application.pageEditor.disableHtml) {
      // Handle case where page is an external webpage
      // TODO: change this to use CSS classes

      externalPage = $("<iframe/>")
      //.css({
      //  width: "100%",
      //  height: "100%"
      //});
      if (page.data.data.externalPageUrl) {
        if (page.data.data.allowAnnotation) {
          externalPage.attr("src", "http:\/\/" + document.domain + ":" + window.location.port + "/proxy/resolve?url=" + page.data.data.externalPageUrl);
          //boardContainer.css("overflow", "auto");
          externalPage.css("overflow", "hidden");
          if (page.data.data.css.width) {
            
            //this.domNode.css(page.data.data.css);
            
            WebDoc.application.boardController.boardContainerNode
            .css(page.data.data.css);
          
          }
          else {
            externalPage.bind("load", function() {
              page.data.data.css.width = externalPage[0].contentDocument.width;
              page.data.data.css.height = externalPage[0].contentDocument.height;
              page.save();
              //this.domNode.css(page.data.data.css);
              
              WebDoc.application.boardController.boardContainerNode
              .css(page.data.data.css);
            
            }.pBind(this));
          }          
        }
        else {
          externalPage.attr("src", page.data.data.externalPageUrl);
          //boardContainer.css("overflow", "hidden");
          externalPage.css("overflow", "auto");
        }
        this.itemDomNode.append(externalPage[0]);
      }      
    }
    else {
        // Handle case where page is a webdoc
        ddd('Page is a webdoc page');
    }
    //if (this.domNode.css("width").indexOf("%") !== -1 || this.domNode.css("height").indexOf("%") !== -1) {
    //  this.domNode.css({
    //    position: "absolute",
    //    top: "0px",
    //    left: "0px"
    //  });
    //}
    this.domNode.append( itemDomNode );
    //this.domNode.append( boardScreenNodes );
    if (page.items && $.isArray(page.items)) {
        $.each(page.items, function() {
            that.createItemView(this, "end");
        });
    }
    page.addListener(this);
  },
  
  objectChanged: function(page) {
    //this.domNode.animate(page.data.data.css, 'fast');
    
    WebDoc.application.boardController.boardContainerNode
    .animate(page.data.data.css, 'fast');
    
    //if (this.domNode.css("width").indexOf("%") !== -1 || this.domNode.css("height").indexOf("%") !== -1) {
    //  this.domNode.css({
    //    position: "absolute",
    //    top: "0px",
    //    left: "0px"
    //  });
    //}
    //else {
    //  this.domNode.css({
    //    position: "",
    //    top: "",
    //    left: ""
    //  });      
    //}    
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
  }
});
