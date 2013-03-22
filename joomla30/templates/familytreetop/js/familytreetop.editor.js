$FamilyTreeTop.create("editor", function($){
    'use strict';

    var $this = this,
        $fn;

    $fn = {
        setUserMedia: function(parent, ind){
            var dataBox = $('#dataEditMedia').clone(),
                ul = $(dataBox).find('ul');
            $(parent).after(dataBox);

            ind.medias().forEach(function(el, index){
                var li = $('<li><img style="cursor:pointer;" class="img-polaroid" src=""></li>');
                $(li).find('img').attr('src', el.thumbnail_url);
                $(li).attr('data-familytreetop-delete', el.delete_url);
                $(li).data(el);
                $(ul).append(li);
            });

            $(ul).find('li').click(function(){
                if($(this).hasClass('active')) return false;
                $(ul).find('li').removeClass('active');
                $(this).addClass('active');
                var el = $(this).data();
                var data = $this.mod('usertree').getMedia(el.id);

                if(data.role == "AVAT"){
                    $(parent).find('.unset-avatar').show();
                    $(parent).find('.set-avatar').hide();
                    $(parent).find('.unset-avatar').data({data:data, object: this });
                } else {
                    $(parent).find('.unset-avatar').hide();
                    $(parent).find('.set-avatar').show();
                    $(parent).find('.set-avatar').data({data:data, object: this });
                }
                $(parent).find('.delete').show();
                $(parent).find('.delete').data({data:data, object: this });
            });

            $(parent).find('.set-avatar').click(function(){
                var ret = $(this).data();
                $this.ajax('editor.setAvatar', ret.data, function(){
                    $(parent).find('.unset-avatar').show();
                    $(parent).find('.set-avatar').hide();
                    $(parent).find('.unset-avatar').data(ret.data);
                    $this.mod('usertree').setAvatar(ret.data.gedcom_id, ret.data.id);
                });
            });

            $(parent).find('.unset-avatar').click(function(){
                var ret = $(this).data();
                $this.ajax('editor.unsetAvatar', ret.data, function(){
                    $(parent).find('.unset-avatar').hide();
                    $(parent).find('.set-avatar').show();
                    $(parent).find('.set-avatar').data(ret.data);
                    $this.mod('usertree').unsetAvatar(ret.data.gedcom_id, ret.data.id);
                });
            });

            $(parent).find('.delete').click(function(){
                var ret = $(this).data();
                $this.ajax('editor.deletePhoto', ret.data, function(){
                    $(parent).find('.unset-avatar').hide();
                    $(parent).find('.set-avatar').hide();
                    $(parent).find('.delete').hide();
                    $(ret.object).removeClass('active');
                    $(ret.object).remove();
                    $this.mod('usertree').mediaRemove(ret.data.id);
                });
            });

            $(parent).fileupload({
                formData:{gedcom_id: ind.gedcom_id}
            });

            return true;
        },
        setUnionsData:function(parent, ind){
            var spouses = $this.mod('usertree').getSpouses(ind.gedcom_id), forms = [];
            spouses.forEach(function(spouse_id){
                var form = $fn.getEditorUnionsForm(),
                    form_id = $(form).attr('id'),
                    spouse = $this.mod('usertree').user(spouse_id),
                    family_id = $this.mod('usertree').getFamilyIdByPartners(ind.gedcom_id, spouse_id);

                $(form).find('input[familytreetop="family_id"]').val(family_id);
                $(form).attr('familytreetop', form_id + forms.length);
                $fn.setMonths(form);
                $fn.setDays(form);

                setUnion(form, 'sircar', ind);
                setUnion(form, 'spouse', spouse);
                setEvent(form, family_id);

                $fn.setFormInTab(1, parent, form);
            });
            return forms;
            function setUnion(form, type, ind){
                var el = $(form).find('[familytreetop="'+type+'"]');
                $(el).find('legend').text(ind.shortname());
            }
            function setEvent(form, family_id){
                var event;
                if(!family_id) return false;
                if(event = $this.mod('usertree').getFamilyEvent(family_id)){
                    if(event.place){
                        $(form).find('[familytreetop="city"]').val(event.place.city);
                        $(form).find('[familytreetop="state"]').val(event.place.state);
                        $(form).find('[familytreetop="country"]').val(event.place.country);
                    }
                    if(event.date){
                        $(form).find('[familytreetop="days"] option[value="'+event.date.start_day+'"]').attr('selected', 'selected');
                        $(form).find('[familytreetop="months"] option[value="'+event.date.start_month+'"]').attr('selected', 'selected');
                        $(form).find('[familytreetop="year"]').val(event.date.start_year);
                    }
                }
            }
        },
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
                                            if(event.date && event.date.start_year != null){
                                                $(el).val(event.date.start_year);
                                            }
                                            break;

                                        case "city":
                                        case "state":
                                        case "country":
                                            if(event.place && event.place[n[1]] != null){
                                                $(el).val(event.place[n[1]]);
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
                                            if(event.date){
                                                var start = event.date['start_' + n[1]];
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
        setSpouseSelect:function(form , ind){
            var parent = $(form).find('[familytreetop="gender"]').parent();
            var spouses = $this.mod('usertree').getSpouses(ind.gedcom_id);
            var sb = $this.stringBuffer();
            sb._('<div class="row-fluid">');
                sb._('<div familytreetop="spouse" class="span12">');
                    sb._('<label for="editProfile[spouse]">Spouse</label>');
                    sb._('<select id="editProfile[spouse]" name="editProfile[spouse]">');
                        spouses.forEach(function(spouse_id){
                            var spouse = $this.mod('usertree').user(spouse_id);
                            sb._('<option value="')._(spouse_id)._('">')._(spouse.name())._('</option>');
                        });
                    sb._('</select>');
                sb._('</div>');
            sb._('</div>');
            $(parent).before(sb.ret());
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
        getEditorMediaForm: function(){
            return $('#formEditMedia').clone();
        },
        getEditorProfileForm:function(){
            return $('#formEditProfile').clone();
        },
        getEditorUnionsForm:function(){
            return $('#formEditUnions').clone();
        },
        getArgs:function(parent, activeTab, ind){
            var forms = [
                "#formEditProfile",
                "#formEditUnions"
                ];
            var args = {length:0};
            $(parent).find('form' + forms[activeTab]).each(function(i,e){
                args['form'+args.length]= getArray(e);
                args.length++;
            });
            return args;
            function getArray(form){
                var a = $(form).serializeArray();
                a.push({name:'gedcom_id', value:ind.gedcom_id});
                return a;
            }
        },
        submit:function(cl, ind, task){
            if(arguments.length)
            var tasks = [
                'editor.updateUserInfo',
                'editor.updateUnionsInfo'
            ];
            $(cl).find('button[familytreetop="submit"]').click(function(){
                var args, send, activeTab;
                if("undefined" === typeof(task)){
                    activeTab = $(cl).find('.nav.nav-tabs li.active a').attr('href').split('_')[1];
                    if("undefined" === typeof(tasks[activeTab])) return false;
                    send = tasks[activeTab];
                    args = $fn.getArgs(cl, activeTab, ind);
                } else {
                    args = $fn.getArgs(cl, 0, ind);
                    send = task;
                }
                $this.ajax(send, args, function(response){
                    console.log(response);
                    $this.mod('usertree').update(response);
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

        if(type == "addChild"){
            $fn.setSpouseSelect(editProfileForm, ind);
        }

        //set title
        $(cl).find('#modalLabel').text("Add " + type.split('add')[1]);
        //set tabs
        $(cl).find('.modal-body').append(editProfileForm);

        //init modal
        $(cl).modal();

        //event submit
        $fn.submit(cl, ind, 'editor.'+type);
    }

    $this.render = function(gedcom_id){
        var cl,
            tabs,
            ind,
            editProfileForm,
            editUnionsForms,
            editMediaForm;

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
        editUnionsForms = $fn.setUnionsData(tabs, ind);

        //media edit
        editMediaForm = $fn.getEditorMediaForm();
        $fn.setFormInTab(2, tabs, editMediaForm);
        $fn.setUserMedia(editMediaForm, ind);

        //options

        //init modal
        $(cl).modal();

        // event submit
        $fn.submit(cl, ind);
    }
});