 /**
 * @author Stephen Band / Julien Bachmann
 */

WebDoc.handlers = {

  initialise: function(){
    this.panelNode = jQuery('.panel');
    
    this.addDocumentHandlers( 'click', this._documentHandlers );
    this.addPanelHandlers( 'click', this._panelHandlers );
		this.addMediaBrowserHandlers( 'click', this._mediaBrowserHandlers );
    this.addCenterCellHandlers();

    jQuery(".wd_discussion_add").bind("dragstart", this._prepareCreateDiscussionDragStart.pBind(this));
    
    // Global form validation
    jQuery(document)
    .delegate( 'input, textarea', 'keyup', function(e) {
      jQuery(this).validate({
        pass: function(){},
        fail: function(){
          e.preventDefault();
        }
      });
    });
  },
  
  regex: jQuery.regex,
  
  _makeLinkHandler: function( obj, context ){
		ddd('_makeLinkHandler');
    var regex = this.regex;
    
    // Curry linkHandler using this scope
    return function(e){
      var link = jQuery(this),
          href = link.attr('href'),
          match = regex.hashRef.exec(href);
      
      // If the href contains a hashRef that matches an obj key
      if ( match && obj[match[1]] ) {
        ddd( '[Handler] call handler "' + match + '"' );
        
        // Call it with link as scope
        obj[match[1]].call( context||this, e );
        e.preventDefault();
      }
      else {
        ddd( '[Handler] no handler for "' + match + '"' );
      }
    };
  },
  
  addPanelHandlers: function( eventType, obj, context ){
    this.panelNode
    .delegate('a', eventType, this._makeLinkHandler( obj, context ) );
  },

	addMediaBrowserHandlers: function( eventType, obj, context ){
    this.panelNode
    .delegate('a', eventType, this._makeLinkHandler( obj, context ) );
  },
  
  addDocumentHandlers: function( eventType, obj, context ){
    jQuery(document)
    .delegate('a', eventType, this._makeLinkHandler( obj, context ) );
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
    'left-panel-toggle':    function(e) { WebDoc.application.pageBrowserController.toggle(); },
    'right-panel-toggle':   function(e) { WebDoc.application.rightBarController.toggle(); },
    
    'pages-browser':        function(e) { WebDoc.application.pageBrowserController.toggle(); },
    'media-browser':        function(e) { WebDoc.application.rightBarController.showMediaBrowser(e);}, 
    'item-inspector':       function(e) { WebDoc.application.rightBarController.showItemInspector(e); },
    'page-inspector':       function(e) { WebDoc.application.rightBarController.showPageInspector(e); },
    'document-inspector':   function(e) { WebDoc.application.rightBarController.showDocumentInspector(e); },
    'social-inspector':     function(e) { WebDoc.application.rightBarController.showSocialPanel(e); },
    'discussions-panel':    function(e) { WebDoc.application.rightBarController.showDiscussionsPanel(e); },
    
    'add-page':             function(e) { WebDoc.application.pageEditor.addPage(); },
    'add-web-page':         function(e) { WebDoc.application.pageEditor.addWebPage();},
    'copy-page':            function(e) { WebDoc.application.pageEditor.copyPage(); },
    'remove-page':          function(e) { WebDoc.application.pageEditor.removePage(); },
    
    'zoom-in':              function(e) { WebDoc.application.boardController.zoomIn(); },
    'zoom-out':             function(e) { WebDoc.application.boardController.zoomOut(); },
    'move':                 function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.handTool ); },
    'select':               function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.arrowTool ); },
    'draw':                 function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.drawingTool ); },
    'insert-html':          function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.htmlSnipplet ); },
    'insert-text':          function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.textTool ); },
    'insert-iframe':        function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.iframeTool ); },
    'insert-app':           function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.appTool ); },
    
    'to-back':              function(e) { WebDoc.application.boardController.moveSelectionToBack(); },
    'to-front':             function(e) { WebDoc.application.boardController.moveSelectionToFront(); },
    
    'undo':                 function(e) { WebDoc.application.undoManager.undo(); },
    'redo':                 function(e) { WebDoc.application.undoManager.redo(); },
    'delete':               function(e) { WebDoc.application.boardController.deleteSelection(); },
    
    'browser':              function(e)	{ WebDoc.application.browserController.openBrowser(e); }, 
    'disable-html':         function(e) { WebDoc.application.pageEditor.toggleDebugMode(); },
    
    'show-thumbs':          function(e) { WebDoc.application.pageBrowserController.showThumbs(e); },
    'hide-thumbs':          function(e) { WebDoc.application.pageBrowserController.hideThumbs(e); },
    'toggle-thumbs':        function(e) { WebDoc.application.pageBrowserController.toggleThumbs(e); },
    
    'mode-toggle':          function(e) { WebDoc.application.boardController.toggleMode(); },
    'mode-edit':            function(e) { WebDoc.application.boardController.setMode(false); },
    'mode-preview':         function(e) { WebDoc.application.boardController.setMode(true); },
    
    'theme-class':          function(e) {  },

    
    'library-images-myimages': function(e) { 
      WebDoc.application.rightBarController.showMediaBrowser();
      WebDoc.application.mediaBrowserController.showMyContent();
    },
    
    //'themes-chooser':       function(e) { WebDoc.application.themesController.openChooser(e); },
    'webdoc-duplicate':     function(e) { WebDoc.application.pageEditor.duplicateDocument(e); }
  },
  
  // Publicly accessible actions (to be bound to document)
  _documentHandlers: {
    'webdoc-prev-page':     function(e) { WebDoc.application.pageEditor.prevPage(); },
    'webdoc-next-page':     function(e) { WebDoc.application.pageEditor.nextPage(); },
    'webdoc-close':         function(e) { WebDoc.application.pageEditor.closeDocument(); }
  },

  _mediaBrowserHandlers: {
    'media-browser-home': 	function(e) { WebDoc.application.mediaBrowserController.showHome();}, 
    'media-browser-web': 	function(e) { WebDoc.application.mediaBrowserController.showWeb();}, 
    'media-browser-packages': 	function(e) { WebDoc.application.mediaBrowserController.showPackages();}, 
    'media-browser-apps': 	function(e) { WebDoc.application.mediaBrowserController.showApps();}, 
    'media-browser-my-content': 	function(e) { WebDoc.application.mediaBrowserController.showMyContent();} 
  },

  _prepareCreateDiscussionDragStart: function(event) {
    event.originalEvent.dataTransfer.setData("application/wd-discussion", $.toJSON({ action: 'create' }));
  }
};
