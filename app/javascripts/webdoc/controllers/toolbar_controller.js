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

  zoomIn: function(e) {
    WebDoc.application.boardController.zoomIn();
  },

  zoomOut: function(e) {
    WebDoc.application.boardController.zoomOut();
  },

  deleteItem: function(e) {
    WebDoc.application.boardController.deleteSelection();
  },   
   
  libView: function(e) {
    $("#inspector").slideToggle("fast");
    $("#libraries").slideToggle("fast");
  },
  
  pageBrowser: function(e) {
    WebDoc.application.pageBrowserController.toggleBrowser(function() {
      WebDoc.application.boardController.centerBoard();
    });
  }  
  
});

