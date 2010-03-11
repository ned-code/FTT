/**
 * PageEditor is the main application for page viewing and editing. The root method is load(documentId) that will load the first page of document documentId.
 * 
 * @author Julien Bachmann
**/
//= require <mtools/application>
//= require <mtools/undo_manager>
//= require <mtools/server_manager>
//= require <mtools/uuid>

//= require <webdoc/core/widget_manager>
//= require <webdoc/core/webdoc_handlers>
//= require <webdoc/core/pasteboard_manager>
//= require <webdoc/adaptors/svg_renderer>
//= require <webdoc/core/collaboration_manager>
//= require <webdoc/controllers/board_controller>
//= require <webdoc/library/libraries_controller>
//= require <webdoc/controllers/right_bar_controller>
//= require <webdoc/controllers/inspector_controller>
//= require <webdoc/controllers/page_browser_controller>
//= require <webdoc/controllers/toolbar_controller>
//= require <webdoc/controllers/document_categories_controller>

//= require <webdoc/tools/arrow_tool>
//= require <webdoc/tools/drawing_tool>
//= require <webdoc/tools/hand_tool>
//= require <webdoc/tools/text_tool>
//= require <webdoc/tools/html_tool>

//= require <webdoc/utils/field_validator>

// application singleton.
WebDoc.application = {};

