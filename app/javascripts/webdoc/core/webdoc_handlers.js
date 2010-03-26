/**
 * @author Stephen Band / Julien Bachmann
 */
//= require <webdoc/model/document>
//= require <webdoc/model/page>
//= require <webdoc/gui/page_thumbnail_view>

WebDoc.handlers = {
  
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
  
  // Publicly accessible actions (to be bound to body)
  
  'prev-page':            function(e) { WebDoc.application.pageEditor.prevPage(); },
  'next-page':            function(e) { WebDoc.application.pageEditor.nextPage(); },
  
  'webdoc-close':         function(e) { WebDoc.application.pageEditor.closeDocument(); }
};
