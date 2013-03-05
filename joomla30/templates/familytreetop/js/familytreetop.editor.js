$FamilyTreeTop.create("editor", function($){
    'use strict';

    var $this = this,
        $box,
        $tabs,
        $editProfileForm,
        $fn;

    $fn = {

    }

    $box = $('#modal');
    $tabs = $('#editProfileTabs');
    $editProfileForm = $('#formEditProfile');

    $this.addParent = function(gedcom_id){}
    $this.addSpouse = function(gedcom_id){}
    $this.addChild = function(gedcom_id){}


    $this.render = function(gedcom_id){
        var cl = $($box).clone().hide();
        $('body').append(cl);

        $(cl).find('.modal-body').append($tabs);

        var editProfileForm = $($editProfileForm).clone();
        var editProfile = $($tabs).find('.tab-content #editMenuTab1');

        $(editProfile).html();
        $(editProfile).append(editProfileForm);

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