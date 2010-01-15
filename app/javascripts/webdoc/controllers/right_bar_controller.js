/**
 * Controller of the right bar. It manages the show, the hide and the toggle the right bar. It also manages if the right bar shows the inspector or the lib.
 * @author Julien Bachmann
 */
//= require <webdoc/controllers/page_inspector_controller>

(function(undefined){

// Default settings
var boardPanel,
    rightPanel,
    rightPanelWidth = 350;

WebDoc.RightBarController = $.klass({
  initialize: function() {
    boardPanel = $("#board_container");
    rightPanel = $("#right_bar");
    
    this.visible = false;
    this.domNode = rightPanel;
    
    // Store actual size of panel
    panelWidth = rightPanel.outerWidth();
    ddd('Width of right panel: '+panelWidth);
  },
  
  showLib: function() {
    ddd("show lib");
    
    if (!WebDoc.application.librariesController) { // lazily load the library
      WebDoc.application.librariesController = new WebDoc.LibrariesController();
    }
    
    ddd("animate lib");
    this.showRightBar(function() {
      $("#item_inspector").hide();
      $("#page_inspector").hide();      
      $("#libraries").show();      
    });
    $(".current_right_item").removeClass("current_right_item");
    $("#lib_view").addClass("current_right_item");
  },  
  
  showPageInspector: function() {
    ddd("show page inspector");
    if (!WebDoc.application.pageInspectorController) { // lazily load the page inspector
      WebDoc.application.pageInspectorController = new WebDoc.PageInspectorController();
    }
    
    this.showRightBar(function() {
      $("#item_inspector").hide();      
      $("#libraries").hide();
      //$("#page_inspector").show();      
    });
    $(".current_right_item").removeClass("current_right_item");
    $("#page_inspector_view").addClass("current_right_item");    
  },
  
  showItemInspector: function(callBack) {
    ddd("show item inspector");
    
    this.showRightBar(function() {
      //$("#page_inspector").hide();      
      $("#libraries").hide();
      $("#item_inspector").show();      
    });
    $(".current_right_item").removeClass("current_right_item");
    $("#item_inspector_view").addClass("current_right_item"); 
  },
    
  showInspectors: function(callBack) {
    ddd("old show inspectors");
  },
  
  showRightBar: function(callBack) {
    if (!this.visible) {
      this.visible = true;
      
      rightPanel
      .animate({
          marginLeft: -panelWidth
      }, {
          step: function(val){
              boardPanel.css({
                  right: -val
              });
          },
          complete: function() {
              if (callBack) {
                  callBack.apply(this);
              }
          }
      });
    }
    
    else {
      if (callBack) {
        callBack.apply(this);
      }
    }
  },
  
  hideRightBar: function(callBack) {
    if (this.visible) {
      this.visible = false;
      
      rightPanel
      .animate({
          marginLeft: 0
      }, {
          step: function(val){
              boardPanel.css({
                  right: -val
              });
          },
          complete: function() {
              if (callBack) {
                  callBack.apply(this);
              }
          }
      });
    }
    else {
      if (callBack) {
        callBack.apply(this);
      }
    }
  },
  
  toggleRightBar: function() {
    if (this.visible) {
      this.hideRightBar();
    }
    else {
      this.showRightBar();
    }
  }
  
});

$.extend(WebDoc.InspectorController, {});

}());
