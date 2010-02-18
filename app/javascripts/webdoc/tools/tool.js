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
    
    if ( buttons.hasClass("state-tool") ) {
      $(".state-tool").removeClass("current");
      
      buttons.addClass("current");
      
      ddd('[WebDoc.Tool] set board class "' + this.boardClass + '"');
      
      // Set class on the board so that style changes
      $("#board").removeClass().addClass(this.boardClass);
    }
    WebDoc.application.boardController.activateEventCatcher(true);
  },
  
  getCursorHeight: function() {
    // If cursorHeight doesn't exist yet, go get it
    return ( typeof this._cursorHeight === 'undefined' ) ? this._storeCursorHeight() : this._cursorHeight;
  },
  
  // Feature detection - sort of
  // Finds cursor image and measures its height
  _storeCursorHeight: function() {
    var regex = /url\([\'\"]?([-:_\.\/a-zA-Z0-9]+)[\'\"]?\)/,       // matches url(xxx) or url('xxx') and captures xxx
        cursorCss = $("#board").css('cursor'),
        imageUrl = cursorCss ? regex.exec(cursorCss) : false,
        css = {
          position: 'absolute',
          left: -100,
          top: -100
        },
        imageNode, imageHeight;
    
    ddd( '[WebDoc.Tool.getCursorHeight] imageUrl ' + imageUrl + '"' );
    
    if ( imageUrl ) {
      
      // Test image for height
      imageNode = jQuery('<img>')
      .attr('src', imageUrl[1])
      .css(css);
      
      jQuery('body').append(imageNode);
      imageHeight = imageNode.height();
      imageNode.remove();
      
      ddd('[WebDoc.Tool.getCursorHeight] cursor image has height ' + imageHeight );
      
      // Store height
      this._cursorHeight = imageHeight;
      return imageHeight;
    }
    
    this._cursorHeight = 0;
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
