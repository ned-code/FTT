
//= require <mtools/record>
//= require <webdoc/model/item>


WebDoc.ItemView = $.klass({
  item: null,
  pageView: null,
  initialize: function(item, pageView) {
  
    if (pageView) {
      this.pageView = pageView;
    }
    else {
      throw "cannot create item view without a parent page view";
    }
    
    this.item = item;
    this.domNode = this.createDomNode();
    
    item.addListener(this);
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
          case "css":
            itemNode.css(this.item.data.data.css);
            break; 
          case "innerHtml":
            itemNode.html(this.item.data.data[key]);
            break;
          case "preference":
          case "properties":
            break;
          default:
            itemNode.attr(key, this.item.data.data[key]);
        }
      }
    }
    this.selectionNode = $("<div/>").addClass("drag_handle");
    this.resizeNode = $("<div/>").addClass("resize_handle");
    itemNode.attr("id", this.item.uuid());
    
    this.pageView.itemDomNode.append(itemNode.get(0));
    itemNode.addClass("item");
    return itemNode;
  },
  
  inspectorId: function() {
    return 0;
  },
  
  remove: function() {
    if (this.isSelected()) {
      this.selectionNode.remove();
      this.resizeNode.remove();
    }
    this.domNode.remove();
  },
  
  coverPoint: function(point) {
  
    if (this.item.type() != "drawing") {
      var pointMatrix = $M([[point.x - this.item.position.left], [point.y - this.item.position.top], [1]]);
      var mat_str = this.domNode.css("-moz-transform");
      var converted_point = {};
      converted_point.x = point.x;
      converted_point.y = point.y;
      if (mat_str && mat_str != "" && mat_str.indexOf("matrix") >= 0) {
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
    this.resetHandles();
  },
  
  resetHandles: function() {
    var handleCss = {
      top: this.item.data.data.css.top,
      left: this.item.data.data.css.left,
      width: (this.item.size.width - 7) + "px",
      height: (this.item.size.height - 7) + "px"
    };
    this.selectionNode.css(handleCss);
    this.resizeNode.css(handleCss);
  },
  
  innerHtmlChanged: function() {
    if (!WebDoc.application.pageEditor.disableHtml) {    
      this.domNode.html(this.item.data.data.innerHTML);
    }
  },
  
  domNodeChangedChanged: function() {
    if (!WebDoc.application.pageEditor.disableHtml) {
      this.unSelect();
      this.domNode.remove();
      this.domNode = this.createDomNode();
      this.select();
    }
  },  
  
  isSelected: function() {
    return this.selectionNode.parent().length > 0;
  },
  
  select: function() {
    var lastSelectedObjectMouseDownEvent = WebDoc.application.arrowTool.lastSelectedObject.event;
    if (lastSelectedObjectMouseDownEvent) {
      lastSelectedObjectMouseDownEvent.preventDefault();
    }
    if (!this.isSelected()) {
      ddd("ItemView: select item " + this.item.uuid());
      this.domNode.addClass("item_selected");
      WebDoc.application.boardController.pageView.itemDomNode.append(this.selectionNode.get(0));
      WebDoc.application.boardController.pageView.itemDomNode.append(this.resizeNode.get(0));
      
      this.resetHandles();
      
      this.selectionNode.draggable({
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
        }.pBind(this)
      });
      
      if (lastSelectedObjectMouseDownEvent) {
        // board must ignore this event. It is just for draggable elemnt
        lastSelectedObjectMouseDownEvent.boardIgnore = true;
        this.selectionNode.trigger(lastSelectedObjectMouseDownEvent);
      }
      
      this.resizeNode.resizable({
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
          ui.size.width = newWidth;
          ui.size.height = newHeight;
          this._resizeTo(ui.size);
        }.pBind(this)        ,
        stop: function(e, ui) {
          this.item.resizeTo(ui.size);
          this.item.save();
        }.pBind(this)
      });
    }
  },
  
  unSelect: function() {
    this.domNode.removeClass("item_selected");
    this.selectionNode.remove();
    this.resizeNode.remove();
  },
  
  edit: function() {
    //by default item views are not editable (if your item is editable override this method in the subclass)    
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
    this.resetHandles();
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
    this.resetHandles();
    WebDoc.application.inspectorController.refreshSubInspectors();
  },  
});

$.extend(WebDoc.ItemView, {
  _restorePosition: function(item, position) {
    ddd("restore position" + position.left + ":" + position.top);
    var previousPosition = {};
    $.extend(previousPosition, item.position);
    
    ddd("store previous pos " + previousPosition.left + ":" + previousPosition.top)
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

