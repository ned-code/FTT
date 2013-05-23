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
                cont = $(div).find('[familytreetop-name="content"]'),
                object = $fn.getLastObject().object,
                avatar;

            if(object.facebook_id == 0){
                $(div).find('[familytreetop-name="footer"]').show();
            }

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


            avatar = $fn.getLastObject().object.avatar(["75","75"], "media-object");
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
            var object = $('#familytreetop-root .popover').clone();
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
                container:  $fn.getContainer()
            });
        },
        friendselector: function(args, opt){
            $(opt.content).find('[familytreetop-invite]').click(function(){
                var gedcom_id = $(args.target).attr('gedcom_id');
                $this.mod('friendselector').render(gedcom_id);
            });
        },
        click: function(args, opt){
            $(args.target).bind('click', function(e){
                if($active == args.target) return false;
                if($active){
                    $('body').unbind('click.familytreetop');
                    $this.hide();
                }
                $active = args.target;
                $fn.friendselector(args, opt);
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
        var options;
        if("undefined" === typeof(args) || !$fn.setData(args)) return false;
        options = $fn.getOptions(args);
        $(args.target).popover(options);
        $fn.click(args, options);
    }

    $this.hide = function(){
        $($active).popover('hide');
        $active = false;
    }

    $this.mod('tabs').bind('all', function(e){
        $this.hide();
    });
});