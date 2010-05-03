/**
 * PageEditor is the main application for page viewing and editing. The root method is load(documentId) that will load the first page of document documentId.
 * 
 * @author Julien Bachmann
**/

// application singleton.
WebDoc.application = {};

WebDoc.PageEditor = $.klass(WebDoc.Application,{

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
    
    // Feature detection
    
    // Add feature detected styles to head
    WebDoc.Application.createStyle('body, .push-scroll {'+
      'padding-right: '+ jQuery.support.scrollbarWidth +'px;'+
      'padding-bottom: '+ jQuery.support.scrollbarWidth +'px;'+
    '}');
    
    // Change input range sliders to text fields when sliders have no native UI. We can't
    // style range inputs as text inputs, so we change them to text inputs. Really, we
    // should re-implement sliders by replacing the input, but right now I can't be arsed.
    // Apparently changing input types throws errors in <IE7...
    if ( !jQuery.support.inputTypes || !jQuery.support.inputTypes.range ) {
      jQuery("input[type='range']")
      .each(function(i){
        var input = this;
        input.type = "text";
        
        ddd('[PageEditor] input[type=range] changed to input[type=text] '+(i+1));
      });
      jQuery(".input-range-readout").remove();
    }
    
    // Create and bind global event handlers
    WebDoc.handlers.initialise();
    
    WebDoc.ServerManager.xmppClientId = new WebDoc.UUID().id;
    
    WebDoc.application.pageEditor = this;
    WebDoc.application.undoManager = new WebDoc.UndoManager();
        
    WebDoc.application.widgetManager = new WebDoc.WidgetManager();
    WebDoc.application.pasteBoardManager = new WebDoc.PasteboardManager();    
    
    // create all controllers
    WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();
    WebDoc.application.boardController = new WebDoc.BoardController(editable, !editable);
    WebDoc.application.rightBarController = new WebDoc.RightBarController();
    //WebDoc.application.inspectorController = new WebDoc.InspectorController();
    WebDoc.application.pageBrowserController = new WebDoc.PageBrowserController();
    WebDoc.application.toolbarController = new WebDoc.ToolbarController();
    WebDoc.application.categoriesManager = new WebDoc.DocumentCategoriesManager();
    
    WebDoc.application.documentDuplicateController = new WebDoc.DocumentDuplicateController();
    WebDoc.application.themesController = new WebDoc.ThemesController();
    
    // create all tools
    WebDoc.application.drawingTool = new WebDoc.DrawingTool( "a[href='#draw']", "draw-tool" );
    WebDoc.application.arrowTool = new WebDoc.ArrowTool( "a[href='#select']", "select-tool" );
    WebDoc.application.handTool = new WebDoc.HandTool( "a[href='#move']", "move-tool" );
    WebDoc.application.textTool = new WebDoc.TextTool( "a[href='#insert-text']", "insert-text-tool" );
    WebDoc.application.htmlSnipplet = new WebDoc.HtmlTool( "a[href='#insert-html']", "insert-html-tool" );
    WebDoc.application.iframeTool = new WebDoc.IframeTool( "a[href='#insert-iframe']", "insert-iframe-tool" );
    WebDoc.application.osGadgetTool = new WebDoc.OsGadgetTool( "a[href='#insert-os-gadget']", "insert-os-gadget" );

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
    WebDoc.ServerManager.getRecords(WebDoc.Document, documentId, function(data)
    {
      this.currentDocument = data[0];
      this._loadCreator();     
      this.currentDocument.addListener(this);
      WebDoc.application.boardController.applyDocumentTheme();
      this.loadPageId(window.location.hash.replace("#", ""));
      WebDoc.application.pageBrowserController.setDocument(this.currentDocument); 
      ddd("check editablity");
      if (WebDoc.application.boardController.isEditable() && jQuery("body").hasClass('mode-edit')) {
        ddd("[PageEditor] call rightBarController.showLib");
        WebDoc.application.rightBarController.showLib();
      }
      jQuery('#document_loading').remove();
    }.pBind(this));
  },
  
  _loadCreator: function() {
     $.ajax({
       url: "/users/" + this.currentDocument.creatorId(),
       type: 'GET',
       dataType: 'json',              
       success: function(data, textStatus) {
         ddd("will notify creator listener", this._creatorListeners);
         this.creator = data.user;
         var listenersCount = this._creatorListeners.length;
         for (var i = 0; i < listenersCount; i++) {
            ddd("noify with callback", this._creatorListeners[i]);
            this._creatorListeners[i].call(this, this.creator);
            ddd("notify done");
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
      ddd("register creator listener");
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
    var differentPages = (this.currentPage == null || this.currentPage.uuid() !== page.uuid());
    if(differentPages || forceReload) {
      if (differentPages) {
        WebDoc.application.undoManager.clear();
      }
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
    } while (externalPageUrl != null && !WebDoc.FieldValidator.isValidUrl(externalPageUrl));

    if(externalPageUrl != null) {
      var newPage = new WebDoc.Page(null, this.currentDocument, externalPageUrl);
      newPage.data.position = this.currentPage.data.position + 1;
      newPage.save( function(newObject, status) {
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
    if (WebDoc.closeUrl && WebDoc.closeUrl !== "javascript:history.back()") {
      window.location = WebDoc.closeUrl;
    }
    else {
      window.location = "/";
    }
  },

  duplicateDocument: function(e) {
    ddd("duplicate document");
    WebDoc.application.documentDuplicateController.showDialog(e, this.currentDocument);
  },
  
  toggleDebugMode: function() {
    WebDoc.application.disableHtml = !WebDoc.application.disableHtml; 
    this.loadPageId( this.currentPage.uuid(), true);
    $("#debug-button").text(WebDoc.application.disableHtml?"Enable HTML":"Disable HTML");
    if (WebDoc.application.disableHtml) {
        $("#debug-button").addClass("active");
    }
    else {
        $("#debug-button").removeClass("active");
    }
  },
  
  objectChanged: function(record, options) {
    if (record._isAttributeModified(options, 'theme')) {
      WebDoc.application.boardController.applyDocumentTheme();
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

