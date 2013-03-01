$FamilyTreeTop.create("popovers", function($){
    var $fn;

    $fn = {
        getOptions: function(args){
            var options;
            if("undefined" === typeof(args.options)){
                options = {};
            } else {
                options = args.options;
            }
            return $.extend({}, options, {
                html: true,
                selector: false,
                placement: "right",
                trigger: 'click',
                title: 'my Title',
                content: 'Content',
                delay: { show: 500, hide: 100 },
                container: 'body'

            });
        }
    }

    this.render = function(args){
        if("undefined" === typeof(args)) return false;
        $(args.target).popover($fn.getOptions(args));
    }
});