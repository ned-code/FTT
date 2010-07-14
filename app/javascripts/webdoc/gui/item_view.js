WebDoc.ItemView = $.klass({

  // Define all css keys that must be set at the wrap level of item
  WRAP_CSS_KEYS: {
    top: true,
    left: true,
    bottom: true,
    right: true,
    width: true,
    height: true,
    transform: true,
    maxWidth: true,
    maxHeight: true,
    minWidth: true,
    minHeight: true
  },

  // Define all css keys that must be translated into
  // browser specific keys (-moz and -webkit)
  BROWSER_CSS_KEYS: {
    transform: true,
    transition: true,
    borderRadius: true,
    boxShadow: true
  },
  
  // Classes applied to the item in initItemClass
  ITEMCLASSES: "item layer",
  
  initialize: function(item, pageView, afterItem) {
    if (pageView) {
      this.pageView = pageView;
    }
    else {
      throw "cannot create item view without a parent page view";
    }
    
    this.item = item;
    
    this._editable = pageView.isEditable();
    // item wrapper
    this.domNode = $("<div/>").addClass('item_wrap').css("zIndex", 500000 + this.item.positionZ());

    this.itemLayerDomNode = $("<div>").addClass("layer item-layer").css("display", this._editable? "block" : "none");    
    this.itemDomNode = this.createDomNode();
    
    this.domNode.append(this.itemDomNode);
    this.domNode.append(this.itemLayerDomNode);
    
    this.domNode.id(this.item.uuid());
    this.domNode.data("itemView", this);
    
    item.addListener(this);
    
    if (afterItem) {
      if (afterItem == "end") {
        this.pageView.itemDomNode.append(this.domNode);
      }
      else {
        afterItem.domNode.after(this.domNode);
      }
    }
    else {
      this.pageView.itemDomNode.prepend(this.domNode);
    }
    
    // if item has no css we just set its css to empty hash.
    // It avoids to always check ater it item has css.
    if (!this.item.data.data.css) {
      this.item.data.data.css = {};
    }
    
    if (this.item.getInnerHtml() && !jQuery.string(this.item.getInnerHtml()).empty()) {
      this.innerHtmlChanged();
    }
    
    this._initItemClass();
    this._initItemCss(false);
    this.inspectorPanesManager = WebDoc.InspectorPanesManager.instanceFor(this); 
    this.inspectorPanesManager.createOpenFloatingInspectorButton(this);
  },
  
  inspectorGroupName: function() {
    return "ItemInspectorGroup"  
  },
  
  _initItemClass: function() {
    this.itemDomNode.attr("class", this.ITEMCLASSES);
    this.itemDomNode.addClass(this.item.getClass());
    
    // we put all item classes in wdClasses data. It is used to know which classes to remove when classes of item changed.
    if (this.domNode.data('wdClasses')) {
      this.domNode.removeClass(this.domNode.data('wdClasses'));
    }
    if (this.item.data.data.wrapClass && this.item.data.data.wrapClass) {
      this.domNode.addClass(this.item.data.data.wrapClass);
      this.domNode.data('wdClasses', this.item.data.data.wrapClass);
    }
  },
  
  _initItemCss: function( withAnimate ) {
    var domNode = this.domNode,
        itemDomNode = this.itemDomNode,
        css = this.item.data.data.css,
        wrapCss = { zIndex: 500000 + this.item.positionZ() },
        itemCss = { overflow: 'hidden' },
        key, timer;
    
    // Split css object into css to be applied to item_wrap
    // and css to be applied to item
    for ( key in css ) {
      if ( this.WRAP_CSS_KEYS[key] ) {
        wrapCss[key] = css[key];
      }
      else {
        itemCss[key] = css[key];
      }
    }
    
    // Loop through the results and apply browser specific
    // extensions where needed
    for ( key in wrapCss ) {
      if ( this.BROWSER_CSS_KEYS[key] ) {
        wrapCss['-webkit-'+key] = wrapCss['-moz-'+key] = wrapCss[key];
      }
    }
    
    for ( key in itemCss ) {
      if ( this.BROWSER_CSS_KEYS[key] ) {
        itemCss['-webkit-'+key] = itemCss['-moz-'+key] = itemCss[key];
      }
    }
    
    // TODO: feature detect css transition, and use javascript animation if not present
    
    //var canAnimate = position.top && position.left && position.width && position.height;
    //this.domNode.stop();
    
    //if (withAnimate && canAnimate) {
    //  this.domNode.animate(position, 'fast', function() {
    //    if (this.domNode.hasClass("item-edited")) {
    //      WebDoc.application.boardController._updateScreens(this.domNode);
    //    }
    //  }.pBind(this));
    //}
    //else {
    //  this.domNode.css( position );
    //}
    
    // Animate using css transitions given by the animate class
    // TODO: The timer would be done better
    // by making use of the "transitionend" event
    if ( withAnimate ) {
      domNode.addClass('animate');
      timer = setTimeout(function(){
        domNode.removeClass('animate');
        timer = null;
      }, 500);
    }
    
    domNode.attr( 'style', '' ).css( wrapCss );
    
    // apply item css if needed (drawing item view has no item dom node)
    if (itemDomNode) {      
      itemDomNode.attr( 'style', '' ).css( itemCss );
    }
  },
  
  createDomNode: function() {
    var itemNode;
    if (WebDoc.application.disableHtml) {
      itemNode = $('<div/>');
      itemNode.css(this.item.data.data.css);
    }
    else {
      itemNode = $('<' + this.item.data.data.tag + '/>');
      for (var key in this.item.data.data) {
        switch(key) {
          case "class": 
          case "wrapClass": 
          case "innerHTMLPlaceholder":
          case "tag":
          case "css":
          case "preference":
          case "properties":
          case "preserve_aspect_ratio":
          case "is_placeholder":
            break;
          default:
            itemNode.attr(key, this.item.data.data[key]);
        }
      }
    }
    return itemNode;
  },
  
  inspectorId: function() {
    return 0;
  },
  
  remove: function() {
    this.domNode.remove();
  },
  
  objectChanged: function(item, options) {
    if (item._isAttributeModified(options, 'css')) {
      this._initItemCss(true);
    }
    if (item._isAttributeModified(options, 'class')) {
      this._initItemClass();
    }
    this.inspectorPanesManager.updateAttachedPanePositionAndContent(this);    
  },

  innerHtmlChanged: function() {
    if (!WebDoc.application.disableHtml && this.item.data.data.tag !== "iframe") {    
      this.itemDomNode.html($.string().stripScripts(this.item.getInnerHtml()));
    }
  },
  
  domNodeChanged: function() {
    if (!WebDoc.application.disableHtml) {
      this.unSelect();
      this.itemDomNode.remove();
      this.itemDomNode = this.createDomNode().addClass("item").addClass("layer").css({
        overflow: "hidden",
        width: "100%",
        height: "100%"
      });
      this.domNode.prepend(this.itemDomNode);
      if (this.item.getInnerHtml() && !jQuery.string(this.item.getInnerHtml()).empty()) {
        this.innerHtmlChanged();
      }      
      //this.select();
    }
  },  
  
  isSelected: function() {
    return this.domNode.hasClass("item_selected");
  },
  
  select: function() {
    var lastSelectedObjectMouseDownEvent = WebDoc.application.arrowTool.lastSelectedObject.event;
    if (lastSelectedObjectMouseDownEvent) {
      lastSelectedObjectMouseDownEvent.preventDefault();
    }
    if (!this.isSelected()) {
      ddd("ItemView: select item " + this.item.uuid());
      this.domNode.addClass("item_selected");
      this._initDragAndResize();      
      if (lastSelectedObjectMouseDownEvent) {
        this.domNode.trigger(lastSelectedObjectMouseDownEvent);
      }      
    }
    this.inspectorPanesManager.itemDidSelect(this);    
  },
  
  unSelect: function() {
    this.domNode.removeClass("item_selected");
    this.domNode.draggable( 'destroy' );
    this.domNode.resizable( 'destroy' );
    this.inspectorPanesManager.itemDidUnselect(this);    
  },
  
  canEdit: function() {
    return true;
  },
  
  edit: function() {
    //by default item views are not editable (if your item is editable override this method in the subclass) 
    WebDoc.application.rightBarController.showItemInspector();    
    WebDoc.application.inspectorController.selectInspector(this.inspectorGroupName());
    this.itemLayerDomNode.hide();    
    this.domNode.addClass("item-edited");    
    this.domNode.css("zIndex", "");
  },
  
  stopEditing: function() {
    this.itemLayerDomNode.show();
    this.domNode.removeClass("item-edited");    
    this.domNode.css("zIndex", 500000 + this.item.positionZ());
  },
  
  destroy: function() {
    this.item.removeListener();
  },
  
  viewDidLoad: function() {
    
  },
  
  position: function() {
    var result = { top: this.item.top(), left: this.item.left() };
    result.topInherted = (result.top === undefined);
    result.leftInherted = (result.left === undefined);
    result.top = result.top || this.domNode.position().top + 'px';
    result.left =  result.left || this.domNode.position().left + 'px';
    return result;
  },
  
  size: function() {
    var result = { width: this.item.width(), height: this.item.height() };
    result.widthInherted = (result.width === undefined);
    result.heightInherted = (result.height === undefined);    
    result.width = result.width || this.domNode.width() + 'px';
    result.height = result.height || this.domNode.height() + 'px';
    return result;
  },
  
  css: function(){
    return this.item.data.data.css;
  },
  
  setEditable: function(editable) {
    this._editable = editable;  
  },
  
  
  _initDragAndResize: function() {
    this.domNode.draggable({
      containment: "parent",
      cursor: 'move',
      distance: 5,
      start: function(e, ui) {
        this.pageView.eventCatcherNode.show();
        this.inspectorPanesManager.itemViewWillMove(this);
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        this.currentPosition = this.position();

        this.dragOffsetLeft = mappedPoint.x - parseFloat(this.currentPosition.left);
        this.dragOffsetTop = mappedPoint.y - parseFloat(this.currentPosition.top);
				
        WebDoc.application.undoManager.registerUndo(function() {
          WebDoc.ItemView._restorePosition(this.item, this.currentPosition);
        }.pBind(this));
        WebDoc.application.arrowTool.disableHilight();
      }.pBind(this)        ,
      drag: function(e, ui) {
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
				var leftOffset = mappedPoint.x - this.dragOffsetLeft;
				var topOffset = mappedPoint.y - this.dragOffsetTop;
				
				var originTop = parseFloat(this.currentPosition.top);
				var originLeft = parseFloat(this.currentPosition.left);
				var oldPosition = this.position();
				
        ui.position.left = leftOffset;
        ui.position.top = topOffset;
        this._moveTo(ui.position);

				var deltaLeft = parseFloat(this.position().left) - parseFloat(oldPosition.left) ;
				var deltaTop = parseFloat(this.position().top) - parseFloat(oldPosition.top) ;
				this.delta = { top: deltaTop, left: deltaLeft};

				if(WebDoc.application.boardController.multipleSelection()){
					WebDoc.application.boardController.moveMultipleSelection(this.delta,this.item.uuid(), false);
				}
      }.pBind(this)        ,
      stop: function(e, ui) {
        this.pageView.eventCatcherNode.hide();
        this.inspectorPanesManager.itemViewDidMove(this);
        var newPosition = { top : ui.position.top + "px", left: ui.position.left + "px"};
				if(WebDoc.application.boardController.multipleSelection()){
					WebDoc.application.boardController.moveMultipleSelection(this.delta, this.item.uuid(), true);
				}
        this.item.moveTo(newPosition);
        this.item.save();
        WebDoc.application.arrowTool.enableHilight();
      }.pBind(this)
    }).resizable({
      handles: 's, e, se',
      start: function(e, ui) {
        this.pageView.eventCatcherNode.show();
        this.inspectorPanesManager.itemViewWillMove(this);
        this.resizeOrigin = WebDoc.application.boardController.mapToPageCoordinate(e);
        this.aspectRatio = ui.size.width / ui.size.height;
        var currentSize = this.size();
        WebDoc.application.undoManager.registerUndo(function() {
          WebDoc.ItemView.restoreSize(this.item, currentSize);
        }.pBind(this));
      }.pBind(this)        ,
      resize: function(e, ui) {
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        var newWidth = ui.originalSize.width + (mappedPoint.x - this.resizeOrigin.x);
        var newHeight = ui.originalSize.height + (mappedPoint.y - this.resizeOrigin.y);
        if(e.shiftKey || this.item.data.data.preserve_aspect_ratio === "true"){
          ui.size.width = this.aspectRatio*newHeight;
        }
        else {
          ui.size.width = newWidth;
        }
        ui.size.height =newHeight;

        this._resizeTo(ui.size);
      }.pBind(this)        ,
      stop: function(e, ui) {
        this.pageView.eventCatcherNode.hide();
        this.inspectorPanesManager.itemViewDidMove(this);        
        var newSize = { width: ui.size.width + "px", height: ui.size.height + "px"};
        this.item.resizeTo(newSize);
        this.item.save();
      }.pBind(this)
    });    
  },
  
  _moveTo: function(position) {
    this.item.data.data.css.left = position.left + "px";
    this.item.data.data.css.top = position.top + "px";
    this.domNode.css({
      top: this.item.data.data.css.top,
      left: this.item.data.data.css.left
    });
  },
  
  _resizeTo: function(size) {    
    this.item.data.data.css.width = size.width + "px";
    this.item.data.data.css.height = size.height + "px";
    this.domNode.css({
      width: this.item.data.data.css.width,
      height: this.item.data.data.css.height
    });
    
  },

  _isAttributeModified: function(options, attributeName) {
    if (options && options.modifedAttribute) {
      return (options.modifedAttribute.indexOf(attributeName) !== -1);
    }
    return true;
  }
  
});

$.extend(WebDoc.ItemView, {
  _restorePosition: function(item, position) {
    ddd("restore position" + position.left + ":" + position.top);
    var previousPosition = { left: item.data.data.css.left, top: item.data.data.css.top};
    
    ddd("store previous pos " + previousPosition.left + ":" + previousPosition.top);
    item.moveTo(position);
    WebDoc.application.undoManager.registerUndo(function() {
      WebDoc.ItemView._restorePosition(item, previousPosition);
    }.pBind(this));
    item.save();
  },
  
  restoreSize: function(item, size) {
    ddd("restore size" + size.height + ":" + size.width);
    var previousSize = { width: item.data.data.css.width, height: item.data.data.css.height};
    item.resizeTo(size);
    WebDoc.application.undoManager.registerUndo(function() {
      WebDoc.ItemView.restoreSize(item, previousSize);
    }.pBind(this));
    item.save();  
  }
});
