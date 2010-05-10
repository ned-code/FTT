//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.PageView = $.klass({
  initialize: function(page, boardContainer) {
    var domNode = $('<div>', {'class': 'webdoc', id: 'page_'+page.uuid() }),
        itemDomNode = $('<div/>').id('items_' + page.uuid()).addClass("layer").css({overflow: 'visible'}),
        drawingDomNode = $( WebDoc.application.svgRenderer.createSurface() ),
        eventCatcherNode = jQuery('<div/>').id("event-catcher_" + page.uuid()).addClass('screnn layer').css("zIndex", 2000000).hide(),
        that = this;

    
    // Extend this
    this._boardContainer = boardContainer;
    this.page = page;
    this.domNode = domNode;
    this.drawingDomNode = drawingDomNode;
    this.itemDomNode = itemDomNode;
    this.eventCatcherNode = eventCatcherNode;
    this.itemViews = {};
    
    // Set up page view
    this._initPageCss();
    this._initPageClass();
    drawingDomNode.css("zIndex", 1000000);
    domNode.append( drawingDomNode );    
    this.domNode.append( itemDomNode );
    this.domNode.append( eventCatcherNode );
    
    if (page.items && $.isArray(page.items)) {
        $.each(page.items, function() {
            that.createItemView(this, "end");
        });
    }
    page.addListener(this);    
    if (page.data.data.externalPage && !WebDoc.application.disableHtml) {
        this._loadExternalPage();
    }
  },
  
  objectChanged: function(page, options) {
    
    if (page._isAttributeModified(options, 'css')) {
      this._initPageCss();
    }
    if (page._isAttributeModified(options, 'class')) {
      this._initPageClass();      
    }
    if (page.data.data.externalPage && page._isAttributeModified(options, 'externalPageUrl')) {
      this._loadExternalPage();
    }
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
    itemViewToMove.viewDidLoad();
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
      case WebDoc.ITEM_TYPE_IFRAME:
        itemView = new WebDoc.IframeView(item, this, afterItem);
        break;
      case WebDoc.ITEM_TYPE_OS_GADGET:
        itemView = new WebDoc.OsGadgetView(item, this, afterItem);
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
    var heightFactor = height  / this.page.height("px");
    var widthFactor = width  / this.page.width("px");      
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
    transform.top = "0px";
    transform.left = "0px";
    transform.position = "absolute";
    ddd("zoom to fit", zoomToFit);
    boardContainerCss = {
      width: (this.page.width("px") * zoomToFit).toString() + "px",
      height: (this.page.height("px") * zoomToFit).toString() + "px"
    };
    ddd("board container css", boardContainerCss);
    this.domNode.css( transform );
    this._boardContainer.css( boardContainerCss );
    
    // try to set all flash content as windowless
    this.itemDomNode.find("embed[type='application/x-shockwave-flash']").each( function(index, element) {
      $(this).attr('wmode', 'transparent');
    });
  },
  
  viewDidLoad: function() {
    for (var itemId in this.itemViews) {
      var anItemView = this.itemViews[itemId];
      anItemView.viewDidLoad();
      ddd("item view", anItemView);
    }
  },
  
  _initPageCss: function() {
    var boardContainerSize = {},
        boardCss = {};
    boardContainerSize.top = this.page.data.data.css.top;
    boardContainerSize.left = this.page.data.data.css.left;
    boardContainerSize.width = this.page.data.data.css.width;
    boardContainerSize.height = this.page.data.data.css.height; 
    $.extend(boardCss, this.page.data.data.css);
    delete boardCss.top;
    delete boardCss.left;
    delete boardCss.width;
    delete boardCss.height;
    this._boardContainer.css( boardContainerSize );
    this.domNode.css(boardCss);
  },
  
  _initPageClass: function() {
    this.domNode.attr("class", "webdoc");
    this.domNode.addClass(this.page.data.data['class']);
    this.page.getLayout(function(layout) {
      if (layout) {
        this.domNode.addClass(layout.getModelPage().data.data['class']);
      }
    }.pBind(this));    
  },
  
  _loadExternalPage: function() {    
    this.itemDomNode.empty();
    // Handle case where page is an external webpage
    if (this.page.data.data.externalPageUrl) {
      var externalPage = $("<iframe/>").addClass('layer');
      
      wait = jQuery('<div class="center layer"><div class="center-cell"><div class="center-box"><center><img src="/images/icons/waiting_wheel.gif"/></center></div></div></div>');
      
      externalPage.bind('load', function() {
        wait.remove();
      }.pBind(this));
      externalPage.attr("src", this.page.data.data.externalPageUrl);
      this.itemDomNode.append(externalPage[0]);
      this.itemDomNode.append(wait);
    }    
  }
});
