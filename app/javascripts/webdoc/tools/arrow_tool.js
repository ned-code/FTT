
/**
 * @author julien
 */
//= require "tool"

WebDoc.ArrowTool = $.klass(WebDoc.Tool, 
{
  moving: false,
  hasMoved: false,
  originalMovingPos: null,
  
  initialize: function($super, toolId) {
    $super(toolId);
    this.lastSelectedObject = {};
  },
  
  select: function(e) {
    var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
    console.log("must select item at point " + mappedPoint.x + ":" + mappedPoint.y);    
    var objectToSelect = WebDoc.application.boardController.pageView.findObjectAtPoint(mappedPoint);
    ddd(e.target.id);
    if (e.target.nodeName == "polyline") {
      objectToSelect = WebDoc.application.boardController.pageView.findItemView(e.target.id);
    }
    this.lastSelectedObject = {
      itemView: objectToSelect,
      event: e
    };
    console.log("found object");
    console.log(objectToSelect);
    if (!(objectToSelect && WebDoc.application.boardController.editingItem == objectToSelect)) {
      if (objectToSelect) {
        WebDoc.application.boardController.selectItemViews([objectToSelect], e);
      }
      else {
        WebDoc.application.boardController.unselectAll();
      }
    }
    this.lastSelectedObject.event = null;
  },
  
  mouseDown: function(e) {
    var target = $(e.target); 
    if (!target || target.length == 0 || (!target.hasClass("ui-resizable-handle") && !target.hasClass("drag_handle"))) {
    this.select(e);
    this.originalMovingPos = 
    {
      x: e.screenX,
      y: e.screenY,
      firstMove: true
    };
    }
  },
  
  mouseMove: function(e) {
  },
  
  mouseUp: function(e) {
  },
  
  mouseClick: function(e) {
    if (this.lastSelectedObject.itemView) { 
      this.lastSelectedObject.itemView.edit(); //if object (itemView) supports edit mode...
    }
  }
  
});
