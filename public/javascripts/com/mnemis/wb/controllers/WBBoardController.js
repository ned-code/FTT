/**
 * Uniboard board controller
**/
com.mnemis.core.Provide("com/mnemis/wb/controllers/WBBoardController.js");

com.mnemis.core.Import("com/mnemis/wb/model/WBPage.js");
com.mnemis.core.Import("com/mnemis/wb/controllers/WBDrawingController.js");
com.mnemis.core.Import("com/mnemis/wb/controllers/WBCollaborationController.js");

var Orbited;

com.mnemis.wb.controllers.WBBoardController = function(editable)
{
    console.log("init board controller");

    if (editable || jQuery.browser.msie)
    {
        this.drawingController = new WB.controllers.WBDrawingController();
    }
    this.editable = editable;
    this.moving = false;
    this.originalMovingPos = null;
    this.currentZoom = 1;
    this.selection = [];
    // default tool is the arrow
    this.setCurrentTool(7);
}


com.mnemis.wb.controllers.WBBoardController.prototype.setCurrentPage = function(page) {

    // re-init internal working attributes
    window.scrollTo(0, 0);
    this.moving = false;
    this.originalMovingPos = null;
    this.currentZoom = 1;
    this.selection = [];
    this.currentPage = page;
    this.initialHeight = $("#ub_board").height();
    this.initialWidth = $("#ub_board").width();

    $("#ub_board").bind("mousedown", this, this.mouseDown);
    $("#ub_board").bind("mousemove", this, this.mouseMove);
    $("#ub_board").bind("mouseup", this, this.mouseUp);
    $("#ub_board").bind("mouseout", this, this.mouseOut);

    // update data attribute of object
    $("object").each(function() {
        var relPath = $(this).attr("data");
        $(this).attr("data", relPath);
    });
    if (this.editable && Orbited)
    {
        if (this.collaborationController)
        {
            try
            {
                this.collaborationController.disconnect();
            }
            catch (exeption)
            {
                console.log(exeption);
            }
        }
        this.collaborationController = new WB.controllers.WBCollaborationController(page);
    }
    this.updateDrawing();

    //update zoom to fit browser page
    heightFactor = (window.innerHeight - this.initialHeight)/this.initialHeight;
    console.log(heightFactor);
    widthFactor = (window.innerWidth - this.initialWidth)/this.initialWidth;
    console.log(widthFactor);
    if (heightFactor < widthFactor)
    {
        this.zoom(1 + heightFactor);
    }
    else
    {
        this.zoom(1 + widthFactor);
    }
}

com.mnemis.wb.controllers.WBBoardController.prototype.updateDrawing = function() {
    if (this.drawingController && this.currentPage) {
        // replace drawing div with content of drawing controller. Allow to have different kind of renderer (for ie)
        this.drawingController.setDrawingModel(this.currentPage.drawingModel());
        $("#ub_page_drawing").append(this.drawingController.domNode);
    }
}

com.mnemis.wb.controllers.WBBoardController.prototype.setCurrentTool = function(toolId)
{
    this.currentTool = toolId;
    this.unSelectObjects(this.selection);
    if (WB.application.toolpalette)
    {
        WB.application.toolpalette.refreshGUI();
    }
}

com.mnemis.wb.controllers.WBBoardController.prototype.mapToPageCoordinate = function(position)
{
    var x,y;
    if (position.x)
    {
        x = position.x;
        y = position.y
    }
    else
    {
        x = position.clientX;
        y = position.clientY;
    }

    var calcX = (x + window.pageXOffset) * (1/this.currentZoom);
    var calcY = (y + (window.pageYOffset)) * (1/this.currentZoom);
    return {
        x: calcX,
        y: calcY
    };
}

com.mnemis.wb.controllers.WBBoardController.prototype.beginDrawing = function(e)
{
    this.drawingController.beginDraw(e);
}

com.mnemis.wb.controllers.WBBoardController.prototype.beginErase = function(e)
{
    }

com.mnemis.wb.controllers.WBBoardController.prototype.beginMarker = function(e)
{
    }

com.mnemis.wb.controllers.WBBoardController.prototype.beginLaser = function(e)
{
    }

com.mnemis.wb.controllers.WBBoardController.prototype.beginHand = function(e)
{
    }

com.mnemis.wb.controllers.WBBoardController.prototype.draw = function(e)
{
    this.drawingController.draw(e);
}

com.mnemis.wb.controllers.WBBoardController.prototype.erase = function(e)
{
	
    }

com.mnemis.wb.controllers.WBBoardController.prototype.marker = function(e)
{
	
    }

com.mnemis.wb.controllers.WBBoardController.prototype.laser = function(e)
{
	
    }

com.mnemis.wb.controllers.WBBoardController.prototype.hand = function(e)
{
    var xMove = this.originalMovingPos.x - e.screenX;
    var yMove = this.originalMovingPos.y - e.screenY;
    window.scrollBy(xMove, yMove);
    this.originalMovingPos = {
        x: e.screenX,
        y: e.screenY
        };
    e.stopPropagation();
}

com.mnemis.wb.controllers.WBBoardController.prototype.zoomIn = function(e)
{
    this.zoom(1.5);
}

com.mnemis.wb.controllers.WBBoardController.prototype.zoomOut = function(e)
{
    this.zoom(1/1.5);
}

com.mnemis.wb.controllers.WBBoardController.prototype.selectObjects = function(objects)
{
    var i = 0;
    for(; i < objects.length; i++)
    {
        var objectToSelect = objects[i];
        if (objectToSelect)
        {
            this.selection.push(objectToSelect);
            objectToSelect.select();
            if (objectToSelect.type() == "widget")
            {
                this.moving = false;
            }
        }
    }
}

