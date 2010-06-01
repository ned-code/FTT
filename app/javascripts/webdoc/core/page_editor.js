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
  
  initialize: function($super) {
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
    
    WebDoc.ServerManager.xmppClientId    = new WebDoc.UUID().id;
    
    WebDoc.application.pageEditor = this;
    
    $(window).unload(function() {
        WebDoc.application.collaborationManager.disconnect();
    });
    
    $(window).bind("hashchange", this._urlHashChanged.pBind(this));
  },
  
  load: function(documentId, editable) {
    ddd("[PageEditor] load " + documentId);
    WebDoc.Application.initializeSingletons([WebDoc.ThemeManager, WebDoc.WidgetManager, WebDoc.DocumentCategoriesManager], function() {
      WebDoc.application.undoManager = new WebDoc.UndoManager();
          
      WebDoc.application.pasteBoardManager = new WebDoc.PasteboardManager();    
      
      // create all controllers
      WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();
      WebDoc.application.boardController = new WebDoc.BoardController(editable, !editable);
      WebDoc.application.rightBarController = new WebDoc.RightBarController();
      //WebDoc.application.inspectorController = new WebDoc.InspectorController();
      WebDoc.application.pageBrowserController = new WebDoc.PageBrowserController();
      WebDoc.application.toolbarController = new WebDoc.ToolbarController();
      
      WebDoc.application.documentDuplicateController = new WebDoc.DocumentDuplicateController();
      WebDoc.application.themesController = new WebDoc.ThemesController();
      
      // create all tools
      WebDoc.application.drawingTool = new WebDoc.DrawingTool( "a[href='#draw']", "draw-tool" );
      WebDoc.application.arrowTool = new WebDoc.ArrowTool( "a[href='#select']", "select-tool" );
      WebDoc.application.handTool = new WebDoc.HandTool( "a[href='#move']", "move-tool" );
      WebDoc.application.textTool = new WebDoc.TextTool( "a[href='#insert-text']", "insert-text-tool" );
      WebDoc.application.htmlSnipplet = new WebDoc.HtmlTool( "a[href='#insert-html']", "insert-html-tool" );
      WebDoc.application.iframeTool = new WebDoc.IframeTool( "a[href='#insert-iframe']", "insert-iframe-tool" );
      WebDoc.application.appTool      = new WebDoc.AppTool( "a[href='#insert-app']", "insert-app" );
  
      WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
      WebDoc.application.collaborationManager = new WebDoc.CollaborationManager();
      WebDoc.application.postMessageManager = new WebDoc.PostMessageManager();      
      WebDoc.application.collaborationManager.listenXMPPNode(documentId);              
      WebDoc.ServerManager.getRecords(WebDoc.Document, documentId, function(data)
      {
        this.currentDocument = data[0];
        this.currentDocument.addListener(this);
        WebDoc.application.boardController.applyDocumentTheme();
        WebDoc.ServerManager.getRecords(WebDoc.User, this.currentDocument.creator_id, function(data, status) {
          this._creator = data[0];
          this.loadPageId(window.location.hash.replace("#", ""));
          WebDoc.application.pageBrowserController.setDocument(this.currentDocument); 
          ddd("check editablity");
          if (WebDoc.application.boardController.isEditable() && jQuery("body").hasClass('mode-edit')) {
            ddd("[PageEditor] call rightBarController.showLib");
            WebDoc.application.rightBarController.showLib();
          }
          
          WebDoc.application.boardController.loadingNode.removeClass('loading');
          
          //jQuery('#document_loading').remove();
          jQuery('body').trigger('webdocready');          
        }.pBind(this));                
      }.pBind(this));
    }.pBind(this));
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

  getCreator: function() {
    return this._creator;
  },
  
  loadPageId: function(pageId, force) {
    if (!pageId || (!WebDoc.UUID.isUUID(pageId) && !pageId.match(/^\d+$/))) {
      pageId = "1";
    }
    
    ddd("[PageEditor] load page id " + pageId);
    
    var pageToLoad = this.currentDocument.findPageWithUuidOrPosition(pageId);
    ddd("[PageEditor] found page", pageToLoad);
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
    ddd('[AddWebPage] addWebPage');
    
    var self = this,
        node,
        popOptions,
        popForm = $('<form/>', { method: 'post', 'class': 'ui-pop-page-url' }),
        popLabel = $('<label/>', { 'class': 'underlay' }).text('enter an url'),
        popTitle = $('<input/>', { type: 'url', title: 'Page Url', name: 'page-url', value: 'http://', autocomplete: 'off', 'data-type': 'webdoc_iframe_url' }),
        popActions = $('<div/>', { 'class': "ui-actions" }),
        popSubmit = $('<input/>', { type: 'submit', name: 'page-url-form', value: 'Save' }),
        popCancel = $('<a/>', { href: '#cancel', 'class': 'cancel', html: 'cancel' });
        
    popForm
    .append( popLabel )
    .append( popTitle )
    .append(
      popActions
      .append( popCancel )
      .append( popSubmit )
    );
    
    if ( typeof str === 'undefined' ) {
      popOptions = {
        // Some of these should really be put in a global setup
        popWrapClass: 'ui ui-pop-position',
        popClass: 'ui-pop ui-widget ui-corner-all',
        width: '12em',
        openEasing: 'easeOutBack',
        shutEasing: 'easeInQuart'
      };
      
      // Decide where to trigger the pop
      node = jQuery(".pages-tools a[href='#add-web-page']");
      popOptions.orientation = 'bottom';
      
      popForm.pop(
        jQuery.extend( popOptions, {
          attachTo: node,
          initCallback: function(){
            var currentUrl = "http://"
            popTitle.val( currentUrl );
            popTitle.bind('keyup', function(){
                
              if ( popTitle.val().length === 0 ) {
                popTitle.addClass( 'default' );
              }
              else {
                popTitle.removeClass( 'default' );
              }
            });
            
            // Bind stuff to do on submit
            popForm.bind('submit', function(e){
              popForm.validate({
                pass : function(){
                  consolidateSrc = WebDoc.UrlUtils.consolidateSrc(popTitle.val())

                  var newPage = new WebDoc.Page(null, this.currentDocument, consolidateSrc);
                  newPage.data.position = this.currentPage.data.position + 1;
                  newPage.save( function(newObject, status) {
                    this.currentDocument.addPage(newPage, true);      
                    this.loadPage(newPage);
                  }.pBind(this));
                  popForm.trigger('close');               
                }.pBind(this),
                fail : function(){}
              });
              return false;
            }.pBind(this));
            
            // Give the input focus
            popTitle.focus();
          }.pBind(this)
        })
      );
    }
    else {
      // _changeTitle for string
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

