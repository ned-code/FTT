/**
 * PageEditor is the main application for page viewing and editing. The root method is load(documentId) that will load the first page of document documentId.
 * 
 * @author Julien Bachmann
**/
//= require <mtools/undo_manager>
//= require <mtools/server_manager>
//= require <mtools/uuid>

//= require <webdoc/core/widget_manager>
//= require <webdoc/adaptors/svg_renderer>
//= require <webdoc/adaptors/collaboration_manager>
//= require <webdoc/controllers/board_controller>
//= require <webdoc/library/libraries_controller>
//= require <webdoc/controllers/right_bar_controller>
//= require <webdoc/controllers/inspector_controller>
//= require <webdoc/controllers/page_browser_controller>
//= require <webdoc/controllers/toolbar_controller>

//= require <webdoc/tools/arrow_tool>
//= require <webdoc/tools/drawing_tool>
//= require <webdoc/tools/hand_tool>
//= require <webdoc/tools/text_tool>
//= require <webdoc/tools/html_tool>

// application singleton.
WebDoc.application = {};

WebDoc.PageEditor = $.klass({

  currentDocument: null,
  currentPage: null,
  applicationUuid: undefined,
  
  initialize: function(editable) {
    this.applicationUuid = new MTools.UUID().id;
    MTools.ServerManager.sourceId = this.applicationUuid;
    WebDoc.application.pageEditor = this;
    WebDoc.application.undoManager = new MTools.UndoManager();
        
    WebDoc.application.widgetManager = new WebDoc.WidgetManager();
    // create all controllers
    WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();
    WebDoc.application.boardController = new WebDoc.BoardController(editable, !editable);
    // WebDoc.application.librariesController = new WebDoc.LibrariesController();
    WebDoc.application.rightBarController = new WebDoc.RightBarController();
    WebDoc.application.inspectorController = new WebDoc.InspectorController();
    WebDoc.application.pageBrowserController = new WebDoc.PageBrowserController();
    WebDoc.application.toolbarController = new WebDoc.ToolbarController();
    
    // create all tools
    WebDoc.application.drawingTool = new WebDoc.DrawingTool("#tool_pen");
    WebDoc.application.arrowTool = new WebDoc.ArrowTool("#tool_arrow");
    WebDoc.application.handTool = new WebDoc.HandTool("#tool_hand");
    WebDoc.application.textTool = new WebDoc.TextTool("#tool_text", "#palette_text");
    WebDoc.application.htmlSnipplet = new WebDoc.HtmlTool("#html_snipplet");

    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
    WebDoc.application.collaborationManager = new WebDoc.CollaborationManager();
    
    var boardContainer = $("#board_container"),
        leftBar = $("#left_bar"),
        rightBar = $("#right_bar");
    
    $(window).unload(function() {
        WebDoc.application.collaborationManager.disconnect();
    });
  },

  load: function(documentId) {
    ddd("load document " + documentId);
    WebDoc.application.collaborationManager.listenXMPPNode(documentId);              
    MTools.ServerManager.getRecords(WebDoc.Document, documentId, function(data)
    {
      this.currentDocument = data[0];
      this.currentDocument.addListener(this);
      WebDoc.application.pageBrowserController.setDocument(this.currentDocument);
      this.loadPageId(window.location.hash.replace("#", ""));
      WebDoc.application.pageBrowserController.initializePageBrowser();
      ddd("check editablity");
      if (WebDoc.application.boardController.isEditable()) {
        ddd("Show lib");
        WebDoc.application.rightBarController.showLib();
      }
    }.pBind(this));
    
    // ===========================================================
    // = TODO REMOVE THIS (ZENO USES THIS TO DEBUG LIBRARY)
    // setTimeout(function(){
    //   WebDoc.application.rightBarController.showRightBar(WebDoc.application.rightBarController.showLib.pBind(WebDoc.application.rightBarController));
    // },500);
    // setTimeout(function(){
    //   $('#videos').click();
    // },600);
    // ===========================================================
  },

  loadPageId: function(pageId) {
    if (!pageId) {
      pageId = "1";
    }
    ddd("load page id " + pageId);
    var pageToLoad = this.currentDocument.findPageWithUuidOrPosition(pageId);
    ddd("found page");
    ddd(pageToLoad);
    if (pageToLoad) {
      this.loadPage(pageToLoad);
    }
  },

  loadPage: function(page) {
    WebDoc.application.undoManager.clear();
    ddd("set hash to current page position");
    window.location.hash = "#" + (page.uuid());
    this.currentPage = page;
    
    WebDoc.application.boardController.setCurrentPage(this.currentPage);
  },

  'prev-page': function(e) {
    var previousPage = this.currentDocument.previousPage(this.currentPage);
    if (previousPage) {
      this.loadPage(previousPage);
    }
  },

  'next-page': function(e) {
    var nextPage = this.currentDocument.nextPage(this.currentPage);
    if (nextPage) {
      this.loadPage(nextPage);
    }
  },

  'add-page': function(e) {
    var newPage = new WebDoc.Page(null, this.currentDocument);
    // we don't need to set foreign keys. It is autoatically done on the server side
    //newPage.data.document_id = this.currentDocument.data.document_id;
    newPage.data.position = this.currentPage.data.position + 1;
    newPage.save(function(newObject, status)
    {
      ddd("new page ", newPage, newObject);
      this.currentDocument.addPage(newPage, true);      
      this.loadPage(newPage);
    }.pBind(this));
  },
 
  removePage: function(e) {
    var pageToDelete = this.currentPage;
    if (this.currentDocument.pages.length > 1) {
      var choice = confirm("Are you sure you want to delete the current page?");
      if (choice) {
        this.currentPage.destroy(function(objet) {
          this.currentDocument.removePage(pageToDelete, true);
        }.pBind(this));
      }
    }
  },

  copyPage: function(e) {
    var copiedPage = this.currentPage.copy();
    copiedPage.setDocument(this.currentPage.getDocument());
    var copiedPagePosition = this.currentDocument.positionOfPage(this.currentPage) - 1;
    copiedPage.data.position = copiedPagePosition + 1;
    //var importingMessage = $("<li>").html("importing...").addClass("page_thumb_importing");       
    //droppedPageThumb.parent().after(importingMessage[0]);
    copiedPage.save(function(newObject, status) {
      this.currentDocument.addPage(copiedPage, true);
      this.loadPage(copiedPage);
    }.pBind(this));
  },
  
  pageRemoved: function(page) {
    if (page == this.currentPage) {
      var newPagePosition = 0;
      if (page.data.position > 0) {
        newPagePosition = page.data.position - 1;
      }      
      this.loadPage(this.currentDocument.pages[newPagePosition]);
    }
  }

});

