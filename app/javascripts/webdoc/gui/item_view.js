
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
      throw "cannot create item view without a parent page view";
    }
    
    this.item = item;
    
    this.domNode = this.createDomNode();
    
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
    
    if (item.data.media_type == "drawing") {
      WebDoc.application.svgRenderer.updatePolyline(this.domNode.get(0), {
        points: item.data.data.points
      });
    }
    else {
      this.resetHandles();
    }
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
    this.domNode.html(this.item.data.data.innerHTML);
  },
  
  
  moveTo: function(position) {
    this.item.position.left = position.left;
    this.item.position.top = position.top;
    this.item.data.data.css.left = this.item.position.left + "px";
    this.item.data.data.css.top = this.item.position.top + "px";
    this.domNode.css({
      top: this.item.data.data.css.top,
      left: this.item.data.data.css.left
    });
    this.resetHandles();
  },
  
  resizeTo: function(size) {
    this.item.size.width = size.width;
    this.item.size.height = size.height;
    this.item.data.data.css.width = this.item.size.width + "px";
    this.item.data.data.css.height = this.item.size.height + "px";
    this.domNode.css({
      width: this.item.data.data.css.width,
      height: this.item.data.data.css.height
    });
    this.resetHandles();
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
      console.log("ItemView: select item " + this.item.uuid());
      this.domNode.addClass("item_selected");
      WebDoc.application.boardController.pageView.itemDomNode.append(this.selectionNode.get(0));
      WebDoc.application.boardController.pageView.itemDomNode.append(this.resizeNode.get(0));
      
      this.resetHandles();
      
      this.selectionNode.draggable({
        containment: "parent",
        cursor: 'move',
        distance: 5,
        start: function(e, ui) {
          var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
          var currentPosition = {};
          $.extend(currentPosition, this.item.position);
          this.dragOffsetLeft = mappedPoint.x - this.item.position.left;
          this.dragOffsetTop = mappedPoint.y - this.item.position.top;
          WebDoc.application.undoManager.registerUndo(function() {
            WebDoc.ItemView._restorePosition(this.item, currentPosition);
          }
.pBind(this));
        }
.pBind(this)        ,
        drag: function(e, ui) {
          var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
          ui.position.left = mappedPoint.x - this.dragOffsetLeft;
          ui.position.top = mappedPoint.y - this.dragOffsetTop;
          this.moveTo(ui.position);
        }
.pBind(this)        ,
        stop: function(e, ui) {
          this.item.save();
        }
.pBind(this)
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
          WebDoc.application.undoManager.registerUndo(function() {
            WebDoc.ItemView._restoreSize(currentSize);
          }
.pBind(this));
        }
.pBind(this)        ,
        resize: function(e, ui) {
          var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
          var newWidth = ui.originalSize.width + (mappedPoint.x - this.resizeOrigin.x);
          var newHeight = ui.originalSize.height + (mappedPoint.y - this.resizeOrigin.y);
          ui.size.width = newWidth;
          ui.size.height = newHeight;
          this.resizeTo(ui.size);
        }
.pBind(this)        ,
        stop: function(e, ui) {
          this.item.save();
        }
.pBind(this)
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
  }
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
    }
.pBind(this));
    item.save();
  },
  
  _restoreSize: function(item, size) {
    ddd("restore size" + size.height + ":" + size.width);
    var previousSize = {};
    $.extend(previousSize, item.size);
    item.resizeTo(size);
    WebDoc.application.undoManager.registerUndo(function() {
      WebDoc.ItemView._restoreSize(item, previousSize);
    }
.pBind(this));
    item.save();
  }
});


WebDoc.TextView = $.klass(WebDoc.ItemView, {
  createDomNode: function($super) {
    var result = $super();
    if (result.hasClass("empty")) {
      result.html(WebDoc.NEW_TEXTBOX_CONTENT);
    }
    return result;
  },
  
  inspectorId: function() {
    return 1;
  },
  
  edit: function($super) { //called if we clicked on an already selected textbox
    $super();
    WebDoc.application.boardController.unselectItemViews([this]);
    WebDoc.application.boardController.editingItem = this;
    WebDoc.application.textTool.enterEditMode(this);
    this.domNode.addClass("item_edited");
  },
  
  isEditing: function() {
    return this.domNode.closest("." + WebDoc.TEXTBOX_WRAP_CLASS).length > 0;
  },
  
  stopEditing: function() {
    this.domNode.removeClass("item_edited");
    WebDoc.application.textTool.exitEditMode();
  },
  
  innerHtmlChanged: function() {
    if ($.string(this.item.data.data.innerHTML).blank()) {
      this.domNode.html(WebDoc.NEW_TEXTBOX_CONTENT);
    }
    else {
      this.domNode.html(this.item.data.data.innerHTML);
    }
  }
});

