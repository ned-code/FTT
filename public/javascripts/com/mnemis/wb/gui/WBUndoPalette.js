/**
 * Uniboard page palette widget
**/
com.mnemis.core.Provide("com/mnemis/wb/gui/WBUndoPalette.js");

com.mnemis.core.Import("com/mnemis/core/gui/FloatingPalette.js");

com.mnemis.wb.gui.WBUndoPalette = function()
{
	this.domNode = $(
				     "<div id='wb-undopalette' class='wb-floatingpalette' style='height:60px; width:120px'>" +
     				    this.getButtonHtml(0, "undo", "undo.png") +
     				    this.getButtonHtml(1, "redo", "redo.png") +
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

	domNodeWrapper.find("#undo").bind('click', this, this.undo);
	domNodeWrapper.find("#redo").bind('click', this, this.redo);
}

com.mnemis.wb.gui.WBUndoPalette.prototype.getButtonHtml = function(id, name, icon)
{
    return "<div id='" + name + "' class='wb-undopalette-button wb-tool-" + id + "'>" +
     		     "<img src='" + com.mnemis.core.applicationPath + "/static/resources/toolbar/" + icon + "' alt='" + name + "' style='vertical-align:middle'/>"+
     		 "</div>" ;
}

com.mnemis.wb.gui.WBUndoPalette.prototype.undo = function()
 {
    WB.application.undoManager.undo();
 }

com.mnemis.wb.gui.WBUndoPalette.prototype.redo = function()
 {
    WB.application.undoManager.redo();
 }


