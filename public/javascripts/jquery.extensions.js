// Extensions to jQuery
//
// Stephen Band
//
// Feature detection, and helper methods for jQuery and jQuery.fn

// Detect whether different types of html5 form elements have native UI implemented
// and store boolean in jQuery.support.inputTypes[type]. For now, types not used in
// webdoc are commented out.
// You may find inspiration at Mike Taylor's site, here:
// http://www.miketaylr.com/code/html5-forms-ui-support.html

(function(jQuery, undefined){
    var input = jQuery('<input/>', { }).css({ position: 'absolute', top: -100 }),
        types = jQuery.support.inputTypes = {
          //datetime: false,
          //date: false,
          //month: false,
          //week: false,
          //time: false,
          //'datetime-local': false,
          //number: false,
          range: false
        };
    
    jQuery(document).ready(function(){
        var testValue = '::',
            type;
        
        document.body.appendChild( input[0] );
        
        // Loop over types
        for (type in types) {
          // Change the input type, then check to see if it still behaves like a text input.
          // According to jQuery, changing type property causes problems in IE:
          // http://stackoverflow.com/questions/1544317/jquery-change-type-of-input-field
          // so we may have to change this...
          
          input[0].type = type;
          input[0].value = testValue;
          
          types[type] = input[0].value !== testValue;
        }
        
        input.remove();
    });
})(jQuery);

// Detect css3 features like transition and store in jQuery.support.css

(function(jQuery, undefined){
    
    var debug = (window.console && console.log);
    
    jQuery.support.css = {};
    
    function transitionEnd(e){
      if (debug) { console.log('[CSS] transition detected'); };
      jQuery.support.css.transition = true;
      jQuery(document).unbind('transitionend webkitTransitionEnd oTransitionEnd', transitionEnd);
    }
    
    jQuery(document).ready(function(){
      // Lazily test for transition support by listening
      // for the transitionend event
      jQuery(document).bind('transitionend webkitTransitionEnd oTransitionEnd', transitionEnd);
    });
})(jQuery);

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
    
    // Attribute helpers
    
    id: function(id) {
        return this.attr("id", id) ;
    },
    
    href: function(href) {
        return this.attr("href", href) ;
    }
});

// Extend jQuery with some helper methods

jQuery.extend({
    
    // Event delegation helper. Bind to event, passing in
    // {'selector': fn} pairs as data. Finds closest match
    // (caching the result in the clicked element's data),
    // and triggers the associated function(s) with the matched
    // node as scope. Returns the result of the last function.
    // 
    // Eg:
    // .bind('click', jQuery.delegate({'selector': fn}))
    
    delegate: function(list, context){
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
                  e.delegateTarget = node;
                  result = list[selector].call( context || node, e );
                }
            }
            
            return result;
        }
    },
    
    // Some helpful regex for parsing hrefs and css urls etc.
    
    regex: {
      integer:    /^-?[0-9]+$/,
      cssUrl:     /url\([\'\"]?([-:_\.\/a-zA-Z0-9]+)[\'\"]?\)/,   // matches url(xxx), url('xxx') or url("xxx") and captures xxx
      hash:       /^#?$/,                                         // Single hash or empty string
      hashRef:    /^#(\S+)/,                                      // Matches a hash ref, captures all non-space characters following the hash
      slashRef:   /^\//,                                          // Begins with a slash
      urlRef:     /^[a-z]+:\/\//,                                 // Begins with protocol xxx://
      cssValue:   /^\d+\s?(px|%|em|ex|pt|in|cm|mm|pt|pc)$/,       // Accepts any valid unit of css measurement
      hslColor:   /^(?:hsl\()?\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})%\s?,\s?([0-9]{1,3})%\s?\)?$/,   // hsl(xx, xx%, xx%)
      hexColor:   /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}$)/,          // #xxxxxx
      rgbColor:   /^(?:rgb\()?\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})\s?,\s?([0-9]{1,3})\s?\)?$/   // rgb(xxx, xxx, xxx)  - not perect yet, as it allows values greater than 255
    }
});

// Add easing functions to jQuery's animation capabilities

jQuery.extend(jQuery.easing, {
  // TODO: make this emulate 'muffled bounce' from the UIZE library
  // because we like that. Yes, we do.
  webdocBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.5)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.5)) {
			return c*(7.5625*(t-=(1.5/2.5))*t + .75) + b;
		} else {
			return c*(7.5625*(t-=(2.25/2.5))*t + .9375) + b;
		}
	}
})