
/**
 * @author julien
 * WBPageEditor is the main application for page viewing and editing.
 **/
if (com.mnemis.core.Provide("com/mnemis/wb/core/WBPageEditor.js")) 
{
    // import Webbyboard namespace in WB
    var WB = com.mnemis.wb;
    
    com.mnemis.core.Import("com/mnemis/core/UndoManager.js");
    com.mnemis.core.Import("com/mnemis/core/ServerManager.js");
    com.mnemis.core.Import("com/mnemis/core/UUID.js");
	com.mnemis.core.Import("com/mnemis/wb/controllers/WBBoardController.js")
    
    // application singleton.
    WB.application = {};
    
    com.mnemis.wb.core.WBPageEditor = $.inherit(
    {
		currentDocument: null,
        currentPageId: null,
        previousPageId: undefined,
        nextPageId: undefined,
		applicationUuid: undefined,
        __constructor: function()
        {
            this.applicationUuid = new com.mnemis.core.UUID().id;
            WB.application.pageEditor = this;
		    WB.application.boardController = new WB.controllers.WBBoardController(true);
            WB.application.serverManager = new com.mnemis.core.ServerManager();
            WB.application.undoManager = new com.mnemis.core.UndoManager();
        },
		
		load : function(documentId)
        {
			this.loadPageId(documentId, window.location.hash.replace("#", ""));
        },

        loadPageId : function(documentId, pageId)
        {
            // remove previous page
            $("#boardContainer").empty();
            var loading = $('<div id="ub-loading">Loading...</div>');
            $("boardContainer").append(loading);
            var that = this;
            this.currentDocument = documentId;
            this.currentPageId = pageId;
			var that = this;
            WB.application.serverManager.getObjects("/documents/" + documentId + "/pages/" + pageId + "/content", com.mnemis.wb.model.WBPage, function(data)
            {
                console.log("recieve page object");                
                var loadedPage = data[0];
				console.log(loadedPage);
				that.previousPageId = loadedPage.previousPageId();
                that.nextPageId = loadedPage.nextPageId();
                $("#ub-loading").remove();
                $("#boardContainer").append(loadedPage.domNode);
                WB.application.boardController.setCurrentPage(loadedPage);
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
		},
		
		redo: function()
		{
		},
		
		zoomIn: function()
		{
		},
		
		zoomOut: function()
		{
		},
		
		close: function()
		{
		}
    });
}
