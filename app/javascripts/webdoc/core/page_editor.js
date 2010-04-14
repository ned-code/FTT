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
    // change domain to be able to synch with apps
    var allDomainsParts = document.domain.split(".");
    if (allDomainsParts.length > 2) {
      document.domain = allDomainsParts[allDomainsParts.length - 2] + "." + allDomainsParts[allDomainsParts.length - 1];
    } 
    this._creatorListeners = [];
    // Add feature detected styles to head
    MTools.Application.createStyle('body, .push-scroll {'+
      'padding-right: '+ jQuery.support.scrollbarWidth +'px;'+
      'padding-bottom: '+ jQuery.support.scrollbarWidth +'px;'+
    '}');
    
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
    
    // Create and bind global event handlers
    WebDoc.handlers.initialise();
    
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
      this._loadCreator();     
      this.currentDocument.addListener(this);
      this.loadPageId(window.location.hash.replace("#", ""));
      WebDoc.application.pageBrowserController.setDocument(this.currentDocument); 
      ddd("check editablity");
      if (WebDoc.application.boardController.isEditable()) {
        ddd("[PageEditor] call rightBarController.showLib");
        WebDoc.application.rightBarController.showLib();
      }
      jQuery('#document_loading').remove();
      
      // Highlight code blocks in the webdoc
      // There's probably a better place for this
      jQuery('.code').each( function(i){
        var node = jQuery(this),
            clone = node.clone().empty(),
            numbers = jQuery('<div/>');
        
        // Line numbers
        var lineNo = 1, output = clone[0];
      
        function addLine(line) {
          numbers.append(document.createTextNode(String(lineNo++)));
          numbers.append(document.createElement("BR"));
          for (var i = 0; i < line.length; i++) output.appendChild(line[i]);
          output.appendChild(document.createElement("BR"));
        }
        
        highlightText( node.html(), output ); //addLine);
        node.replaceWith( numbers.add(clone) );
      });
    
    
    
    }.pBind(this));
  },
  
  _loadCreator: function() {
     $.ajax({
       url: "/users/" + this.currentDocument.creatorId(),
       type: 'GET',
       dataType: 'json',              
       success: function(data, textStatus) {
         this.creator = data.user;
         var listenersCount = this._creatorListeners.length;
         for (var i = 0; i < listenersCount; i++) {
            this._creatorListeners[i].call(this, this.creator);
         }
       }.pBind(this),
       error: function(XMLHttpRequest, textStatus, errorThrown) {
         ddd("error", textStatus);          
       }
     });
   },

  _createLinkHandler: function( obj ){
    // Keep obj in scope of new handler
    return function(e){
      var link = jQuery(this),
          href = link.attr('href'),
          match = regex.hashRef.exec(href);
      
      ddd( '[page_editor.linkHandler] Event handler ref: "' + match + '"' );
      
      // If the href contains a hashRef that matches a handler
      if ( match && obj[match[1]] ) {
          // Call it with current scope
          try {
            obj[match[1]].call(this, e);
          }
          finally {
            e.preventDefault();
          }
      }
    };
  },

  getCreator: function(callBack) {
    if (this.creator) {
      callBack.call(this, this.creator);
    }
    else {
      this._creatorListeners.push(callBack);
    }
  },
  
  loadPageId: function(pageId, force) {
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
      this.loadPage(pageToLoad, force);
    }
  },
  
  loadPage: function(page, forceReload) {
    if(this.currentPage == null || this.currentPage.uuid() !== page.uuid() || forceReload) {
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
    WebDoc.application.collaborationManager.disconnect();
    window.location = "/";
  },
  
  toggleDebugMode: function() {
    this.disableHtml = !this.disableHtml; 
    this.loadPageId( this.currentPage.uuid(), true);
    $("#debug-button").text(this.disableHtml?"Enable HTML":"Disable HTML");
    if (this.disableHtml) {
        $("#debug-button").addClass("active");
    }
    else {
        $("#debug-button").removeClass("active");
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

