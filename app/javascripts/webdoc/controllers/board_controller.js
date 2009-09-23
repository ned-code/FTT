/**
 * Uniboard board controller
 **/
//= require <WebDoc/model/page>
//= require <WebDoc/model/item>
//= require <WebDoc/controllers/drawing_controller> 
//= require <WebDoc/controllers/collaboration_controller>  

WebDoc.BoardController = $.klass(
{
    drawingController: null,
    initialize: function(editable)
    {
        this.currentZoom = 1;
        this.selection = [];
		this.drawingController = new WebDoc.DrawingController();
    },
    
    setCurrentPage: function(page)
    {    
        // re-init internal working attributes
        $("#board-container").get(0).scrollTop = 0;
		$("#board-container").get(0).scrollLeft = 0;
        this.offset = $("#board-container").offset();
        this.currentZoom = 1;
        this.selection = [];
        this.currentPage = page;
        this.initialHeight = $("#board").height();
        this.initialWidth = $("#board").width();
        
        $("#board").bind("mousedown", this, this.mouseDown);
        $("#board").bind("mousemove", this, this.mouseMove);
        $("#board").bind("mouseup", this, this.mouseUp);
        $("#board").bind("mouseout", this, this.mouseOut);
        
        // update data attribute of object
        $("object").each(function()
        {
            var relPath = $(this).attr("data");
            $(this).attr("data", relPath);
        });
        this.updateDrawing();
        //update zoom to fit browser page
        heightFactor = ($("#board-container").height() - this.initialHeight) / this.initialHeight;
        console.log(heightFactor);
        widthFactor = ($("#board-container").width() - this.initialWidth) / this.initialWidth;
        console.log(widthFactor);
        if (heightFactor < widthFactor) 
        {
            this.zoom(1 + heightFactor);
        }
        else 
        {
            this.zoom(1 + widthFactor);
        }
    },
    
    updateDrawing: function()
    {
        if (this.currentPage) 
        {
            // replace drawing div with content of drawing controller. Allow to have different kind of renderer (for ie)
            this.drawingController.setDrawingModel(this.currentPage.drawingModel());
            $("#page_drawing").append(this.drawingController.domNode);
        }
    },
	
    setCurrentTool: function(tool)
    {
		console.log(tool);
        this.currentTool = tool;
		this.currentTool.selectTool();
        this.unSelectObjects(this.selection);
    },
    
    mapToPageCoordinate: function(position)
    {
        var x, y;
        if (position.x) 
        {
            x = position.x - this.offset.left;
            y = position.y - this.offset.top;
        }
        else 
        {
            x = position.clientX - this.offset.left;
            y = position.clientY - this.offset.top;
        }
        
        var calcX = (x + $("#board-container").get(0).scrollLeft) * (1 / this.currentZoom);
        var calcY = (y + ($("#board-container").get(0).scrollTop)) * (1 / this.currentZoom);
		console.log("mapped point " + calcX + ":" + calcY);
        return {
            x: calcX,
            y: calcY
        };
    },
    
    
    zoomIn: function(e)
    {
        this.zoom(1.5);
    },
    
    zoomOut: function(e)
    {
        this.zoom(1 / 1.5);
    },
    
    selectObjects: function(objects)
    {
        var i = 0;
        for (; i < objects.length; i++) 
        {
            var objectToSelect = objects[i];
            if (objectToSelect) 
            {
                this.selection.push(objectToSelect);
                objectToSelect.select();
            }
        }
    },
    
    unSelectObjects: function(objects)
    {
        var i = 0;
        for (; i < objects.length; i++) 
        {
            var objectToUnSelect = objects[i];
            if (objectToUnSelect) 
            {
                objectToUnSelect.unSelect();
                var index = this.selection.indexOf(objectToUnSelect);
                if (index > -1) 
                {
                    this.selection.splice(index, 1);
                }
            }
        }
    },
    
    zoom: function(factor)
    {
        var previousZoom = this.currentZoom;
        this.currentZoom = this.currentZoom * factor;
        var boardElement = $("#board");

        
        if (jQuery.browser.mozilla) 
        {
            boardElement.css("MozTransformOrigin", "0px 0px");
            boardElement.css("MozTransform", "scaleX(" + this.currentZoom + ") scaleY(" + this.currentZoom + ")");
        }
        else 
            if (jQuery.browser.safari) 
            {
                console.log("apply webkit transform");
                boardElement.css("WebkitTransformOrigin", "0px 0px");
                boardElement.css("WebkitTransform", "scaleX(" + this.currentZoom + ") scaleY(" + this.currentZoom + ")");
            }
            else 
                if (jQuery.browser.msie) 
                {
                    console.log("apply ie transform " + this.currentZoom + " " + this.initialWidth * this.currentZoom + " " + this.initialHeight * this.currentZoom);
                    if ((previousZoom >= 1 && factor > 1) || (this.currentZoom >= 1 && factor < 1)) 
                    {
                        boardElement.css("width", this.initialWidth * this.currentZoom);
                        boardElement.css("height", this.initialHeight * this.currentZoom);
                    }
                    boardElement.css("filter", "progid:DXImageTransform.Microsoft.Matrix(M11='" + this.currentZoom + "',M21='0', M12='0', M22='" + this.currentZoom + "', sizingmethod='autoexpand')");
                }
    },
    
    mouseDown: function(e)
    {
        var that = e.data;
        e.preventDefault();
        that.currentTool.mouseDown(e);
    },
    
    mouseMove: function(e)
    {
        var that = e.data;
        e.preventDefault();
        that.currentTool.mouseMove(e);
    },
    
    mouseOut: function(e)
    {
        var that = e.data;
        e.preventDefault();
		that.currentTool.mouseOut(e);
    },
    
    mouseUp: function(e)
    {
        var that = e.data;
        e.preventDefault();
		that.currentTool.mouseUp(e);

    }
});
