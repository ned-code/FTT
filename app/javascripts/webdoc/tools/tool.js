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
    if ($(this.toolId).find("a").hasClass("state_tool")) {
      $(".state_tool").removeClass("current");
      $(this.toolId).find("a").addClass("current");
      ddd("set cursor", this.getCursor());
      $("#board").css("cursor", this.getCursor());
    }
  },

  getCursor: function() {
    return "default";  
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
  },
  
  mouseDblClick: function(e) {
    
  },
  
  mouseOver: function(e) {
    
  },
  mouseOut: function(e) {

  }  

});
