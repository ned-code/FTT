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
        var box, ind, user, isCantEditable = false, isCantUnionDelete = false, isCantDelete = false, isRegistered = false, isInLaw = false, lis;

        box = $($box).clone().attr('gedcom_id', gedcom_id)
            .attr('style', 'position: absolute; top: 5px; right:5px;');

        ind = $this.mod('usertree').user(gedcom_id);
        user = $this.mod('usertree').usermap();
        isRegistered = ind.isRegistered();
        isInLaw = (ind.inLaw || ind.relationId == 2 || ind.relationId == 0);


        if( (isRegistered && user.gedcom_id != ind.gedcom_id) || isInLaw){
            $(box).find('li[familytreetop="edit"]').remove();
            $(box).find('[data-familytreetop-devider="1"]').remove();
            isCantEditable = true;
        }

        if(isInLaw){
            if(!$this.mod('usertree').isCommonAncestorExist(ind.gedcom_id, user.gedcom_id)){
                $(box).find('li[familytreetop="deleteUnion"]').remove();
                isCantUnionDelete = true;
            }
            if(!ind.isCanBeDelete()){
                $(box).find('li[familytreetop="delete"]').remove();
                isCantDelete = true;
            }
            if(isCantUnionDelete && isCantDelete){
                $(box).find('li[familytreetop-devider="delete"]').remove();
            }
            $(box).find('li[familytreetop="addParent"]').remove();
            $(box).find('li[familytreetop="addSibling"]').remove();
            $(box).find('li[familytreetop="addSpouse"]').remove();

            if(!ind.isSpouse()){
                $(box).find('li[familytreetop="addChild"]').remove();
            }

            if(ind.facebook_id == 0 && ind.isAlive()){
                $(box).find('li[familytreetop-devider="sendInvite"]').remove();
                $(box).find('li[familytreetop="sendInvite"]').remove();
            }
        } else {
            $(box).find('li[familytreetop="deleteUnion"]').remove();
            if(ind.isParentsExist()){
                $(box).find('li[familytreetop="addParent"]').remove();
            }

            if(!ind.isCanBeInvite()){
               $(box).find('li[familytreetop-devider="sendInvite"]').remove();
               $(box).find('li[familytreetop="sendInvite"]').remove();
            }

           if(!ind.isCanBeDelete()){
                $(box).find('li[familytreetop-devider="delete"]').remove();
                $(box).find('li[familytreetop="delete"]').remove();
           }
        }

        if($(box).find('li').length == 0) return false;
        if($(box).find('li:not(.divider)').length == 1){
            $(box).find('.divider').remove();
        }

        $(object).append(box);
        $(box).find('li').click(function(){
            $fn.click.call(this, gedcom_id);
            return false;
        });
    }

});