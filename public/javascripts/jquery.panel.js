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

function openPop(e) {
  var pop = jQuery( e.delegateTarget || e.currentTarget );
  
  pop
  .addClass(activeClass)
  .bind('submit', submitPop)
  .bind('click', cancelPop)
  .animate({
    height: 64
  }, {
    duration: 160
  })
  .find('input:eq(0)')
  // blur doesn't delegate (we need jQuery 1.4!!) so hack around it, for now
  // TODO: The popup closes even if you click on it outside the input...
  .bind('blur', blurPop)
  .focus()
  .select();
}

function controlPop(e) {
  var target = jQuery( e.target );
  
  if ( target.closest(screenSelector).length ) {
    openPop(e);
  }
}

function submitPop(e) {
  var pop = jQuery( e.currentTarget );
  
  deactivatePop(pop);
}

function cancelPop(e) {
  var target = jQuery( e.target ),
      pop = jQuery( e.currentTarget );
  
  if ( target.closest(cancelSelector).length ) {
    deactivatePop(pop);
  }
}

function blurPop(e) {
  var input = jQuery( e.currentTarget ),
      pop = input.closest('.pop');

  deactivatePop(pop);
}

function deactivatePop(pop) {
  pop
  .unbind('submit', submitPop)
  .unbind('click', cancelPop)
  .animate({
    height: 26
  }, {
    duration: 160,
    complete: function(){
      pop
      .removeClass(activeClass)
      .find('input')
      // Remove once we delegate blur (we need jQuery 1.4!!)
      // See hack above.
      .unbind('blur')
      .trigger('blur');
    }
  });
}

jQuery.fn[plug] = function(){
    var nodes = this;
    
    return nodes
    .bind('click', jQuery.delegate({
            '.toggle-head': toggleHead,
            '.toggle-foot': toggleFoot,
            'a': callHandler//,
            //'.pop': controlPop
        })
    )
    .bind('open', jQuery.delegate({
            '.pop': openPop
        })
    )
    .bind('dblclick', jQuery.delegate({
            '.pop': openPop
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


// jquery.popup.js
// 
// Handles behaviour of panels
// Requires jQuery.delegate

(function(jQuery, undefined){

var plug = 'popup',
    screenClass = 'screen',
    activeClass = 'active',
    cancelClass = 'cancel',
    screenSelector = ".screen",
    cancelSelector = "a[href='#cancel']",
    options = {
        duration: 100
    };

function controlPop(e) {
  var target = jQuery( e.target ),
      pop = jQuery( e.delegateTarget || e.currentTarget );
  
  if ( target.closest(screenSelector).length ) {
    pop
    .addClass(activeClass)
    .bind('submit', submitPop)
    .bind('click', cancelPop)
    .animate({
      height: 64
    }, {
      duration: 160
    })
    .find('input:eq(0)')
    // blur doesn't delegate (we need jQuery 1.4!!) so hack around it, for now
    // TODO: The popup closes even if you click on it outside the input...
    .bind('blur', blurPop)
    .focus()
    .select();
  }
}

function submitPop(e) {
  var pop = jQuery( e.currentTarget );
  
  deactivatePop(pop);
}

function cancelPop(e) {
  var target = jQuery( e.target ),
      pop = jQuery( e.currentTarget );
  
  if ( target.closest(cancelSelector).length ) {
    deactivatePop(pop);
  }
}

function blurPop(e) {
  var input = jQuery( e.currentTarget ),
      pop = input.closest('.pop');

  deactivatePop(pop);
}

function deactivatePop(pop) {
  pop
  .removeClass(activeClass)
  .unbind('submit', submitPop)
  .unbind('click', cancelPop)
  .animate({
    height: 28
  }, {
    duration: 160
  });
}

jQuery.fn[plug] = function(){

};

})(jQuery);


// jquery.popup.js
// 
// Handles behaviour of panels
// Requires jQuery.delegate

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

(function(jQuery, undefined){

jQuery().ready(function(){


    var scroller = jQuery(".scroller"),
        height = scroller.outerHeight(),
        scrollList = scroller.find('li'),
        first,
        last,
        diff,
        unit;
    
    var thumb = scroller.find('.scroller-thumb');
    
    scroller.find('ul').bind('scroll', function(){
        var height = scroller.height();
        
        first = first || scroller.find('li:first').position().top;
        last = last || scroller.find('li:last').position().top;
        diff = diff || last - first;
        unit = diff/scrollList.length;
        
        var pos = -( scroller.find('li:first').position().top - height/2 + unit/2 );
        var index = Math.floor( pos/unit );
        var current = scrollList.eq( index > -1 ? index < scrollList.length ? index : scrollList.length-1 : 0 );
        
        scrollList.removeClass('current');
        current.addClass('current');
        
        thumb.html(current.html());
    });
});

})(jQuery);