com.mnemis.wb.controllers.WBBoardController.prototype.unSelectObjects = function(objects)
{
    var i = 0;
    for(; i < objects.length; i++)
    {
        var objectToUnSelect = objects[i];
        if (objectToUnSelect)
        {
            objectToUnSelect.unSelect();
            var index = this.selection.indexOf(objectToUnSelect);
            if (index > -1)
            {
                this.selection.splice(index,1);
            }
        }
    }
}

com.mnemis.wb.controllers.WBBoardController.prototype.select = function(e)
{
    var objectToSelect = this.currentPage.findObjectAtPoint(this.mapToPageCoordinate(e));
    this.unSelectObjects(this.selection);
    if (objectToSelect)
    {
        this.selectObjects([objectToSelect])
    }
}

com.mnemis.wb.controllers.WBBoardController.prototype._moveItem = function(item, newPosition)
{
    var previousPosition = {
        left:item.position.left,
        top:item.position.top
        };
    var that = this;
    if (newPosition)
    {
        item.moveTo(newPosition);
        item.endOfMove();
    }
    WB.application.undoManager.registerUndo(function()
    {
        that._moveItem.call(that, item, previousPosition);
    }
    );
}

com.mnemis.wb.controllers.WBBoardController.prototype.move = function(e)
{
    this.hasMoved = true;
    if (this.originalMovingPos.firstMove && this.selection.length)
    {
        var selectionToUndo = this.selection[0];
        this._moveItem(selectionToUndo)
    }
    this.originalMovingPos.firstMove = false;
    var xDiff = (e.screenX  - this.originalMovingPos.x) * (1 / this.currentZoom);
    var yDiff = (e.screenY - this.originalMovingPos.y) * (1 / this.currentZoom);
    var i = 0;
    for(; i < this.selection.length; i++)
    {
        var objectToMove = this.selection[i];
        objectToMove.shift(xDiff, yDiff);

    }
    this.originalMovingPos = {
        x: e.screenX,
        y: e.screenY
        };
}

com.mnemis.wb.controllers.WBBoardController.prototype.endMove = function(e)
{
    if (this.selection[0] && this.hasMoved)
    {
        this.selection[0].endOfMove();
    }
    this.hasMoved = false;
}

com.mnemis.wb.controllers.WBBoardController.prototype.zoom = function(factor)
{
    var previousZoom = this.currentZoom;
    this.currentZoom = this.currentZoom * factor;
    var boardElement = $("#ub_board");
    var coords = boardElement.position();
    var previousHeight = boardElement.height();
    var previousWidth = boardElement.width();
    var heightDiff = (previousHeight * factor) - window.innerHeight;
    var widthDiff = (previousWidth * factor) - window.innerWidth;
    if (!heightDiff)
    {
        window.scrollTo(0,0);
    }

    if (jQuery.browser.mozilla)
    {
        boardElement.css("MozTransformOrigin", "0px 0px");
        boardElement.css("MozTransform", "scaleX("+ this.currentZoom + ") scaleY(" + this.currentZoom + ")");
    }
    else if (jQuery.browser.safari)
    {
        console.log("apply webkit transform");
        boardElement.css("WebkitTransformOrigin", "0px 0px");
        boardElement.css("WebkitTransform", "scaleX("+ this.currentZoom + ") scaleY(" + this.currentZoom + ")");
    }
    else if (jQuery.browser.msie)
    {
        console.log("apply ie transform " + this.currentZoom + " " + this.initialWidth * this.currentZoom + " " + this.initialHeight * this.currentZoom);
        if ((previousZoom >= 1 && factor > 1) || (this.currentZoom >= 1 && factor < 1)) {
            boardElement.css("width", this.initialWidth * this.currentZoom);
            boardElement.css("height", this.initialHeight * this.currentZoom);
        }
        boardElement.css("filter", "progid:DXImageTransform.Microsoft.Matrix(M11='" + this.currentZoom + "',M21='0', M12='0', M22='" + this.currentZoom + "', sizingmethod='autoexpand')");
    }
}

com.mnemis.wb.controllers.WBBoardController.prototype.mouseDown = function(e)
{
    var that = e.data;
    e.preventDefault();
    that.moving = true;
    switch(that.currentTool)
    {
        case 0: that.beginDrawing(e); break;
        case 1: that.beginErase(e); break;
        case 2: that.beginMarker(e); break;
        case 3: that.beginLaser(e); break;
        case 4: that.beginHand(e); break;
        case 5: that.zoomIn(e); break;
        case 6: that.zoomOut(e); break;
        case 7: that.select(e); break;
    }
    that.originalMovingPos = {
        x: e.screenX,
        y: e.screenY,
        firstMove: true
    };
}

com.mnemis.wb.controllers.WBBoardController.prototype.mouseMove = function(e)
{	        	
    var that = e.data;
    e.preventDefault();
    if (that.moving)
    {
        if (that.editable || that.currentTool == 4)
        {
            switch(that.currentTool)
            {
                case 0: that.draw(e); break;
                case 1: that.erase(e); break;
                case 2: that.marker(e); break;
                case 3: that.laser(e); break;
                case 4: that.hand(e); break;
                case 7: that.move(e); break;
            }
        }			
    }
}

com.mnemis.wb.controllers.WBBoardController.prototype.mouseOut = function(e)
{
    }

com.mnemis.wb.controllers.WBBoardController.prototype.mouseUp = function(e)
{
    var that = e.data;
    e.preventDefault();
    that.moving = false;
    switch(that.currentTool)
    {
        case 0: that.drawingController.endDraw(e); break;
        case 7: that.endMove(e); break;
    }
}


