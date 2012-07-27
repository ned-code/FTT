function JMBTreeCreatorObject(parent){
	var module = this, fn;
	
	module.body = null;
	module.dialog_box = null;
	module.error_message = '';
	module.args_pull = [];
	module.request_pull = {};
	module.reload = false;
	module.request_send = false;
	module.initData = false;
    module.fProfile = false;

	module.path = 'modules/tree_creator/'
	module.css_path = [storage.baseurl,storage.url,module.path,'css/'].join('');
	module.female = 'female.png';
	module.male = 'male.png';
	module.title_count = 0;
	module.dialog_settings = {
		width:600,
		height:420,
		title: 'Welcome to Family TreeTop',
		resizable: false,
		draggable: false,
		position: "top",
		closeOnEscape: false,
		modal:true,
		close:function(){
			
		}	
	}
	module.create_tree_settings = {
		width:400,
		resizable: false,
		draggable: false,
		position: "top",
		closeOnEscape: false,
		modal:true,
		close:function(){
			if(module.reload) window.location.reload();
			module.args_pull = [];
			module.title_count = 0;
		}	
	}
	
	module.request_settings = {
		width:550,
		height:470,
		resizable: false,
		draggable: false,
		position: "top",
		closeOnEscape: false,
		modal:true,
		close:function(){
			module.request_pull = {};
			module.request_send = false;
		}
	}

    module.msg = {
        FTT_MOD_TREE_CREATOR_WELCOM: "Welcome to Family TreeTop",
        FTT_MOD_TREE_CREATOR_WELCOM_MESSAGE: "Ready to create your own family tree?",
        FTT_MOD_TREE_CREATOR_WELCOM_CLICK: "Click here to start",
        FTT_MOD_TREE_CREATOR_FEMALE: "Female",
        FTT_MOD_TREE_CREATOR_MALE: "Male",
        FTT_MOD_TREE_CREATOR_YES: "Yes",
        FTT_MOD_TREE_CREATOR_NO: "No",
        FTT_MOD_TREE_CREATOR_RELATION: "Select Relation",
        FTT_MOD_TREE_CREATOR_RELATION_FATHER: "Father",
        FTT_MOD_TREE_CREATOR_RELATION_MOTHER : "Mother",
        FTT_MOD_TREE_CREATOR_RELATION_BROTHER : "Brother",
        FTT_MOD_TREE_CREATOR_RELATION_SISTER : "Sister",
        FTT_MOD_TREE_CREATOR_RELATION_SON : "Son",
        FTT_MOD_TREE_CREATOR_RELATION_DAUGHTER : "Daughter",
        FTT_MOD_TREE_CREATOR_RELATION_UNCLE : "Uncle",
        FTT_MOD_TREE_CREATOR_RELATION_NIECE : "Niece",
        FTT_MOD_TREE_CREATOR_RELATION_NEPHEW : "Nephew",
        FTT_MOD_TREE_CREATOR_RELATION_AUNT : "Aunt",
        FTT_MOD_TREE_CREATOR_RELATION_COUSIN : "Cousin",
        FTT_MOD_TREE_CREATOR_RELATION_GRANDMOTHER : "Grandmother",
        FTT_MOD_TREE_CREATOR_RELATION_GRANGFATHER : "Grandfather",
        FTT_MOD_TREE_CREATOR_USERFORM_GENDER: "Gender",
        FTT_MOD_TREE_CREATOR_USERFORM_LIVING: "Living",
        FTT_MOD_TREE_CREATOR_USERFORM_NAME: "Name",
        FTT_MOD_TREE_CREATOR_USERFORM_FIRSTNAME: "First Name",
        FTT_MOD_TREE_CREATOR_USERFORM_MIDDLENAME: "Middle Name",
        FTT_MOD_TREE_CREATOR_USERFORM_LASTNAME: "Last Name",
        FTT_MOD_TREE_CREATOR_USERFORM_KNOWAS: "Know As",
        FTT_MOD_TREE_CREATOR_USERFORM_BORN : "Born",
        FTT_MOD_TREE_CREATOR_USERFORM_BIRTHYEAR : "Birth Year",
        FTT_MOD_TREE_CREATOR_USERFORM_BIRTHPLACE : "Birthplace",
        FTT_MOD_TREE_CREATOR_USERFORM_DEATH : "Death",
        FTT_MOD_TREE_CREATOR_USERFORM_DEATHPLACE : "Deathplace",
        FTT_MOD_TREE_CREATOR_USERFORM_NEXT : "Next",
        FTT_MOD_TREE_CREATOR_FORM_YOU : "You",
        FTT_MOD_TREE_CREATOR_FORM_YOU_FATHER : "You Father",
        FTT_MOD_TREE_CREATOR_FORM_YOU_MOTHER : "You Mother",
        FTT_MOD_TREE_CREATOR_FORM_MESSAGE: "Message",
        FTT_MOD_TREE_CREATOR_FORM_SEND_REQUEST_TO: "Send Request to",
        FTT_MOD_TREE_CREATOR_BOX_STILL_THINK: "Still thinking about it",
        FTT_MOD_TREE_CREATOR_BOX_TEXT_1: "Want to see Family TreeTop in action?  Explore our",
        FTT_MOD_TREE_CREATOR_BOX_TEXT_2: "directory or click",
        FTT_MOD_TREE_CREATOR_BOX_TEXT_3: "to see a quick video of the Elvis Presley family tree. Your own family tree will have a similar layout to see a quick video of the Elvis Presley family tree. Your own family tree will have a similar layout",
        FTT_MOD_TREE_CREATOR_BOX_HERE: "here",
        FTT_MOD_TREE_CREATOR_BOX_FAMOUS_FAMILY: "Famous Families",
        FTT_MOD_TREE_CREATOR_TITLES_ABOUT_YOURSELF: "About Yourself",
        FTT_MOD_TREE_CREATOR_TITLES_YOUR_MOTHER: "Your Mother",
        FTT_MOD_TREE_CREATOR_TITLES_YOUR_FATHER: "Your Father",
        FTT_MOD_TREE_CREATOR_TITLES_GETTING_STARTED: "Getting started",
        FTT_MOD_TREE_CREATOR_DIALOG_TITLE_DEMO_ELVIS: "Demo: Elvis Presley Family Tree",
        FTT_MOD_TREE_CREATOR_ALERT_ABORT_REQUEST : "Your request is removed, you can begin to create the tree.",
        FTT_MOD_TREE_CREATOR_ALERT_ABORT_REQUEST_TRY_AGAIN: "Your request is removed, you can begin to create the tree.",
        FTT_MOD_TREE_CREATOR_ALERT_ALREADY_SENT_REQUEST : "You have already sent a request to %% to join an existing Family Tree. Would you like to cancel this request and start again? ",
        FTT_MOD_TREE_CREATOR_ALERT_SEND_REQUEST_TEXT_1: "Your request has been sent to %%.",
        FTT_MOD_TREE_CREATOR_ALERT_SEND_REQUEST_TEXT_2: "An email will be sent to you when %% makes a decision.",
        FTT_MOD_TREE_CREATOR_REQUEST_INVITATION_BUTTON : "Request Invitation",
        FTT_MOD_TREE_CREATOR_START_ARE_YOU_RELATED: "Are You Related",
        FTT_MOD_TREE_CREATOR_START_TEXT: "Some of your Facebook friends are members of Family TreeTop. Are you related to any of the people listed below? If so, you many request an invitation to join their family tree",
        FTT_MOD_TREE_CREATOR_START_FOOTER_1: "If you are not related to anyone listed above",
        FTT_MOD_TREE_CREATOR_START_FOOTER_2: "to create new family tree period",
        FTT_MOD_TREE_CREATOR_START_CLICK_HERE: "click here"
    }

	
	fn = {
        ajax:function(func, params, callback){
            storage.callMethod("tree_creator", "TreeCreator", func, params, function(res){
                callback(res);
            })
        },
        ajaxForm:function(settings){
            var validate_options = (settings.validate)?settings.validate:{};
            jQuery(settings.target).validate(validate_options);
            jQuery(settings.target).ajaxForm({
                url:[storage.baseurl,'components/com_manager/php/ajax.php'].join(''),
                type:"POST",
                data: { "module":"tree_creator","class":"TreeCreator", "method":settings.method, "args": settings.args },
                dataType:"json",
                target:jQuery(storage.iframe).attr('name'),
                beforeSubmit:function(){
                    storage.progressbar.loading();
                    return true;
                },
                success:function(data){
                    storage.progressbar.off();
                    if(typeof(settings.success) == 'function'){
                        settings.success(data);
                    }
                }
            });
        },
        select:{
            days:function(prefix){
                var sb = host.stringBuffer();
                sb._('<select name="')._(prefix)._('day">');
                sb._('<option value="0">Day</option>');
                for(var i = 1; i <= 31; i++){
                    sb._('<option value="')._(i)._('">')._(i)._('</option>');
                }
                sb._('</select>');
                return sb.result();
            },
            month:function(prefix){
                var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                var sb = host.stringBuffer();
                sb._('<select name="')._(prefix)._('month">');
                sb._('<option value="0">Month</option>');
                for(var i = 0; i <= 11; i++){
                    sb._('<option value="')._(i+1)._('">')._(months[i])._('</option>');
                }
                sb._('</select>');
                return sb.result();
            },
            gender:function(){
                var sb = host.stringBuffer();
                sb._('<select name="gender">');
                sb._('<option value="f">')._(module.msg.FTT_MOD_TREE_CREATOR_FEMALE)._('</option>');
                sb._('<option value="m">')._(module.msg.FTT_MOD_TREE_CREATOR_MALE)._('</option>');
                sb._('</select>');
                return sb.result();
            },
            living:function(){
                var sb = host.stringBuffer();
                sb._('<select name="living">');
                sb._('<option value="1">')._(module.msg.FTT_MOD_TREE_CREATOR_YES)._('</option>');
                sb._('<option value="0">')._(module.msg.FTT_MOD_TREE_CREATOR_NO)._('</option>');
                sb._('</select>');
                return sb.result();
            },
            relations:function(){
                var sb = host.stringBuffer();
                sb._('<select name="relations">');
                sb._('<option value="">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION)._('</option>');
                sb._('<option value="father">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_FATHER)._('</option>');
                sb._('<option value="mother">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_MOTHER)._('</option>');
                sb._('<option value="brother">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_BROTHER)._('</option>');
                sb._('<option value="sister">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_SISTER)._('</option>');
                sb._('<option value="son">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_SON)._('</option>');
                sb._('<option value="daughter">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_DAUGHTER)._('</option>');
                sb._('<option value="uncle">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_UNCLE)._('</option>');
                sb._('<option value="niece">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_NIECE)._('</option>');
                sb._('<option value="nephew">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_NEPHEW)._('</option>');
                sb._('<option value="aunt">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_AUNT)._('</option>');
                sb._('<option value="cousin">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_COUSIN)._('</option>');
                sb._('<option value="grandmother">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_GRANDMOTHER)._('</option>');
                sb._('<option value="grandfather">')._(module.msg.FTT_MOD_TREE_CREATOR_RELATION_GRANGFATHER)._('</option>');
                sb._('</select>');
                return sb.result();
            }
        },
        closeDialogBox:function(){
            jQuery(module.dialog_box).dialog('close');
        },
        finish:function(target){
            onClick(setContent(getForm(target)), function(){
                window.location.href = storage.baseurl + 'index.php/myfamily';
            });
            return true;
            function onClick(f, c){
                jQuery(f).find('.switch_to_myfamily').click(function(){
                    c();
                });
            }
            function getForm(t){
                return jQuery(t).find('form');
            }
            function setContent(f){
                jQuery(f).html('');
                jQuery(f).parent().dialog('option', 'width', 500);
                jQuery(f).append(getVideoElement());
                return f;
            }
            function getVideoElement(){
                var sb = host.stringBuffer();
                sb._('<div class="video">');
                    sb._('<object id="scPlayer" class="embeddedObject" width="640" height="405" type="application/x-shockwave-flash" data="http://content.screencast.com/users/Fernando_Oliveira/folders/Default/media/6da2d84e-67f3-4a00-9ef8-7ba592f8aba3/scplayer.swf" style="width: 474.0740740740741px; height: 300px; ">');
                    sb._('<param name="movie" value="http://content.screencast.com/users/Fernando_Oliveira/folders/Default/media/6da2d84e-67f3-4a00-9ef8-7ba592f8aba3/scplayer.swf">');
                    sb._('<param name="quality" value="high">');
                    sb._('<param name="bgcolor" value="#FFFFFF">');
                    sb._('<param name="flashVars" value="thumb=http://content.screencast.com/users/Fernando_Oliveira/folders/Default/media/6da2d84e-67f3-4a00-9ef8-7ba592f8aba3/FirstFrame.png&amp;containerwidth=640&amp;containerheight=405&amp;autohide=true&amp;autostart=false&amp;loop=false&amp;showendscreen=true&amp;showsearch=false&amp;showstartscreen=true&amp;tocdoc=left&amp;xmp=sc.xmp&amp;advseek=true&amp;content=http://content.screencast.com/users/Fernando_Oliveira/folders/Default/media/6da2d84e-67f3-4a00-9ef8-7ba592f8aba3/ftt-green-button2.mp4&amp;blurover=false">');
                    sb._('<param name="allowFullScreen" value="true">');
                    sb._('<param name="scale" value="showall">');
                    sb._('<param name="allowScriptAccess" value="always">');
                    sb._('<param name="base" value="http://content.screencast.com/users/Fernando_Oliveira/folders/Default/media/6da2d84e-67f3-4a00-9ef8-7ba592f8aba3/">');
                    sb._('<iframe class="embeddedObject" type="text/html" frameborder="0" scrolling="no" style="overflow-x: hidden; overflow-y: hidden; width: 474.0740740740741px; height: 300px; " src="http://www.screencast.com/users/Fernando_Oliveira/folders/Default/media/6da2d84e-67f3-4a00-9ef8-7ba592f8aba3/embed" height="405" width="640"></iframe>');
                    sb._('</object>');
                sb._('</div>');
                sb._('<div class="switch_to_myfamily"><span>Go to my Family Tree</span></div>');
                return jQuery(sb.result());
            }
        },
        createTree:function(){
            var dialogBox = createDialogBox(getForm());
            setElement(dialogBox, getHeader());
            setElement(dialogBox, getBox('user'));
            setElement(dialogBox, getBox('mother'));
            setElement(dialogBox, getBox('father'));
            setUserData(dialogBox);
            useForm(dialogBox);

            return true;
            function useForm(target){
                fn.ajaxForm({
                    target:jQuery(target).find('form'),
                    method:'create_tree',
                    args:getArguments(),
                    validate:{
                        rules:{
                            u_first_name:{ required: true },
                            u_last_name:{ required: true },
                            u_birth:{ required: true },
                            u_country:{ required: true },
                            m_first_name:{ required: true },
                            m_last_name:{ required: true },
                            m_birth:{ required: true },
                            m_country:{ required: true },
                            f_first_name:{ required: true },
                            f_last_name:{ required: true },
                            f_birth:{ required: true },
                            f_country:{ required: true }
                        },
                        messages:{
                            u_first_name:"",
                            u_last_name:"",
                            u_birth:"",
                            u_country:"",
                            m_first_name:"",
                            m_last_name:"",
                            m_birth:"",
                            m_country:"",
                            f_first_name:"",
                            f_last_name:"",
                            f_birth:"",
                            f_country:""
                        }
                    },
                    success:function(res){
                        fn.finish(target);
                    }
                });
            }
            function getArguments(){
                return (module.fProfile.gender=="male")?"M":"F";
            }
            function closeDialogBox(){
                fn.closeDialogBox();
            }
            function createDialogBox(f){
                closeDialogBox();
                jQuery(f).dialog(module.create_tree_settings);
                jQuery(f).parent().addClass('ftt-form-create-tree');
                jQuery(f).parent().css('top', '20px');
                return f;
            }
            function setElement(f, o){
                jQuery(f).find('form').append(o);
            }
            function setUserData(f){
                var name = module.fProfile.name.split(' ');
                jQuery(f).find('input[name="u_first_name"]').val(name[0]);
                jQuery(f).find('input[name="u_last_name"]').val(name.pop());
            }
            function getForm(){
                return jQuery('<div><form id="create_tree" method="post" target="ftt_iframe"></form></div>');
            }
            function getHeader(){
                var sb = host.stringBuffer();
                sb._('<div class="header">');
                    sb._('<div class="message">Ready to create your family tree?<br>Complete all fields  and click here</div>');
                    sb._('<div class="button"><input type="submit" value="GO"></div>');
                sb._('</div>');
                return jQuery(sb.result());
            }
            function getBox(type){
                var settings = getSettings(type);
                var sb = host.stringBuffer();
                sb._('<div class="box ')._(type)._('">');
                    sb._('<div class="title">')._(settings.title)._('</div>');
                    sb._('<div class="data">');
                        sb._('<table>');
                            sb._('<tr>');
                                sb._('<td rowspan="2"><div class="avatar">')._(settings.avatar)._('</div></td>');
                                sb._('<td valign="top"><div class="text"><input placeholder="First Name" name="')._(settings.prefix)._('first_name" type="text"></div></td>');
                                sb._('<td valign="top"><div class="text"><input placeholder="Last Name" name="')._(settings.prefix)._('last_name" type="text"></div></td>');
                            sb._('</tr>');
                            sb._('<tr>');
                                sb._('<td valign="top"><div class="text"><input placeholder="Year of Birth" name="')._(settings.prefix)._('birth" type="text"></div></td>');
                                sb._('<td valign="top"><div class="text"><input placeholder="Country" name="')._(settings.prefix)._('country" type="text"></div></td>');
                            sb._('</tr>');
                        sb._('</table>');
                    sb._('</div>');
                sb._('</div>');
                return jQuery(sb.result());
            }
            function getAvatar(id){
                if(id.length == 1){
                    return storage.usertree.avatar.def_image({ width:72, height:80 }, id);
                } else {
                    return '<img width="72px" height="80px"  src="https://graph.facebook.com/'+id+'/picture">';
                }
            }
            function getSettings(type){
                switch(type){
                    case "user":
                        return {
                            avatar: getAvatar(module.fProfile.facebookId),
                            title: module.msg.FTT_MOD_TREE_CREATOR_FORM_YOU,
                            prefix: 'u_'
                        }
                    break;

                    case "mother":
                        return {
                            avatar: getAvatar('F'),
                            title: module.msg.FTT_MOD_TREE_CREATOR_FORM_YOU_MOTHER,
                            prefix: 'm_'
                        }
                    break;

                    case "father":
                        return {
                            avatar: getAvatar('M'),
                            title: module.msg.FTT_MOD_TREE_CREATOR_FORM_YOU_FATHER,
                            prefix: 'f_'
                        }
                    break;
                }
            }
        },
        sendRequest:function(){
            setRequestForm(getArguments(this));
            return true;
            function createDialogBox(form){
                fn.closeDialogBox();
                jQuery(form).dialog(module.request_settings);
                jQuery(form).dialog('option', 'title', 'Family TreeTop - Invitation Request');
                jQuery(form).parent().addClass('ftt_tree_creator');
                jQuery(form).parent().css('top', '20px');
                return form;
            }
            function setRequestForm(args){
                onClick(createDialogBox(getRequestForm(args)), args);
            }
            function getRequestFormBoxData(object){
                var pull = {};
                jQuery(object).find('input, select').each(function(i, el){
                    var name = jQuery(el).attr('name');
                    var value = jQuery(el).attr('value');
                    pull[name] = value;
                });
                return pull;
            }
            function getRequestFromValidate(form, callback){
                var res = true;
                jQuery(form).find('div.text input').each(function(i, el){
                    var val = jQuery(el).val();
                    if(jQuery(el).attr('name') != 'nick' && val == ''){
                        res = false;
                    }
                });
                var relation = jQuery(form).find('select option:selected').val();
                if(relation == ''){
                    res = false;
                }
                callback(res);
            }
            function onClick(form , args){
                jQuery(form).find('.button').click(function(){
                    if(module.request_send) return false;
                    module.request_send = true;
                    var pull = {
                        me:args.me,
                        target: args.target,
                        relation:jQuery(form).find('select[name="relations"]').val(),
                        user_info:getRequestFormBoxData(jQuery(form).find('.user_box')),
                        mother_info:getRequestFormBoxData(jQuery(form).find('.mother_box')),
                        father_info:getRequestFormBoxData(jQuery(form).find('.father_box')),
                        message:jQuery(form).find('div.message textarea').val()
                    };
                    getRequestFromValidate(form, function(valid){
                        if(valid){
                            fn.ajax('send_request', JSON.stringify(pull), function(res){
                                var response = storage.getJSON(res.responseText);
                                if(response.error){
                                    storage.alert(response.error, function(){
                                        module.request_send = false;
                                        jQuery(form).dialog('close');
                                    });
                                    return false;
                                } else if(response.success){
                                    module.initData.request = module.msg.FTT_MOD_TREE_CREATOR_ALERT_ALREADY_SENT_REQUEST.replace("%%", args.target.name);
                                    var alertMessage = [];
                                    alertMessage.push(module.msg.FTT_MOD_TREE_CREATOR_ALERT_SEND_REQUEST_TEXT_1.replace('%%', args.target.name));
                                    alertMessage.push(module.msg.FTT_MOD_TREE_CREATOR_ALERT_SEND_REQUEST_TEXT_2.replace('%%', args.target.name));
                                    storage.alert(alertMessage.join(''), function(){
                                        jQuery(form).dialog('close');
                                    });
                                    return true;
                                }
                            });
                        } else {
                            module.request_send = false;
                            storage.alert("You must complete all of the fields." ,function(){})
                        }
                    });
                    return false;
                });
            }
            function getArguments(target){
                return {
                    me:module.fProfile.facebookFields,
                    target:{
                        name:jQuery(target).attr('user_name'),
                        facebook_id:jQuery(target).attr('facebook_id'),
                        gedcom_id:jQuery(target).attr('gedcom_id')
                    }
                }
            }
            function getRequestFormBox(args){
                var sb = host.stringBuffer();
                sb._('<table>');
                if(args){
                    sb._('<tr style="height: 88px;">');
                    sb._('<td valign="top"><div class="facebook_avatar">')._('<img width="80px" height="80px"  src="https://graph.facebook.com/')._(args.me.id)._('/picture">')._('</div></td>');
                    sb._('<td valign="top"><span style="font-weight: bold;margin-left: 5px;">')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_GENDER)._(':</span> ')._(fn.select.gender())._('</td>');
                    sb._('</tr>');
                }
                sb._('<tr>');
                sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_NAME)._(':</span></div></td>');
                if(args){
                    sb._('<td><div class="text"><input name="name" type="text" value="')._(args.me.name)._('"></div></td>');
                } else{
                    sb._('<td><div class="text"><input name="name" type="text"></div></td>');
                }
                sb._('</tr>');
                if(args){
                    sb._('<tr>');
                    sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_KNOWAS)._(':</span></div></td>');
                    sb._('<td><div class="text"><input name="nick" type="text"></div></td>');
                    sb._('</tr>');
                }
                sb._('<tr>');
                sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_BIRTHYEAR)._(':</span></div></td>');
                sb._('<td><div class="text"><input name="b_year" type="text"></div></td>');
                sb._('</tr>');
                sb._('<tr>');
                sb._('<td><div  class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_BIRTHPLACE)._(':</span></div></td>');
                sb._('<td><div class="text"><input name="b_place" type="text"></div></td>');
                sb._('</tr>');
                sb._('</table>');
                return sb.result();
            }
            function getRequestForm(args){
                var sb = host.stringBuffer();
                sb._('<div class="tree_create_request_form">');
                    sb._('<div class="relation">')._(args.target.name)._(' is your: ')._(fn.select.relations())._('</div>');
                    sb._('<div class="data">');
                        sb._('<table>');
                            sb._('<tr>');
                                sb._('<td rowspan="2" valign="top">');
                                    sb._('<div class="box">');
                                        sb._('<div class="box_title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_FORM_YOU)._('</span></div>');
                                        sb._('<div class="user_box">')._(getRequestFormBox(args))._('</div>');
                                    sb._('</div>');
                                sb._('</td>');
                                sb._('<td>');
                                    sb._('<div class="box">');
                                        sb._('<div class="box_title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_FORM_YOU_MOTHER)._('</span></div>');
                                        sb._('<div class="mother_box">')._(getRequestFormBox())._('</div>');
                                    sb._('</div>');
                                sb._('</td>');
                            sb._('</tr>');
                            sb._('<tr>');
                                sb._('<td>');
                                    sb._('<div class="box">');
                                        sb._('<div class="box_title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_FORM_YOU_FATHER)._('</span></div>');
                                        sb._('<div class="father_box">')._(getRequestFormBox())._('</div>');
                                    sb._('</div>');
                                sb._('</td>');
                            sb._('</tr>');
                        sb._('</table>');
                    sb._('</div>');
                    sb._('<div class="message">');
                        sb._('<div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_FORM_MESSAGE)._(':</span></div>');
                        sb._('<div class="text"><textarea></textarea></div>');
                    sb._('</div>');
                    sb._('<div class="button"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_FORM_SEND_REQUEST_TO)._(' ')._(args.target.name)._('</span></div>');
                sb._('</div>');
                return jQuery(sb.result());
            }
        },
        request:function(){
            createRequestBox(getDialogBox());

            return true;
            function createRequestBox(box){
                var content = getContent();
                setFacebookFriends(content);
                onClickToCreateTree(content);
                jQuery(box).append(content);
                jQuery(box).dialog(module.dialog_settings);
                jQuery(box).parent().addClass('ftt_tree_creator');
                jQuery(box).parent().css('top', '20px');
            }
            function getDialogBox(){
                return module.dialog_box;
            }
            function getContent(){
                var sb = host.stringBuffer();
                sb._('<div class="tc_content">');
                    sb._('<div class="tc_header">');
                        sb._('<div><span>')._(module.msg.FTT_MOD_TREE_CREATOR_START_ARE_YOU_RELATED)._('?</span></div>');
                        sb._('<div><span>')._(module.msg.FTT_MOD_TREE_CREATOR_START_TEXT)._('.</span></div>');
                    sb._('</div>');
                    sb._('<div class="tc_ftt_friends">');
                    sb._('</div>');
                    sb._('<div class="tc_footer">');
                        sb._('<div><span>')._(module.msg.FTT_MOD_TREE_CREATOR_START_FOOTER_1)._(', <span class="button">')._(module.msg.FTT_MOD_TREE_CREATOR_START_CLICK_HERE)._('</span> ')._(module.msg.FTT_MOD_TREE_CREATOR_START_FOOTER_2)._('.</span></div>');
                    sb._('</div>');
                sb._('</div>');
                return jQuery(sb.result());
            }
            function setFacebookFriends(content){
                var cont = jQuery(content).find('div.tc_ftt_friends');
                var ul = jQuery('<ul></ul>');
                var vFriends = module.initData.verifyFriends;
                jQuery(vFriends).each(function(i, el){
                    var li = jQuery('<li></li>');
                    var sb = host.stringBuffer();
                    sb._('<table>');
                        sb._('<tr>');
                            sb._('<td>');
                                sb._('<div class="avatar">');
                                    sb._('<img src="https://graph.facebook.com/')._(el.facebook_id)._('/picture">');
                                sb._('</div>');
                            sb._('</td>');
                            sb._('<td><div class="name">')._(el.name)._('</div></td>');
                            sb._('<td>');
                                sb._('<div class="request" user_name="')._(el.name)._('" facebook_id="')._(el.facebook_id)._('" gedcom_id="')._(el.gedcom_id)._('">');
                                    sb._('<span>')._(module.msg.FTT_MOD_TREE_CREATOR_REQUEST_INVITATION_BUTTON)._('</span>');
                                sb._('</div>');
                            sb._('</td>');
                        sb._('</tr>');
                    sb._('</table>');
                    var html = sb.result();
                    jQuery(li).append(html);
                    jQuery(ul).append(li);
                });
                jQuery(cont).append(ul);
                onClickSendRequest(jQuery(ul).find('div.request'));

            }
            function onClickSendRequest(requestFields){
                jQuery(requestFields).click(fn.sendRequest);
            }
            function onClickToCreateTree(content){
                jQuery(content).find('div.tc_footer span.button').click(fn.createTree);
            }
        },
        start:function(body){
            onClickToStart(function(){
                if(!requestExist()){
                    createDialogWindow();
                } else {
                    confirmAbortRequest(function(confirm){
                        if(confirm){
                            createDialogWindow();
                        }
                    });
                }
            });
            onClickToFamousFamily();
            onClickToScreen();
            return true;
            function createDialogBox(){
                return module.dialog_box = jQuery('<div id="dialog_box" class="dialog_box"></div>');
            }
            function createDialogWindow(){
                createDialogBox();
                if(friendsExist()){
                    fn.request();
                } else {
                    fn.createTree();
                }
            }
            function friendsExist(){
                var vf = module.initData.verifyFriends;
                if(vf.length != 0){
                    return true;
                } else {
                    false;
                }
            }
            function requestExist(){
                if(typeof(module.initData.request) != 'undefined' && module.initData.request){
                    return true;
                } else {
                    return false;
                }
            }
            function confirmAbortRequest(c){
                if(confirm(getRequest())){
                    fn.ajax('abortRequest', null, function(){
                        setRequest(false);
                        storage.alert(module.msg.FTT_MOD_TREE_CREATOR_ALERT_ABORT_REQUEST, function(){
                            c(true);
                        });
                    });
                } else {
                    c(false);
                }
            }
            function getRequest(){
                return module.initData.request;
            }
            function setRequest(v){
                module.initData.request = v;
            }
            function onClickToStart(c){
                jQuery(body).find('div#button').click(c);
            }
            function onClickToFamousFamily(){
                jQuery(body).find('a#famous').click(function(){
                    jQuery.ajax({
                        url: 'index.php?option=com_manager&task=setLocation&alias=famous-family',
                        type: "POST",
                        dataType: "json",
                        complete : function (req, err) {
                            var bUrl = jQuery(document.body).attr('_baseurl');
                            if(window != window.top){
                                window.parent.location.href= bUrl+'index.php/famous-family';
                            } else {
                                window.location.href = bUrl+'index.php/famous-family';
                            }
                        }
                    });
                    return false;
                });
            }
            function onClickToScreen(c){
                jQuery(body).find('a#screen').click(function(){
                    var st = host.stringBuffer();
                    st._('<div class="video">');
                    st._('<object id="scPlayer" class="embeddedObject" width="930" height="514" type="application/x-shockwave-flash" data="http://content.screencast.com/users/Fernando_Oliveira/folders/Jing/media/941aa11f-54f7-4ddb-9f25-665c2a630297/jingh264player.swf" style="width: 542px; height: 300px; ">');
                    st._('<param name="movie" value="http://content.screencast.com/users/Fernando_Oliveira/folders/Jing/media/941aa11f-54f7-4ddb-9f25-665c2a630297/jingh264player.swf">');
                    st._('<param name="quality" value="high">');
                    st._('<param name="bgcolor" value="#FFFFFF">');
                    st._('<param name="flashVars" value="thumb=http://content.screencast.com/users/Fernando_Oliveira/folders/Jing/media/941aa11f-54f7-4ddb-9f25-665c2a630297/FirstFrame.jpg&amp;containerwidth=930&amp;containerheight=514&amp;advseek=true&amp;content=http://content.screencast.com/users/Fernando_Oliveira/folders/Jing/media/941aa11f-54f7-4ddb-9f25-665c2a630297/2012-06-20_1131.mp4&amp;blurover=false">');
                    st._('<param name="allowFullScreen" value="true">');
                    st._('<param name="scale" value="showall">');
                    st._('<param name="allowScriptAccess" value="always">');
                    st._('<param name="base" value="http://content.screencast.com/users/Fernando_Oliveira/folders/Jing/media/941aa11f-54f7-4ddb-9f25-665c2a630297/">');
                    st._('<iframe class="embeddedObject" type="text/html" frameborder="0" scrolling="no" style="overflow: hidden; width: 930px; height: 514px; " src="http://www.screencast.com/users/Fernando_Oliveira/folders/Jing/media/941aa11f-54f7-4ddb-9f25-665c2a630297/embed" height="514" width="930"></iframe>');
                    st._('</object>');
                    st._('</div>');
                    var div = jQuery(st.result());
                    jQuery(div).dialog({
                        width:580,
                        height:370,
                        title: module.msg.FTT_MOD_TREE_CREATOR_DIALOG_TITLE_DEMO_ELVIS,
                        resizable: false,
                        draggable: false,
                        position: "top",
                        closeOnEscape: false,
                        modal:true,
                        close:function(){

                        }
                    });
                    jQuery(div).parent().addClass('ftt_tree_creator');
                    jQuery(div).parent().css('top', '20px');
                    return false;
                });
            }
        },
        init:function(){
            var user = getUser();
            if(isExistUser(user)){
                getFacebookFriends(function(friends){
                    var args = getArguments(user, friends);
                    fn.ajax('init', args, function(data){
                        var json = getJSON(data);
                        setMsg(json);
                        start(createBody());
                    });
                });
            }
            return true;
            function start(b){
                jQuery(parent).append(b);
                fn.start(b);
            }
            function createBody(){
                var sb = host.stringBuffer();
                sb._('<div>');
                    sb._('<div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_WELCOM)._('</span></div>');
                    sb._('<div class="description"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_WELCOM_MESSAGE)._('</span></div>')
                    sb._('<div id="button"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_WELCOM_CLICK)._('</span></div>');
                sb._('</div>');
                sb._('<div class="box">');
                    sb._('<div class="think">')._(module.msg.FTT_MOD_TREE_CREATOR_BOX_STILL_THINK)._('?</div>');
                    sb._('<div class="text">');
                        sb._(module.msg.FTT_MOD_TREE_CREATOR_BOX_TEXT_1);
                        sb._(' <a id="famous" href="http://familytreetop.com/index.php/famous-family">');
                            sb._(module.msg.FTT_MOD_TREE_CREATOR_BOX_FAMOUS_FAMILY);
                        sb._('</a> ');
                        sb._(module.msg.FTT_MOD_TREE_CREATOR_BOX_TEXT_2);
                        sb._(' <a id="screen" target="_blank" href="http://screencast.com/t/kgymFc1Cg3oe">');
                            sb._(module.msg.FTT_MOD_TREE_CREATOR_BOX_HERE);
                        sb._('</a> ');
                        sb._(module.msg.FTT_MOD_TREE_CREATOR_BOX_TEXT_3);
                    sb._('.</div>');
                    sb._('<div class="image"><img src="http://familytreetop.com/zzzfiles/big-family-line-800.png"></div>');
                sb._('</div>');
                return  module.body = jQuery(sb.result());
            }
            function isExistUser(u){
                return u != null && typeof(u.facebookId) != 'undefined';
            }
            function getUser(){
                return module.fProfile = storage.usertree.usermap;
            }
            function getArguments(u,r){
                return JSON.stringify({me:u.facebookFields, friends:r.data});
            }
            function getJSON(d){
                return module.initData = storage.getJSON(d.responseText);
            }
            function getFacebookFriends(c){
                FB.api('/me/friends', function(r){
                    c(r);
                });
                return true;
            }
            function setMsg(data){
                var msg = data.msg;
                for(var key in module.msg){
                    if(typeof(msg[key]) != 'undefined'){
                        module.msg[key] = msg[key];
                    }
                }
                return true;
            }
        }
	}

	fn.init();
}


