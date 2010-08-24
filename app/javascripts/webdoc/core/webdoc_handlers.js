// Global event handlers

WebDoc.handlers = {

  initialise: function(){
    
    jQuery(document).delegate('a', 'click', this._makeLinkHandler( this._documentHandlers ) );
    jQuery('.panel').delegate('a', 'click', this._makeLinkHandler( this._panelHandlers ) );
    
    this.addCenterCellHandlers();
    
    // Global form validation
    jQuery(document)
    .delegate( 'input, textarea', 'keyup', function(e) {
      jQuery(this).validate({
        pass: function(){},
        fail: function(){
          e.preventDefault();
        }
      });
    })
    .delegate( 'a[href=#add_discussion]', 'dragstart', this._prepareCreateDiscussionDragStart.pBind(this));
  },
  
  regex: jQuery.regex,
  
  _makeLinkHandler: function( obj, context ){
    var regex = this.regex;
    
    // Curry link handler using this scope
    return function(e){
      var link = jQuery(this),
          href = link.attr('href'),
          match = regex.hashRef.exec(href);
      
      // If the href contains a hashRef that matches an obj key
      if ( match && obj[match[1]] ) {
        ddd( '[Handler] call handler "' + match + '"' );
        
        // Don't let the browser have it
        e.preventDefault();
        
        // Call it with link as scope
        obj[match[1]].call( context||this, e );
      }
    };
  },
  
  addPanelHandlers: function( eventType, obj ){
  	if ( /click/.exec( eventType ) ) {
    	jQuery.extend( this._panelHandlers, obj );
  	}
  },
  
  addDocumentHandlers: function( eventType, obj ){
    if ( /click/.exec( eventType ) ) {
    	jQuery.extend( this._documentHandlers, obj );
  	}
  },

  addCenterCellHandlers: function(){
    $('.center-cell')
    .bind('click', function(e){
      if ($(e.target).hasClass('center-cell')) {
        WebDoc.application.boardController.unselectAll();
      }
    })
    .bind('dragenter', function(e){
      e.preventDefault();
    })
    .bind('dragover', function(e){
      e.preventDefault();
    })
    .bind('drop', function(e){
      e.preventDefault();
    });
  },
  
  // Editor actions (to be bound to the interface panels)
  _panelHandlers: {
    'view':                        function(e) { WebDoc.application.pageEditor.toggleFullScreen(); },
    
    //new ui panel handler, actually the old right bar controller is used
    'toggle_activity_panel':       function(e){ ddd('no activity yet'); },
    'toggle_comments_panel':       function(e){ WebDoc.application.panelsController.showDiscussionsPanel(e); },
    'toggle_inspector_panel':      function(e){ WebDoc.application.panelsController.showItemInspector(e); },
    'toggle_page_inspector_panel': function(e){ WebDoc.application.panelsController.showPageInspector(e); },
    'toggle_author_panel':         function(e){ ddd('author panel is useless') },
    'toggle_document_panel':       function(e){WebDoc.application.panelsController.showDocumentInspector(e); },
    'toggle_sharing_panel':        function(e){ ddd('no sharing yet') },
    'toggle_content_panel':        function(e) { WebDoc.application.panelsController.showBrowseWeb(); },
    'toggle_packages_panel':       function(e) { WebDoc.application.panelsController.showPackages(); },
    'toggle_apps_panel':           function(e) { WebDoc.application.panelsController.showApps(); },
    'toggle_my_stuff_panel':       function(e) { WebDoc.application.panelsController.showMyContent(); },
    'toggle_pages_panel':          function(e) { WebDoc.application.panelsController.showPagesPanel(); },
    
    
    'add_page':             function(e) { WebDoc.application.pageEditor.addPage(); },
    'copy_page':            function(e) { WebDoc.application.pageEditor.copyPage(); },
    'remove_page':          function(e) { WebDoc.application.pageEditor.removePage(); },
    
    'zoom-in':              function(e) { WebDoc.application.boardController.zoomIn(); },
    'zoom-out':             function(e) { WebDoc.application.boardController.zoomOut(); },
    'move':                 function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.handTool ); },
    'select':               function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.arrowTool ); },
    'draw_tool':            function(e) { WebDoc.application.boardController.toggleDrawTool(); },
    'html_tool':            function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.htmlSnipplet ); },
    'text_tool':            function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.textTool ); },
    'textbox_tool':         function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.textboxTool ); },
    'webpage_tool':         function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.iframeTool ); },
    'insert-app':           function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.appTool ); },
    
    'to-back':              function(e) { WebDoc.application.boardController.moveSelectionToBack(); },
    'to-front':             function(e) { WebDoc.application.boardController.moveSelectionToFront(); },
    
    'undo':                 function(e) { WebDoc.application.undoManager.undo(); },
    'redo':                 function(e) { WebDoc.application.undoManager.redo(); },
    'delete':               function(e) { WebDoc.application.boardController.deleteSelection(); },
    
    'browser':              function(e)	{ WebDoc.application.browserController.openBrowser(e); }, 
    'disable-html':         function(e) { WebDoc.application.pageEditor.toggleDebugMode(); },
    
    'mode-toggle':          function(e) { WebDoc.application.boardController.toggleMode(); },
    'edit':                 function(e) { WebDoc.application.boardController.toggleMode(); },
    
    'library-images-myimages': function(e) { 
      WebDoc.application.panelsController.showMyContent();
    },
    
    //'themes-chooser':       function(e) { WebDoc.application.themesController.openChooser(e); },
    'webdoc-duplicate':     function(e) { WebDoc.application.pageEditor.duplicateDocument(e); }
  },
  
  // Publicly accessible actions (to be bound to document)
  _documentHandlers: {
    'webdoc_prev_page':     function(e) { WebDoc.application.pageEditor.prevPage(); },
    'webdoc_next_page':     function(e) { WebDoc.application.pageEditor.nextPage(); },
    'webdoc_close':         function(e) { WebDoc.application.pageEditor.closeDocument(); }
  },

  _prepareCreateDiscussionDragStart: function(event) {
    event.originalEvent.dataTransfer.setData("application/wd-discussion", $.toJSON({ action: 'create' }));
  }
};
