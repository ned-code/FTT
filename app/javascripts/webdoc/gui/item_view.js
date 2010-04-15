
//= require <mtools/record>
//= require <webdoc/model/item>


WebDoc.ItemView = $.klass({
  item: null,
  pageView: null,
  initialize: function(item, pageView, afterItem) {
  
    if (pageView) {
      this.pageView = pageView;
    }
    else {
      throw "cannot create item view without a parent page view";
    }
    
    this.item = item;
    // item wrapper    
    this.domNode = $("<div/>").addClass("item_wrap"); 

    this.itemDomNode = this.createDomNode().addClass("item").addClass("layer webdoc").css({
        overflow: "hidden",
        width: "100%",
        height: "100%"
      });
    this.itemLayerDomNode = $("<div>").addClass("layer").addClass("screen").addClass("item-layer");
    this.itemLayerDomNode.css("display", "block");
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
    // css must be applied to item node. Only position and size must be set to dom node wrapper
    var position = {
      top: this.item.data.data.css.top,
      left: this.item.data.data.css.left,
      width: this.item.data.data.css.width,
      height: this.item.data.data.css.height
    };
    this.domNode.css(position);

    var itemCss = {};
    $.extend(itemCss, this.item.data.data.css);
    delete itemCss.top;
    delete itemCss.left;
    delete itemCss.width;
    delete itemCss.height;
    this.itemDomNode.css(itemCss);

    if (this.item.data.data.innerHTML) {
      this.innerHtmlChanged();
    }
  },
  
  createDomNode: function() {
    var itemNode;
    if (WebDoc.application.pageEditor.disableHtml) {
      itemNode = $('<div/>');
      itemNode.css(this.item.data.data.css);
    }
    else {
      itemNode = $('<' + this.item.data.data.tag + '/>');
      for (var key in this.item.data.data) {
        switch(key) {
          case "innerHTML":
          // for compatibility we also check innerHtml like this because old cocument can have this key instead of innerHTML
          case "innerHtml":
          case "css":        
          case "preference":
          case "properties":
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
  
  objectChanged: function(item) {
    // css must be applied to item node. Only position and size must be set to dom node wrapper
    var position = {
      top: this.item.data.data.css.top,
      left: this.item.data.data.css.left,
      width: this.item.data.data.css.width,
      height: this.item.data.data.css.height
    };
    this.domNode.stop();
    this.domNode.animate(position, 'fast', function() {
      if (this.domNode.hasClass("item-edited")) {
        WebDoc.application.boardController._updateScreens(this.domNode);
      }
    }.pBind(this));
    if (this.itemDomNode) {
      var itemCss = {};
      $.extend(itemCss, this.item.data.data.css);
      delete itemCss.top;
      delete itemCss.left;
      delete itemCss.width;
      delete itemCss.height;
      if (itemCss.overflow && this.domNode.hasClass("item-edited")) {
        delete itemCss.overflow;  
      }
      this.itemDomNode.css(itemCss);
    }
  },
 
  
  innerHtmlChanged: function() {
    if (!WebDoc.application.pageEditor.disableHtml) {    
      this.itemDomNode.html($.string().stripScripts(this.item.data.data.innerHTML));
    }
  },
  
  domNodeChanged: function() {
    if (!WebDoc.application.pageEditor.disableHtml) {
      this.unSelect();
      this.itemDomNode.remove();
      this.itemDomNode = this.createDomNode().addClass("item").addClass("layer webdoc").css({
        overflow: "hidden",
        width: "100%",
        height: "100%"
      });
      this.domNode.append(this.itemDomNode);
      this.select();
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
  },
  
  unSelect: function() {
    this.domNode.removeClass("item_selected");
    this.domNode.draggable( 'destroy' );
    this.domNode.resizable( 'destroy' );
  },
  
  canEdit: function() {
    return false;
  },
  
  edit: function() {
    //by default item views are not editable (if your item is editable override this method in the subclass) 
    this.domNode.addClass("item-edited");
    this.itemLayerDomNode.hide();
//    this.domNode.draggable( 'destroy' );
//    this.domNode.resizable( 'destroy' );
    WebDoc.application.rightBarController.showItemInspector();    
    WebDoc.application.inspectorController.selectPalette(this.inspectorId());
  },
  
  stopEditing: function() {
    this.domNode.removeClass("item-edited");
    this._initDragAndResize();
    this.itemLayerDomNode.show();

  },
  
  destroy: function() {
    this.item.removeListener();
  },
  
  _initDragAndResize: function() {
    this.domNode.draggable({
      containment: "parent",
      cursor: 'move',
      distance: 5,
      start: function(e, ui) {
        ddd("start drag");
        this.pageView.eventCatcherNode.show();
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        var currentPosition = {top: this.item.data.data.css.top, left: this.item.data.data.css.left};

        this.dragOffsetLeft = mappedPoint.x - parseFloat(currentPosition.left);
        this.dragOffsetTop = mappedPoint.y - parseFloat(currentPosition.top);
        WebDoc.application.undoManager.registerUndo(function() {
          WebDoc.ItemView._restorePosition(this.item, currentPosition);
        }.pBind(this));
        WebDoc.application.arrowTool.disableHilight();
      }.pBind(this)        ,
      drag: function(e, ui) {
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        ui.position.left = mappedPoint.x - this.dragOffsetLeft;
        ui.position.top = mappedPoint.y - this.dragOffsetTop;
        this._moveTo(ui.position);
      }.pBind(this)        ,
      stop: function(e, ui) {
        this.pageView.eventCatcherNode.hide();
        var newPosition = { top : ui.position.top + "px", left: ui.position.left + "px"};
        this.item.moveTo(newPosition);
        this.item.save();
        WebDoc.application.arrowTool.enableHilight();
      }.pBind(this)
    }).resizable({
      handles: 's, e, se',
      start: function(e, ui) {
        this.pageView.eventCatcherNode.show();
        this.resizeOrigin = WebDoc.application.boardController.mapToPageCoordinate(e);
        this.aspectRatio = ui.size.width / ui.size.height;
        var currentSize = { width: this.item.data.data.css.width, height: this.item.data.data.css.height};
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
        var newSize = { width: ui.size.width + "px", height: ui.size.height + "px"};
        this.item.resizeTo(newSize);
        this.item.save();
      }.pBind(this)
    });    
  },
  
  _moveTo: function(position) {
    var inspectorController = WebDoc.application.inspectorController;
    
    this.item.data.data.css.left = position.left + "px";
    this.item.data.data.css.top = position.top + "px";
    this.domNode.css({
      top: this.item.data.data.css.top,
      left: this.item.data.data.css.left
    });
    
    if (inspectorController) {
      inspectorController.refreshProperties();
    }
  },
  
  _resizeTo: function(size) {
    var inspectorController = WebDoc.application.inspectorController;
    
    this.item.data.data.css.width = size.width + "px";
    this.item.data.data.css.height = size.height + "px";
    this.domNode.css({
      width: this.item.data.data.css.width,
      height: this.item.data.data.css.height
    });
    
    if (inspectorController) {
      inspectorController.refreshProperties();
    }
    if (this.domNode.hasClass("item-edited")) {
      WebDoc.application.boardController._updateScreens(this.domNode);
    }
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

