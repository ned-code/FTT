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

                case "deleteUnion":
                    console.log('deleteUnion');
                    break;

                case "delete":
                    $this.mod('editor').render(gedcom_id, 4);
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
        var box, ind, user, cdelete = 0, isRegistered;

        box = $($box).clone().attr('gedcom_id', gedcom_id)
            .attr('style', 'position: absolute; top: 5px; right:5px;');

        ind = $this.mod('usertree').user(gedcom_id);
        user = $this.mod('usertree').usermap();
        isRegistered = ind.isRegistered();

        if(isRegistered && user.gedcom_id != ind.gedcom_id){
            $(box).find('li[familytreetop="edit"]').remove();
        }

        if(ind.inLaw || ind.relationId == 2){
            if(!$this.mod('usertree').isCommonAncestorExist(ind.gedcom_id, user.gedcom_id)){
                $(box).find('li[familytreetop="deleteUnion"]').remove();
                cdelete++
            }
            if(!ind.isCanBeDelete()){
                $(box).find('li[familytreetop="delete"]').remove();
                cdelete++;
            }
            if(cdelete == 2){
                $(box).find('li[familytreetop-devider="delete"]').remove();
            }
            $(box).find('[data-familytreetop-devider="1"]').remove();
            $(box).find('li[familytreetop="addParent"]').remove();
            $(box).find('li[familytreetop="addSibling"]').remove();
            $(box).find('li[familytreetop="addSpouse"]').remove();
            $(box).find('li[familytreetop="addChild"]').remove();
        } else {
            $(box).find('li[familytreetop="deleteUnion"]').remove();
            if(ind.isParentsExist()){
                $(box).find('li[familytreetop="addParent"]').remove();
            }

            if(isRegistered){
               $(box).find('li[familytreetop-devider="sendInvite"]').remove();
               $(box).find('li[familytreetop="sendInvite"]').remove();
            }

           if(!ind.isCanBeDelete()){
                $(box).find('li[familytreetop-devider="delete"]').remove();
                $(box).find('li[familytreetop="delete"]').remove();
           }
        }

        $(object).append(box);
        $(box).find('li').click(function(){
            $fn.click.call(this, gedcom_id);
            return false;
        });
    }

});