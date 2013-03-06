$FamilyTreeTop.create("editor", function($){
    'use strict';

    var $this = this,
        $box,
        $tabs,
        $editProfileForm,
        $fn;

    $fn = {
        setUserData:function(parent, ind){
            $(parent).find('input,select').each(function(index, el){
                var name = $(el).attr('name').match(/\[(\w+)\]/i);
                switch($(el).prop('tagName')){
                    case "INPUT":
                        if($(el).attr('type') != 'file'){
                            if( (/^b_|d_/i).test(name[1])){
                                //events
                            } else {
                                $(el).val(ind[name[1]]);
                            }
                        }
                        break;

                    case "SELECT":
                        var val = ind[name[1]];
                        //console.log(name[1], val);
                        if("undefined" !== typeof(val)){
                            $(el).find('option[value="'+val+'"]').attr('selected', 'selected');
                        }
                        break;

                    default: break;
                }
            });
        },
        getArgs:function(parent, ind){
            var arr = $(parent).find('form').serializeArray();
            arr.push({name:'gedcom_id', value:ind.gedcom_id});
            return arr;
        }
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

        var ind = $this.mod('usertree').user(gedcom_id);
        $(cl).find('#modalLabel').text(ind.name());
        $(cl).find('.modal-body').append($tabs);

        //profile edit
        var editProfileForm = $($editProfileForm).clone();
        var editProfile = $($tabs).find('.tab-content #editMenuTab1');

        $(editProfile).html('');
        $(editProfile).append(editProfileForm);

        $fn.setUserData(editProfileForm, ind);

        //unions edit
        //media edit

        //options




        $(cl).modal();
        $(cl).on('hide', function(){
            $(cl).remove();
        });
        $(cl).find('button[familytreetop="submit"]').click(function(){
            $this.ajax('editor.updateUserInfo', $fn.getArgs(cl, ind), function(response){
                console.log(response);
                $(cl).modal('hide');
            });
        });
    }
});