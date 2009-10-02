
/**
* @author julien
* PageEditor is the main application for page viewing and editing.
**/
//= require <MTools/undo_manager>
//= require <MTools/server_manager>
//= require <MTools/uuid>

//= require <WebDoc/adaptors/svg_renderer>
//= require <WebDoc/controllers/board_controller>

//= require <WebDoc/tools/arrow_tool>
//= require <WebDoc/tools/drawing_tool>
//= require <WebDoc/tools/hand_tool>
//= require <WebDoc/tools/text_tool>

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
    
    $("#html_snipplet").bind("click", this.inserthtmlSnipplet);
    WebDoc.application.boardController.addSelectionListener(this);
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
      editor.loadPage(data[0]);
    });
  },

  loadPage: function(page) {
    WebDoc.application.undoManager.clear();
    var editor = WebDoc.application.pageEditor;
    window.location.hash = "#" + (page.data.position + 1);
    editor.currentPage = page;
    editor.previousPageId = editor.currentPage.previousPageId();
    editor.nextPageId = editor.currentPage.nextPageId();
    
    WebDoc.application.boardController.setCurrentPage(editor.currentPage);
    $("#page_css_editor").get(0).value = $.toJSON(editor.currentPage.data.data.css);
  },

  previous: function() {
    var editor = WebDoc.application.pageEditor;
    if (editor.currentPage.data.position > 0) 
    {
      editor.loadPageId(editor.currentDocument.uuid(), editor.currentPage.data.position);
    }
  },

  next: function() {
    var editor = WebDoc.application.pageEditor;
    editor.loadPageId(editor.currentDocument.uuid(), editor.currentPage.data.position + 2);
  },

  add: function() {
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

  duplicatePage: function() {
  },

  remove: function() {
    var editor = WebDoc.application.pageEditor;
    if (editor.currentPage.data.position > 0) 
    {
      editor.currentPage.destroy(function(objet)
      {
        editor.loadPageId(editor.currentDocument.uuid(), this.data.position);
      });
    }
  },

  undo: function() {
    WebDoc.application.undoManager.undo();
  },

  redo: function() {
    WebDoc.application.undoManager.redo();
  },

  zoomIn: function() {
    WebDoc.application.boardController.zoom(1.5);
  },

  zoomOut: function() {
    WebDoc.application.boardController.zoom(1 / 1.5);
  },

  changeBkg: function() {
    var editor = WebDoc.application.pageEditor;
    editor.currentPage.toggleBkg();
    editor.currentPage.save();
  },

  close: function() {
    window.close();
  },

  deleteItem: function() {
      ddd("delete selection actrion");
      WebDoc.application.boardController.deleteSelection();
  },
  
  insertImage: function() {
    console.log("insert image");
    var newItem = new WebDoc.Item();
    newItem.data.media_type = WebDoc.ITEM_TYPE_IMAGE;
    newItem.data.data.tag = "img";
    newItem.data.data.src = "/images/image_view_test.png";
    newItem.data.data.css = { top: "225px", left: "600px", width: "150px", height: "150px"};   
    newItem.recomputeInternalSizeAndPosition();
    WebDoc.application.boardController.insertItems([newItem]);
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
  },
  
  insertWidget: function() {
    console.log("insert widget");
    var newItem = new WebDoc.Item();
    newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
    newItem.data.data.tag = "iframe";
    newItem.data.data.src = "/widgets/VideoPicker.wgt/index.html";
    newItem.data.data.css = { top: "100px", left: "100px", width: "426px", height: "630px"};
    newItem.recomputeInternalSizeAndPosition();
    WebDoc.application.boardController.insertItems([newItem]);   
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);    
  },
  
  inserthtmlSnipplet: function() {
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
  
  applyPageCss: function() {
    eval("var newCss=" + $("#page_css_editor").get(0).value);    
    WebDoc.application.pageEditor.currentPage.applyCss(newCss);
    WebDoc.application.pageEditor.currentPage.save();
  },
  
  applyInnerHtml: function() {
    console.log("apply HTML");
    var html = $("#selected_item_html_editor").get(0).value
    if (html) {
      if (WebDoc.application.boardController.selection.length > 0) {
        WebDoc.application.boardController.selection[0].item.setInnerHtml(html);
        WebDoc.application.boardController.selection[0].item.save();
      }
    }
  },
  
  selectionChanged: function() {
    ddd("selected item ");
    ddd( WebDoc.application.boardController.selection);
    if (WebDoc.application.boardController.selection.length > 0) {
      var html =  WebDoc.application.boardController.selection[0].item.data.data.innerHTML;
      if (html) {
        $("#selected_item_html_editor").get(0).value =html;
      }
      else {
        $("#selected_item_html_editor").get(0).value = "";
      }
    }
    else {
      $("#selected_item_html_editor").get(0).value = "";
    }
  }
});

