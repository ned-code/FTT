/**
* @author julien
*/
WebDoc.Tool = $.klass({  
  initialize: function( selector, editorClass ) {
    this.selector = selector;
    this.editorClass = editorClass;
  },
  
  toolPalette: function() {
  },
  
  selectTool: function() {
    var buttons = $(this.selector),
    		board = WebDoc.application.boardController;
      
    if (board.editorNode) {
      board.editorNode[0].className = board.editorNode[0].className.replace( /\b\S+_mode\b/g, '' );
      
      board.editorNode
      .addClass( this.editorClass );
      
      this._previousEditorClass = this.editorClass;
    }
    
    board.activateEventCatcher(true);
  },
  
  unSelectTool: function() {
    var buttons = $(this.selector),
    		board = WebDoc.application.boardController;
    
    board.editorNode
    .removeClass( this._previousEditorClass || 'default_app')
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