WebDoc.PageEditor = $.klass(MTools.Application,{

  currentDocument: null,
  currentPage: null,
  
  initialize: function($super, editable) {
    $super();
    
    // Add feature detected styles to head
    MTools.Application.createStyle('body, .push-scroll {'+
      'padding-right: '+ jQuery.support.scrollbarWidth +'px;'+
      'padding-bottom: '+ jQuery.support.scrollbarWidth +'px;'+
    '}');
    
    // Set up default panel behaviour (show screen, show footer etc.)
    jQuery(".panel").panel();
        
    MTools.ServerManager.xmppClientId = new MTools.UUID().id;
    
    WebDoc.application.pageEditor = this;
    WebDoc.application.undoManager = new MTools.UndoManager();
        
    WebDoc.application.widgetManager = new WebDoc.WidgetManager();
    WebDoc.application.pasteBoardManager = new WebDoc.PasteboardManager();    
    // create all controllers
    WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();
    WebDoc.application.boardController = new WebDoc.BoardController(editable, !editable);
    WebDoc.application.rightBarController = new WebDoc.RightBarController();
    //WebDoc.application.inspectorController = new WebDoc.InspectorController();
    WebDoc.application.pageBrowserController = new WebDoc.PageBrowserController();
    WebDoc.application.toolbarController = new WebDoc.ToolbarController();
    WebDoc.application.categoriesController = new WebDoc.DocumentCategoriesController();
    
    // create all tools
    WebDoc.application.drawingTool = new WebDoc.DrawingTool( "a[href='#draw']", "draw-tool" );
    WebDoc.application.arrowTool = new WebDoc.ArrowTool( "a[href='#select']", "select-tool" );
    WebDoc.application.handTool = new WebDoc.HandTool( "a[href='#move']", "move-tool" );
    WebDoc.application.textTool = new WebDoc.TextTool( "a[href='#insert-text']", "insert-text-tool" );
    WebDoc.application.htmlSnipplet = new WebDoc.HtmlTool( "a[href='#insert-html']", "insert-html-tool" );
    
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
    WebDoc.application.collaborationManager = new WebDoc.CollaborationManager();
    
    $(window).unload(function() {
        WebDoc.application.collaborationManager.disconnect();
    });
    
    $(window).bind("hashchange", this._urlHashChanged.pBind(this));
  },

  load: function(documentId) {
    ddd("[PageEditor] load " + documentId);
    WebDoc.application.collaborationManager.listenXMPPNode(documentId);              
    MTools.ServerManager.getRecords(WebDoc.Document, documentId, function(data)
    {
      this.currentDocument = data[0];
      this.currentDocument.addListener(this);
      this.loadPageId(window.location.hash.replace("#", ""));
      WebDoc.application.pageBrowserController.setDocument(this.currentDocument); 
      this._loadCreator();     
      ddd("check editablity");
      if (WebDoc.application.boardController.isEditable()) {
        ddd("[PageEditor] call rightBarController.showLib");
        WebDoc.application.rightBarController.showLib();
//        WebDoc.application.rightBarController.showItemInspector();
      }
    }.pBind(this));
  },
  
  _loadCreator: function() {
     $.ajax({
       url: "/users/" + this.currentDocument.creatorId(),
       type: 'GET',
       dataType: 'json',              
       success: function(data, textStatus) {
         this.creator = data.user;
       }.pBind(this),
       error: function(XMLHttpRequest, textStatus, errorThrown) {
         ddd("error", textStatus);          
       }
     });
   },

  loadPageId: function(pageId) {
    ddd('[PageEditor] loadPageId');
    if (!pageId) {
      pageId = "1";
    }
    
    ddd("load page id " + pageId);
    
    var pageToLoad = this.currentDocument.findPageWithUuidOrPosition(pageId);
    ddd("found page");
    ddd(pageToLoad);
    // if (pageToLoad && pageToLoad.uuid() !== pageId) {
    if(pageToLoad) {
      this.loadPage(pageToLoad);
    }
  },
  
  loadPage: function(page, forceReload) {
    if(this.currentPage == null || this.currentPage.uuid() !== page.uuid() || forceReload) {
      WebDoc.application.undoManager.clear();
      ddd("set hash to current page position");
      window.location.hash = "#" + (page.uuid());
      this.currentPage = page;
      WebDoc.application.boardController.setCurrentPage(this.currentPage);      
    }
  },
  
  prevPage: function() {
    var previousPage = this.currentDocument.previousPage(this.currentPage);
    if (previousPage) {
      this.loadPage(previousPage);
    }
  },
  
  nextPage: function() {
    var nextPage = this.currentDocument.nextPage(this.currentPage);
    if (nextPage) {
      this.loadPage(nextPage);
    }
  },
  
  addPage: function() {
    var newPage = new WebDoc.Page(null, this.currentDocument);
    // we don't need to set foreign keys. It is automagically done on the server side
    // newPage.data.document_id = this.currentDocument.data.document_id;
    newPage.data.position = this.currentPage.data.position + 1;
    newPage.save( function(newObject, status) {
      ddd("new page ", newPage, newObject);
      this.currentDocument.addPage(newPage, true);      
      this.loadPage(newPage);
      
      WebDoc.application.pageBrowserController.editPageTitle(newPage);
      
    }.pBind(this));
  },
  
  addWebPage: function() {
    var externalPageUrl = null;
    do {
      externalPageUrl = prompt("Web page URL: ", "http://");
    }while(externalPageUrl != null && !WebDoc.FieldValidator.isValidUrl(externalPageUrl))

    if(externalPageUrl != null) {
      var newPage = new WebDoc.Page(null, this.currentDocument);
      newPage.data.position = this.currentPage.data.position + 1;
      newPage.save( function(newObject, status) {
        newPage.setExternalPageMode(true);
        newPage.data.data.externalPageUrl = externalPageUrl;
        newPage.save();
        this.currentDocument.addPage(newPage, true);      
        this.loadPage(newPage);
  
      }.pBind(this));
    }
  },
  
  removePage: function() {
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
  
  closeDocument: function(e) {
    window.location = "/";
  },
  
  toggleDebugMode: function() {
    this.disableHtml = !this.disableHtml; 
    this.loadPageId( this.currentPage.uuid());
    $("#debug-button").text(this.disableHtml?"Enable HTML":"Disable HTML");
    if (this.disableHtml) {
        $("#tb_1_utilities_settings_trigger").addClass("tb_1_utilities_settings_attention");
    }
    else {
        $("#tb_1_utilities_settings_trigger").removeClass("tb_1_utilities_settings_attention");
    }
  },
  
  pageRemoved: function(page) {
    if (page == this.currentPage) {
      var newPagePosition = 0;
      if (page.data.position > 0) {
        newPagePosition = page.data.position - 1;
      }      
      this.loadPage(this.currentDocument.pages[newPagePosition]);
    }
  },

  // Monitorizes hash modifications and update loaded page accordingly
  // Enables links within documents
  _urlHashChanged: function(e) {
    this.loadPageId(location.hash.substring(1));
  }
});

