$FamilyTreeTop.create("editmenu", function($){
    'use strict';

    var $this = this,
        $box,
        $fn;

    $fn = {
        click:function(gedcom_id){
            var id = $(this).attr('familytreetop');
            switch(id){
                case "edit":
                    $this.mod('editor').render(gedcom_id);
                    break;

                case "addParent":
                case "addSibling":
                case "addSpouse":
                case "addChild":
                    $this.mod('editor').add(id, gedcom_id);
                    break;

                case "delete":
                    break;

                case "sendInvite":
                    $this.mod('friendselector').render(gedcom_id);
                    break;
                default: return false;
            }
        }
    }

    $box = $('#editMenu');


    $this.render = function(object, gedcom_id){
        var box, ind;

        box = $($box).clone().attr('gedcom_id', gedcom_id)
            .attr('style', 'position: absolute; top: 5px; right:5px;');



        ind = $this.mod('usertree').user(gedcom_id);

        if(ind.isParentsExist()){
            $(box).find('li[familytreetop="addParent"]').remove();
        }

        if(ind.isRegistered()){
           $(box).find('li[familytreetop-devider="sendInvite"]').remove();
           $(box).find('li[familytreetop="sendInvite"]').remove();
        }

       if(!ind.isCanBeDelete()){
            $(box).find('li[familytreetop-devider="delete"]').remove();
            $(box).find('li[familytreetop="delete"]').remove();
        }

        $(object).append(box);
        $(box).find('li').click(function(){
            $fn.click.call(this, gedcom_id);
            return false;
        });
    }

});