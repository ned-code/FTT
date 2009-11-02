/**
 * @author Julien Bachmann
 */
//= require <webdoc/model/document>
//= require <webdoc/model/page>
//= require <webdoc/gui/page_thumbnail_view>

WebDoc.ToolbarController = $.klass({
  initialize: function() {
    ddd("init toolbar controller");
    try {
      $("#tb_2").click(this.performAction.pBind(this));
    }
    catch (ex) {
      ddt();
    }
    $("#tb_1_utilities_preview").click(this.toggleInteractionMode.pBind(this));
  },

  performAction: function(e) {
    e.preventDefault();
    clickedButton = $(e.target).closest(".tb_button");
    try {
      // first look if action is defined in the toolbar controller. Otherwise try to delegate the action to the page editor
      if (this[clickedButton.attr("id")]) {
        this[clickedButton.attr("id")].apply(this, [e]);
      }
      else {
        WebDoc.application.pageEditor[clickedButton.attr("id")].apply(WebDoc.application.pageEditor, [e]);
      }
    }
    catch(ex) {
      ddd("unknown toolbar action: " + clickedButton.attr("id"));
    }    
  },
  
  undo: function(e) {
    WebDoc.application.undoManager.undo();
  },

  redo: function(e) {
    WebDoc.application.undoManager.redo();
  },

  zoom_in: function(e) {
    WebDoc.application.boardController.zoomIn();
  },

  zoom_out: function(e) {
    WebDoc.application.boardController.zoomOut();
  },

  delete_item: function(e) {
    WebDoc.application.boardController.deleteSelection();
  },   
   
  lib_view: function(e) {
    WebDoc.application.inspectorController.showLib();
  },
  
  page_browser: function(e) {
    WebDoc.application.pageBrowserController.toggleBrowser(function() {
      WebDoc.application.boardController.centerBoard();
    });
  },
  
  toggle_inspector: function(e) {
    WebDoc.application.inspectorController.toggleInspector(function() {
      WebDoc.application.boardController.centerBoard();
    });
  },
  
  toggleInteractionMode: function(e) {
    e.preventDefault();
    WebDoc.application.boardController.toggleInteractionMode();
  }
  
});

