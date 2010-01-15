
/**
 * @author julien
 */
//= require "tool"

WebDoc.ArrowTool = $.klass(WebDoc.Tool, {
  moving: false,
  hasMoved: false,
  originalMovingPos: null,
  
  initialize: function($super, toolId) {
    $super(toolId);
    this.lastSelectedObject = {};
  },
  
  select: function(e) {
    var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
    ddd("must select item at point " + mappedPoint.x + ":" + mappedPoint.y, e.target);
    var clickedItemView = null;
    var target = $(e.target);
    if (target && target.get(0) && target.get(0).tagName == "polyline") {
      clickedItemView = target.data("itemView");
    }
    else {
      clickedItemView = target.closest(".item_wrap").data("itemView");
    }
    var objectToSelect = null;
    if (clickedItemView) {
      objectToSelect = clickedItemView;    
    }
    this.lastSelectedObject = {
      itemView: objectToSelect,
      event: e
    };      
//    else {
//      ddd("use old selection method");
//      objectToSelect= WebDoc.application.boardController.pageView.findObjectAtPoint(mappedPoint);
//      if (e.target.nodeName == "polyline") {
//        objectToSelect = WebDoc.application.boardController.pageView.findItemView(e.target.id);
//      }
//      this.lastSelectedObject = {
//        itemView: objectToSelect,
//        event: e
//      };
//    }
    ddd("found object", objectToSelect);

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
    if (!WebDoc.application.boardController.isInteraction) {
      var target = $(e.target);
      ddd("mouse down on target", e.target);
      if (!target || target.length === 0 || (!target.hasClass("ui-resizable-handle") && !target.hasClass("drawing_handle") && !target.hasClass("drag_handle"))) {
        this.select(e);
        this.originalMovingPos = {
          x: e.screenX,
          y: e.screenY,
          firstMove: true
        };
      }
    }
  },
  
  mouseMove: function(e) {
  },
  
  mouseUp: function(e) {
  },
  
  mouseClick: function(e) {
//    if (!WebDoc.application.boardController.isInteraction) {
//    
//      if (this.lastSelectedObject.itemView) {
//        this.lastSelectedObject.itemView.edit(); //if object (itemView) supports edit mode...
//      }
//    }
  }
  
});
