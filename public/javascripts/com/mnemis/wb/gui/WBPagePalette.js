/**
 * Uniboard page palette widget
**/
com.mnemis.core.Provide("com/mnemis/wb/gui/WBPagePalette.js");

com.mnemis.core.Import("com/mnemis/core/gui/FloatingPalette.js");

com.mnemis.wb.gui.WBPagePalette = function()
{
    this.domNode = $(
        "<div id='wb-pagepalette' class='wb-floatingpalette' style='height:60px; width:230px'>" +
        this.getButtonHtml(3, "clear", "clearPage.png") +
        this.getButtonHtml(4, "previous", "previousPage.png") +
        this.getButtonHtml(5, "pages", "documents.png") +
        this.getButtonHtml(6, "next", "nextPage.png") +
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

    domNodeWrapper.find("#clear").bind('click', this, this.clearPage);
    domNodeWrapper.find("#previous").bind('click', this, this.previousPage);
    domNodeWrapper.find("#pages").bind('click', this, this.pages);
    domNodeWrapper.find("#next").bind('click', this, this.nextPage);
}

com.mnemis.wb.gui.WBPagePalette.prototype.getButtonHtml = function(id, name, icon)
{
    return "<div id='" + name + "' class='wb-pagepalette-button wb-tool-" + id + "'>" +
    "<img src='" + com.mnemis.core.applicationPath + "/static/resources/toolbar/" + icon + "' alt='" + name + "' style='vertical-align:middle'/>"+
    "</div>" ;
}

com.mnemis.wb.gui.WBPagePalette.prototype.clearPage = function()
{
    WB.application.boardController.currentPage.clear();
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

