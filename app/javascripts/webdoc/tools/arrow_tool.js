
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
  },
  
  select: function(e) {
    var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
    console.log("must select item at point " + mappedPoint.x + ":" + mappedPoint.y);
    var objectToSelect = WebDoc.application.boardController.pageView.findObjectAtPoint(mappedPoint);
    console.log("founded object");
    console.log(objectToSelect);
    if (objectToSelect) {
      WebDoc.application.boardController.selectObjects([objectToSelect]);
    }
    else {
      WebDoc.application.boardController.unselectAll();
    }
  },
  
  move: function(e) {
    if (this.moving) {
      this.hasMoved = true;
      if (this.originalMovingPos.firstMove && WebDoc.application.boardController.selection.length) {
        var selectionToUndo = WebDoc.application.boardController.selection[0];
        this._moveItem(selectionToUndo)
      }
      this.originalMovingPos.firstMove = false;
      var xDiff = (e.screenX - this.originalMovingPos.x) * (1 / this.currentZoom);
      var yDiff = (e.screenY - this.originalMovingPos.y) * (1 / this.currentZoom);
      var i = 0;
      for (; i < WebDoc.application.boardController.selection.length; i++) {
        var objectToMove = WebDoc.application.boardController.selection[i];
        objectToMove.shift(xDiff, yDiff);
        
      }
      this.originalMovingPos = 
      {
        x: e.screenX,
        y: e.screenY
      };
    }
  },
  
  endMove: function(e) {
    var i = 0;
    if (this.hasMoved) {
      for (; i < WebDoc.application.boardController.selection.length; i++) {
        WebDoc.application.boardController.selection[i].save();
      }
      this.hasMoved = false;
    }
  },
  
  _moveItem: function(item, newPosition) {
    var previousPosition = 
    {
      left: item.position.left,
      top: item.position.top
    };
    var that = this;
    if (newPosition) {
      item.moveTo(newPosition);
      item.save();
    }
    WebDoc.application.undoManager.registerUndo(function() {
      that._moveItem.call(that, item, previousPosition);
    });
  },
  
  mouseDown: function(e) {
    this.select(e);
    this.originalMovingPos = 
    {
      x: e.screenX,
      y: e.screenY,
      firstMove: true
    };
  },
  
  mouseMove: function(e) {
    this.move(e);
  },
  
  mouseUp: function(e) {
    this.moving = false;
    this.endMove();
  }
  
});
