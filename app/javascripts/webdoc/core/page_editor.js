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
    WebDoc.Application.createStyle('.push-scroll {'+
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
    WebDoc.InspectorPanesManager.featureEnabled = true;
    $(window).unload(function() {
        WebDoc.application.collaborationManager.disconnect();
    });
    
    $(window).bind("hashchange", this._urlHashChanged.pBind(this));
  },
  
  load: function(documentId, editable) {
    ddd("[PageEditor] load " + documentId);
    WebDoc.Application.initializeSingletons([WebDoc.ThemeManager, WebDoc.WidgetManager, WebDoc.DocumentCategoriesManager], function() {
      var app = WebDoc.application;
      
      app.undoManager = new WebDoc.UndoManager();
          
      app.pasteBoardManager = new WebDoc.PasteboardManager();    
      
      // create all controllers
      app.svgRenderer = new WebDoc.SvgRenderer();
      app.boardController = new WebDoc.BoardController(editable, !editable);
      app.panelsController = new WebDoc.PanelsController();
      app.toolbarController = new WebDoc.ToolbarController();
      app.browserController = new WebDoc.BrowserController();
      app.notificationController = new WebDoc.NotificationController();
      
      app.documentDuplicateController = new WebDoc.DocumentDuplicateController();
      app.themesController = new WebDoc.ThemesController();
      
      // create all tools
      app.drawingTool = new WebDoc.DrawingTool( "a[href='#draw_tool']", "draw_tool_mode" );
      app.textTool = new WebDoc.TextTool( "a[href='#text_tool']", "text_tool_mode" );
      app.textboxTool = new WebDoc.TextboxTool( "a[href='#textbox_tool']", "textbox_tool_mode" );
      app.htmlSnipplet = new WebDoc.HtmlTool( "a[href='#html_tool']", "html_tool_mode" );
      app.iframeTool = new WebDoc.IframeTool( "a[href='#webpage_tool']", "iframe_tool_mode" );
      app.appTool = new WebDoc.AppTool( "a[href='#insert-app']", "app_tool_mode" );
      app.browserTool = new WebDoc.BrowserTool("a[href='#browser']");

      app.boardController.setCurrentTool(WebDoc.application.arrowTool);
      app.collaborationManager = new WebDoc.CollaborationManager();
      app.postMessageManager = new WebDoc.PostMessageManager();
      app.collaborationManager.listenXMPPNode(documentId);
      
      WebDoc.ServerManager.getRecords(WebDoc.Document, documentId, function(data) {
        this.currentDocument = data[0];
        this.currentDocument.addListener(this);
        app.boardController.applyDocumentTheme();
        WebDoc.ServerManager.getRecords(WebDoc.User, this.currentDocument.data.creator_id, function(data, status) {
          this._creator = data[0];
          this.loadPageId(this._extractUUIDFromHash(window.location.hash));
          app.pageBrowserController.setDocument(this.currentDocument);
          
          ddd("check editablity");
          
          if ( app.boardController.isEditable() && !app.boardController.isInteractionMode() ) {
            ddd("[PageEditor] call panelsController.showMyContent");
            app.panelsController.showMyContent();
          }

          // add role name of the current user as class in editor dom node
          jQuery.each(WebDoc.application.pageEditor.getCurrentUserRolesForCurrentDocument(), function(i, roleName) {
            app.boardController.editorNode.addClass(roleName+'_role');
          });
          
          app.boardController.loadingNode.removeTransitionClass('loading');
          
          jQuery('body').trigger('webdocready');   
          if (window._gaq) {
            _gaq.push(['_trackEvent', 'document', 'open', documentId]);
          }       
        }.pBind(this));                
      }.pBind(this));

      WebDoc.closeUrl = jQuery.cookie('document_back_url') ? jQuery.cookie('document_back_url') : null;
      jQuery.cookie('document_back_url', null, { path: '/' });
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
      window.location.hash = "#!" + (page.uuid());
      this.currentPage = page;
      WebDoc.application.boardController.setCurrentPage(this.currentPage);      
    }
  },
  
  prevPage: function() {
    if (window._gaq) {
     _gaq.push(['_trackEvent', 'document_browse', 'previous_page', this.currentDocument.uuid()]);
    }    
    var previousPage = this.currentDocument.previousPage(this.currentPage);
    if (previousPage) {
      this.loadPage(previousPage);
    }
  },
  
  nextPage: function() {
    if (window._gaq) {
     _gaq.push(['_trackEvent', 'document_browse', 'next_page', this.currentDocument.uuid()]);
    }
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
    this.currentDocument.addPage(newPage, true);
    this.loadPage(newPage);
    newPage.save( function(newObject, status) {      
    }.pBind(this));
  },
  
  // addWebPage: function() {
  //     var externalPageUrl = null;
  //     ddd('[AddWebPage] addWebPage');
  //     
  //     var self = this,
  //         node,
  //         popOptions,
  //         popForm = $('<form/>', { method: 'post', 'class': 'ui-pop-page-url' }),
  //         popLabel = $('<label/>', { 'class': 'underlay' }).text('enter an url'),
  //         popTitle = $('<input/>', { type: 'url', title: 'Page Url', name: 'page-url', value: 'http://', autocomplete: 'off', 'data-type': 'webdoc_iframe_url' }),
  //         popActions = $('<div/>', { 'class': "ui-actions" }),
  //         popSubmit = $('<input/>', { type: 'submit', name: 'page-url-form', value: 'Save' }),
  //         popCancel = $('<a/>', { href: '#cancel', 'class': 'cancel', html: 'cancel' });
  //         
  //     popForm
  //     .append( popLabel )
  //     .append( popTitle )
  //     .append(
  //       popActions
  //       .append( popCancel )
  //       .append( popSubmit )
  //     );
  //     
  //     if ( typeof str === 'undefined' ) {
  //       popOptions = {
  //         // Some of these should really be put in a global setup
  //         popWrapClass: 'ui ui-pop-position',
  //         popClass: 'ui-pop ui-widget ui-corner-all',
  //         width: '12em',
  //         openEasing: 'easeOutBack',
  //         shutEasing: 'easeInQuart'
  //       };
  //       
  //       // Decide where to trigger the pop
  //       node = jQuery(".pages-tools a[href='#add-web-page']");
  //       popOptions.orientation = 'bottom';
  //       
  //       popForm.pop(
  //         jQuery.extend( popOptions, {
  //           attachTo: node,
  //           initCallback: function(){
  //             var currentUrl = "http://"
  //             popTitle.val( currentUrl );
  //             popTitle.bind('keyup', function(){
  //                 
  //               if ( popTitle.val().length === 0 ) {
  //                 popTitle.addClass( 'default' );
  //               }
  //               else {
  //                 popTitle.removeClass( 'default' );
  //               }
  //             });
  //             
  //             // Bind stuff to do on submit
  //             popForm.bind('submit', function(e){
  //               popForm.validate({
  //                 pass : function(){
  //                   consolidateSrc = WebDoc.UrlUtils.consolidateSrc(popTitle.val())
  // 
  //                   var newPage = new WebDoc.Page(null, this.currentDocument, consolidateSrc);
  //                   newPage.data.position = this.currentPage.data.position + 1;
  //                   newPage.save( function(newObject, status) {
  //                     this.currentDocument.addPage(newPage, true);      
  //                     this.loadPage(newPage);
  //                   }.pBind(this));
  //                   popForm.trigger('close');               
  //                 }.pBind(this),
  //                 fail : function(){}
  //               });
  //               return false;
  //             }.pBind(this));
  //             
  //             // Give the input focus
  //             popTitle.focus();
  //           }.pBind(this)
  //         })
  //       );
  //     }
  //     else {
  //       // _changeTitle for string
  //     }
  //   },
  
  removePage: function() {
    var pageToDelete = this.currentPage;
    if (this.currentDocument.pages.length > 1) {
      var choice = confirm("Are you sure you want to delete the current page?");
      if (choice) {
        this.currentDocument.removePage(pageToDelete, true);
        pageToDelete.destroy();
      }
    }
  },
  
  copyPage: function(e) {
    var copiedPage = this.currentPage.copy();
    copiedPage.setDocument(this.currentPage.getDocument());
    var copiedPagePosition = this.currentDocument.positionOfPage(this.currentPage) - 1;
    copiedPage.data.position = copiedPagePosition + 1;
    WebDoc.application.boardController.currentPageView().setLoading(true);
    copiedPage.save(function(newObject, status) {
      this.currentDocument.addPage(copiedPage, true);
      WebDoc.application.boardController.currentPageView().setLoading(false);
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
  
  _fullView: false,
  
  toggleFullScreen: function() {
    
    var body = jQuery('body');
    
    if ( this._fullView ) {
    	this._fullView = false;
      body.removeClass('full_view');
    } 
    else {
    	this._fullView = true;
      body.addClass('full_view');
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
    this.loadPageId(this._extractUUIDFromHash(location.hash));
  },
  
  _extractUUIDFromHash: function(hash){
    var uuid = hash.substring(1);
    if(uuid.charAt(0) == '!'){
      uuid = uuid.substring(1);
      ddd(uuid);
    }
    return uuid;
  },

  /**
   * Get all roles name in an array of the current user
   */
  getCurrentUserRolesForCurrentDocument: function() {
    if(this._currentUserRolesForCurrentDocument === undefined) {
      return this._currentUserRolesForCurrentDocument = this.currentDocument.getRolesForUserUuid(WebDoc.Application.getCurrentUser().uuid());
    }
    return this._currentUserRolesForCurrentDocument;    
  },

  /**
   * Check if the current user have the role specified in the param and return a boolean
   *
   * @param roleName String the name of the role, see WebDoc.UserRole to see all role names allowed
   */
  isCurrentUserHasRole: function (roleName) {
    if(jQuery.inArray(roleName, this.getCurrentUserRolesForCurrentDocument()) !== -1) {
      return true;
    }
    else {
      return false;
    }
  },

  /**
   * Check if the current user have a role in the the array and return a boolean
   *
   * @param rolesNameArray Array the array of role names
   */
  isCurrentUserHasOneOfRoles: function(rolesNameArray) {
    for(var i in rolesNameArray) {
      if(this.isCurrentUserHasRole(rolesNameArray[i])) {
        return true;
      }
    }
    return false;
  },

  /**
   * Check if the current user can comment and return a boolean
   */
  isCurrentUserCanComment: function() {
    if(this.isCurrentUserHasOneOfRoles([ WebDoc.UserRole.ROLE_NAME_EDITOR,
                                         WebDoc.UserRole.ROLE_NAME_CONTRIBUTOR,
                                         WebDoc.UserRole.ROLE_NAME_VIEWER_COMMENT,
                                         WebDoc.UserRole.ROLE_NAME_ADMIN ]) ) {
      return true;
    }
    else {
      return false;
    }
  },

  /**
   * Check if the current user can edit an item and return a boolean
   *
   * @param item the item to check if a contributor have access to edit this item
   */
  isCurrentUserCanEditItem: function(item) {
    if(this.isCurrentUserHasOneOfRoles([ WebDoc.UserRole.ROLE_NAME_EDITOR,
                                         WebDoc.UserRole.ROLE_NAME_ADMIN ]) ||
        (this.isCurrentUserHasRole(WebDoc.UserRole.ROLE_NAME_CONTRIBUTOR) &&
            item && item.data && item.data.creator_id && item.data.creator_id === WebDoc.Application.getCurrentUser().uuid() ) ) {
      return true;
    }
    else {
      return false;
    }
  }

});

