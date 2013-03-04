$FamilyTreeTop.create("popovers", function($){
    var $this = this, $fn, $th;

    console.log($this);
    $th = {
        target: false,
        gedcom_id: false,
        object: false
    }

    $fn = {
        setData:function(args){
            $fn.target = args.target;
            $th.gedcom_id = $(args.target).attr('gedcom_id');
            $th.object = $this.mod('usertree').user($th.gedcom_id);
        },
        getTitle:function(){
            return $th.object.name();
        },
        getContent:function(){
            var div = $('#familytreetop-root #popover').clone(),
                names = ['first_name', 'middle_name', 'last_name', 'know_as'];
            $(div).find('ul li span').each(function(index, el){
                var name = $th.object[names[index]];
                if(name != null){
                    $(el).text(name);
                }
            });
            return div;
        },
        getContainer: function(){
            return 'body';
        },
        getTemplate:function(){
            return '<div class="popover" style="min-width:350px;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
        },
        getOptions: function(args){
            var options;
            if("undefined" === typeof(args.options)){
                options = {};
            } else {
                options = args.options;
            }
            return $.extend({}, options, {
                html: true,
                template: $fn.getTemplate(),
                selector: false,
                placement: "right",
                trigger: 'click',
                title: $fn.getTitle(),
                content: $fn.getContent(),
                delay: { show: 500, hide: 100 },
                container: $fn.getContainer()
            });
        }
    }

    this.render = function(args){
        $fn.setData(args);
        if("undefined" === typeof(args) || !$th.gedcom_id){
            return false;
        }
        $(args.target).popover($fn.getOptions(args));
    }
});