// clickfocus and dblclickfocus prevent the target receiving focus
// until after the click or double click.  Normally, focus is received
// on mousedown - ie. even before the click. The intention is to give
// some control over inputs.

(function(jQuery){

function stopFocus(e) { e.preventDefault(); }

jQuery.event.special.clickfocus = {
    setup: function() {
        jQuery(this)
        .bind('mousedown', stopFocus)
        .bind('click', jQuery.event.special.clickfocus.handler);
        return true;
    },
    teardown: function(namespaces) {
        jQuery(this)
        .unbind('mousedown', stopFocus)
        .unbind('click', jQuery.event.special.clickfocus.handler);
    },
    handler: function(e) {
        jQuery(this).focus();
        
        // Execute the right handler by setting the event type
        e.type = "clickfocus";
        return jQuery.event.handle.apply(this, arguments);
    }
};

jQuery.event.special.dblclickfocus = {
    setup: function() {
        jQuery(this)
        .bind('mousedown', stopFocus)
        .bind('dblclick', jQuery.event.special.dblclickfocus.handler);
        return true;
    },
    teardown: function(namespaces) {
        jQuery(this)
        .unbind('mousedown', stopFocus)
        .unbind('dblclick', jQuery.event.special.dblclickfocus.handler);
    },
    handler: function(e) {
        jQuery(this).focus();
        
        // Execute the right handler by setting the event type
        e.type = "dblclickfocus";
        return jQuery.event.handle.apply(this, arguments);
    }
};

})(jQuery);