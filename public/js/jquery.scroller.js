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