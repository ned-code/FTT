/**
 * @author Stephen Band / Julien Bachmann
 */
//= require <webdoc/model/document>
//= require <webdoc/model/page>
//= require <webdoc/gui/page_thumbnail_view>

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
      
      ddd( '[linkHandler] Event handler ref: "' + match + '"' );
      
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
  // Editor actions (to be bound to the interface panels)
  _panelHandlers: {
    'left-panel-toggle':    function(e) { WebDoc.application.pageBrowserController.toggle(); },
    'right-panel-toggle':   function(e) { WebDoc.application.rightBarController.toggleRightBar(); },
    
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
    'insert-os-gadget':     function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.osGadgetTool ); },

    
    'to-back':              function(e) { WebDoc.application.boardController.moveSelectionToBack(); },
    'to-front':             function(e) { WebDoc.application.boardController.moveSelectionToFront(); },
    
    'undo':                 function(e) { WebDoc.application.undoManager.undo(); },
    'redo':                 function(e) { WebDoc.application.undoManager.redo(); },
    'delete':               function(e) { WebDoc.application.boardController.deleteSelection(); },
    
    'disable-html':         function(e) { WebDoc.application.pageEditor.toggleDebugMode(); },
    
    'show-thumbs':          function(e) { WebDoc.application.pageBrowserController.showThumbs(e); },
    'hide-thumbs':          function(e) { WebDoc.application.pageBrowserController.hideThumbs(e); },
    'toggle-thumbs':        function(e) { WebDoc.application.pageBrowserController.toggleThumbs(e); },
    
    'mode-toggle':          function(e) { WebDoc.application.boardController.toggleMode(); },
    'mode-edit':            function(e) { WebDoc.application.boardController.setMode(false); },
    'mode-preview':         function(e) { WebDoc.application.boardController.setMode(true); },
    
    'library-images-myimages': function(e) {
      // Open the libraries
      WebDoc.application.rightBarController.showLib(e);
      // jQT is in the global namespace... Get it going to the right page
      jQT.goTo('#images', 'slide');
      // Then click the tab
      // There must be a better way than this
      //jQuery('#images').find('a.my_images').click();
    }
  },
  // Publicly accessible actions (to be bound to document)
  _documentHandlers: {
    'webdoc-prev-page':     function(e) { WebDoc.application.pageEditor.prevPage(); },
    'webdoc-next-page':     function(e) { WebDoc.application.pageEditor.nextPage(); },
    'webdoc-close':         function(e) { WebDoc.application.pageEditor.closeDocument(); }
  }
};
