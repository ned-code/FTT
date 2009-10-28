
/**
* @author julien
* PageEditor is the main application for page viewing and editing.
**/
//= require <mtools/undo_manager>
//= require <mtools/server_manager>
//= require <mtools/uuid>

//= require <webdoc/adaptors/svg_renderer>
//= require <webdoc/controllers/board_controller>
//= require <webdoc/controllers/image_library_controller>
//= require <webdoc/controllers/widget_library_controller>
//= require <webdoc/controllers/inspector_controller>
//= require <webdoc/controllers/page_browser_controller>

//= require <webdoc/tools/arrow_tool>
//= require <webdoc/tools/drawing_tool>
//= require <webdoc/tools/hand_tool>
//= require <webdoc/tools/text_tool>

// application singleton.
WebDoc.application = {};

WebDoc.PageEditor = $.klass({

  currentDocument: null,
  currentPage: null,
  currentPageId: null,
  previousPageId: undefined,
  nextPageId: undefined,
  applicationUuid: undefined,
  initialize: function() {
    this.applicationUuid = new MTools.UUID().id;
    WebDoc.application.pageEditor = this;
    
    WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();
    WebDoc.application.boardController = new WebDoc.BoardController(true);
    WebDoc.application.imageLibraryController = new WebDoc.ImageLibraryController();
    WebDoc.application.widgetLibraryController = new WebDoc.WidgetLibraryController();  
    WebDoc.application.inspectorController = new WebDoc.InspectorController();
    WebDoc.application.pageBrowserController = new WebDoc.PageBrowserController();
    WebDoc.application.drawingTool = new WebDoc.DrawingTool("#tool_pen");
    WebDoc.application.arrowTool = new WebDoc.ArrowTool("#tool_arrow");
    WebDoc.application.handTool = new WebDoc.HandTool("#tool_hand");
    WebDoc.application.textTool = new WebDoc.TextTool("#tool_text", "#palette_text");

    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
    WebDoc.application.undoManager = new MTools.UndoManager();

    $("#close-page").bind("click", this.close);
    $("#add-page").bind("click", this.add);
    $("#remove-page").bind("click", this.remove);
    $("#previous-page").bind("click", this.previous);
    $("#next-page").bind("click", this.next);
    $("#change-bkg").bind("click", this.changeBkg);
    $("#zoom-in").bind("click", this.zoomIn);
    $("#zoom-out").bind("click", this.zoomOut);
    $("#undo").bind("click", this.undo);
    $("#redo").bind("click", this.redo);
    $("#default-image").bind("click", this.insertImage);
    $("#default_widget").bind("click", this.insertWidget);
    $("#page_css_editor").bind("blur", this.applyPageCss);
    $("#selected_item_html_editor").bind("blur", this.applyInnerHtml);
    $("#remove_selection").bind("click", this.deleteItem);
    $("#page_browser").bind("click", this.toggleBrowser);
    $("#lib_view").bind("click", this.toggleLib);
    
    $("#html_snipplet").bind("click", this.inserthtmlSnipplet);
    
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
    $("#page_css_editor").get(0).value = $.toJSON(editor.currentPage.data.data.css);
  },

  previous: function(e) {
    e.preventDefault();
    var editor = WebDoc.application.pageEditor;
    var previousPage = editor.currentDocument.previousPage(editor.currentPage);
    if (previousPage) {
      editor.loadPage(previousPage);
    }
  },

  next: function(e) {
    e.preventDefault();  
    var editor = WebDoc.application.pageEditor;
    var nextPage = editor.currentDocument.nextPage(editor.currentPage);
    if (nextPage) {
      editor.loadPage(nextPage);
    }
  },

  add: function(e) {
    e.preventDefault();
    var editor = WebDoc.application.pageEditor;

    var newPage = new WebDoc.Page();
    newPage.data.document_id = editor.currentDocument.uuid();
    newPage.data.position = editor.currentPage.data.position + 1;
    newPage.save(function(status)
    {
      editor.currentDocument.addPage(newPage, true);
      editor.loadPage(this);
    });
  },

  duplicatePage: function(e) {
    e.preventDefault();
  },

  remove: function(e) {
    e.preventDefault();
    var editor = WebDoc.application.pageEditor;
    var pageToDelete = editor.currentPage;
    if (editor.currentDocument.pages.length > 1) 
    {
      editor.currentPage.destroy(function(objet)
      {
        var newPagePosition = 0;
        if (pageToDelete.data.position > 0) {
          newPagePosition = pageToDelete.data.position - 1;
        }
        editor.currentDocument.removePage(pageToDelete, true);
        editor.loadPage(editor.currentDocument.pages[newPagePosition]);
      });
    }
  },

  undo: function(e) {
    e.preventDefault();
    WebDoc.application.undoManager.undo();
  },

  redo: function(e) {
    e.preventDefault();
    WebDoc.application.undoManager.redo();
  },

  zoomIn: function(e) {
    e.preventDefault();
    WebDoc.application.boardController.zoomIn();
  },

  zoomOut: function(e) {
    e.preventDefault();
    WebDoc.application.boardController.zoomOut();
  },

  close: function() {
    window.close();
  },

  deleteItem: function(e) {
    e.preventDefault();
    ddd("delete selection actrion");
    WebDoc.application.boardController.deleteSelection();
  },
  
  inserthtmlSnipplet: function(e) {
    e.preventDefault();
    ddd("insert snipplet");
    var newItem = new WebDoc.Item();
    newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
    newItem.data.data.tag = "div";
    newItem.data.data.innerHTML = "HTML Snipplet";
    newItem.data.data.css = { top: "100px", left: "100px", width: "100px", height: "100px"};
    newItem.recomputeInternalSizeAndPosition();
    WebDoc.application.boardController.insertItems([newItem]);
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);    
  },
  
  applyPageCss: function(e) {
    e.preventDefault();
    var editor = WebDoc.application.pageEditor;
    if ($.toJSON(editor.currentPage.data.data.css) != $("#page_css_editor").get(0).value) {
      var newCss = null;
      try {
        eval("newCss=" + $("#page_css_editor").get(0).value);
      }
      catch(ex) {
        ddd("Invalid css");
        $("#page_css_editor").get(0).value = $.toJSON(editor.currentPage.data.data.css);
      }
      if (newCss) {
        WebDoc.application.pageEditor.currentPage.applyCss(newCss);
        WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage);
      }
    }
  },
  
  applyInnerHtml: function(e) {
    e.preventDefault();
    var html = $("#selected_item_html_editor").get(0).value
    if (html) {
      if (WebDoc.application.boardController.selection.length > 0) {
        WebDoc.application.boardController.selection[0].item.setInnerHtml(html);
      }
    }
  },
  
  toggleLib: function(e) {
    e.preventDefault();
    $("#inspector").slideToggle("fast");
    $("#libraries").slideToggle("fast");
  },
  
  toggleBrowser: function(e) {
    e.preventDefault();
    WebDoc.application.pageBrowserController.toggleBrowser(function() {
      WebDoc.application.boardController.centerBoard();
    });
  }
});

