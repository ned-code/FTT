/**
* @author julien
*/
WebDoc.Tool = $.klass({  
  initialize: function(toolId) {
    $(toolId).bind("click", this.toolbarButtonClick.bindAsEventListener(this));
  },
  toolbarButtonClick: function(e) {
    e.preventDefault();
    WebDoc.application.boardController.setCurrentTool(this);
  },

  toolPalette: function() {
  },

  selectTool: function() {
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
  }
});
