// jquery.panel.js
// 
// Handles behaviour of panels
// Requires jQuery.delegate

(function(jQuery, undefined){

var plug = 'panel',
    headToggle = '.toggle-head',
    footToggle = '.toggle-foot',
    inspectorSelector = '.inspector',
    contentSelector = '.content',
    headSelector = '.head>div',
    footSelector = '.foot>div',
    screenClass = 'screen',
    activeClass = 'active',
    cancelClass = 'cancel',
    screenSelector = ".screen",
    cancelSelector = "a[href='#cancel']",
    options = {
        duration: 100
    },
    regex = {
        hash:       /^#?$/,             // Single hash or empty string
        hashRef:    /^#(\S+)/,          // Matches a hash ref, captures all non-space characters following the hash
        slashRef:   /^\//,              // Begins with a slash
        urlRef:     /^[a-z]+:\/\//      // Begins with protocol xxx://
    };

function toggleHead(e){
    var elem = jQuery( e.currentTarget ),
        data = elem.data(plug),
        inspector = elem.find( inspectorSelector ),
        content = elem.find( contentSelector ),
        head = elem.find( headSelector ),
        height = head.height(),
        css = {},
        options = {
            duration: 100
        },
        scroll = content.scrollTop();
    
    if ( data.head ) {
        data.head = false;
        css.top = 0;
        options.step = function(a){
            // Adjust scroll
            content.scrollTop(scroll - (height - a));
        };
    }
    else {
        data.head = true;
        css.top = height;
        options.step = function(a){
            content.scrollTop(scroll + a);
        };
    }
    
    inspector
    .animate( css, options );
    
    return false;
}

function toggleFoot(e){
    var elem = jQuery( e.currentTarget ),
        data = elem.data(plug),
        inspector = elem.find( inspectorSelector ),
        content = elem.find( contentSelector ),
        foot = elem.find( footSelector ),
        height = foot.height(),
        css = {},
        options = {
            duration: 100
        };
    
    if ( data.foot ) {
        data.foot = false;
        css.bottom = 0;
    }
    else {
        data.foot = true;
        css.bottom = height;
    }
    
    inspector
    .animate( css, options );
    
    return false;
}

function callHandler(e){
    var link = jQuery(this),
        href = link.attr('href'),
        match = regex.hashRef.exec(href),
        handlers = WebDoc.handlers;
    
    ddd( '[jQuery.panel] Ref: "' + match + '"' );
    
    // If the href contains a hashRef that matches a handler
    if ( match && handlers[match[1]] ) {
        // Call it with current scope
        try {
          handlers[match[1]].call(this, e);
        }
        finally {
          e.preventDefault();
          return false;
        }
    }
}

jQuery.fn[plug] = function(){
    var nodes = this;
    
    return nodes
    .bind('click', jQuery.delegate({
            '.toggle-head': toggleHead,
            '.toggle-foot': toggleFoot,
            'a': callHandler
        })
    )
    .bind('show-head', toggleHead)
    .bind('show-foot', toggleFoot)
//    .bind('show-screen', function(){
//        var elem = jQuery(this),
//            screen = elem.children('.screen').add( elem.find('#board>.screen') ),
//            options = {
//                duration: 200
//            };
//        
//        elem.addClass("screened");
//        screen.animate({ opacity: 'show' }, options);
//        
//        return false;
//    })
//    .bind('hide-screen', function(){
//        var elem = jQuery(this),
//            screen = elem.children('.screen').add( elem.find('#board>.screen') ),
//            options = {
//                duration: 200,
//                complete: function(){
//                    elem.removeClass("screened");
//                }
//            };
//        
//        screen.animate({ opacity: 'hide' }, options);
//        
//        return false;
//    })
    .each(function(){
        var node = jQuery(this),
            inspector = jQuery(inspectorSelector, this);
        
        node
        .data(plug, {
            // Store current open state
            head: parseInt( inspector.css('top') ) !== 0,
            foot: parseInt( inspector.css('bottom') ) !== 0
        });
    });
};

})(jQuery);



// text style chooser

(function(jQuery, undefined){

    var state = [  
          { fontWeight: 'bold', fontStyle: 'normal' },
          { fontWeight: 'bold', fontStyle: 'italic' },
          { fontWeight: 'normal', fontStyle: 'italic' },
          { fontWeight: 'normal', fontStyle: 'normal' }
        ],
        i = 0;
    

    jQuery('.text-style-toggle')
    .bind('click', function(){
        jQuery(this).css( state[ i++ % state.length ] );
        return false;
    });

})(jQuery);

(function(jQuery, undefined){

    var state = [  
          { textDecoration: 'underline', color: 'white' },
          { textDecoration: 'none', color: 'none' }
        ],
        i = 0;
    
    jQuery('.text-underline-toggle span')
    .bind('click', function(){
        jQuery(this).css( state[ i++ % state.length ] );
        return false;
    });

})(jQuery);



// TODO: make this into a ui-scroller plugin

(function(jQuery, undefined){

jQuery().ready(function(){

    var scroller = jQuery(".scroller"),
        height = scroller.outerHeight(),
        thumb = scroller.find('.scroller-thumb'),
        window = scroller.find('.scroller-window'),
        list = window.find('li a'),
        first, last, diff, unit, currentIndex;
    
    window.find('ul').bind('scroll', function(){
        
        height = scroller.outerHeight();
        
        first = first || window.find('li:first').position().top;
        last = last || window.find('li:last').position().top;
        diff = diff || last - first;
        unit = diff / list.length;
        
        var pos = -( window.find('li:first').position().top - height/2 + unit/2 ),
            index = Math.floor( pos/unit ),
            currentNode;
        
        index = index < 0 ? 0 : index < list.length ? index : list.length-1;
        
        if ( index !== currentIndex ) {
            
            // This should be a callback
            
            currentIndex = index;
            
            currentNode = list.eq( index < 0 ? 0 : index < list.length ? index : list.length-1 );
            
            list.removeClass('current');
            currentNode.addClass('current');
            
            thumb.html(currentNode.clone());
            
            // Send result to text tool
            WebDoc.application.textTool.delegate.editorExec('fontName', currentNode.css('fontFamily'));
        }
    });
});

})(jQuery);