/**
 * @author Stephen Band / Julien Bachmann
 */
//= require <webdoc/model/document>
//= require <webdoc/model/page>
//= require <webdoc/gui/page_thumbnail_view>

WebDoc.handlers = {
  
  'left-panel-toggle':    function(e) { WebDoc.application.pageBrowserController.toggleBrowser(); },
  'right-panel-toggle':   function(e) { WebDoc.application.rightBarController.toggleRightBar(); },
  
  'pages-browser':        function(e) { WebDoc.application.pageBrowserController.toggleBrowser(); },
  'library':              function(e) { WebDoc.application.rightBarController.showLib(); },
  'inspector':            function(e) { WebDoc.application.rightBarController.showPageInspector(); },
  
  'prev-page':            function(e) { WebDoc.application.pageEditor.prevPage(); },
  'next-page':            function(e) { WebDoc.application.pageEditor.nextPage(); },
  'add-page':             function(e) { WebDoc.application.pageEditor.addPage(); },
  'copy-page':            function(e) { WebDoc.application.pageEditor.copyPage(); },
  'remove-page':          function(e) { WebDoc.application.pageEditor.removePage(); },
  
  'zoom-in':              function(e) { WebDoc.application.boardController.zoomIn(); },
  'zoom-out':             function(e) { WebDoc.application.boardController.zoomOut(); },
  'move':                 function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.handTool ); },
  'select':               function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.arrowTool ); },
  'draw':                 function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.drawingTool ); },
  'insert-html':          function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.htmlSnipplet ); },
  'insert-text':          function(e) { WebDoc.application.boardController.setCurrentTool( WebDoc.application.textTool ); },
  
  'to-back':            function(e) {
                            var item = WebDoc.application.boardController.selection()[0].item;
                            
                            WebDoc.application.pageEditor.currentPage.moveBack(item);
                            item.save();
                            
                            return false;
                          },
  'to-front':           function(e) {
                            var item = WebDoc.application.boardController.selection()[0].item;
                            
                            WebDoc.application.pageEditor.currentPage.moveFront( item );
                            item.save();
                            
                            return false;
                          },
  
  'undo':                 function(e) { WebDoc.application.undoManager.undo(); },
  'redo':                 function(e) { WebDoc.application.undoManager.redo(); },
  'delete':               function(e) { WebDoc.application.boardController.deleteSelection(); },
  
  'mode-toggle':          function(e) { WebDoc.application.boardController.toggleInteractionMode(); },
  'disable-html':         function(e) {
                            WebDoc.application.pageEditor.disableHtml = !WebDoc.application.pageEditor.disableHtml; 
                            WebDoc.application.pageEditor.loadPageId( WebDoc.application.pageEditor.currentPage.uuid());
                            $("#disable_html a").text(WebDoc.application.pageEditor.disableHtml?"Enable HTML":"Disable HTML");
                            if (WebDoc.application.pageEditor.disableHtml) {
                                $("#tb_1_utilities_settings_trigger").addClass("tb_1_utilities_settings_attention");
                            }
                            else {
                                $("#tb_1_utilities_settings_trigger").removeClass("tb_1_utilities_settings_attention");
                            }
                          }
};
