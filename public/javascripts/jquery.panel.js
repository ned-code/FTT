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
    options = {
        duration: 100
    },
    regex = {
        hash:       /^#?$/,             // Single hash or empty string
        hashRef:    /^#(\S+)/,          // Matches a hash ref, capturing all non-space characters following the hash
        slashRef:   /^\//,              // Begins with a slash
        urlRef:     /^[a-z]+:\/\//      // Begins with protocol xxx://
    },
    handlers = {
        'left-panel-toggle':    function(e){ WebDoc.application.pageBrowserController.toggleBrowser(); },
        'right-panel-toggle':   function(e){ WebDoc.application.rightBarController.showLib(); },
        
        'pages-browser':        function(e){ WebDoc.application.pageBrowserController.toggleBrowser(); },
        'library':              function(e){ WebDoc.application.rightBarController.showLib(); },
        'inspector':            function(e){ WebDoc.application.rightBarController.showPageInspector(); },
        
        'prev-page':            function(e){ WebDoc.PageEditor.prevPage(); },
        'next-page':            function(e){ WebDoc.PageEditor.nextPage(); },
        'add-page':             function(e){ WebDoc.PageEditor.addPage(); },
        'remove-page':          function(e){ WebDoc.PageEditor.removePage(); },
        
        'zoom-in':              function(e){ WebDoc.application.boardController.zoomIn(); },
        'zoom-out':             function(e){ WebDoc.application.boardController.zoomOut(); },
        'move':                 function(e){ WebDoc.application.handTool.toolbarButtonClick(); }
        //'select':               ,
        //'draw':                 ,
        //'insert-html':          ,
        //'insert-text':          ,
        //'move-back':            ,
        //'move-front':           ,
        
        //'undo':                 ,
        //'redo':                 ,
        //'delete':               
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
    var //panel = jQuery( e.currentTarget ),
        //data = panel.data(plug),
        link = jQuery(this),
        href = link.attr('href'),
        match = regex.hashRef.exec(href),
        handlers = WebDoc.handlers;
    
    console.log(this);
    console.log(href + ' ' + match);
    
    // If the href contains a hashRef that matches a handler, call it
    if ( match && WebDoc.handlers[match[1]] ) {
        WebDoc.handlers[match[1]](e);
        return false;
    }
}

jQuery.fn[plug] = function(){
    var nodes = this;
    
    return nodes
    .bind('click', jQuery.delegate({
            'body': function(){ console.log('HEY'); console.log(this); },
            '.toggle-head': toggleHead,
            '.toggle-foot': toggleFoot,
            'a': callHandler
        })
    )
    .bind('show-head', toggleHead)
    .bind('show-foot', toggleFoot)
    .bind('show-screen', function(){
        var elem = jQuery(this),
            screen = elem.children('.screen').add( elem.find('#board>.screen') ),
            options = {
                duration: 200
            };
        
        elem.addClass("screened");
        screen.animate({ opacity: 'show' }, options);
        
        return false;
    })
    .bind('hide-screen', function(){
        var elem = jQuery(this),
            screen = elem.children('.screen').add( elem.find('#board>.screen') ),
            options = {
                duration: 200,
                complete: function(){
                    elem.removeClass("screened");
                }
            };
        
        screen.animate({ opacity: 'hide' }, options);
        
        return false;
    })
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