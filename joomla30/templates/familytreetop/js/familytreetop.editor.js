$FamilyTreeTop.create("editor", function($){
    'use strict';

    var $this = this,
        $box,
        $fn;

    $fn = {

    }

    $box = $('#modal');

    $this.render = function(gedcom_id){
        var cl = $($box).clone().hide();
        $('body').append(cl);

        var ind = $this.mod('usertree').user(gedcom_id);
        $(cl).find('#modalLabel').text(ind.name());
        $(cl).find('.modal-body #firstName').val(ind.first_name);
        $(cl).find('.modal-body #middleName').val(ind.middle_name);
        $(cl).find('.modal-body #lastName').val(ind.last_name);
        $(cl).find('.modal-body #knowAs').val(ind.know_as);

        $(cl).modal();
        $(cl).on('hide', function(){
            $(cl).remove();
        });
        $(cl).find('button[familytreetop="submit"]').click(function(){
            console.log(this);
            $(cl).modal('hide');
        });

    }
});