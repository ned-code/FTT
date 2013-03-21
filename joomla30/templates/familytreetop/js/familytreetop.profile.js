$FamilyTreeTop.create("profile", function($){
    'use strict';
    var $this = this, $fn, $box;

    $fn = {
        setAbout:function(args){
            var box = $(this).find('[data-familytreetop-profile="about"] fieldset'), avatar;
            avatar = args.object.avatar(["100","100"]);
            $(box).find('li').each(function(index, element){
                var names = ["first_name", "middle_name", "last_name", "know_as"];
                $(element).find('span').text(args.object[names[index]]);
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