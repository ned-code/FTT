/**
 * @author julien
 */
WebDoc.DrawingView = $.klass(WebDoc.ItemView, {
  createDomNode: function($super) {
    this.selectionNode = $("<div/>").addClass("drawing_handle");
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
  
  objectChanged: function($super, item) {
    $super(item);
    WebDoc.application.svgRenderer.updatePolyline(this.domNode.get(0), {
      points: item.data.data.points
    });
    this.domNode[0].setAttribute("transform", this.item.data.data.transform);
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
        // TODO change the way we get current x and y translate: Currently we assume that transform attribute always contains "translate(x,y)"
        if (this.item.data.data.transform) {
          this.originalXTransform = parseFloat(this.item.data.data.transform.substring(10, this.item.data.data.transform.indexOf(",", 10)));
          this.originalYTransform = parseFloat(this.item.data.data.transform.substring(this.item.data.data.transform.indexOf(",", 10) + 1, this.item.data.data.transform.indexOf(")", 10)));
          if (isNaN(this.originalXTransform)) {
            this.originalXTransform = 0;
          }
          if (isNaN(this.originalYTransform)) {
            this.originalYTransform = 0;
          }
        }
        else {
          this.originalXTransform = 0;
          this.originalYTransform = 0;
        }
        this.startLeft = mappedPoint.x;
        this.startTop = mappedPoint.y;
        // _restore transform register undo for current transform
        WebDoc.DrawingView._restoreTransform(this.item, this.item.data.data.transform);

      }.pBind(this),
      drag: function(e, ui) {
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        ui.position.left = mappedPoint.x - this.startLeft + this.originalXTransform;
        ui.position.top = mappedPoint.y - this.startTop + this.originalYTransform;
        this.item.data.data.transform = "translate("+ ui.position.left + "," + ui.position.top + ")";
        this.item.fireObjectChanged();
      }.pBind(this),
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
  }

});

$.extend(WebDoc.DrawingView, {
  _restoreTransform: function(item, transform) {
    var previousTransform = item.data.data.transform? item.data.data.transform : "";
    if (previousTransform != transform) {      
      item.data.data.transform = transform;
      item.fireObjectChanged();
    }
    WebDoc.application.undoManager.registerUndo(function() {
      WebDoc.DrawingView._restoreTransform(item, previousTransform);
      item.save();
    }.pBind(this));
    
  }
});

