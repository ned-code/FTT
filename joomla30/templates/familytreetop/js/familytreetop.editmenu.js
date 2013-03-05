$FamilyTreeTop.create("editmenu", function($){
    'use strict';

    var $this = this,
        $box,
        $fn;

    $fn = {

    }

    $box = $('#editMenu');


    $this.render = function(object, gedcom_id){
        var box = $($box).clone().attr('gedcom_id', gedcom_id)
            .attr('style', 'position: absolute; top: 5px; right:5px;');
        $(object).parent().append(box);
    }

});