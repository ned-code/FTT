$FamilyTreeTop.create("profile", function($){
    'use strict';
    var $this = this, $fn, $box;

    $fn = {
        setAbout:function(args){
            var box = $(this).find('[data-familytreetop-profile="about"] fieldset'), avatar;
            avatar = args.object.avatar(["100","100"]);
            $(box).find('li').each(function(index, element){
                var names = ["first_name", "middle_name", "last_name", "know_as"];
                var value = args.object[names[index]];
                if(value != null && value.length != 0){
                    $(element).find('span').text(args.object[names[index]]);
                } else {
                    $(element).remove();
                }
            });
            $(box).find('[data-familytreetop="avatar"]').append(avatar);
            Holder.run({
                images:avatar[0]
            })
        },
        setRelation:function(args){

        },
        setFamily:function(args){
            var box = $(this).find('[data-familytreetop-profile="family"] fieldset');
            $this.mod('families').render({
                parent: box,
                gedcom_id: args.object.gedcom_id,
                abilityToMove: false,
                editable: false,
                iconHome: false
            });
        },
        setPhotos:function(args){
            var ul = $(this).find('[data-familytreetop-profile="photos"] fieldset ul');
            args.object.medias().forEach(function(el, index){
                var li = $('<li><img style="cursor:pointer;" class="img-polaroid" src=""></li>');
                $(li).find('img').attr('src', el.thumbnail_url);
                $(li).attr('data-familytreetop-delete', el.delete_url);
                $(li).data(el);
                $(ul).append(li);
            });

            if(args.object.facebook_id){
                FB.api('/'+args.object.facebook_id+'/photos', function(response){
                    if(response.data.length == 0){
                        return false;
                    }
                    console.log(response);
                });
            }
        }
    }

    $box = $('#profile');

    $this.render = function(args){
        var parent = $($box).clone(), object = args.object;

        $(parent).find('#profileLabel').text(object.shortname());

        $fn.setAbout.call(parent, args);
        $fn.setRelation.call(parent, args);
        $fn.setFamily.call(parent, args);
        $fn.setPhotos.call(parent, args);

        $(parent).modal();
    }

});