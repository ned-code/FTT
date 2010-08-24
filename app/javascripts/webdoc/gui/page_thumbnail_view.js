
WebDoc.PageThumbnailView = $.klass({
  //PER_CENT_PAGE_WIDTH: 1280,
  //PER_CENT_PAGE_HEIGHT: 720,
  SIZE_TO_REDUCE: {
    width: 800,
    height: 800
  },
  
  initialize: function(page, width, height) {
    var that = this;
    
    this.page = page;
    this.width = width;
    this.height = height;
    this.domNode = $('<div>').attr({
      'class': 'page_thumb',
      'data-webdoc-page': page.uuid()
    });
    this.pageThumbNode = $('<div/>');
    this.drawingDomNode = $( WebDoc.application.svgRenderer.createSurface() );
    this.drawingDomNode.css("zIndex", 1000000);
    this.itemDomNode = $('<div>').attr({
      id: "thumb_items",
      'class': "layer"
    });
    
    this.pageThumbNode
    .append( this.drawingDomNode )
    .append( this.itemDomNode );   
    
    this.itemViews = {};
    if (page.items && $.isArray(page.items)) {
      $.each(page.items, function() {
        that.createItemView(this);
      });
    }
    
    page.addListener(this);
    this._initPageCss();
    this._initPageClass();
    this.domNode.append( this.pageThumbNode );
  },
  
  destroy: function() {
    ddd("destroy page thumb view", this);
    this.page.removeListener(this);
    this.domNode.remove();
  },
  
  _calcOrigin: function calcOrigin( page, thumb, factor ){
    return ( thumb - ( page * factor ) ) / ( 2 * ( 1 - factor ) );
  },
  
  _initPageCss: function() {
    // define scale factor
    var css = this.page.data.data.css,
        regex = jQuery.regex,
        hFactor = this.width / this.SIZE_TO_REDUCE.width,
        vFactor = this.height / this.SIZE_TO_REDUCE.height,
        factor = hFactor < vFactor ? hFactor : vFactor,
        widthInPx = css.width ? regex.pxValue.test( this.page.width() ) : false,
        heightInPx = css.height ? regex.pxValue.test( this.page.height() ) : false,
        pageWidth = widthInPx ? parseInt( css.width, 10 ) : this.PER_CENT_PAGE_WIDTH,
        pageHeight = heightInPx ? parseInt( css.height, 10 ) : this.PER_CENT_PAGE_HEIGHT;
    
    if(this.page.hasBackgroundGradient()){
      delete css.backgroundImage;
      this.pageThumbNode.attr( 'style', this.page.getBackgroundGradient() ).css(css);
    }
    else{
      delete css.backgroundGradient;
      this.pageThumbNode.attr( 'style', '' );
      this.pageThumbNode.css(css);
    }
    
    // this.pageThumbNode.css(this.page.data.data.css);
    
    // To use a central square of the page to make the thumb
    
    //this.pageThumbNode.css({
    //  MozTransformOrigin: "50% 50%",
    //  MozTransform: "scale(" + factor + ")",
    //  WebkitTransformOrigin: "50% 50%",
    //  WebkitTransform: "scale(" + factor + ")",
    //  width: pageWidth,
    //  marginLeft: -pageWidth/2,
    //  height: pageHeight,
    //  marginTop: -pageHeight/2,
    //  position: 'absolute',
    //  left: '50%',
    //  top: '50%'
    //});
    
    // To take the top left square of the page to make the thumb
    
    var w = this.SIZE_TO_REDUCE.width > pageWidth ? pageWidth : this.SIZE_TO_REDUCE.width ;
    var h = this.SIZE_TO_REDUCE.height > pageHeight ? pageHeight : this.SIZE_TO_REDUCE.width ;
    
    var xOrigin = this._calcOrigin( w, this.width, factor );
    var yOrigin = this._calcOrigin( h, this.height, factor );
    
    this.pageThumbNode.css({
      MozTransformOrigin: xOrigin + "px " + yOrigin + "px",
      MozTransform: "scale(" + factor + ")",
      WebkitTransformOrigin: xOrigin + "px " + yOrigin + "px",
      WebkitTransform: "scale(" + factor + ")",
      width: pageWidth,
      height: pageHeight
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
      case WebDoc.ITEM_TYPE_TEXTBOX:
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
      case WebDoc.ITEM_TYPE_IFRAME:
        itemView = new WebDoc.IFrameThumbnailView(item, this, afterItem);
        break;      
      default:
        itemView = new WebDoc.ItemThumbnailView(item, this, afterItem);
        break;
    }
    this.itemViews[item.uuid()] = itemView;
    
    return itemView;
  },
  
  _initPageClass: function() {
    this.pageThumbNode.attr('class', "webdoc");
    this.pageThumbNode.addClass(this.page.data.data['class']);
    this.page.getLayout(function(layout) {
      if (layout) {
        this.pageThumbNode.addClass(layout.getModelPage().data.data['class']);
      }
    }.pBind(this));
  }
});