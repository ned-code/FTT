$FamilyTreeTop.create("popovers", function($){
    'use strict';
    var $this = this, $fn, $th, $pull = [], $active = false;

    $th = {
        target: false,
        gedcom_id: false,
        object: false
    }

    $fn = {
        setData:function(args){
            var $data = $.extend({}, $th);
            $data.target = args.target;
            $data.gedcom_id = $(args.target).attr('gedcom_id');
            $data.object = $this.mod('usertree').user($data.gedcom_id);
            if($data.gedcom_id){
                $pull.push({ id: $data.gedcom_id, data: $data });
                return true;
            }
            return false;
        },
        getLastObject:function(){
            if("undefined" !== typeof($pull[$pull.length - 1])){
                return $pull[$pull.length - 1].data;
            }
            return false;
        },
        getTitle:function(){
            return $fn.getLastObject().object.name();
        },
        getContent:function(){
            var div = $('#familytreetop-root #popover').clone(),
                object = $fn.getLastObject().object,
                avatar;
            $(div).find('ul li').each(function(index, el){
                var type = $(el).attr('data-familytreetop');
                if(object[type] == null || object[type].length == 0){
                    $(el).hide();
                } else {
                    $(el).find('span').text(object[type]);
                }
            });
            avatar = $fn.getLastObject().object.avatar(["100","100"], "media-object");
            $(div).find('.familytreetop-avatar').html("")
            $(div).find('.familytreetop-avatar').append(avatar);

            Holder.run({
                images:avatar[0]
            });

            return div;
        },
        getContainer: function(){
            return 'body';
        },
        getTemplate:function(){
            var html = '<div class="popover" style="min-width:350px;"><div class="arrow"></div><a style="margin:5px;" class="pull-right" href="#"><i class="icon-eye-open"></a></i><h3 class="popover-title"></h3><div class="popover-content"></div></div>';
            var object = $(html);
            var args = $fn.getLastObject();
            $(object).find('a[class="pull-right"]').click(function(){
                $this.mod('profile').render(args);
            });
            return object;
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
                trigger: 'manual',
                title: $fn.getTitle(),
                content: $fn.getContent(),
                delay: { show: 500, hide: 100 },
                container: $fn.getContainer()
            });
        },
        click: function(args){
            $(args.target).bind('click', function(e){
                if($active == args.target) return false;
                if($active){
                    $('body').unbind('click.familytreetop');
                    $this.hide();
                }
                $active = args.target;
                $(args.target).popover('show');

                $('body').bind('click.familytreetop', function(e){
                    if(!$active) return false;
                    $('body').unbind('click.familytreetop');
                    $this.hide();
                    return false;
                });
                return false;
            });
        }
    }

    $this.render = function(args){
        if("undefined" === typeof(args) || !$fn.setData(args)) return false;
        $(args.target).popover($fn.getOptions(args));
        $fn.click(args);
    }

    $this.hide = function(){
        $($active).popover('hide');
        $active = false;
    }

    $this.mod('tabs').bind('all', function(e){
        $this.hide();
    });
});