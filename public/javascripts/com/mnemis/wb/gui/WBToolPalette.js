/**
 * Uniboard tool palette widget
**/
com.mnemis.core.Provide("com/mnemis/wb/gui/WBToolPalette.js");

com.mnemis.core.Import("com/mnemis/core/gui/FloatingPalette.js");

com.mnemis.wb.gui.WBToolPalette = function(type)
{
	this.domNode = $(
				     "<div id='wb-toolpalette' class='wb-floatingpalette' style='height:" + (type == 1? "430":"220")+ "px'>" +
     				    (type == 1? this.getButtonHtml(0, "pen", "pen.png") : "") +
     				  	(type == 1?this.getButtonHtml(1, "rubber", "eraser.png") : "") +
     				    this.getButtonHtml(4, "hand", "hand.png") +
     				  	(type == 1?this.getButtonHtml(2, "marker", "marker.png") : "") +
     				  	(type == 1?this.getButtonHtml(3, "laser", "laser.png") : "") +
     				    this.getButtonHtml(5, "zoomIn", "zoomIn.png") +
     				    this.getButtonHtml(6, "zoomOut", "zoomOut.png") +
     				  	this.getButtonHtml(7, "arrow", "arrow.png") +                          
     				 "</div>").get(0);

	this._moving = false;
	this._startMousePos = null;
	this._startPosition = null;

    $.extend(this, new com.mnemis.core.gui.FloatingPalette());

	var domNodeWrapper = $(this.domNode);
    domNodeWrapper.bind("mousedown", this, this.mouseDown);
    domNodeWrapper.bind("mousemove", this, this.mouseMove);
    domNodeWrapper.bind("mouseup", this, this.mouseUp);
    domNodeWrapper.bind("mouseout", this, this.mouseOut);

	domNodeWrapper.find("#pen").bind('click', this, this.selectPen);
	domNodeWrapper.find("#rubber").bind('click', this, this.selectRubber);
	domNodeWrapper.find("#hand").bind('click', this, this.selectHand);
	domNodeWrapper.find("#marker").bind('click', this, this.selectMarker);
	domNodeWrapper.find("#laser").bind('click', this, this.selectLaser);
	domNodeWrapper.find("#zoomIn").bind('click', this, this.selectZoomIn);
	domNodeWrapper.find("#zoomOut").bind('click', this, this.selectZoomOut);
	domNodeWrapper.find("#arrow").bind('click', this, this.selectArrow);
}	
	 	


com.mnemis.wb.gui.WBToolPalette.prototype.selectTool = function(toolId)
 {
    WB.application.boardController.setCurrentTool(toolId);
 }
       			  
com.mnemis.wb.gui.WBToolPalette.prototype.selectPen = function(e)
 { 	
 	e.data.selectTool(0);
 }

com.mnemis.wb.gui.WBToolPalette.prototype.selectRubber = function(e)
 {
 	e.data.selectTool(1);
 }                     			  

com.mnemis.wb.gui.WBToolPalette.prototype.selectMarker = function(e)
 {
 	e.data.selectTool(2);
 }
 
com.mnemis.wb.gui.WBToolPalette.prototype.selectLaser = function(e)
 {
 	e.data.selectTool(3);
 }

com.mnemis.wb.gui.WBToolPalette.prototype.selectHand = function(e)
 {
 	e.data.selectTool(4);
 }

com.mnemis.wb.gui.WBToolPalette.prototype.selectZoomIn = function(e)
 {
 	e.data.selectTool(5);
 }

com.mnemis.wb.gui.WBToolPalette.prototype.selectZoomOut = function(e)
 {
 	e.data.selectTool(6);                        
 }

com.mnemis.wb.gui.WBToolPalette.prototype.selectArrow = function(e)
 {
 	e.data.selectTool(7);                 	
 }

com.mnemis.wb.gui.WBToolPalette.prototype.getButtonHtml = function(id, name, icon)
{
    return "<div id='" + name + "' class='wb-toolpalette-button wb-tool-" + id + "' style='margin: 10%; width: 80%'>" +
     		     "<img src='" + com.mnemis.core.applicationPath + "/static/resources/stylusPalette/" + icon + "' alt='" + name + "'/>"+
     		 "</div>" ;
}

com.mnemis.wb.gui.WBToolPalette.prototype.refreshGUI = function()
{
    var oldSelection = $(".wb-tool-button-selected");
    if (oldSelection && oldSelection.length)
    {
        $(oldSelection[0]).removeClass("wb-tool-button-selected");
        var iconElement = oldSelection[0].childNodes[0];
        var iconPath = iconElement.src;
        if (iconPath.match(/On.png/))
        {
            iconElement.src = iconPath.substring(0, iconPath.length - 6) + ".png";
        }
    }

    var classForCurrentTool = ".wb-tool-" + WB.application.boardController.currentTool;
    var toolToSelect = $(classForCurrentTool);
    if (toolToSelect && toolToSelect.length)
    {
        $(toolToSelect[0]).addClass("wb-tool-button-selected");
        iconElement = $(classForCurrentTool)[0].childNodes[0];
        iconPath = iconElement.src;
        iconElement.src = iconPath.substring(0, iconPath.length - 4) + "On.png";
    }
}
