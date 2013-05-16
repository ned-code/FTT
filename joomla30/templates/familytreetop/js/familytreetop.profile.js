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
            var tree = args.object.relationMap();
            console.log(tree);
            var box = $(this).find('[data-familytreetop-profile="relation"] fieldset');
            var id = "jit"+$this.generateKey();
            $(box).attr('id', id);
            $(box).height(tree[1]*60 + 100);
            var st = new $jit.ST({
                injectInto: id,
                duration: 800,
                transition: $jit.Trans.Quart.easeInOut,
                offsetX:0,
                offsetY:tree[1]*30,
                levelDistance: 30,
                levelsToShow: tree[1],
                Node: {
                    height: 40,
                    width: 140,
                    type: 'rectangle',
                    color: '#efe4b0',
                    overridable: true
                },
                Edge: {
                    type: 'bezier',
                    overridable: true
                },
                onCreateLabel: function(label, node){
                    label.id = node.id;
                    label.innerHTML = node.data.usr.relation;
                }
            });
            st.loadJSON(tree[0]);
            st.compute();
            st.select(st.root);
            st.switchPosition("top", "replot", function(){});
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
                    if(response.error) return false;
                    if(response.data.length == 0){
                        return false;
                    }
                    $(response.data).each(function(el, index){
                        var li = $('<li><img style="cursor:pointer;" class="img-polaroid" src=""></li>');
                        $(li).find('img').attr('src', el.picture);
                        $(ul).append(li);
                    });
                });
            }
        },
        getModalBox:function(){
            var cl = $($box).clone().hide();
            $('body').append(cl);
            $(cl).on('hide', function(){
                $(cl).remove();
            });
            return cl;
        }
    }

    $box = $('#profile');

    $this.render = function(args){
        var parent = $fn.getModalBox(), object = args.object;

        $(parent).find('#profileLabel').text(object.shortname());

        $fn.setAbout.call(parent, args);
        $(parent).on('shown', function(){
            $fn.setRelation.call(parent, args);
        });
        $fn.setFamily.call(parent, args);
        $fn.setPhotos.call(parent, args);

        $(parent).modal({dynamic:true});

    }

});