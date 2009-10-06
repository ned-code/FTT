
/**
* @author julien
*/
//= require "tool"

WebDoc.DrawingTool = $.klass(WebDoc.Tool, {
  drawing: false,

  initialize: function($super, toolId) {
    $super(toolId);
  },

  selectTool: function() {
      WebDoc.application.boardController.unselectAll();
  },
  
  mouseDown: function(e) {
    e.preventDefault();
    this.drawing = true;
    this.beginDraw(e);
  },

  mouseMove: function(e) {
    e.preventDefault();
    if (this.drawing) {
      this.draw(e);
    }
  },

  mouseUp: function(e) 
  {
    e.preventDefault();
    this.drawing = false;
    this.endDraw(e);
  },

  beginDraw: function(e) {
    var uuid = new MTools.UUID();
    var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
    console.log("begin draw at point " + mappedPoint.x + ":" + mappedPoint.y);

    this.currentDrawObject = new WebDoc.Item();
    this.currentDrawObject.data.media_type = WebDoc.ITEM_TYPE_DRAWING;
    this.currentDrawObject.data.data.css = {
      zIndex: 2000
    };
    this.currentDrawObject.data.data.stroke = "#ff1010";
    this.currentDrawObject.data.data.strokeWidth = 3;
    this.currentDrawObject.data.data.points = mappedPoint.x + "," + mappedPoint.y;
    WebDoc.application.pageEditor.currentPage.addItem(this.currentDrawObject);

    var drawObjectToUndo = this.currentDrawObject;
    var that = this;
    WebDoc.application.undoManager.registerUndo(function() {
      that._removePolyLine(drawObjectToUndo);
    });
  },

  endDraw: function(e) {
    this.currentDrawObject.save();
  },

  draw: function(e) {
    var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
    this.currentDrawObject.setPoints(this.currentDrawObject.data.data.points += " " + mappedPoint.x + "," + mappedPoint.y);
  },

  _removePolyLine: function(drawObject) {
    drawObject.domNode.remove();
    that = this;
    WebDoc.application.undoManager.registerUndo(function() {
      that._addPolyLine(drawObject);
    });
    drawObject.destroy();
  },

  _addPolyLine: function(drawObject) {
    WebDoc.application.boardController.pageView.drawingDomNode.append(drawObject.domNode.get(0));
    drawObject.isNew = true;
    that = this;
    WebDoc.application.undoManager.registerUndo(function() {
      that._removePolyLine(drawObject);
    });
    drawObject.save();
  }
});
