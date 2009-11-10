
/**
 * PageEditor is the main application for page viewing and editing. The root method is load(documentId) that will load the first page of document documentId.
 * 
 * @author Julien Bachmann
**/
//= require <mtools/undo_manager>
//= require <mtools/server_manager>
//= require <mtools/uuid>

//= require <webdoc/adaptors/svg_renderer>
//= require <webdoc/controllers/board_controller>
//= require <webdoc/controllers/image_library_controller>
//= require <webdoc/controllers/widget_library_controller>
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
  currentPageId: null,
  applicationUuid: undefined,
  
  initialize: function() {
    this.applicationUuid = new MTools.UUID().id;
    WebDoc.application.pageEditor = this;
    WebDoc.application.undoManager = new MTools.UndoManager();
        
    // create all controllers
    WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();
    WebDoc.application.boardController = new WebDoc.BoardController(true);
    WebDoc.application.imageLibraryController = new WebDoc.ImageLibraryController();
    WebDoc.application.widgetLibraryController = new WebDoc.WidgetLibraryController();  
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
    
    // resize height of GUI when window is resized. It cannot be done with CSS (or it is very difficult)
    var height = window.innerHeight - $("#board_container").offset().top;
    $("#board_container").height(height -10);
    $("#right_bar").height(height -10);
    $("#left_bar").height(height -10);
    $(window).bind("resize", function() {
      var height = window.innerHeight - $("#board_container").offset().top;
      $("#board_container").height(height -10);
      $("#right_bar").height(height -10);
      $("#left_bar").height(height -10);
      WebDoc.application.boardController.centerBoard();
    }.pBind(this));
    
    // It seems that webkit don't need the margin een if content is 100% width
    if (MTools.Browser.WebKit) {
       $("#board_container").css("marginRight", "0px");       
    }    
  },

  load: function(documentId) {
    ddd("load document " + documentId);
    MTools.ServerManager.getObjects("/documents/" + documentId, WebDoc.Document, function(data)
    {
      var editor = WebDoc.application.pageEditor;
      editor.currentDocument = data[0];
      WebDoc.application.pageBrowserController.setDocument(editor.currentDocument);
      editor.loadPageId(window.location.hash.replace("#", ""));
    });
  },

  loadPageId: function(pageId) {
    var editor = WebDoc.application.pageEditor;
    ddd("load page id " + pageId);
    var pageToLoad = editor.currentDocument.findPageWithUuidOrPosition(pageId);
    ddd("found page");
    ddd(pageToLoad);
    if (pageToLoad) {
      this.currentPageId = pageId;
      editor.loadPage(pageToLoad);
    }
  },

  loadPage: function(page) {
    WebDoc.application.undoManager.clear();
    var editor = WebDoc.application.pageEditor;
    ddd("set hash to current page position");
    window.location.hash = "#" + (page.uuid());
    editor.currentPage = page;
    
    WebDoc.application.boardController.setCurrentPage(editor.currentPage);
  },

  previousPage: function(e) {
    var previousPage = this.currentDocument.previousPage(this.currentPage);
    if (previousPage) {
      this.loadPage(previousPage);
    }
  },

  nextPage: function(e) {
    var nextPage = this.currentDocument.nextPage(this.currentPage);
    if (nextPage) {
      this.loadPage(nextPage);
    }
  },

  addPage: function(e) {
    var newPage = new WebDoc.Page();
    newPage.data.document_id = this.currentDocument.uuid();
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
          var newPagePosition = 0;
          if (pageToDelete.data.position > 0) {
            newPagePosition = pageToDelete.data.position - 1;
          }
          this.currentDocument.removePage(pageToDelete, true);
          this.loadPage(this.currentDocument.pages[newPagePosition]);
        }.pBind(this));
      }
    }
  },

});

