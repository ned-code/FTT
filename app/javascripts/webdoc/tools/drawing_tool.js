
/**
* @author julien
*/
//= require "tool"

WebDoc.DrawingTool = $.klass(WebDoc.Tool, {
  drawing: false,
  penColor: "black",
  penSize: "1",
  initialize: function($super, toolId) {
    $super(toolId);
    $("#colors").bind("click", function(event) {
      var link = $(event.target).closest('div')[0];
      if (link) {
        event.preventDefault();
        this.penColor = $(link).css("backgroundColor");
      }
    }.pBind(this));
    $("#sizes").bind("click", function(event) {
      var link = $(event.target).closest('a')[0];
      if (link) {
        event.preventDefault();
        this.penSize = $(link).attr("href");
      }
    }.pBind(this));    
  },

  selectTool: function() {
      WebDoc.application.boardController.unselectAll();
      WebDoc.application.inspectorController.selectPalette(2);
      //window.setTimeout("WebDoc.application.inspectorController.selectPalette(2);", 400);            
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
    ddd("begin draw at point " + mappedPoint.x + ":" + mappedPoint.y);

    this.currentDrawObject = new WebDoc.Item();
    this.currentDrawObject.data.media_type = WebDoc.ITEM_TYPE_DRAWING;
    this.currentDrawObject.data.data.css = {
      zIndex: 2000
    };
    this.currentDrawObject.data.data.stroke = this.penColor;
    this.currentDrawObject.data.data.strokeWidth = this.penSize;
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
