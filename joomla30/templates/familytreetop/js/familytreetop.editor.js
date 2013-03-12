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
                                var n = name[1].split('_');
                                var event = ind[(n[0] == "b")?'birth':'death']();
                                if(event){
                                    switch(n[1]){
                                        case "year":
                                            if("undefined" !==  typeof(event[2])&& event[2].start_year != null){
                                                $(el).val(event[2].start_year);
                                            }
                                            break;

                                        case "city":
                                        case "state":
                                        case "country":
                                            if("undefined" !== typeof(event[1]) && event[1][n[1]] != null){
                                                $(el).val(event[1][n[1]]);
                                            }
                                            break;
                                    }
                                }
                            } else {
                                $(el).val(ind[name[1]]);
                            }
                        }
                        break;

                    case "SELECT":
                        var val = ind[name[1]];
                        if("undefined" !== typeof(val)){
                            $(el).find('option[value="'+val+'"]').attr('selected', 'selected');
                        } else {
                            if( (/^b_|d_/i).test(name[1])){
                                var n = name[1].split('_');
                                var event = ind[(n[0] == "b")?'birth':'death']();
                                if(event){
                                    switch(n[1]){
                                        case "month":
                                        case "day":
                                            if("undefined" !==  typeof(event[2])){
                                                var start = event[2]['start_' + n[1]];
                                                $(el).data({value:start});
                                            }
                                            break;
                                    }
                                }
                            } else if(name[1] == "living"){
                                if(ind.isAlive()){
                                    $(parent).find('[familytreetop="deathday"]').hide();
                                } else {
                                    $(el).find('option[value="0"]').attr('selected', 'selected');
                                }
                            }
                        }
                        break;

                    default: break;
                }
            });
        },
        setFormInTab:function(num, tabs, form){
            var tab =   $(tabs[0]).find('.tab-content #'+ tabs[1][num]);
            $(tab).append(form);
        },
        setLiving:function(editProfileForm){
            $(editProfileForm).find('[familytreetop="living"]').change(function(){
                var selected = $(this).find('option:selected').val();
                if(parseInt(selected)){
                    $(editProfileForm).find('[familytreetop="deathday"]').hide();
                } else {
                    $(editProfileForm).find('[familytreetop="deathday"]').show();
                }
            });
        },
        setDays:function(editProfileForm){
            $(editProfileForm).find('[familytreetop="days"]').each(function(index, el){
                var data = $(el).data();
                var month = $(el).parent().find('[familytreetop="months"] option:selected').val();
                var year = $(el).parent().find('[familytreetop="year"]').val();
                $(el).append($this.mod('form').select.days(month, year));
                if("undefined" !== typeof(data.value) && data.value != null){
                    $(el).find('option[value="'+data.value+'"]').attr('selected', 'selected');
                }
            });
        },
        setMonths:function(editProfileForm){
            $(editProfileForm).find('[familytreetop="months"]').each(function(index, el){
                var data = $(el).data();
                if("undefined" !== typeof(data.value) && data.value != null){
                    $(el).find('option[value="'+data.value+'"]').attr('selected', 'selected');
                }
                $(el).change(function(){
                    var month = $(this).find('option:selected').val();
                    var year = $(this).parent().find('[familytreetop="year"]').val();
                    $(this).parent().find('[familytreetop="days"] option[value!=0]').remove();
                    $(this).parent().find('[familytreetop="days"]').append($this.mod('form').select.days(month, year));
                });
            });
        },
        getModalBox:function(){
            var cl = $('#modal').clone().hide();
            $('body').append(cl);
            $(cl).on('hide', function(){
                $(cl).remove();
            });
            return cl;
        },
        getTabs:function(){
            var tabs, links, conts, crosslinks;

            tabs = $('#editorTabs').clone();
            links = $(tabs).find('.nav.nav-tabs li a');
            conts = $(tabs).find('.tab-content .tab-pane');
            crosslinks = [];

            $(conts).each(function(index, el){
                var key = $this.generateKey() + '_' + index;
                crosslinks.push(key);
                $(links[index]).attr('href', '#' + key);
                $(el).attr('id', key);
            });

            $(tabs).find('a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            })

            return [tabs, crosslinks];
        },
        getEditorProfileForm:function(){
            return $('#formEditProfile').clone();
        },
        getArgs:function(parent, ind){
            var arr = $(parent).find('form').serializeArray();
            arr.push({name:'gedcom_id', value:ind.gedcom_id});
            return arr;
        },
        submit:function(task, cl, ind){
            $(cl).find('button[familytreetop="submit"]').click(function(){
                $this.ajax(task, $fn.getArgs(cl, ind), function(response){
                    $(cl).modal('hide');
                });
            });
        }
    }

    $this.add = function(type, gedcom_id){
        var cl, ind, editProfileForm;

        //create modal box;
        cl = $fn.getModalBox();

        //get user data
        ind = $this.mod('usertree').user(gedcom_id);

        //get form
        editProfileForm = $fn.getEditorProfileForm();

        $fn.setLiving(editProfileForm);
        $fn.setMonths(editProfileForm);
        $fn.setDays(editProfileForm);

        if(ind.isAlive()){
            $(editProfileForm).find('[familytreetop="deathday"]').hide();
        }

        //set title
        $(cl).find('#modalLabel').text("Add " + type.split('add')[1]);
        //set tabs
        $(cl).find('.modal-body').append(editProfileForm);

        //init modal
        $(cl).modal();

        //event submit
        $fn.submit('editor.'+type, cl, ind);
    }

    $this.render = function(gedcom_id){
        var cl, tabs, ind, editProfileForm;

        //create modal box
        cl = $fn.getModalBox();

        //create tabs
        tabs = $fn.getTabs()

        //get user data
        ind = $this.mod('usertree').user(gedcom_id);

        //set title
        $(cl).find('#modalLabel').text(ind.name());
        //set tabs
        $(cl).find('.modal-body').append(tabs[0]);

        //profile edit
        editProfileForm = $fn.getEditorProfileForm();
        $fn.setFormInTab(0, tabs, editProfileForm);
        $fn.setUserData(editProfileForm, ind);

        $fn.setLiving(editProfileForm);
        $fn.setMonths(editProfileForm);
        $fn.setDays(editProfileForm);

        //unions edit
        //media edit
        //options

        //init modal
        $(cl).modal();

        // event submit
        $fn.submit('editor.updateUserInfo', cl, ind);
    }
});