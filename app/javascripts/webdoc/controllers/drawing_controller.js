/**
 * Drawing Controller
 **/
//= require <MTools/uuid>
//= require <WebDoc/adaptors/svg_renderer>
//= require <WebDoc/adaptors/vml_renderer>


WebDoc.DrawingController = $.klass(
{
    initialize: function(initialDrawing)
    {
    
        this.domNode = null;
        // drawing model
        this.mDrawingModel = 
        {
            polylines: []
        };
        
        this.mRenderer = undefined;
        this.currentDrawObject = undefined;
        
        if (jQuery.browser.mozilla || jQuery.browser.safari) 
        {
            this.mRenderer = new WebDoc.SvgRenderer();
        }
        else 
            if (jQuery.browser.msie) 
            {
                this.mRenderer = new WebDoc.VmlRenderer();
            }
        
        if (initialDrawing) 
        {
            this.mDrawingModel = initialDrawing;
        }
        
        if (this.mRenderer) 
        {
            var boardElement = $("#board");
            var height = boardElement.height();
            var width = boardElement.width();
            this.domNode = this.mRenderer.createSurface(width, height);
            $(this.domNode).css("zIndex", 999999);
            var drawingElement = $("#page_drawing");
            drawingElement.css("zIndex", 999999);
        }
    },
    setDrawingModel: function(pDrawingModel)
    {
        this.mDrawingModel = pDrawingModel;
        this.repaintAll();
    },
    
    repaintAll: function()
    {
        this.mRenderer.clearSurface(this.domNode);
        if (this.mDrawingModel.polylines) 
        {
            for (var i = 0; i < this.mDrawingModel.polylines.length; i++) 
            {
                var aDrawObject = this.mDrawingModel.polylines[i];
                var newLine = aDrawObject.domNode.get(0);
                if (!newLine) 
                {
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
        if (this.mDrawingModel.polygon) 
        {
            for (var i = 0; i < this.mDrawingModel.polygon.length; i++) 
            {
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
    },
    
    repaintObject: function(objectToRepaint)
    {
        this.mRenderer.updatePolyline(objectToRepaint.domNode.get(0), 
        {
            points: objectToRepaint.data.data.points
        });
    },
    
    beginDraw: function(e)
    {
        var uuid = new MTools.UUID();
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        console.log("begin draw at point " + mappedPoint.x + ":" + mappedPoint.y);
        
        this.currentDrawObject = new WebDoc.Item();
	    this.currentDrawObject.data.data.css = { zIndex: 2000};
		this.currentDrawObject.data.data.stroke = "red";
		this.currentDrawObject.data.data.strokeWidth = 5;
        var newLine = this.mRenderer.createPolyline(this.currentDrawObject);
        
        this.currentDrawObject.data.page_id = WebDoc.application.pageEditor.currentPage.uuid();
        this.currentDrawObject.data.data.points = mappedPoint.x + "," + mappedPoint.y;
        this.mDrawingModel.polylines.push(this.currentDrawObject);
        this.domNode.appendChild(newLine);
        var drawObjectToUndo = this.currentDrawObject;
        var that = this;
        WebDoc.application.undoManager.registerUndo(function()
        {
            that._removePolyLine(drawObjectToUndo);
        });
    },
    
    endDraw: function(e)
    {
		this.currentDrawObject.save();
    },
    
    draw: function(e)
    {
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        this.currentDrawObject.data.data.points += " " + mappedPoint.x + "," + mappedPoint.y;
        this.repaintObject(this.currentDrawObject);
    },
    
    _removePolyLine: function(drawObject)
    {
        this.domNode.removeChild(drawObject.domNode.get(0));
        var index = this.mDrawingModel.polylines.indexOf(drawObject);
        this.mDrawingModel.polylines.splice(index, 1);
        that = this;
        WebDoc.application.undoManager.registerUndo(function()
        {
            that._addPolyLine(drawObject);
        });
		drawObject.destroy();
    },
    
    _addPolyLine: function(drawObject)
    {
        this.domNode.appendChild(drawObject.domNode.get(0));
		drawObject.isNew = true;
        this.mDrawingModel.polylines.push(drawObject);
        that = this;
        WebDoc.application.undoManager.registerUndo(function()
        {
            that._removePolyLine(drawObject);
        });
		drawObject.save();
    }
});
