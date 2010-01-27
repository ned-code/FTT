/**
* @author julien
*/
WebDoc.Tool = $.klass({  
  initialize: function( selector, boardClass ) {
    this.selector = selector;
    this.boardClass = boardClass;
  },
  
  //toolbarButtonClick: function(e) {
  //  e.preventDefault();
  //  WebDoc.application.boardController.setCurrentTool(this);
  //},
  
  toolPalette: function() {
  },
  
  selectTool: function() {
    var buttons = $(this.selector);
    
    if ( buttons.hasClass("state_tool") ) {
      $(".state_tool").removeClass("current");
      
      buttons.addClass("current");
      
      ddd("set class", this.boardClass);
      
      // Set class on the board so that style changes
      $("#board").removeClass().addClass(this.boardClass);
    }
  },
  
  //getCursor: function() {
  //  return "default";  
  //},
  
  getCursorHeight: function() {
    // Find cursor image
    var regex = /url\(([-\/\.a-zA-Z0-9]+)\)/,       // matches url(xxx) and captures url
        cursorCss = $("#board").css('cursor'),
        imageUrl = cursorCss ? regex.exec(cursorCss) : false,
        css = {
          position: 'absolute',
          left: -100,
          top: -100
        },
        imgNode, imageHeight;
    
    if ( imageUrl ) {
      ddd('[WebDoc.Tool.getCursorHeight] cursor has image ' + imageUrl[1] );
      
      // Test image for height and return
      imageNode = jQuery('<img>')
      .attr('src', imageUrl[1])
      .css(css);
      
      jQuery('body').append(imageNode);
      
      height = imageNode.height();
      
      imageNode.remove();
      
      ddd('[WebDoc.Tool.getCursorHeight] cursor image has height ' + height );
      
      return height;
      
      // TODO: cache heights of already tested images
    }
    
    return 0;
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
