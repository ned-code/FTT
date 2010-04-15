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