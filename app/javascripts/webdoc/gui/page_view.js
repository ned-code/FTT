//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.PageView = $.klass({
  initialize: function(page, boardContainer, editable) {
    var domNode = $('<div>', {
          'class': 'webdoc',
          id: 'page_' + page.uuid()
        }), 
        itemDomNode = $('<div/>').id('items_' + page.uuid()).addClass("layer").css({
          overflow: 'visible'
        }), 
        drawingDomNode = $(WebDoc.application.svgRenderer.createSurface()), eventCatcherNode = jQuery('<div/>').id("event-catcher_" + page.uuid()).addClass('screnn layer').css("zIndex", 2000000).hide(), that = this;
    
    
    // Extend this
    this._editable = undefined;
    this._boardContainer = boardContainer;
    this.setEditable(editable);
    this.page = page;
    this.domNode = domNode;

    this.drawingDomNode = drawingDomNode;
    this.itemDomNode = itemDomNode;
    this.eventCatcherNode = eventCatcherNode;
    this.itemViews = {};
    this._zoomFactor = 1;
    this.wait = null;
    // Set up page view
    this._initPageCss();
    this._initPageClass();
    drawingDomNode.css("zIndex", 1000000);
    domNode.append(drawingDomNode);
    this.domNode.append(itemDomNode);
    this.domNode.append(eventCatcherNode);

    this.externalPageDomNode = null;
    this.externalPageIframe = null;
    this.overLayer = null;
    if (page.data.data.externalPage && !WebDoc.application.disableHtml) {
      this._loadExternalPage();
    }
    if (page.items && $.isArray(page.items)) {
      $.each(page.items, function() {
        that.createItemView(this, "end");
      });
    }
    page.addListener(this);
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
    
    var afterItemView = afterItem ? this.itemViews[afterItem.uuid()] : null;
    if(afterItemView === null && this.page.data.data.externalPageUrl) {
      afterItemView = "end"
    }
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
  },
  
  setLoading: function(state) {
    this._loading = state;
    if (state) {
      this.itemDomNode.hide();
      WebDoc.application.boardController.loadingNode.addClass('loading');
    }  
    else {
      this.itemDomNode.show();
      WebDoc.application.boardController.loadingNode.removeClass('loading');
    }
  },
  
  isLoading: function(){
    return this._loading;
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
    
//    var afterItemView = afterItem ? this.findItemView(afterItem.uuid()) : null;
//    if (afterItemView && itemViewToMove != afterItemView) {
//      afterItemView.domNode.after(itemViewToMove.domNode);
//    }
//    else 
//      if (!afterItemView) {
//        this.itemDomNode.prepend(itemViewToMove.domNode);
//      }
//    itemViewToMove.viewDidLoad();
    itemViewToMove.domNode.css("zIndex", 500000 + item.positionZ());
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
      case WebDoc.ITEM_TYPE_HTML:
        itemView = new WebDoc.HtmlView(item, this, afterItem);
        break;        
      case WebDoc.ITEM_TYPE_IFRAME:
        itemView = new WebDoc.IframeView(item, this, afterItem);
        break;
      case WebDoc.ITEM_TYPE_APP:
        itemView = new WebDoc.AppView(item, this, afterItem);
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
    var heightFactor = height / this.page.height("px");
    var widthFactor = width / this.page.width("px");
    if (heightFactor < widthFactor) {
      zoomToFit = heightFactor;
    }
    else {
      zoomToFit = widthFactor;
    }
    this.setZoomFactor(zoomToFit);
    // try to set all flash content as windowless
    this.itemDomNode.find("embed[type='application/x-shockwave-flash']").each(function(index, element) {
      $(this).attr('wmode', 'transparent');
    });
  },
  
  setZoomFactor: function(factor) {
    var transform = {};
    this._zoomFactor = factor;
    transform.WebkitTransform = this._zoomFactor === 1 ? "" : "scale(" + this._zoomFactor + ")";
    transform.MozTransform = transform.WebkitTransform;
    transform.width = 100 / this._zoomFactor + '%';
    transform.height = 100 / this._zoomFactor + '%';
    ddd("zoom to fit", this._zoomFactor);
    this.domNode.css(transform);
    this._initPageSize();
  },
  
  viewDidLoad: function() {
    for (var itemId in this.itemViews) {
      var anItemView = this.itemViews[itemId];
      anItemView.viewDidLoad();
      ddd("item view", anItemView);
    }
  },
  
  _initPageCss: function() {
    this.page.getLayout(function(layout) {
      var globalCss = {};
      
      if (layout) {
        jQuery.extend(globalCss, layout.getModelPage().data.data.css);
      }
      jQuery.extend(globalCss, this.page.data.data.css);
      
      delete globalCss.width;
      delete globalCss.height;
      //domNode.attr( 'style', '' ).css( wrapCss );
      if(this.page.hasBackgroundGradient()){
				delete globalCss.backgroundImage;
				this.domNode.attr( 'style', this.page.getBackgroundGradient() ).css(globalCss);
			}
			else{
				this.domNode.css(globalCss);
			}
      this._initPageSize();
      
    }.pBind(this));
  },
  
  _initPageSize: function() {
    var unit = null;
    var boardContainerCss;
    if (this._zoomFactor !== 1) {
      boardContainerCss = {
        width: this.page.width("px") * this._zoomFactor,
        height: this.page.height("px") * this._zoomFactor
      };
    }
    else {
      boardContainerCss = {
        width: this.page.width(),
        height: this.page.height()
      };
    }
    this._boardContainer.css(boardContainerCss);
    
  },
  
  _initPageClass: function() {
    this.domNode.attr("class", "webdoc");
    this.domNode.addClass(this.page.getClass());
    
    this.page.getLayout(function(layout) {
      if (layout) {
        this.domNode.addClass(layout.getModelPage().data.data['class']);
      }
    }.pBind(this));
  },
  
  _loadExternalPage: function() {
    if (this.page.data.data.externalPageUrl) {
      if(!this.externalPageDomNode) {
        this._createExternalPageDomNode();
      }
      if(!this.wait) {
        this.wait = jQuery('<div class="center layer"><div class="center-cell"><div class="center-box"><center><img src="/images/icons/waiting_wheel.gif"/></center></div></div></div>');
      }
      this.externalPageIframe.bind('load', function() {
        this.wait.remove();
      }.pBind(this));
      this.externalPageIframe.attr("src", this.page.data.data.externalPageUrl);
      this.itemDomNode.append(this.wait);
    }
  },

  _createExternalPageDomNode: function() {
    this.externalPageDomNode = $("<div/>").addClass('layer');
    this.overLayer = $("<div>").addClass("layer");
    this.overLayer.css("display", "block");
    this.externalPageIframe = $("<iframe/>").addClass('layer');
    this.externalPageDomNode.append(this.externalPageIframe);
    this.externalPageDomNode.append(this.overLayer);
    this.itemDomNode.append(this.externalPageDomNode);
  },

  setEditable: function(editable) {
    if (this._editable === undefined || editable !== this._editable) {
      this._editable = editable;
      
      if (editable) {
        if (this.overLayer) {
          this.overLayer.show();
        }
        jQuery(".item-layer").show();
      }
      else {
        if (this.overLayer) {
          this.overLayer.hide();
        }
        jQuery(".item-layer").hide();
      }

      if(this.externalPageIframe) {
        this.externalPageIframe.css('overflow', editable? 'hidden' : 'visible');
        this._loadExternalPage();
      }    
      
      for (var itemViewUuid in this.itemViews) {
        var anItemView = this.itemViews[itemViewUuid];
        anItemView.setEditable(editable);
      }  
    }
  },
  
  isEditable: function() {
    return this._editable;
  }

});
