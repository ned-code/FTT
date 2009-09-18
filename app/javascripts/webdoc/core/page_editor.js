
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
    currentPage: null,
    currentPageId: null,
    previousPageId: undefined,
    nextPageId: undefined,
    applicationUuid: undefined,
    initialize: function()
    {
        this.applicationUuid = new MTools.UUID().id;
        WebDoc.application.pageEditor = this;
        WebDoc.application.boardController = new WebDoc.BoardController(true);
        WebDoc.application.undoManager = new MTools.UndoManager();
        
        $("#close-page").bind("click", this.close);
        $("#add-page").bind("click", this.add);
		$("#remove-page").bind("click", this.remove);
        $("#previous-page").bind("click", this.previous);
		$("#next-page").bind("click", this.next);		
        $("#zoom-in").bind("click", this.zoomIn);
        $("#zoom-out").bind("click", this.zoomOut);
        $("#undo").bind("click", this.undo);
        $("#redo").bind("click", this.redo);
    },
    
    load: function(documentId)
    {
        MTools.ServerManager.getObjects("/documents/" + documentId, WebDoc.Document, function(data)
        {
            var editor = WebDoc.application.pageEditor;
            editor.currentDocument = data[0];
            editor.loadPageId(documentId, window.location.hash.replace("#", ""));
        });
        
    },
    
    loadPageId: function(documentId, pageId)
    {
		window.location.hash = "#" + pageId;
        // remove previous page
        $("#board-container").empty();
        var loading = $('<div id="ub-loading">Loading...</div>');
        $("board-container").append(loading);
        var that = this;
        this.currentPageId = pageId;
        var that = this;
        MTools.ServerManager.getObjects("/documents/" + documentId + "/pages/" + pageId, WebDoc.Page, function(data)
        {
            var editor = WebDoc.application.pageEditor;
            console.log("recieve page object");
            editor.currentPage = data[0];
            that.previousPageId = editor.currentPage.previousPageId();
            that.nextPageId = editor.currentPage.nextPageId();
            $("#ub-loading").remove();
            $("#board-container").append(editor.currentPage.domNode);
            WebDoc.application.boardController.setCurrentPage(editor.currentPage);
        });
    },
    
    previous: function()
    {
        var editor = WebDoc.application.pageEditor;
		if (editor.currentPage.data.position > 0) 
		{
			editor.loadPageId(editor.currentDocument.uuid(), editor.currentPage.data.position);
		}
    },
    
    next: function()
    {
        var editor = WebDoc.application.pageEditor;
        editor.loadPageId(editor.currentDocument.uuid(), editor.currentPage.data.position + 2);
    },
    
    add: function()
    {
        var editor = WebDoc.application.pageEditor;
        
        var newPage = new WebDoc.Page();
        console.log(editor);
        newPage.data.document_id = editor.currentDocument.uuid();
        newPage.data.position = ++editor.currentPage.data.position;
        newPage.save(function(status)
        {
            editor.loadPageId(editor.currentDocument.uuid(), this.data.position + 1);
        });
    },
    
    duplicatePage: function()
    {
    },
    
    remove: function()
    {
        var editor = WebDoc.application.pageEditor;
		if (editor.currentPage.data.position > 0) 
		{
			editor.currentPage.destroy(function(objet)
			{
				editor.loadPageId(editor.currentDocument.uuid(), this.data.position);
			});
		}
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
        window.close();
    }
});

