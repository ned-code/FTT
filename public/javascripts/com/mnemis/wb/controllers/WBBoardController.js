/**
 * Uniboard board controller
**/
// check that mnemis FW has bveen loadad
if (!com.mnemis || !com.mnemis.core)
{
	alert("mnemis FW has not been loaded");
}

com.mnemis.core.Provide("com/mnemis/wb/controllers/WBBoardController.js");

if (!com.mnemis.wb.controllers) { com.mnemis.wb.controllers = {}};


com.mnemis.wb.controllers.WBBoardController = function(currentPage, editable)
{
    this.editable = editable;
	this.currentTool = 0;
	this.moving = false;
	this.originalMovingPos = null;
	this.currentZoom = 1;
	this.currentPage = currentPage;
	this.selection = [];

	$("#ub_board").bind("mousedown", this, this.mouseDown);
	$("#ub_board").bind("mousemove", this, this.mouseMove);
	$("#ub_board").bind("mouseup", this, this.mouseUp);
	$("#ub_board").bind("mouseout", this, this.mouseOut);
	console.log("init board controller");
	var that = this;
	$(this.currentPage.documentRootNode).find("object").each(function(i)
		{
			console.log("add event listener");
			console.log(this);
			this.addEventListener("mousedown", 
				function(i)
				{
					console.log("mouse down");
				}, 
				true
			);
		}
	);
	$(this.currentPage.documentRootNode).find("iframe").each(function(i)
		{
			if (this.contentWindow)
			{
				var iFrameWrapper = $(this);			
				
				this.contentWindow.addEventListener("mouseup", function(e)
					{
						e.data = that;
						that.mouseUp.call(this, e);
					}, true);
					
				this.contentWindow.addEventListener("mousedown", function(e)
					{
						
						e.data = that;
						e.x = e.clientX + iFrameWrapper.position().left;
						e.y = e.clientY + iFrameWrapper.position().top;
						
						that.mouseDown.call(this, e);
						
					}, true);
					
				this.contentWindow.addEventListener("mousemove", function(e)
					{
						e.data = that;
						//e.x = e.clientX + iFrameWrapper.position().left;
						//e.y = e.clientY + iFrameWrapper.position().top;						
						that.mouseMove.call(this, e);
					}, true);			    
				
			}		
		}
	);     		        
}

com.mnemis.wb.controllers.WBBoardController.prototype.setCurrentTool = function(toolId)
{
	this.currentTool = toolId;
	console.log("select tool " + toolId);
	this.unSelectObjects(this.selection);
    WB.application.toolpalette.refreshGUI();
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
    return {x: calcX, y: calcY};
}

com.mnemis.wb.controllers.WBBoardController.prototype.beginDrawing = function(e)
{
	WB.application.drawingController.beginDraw(e);
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
	WB.application.drawingController.draw(e);
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
	this.originalMovingPos = { x: e.screenX, y: e.screenY};
	e.stopPropagation();
	e.preventDefault();
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
				console.log("widget");
				console.log(this);
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
	 e.preventDefault();
}

com.mnemis.wb.controllers.WBBoardController.prototype._moveItem = function(item, newPosition)
{
	var previousPosition = { left:item.position.left, top:item.position.top};
	var that = this;
	item.moveTo(newPosition);
	WB.application.undoManager.registerUndo(function()
		{
			that._moveItem.call(that, item, previousPosition);
		}
	);	
}

com.mnemis.wb.controllers.WBBoardController.prototype.move = function(e)
{
	if (this.originalMovingPos.firstMove && this.selection.length)
	{
		var selectionToUndo = this.selection[0];
		var that = this;
		var previousPosition = { left:selectionToUndo.position.left, top:selectionToUndo.position.top};
		WB.application.undoManager.registerUndo(function()
			{
				that._moveItem.call(that, selectionToUndo, previousPosition);
			}
		);
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
	this.originalMovingPos = { x: e.screenX, y: e.screenY};
	e.preventDefault();
}

   
com.mnemis.wb.controllers.WBBoardController.prototype.zoom = function(factor)
{
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
	
}

com.mnemis.wb.controllers.WBBoardController.prototype.mouseDown = function(e)
{
	var that = e.data;
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
	that.originalMovingPos = { x: e.screenX, y: e.screenY, firstMove: true};
}

com.mnemis.wb.controllers.WBBoardController.prototype.mouseMove = function(e)
{	        	
	var that = e.data;
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
	//this.mouseUp(e);
}

com.mnemis.wb.controllers.WBBoardController.prototype.mouseUp = function(e)
{
	var that = e.data;
	that.moving = false;
    switch(that.currentTool)
	{
		case 0: WB.application.drawingController.endDraw(e); break;        		
	}	
}


