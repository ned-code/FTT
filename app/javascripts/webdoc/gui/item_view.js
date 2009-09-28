
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.ItemView = $.klass({
  item: null,
  pageView: null,
  initialize: function(item, pageView) {
  
    ddd("create item view");
    if (pageView) {
      this.pageView = pageView;
    }
    else {
      this.pageView = WebDoc.application.boardController.pageView;
    }
    this.pageView.itemViews.push(this);
    this.item = item;
    
    this.domNode = this.createDomNode();
    // internal size and position are top, left width and height as float. Because in the css those values are string with px unit
    // and we need float values to marix transform.
    this.recomputeInternalSizeAndPosition();
    item.addListener(this);
  },
  
  createDomNode: function() {
  
    var itemNode = $('<' + this.item.data.data.tag + '/>');
    
    this.selectionNode = $("<div/>").addClass("drag_handle");
    this.resizeNode = $("<div/>").addClass("resize_handle");
    itemNode.attr("id", this.item.uuid());
    for (var key in this.item.data.data) {
      if (key == 'css') {
        itemNode.css(this.item.data.data.css);
      }
      else {
        if (key == 'innerHtml') {
          itemNode.html(this.item.data.data[key]);
        }
        else {
          if (key != 'tag' && key != 'preference') {
            itemNode.attr(key, this.item.data.data[key]);
          }
        }
      }
    }
    ddd(itemNode);
    this.pageView.itemDomNode.append(itemNode.get(0));
    itemNode.addClass("item");
    return itemNode;
  },
  
  coverPoint: function(point) {
  
    if (this.item.type() != "drawing") {
      var pointMatrix = $M([[point.x - this.position.left], [point.y - this.position.top], [1]]);
      var mat_str = this.domNode.css("-moz-transform");
      var converted_point = {};
      converted_point.x = point.x;
      converted_point.y = point.y;
      if (mat_str && mat_str != "" && mat_str.indexOf("matrix") >= 0) {
        var matrixPointsString = mat_str.substr(mat_str.indexOf("(") + 1, mat_str.length - (mat_str.indexOf("(") + 2));
        var matrixPoints = matrixPointsString.split(", ");
        var matrix = $M([[matrixPoints[0], matrixPoints[2], matrixPoints[4].replace("px", "")], [matrixPoints[1], matrixPoints[3], matrixPoints[5].replace("px", "")], [0, 0, 1]]);
        
        var convertedPointMatrix = matrix.inv().x(pointMatrix);
        
        converted_point.x = convertedPointMatrix.elements[0][0] + this.position.left;
        converted_point.y = convertedPointMatrix.elements[1][0] + this.position.top;
      }
      if (this.position.left < converted_point.x && this.position.left + this.size.width > converted_point.x) {
        if (this.position.top < converted_point.y && this.position.top + this.size.height > converted_point.y) {
          return true;
        }
      }
    }
    return false;
  },
  
  recomputeInternalSizeAndPosition: function() {
    var t = this.item.data.data.css.top || "0px",
        l = this.item.data.data.css.left || "0px",
        w = this.item.data.data.css.width || "100px",
        h = this.item.data.data.css.height || "100px";
    this.position = {
      top: parseFloat(t.replace("px", "")),
      left: parseFloat(l.replace("px", ""))
    };
    this.size = {
      width: parseFloat(w.replace("px", "")),
      height: parseFloat(h.replace("px", ""))
    };
  },
  
  objectChanged: function(item) {
    this.recomputeInternalSizeAndPosition();
    this.domNode.animate(item.data.data.css, 'fast');
    if (item.data.media_type == "drawing") {
      WebDoc.application.svgRenderer.updatePolyline(this.domNode.get(0), {
        points: item.data.data.points
      });
    }
  },
  
  shift: function(x, y) {
    var newPosition = {
      left: this.position.left + x,
      top: this.position.top + y
    };
    this.moveTo(newPosition);
  },
  
  moveTo: function(position) {
    this.position.left = position.left;
    this.position.top = position.top;
    this.item.data.data.css.left = this.position.left + "px";
    this.item.data.data.css.top = this.position.top + "px";
    this.domNode.css({
      top: this.item.data.data.css.top,
      left: this.item.data.data.css.left
    });
    this.resizeNode.css({
      top: this.item.data.data.css.top,
      left: this.item.data.data.css.left
    });
  },
  
  resizeTo: function(size) {
    this.size.width = size.width;
    this.size.height = size.height;
    this.item.data.data.css.width = this.size.width + "px";
    this.item.data.data.css.height = this.size.height + "px";
    this.domNode.css({
      width: this.item.data.data.css.width,
      height: this.item.data.data.css.height
    });
    this.selectionNode.css({
      width: this.item.data.data.css.width,
      height: this.item.data.data.css.height
    });
  },
  
  isSelected: function() {
    return this.selectionNode.parent().length > 0;
  },
  
  select: function() {
    if (!this.isSelected()) {
      console.log("ItemView: select item " + this.item.uuid());
      this.domNode.addClass("item_selected");
      WebDoc.application.boardController.pageView.itemDomNode.append(this.selectionNode.get(0));
      WebDoc.application.boardController.pageView.itemDomNode.append(this.resizeNode.get(0));
      var handleCss = {
        top: this.item.data.data.css.top,
        left: this.item.data.data.css.left,
        width: (this.size.width - 7) + "px",
        height: (this.size.height - 7) + "px"
      };
      this.selectionNode.css(handleCss);
      this.selectionNode.draggable({
        containment: "parent",
        cursor: 'move',
        start: function(e, ui) {
          var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
          var currentPosition = {};
          $.extend(currentPosition, this.position);
          this.dragOffsetLeft = mappedPoint.x - this.position.left;
          this.dragOffsetTop = mappedPoint.y - this.position.top;
          ddd("start move from point" + currentPosition.left + ":" + currentPosition.top);
          WebDoc.application.undoManager.registerUndo(function() {
            this._restorePosition(currentPosition);
          }.pBind(this));
        }.pBind(this)        ,
        drag: function(e, ui) {
          var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
          ui.position.left = mappedPoint.x - this.dragOffsetLeft;
          ui.position.top = mappedPoint.y - this.dragOffsetTop;
          this.moveTo(ui.position);
        }.pBind(this)        ,
        stop: function(e, ui) {
          this.item.save();
        }.pBind(this)
      });
      
      var lastSelectedObjectMouseDownEvent = WebDoc.application.arrowTool.lastSelectedObject.event;
      if (lastSelectedObjectMouseDownEvent) {
        // board must ignore this event. It is just for draggable elemnt
        lastSelectedObjectMouseDownEvent.boardIgnore = true;
        this.selectionNode.trigger(lastSelectedObjectMouseDownEvent);
      }
      
      this.resizeNode.css(handleCss);
      this.resizeNode.resizable({
        handles: 's, e, se',
        start: function(e, ui) {
          this.resizeOrigin = WebDoc.application.boardController.mapToPageCoordinate(e);
          var currentSize = {};
          $.extend(currentSize, this.size);
          ddd("start resize from size" + currentSize.height + ":" + currentSize.width);
          WebDoc.application.undoManager.registerUndo(function() {
            this._restoreSize(currentSize);
          }.pBind(this));
        }.pBind(this)        ,
        resize: function(e, ui) {
          var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
          var newWidth = ui.originalSize.width + (mappedPoint.x - this.resizeOrigin.x);
          var newHeight = ui.originalSize.height + (mappedPoint.y - this.resizeOrigin.y);
          ui.size.width = newWidth;
          ui.size.height = newHeight;
          this.resizeTo(ui.size);
        }.pBind(this)        ,
        stop: function(e, ui) {
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
  
  _restorePosition: function(position) {
    ddd("restore position" + position.left + ":" + position.top);
    var previousPosition = {};
    $.extend(previousPosition, this.position);
    this.moveTo(position);
    this.selectionNode.css(position);
    WebDoc.application.undoManager.registerUndo(function() {
      this._restorePosition(previousPosition);
    }.pBind(this));
    this.item.save();
  },
  
  _restoreSize: function(size) {
    ddd("restore size" + size.height + ":" + size.width);
    var previousSize = {};
    $.extend(previousSize, this.size);
    this.resizeTo(size);
    this.resizeNode.css(size);
    WebDoc.application.undoManager.registerUndo(function() {
      this._restoreSize(previousSize);
    }
.pBind(this));
    this.item.save();
  }
});


WebDoc.TextView = $.klass(WebDoc.ItemView, {
  edit: function() { //called if we clicked on an already selected textbox
    WebDoc.application.textTool.enterEditMode(this);
  },
  
  isEditing: function() {
    return this.domNode.closest("." + WebDoc.TEXTBOX_WRAP_CLASS).length > 0;
  },
  
  unSelect: function($super) {
    if (this.isEditing()) {
      WebDoc.application.textTool.exitEditMode();
    }
    $super();
  }
});

WebDoc.DrawingView = $.klass(WebDoc.ItemView, {
  createDomNode: function($super) {
    var newLine = WebDoc.application.svgRenderer.createPolyline(this.item);
    this.pageView.drawingDomNode.append(newLine);
    return $(newLine);
  }
});


WebDoc.WidgetView = $.klass(WebDoc.ItemView, {
  
  createDomNode: function($super) {
    var widgetNode = $super();
    /* 
    setTimeout(function(){
      ddd(widgetNode.get(0).contentDocument.body);
      widgetNode.get(0).contentDocument.body.addEventListener("mousedown", WebDoc.application.boardController.mouseDown.pBind(WebDoc.application.boardController), true);
      widgetNode.get(0).contentDocument.body.addEventListener("mousemove", WebDoc.application.boardController.mouseMove.pBind(WebDoc.application.boardController), true);
      widgetNode.get(0).contentDocument.body.addEventListener("mouseup", WebDoc.application.boardController.mouseUp.pBind(WebDoc.application.boardController), true);
    }, 2000);
    */
    setTimeout(function(){
      this.initWidget();
    }.pBind(this), 2000);
    
    return widgetNode;
  },
  
  edit: function() {
    this.domNode.css({ zIndex: "1000005"});
  },
  unSelect: function($super) {
    this.domNode.css({ zIndex: "0"});
    $super();
  },
  
  initWidget: function() {
    this.domNode.get(0).contentWindow.uniboard = this.item; 
    this.domNode.get(0).contentWindow.initialize();
  }
});

WebDoc.ImageView = $.klass(WebDoc.ItemView, {
  createDomNode: function($super) {
    var imageNode = $('<' + this.item.data.data.tag + ' width="100%" height="100%"/>');
    var itemNode = $("<div/>");
    itemNode.append(imageNode.get(0));
    this.selectionNode = $("<div/>").addClass("drag_handle");
    this.resizeNode = $("<div/>").addClass("resize_handle");
    itemNode.attr("id", this.item.uuid());

    for (var key in this.item.data.data) {
      if (key == 'css') {
        itemNode.css(this.item.data.data.css);
      }
      else {
        if (key == 'innerHtml') {
          imageNode.html(this.item.data.data[key]);
        }
        else {
          if (key != 'tag') {
            imageNode.attr(key, this.item.data.data[key]);
          }
        }
      }
    }
    this.pageView.itemDomNode.append(itemNode.get(0));
    itemNode.addClass("item");
    return itemNode;
  }
});
