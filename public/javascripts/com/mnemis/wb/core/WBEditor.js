/**
 * WBEditor is the main function of the application. It define UB namespace.
**/
com.mnemis.core.Provide("com/mnemis/wb/core/WBEditor.js");
// import Webbyboard namespace in WB
var WB = com.mnemis.wb;

com.mnemis.core.Import("com/mnemis/core/UndoManager.js");

com.mnemis.core.Import("com/mnemis/wb/gui/WBToolPalette.js");
com.mnemis.core.Import("com/mnemis/wb/gui/WBPagePalette.js");
com.mnemis.core.Import("com/mnemis/wb/model/WBPage.js");
com.mnemis.core.Import("com/mnemis/wb/controllers/WBBoardController.js");


// application singleton.
WB.application = {};

com.mnemis.wb.core.WBEditor = function()
{
    console.log("load WB application");
    var body = $("body").get(0);

    WB.application.boardController = new WB.controllers.WBBoardController(true);

    WB.application.toolpalette = new WB.gui.WBToolPalette(1);
    body.appendChild(WB.application.toolpalette.domNode);
    WB.application.toolpalette.refreshGUI();

    WB.application.pagePalette = new WB.gui.WBPagePalette();
    body.appendChild(WB.application.pagePalette.domNode);

    WB.application.undoManager = new com.mnemis.core.UndoManager();

    this.currentDocument = null;
    this.currentPageId = null;
    this.previousPageId = undefined;
    this.nextPageId = undefined;

    WB.application.viewer = this;
}

com.mnemis.wb.core.WBEditor.prototype.loadPage = function(pageUrl)
{
    // remove previous page
    $("#ub_board").remove();
    var loading = $("<h1>Loading...</h1>");
    $("body").append(loading);
    // load new page
    $.get(pageUrl, null, function(data, textStatus)
        {
            var loadedPageData = $(data);
            var boardElement = loadedPageData.find("#ub_board").get(0);
            var loadedPage = new com.mnemis.wb.model.WBPage(boardElement);
            loading.remove();
            $("body").append(boardElement);
            WB.application.boardController.setCurrentPage(loadedPage);
        }, "xml");
}

com.mnemis.wb.core.WBEditor.prototype.loadPageId = function(documentId, pageId)
{
    var that = this;
    this.currentDocument = documentId;
    this.currentPageId = pageId;
    $.getJSON(com.mnemis.core.applicationPath + "/documents/" + documentId + "/pages/" + pageId, null, function(data)
    {
        that.previousPageId = data.previousId.length ? data.previousId : null;
        that.nextPageId = data.nextId.length ? data.nextId : null;
        that.loadPage(data.url);
    });
}

com.mnemis.wb.core.WBEditor.prototype.loadPrevioustPage = function()
{
    if (this.previousPageId)
    {
        this.loadPageId(this.currentDocument, this.previousPageId);
    }
}

com.mnemis.wb.core.WBEditor.prototype.loadNextPage = function()
{
    if (this.nextPageId)
    {
        this.loadPageId(this.currentDocument, this.nextPageId);
    }
}

com.mnemis.wb.core.WBEditor.prototype.goToDocumentPage = function()
{
    window.location = com.mnemis.core.applicationPath + "/documents/" + this.currentDocument;
}

// load application
$(function()
	{
        console.log("viewer document ready");
	}
);
