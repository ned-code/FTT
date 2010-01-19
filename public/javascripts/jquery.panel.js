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

jQuery.fn[plug] = function(){
    var nodes = this;
    
    return nodes
    .bind('click', jQuery.delegate({
        '.toggle-head': toggleHead,
        '.toggle-foot': toggleFoot
    }))
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