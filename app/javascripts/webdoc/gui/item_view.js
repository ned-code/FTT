
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

    this.itemDomNode = this.createDomNode().addClass("item").addClass("layer").css("overflow", "hidden");
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
    this.domNode.css(this.item.data.data.css);
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
          case "innerHtml":
            itemNode.html(this.item.data.data[key]);
            break;
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
  
  coverPoint: function(point) {
  
    if (this.item.type() != "drawing") {
      var pointMatrix = $M([[point.x - this.item.position.left], [point.y - this.item.position.top], [1]]);
      var mat_str = this.domNode.css("-moz-transform");
      var converted_point = {};
      converted_point.x = point.x;
      converted_point.y = point.y;
      if (mat_str && mat_str !== "" && mat_str.indexOf("matrix") >= 0) {
        var matrixPointsString = mat_str.substr(mat_str.indexOf("(") + 1, mat_str.length - (mat_str.indexOf("(") + 2));
        var matrixPoints = matrixPointsString.split(", ");
        var matrix = $M([[matrixPoints[0], matrixPoints[2], matrixPoints[4].replace("px", "")], [matrixPoints[1], matrixPoints[3], matrixPoints[5].replace("px", "")], [0, 0, 1]]);
        
        var convertedPointMatrix = matrix.inv().x(pointMatrix);
        
        converted_point.x = convertedPointMatrix.elements[0][0] + this.item.position.left;
        converted_point.y = convertedPointMatrix.elements[1][0] + this.item.position.top;
      }
      if (this.item.position.left < converted_point.x && this.item.position.left + this.item.size.width > converted_point.x) {
        if (this.item.position.top < converted_point.y && this.item.position.top + this.item.size.height > converted_point.y) {
        
          return true;
          
        }
      }
    }
    return false;
  },
  
  objectChanged: function(item) {
    this.domNode.animate(item.data.data.css, 'fast');
  },
 
  
  innerHtmlChanged: function() {
    if (!WebDoc.application.pageEditor.disableHtml) {    
      this.itemDomNode.html(this.item.data.data.innerHTML);
    }
  },
  
  domNodeChangedChanged: function() {
    if (!WebDoc.application.pageEditor.disableHtml) {
      this.unSelect();
      this.itemDomNode.remove();
      this.itemDomNode = this.createDomNode();
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
        // board must ignore this event. It is just for draggable elemnt
        lastSelectedObjectMouseDownEvent.boardIgnore = true;
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
    this.domNode.draggable( 'destroy' );
    this.domNode.resizable( 'destroy' );
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
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        var currentPosition = {};
        $.extend(currentPosition, this.item.position);
        this.dragOffsetLeft = mappedPoint.x - this.item.position.left;
        this.dragOffsetTop = mappedPoint.y - this.item.position.top;
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
        this.item.moveTo(ui.position);
        this.item.save();
        WebDoc.application.arrowTool.enableHilight();
      }.pBind(this)
    }).resizable({
      handles: 's, e, se',
      start: function(e, ui) {
        this.resizeOrigin = WebDoc.application.boardController.mapToPageCoordinate(e);
        var currentSize = {};
        $.extend(currentSize, this.item.size);
        ddd("current size" + currentSize.width);
        WebDoc.application.undoManager.registerUndo(function() {
          WebDoc.ItemView._restoreSize(this.item, currentSize);
        }.pBind(this));
      }.pBind(this)        ,
      resize: function(e, ui) {
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        var newWidth = ui.originalSize.width + (mappedPoint.x - this.resizeOrigin.x);
        var newHeight = ui.originalSize.height + (mappedPoint.y - this.resizeOrigin.y);
        if(e.shiftKey){
          // Must maintain image ratio on resize
          var imgRatio=this.item.size.width/this.item.size.height;
          ui.size.width = imgRatio*newHeight;
        }
        else {
          ui.size.width = newWidth;
        }
        ui.size.height =newHeight;

        this._resizeTo(ui.size);
      }.pBind(this)        ,
      stop: function(e, ui) {
        this.item.resizeTo(ui.size);
        this.item.save();
      }.pBind(this)
    });    
  },
    
  createSelectedFrame: function() {
  },
  
  _moveTo: function(position) {
    this.item.position.left = position.left;
    this.item.position.top = position.top;
    this.item.data.data.css.left = this.item.position.left + "px";
    this.item.data.data.css.top = this.item.position.top + "px";
    this.domNode.css({
      top: this.item.data.data.css.top,
      left: this.item.data.data.css.left
    });
    WebDoc.application.inspectorController.refreshSubInspectors();
  },
  
  _resizeTo: function(size) {
    this.item.size.width = size.width;
    this.item.size.height = size.height;
    this.item.data.data.css.width = this.item.size.width + "px";
    this.item.data.data.css.height = this.item.size.height + "px";
    this.domNode.css({
      width: this.item.data.data.css.width,
      height: this.item.data.data.css.height
    });
    WebDoc.application.inspectorController.refreshSubInspectors();
  }
});

$.extend(WebDoc.ItemView, {
  _restorePosition: function(item, position) {
    ddd("restore position" + position.left + ":" + position.top);
    var previousPosition = {};
    $.extend(previousPosition, item.position);
    
    ddd("store previous pos " + previousPosition.left + ":" + previousPosition.top);
    item.moveTo(position);
    WebDoc.application.undoManager.registerUndo(function() {
      WebDoc.ItemView._restorePosition(item, previousPosition);
    }.pBind(this));
    item.save();
  },
  
  _restoreSize: function(item, size) {
    ddd("restore size" + size.height + ":" + size.width);
    var previousSize = {};
    $.extend(previousSize, item.size);
    item.resizeTo(size);
    WebDoc.application.undoManager.registerUndo(function() {
      WebDoc.ItemView._restoreSize(item, previousSize);
    }.pBind(this));
    item.save();
  }
});

