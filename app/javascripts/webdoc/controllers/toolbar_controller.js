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
    $("#tb_1_utilities_settings_dropdown").click(this.performAction.pBind(this));
  },

  performAction: function(e) {
    e.preventDefault();
    clickedButton = $(e.target).closest(".action_button");
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
      ddt();
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
    WebDoc.application.rightBarController.showRightBar(WebDoc.application.rightBarController.showLib.pBind(WebDoc.application.rightBarController));
  },
  
  page_browser: function(e) {
    WebDoc.application.pageBrowserController.toggleBrowser(function() {
      WebDoc.application.boardController.centerBoard();
    });
  },
  
  toggle_inspector: function(e) {
    WebDoc.application.rightBarController.toggleRightBar();
  },
  
  toggleInteractionMode: function(e) {
    e.preventDefault();
    WebDoc.application.boardController.toggleInteractionMode();
  },
  
  disable_html: function(e) {
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

