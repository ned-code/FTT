
/**
 * @author julien
 * PageEditor is the main application for page viewing and editing.
 **/

//= require <MTools/undo_manager>
//= require <MTools/server_manager>
//= require <MTools/uuid>

//= require <WebDoc/controllers/board_controller>

// application singleton.
WebDoc.application = {};

WebDoc.PageEditor = $.klass(
{
    currentDocument: null,
    currentPageId: null,
    previousPageId: undefined,
    nextPageId: undefined,
    applicationUuid: undefined,
    initialize: function()
    {
        this.applicationUuid = new MTools.UUID().id;
        WebDoc.application.pageEditor = this;
        WebDoc.application.boardController = new WebDoc.BoardController(true);
        WebDoc.application.serverManager = new MTools.ServerManager();
        WebDoc.application.undoManager = new MTools.UndoManager();
    },
    
    load: function(documentId)
    {
        this.loadPageId(documentId, window.location.hash.replace("#", ""));
    },
    
    loadPageId: function(documentId, pageId)
    {
        // remove previous page
        $("#board-container").empty();
        var loading = $('<div id="ub-loading">Loading...</div>');
        $("board-container").append(loading);
        var that = this;
        this.currentDocument = documentId;
        this.currentPageId = pageId;
        var that = this;
        WebDoc.application.serverManager.getObjects("/documents/" + documentId + "/pages/" + pageId, WebDoc.Page, function(data)
        {
            console.log("recieve page object");
            var loadedPage = data[0];
            console.log(loadedPage);
            that.previousPageId = loadedPage.previousPageId();
            that.nextPageId = loadedPage.nextPageId();
            $("#ub-loading").remove();
            $("#board-container").append(loadedPage.domNode);
            WebDoc.application.boardController.setCurrentPage(loadedPage);
        });
    },
    
    previousPage: function()
    {
        if (this.previousPageId) 
        {
            this.loadPageId(this.currentDocument, this.previousPageId);
        }
    },
    
    nextPage: function()
    {
        if (this.nextPageId) 
        {
            this.loadPageId(this.currentDocument, this.nextPageId);
        }
    },
    
    newPage: function()
    {
    },
    
    duplicatePage: function()
    {
    },
    
    deletePage: function()
    {
    },
    
    undo: function()
    {
        WebDoc.application.undoManager.undo();
    },
    
    redo: function()
    {
        WebDoc.application.undoManager.redo();
    },
    
    zoomIn: function()
    {
        WebDoc.application.boardController.zoom(1.5);
    },
    
    zoomOut: function()
    {
        WebDoc.application.boardController.zoom(1 / 1.5);
    },
    
    close: function()
    {
    }
});

