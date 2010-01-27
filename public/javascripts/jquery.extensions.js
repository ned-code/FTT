// Stores browser scrollbar width as jQuery.support.scrollbarWidth
// Only available after document ready
// TODO: Not tested, and probably not working in IE. You may find inspiration here:
// http://github.com/brandonaaron/jquery-getscrollbarwidth/blob/master/jquery.getscrollbarwidth.js

(function(jQuery) {
    var scrollbarWidth,
        elem = jQuery('<div/>'),
        testElem = jQuery('<div/>'),
        css = {
            position: 'absolute',
            width: 100,
            height: 100,
            overflow: 'auto'
        },
        cssTest = {
            height: 200
        };
    
    testElem
    .css(cssTest);
    
    elem
    .css(css)
    .append(testElem);
    
    // We can only interrogate the div once the document is ready
    jQuery(function(){
        // Stick test into the DOM
        document.body.appendChild( elem[0] );
        
        // Find out how wide the scrollbar is
        scrollbarWidth = 100 - testElem.width();
        
        // Add result to jQuery.support
        jQuery.support.scrollbarWidth = scrollbarWidth;
        
        // Destroy test nodes
        document.body.removeChild( elem[0] );
        elem = testElem = elem[0] = testElem[0] = null;
    });
})(jQuery);


// Stores gap at bottom of textarea as jQuery.support.textareaMarginBottom
// Textareas have a gap at the bottom that is not controllable by CSS, and it's different
// in every browser. This plugin tests for that pseudo-margin.

(function(jQuery){
    var test = jQuery("<div><textarea style='margin:0; padding:0; border: none; height: 20px;'></textarea></div>").appendTo('body'),
        textareaGap;
    
    jQuery(function(){
        // Stick test into the DOM
        test.appendTo('body');
        
        // Find out how big the gap is
        textareaGap = test.height() - test.children('textarea').height();
        
        // Add result to jQuery.support
        jQuery.support.textareaMarginBottom = textareaGap;
        
        // Destroy test
        test.remove();
    });
})(jQuery);


// Extend jQuery plugins with some helper plugins

jQuery.fn.extend({
    
    // Get or set id (attribute helper)
    
    id: function(id) {
        return (id === undefined) ? 
            this.attr("id") :
            this.attr("id", id) ;
    },
    
    /**!
     * unwrap - v0.1 - 7/18/2009
     * http://benalman.com/projects/jquery-unwrap-plugin/
     * 
     * Copyright (c) 2009 "Cowboy" Ben Alman
     * Licensed under the MIT license
     * http://benalman.com/about/license/
     **/
    // TODO: We no longer need this when we've got jQuery 1.4 !
    
    unwrap: function() {
      this.parent(':not(body)')
        .each(function(){
          $(this).replaceWith( this.childNodes );
        });
      
      return this;
    }
});

// Extend jQuery with some helper functions

jQuery.extend({
    
    // Event delegation helper. Bind to event, passing in
    // {'selector': fn} pairs as data. Finds closest match
    // (caching the result in the clicked element's data),
    // and triggers the associated function(s) with the matched
    // node as scope. Returns the result of the last function.
    // 
    // Eg:
    // .bind('click', jQuery.delegate({'selector': fn}))
    
    delegate: function(list){
        return function(e){
            var target = jQuery(e.target),
                data = target.data("closest") || {},
                closest, node, result;
            
            for (var selector in list) {
                node = data[selector];
                
                if ( node === undefined ) {
                    closest = target.closest( selector, this );
                    node = data[selector] = ( closest.length ) ? closest[0] : false ;
                    target.data("closest", data);
                }
                
                if ( node ) { 
                  ddd('[jQuery.delegate] Matched selector: "' + selector + '"');
                  result = list[selector].call(node, e);
                }
            }
            
            return result;
        }
    },
    
    // Some helpful regex for parsing hrefs and css urls etc.
    
    regex: {
      // matches url(xxx), url('xxx') or url("xxx") and captures xxx
      cssUrl: /url\([\'\"]?([-:_\.\/a-zA-Z0-9]+)[\'\"]?\)/
      
    }
});