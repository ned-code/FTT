/**
 * Uniboard tool bar widget
**/
com.mnemis.core.Provide("com/mnemis/wb/controllers/WBDrawingController.js");

com.mnemis.core.Import("com/mnemis/core/UUID.js")
com.mnemis.core.Import("com/mnemis/wb/adaptors/WBSvgRenderer.js")
com.mnemis.core.Import("com/mnemis/wb/adaptors/WBVmlRenderer.js")


com.mnemis.wb.controllers.WBDrawingController = function(initialDrawing)
{

    this.domNode = null;
    // drawing model
    this.mDrawingModel = {
        polyline: []
    };
	
    this.mRenderer = undefined;
    this.currentDrawObject = undefined;

    if (jQuery.browser.mozilla || jQuery.browser.safari)
    {
        this.mRenderer = new com.mnemis.wb.adaptors.WBSvgRenderer();
    }
    else if(jQuery.browser.msie)
    {
        this.mRenderer = new com.mnemis.wb.adaptors.WBVmlRenderer();
    }

    if (initialDrawing)
    {
        this.mDrawingModel = initialDrawing;
    }
    
    if (this.mRenderer)
    {
        var boardElement = $("#ub_board");
        var height = boardElement.height();
        var width = boardElement.width();
        this.domNode = this.mRenderer.createSurface(width, height);
        $(this.domNode).css("zIndex", 1999999);
        var drawingElement = $("#ub_page_drawing");
        drawingElement.css("zIndex", 1999999);
    }
}


com.mnemis.wb.controllers.WBDrawingController.prototype.setDrawingModel = function(pDrawingModel)
{
    this.mDrawingModel = pDrawingModel;
    this.repaintAll();
}

com.mnemis.wb.controllers.WBDrawingController.prototype.repaintAll = function() {
    this.mRenderer.clearSurface(this.domNode);
    if (this.mDrawingModel.polyline) {
        for (var i = 0; i < this.mDrawingModel.polyline.length; i++) {
            var aDrawObject = this.mDrawingModel.polyline[i];
            var newLine = aDrawObject.domNode.get(0);
            if (!newLine) {
                newLine = this.mRenderer.createPolyline();

                aDrawObject.domNode = $(newLine);
            }
            this.mRenderer.updatePolyline(newLine,
            {
                id: aDrawObject.uuid,
                color: "rgb(255,0,0)",
                width: 5
            })
            this.repaintObject(aDrawObject);
            this.domNode.appendChild(newLine);
        }
    }
    if (this.mDrawingModel.polygon) {
        for (var i = 0; i < this.mDrawingModel.polygon.length; i++) {
            var aDrawObject = this.mDrawingModel.polygon[i];
            var newLine = this.mRenderer.createPolygon();
            aDrawObject.domNode = $(newLine);
            this.mRenderer.updatePolygon(newLine,
            {
                id: aDrawObject.uuid,
                color: aDrawObject.color,
                opacity: aDrawObject.opacity,
                width: 5
            })
            this.repaintObject(aDrawObject);

            this.domNode.appendChild(newLine);
        }
    }
}

com.mnemis.wb.controllers.WBDrawingController.prototype.repaintObject= function(objectToRepaint)
{
    this.mRenderer.updatePolyline(objectToRepaint.domNode.get(0),
    {
        points: objectToRepaint.data.points
    }
    );
}

com.mnemis.wb.controllers.WBDrawingController.prototype.beginDraw= function(e)
{
    var uuid = new com.mnemis.core.UUID();
    var mappedPoint = WB.application.boardController.mapToPageCoordinate(e);
    var newLine = this.mRenderer.createPolyline(uuid.id);
    this.currentDrawObject = new WB.model.WBItem(newLine);

    this.currentDrawObject.data.points = mappedPoint.x + "," + mappedPoint.y;
    this.mDrawingModel.polyline.push(this.currentDrawObject);     			        			        
    this.domNode.appendChild(newLine);
    var drawObjectToUndo = this.currentDrawObject;
    var that = this;
    WB.application.undoManager.registerUndo( function()
    {
        that._removePolyLine(drawObjectToUndo);
    });
}

com.mnemis.wb.controllers.WBDrawingController.prototype.endDraw= function(e)
{
    if (WB.application.boardController.collaborationController)
    {
        WB.application.boardController.collaborationController.addItem(this.currentDrawObject);
    }
// Nothing to do
}

com.mnemis.wb.controllers.WBDrawingController.prototype.draw= function(e)
{
    var mappedPoint = WB.application.boardController.mapToPageCoordinate(e);
    this.currentDrawObject.data.points += " " + mappedPoint.x + "," + mappedPoint.y;
    this.repaintObject(this.currentDrawObject);
}

com.mnemis.wb.controllers.WBDrawingController.prototype._removePolyLine = function(drawObject) {
    this.domNode.removeChild(drawObject.domNode.get(0));
    var index = this.mDrawingModel.polyline.indexOf(drawObject);
    this.mDrawingModel.polyline.splice(index,1);
    that = this;
    WB.application.undoManager.registerUndo(function() {
        that._addPolyLine(drawObject);
    });
    if (WB.application.boardController.collaborationController)
    {
        WB.application.boardController.collaborationController.removeItem(drawObject);
    }
}   

com.mnemis.wb.controllers.WBDrawingController.prototype._addPolyLine = function(drawObject) {
    this.domNode.appendChild(drawObject.domNode.get(0));
    this.mDrawingModel.polyline.push(drawObject);
    that = this;
    WB.application.undoManager.registerUndo(function() {
        that._removePolyLine(drawObject);
    });
    if (WB.application.boardController.collaborationController)
    {
        WB.application.boardController.collaborationController.addItem(drawObject);
    }
}           