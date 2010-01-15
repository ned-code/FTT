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
// in every browser. This plugin tests for that 'margin'.

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


// Extend jQuery with some helper plugins

jQuery.fn.extend({
    // Get or set id (attribute helper)
    id: function(id) {
        return (id === undefined) ? 
            this.attr("id") :
            this.attr("id", id) ;
    }
});

// Extend jQuery with some helper functions

jQuery.extend({
    // Event delegation helper. Bind to event, passing in
    // {'selector': fn} pairs as data. Finds closest match
    // (caching the result in the clicked element's data),
    // and triggers the associated function.  Eg:
    //
    // .bind('click', {'selector': fn}, jQuery.delegate)
    
    delegate: function(e) {
        var list = e.data,
            target = jQuery(e.target),
            data = target.data("closest") || {},
            closest, elem;
        
        for (var selector in list) {
            elem = data[selector];
            
            if ( elem === undefined ) {
                closest = target.closest( selector, this );
                elem = data[selector] = ( closest.length ) ? closest[0] : false ;
                target.data("closest", data);
            }
            
            if (elem) list[selector].call(this, e);
        }
        
        return false;
    }
});