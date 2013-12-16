$FamilyTreeTop.create("popovers", function($){
    'use strict';
    var $this = this, $fn, $th, $cache = {}, $active = false;

    $th = {
        target: false,
        gedcom_id: false,
        object: false
    }

    $fn = {
        setData:function(args){
            var $data = $.extend({}, $th), guid;
            $data.gedcom_id = $(args.target).attr('gedcom_id');
            $data.object = $this.mod('usertree').user($data.gedcom_id);
            if($data.gedcom_id && $data.gedcom_id != null){
                guid = $this.guid();
                $(args.target).data('guid', guid);
                $cache[guid] = { id: $data.gedcom_id, data: $data, args: args };
                return true;
            }
            return false;
        },
        getCacheObject:function(object){
            var data = $(object).data();
            if("undefined" !== typeof(data.guid) && "undefined" !== typeof($cache[data.guid])){
                return $cache[data.guid];
            }
            return false;
        },
        getTitle:function(cache){
            return cache.data.object.name();
        },
        getContent:function(cache){
            var div = $('#familytreetop-root #popover').clone(),
                cont = $(div).find('[familytreetop-name="content"]'),
                object = cache.data.object,
                avatar;

            if(object.isCanBeInvite()){
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


            avatar = object.avatar(["75","75"], "img-polaroid");
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
        getPlacement: function(cache){
            if("undefined" !== typeof(cache.args.placement)){
                return cache.args.placement;
            }
            var w = Math.floor($(window).width()/2), o = $(cache.args.target).offset();
            if(o.left < w){
                return 'right';
            } else {
                if(o.left > w){
                    return 'left';
                } else {
                    return 'right';
                }
            }
        },
        getOptions: function(cache){
            var options;
            if("undefined" === typeof(cache.args.options)){
                options = {};
            } else {
                options = cache.args.options;
            }
            return $.extend({}, options, {
                html: true,
                template: $fn.getTemplate(),
                selector: false,
                placement: $fn.getPlacement(cache),
                trigger: 'manual',
                title: $fn.getTitle(cache),
                content: $fn.getContent(cache),
                delay: { show: 500, hide: 100 },
                container:  $fn.getContainer(cache)
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
        click: function(args){
            $(args.target).bind('click', function(e){
                var cache = $fn.getCacheObject(this);
                if(!cache) return false;
                if($active == cache.args.target) return false;
                if($active){
                    $('body').unbind('click.familytreetop');
                    $this.hide();
                }
                var opt = $fn.getOptions(cache);
                $active = cache.args.target;
                $(cache.args.target).popover(opt);
                $(cache.args.target).popover('show');
                $fn.friendselector(cache.args, opt);
                $fn.profile(cache.args, opt);
                $fn.facebook(cache.args, opt);

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
        $fn.click(args);
    }

    $this.hide = function(){
        $($active).popover('hide');
        $($active).popover('destroy');
        $active = false;
    }

    $this.mod('tabs').bind('all', function(e){
        $this.hide();
    });
});