$FamilyTreeTop.create("profile", function($){
    'use strict';
    var $this = this, $fn, $box;

    $fn = {
        isConnectionTarget: function(args, node){
            var con = $this.mod('usertree').getConnection(args.object.gedcom_id);
            if(node.data.usr.gedcom_id == con[con.length - 1]){
                return true;
            }
            return false;
        },
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
            var box = $(this).find('[data-familytreetop-profile="relation"] fieldset');
            var id = "jit"+$this.generateKey();
            $(box).attr('id', id);
            $(box).height(tree[1]*80 + 100);
            var st = new $jit.ST({
                injectInto: id,
                duration: 800,
                transition: $jit.Trans.Quart.easeInOut,
                offsetX:0,
                offsetY:tree[1]*50,
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
                    label.innerHTML = $fn.getLabelHtml(label,node);
                    $(label).width(140);
                    $(label).height(40);
                    $(label).addClass('text-center');
                    if($fn.isConnectionTarget(args, node)){
                        node.data.$color = "#ffc90e";
                    }
                }
            });
            st.loadJSON(tree[0]);
            st.compute();
            st.select(st.root);
            st.switchPosition("top", "replot", function(){});
        },
        setFamily:function(args){
            var box = $(this).find('[data-familytreetop-profile="family"] fieldset'), familyBox = $('<div style="position:relative;"></div>');
            $(box).append(familyBox);
            $this.mod('families').render({
                parent: familyBox,
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
            if(/*args.object.facebook_id*/true){
                FB.api('/'+args.object.facebook_id+'/albums', function(albums){
                   var data = albums.data;
                   $(data).each(function(i, album){
                       FB.api('/'+album.id+'/photos', function(photos){
                           var d = photos.data;
                           $(d).each(function(i, photo){
                               var li = $('<li><img style="cursor:pointer;" class="img-polaroid" src=""></li>');
                               $(li).find('img').attr('src', photo.picture);
                               $(ul).append(li);
                           });
                       });
                   });
                });
            }
        },
        getLabelHtml:function(label, node){
            var user = node.data.usr, box = $('<div class="text-center"></div>');
            $(box).append('<div>'+user.shortname()+'</div>');
            $(box).append('<div>'+user.relation+'</div>');
            return $(box).html();
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