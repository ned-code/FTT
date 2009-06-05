/**
 * Uniboard page palette widget
**/
com.mnemis.core.Provide("com/mnemis/wb/gui/WBPagePalette.js");


com.mnemis.wb.gui.WBPagePalette = function()
{
	this.domNode = $(
				     "<div id='wb-pagepalette' class='wb-floatingpalette' style='height:60px; width:170px'>" +
     				    this.getButtonHtml(4, "previous", "previousPage.png") +
     				    this.getButtonHtml(5, "pages", "documents.png") +
     				    this.getButtonHtml(6, "next", "nextPage.png") +
     				 "</div>").get(0);

	this._moving = false;
	this._startMousePos = null;
	this._startPosition = null;

	var domNodeWrapper = $(this.domNode);
    domNodeWrapper.bind("mousedown", this, this.mouseDown);
    domNodeWrapper.bind("mousemove", this, this.mouseMove);
    domNodeWrapper.bind("mouseup", this, this.mouseUp);
    domNodeWrapper.bind("mouseout", this, this.mouseOut);

	domNodeWrapper.find("#previous").bind('click', this, this.previousPage);
	domNodeWrapper.find("#pages").bind('click', this, this.pages);
	domNodeWrapper.find("#next").bind('click', this, this.nextPage);
}

com.mnemis.wb.gui.WBPagePalette.prototype.getButtonHtml = function(id, name, icon)
{
    return "<div id='" + name + "' class='wb-pagepalette-button wb-tool-" + id + "'>" +
     		     "<img src='/static/resources/toolbar/" + icon + "' alt='" + name + "' style='vertical-align:middle'/>"+
     		 "</div>" ;
}

com.mnemis.wb.gui.WBPagePalette.prototype.previousPage = function()
 {
    WB.application.viewer.loadPrevioustPage();
 }

com.mnemis.wb.gui.WBPagePalette.prototype.nextPage = function()
 {
    WB.application.viewer.loadNextPage();
 }

com.mnemis.wb.gui.WBPagePalette.prototype.pages = function()
 {
        WB.application.viewer.goToDocumentPage();
 }

com.mnemis.wb.gui.WBPagePalette.prototype.mouseDown = function(e)
 {
 	var that = e.data;
 	that._moving = true;
 	that._startMousePos = { x:e.clientX, y:e.clientY};
 	that._starPosition = $(that.domNode).position();
    // as position is fixed we must take care about scroll
    that._starPosition.top -= window.scrollY;
    that._starPosition.left -= window.scrollX;
	e.preventDefault();
    e.stopPropagation();
 }

com.mnemis.wb.gui.WBPagePalette.prototype.mouseUp = function(e)
 {
 	var that = e.data;
 	that._moving = false;
 	that._startMousePos = null;
 	e.preventDefault();
    e.stopPropagation();
 }

com.mnemis.wb.gui.WBPagePalette.prototype.mouseOut = function(e)
 {
//     if (e.target == e.data.domNode)
//     {
//        console.log(e);
//        var that = e.data;
//        that.mouseUp(e);
//     }
 }

com.mnemis.wb.gui.WBPagePalette.prototype.mouseMove = function(e)
 {
 	var that = e.data;
 	if (that._moving)
 	{
 		var xDiff = e.clientX - that._startMousePos.x;
 		var yDiff = e.clientY - that._startMousePos.y;
		if (xDiff > 5 || xDiff < -5 || yDiff > 5 || yDiff < -5)
		{
     		var newLeft = that._starPosition.left + xDiff;
     		var newTop = that._starPosition.top + yDiff;
     		if (newLeft < 0)
     			newLeft = 0;
     		if (newTop < 0)
     			newTop = 0;

     		$(that.domNode).css({ left: newLeft + 'px', top: newTop + 'px'});
		}
		e.preventDefault();
        e.stopPropagation();
 	}
 }
