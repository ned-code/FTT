/**
 * WBEditor is the main function of the application. It define UB namespace.
**/
if (com.mnemis.core.Provide("com/mnemis/wb/core/WBEditor.js"))
{
    // import Webbyboard namespace in WB
    var WB = com.mnemis.wb;

    com.mnemis.core.Import("com/mnemis/core/UndoManager.js");
    com.mnemis.core.Import("com/mnemis/core/ServerManager.js");

    com.mnemis.core.Import("com/mnemis/wb/gui/WBToolPalette.js");
    com.mnemis.core.Import("com/mnemis/wb/gui/WBPagePalette.js");
    com.mnemis.core.Import("com/mnemis/wb/gui/WBUndoPalette.js");
    com.mnemis.core.Import("com/mnemis/wb/model/WBPage.js");
    com.mnemis.core.Import("com/mnemis/wb/controllers/WBBoardController.js");


    // application singleton.
    WB.application = {};

    com.mnemis.wb.core.WBEditor = $.inherit({

        currentDocument: null,
        currentPageId: null,
        previousPageId: undefined,
        nextPageId: undefined,
        applicationUuid: undefined,
        __constructor: function()
        {
            console.log("load WB application");
            var body = $("body").get(0);

            WB.serverManager = new com.mnemis.core.ServerManager();
            WB.application.boardController = new WB.controllers.WBBoardController(true);
            WB.application.undoManager = new com.mnemis.core.UndoManager();

            WB.application.toolpalette = new WB.gui.WBToolPalette(1);
            body.appendChild(WB.application.toolpalette.domNode);
            WB.application.toolpalette.refreshGUI();

            WB.application.pagePalette = new WB.gui.WBPagePalette();
            body.appendChild(WB.application.pagePalette.domNode);

            WB.application.undoPalette = new WB.gui.WBUndoPalette();
            body.appendChild(WB.application.undoPalette.domNode);


            this.applicationUuid = new com.mnemis.core.UUID().id;
            WB.application.viewer = this;
        },
        
        loadPageId : function(documentId, pageId)
        {
            // remove previous page
            $("#board").remove();
            var loading = $('<h1 id="ub-loading">Loading...</h1>');
            $("body").append(loading);
            var that = this;
            this.currentDocument = documentId;
            this.currentPageId = pageId;
            WB.serverManager.getJson("/documents/" + documentId + "/pages/" + pageId + "/info", function(data)
            {
                that.previousPageId = data.previousId.length ? data.previousId : null;
                that.nextPageId = data.nextId.length ? data.nextId : null;
                that.loadPage(data.url);
            });
        },

        loadPage : function(pageUrl)
        {
            var that = this;
            WB.serverManager.getObjects(pageUrl, com.mnemis.wb.model.WBPage, function(data)
            {
                console.log("recieve page json");
                console.log(data);
                var loadedPage = data[0];
                $("#ub-loading").remove();
                $("body").append(loadedPage.domNode);
                WB.application.boardController.setCurrentPage(loadedPage);
            });
        },

        loadPrevioustPage : function()
        {
            if (this.previousPageId)
            {
                this.loadPageId(this.currentDocument, this.previousPageId);
            }
        },

        loadNextPage : function()
        {
            if (this.nextPageId)
            {
                this.loadPageId(this.currentDocument, this.nextPageId);
            }
        },

        goToDocumentPage : function()
        {
            window.location = "/documents";
        }
    });
}