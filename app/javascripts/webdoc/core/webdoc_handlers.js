 /**
 * @author Stephen Band / Julien Bachmann
 */

WebDoc.handlers = {

  initialise: function(){
    this.panelNode = jQuery('.panel');
    
    this.addDocumentHandlers( 'click', this._documentHandlers );
    this.addPanelHandlers( 'click', this._panelHandlers );
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
    .delegate( '.loading-icon', 'transitionend webkitTransitionEnd', function(e){
      
    });
  },
  
  regex: jQuery.regex,
  
  _makeLinkHandler: function( obj, context ){
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
  
  addDocumentHandlers: function( eventType, obj, context ){
    jQuery(document)
    .delegate('a', eventType, this._makeLinkHandler( obj, context ) );
  },

	addCenterCellHandlers: function(){
		$('.center-cell')
		.bind('click', function(e){
			if ($(e.target).hasClass('center-cell')) {
				WebDoc.application.boardController.unselectAll();
			};
		});
	},
  
  // Editor actions (to be bound to the interface panels)
  _panelHandlers: {
    'left-panel-toggle':    function(e) { WebDoc.application.pageBrowserController.toggle(); },
    'right-panel-toggle':   function(e) { WebDoc.application.rightBarController.toggle(); },
    
    'pages-browser':        function(e) { WebDoc.application.pageBrowserController.toggle(); },
    'library':              function(e) { WebDoc.application.rightBarController.showLib(e); },
    'item-inspector':       function(e) { WebDoc.application.rightBarController.showItemInspector(e); },
    'page-inspector':       function(e) { WebDoc.application.rightBarController.showPageInspector(e); },
    'document-inspector':   function(e) { WebDoc.application.rightBarController.showDocumentInspector(e); },
    'social-inspector':     function(e) { WebDoc.application.rightBarController.showSocialPanel(e); }, 
    
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
    
		'open-browser': 				function(e)	{ WebDoc.application.browserController.openBrowser()}, 
    'disable-html':         function(e) { WebDoc.application.pageEditor.toggleDebugMode(); },
    
    'show-thumbs':          function(e) { WebDoc.application.pageBrowserController.showThumbs(e); },
    'hide-thumbs':          function(e) { WebDoc.application.pageBrowserController.hideThumbs(e); },
    'toggle-thumbs':        function(e) { WebDoc.application.pageBrowserController.toggleThumbs(e); },
    
    'mode-toggle':          function(e) { WebDoc.application.boardController.toggleMode(); },
    'mode-edit':            function(e) { WebDoc.application.boardController.setMode(false); },
    'mode-preview':         function(e) { WebDoc.application.boardController.setMode(true); },
    
    'theme-class':          function(e) {  },
    
    'library-images-myimages': function(e) {
      // Open the libraries
      WebDoc.application.rightBarController.showLib(e);
      // jQT is in the global namespace... Get it going to the right page
      jQT.goTo('#images', 'slide');
      // Then click the tab
      // There must be a better way than this
      //jQuery('#images').find('a.my_images').click();
    },
    
    //'themes-chooser':       function(e) { WebDoc.application.themesController.openChooser(e); },
    'webdoc-duplicate':     function(e) { WebDoc.application.pageEditor.duplicateDocument(e); }
  },
  
  // Publicly accessible actions (to be bound to document)
  _documentHandlers: {
    'webdoc-prev-page':     function(e) { WebDoc.application.pageEditor.prevPage(); },
    'webdoc-next-page':     function(e) { WebDoc.application.pageEditor.nextPage(); },
    'webdoc-close':         function(e) { WebDoc.application.pageEditor.closeDocument(); }
  }
};
