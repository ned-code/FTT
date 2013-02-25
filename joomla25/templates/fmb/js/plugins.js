// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
// HOTFIX: We can't upgrade to jQuery UI 1.8.6 (yet)
// This hotfix makes older versions of jQuery UI drag-and-drop work in IE9
(function(jQuery){var a=jQuery.ui.mouse.prototype._mouseMove;jQuery.ui.mouse.prototype._mouseMove=function(b){if(jQuery.browser.msie&&document.documentMode>=9){b.button=1};a.apply(this,[b]);}}(jQuery));
//placeholders
(function($)
{
    $(function()
    {
        var placeholder_support = !!('placeholder' in document.createElement( 'input' ));
        if (!placeholder_support)
        {
            var body = $(document.body);
            $('input[placeholder]').each(function(){
                var tpl = '<div class="placeholder" style="position:absolute;overflow:hidden;white-space:nowrap"/>',
                    th = $(this),
                    position = th.offset(),
                    height = th.height(),
                    width = th.width(),
                    placeholder = $(tpl).appendTo(body)
                        .css({
                            top: position.top,
                            left: position.left,
                            width: width,
                            height: height,
                            padding: ((th.innerHeight(true) - height) / 2) + 'px ' +  ((th.innerWidth(true) - width) / 2) + 'px '
                        })
                        .text(th.attr('placeholder'))
                        .addClass(th.attr('class'))
                    ;

                placeholder.bind('click focus', function(){placeholder.hide();th.focus();});
                th.bind('blur', function(){if (th.val() == '') placeholder.show()});
            });
        }
    });
}(jQuery));
// adds .naturalWidth() and .naturalHeight() methods to jQuery
// for retreaving a normalized naturalWidth and naturalHeight.
(function($){
    var
        props = ['Width', 'Height'],
        prop;

    while (prop = props.pop()) {
        (function (natural, prop) {
            $.fn[natural] = (natural in new Image()) ?
                function () {
                    return this[0][natural];
                } :
                function () {
                    var
                        node = this[0],
                        img,
                        value;

                    if (node.tagName.toLowerCase() === 'img') {
                        img = new Image();
                        img.src = node.src,
                            value = img[prop];
                    }
                    return value;
                };
        }('natural' + prop, prop.toLowerCase()));
    }
}(jQuery));