$FamilyTreeTop.create("editor", function($){
    'use strict';

    var $this = this,
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
                        if("undefined" !== typeof(val)){
                            $(el).find('option[value="'+val+'"]').attr('selected', 'selected');
                        }
                        break;

                    default: break;
                }
            });
        },
        setFormInTab:function(selector, form){
            var tab =   $('#editProfileTabs .tab-content '+ selector);
            $(tab).html('');
            $(tab).append(form);
        },
        getModalBox:function(){
            var cl = $('#modal').clone().hide();
            $('body').append(cl);
            $(cl).on('hide', function(){
                $(cl).remove();
            });
            return cl;
        },
        getEditorProfileForm:function(){
            return $('#formEditProfile').clone();
        },
        getArgs:function(parent, ind){
            var arr = $(parent).find('form').serializeArray();
            arr.push({name:'gedcom_id', value:ind.gedcom_id});
            return arr;
        }
    }

    $this.addParent = function(gedcom_id){}
    $this.addSpouse = function(gedcom_id){}
    $this.addChild = function(gedcom_id){}


    $this.render = function(gedcom_id){
        var cl, ind, editProfileForm;

        //create modal box
        cl = $fn.getModalBox();

        //get user data
        ind = $this.mod('usertree').user(gedcom_id);

        //set title
        $(cl).find('#modalLabel').text(ind.name());
        //set tabs
        $(cl).find('.modal-body').append($('#editProfileTabs'));

        //profile edit
        editProfileForm = $fn.getEditorProfileForm();
        $fn.setFormInTab('#editMenuTab1', editProfileForm);
        $fn.setUserData(editProfileForm, ind);

        //unions edit
        //media edit
        //options

        //init modal
        $(cl).modal();
        $(cl).find('button[familytreetop="submit"]').click(function(){
            $this.ajax('editor.updateUserInfo', $fn.getArgs(cl, ind), function(response){
                console.log(response);
                $(cl).modal('hide');
            });
        });
    }
});