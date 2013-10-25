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
        setOptions: function(parent, ind, callback){
            if(_isOwner_(ind)){
                if(_getUsersInTreeCount_() == 1){
                    _hideButtons_();
                    _showDeleteTreeButton_();
                    _click_('delete-tree',function(){
                         _deleteTree_();
                    });
                } else {
                    _click_('delete', function(){
                        _deleteTable_();
                    });
                }
            } else {
                if(ind.facebook_id != 0){
                    _hideButtons_();
                    _showButtonInvalidRegister_();
                } else if(!ind.isCanBeDelete()) {
                    _hideButtons_();
                    _showButtonInvalid_();
                } else {
                    _click_('delete',function(){
                        _delete_();
                    });
                }
            }
            return true;
            function _ajax_(option, gedcom_id, call){
                $this.ajax('editor.delete', {type:option, gedcom_id: gedcom_id }, function(res){
                    call(res);
                });
            }
            function _click_(button, callback){ $(parent).find('[familytreetop-button="'+button+'"]').click(callback);}
            function _hideButtons_(){ $(parent).find('[familytreetop="buttons"]').hide(); }
            function _hideDeleteTreeButton_(){ $(parent).find('[familytreetop="delete-tree"]').hide(); }
            function _hideButtonInvalid_(){ $(parent).find('[familytreetop="delete-invalid"]').hide(); }
            function _hideButtonInvalidRegister_(){ $(parent).find('[familytreetop="delete-invalid-register"]').hide(); }
            function _hideDeleteConfirm_(){ $(parent).find('[familytreetop="delete-confirm"]').hide(); }
            function _hideDeleteTable_(){ $(parent).find('[familytreetop="delete"]').hide(); }
            function _showButtons_(){ $(parent).find('[familytreetop="buttons"]').show(); }
            function _showDeleteTreeButton_(){ $(parent).find('[familytreetop="delete-tree"]').show(); }
            function _showButtonInvalid_(){ $(parent).find('[familytreetop="delete-invalid"]').show(); }
            function _showButtonInvalidRegister_(){ $(parent).find('[familytreetop="delete-invalid-register"]').show(); }
            function _showDeleteConfirm_(){ $(parent).find('[familytreetop="delete-confirm"]').show(); }
            function _showDeleteTable_(){ $(parent).find('[familytreetop="delete"]').show(); }
            function _delete_(){
                _ajax_(3, ind.gedcom_id, function(res){
                    if(res) ind.delete();
                    callback(res);
                });
            }
            function _deleteTable_(){
                _hideButtons_();
                _showDeleteTable_();
                _initDeleteTable_(function(){
                    var option = $(this).attr('option');
                    _ajax_(option, ind.gedcom_id, function(res){
                        callback(res);
                        window.location.reload();
                    });
                });
            }
            function _deleteTree_(){
                _hideDeleteTreeButton_();
                _showDeleteConfirm_();
                $(parent).find('[familytreetop-button="delete-confirm-delete"]').click(function(){
                    _ajax_(4, ind.gedcom_id, function(res){
                        if(res){
                            callback(res);
                            FB.logout(function(){
                                window.location.reload();
                            });
                        }
                    });

                });
                $(parent).find('[familytreetop-button="delete-confirm-cancel"]').click(function(){
                    _hideDeleteConfirm_();
                    _showDeleteTreeButton_();
                });
            }
            function _initDeleteTable_(call){
                var box =  $(parent).find('[familytreetop="delete"]');
                $(box).find('[familytreetop="option"]').each(function(i,e){
                    var tr = $(e).parent().parent();
                    $(tr).show();
                    if(parseInt($(e).attr('option')) == 3 && !ind.isCanBeDelete()){
                        $(tr).find('[familytreetop="valid"]').hide();
                        $(tr).find('[familytreetop="invalid"]').show();
                    } else {
                        $(e).click(call);
                    }
                });
                $(box).find('[familytreetop="cancel"]').click(function(){
                    _hideDeleteTable_();
                    _showButtons_();
                    $(box).find('tr').show();
                });
            }
            function _isOwner_(ind){
                return ind.gedcom_id == $this.mod('usertree').usermap().gedcom_id;
            }
            function _getUsersInTreeCount_(){
                var users, key, count = 0;
                users = $this.mod('usertree').usersmap();
                for(key in users){
                    if(!users.hasOwnProperty(key)) continue;
                    count++
                }
                return count;
            }
        },
        setUnionsData:function(parent, ind){
            var spouses = $this.mod('usertree').getSpouses(ind.gedcom_id), forms = [], default_family_button;
            spouses.forEach(function(spouse_id){
                var form = $fn.getEditorUnionsForm(),
                    form_id = $(form).attr('id'),
                    spouse = $this.mod('usertree').user(spouse_id),
                    family_id = $this.mod('usertree').getFamilyIdByPartners(ind.gedcom_id, spouse_id),
                    text,
                    button;

                $(form).find('input[familytreetop="family_id"]').val(family_id);
                $(form).attr('familytreetop', form_id + forms.length);
                text = $(form).find('[familytreetop="union-title"]').text();
                $(form).find('[familytreetop="union-title"]').text(text + " " + (1 + forms.length) );
                $fn.setMonths(form);
                $fn.setDays(form);

                if(ind.family_id != null && ind.family_id == family_id){
                    button =  $(form).find('[familytreetop="current"]');
                    default_family_button = button;
                    $(button).show();
                } else {
                    button = $(form).find('[familytreetop="set-current"]');
                    $(button).show();
                }

                setUnion(form, 'sircar', ind);
                setUnion(form, 'spouse', spouse);
                setEvent(form, family_id);

                forms.push(form);
                $fn.setFormInTab(1, parent, form);
            });

            $(forms).each(function(i, form){
                $(form).find('[familytreetop="current"]').click(function(){
                    return false;
                });
                $(form).find('[familytreetop="set-current"]').click(function(){
                    var b = this, family_id = $(form).find('input[familytreetop="family_id"]').val();
                    $this.ajax('editor.setUnion', {
                        gedcom_id: ind.gedcom_id,
                        family_id : family_id
                    }, function(response){
                        var set = $(b).parent().find('[familytreetop="current"]');
                        $(b).hide();
                        $(set).show();
                        $(default_family_button[0]).hide();
                        $(default_family_button[0]).parent().find('[familytreetop="set-current"]').show();
                        default_family_button = $(set);
                        $this.mod('usertree').setUserFamilyId(response.gedcom_id, response.family_id);
                        $this.mod('usertree').call();
                    });
                    return false;
                });
            });

            return forms;
            function setUnion(form, type, ind){
                var el = $(form).find('[familytreetop="'+type+'"]');
                var av = ind.avatar(["90","90"]);
                $(el).find('[familytreetop="avatar"]').append(av);
                Holder.run({
                    images:av[0]
                });
                $(el).find('[familytreetop="data"]').text(ind.shortname());
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
            $(parent).find('[familytreetop="avatar"]').append(ind.avatar(["140","140"]))
        },
        setFormInTab:function(num, tabs, form){
            var tab =   $(tabs[0]).find('.tab-content #'+ tabs[1][num]);
            $(tab).append(form);
        },
        setSpouseSelection:function(editProfileForm, ind){
            var row = $(editProfileForm).find('[familytreetop="addSpouseComplexButton"]');
            $(row).find('a').click(function(){
                $fn.modalExistFamilyMember(function(id){
                    var u = $this.mod('usertree').user(id);
                    $(row).find('input').val(id);
                    $(editProfileForm).find('[familytreetop="avatar"]').html('');
                    $fn.setUserData(editProfileForm, u);
                });
                return false;
            });
        },
        setParentSelection:function(editProfileForm, ind){
            var row = $(editProfileForm).find('[familytreetop="addChildComplexSelect"]');
            _setOwnerParent_();
            _setOtherSpouse_();
            $(row).find('ul li').click(function(){
                var type = $(this).attr('familytreetop');
                var data = $(this).attr('familytreetop-data');
                if(type == "button"){
                    if(data == "new"){
                        _setTitle_($(this).text());
                        _setValue_(0);
                    } else if(data == "exist"){
                        $fn.modalExistFamilyMember(function(id){
                            var u = $this.mod('usertree').user(id);
                            _setTitle_(u.name());
                            _setValue_(id);
                        });
                    }
                } else if(type == "spouse"){
                    _setTitle_($(this).text());
                    _setValue_(data);
                }
                return false;
            });
            $(row).find('[familytreetop="menu-title"]').click(function(){
                $(this).parent().find('.dropdown-toggle').click();
                return false;
            });
            return true;
            function _setTitle_(t){
                $(row).find('[familytreetop="menu-title"]').text(t);
            }
            function _setValue_(v){
                $(row).find('[familytreetop="parent2"]').val(v);
            }
            function _setOwnerParent_(){
                $(row).find('[familytreetop="parent1"]').val(ind.name());
            }
            function _setOtherSpouse_(){
                var family = $this.mod('usertree').family(ind.family_id);
                var spouses = $this.mod('usertree').getSpouses(ind.gedcom_id);
                var divider = $(row).find('[familytreetop="other-partners"]');
                if(spouses.length > 0){
                    spouses.forEach(function(id){
                        var spouse = $this.mod('usertree').user(id);
                        if(family){
                            if(family.wife == id || family.husb == id){
                               _setTitle_(spouse.name());
                               _setValue_(id);
                            }
                        }
                        var li = $('<li familytreetop="spouse" familytreetop-data="'+id+'" style="cursor:pointer; padding: 0 10px;">'+spouse.name()+'</li>');
                        $(divider).after(li);
                    });
                } else {
                    $(divider).remove();
                }
            }
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
        getEditorMediaForm: function(){
            return $('#formEditMedia').clone();
        },
        getEditorProfileForm:function(){
            return $('#formEditProfile').clone();
        },
        getEditorUnionsForm:function(){
            return $('#formEditUnions').clone();
        },
        getEditorOptionsForm:function(){
            return $('#formEditOptions').clone();
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
        modalExistFamilyMember:function(call){
            var cl = _getModal_();
            var select = $(cl).find('#spouses');
            _setSelect_(select);
            _submit_(cl, select, call);

            $(cl).modal({dynamic:true});
            return true;
            function _getModal_(){
                var cl = $('#modal-exist-family-member').clone().hide();
                $('body').append(cl);
                $(cl).on('hide', function(){
                    $(cl).remove();
                });
                return cl;
            }
            function _setSelect_(s){
                var list = $this.mod('usertree').getAutocompleteList();
                var index = 1;
                for(var key in list){
                    if(!list.hasOwnProperty(key)) continue;
                    index++;
                    var el = list[key];
                    var parents = $this.mod('usertree').getParents(key);
                    var data = {
                        father : $this.mod('usertree').user(parents.father),
                        mother : $this.mod('usertree').user(parents.mother),
                        child : el.gender ? "son" : "daughter",
                        birth : el.birth('date.start_year')
                    }
                    var string = (parents.family_id != null)?' ('+data.child+' '+data.father.name()+' and '+data.mother.name()+')':"";
                    $(s).append('<option value="'+key+'">'
                        +el.name()+((data.birth.length > 0)?' ('+data.birth+')':'')
                        +string
                        +'</option>');
                }
                $(s).attr('size', index);
            }
            function _submit_(m, s, c){
                $(m).find('button[familytreetop="submit"]').click(function(){
                    $(m).modal('hide');
                    c($(s).find('option:selected').val());
                    return false;
                });
            }
        },
        validate: function(args){
            var form = args['form0'];
            for(var key in form){
                if(!form.hasOwnProperty(key)) continue;
                if(form[key].name == "editProfile[gender]"){
                    if(form[key].value == "default"){
                        return false;
                    }
                }
            }
            return true;
        },
        progressbarOn:function(m){
            $(m).find('[familytreetop="circle-progressbar"]').css('visibility', 'visible');
        },
        progressbarOff:function(m){
            $(m).find('[familytreetop="circle-progressbar"]').css('visibility', 'hidden');
        },
        submit:function(cl, ind, task){
            var tasks = [
                'editor.updateUserInfo',
                'editor.updateUnionsInfo'
            ];
            $(cl).find('button[familytreetop="submit"]').click(function(){
                $fn.progressbarOn(cl);
                var args, send, activeTab, saveButton;
                saveButton = $(this).hasClass('btn-primary');
                if("undefined" === typeof(task)){
                    activeTab = $(cl).find('.nav.nav-tabs li.active a').attr('href').split('_')[1];
                    if("undefined" === typeof(tasks[activeTab])) return false;
                    send = tasks[activeTab];
                    args = $fn.getArgs(cl, activeTab, ind);
                } else {
                    args = $fn.getArgs(cl, 0, ind);
                    send = task;
                }
                if(!$fn.validate(args)){
                    $fn.progressbarOff(cl);
                    return false;
                }
                $this.ajax(send, args, function(response){
                    $this.mod('usertree').update(response);
                    $fn.progressbarOff(cl);
                    if(saveButton){
                        $(cl).modal('hide');
                    }
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

        if(type=="addChild"){
            $fn.setParentSelection(editProfileForm, ind);
            $(editProfileForm).find('[familytreetop="avatar"]').append('<i class="icon-group icon-4x"></i>');
        } else {
            $(editProfileForm).find('[familytreetop="addChildComplexSelect"]').remove();
        }

        if(type=="addSpouse"){
            $fn.setSpouseSelection(editProfileForm, ind);
        } else {
            $(editProfileForm).find('[familytreetop="addSpouseComplexButton"]').remove();
        }

        //set title
        $(cl).find('#modalLabel').text("Add " + type.split('add')[1]);
        //set tabs
        $(cl).find('.modal-body').append(editProfileForm);

        //init modal
        $(cl).modal({dynamic: true});

        //event submit
        $fn.submit(cl, ind, 'editor.'+type);
    }

    $this.render = function(gedcom_id, renderTab){
        var cl,
            tabs,
            ind,
            editProfileForm,
            editUnionsForms,
            editMediaForm,
            editOptionsForm;

        //create modal box
        cl = $fn.getModalBox();

        //create tabs
        tabs = $fn.getTabs();

        //get user data
        ind = $this.mod('usertree').user(gedcom_id);

        //set title
        $(cl).find('#modalLabel').text(ind.name());
        //set tabs
        $(cl).find('.modal-body').append(tabs[0]);

        //profile edit
        editProfileForm = $fn.getEditorProfileForm();
        $(editProfileForm).find('option[value="default"]').remove();
        $(editProfileForm).find('[familytreetop="addChildComplexSelect"]').remove();
        $(editProfileForm).find('[familytreetop="addSpouseComplexButton"]').remove();
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
        editOptionsForm = $fn.getEditorOptionsForm();
        $fn.setFormInTab(3, tabs, editOptionsForm);
        $fn.setOptions(editOptionsForm, ind, function(){
            $(cl).modal('hide');
        });
        //init modal
        $(cl).modal({dynamic:true});

        $(tabs[0]).on('shown', function (e) {
            var target = e.target ;
            var tab = $(target).attr('familytreetop-tab');
            if("options" == tab){
                $(cl).find('.modal-footer button[familytreetop="submit"]').hide();
            } else {
                $(cl).find('.modal-footer button').show();
            }
        })

        $(cl).on('shown', function () {
            if("undefined" !== typeof(renderTab)){
                $(tabs[0]).find('ul.nav-tabs li:nth-child('+renderTab+') a').tab('show');
            }
        })

        // event submit
        $fn.submit(cl, ind);
    }
});