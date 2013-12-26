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
        var box, ind, first;

        box = $($box).clone().attr('gedcom_id', gedcom_id)
            .attr('style', 'position: absolute; top: 5px; right:5px;');

        ind = $this.mod('usertree').user(gedcom_id);

        if(!ind.isCanBeEdit()){
            $(box).find('[familytreetop="edit"]').remove();
            $(box).find('[data-familytreetop-devider="1"]').remove();
        }

        if(!ind.isCanBeInvite()){
            $(box).find('[data-familytreetop-devider="3"]').remove();
            $(box).find('[familytreetop="sendInvite"]').remove();
        }

        $(box).find('[familytreetop="deleteUnion"]').remove();

        if(ind.inLaw){
            $(box).find('[data-familytreetop-devider="1"]').remove();
            $(box).find('[familytreetop="addParent"]').remove();
            $(box).find('[familytreetop="addSibling"]').remove();
            $(box).find('[familytreetop="addSpouse"]').remove();
            $(box).find('[familytreetop="addChild"]').remove();
        } else {
            if(ind.isParentsExist()){
                $(box).find('[familytreetop="addParent"]').remove();
            }
            if(ind.isSpouse()){
                $(box).find('[familytreetop="addParent"]').remove();
                $(box).find('[familytreetop="addSibling"]').remove();
                $(box).find('[familytreetop="addSpouse"]').remove();
            }
        }

        if(!ind.isCanBeDelete()){
            $(box).find('[data-familytreetop-devider="2"]').remove();
            $(box).find('[familytreetop="delete"]').remove();
        }

        if($(box).find('li').length == 0){
            return false;
        } else {
            first = $(box).find('li').first();
            if($(first).hasClass('divider')){
                $(first).remove();
            }
        }

        $(object).append(box);
        $(box).find('li').click(function(){
            $fn.click.call(this, gedcom_id);
            return false;
        });
    }

});