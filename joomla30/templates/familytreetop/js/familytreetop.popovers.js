$FamilyTreeTop.create("popovers", function($){
    'use strict';
    var $this = this, $fn, $th, $pull = [],$cache = {}, $active = false;

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
            if($data.gedcom_id && $data.gedcom_id != null){
                $pull.push({ id: $data.gedcom_id, data: $data });
                if("undefined" === typeof($cache[$data.gedcom_id])){
                    $cache[$data.gedcom_id] = $fn.getLastObject();
                }
                return true;
            }
            return false;
        },
        getObject:function(args){
            var gedcom_id = $(args.target).attr('gedcom_id');
            if("undefined" !== typeof($cache[gedcom_id])){
                return $cache[gedcom_id];
            }
            return false;
        },
        getLastObject:function(){
            if("undefined" !== typeof($pull[$pull.length - 1])){
                return $pull[$pull.length - 1].data;
            }
            return false;
        },
        getTitle:function(args){
            return $fn.getObject(args).object.name();
        },
        getContent:function(args){
            var div = $('#familytreetop-root #popover').clone(),
                cont = $(div).find('[familytreetop-name="content"]'),
                object = $fn.getObject(args).object,
                avatar;

            if(object.facebook_id == 0 && object.isAlive()){
                $(div).find('[familytreetop-name="footer"] button[familytreetop-invite]').show();
            }
            if(object.facebook_id != 0 && object.isAlive()){
                $(div).find('[familytreetop-name="footer"] button[familytreetop="facebook"]').show();
                $(div).find('[familytreetop-name="footer"] button[familytreetop="facebook"]').attr('facebook_id', object.facebook_id);
            }
            $(div).find('[familytreetop-name="footer"] button[familytreetop="profile"]').attr('gedcom_id', object.gedcom_id);

            $(cont).find('li').each(function(index, element){
                var name = $(element).attr('familytreetop-name');
                var value, _value, place;
                if("function" === typeof(object[name])){
                    value = object[name]();
                } else {
                    value = object[name];
                }
                if(value && value != "" ){
                    if(name == 'birth' || name == 'death'){
                        _value = [];
                        _value.push($this.mod('usertree').parseDate(value.date));
                        place = $this.mod('usertree').parsePlace(value.place);
                        if(place != ""){
                            _value.push("(" + place + ")");
                        }
                        value = _value.join("");
                    }
                    $($(element).find('span')[1]).text(value);
                } else {
                    $(element).hide();
                }
            });


            avatar = $fn.getObject(args).object.avatar(["75","75"], "img-polaroid");
            if($this.mod('usertree').isHolderImg(avatar)){
                Holder.run({
                    images:avatar[0]
                });
            }
            $(div).find('.familytreetop-avatar').html("")
            $(div).find('.familytreetop-avatar').append(avatar);
            return div;
        },
        getContainer: function(){
            return 'body';
        },
        getTemplate:function(){
            var object = $('#familytreetop-root .popover').clone();
            return object;
        },
        getPlacement: function(args){
            if("undefined" !== typeof(args.placement)){
                return args.placement;
            }
            var w = Math.floor($(window).width()/2), o = $(args.target).offset();
            if(o.left < w){
                return 'right';
            } else {
                return 'left';
            }
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
                placement: $fn.getPlacement(args),
                trigger: 'manual',
                title: $fn.getTitle(args),
                content: $fn.getContent(args),
                delay: { show: 500, hide: 100 },
                container:  $fn.getContainer(args)
            });
        },
        friendselector: function(args, opt){
            $(opt.content).find('[familytreetop-invite]').click(function(){
                var gedcom_id = $(args.target).attr('gedcom_id');
                $this.mod('friendselector').render(gedcom_id);
            });
        },
        profile: function(args, opt){
            $(opt.content).find('[familytreetop-name="footer"] button[familytreetop="profile"]').click(function(){
                var gedcom_id = $(this).attr('gedcom_id');
                var user = $this.mod('usertree').user(gedcom_id);
                $this.mod('profile').render({
                    target: args.target,
                    gedcom_id: gedcom_id,
                    object: user
                });
            });
        },
        facebook: function(args, opt){
            $(opt.content).find('[familytreetop-name="footer"] button[familytreetop="facebook"]').click(function(){
                var facebook_id = $(this).attr('facebook_id');
                window.open("http://www.facebook.com/"+facebook_id,'_blank');
            });
        },
        click: function(args/*, opt*/){
            $(args.target).bind('click', function(e){
                if($active == args.target) return false;
                if($active){
                    $('body').unbind('click.familytreetop');
                    $this.hide();
                }
                var opt = $fn.getOptions(args);
                $active = args.target;
                $(args.target).popover(opt);
                $(args.target).popover('show');
                $fn.friendselector(args, opt);
                $fn.profile(args, opt);
                $fn.facebook(args, opt);

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
        var options;
        if("undefined" === typeof(args) || !$fn.setData(args)) return false;
        //options = $fn.getOptions(args);
        //$(args.target).popover(options);
        $fn.click(args/*, options*/);
    }

    $this.hide = function(){
        $($active).popover('hide');
        $active = false;
    }

    $this.mod('tabs').bind('all', function(e){
        $this.hide();
    });
});