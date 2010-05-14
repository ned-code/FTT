// Stephen Band

(function(WebDoc, jQuery, undefined){

  var themeNode = jQuery('<div/>'),
  		testNode = jQuery('<div/>').css({ position: 'absolute', top: -1, left: 0, width: 1, height: 1 });
	
  // Find out if adding a class to testNode gives it
  // a sense of style and panache
  function detectClass( className, styles ){
    var styleList = styles.split(' '),
        l = styleList.length,
        cssValue;
    
    if (l === 0) { return false; }
    
    testNode.addClass( className );
    
    while(l--) {
      cssValue = testNode.css( styleList[l] );
      
      if ( !cssValue || cssValue === 'none' || cssValue === 'rgba(0, 0, 0, 0)' || cssValue === 'transparent' ) {
        testNode.addClass( className );
        return false;
      }
    }
    
    testNode.removeClass( className );
    return true;
  }
  
  // Try classNames with postfixed numbers until
  // no style is detected
  function detectIndexedClasses( classPrefix, styles, classlist ){
    var i = 1,
        className = classPrefix + i;
    
    while ( detectClass( className, styles ) ) {
      classlist.addClass( className );
      i++;
      // Guard against the detector parting en boucle.
      // 64 theme styles should be enough for anyone...
      if (i > 64) { return; }
      className = classPrefix + i;
    }
  }
  
  themeNode.append( testNode );
  
  // ClassList object
  WebDoc.ClassList = $.klass({
    
    // classPrefix    string of class prefix without index:   "theme_background_"
    // stylesToCheck  string of space-separated style rules:  "font-face background-color"
    initialize: function( classPrefix, stylesToCheck ){
      var themeClass = WebDoc.application.boardController.currentThemeClass;
      
      this.list = {};
      
      themeNode
      .addClass( themeClass )
      .appendTo( jQuery('body') );
      
      detectIndexedClasses( classPrefix, stylesToCheck, this );
      
      themeNode
      .remove()
      .removeClass( themeClass );
    },
    
    addClass: function( className ){ this.list[className] = true; },
    
    getClasses: function(){ return this.list; }
  });

})(WebDoc, jQuery);