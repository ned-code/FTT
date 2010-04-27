/**
 * @author Stephen Band / Julien Bachmann
 */

WebDoc.handlers = {

  initialise: function(){
    jQuery(document)
    .delegate('a', 'click', this._makeLinkHandler( this._documentHandlers ));
    
    jQuery('.panel')
    .delegate('a', 'click', this._makeLinkHandler( this._panelHandlers ));
  },
  regex: jQuery.regex,
  _makeLinkHandler: function( obj ){
    var regex = this.regex;
    
    // Curry linkHandler using this scope
    return function(e){
      var link = jQuery(this),
          href = link.attr('href'),
          match = regex.hashRef.exec(href);
      
      ddd( '[Handler] "' + match + '"' );
      
      // If the href contains a hashRef that matches an obj key
      if ( match && obj[match[1]] ) {
        // Call it with link as scope
        try {
          obj[match[1]].call(this, e);
        }
        finally {
          e.preventDefault();
        }
      }
    };
  },
  addPanelHandlers: function( obj ){
    for (var key in obj) {
      this._panelHandlers[key] = obj[key];
    }
  },
  addDocumentHandlers: function( obj ){
    for (var key in obj) {
      this._documentHandlers[key] = obj[key];
    }
  },
  // Editor actions (to be bound to the interface panels)
  _panelHandlers: {
    'left-panel-toggle':    function(e) { ddd("[Handler] 'left-panel-toggle'");   WebDoc.application.pageBrowserController.toggle(); },
    'right-panel-toggle':   function(e) { ddd("[Handler] 'right-panel-toggle'");  WebDoc.application.rightBarController.toggle(); },
    
    'pages-browser':        function(e) { ddd("[Handler] 'pages-browser'");       WebDoc.application.pageBrowserController.toggle(); },
    'library':              function(e) { ddd("[Handler] 'library'");             WebDoc.application.rightBarController.showLib(e); },
    'item-inspector':       function(e) { ddd("[Handler] 'item-inspector'");      WebDoc.application.rightBarController.showItemInspector(e); },
    'page-inspector':       function(e) { ddd("[Handler] 'page-inspector'");      WebDoc.application.rightBarController.showPageInspector(e); },
    'document-inspector':   function(e) { ddd("[Handler] 'document-inspector'");  WebDoc.application.rightBarController.showDocumentInspector(e); },
    'social-inspector':     function(e) { ddd("[Handler] 'social-inspector'");    WebDoc.application.rightBarController.showSocialPanel(e); }, 
    
    'add-page':             function(e) { ddd("[Handler] 'add-page'");            WebDoc.application.pageEditor.addPage(); },
    'add-web-page':         function(e) { ddd("[Handler] 'add-web-page'");        WebDoc.application.pageEditor.addWebPage();},
    'copy-page':            function(e) { ddd("[Handler] 'copy-page'");           WebDoc.application.pageEditor.copyPage(); },
    'remove-page':          function(e) { ddd("[Handler] 'remove-page'");         WebDoc.application.pageEditor.removePage(); },
    
    'zoom-in':              function(e) { ddd("[Handler] 'zoom-in'");             WebDoc.application.boardController.zoomIn(); },
    'zoom-out':             function(e) { ddd("[Handler] 'zoom-out'");            WebDoc.application.boardController.zoomOut(); },
    'move':                 function(e) { ddd("[Handler] 'move'");                WebDoc.application.boardController.setCurrentTool( WebDoc.application.handTool ); },
    'select':               function(e) { ddd("[Handler] 'select'");              WebDoc.application.boardController.setCurrentTool( WebDoc.application.arrowTool ); },
    'draw':                 function(e) { ddd("[Handler] 'draw'");                WebDoc.application.boardController.setCurrentTool( WebDoc.application.drawingTool ); },
    'insert-html':          function(e) { ddd("[Handler] 'insert-html'");         WebDoc.application.boardController.setCurrentTool( WebDoc.application.htmlSnipplet ); },
    'insert-text':          function(e) { ddd("[Handler] 'insert-text'");         WebDoc.application.boardController.setCurrentTool( WebDoc.application.textTool ); },
    'insert-iframe':        function(e) { ddd("[Handler] 'insert-iframe'");       WebDoc.application.boardController.setCurrentTool( WebDoc.application.iframeTool ); },
    'insert-os-gadget':     function(e) { ddd("[Handler] 'insert-os-gadget'");    WebDoc.application.boardController.setCurrentTool( WebDoc.application.osGadgetTool ); },

    
    'to-back':              function(e) { ddd("[Handler] 'to-back'");             WebDoc.application.boardController.moveSelectionToBack(); },
    'to-front':             function(e) { ddd("[Handler] 'to-front'");            WebDoc.application.boardController.moveSelectionToFront(); },
    
    'undo':                 function(e) { ddd("[Handler] 'undo'");                WebDoc.application.undoManager.undo(); },
    'redo':                 function(e) { ddd("[Handler] 'redo'");                WebDoc.application.undoManager.redo(); },
    'delete':               function(e) { ddd("[Handler] 'delete'");              WebDoc.application.boardController.deleteSelection(); },
    
    'disable-html':         function(e) { ddd("[Handler] 'disable-html'");        WebDoc.application.pageEditor.toggleDebugMode(); },
    
    'show-thumbs':          function(e) { ddd("[Handler] 'show-thumbs'");         WebDoc.application.pageBrowserController.showThumbs(e); },
    'hide-thumbs':          function(e) { ddd("[Handler] 'hide-thumbs'");         WebDoc.application.pageBrowserController.hideThumbs(e); },
    'toggle-thumbs':        function(e) { ddd("[Handler] 'toggle-thumbs'");       WebDoc.application.pageBrowserController.toggleThumbs(e); },
    
    'mode-toggle':          function(e) { ddd("[Handler] 'mode-toggle'");         WebDoc.application.boardController.toggleMode(); },
    'mode-edit':            function(e) { ddd("[Handler] 'mode-edit'");           WebDoc.application.boardController.setMode(false); },
    'mode-preview':         function(e) { ddd("[Handler] 'mode-preview'");        WebDoc.application.boardController.setMode(true); },
    
    'library-images-myimages': function(e) {
      ddd("[Handler] 'library-images-myimages'");
      // Open the libraries
      WebDoc.application.rightBarController.showLib(e);
      // jQT is in the global namespace... Get it going to the right page
      jQT.goTo('#images', 'slide');
      // Then click the tab
      // There must be a better way than this
      //jQuery('#images').find('a.my_images').click();
    },
    
    'webdoc-duplicate':     function(e) { ddd("[Handler] 'webdoc-duplicate'");    WebDoc.application.pageEditor.duplicateDocument(e); }
  },
  // Publicly accessible actions (to be bound to document)
  _documentHandlers: {
    'webdoc-prev-page':     function(e) { ddd("[Handler] 'webdoc-prev-page'");    WebDoc.application.pageEditor.prevPage(); },
    'webdoc-next-page':     function(e) { ddd("[Handler] 'webdoc-next-page'");    WebDoc.application.pageEditor.nextPage(); },
    'webdoc-close':         function(e) { ddd("[Handler] 'webdoc-close'");        WebDoc.application.pageEditor.closeDocument(); }
  }
};
