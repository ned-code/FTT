
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
    WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();
    WebDoc.application.pageEditor = this;
    WebDoc.application.boardController = new WebDoc.BoardController(true);
    WebDoc.application.imageLibraryController = new WebDoc.ImageLibraryController();
    WebDoc.application.widgetLibraryController = new WebDoc.WidgetLibraryController();  
    WebDoc.application.inspectorController = new WebDoc.InspectorController();      
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
    $("#image_lib").bind("click", this.toggleImageLib);
    $("#widget_lib").bind("click", this.toggleWidgetLib);
    
    $("#html_snipplet").bind("click", this.inserthtmlSnipplet);
    WebDoc.application.boardController.addSelectionListener(this);
    
    var height = window.innerHeight - $("#board_container").offset().top;
    $("#board_container").height(height -10);
    $("#inspector").height(height -10);
    $(window).bind("resize", function() {
      var height = window.innerHeight - $("#board_container").offset().top;
      $("#board_container").height(height -10);
      $("#inspector").height(height -10);
      WebDoc.application.boardController.centerBoard();
    }.pBind(this));
    
    if (MTools.Browser.WebKit) {
       $("#board_container").css("marginRight", "0px");       
    }
    
    $("#inspector_tabs").tabs();
    
  },

  load: function(documentId) {
    MTools.ServerManager.getObjects("/documents/" + documentId, WebDoc.Document, function(data)
    {
      var editor = WebDoc.application.pageEditor;
      editor.currentDocument = data[0];
      editor.loadPageId(documentId, window.location.hash.replace("#", ""));
    });
  },

  loadPageId: function(documentId, pageId) {
    this.currentPageId = pageId;
    MTools.ServerManager.getObjects("/documents/" + documentId + "/pages/" + pageId, WebDoc.Page, function(data)
    {
      var editor = WebDoc.application.pageEditor;
      if (data.length > 0) {
        editor.loadPage(data[0]);
      }
    });
  },

  loadPage: function(page) {
    WebDoc.application.undoManager.clear();
    var editor = WebDoc.application.pageEditor;
    ddd("set hash to current page position");
    window.location.hash = "#" + (page.uuid());
    editor.currentPage = page;
    editor.previousPageId = editor.currentPage.previousPageId();
    editor.nextPageId = editor.currentPage.nextPageId();
    
    WebDoc.application.boardController.setCurrentPage(editor.currentPage);
    $("#page_css_editor").get(0).value = $.toJSON(editor.currentPage.data.data.css);
  },

  previous: function(e) {
    e.preventDefault();
    var editor = WebDoc.application.pageEditor;
    if (editor.currentPage.data.position > 0) 
    {
      editor.loadPageId(editor.currentDocument.uuid(), editor.currentPage.data.position);
    }
  },

  next: function(e) {
    e.preventDefault();    
    var editor = WebDoc.application.pageEditor;
    editor.loadPageId(editor.currentDocument.uuid(), editor.currentPage.data.position + 2);
  },

  add: function(e) {
    e.preventDefault();
    var editor = WebDoc.application.pageEditor;

    var newPage = new WebDoc.Page();
    newPage.data.document_id = editor.currentDocument.uuid();
    newPage.data.position = ++editor.currentPage.data.position;
    newPage.save(function(status)
    {
      ddd("load");
      ddd(this);
      editor.loadPage(this);
    });
  },

  duplicatePage: function(e) {
    e.preventDefault();
  },

  remove: function(e) {
    e.preventDefault();
    var editor = WebDoc.application.pageEditor;
    if (editor.currentPage.data.position > 0) 
    {
      editor.currentPage.destroy(function(objet)
      {
        editor.loadPageId(editor.currentDocument.uuid(), this.data.position);
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
    console.log("insert snipplet");
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
  
  selectionChanged: function() {
    ddd("selected item ");
    ddd( WebDoc.application.boardController.selection);
    if (WebDoc.application.boardController.selection.length > 0) {
      $("#inspector_tabs").tabs("enable", 0);
      $("#inspector_tabs").tabs("enable", 1);
      var html =  WebDoc.application.boardController.selection[0].item.data.data.innerHTML;
      if (html) {
        $("#selected_item_html_editor").get(0).value =html;
      }
      else {
        $("#selected_item_html_editor").get(0).value = "";
      }
      WebDoc.application.inspectorController.selectInspector(WebDoc.application.boardController.selection[0].inspectorId())
    }
    else {
      WebDoc.application.inspectorController.selectInspector(0)      
      $("#selected_item_html_editor").get(0).value = "";
      $("#inspector_tabs").tabs("disable", 0);
      $("#inspector_tabs").tabs("disable", 1);
    }
  }
});

