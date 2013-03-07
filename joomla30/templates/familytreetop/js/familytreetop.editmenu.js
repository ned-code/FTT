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
                    $this.mod('editor').addParent(gedcom_id);
                    break;

                case "delete":
                    break;
                default: return false;
            }
        }
    }

    $box = $('#editMenu');


    $this.render = function(object, gedcom_id){
        var box = $($box).clone().attr('gedcom_id', gedcom_id)
            .attr('style', 'position: absolute; top: 5px; right:5px;');
        $(object).parent().append(box);
        $(box).find('li').click(function(){
            $fn.click.call(this, gedcom_id);
            return false;
        });
    }

});