WebDoc.DrawingView = $.klass(WebDoc.ItemView, {
  createDomNode: function($super) {
    this.selectionNode = $("<div/>").addClass("drag_handle");
    var newLine = WebDoc.application.svgRenderer.createPolyline(this.item);
    this.pageView.drawingDomNode.append(newLine);
    return $(newLine);
  },
  
  isSelected: function() {
    return (this.domNode.attr("marker-mid") == "url(#myMarker)");
  },
  
  remove: function() {
    this.domNode.remove();
  },
  
  resetHandles: function() {
    var clientRect = this.domNode[0].getBoundingClientRect();
    var board =  $("#board");
    var handleCss = {
      top: parseFloat(clientRect.top) - parseFloat(board.offset().top),
      left: parseFloat(clientRect.left) - parseFloat(board.offset().left),
      width: clientRect.width,
      height: clientRect.height
    };
    this.selectionNode.css(handleCss);

  },
  select: function() {
    ddd("select drawing");
    var lastSelectedObjectMouseDownEvent = WebDoc.application.arrowTool.lastSelectedObject.event;
    if (lastSelectedObjectMouseDownEvent) {
      lastSelectedObjectMouseDownEvent.preventDefault();
    }
    this.domNode.attr("marker-mid", "url(#myMarker)");
    this.domNode.attr("marker-start", "url(#myMarker)");
    this.domNode.attr("marker-end", "url(#myMarker)");
    WebDoc.application.boardController.pageView.domNode.append(this.selectionNode.get(0));    
    this.resetHandles();
    this.selectionNode.draggable({
      containment: "parent",
      cursor: 'move',
      distance: 5,
      start: function(e, ui) {
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        var currentPosition = {};
        $.extend(currentPosition, this.item.position);
        if (this.item.data.data.transform) {
          this.originalXTransform = this.item.data.data.transform.substring(10, this.item.data.data.transform.indexOf(",", 10) - 1);
          this.originalYTransform = this.item.data.data.transform.substring(this.item.data.data.transform.indexOf(",", 10) + 1, this.item.data.data.transform.indexOf(")", 10) - 1);
        }
        else {
          this.originalXTransform = "0";
          this.originalYTransform = "0";
        }
        this.startLeft = mappedPoint.x;
        this.startTop = mappedPoint.y - this.item.position.top;

      }.pBind(this)      ,
      drag: function(e, ui) {
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        ui.position.left = mappedPoint.x - this.startLeft + parseFloat(this.originalXTransform);
        ui.position.top = mappedPoint.y - this.startTop + parseFloat(this.originalYTransform);
        this.item.data.data.transform = "translate("+ ui.position.left + "," + ui.position.top + ")";
        this.domNode[0].setAttribute("transform", this.item.data.data.transform);
      }.pBind(this)      ,
      stop: function(e, ui) {
        this.item.save();
        this.resetHandles();
      }.pBind(this)
    });
    
    if (lastSelectedObjectMouseDownEvent) {
      // board must ignore this event. It is just for draggable elemnt
      lastSelectedObjectMouseDownEvent.boardIgnore = true;
      this.selectionNode.trigger(lastSelectedObjectMouseDownEvent);
    }
  },
  
  unSelect: function() {
    ddd("unselect drawing");
    this.selectionNode.remove();
    this.domNode.attr("marker-mid", "");
    this.domNode.attr("marker-start", "");
    this.domNode.attr("marker-end", "");
    
  },
  
  inspectorId: function() {
    return 2;
  },

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
    // try to resize to the correct size
    if (this.item.data.data.css.width == "0px") {
      var innerWidth = widgetNode.find(":first").width();
      var innerHeight = widgetNode.find(":first").height();
      ddd("inner size");
      ddd(innerWidth + " - " + innerHeight);
      ddd("--------------------");
      if (innerWidth && innerHeight) {
        this.item.resizeTo({
          width: innerWidth,
          height: innerHeight
        });
      }
      else {
        this.item.resizeTo({
          width: 150,
          height: 150
        });
      }
    }
    widgetNode.bind('load', function() {
      ddd("widget loaded");
      this.initWidget();
    }
.pBind(this));
    
    widgetNode.bind('resize', function() {
      ddd("widget resize");
    }
.pBind(this));
    
    return widgetNode;
  },
  
  innerHtmlChanged: function($super) {
    $super();
    // resize if inner html is iframe
    var innerIframe = this.domNode.find("iframe");
    if (innerIframe.get(0)) {
      this.resizeTo({
        width: parseFloat(innerIframe.css("width").replace("px", "")),
        height: parseFloat(innerIframe.css("height").replace("px", ""))
      });
    }
  },
  
  edit: function($super) {
    $super();
    WebDoc.application.boardController.unselectItemViews([this]);
    WebDoc.application.boardController.editingItem = this;
    this.domNode.addClass("item_edited");
    this.domNode.css({
      zIndex: "1000005"
    });
  },
  
  stopEditing: function() {
    this.domNode.removeClass("item_edited");
    this.domNode.removeClass("item_edited");
    this.domNode.css({
      zIndex: "0"
    });
  },
  
  initWidget: function() {
    if (this.domNode.get(0).contentWindow) {
      this.domNode.get(0).contentWindow.uniboard = this.item;
      this.domNode.get(0).contentWindow.initialize();
      /* if SVG layer don't catch event we need to catch events in the capture phase of the widget */
      /*
       this.domNode.get(0).contentDocument.body.addEventListener("mousedown", WebDoc.application.boardController.mouseDown.pBind(WebDoc.application.boardController), true);
       this.domNode.get(0).contentDocument.body.addEventListener("mousemove", WebDoc.application.boardController.mouseMove.pBind(WebDoc.application.boardController), true);
       this.domNode.get(0).contentDocument.body.addEventListener("mouseup", WebDoc.application.boardController.mouseUp.pBind(WebDoc.application.boardController), true);
       */
    }
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
    if (!this.item.data.data.css.width) {
      this.item.resizeTo({
        width: itemNode.width(),
        height: itemNode.height()
      });
    }
    return itemNode;
  }
});
