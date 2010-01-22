/**
 * @author Julien Bachmann
 */
//= require <webdoc/model/document>
//= require <webdoc/model/page>
//= require <webdoc/gui/page_thumbnail_view>

WebDoc.handlers = 
    'undo': function(e) {
        WebDoc.application.undoManager.undo();
    },
    
    'redo': function(e) {
        WebDoc.application.undoManager.redo();
    },
    
    'zoom-in': function(e) {
        WebDoc.application.boardController.zoomIn();
    },
    
    'zoom-out': function(e) {
        WebDoc.application.boardController.zoomOut();
    },
    
    'delete-item': function(e) {
        WebDoc.application.boardController.deleteSelection();
    },
    
    'lib-view': function(e) {
        WebDoc.application.rightBarController.showLib();
    },
    
    'page-inspector-view': function(e) {
        WebDoc.application.rightBarController.showPageInspector();
    },
    
    'item-inspector-view': function(e) {
        WebDoc.application.rightBarController.showItemInspector();
    },
    
    'page-browser': function(e) {
        WebDoc.application.pageBrowserController.toggleBrowser();
    },
    
    'toggle-inspector': function(e) {
        WebDoc.application.rightBarController.toggleRightBar();
    },
    
    'toggleInteractionMode': function(e) {
        e.preventDefault();
        WebDoc.application.boardController.toggleInteractionMode();
    },
  
    'disable-html': function(e) {
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
});

