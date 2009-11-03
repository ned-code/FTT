/**
* @author julien
*/
WebDoc.Tool = $.klass({  
  initialize: function(toolId) {
    this.toolId = toolId;
    $(toolId).bind("click", this.toolbarButtonClick.pBindAsEventListener(this));
  },
  toolbarButtonClick: function(e) {
    e.preventDefault();
    WebDoc.application.boardController.setCurrentTool(this);
  },

  toolPalette: function() {
  },

  selectTool: function() {
    if ($(this.toolId).hasClass("state_tool")) {
      $(".state_tool a").removeClass("current_tool");
      $(this.toolId + " a").addClass("current_tool");
    }
  },

  unSelectTool: function() {
  },

  mouseDown: function(e) {
  },

  mouseMove: function(e) {
  },

  mouseOut: function(e) {
  },

  mouseUp: function(e) {
  },

  mouseClick: function(e) {
  }

});
