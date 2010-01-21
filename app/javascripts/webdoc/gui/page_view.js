
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.PageView = $.klass({
  initialize: function(page) {
    var boardContainer = $('#board_container'),
        externalPage,
        domNode = $('<div>').id('board'),
        itemDomNode = $('<div/>').id('items').addClass("layer"),
        drawingDomNode = $( WebDoc.application.svgRenderer.createSurface() ),
        boardScreenNodes = jQuery('<div/>').addClass('screen layer')
            .add( jQuery('<div/>').addClass('screen layer') )
            .add( jQuery('<div/>').addClass('screen layer') )
            .add( jQuery('<div/>').addClass('screen layer') ),
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
      this.domNode.css({
        width: "100%",
        height: "100%"
      });
    }
    else {
        this.domNode.css(page.data.data.css);
    }
    
    if (page.data.data.externalPage && !WebDoc.application.pageEditor.disableHtml) {
      // Handle case where page is an external webpage
      // TODO: change this to use CSS classes

      externalPage = $("<iframe/>").css({
        width: "100%",
        height: "100%"
      });
      if (page.data.data.externalPageUrl) {
        if (page.data.data.allowAnnotation) {
          externalPage.attr("src", "http:\/\/" + document.domain + ":" + window.location.port + "/proxy/resolve?url=" + page.data.data.externalPageUrl);
          boardContainer.css("overflow", "auto");
          externalPage.css("overflow", "hidden");
          if (page.data.data.css.width) {
            this.domNode.css(page.data.data.css);
          }
          else {
            externalPage.bind("load", function() {
              page.data.data.css.width = externalPage[0].contentDocument.width;
              page.data.data.css.height = externalPage[0].contentDocument.height;
              page.save();
              this.domNode.css(page.data.data.css);
            }.pBind(this));
          }          
        }
        else {
          externalPage.attr("src", page.data.data.externalPageUrl);
          boardContainer.css("overflow", "hidden");
          externalPage.css("overflow", "auto");
        }
        this.itemDomNode.append(externalPage[0]);
      }      
    }
    else {
        // Handle case where page is a webdoc
        ddd('Page is a webdoc page');
    }
    
    this.domNode.append( itemDomNode );
    this.domNode.append( boardScreenNodes );
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
    var relatedItemView = this.itemViews[addedItem.uuid()];
    // be sure not to add twice the same item
    if (!relatedItemView) {
      this.createItemView(addedItem);
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
  
  findItemView: function(uuid) {
    return this.itemViews[uuid];
  },
  
  findObjectAtPoint: function(point) {
    var matchedItems = [];
    for (var itemId in this.itemViews) {
      var anItemView = this.itemViews[itemId];
      if (anItemView.coverPoint(point) && !anItemView.isBackground) {
        matchedItems.push(anItemView);
      }
    }
    if (matchedItems.length === 0) {
      return null;
    }
    else {
      var topElement = matchedItems[0];
      var topElementZIndex = parseFloat(topElement.domNode.css("zIndex"));
      if (isNaN(topElementZIndex)) {
        topElementZIndex = 0;
      }
      for (var i = 1; i < matchedItems.length; i++) {
        var nextElement = matchedItems[i];
        var nextElementZIndex = nextElement.domNode.css("zIndex");
        if (isNaN(nextElementZIndex)) {
          nextElementZIndex = 0;
        }
        if (nextElementZIndex > topElementZIndex) {
          topElement = nextElement;
          topElementZIndex = nextElementZIndex;
        }
        else 
          if (nextElementZIndex == topElementZIndex) {
            var allChildren = this.itemDomNode.children();
            var nextIndex = allChildren.index(nextElement.domNode);
            var topIndex = allChildren.index(topElement.domNode);
            if (nextIndex > topIndex) {
              topElement = nextElement;
            }
          }
      }
      return topElement;
    }
  },
  
  
  createItemView: function(item) {
    var itemView;
    switch (item.data.media_type) {
      case WebDoc.ITEM_TYPE_TEXT:
        itemView = new WebDoc.TextView(item, this);
        break;
      case WebDoc.ITEM_TYPE_IMAGE:
        itemView = new WebDoc.ImageView(item, this);
        break;
      case WebDoc.ITEM_TYPE_DRAWING:
        itemView = new WebDoc.DrawingView(item, this);
        break;
      case WebDoc.ITEM_TYPE_WIDGET:
        itemView = new WebDoc.WidgetView(item, this);
        break;
      default:
        itemView = new WebDoc.ItemView(item, this);
        break;
    }
    this.itemViews[item.uuid()] = itemView;
    return itemView;
  }
});
