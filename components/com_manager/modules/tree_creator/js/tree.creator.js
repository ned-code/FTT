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
		width:470,
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
		body:function(){
			var sb = host.stringBuffer();
            sb._('<div>');
                sb._('<div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_WELCOM)._('</span></div>');
                sb._('<div class="description"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_WELCOM_MESSAGE)._('</span></div>')
                sb._('<div id="button"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_WELCOM_CLICK)._('</span></div>');
            sb._('</div>');
            sb._('<div class="box">');


                sb._('<div class="think">')._(module.msg.FTT_MOD_TREE_CREATOR_BOX_STILL_THINK)._('?</div>');
                sb._('<div class="text">');
                sb._(module.msg.FTT_MOD_TREE_CREATOR_BOX_TEXT_1)._(' <a id="famous" href="http://familytreetop.com/index.php/famous-family">')._(module.msg.FTT_MOD_TREE_CREATOR_BOX_FAMOUS_FAMILY)._('</a> ')._(module.msg.FTT_MOD_TREE_CREATOR_BOX_TEXT_2);
                sb._(' <a id="screen" target="_blank" href="http://screencast.com/t/kgymFc1Cg3oe">')._(module.msg.FTT_MOD_TREE_CREATOR_BOX_HERE)._('</a> ')._(module.msg.FTT_MOD_TREE_CREATOR_BOX_TEXT_3)._('.</div>');
                sb._('<div class="image"><img src="http://familytreetop.com/zzzfiles/big-family-line-800.png"></div>');
            sb._('</div>');
			return jQuery(sb.result());
		},
		dialog_box:function(){
			var sb = host.stringBuffer();
			sb._('<div id="dialog_box" class="dialog_box"></div>');
			return jQuery(sb.result());
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
        user_form:function(type){
			var sb = host.stringBuffer();
			sb._('<div class="tree_create_user_form"><table>');
				sb._('<tr>');
					sb._('<td>');
						sb._('<div class="avatar"><img src="')._(module.css_path)._(module.female)._('" width="135px" height="150px"></div>')
					sb._('</td>');
					sb._('<td>');
						sb._('<div class="user_data">');
							sb._('<table>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_GENDER)._(':</span></div></td>');
									sb._('<td>')._(fn.select.gender())._('</td>');
									sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_LIVING)._(':</span></div>')._(fn.select.living())._('</td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_FIRSTNAME)._(':</span></div></td>');
									sb._('<td colspan="2"><div><input name="first_name" class="text" type="text"></div></td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_MIDDLENAME)._(':</span></div></td>');
									sb._('<td colspan="2"><div><input name="middle_name" class="text" type="text"></div></td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_LASTNAME)._(':</span></div></td>');
									sb._('<td colspan="2"><div><input name="last_name" class="text" type="text"></div></td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_KNOWAS)._(':</span></div></td>');
									sb._('<td colspan="2"><div><input name="nick" class="text" type="text"></div></td>');
								sb._('</tr>');
							sb._('</table>');
						sb._('</div>')
					sb._('</td>');
				sb._('</tr>');
                sb._('<tr>');
					sb._('<td colspan="2">');
						sb._('<div class="user_date">');
							sb._('<table>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_BORN)._(':</span></div></td>');
									sb._('<td>');
										sb._(fn.select.days('b_'));
										sb._(fn.select.month('b_'));
										sb._('<input name="b_year" class="year" maxlength="4" placeholder="Year" type="text">');
									sb._('</td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_BIRTHPLACE)._(':</span></div></td>');
									sb._('<td>');
										sb._('<input class="place" name="b_city" placeholder="Town/City" type="text">');
										sb._('<input class="place" name="b_state" placeholder="Prov/State" type="text">');
										sb._('<input class="place" name="b_country" placeholder="Country" type="text">');
									sb._('</td>');
								sb._('</tr>');
								sb._('<tr id="death_date" style="display:none;">');
									sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_DEATH)._(':</span></div></td>');
									sb._('<td>');
										sb._(fn.select.days('d_'));
										sb._(fn.select.month('d_'));
										sb._('<input name="d_year" class="year" maxlength="4" placeholder="Year" type="text">');
									sb._('</td>');
								sb._('</tr>');
								sb._('<tr id="death_place" style="display:none;">');
									sb._('<td><div class="title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_DEATHPLACE)._(':</span></div></td>');
									sb._('<td>');
										sb._('<input class="place" name="d_city" placeholder="Town/City" type="text">');
										sb._('<input class="place" name="d_state" placeholder="Prov/State" type="text">');
										sb._('<input class="place" name="d_country" placeholder="Country" type="text">');
									sb._('</td>');
								sb._('</tr>');
							sb._('</table>');
						sb._('</div>')
					sb._('</td>');
				sb._('</tr>');
			sb._('</table>')
			sb._('<div class="next"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_USERFORM_NEXT)._('</span></div>');
			sb._('</div>');
			return jQuery(sb.result());
		},
		request_form_box:function(args){
			var sb = host.stringBuffer();
			sb._('<table>');
				if(args){
					sb._('<tr style="height: 88px;">');
						//sb._('<td valign="top"><div class="facebook_avatar">')._(storage.usertree.avatar.def_image({ width:72, height:80 }, args.me.gender.substr(0, 1).toUpperCase() ))._('</div></td>');
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
		},
		request_form:function(args){
			var sb = host.stringBuffer();
			sb._('<div class="tree_create_request_form">');
				sb._('<div class="relation">')._(args.target.name)._(' is your: ')._(fn.select.relations())._('</div>');
				sb._('<div class="data">');
					sb._('<table>');
						sb._('<tr>');
							sb._('<td rowspan="2" valign="top">');
								sb._('<div class="box">');
									sb._('<div class="box_title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_FORM_YOU)._('</span></div>');
									sb._('<div class="user_box">')._(fn.request_form_box(args))._('</div>');
								sb._('</div>');
							sb._('</td>');
							sb._('<td>');
								sb._('<div class="box">');
									sb._('<div class="box_title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_FORM_YOU_MOTHER)._('</span></div>');
									sb._('<div class="mother_box">')._(fn.request_form_box())._('</div>');
								sb._('</div>');
							sb._('</td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td>');
								sb._('<div class="box">');
									sb._('<div class="box_title"><span>')._(module.msg.FTT_MOD_TREE_CREATOR_FORM_YOU_FATHER)._('</span></div>');
									sb._('<div class="father_box">')._(fn.request_form_box())._('</div>');
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
        },
		create_dialog_window:function(){
			jQuery(module.dialog_box).dialog(module.dialog_settings);
			jQuery(module.dialog_box).parent().addClass('ftt_tree_creator');
			jQuery(module.dialog_box).parent().css('top', '20px');
		},
		connect_to_family_treetop:function(body){
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
			jQuery(body).find('div#button span').click(function(){
                if(module.initData.request){
                    if(confirm(module.initData.request)){
                        fn.ajax('abortRequest', null, function(){
                            module.initData.request = false;
                            storage.alert(module.msg.FTT_MOD_TREE_CREATOR_ALERT_ABORT_REQUEST, function(){
                                fn.create_dialog_window();
                            });

                        });
                        return false;
                    } else {
                        return false;
                    }
                } else {
                    fn.create_dialog_window();
                }
			});
		},
		get_request_form_box_data:function(object){
			var pull = {};
			jQuery(object).find('input, select').each(function(i, el){
				var name = jQuery(el).attr('name');
				var value = jQuery(el).attr('value');
				pull[name] = value;
			});
			return pull;
		},
		json_to_string:function(json){
			var string = '{';
			for(var key in json){
				if(typeof(json[key]) == 'object'){
					string += '"'+key+'":'+fn.json_to_string(json[key])+',';
				} else {
					string += '"'+key+'":"'+json[key]+'",';
				}	
			}
			string = string.substr(0, string.length -1) + '}';
			return string;
		},
        request_from_validate:function(form, callback){
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
        },
		request_form_event:function(form, args){
			jQuery(form).find('.button').click(function(){
				if(module.request_send) return false;
				module.request_send = true;
				var pull = {
					me:args.me,
					target: args.target,
					relation:jQuery(form).find('select[name="relations"]').val(),
					user_info:fn.get_request_form_box_data(jQuery(form).find('.user_box')),
					mother_info:fn.get_request_form_box_data(jQuery(form).find('.mother_box')),
					father_info:fn.get_request_form_box_data(jQuery(form).find('.father_box')),
					message:jQuery(form).find('div.message textarea').val()
				};
                fn.request_from_validate(form, function(valid){
                    if(valid){
                        fn.ajax('send_request', fn.json_to_string(pull), function(res){
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
		},
		send_friend_request:function(e){
			var target = e.currentTarget;
			var facebook_id = jQuery(target).attr('facebook_id');
			var gedcom_id = jQuery(target).attr('gedcom_id');
			var user_name = jQuery(target).attr('user_name');
            var res = module.fProfile;
			var args = {me:res, target:{name:user_name, facebook_id:facebook_id, gedcom_id:gedcom_id}};
			var request_form = fn.request_form(args);
			var option = jQuery(request_form).find('select[name="gender"]').find('option');
            jQuery(request_form).find('select[name="gender"]').change(function(){
                var gender = jQuery(this).val();
                var avatarDiv = jQuery(request_form).find('div.facebook_avatar');
                    //jQuery(avatarDiv).html('');
                    //jQuery(avatarDiv).append(storage.usertree.avatar.def_image({ width:72, height:80 }, gender.toUpperCase()));
            });
			jQuery(option[(res.gender=='male')?1:0]).attr('selected', 'selected');
			jQuery(module.dialog_box).dialog('close');
			jQuery(request_form).dialog(module.request_settings);
			jQuery(request_form).dialog('option', 'title', 'Family TreeTop - Invitation Request');
			jQuery(request_form).parent().addClass('ftt_tree_creator');
			jQuery(request_form).parent().css('top', '20px');
			fn.request_form_event(request_form, args);
		},
		verify_date:function(prefix, user_form){
			var day = jQuery(user_form).find('select[name="'+prefix+'day"]').val();
			var month = jQuery(user_form).find('select[name="'+prefix+'month"]').val();
			var year = jQuery(user_form).find('input[name="'+prefix+'year"]').val();
			var date = new Date((year.length!=0)?year:1900, (month!=0)?month-1:0, (day!=0)?day:1);
			if(day!=0&&date.getDate()!= day){
				return false;
			}
			if(month!=0&&date.getMonth()!=month-1){
				return false;
			}
			if(year.length!=0&&date.getFullYear()!=year){
				return false;
			}
			return true;
		},
		verify_data:function(user_form){
			var first_name = jQuery(user_form).find('input[name="first_name"]').val();
			var last_name = jQuery(user_form).find('input[name="last_name"]').val();
			if(first_name.length==0||last_name.length==0){
				module.error_message = 'Fill in the First Name and Last Name';
				return false;
			}
			if(!fn.verify_date('b_', user_form)){
				module.error_message = 'Invalid Date of Born';
				return false;
			}
			if(!fn.verify_date('d_', user_form)){
				module.error_message = 'Invalid Date of Death';
				return false;
			}
			return true;
		},
		user_form_events:function(user_form){
			var death_date = jQuery(user_form).find('tr#death_date');
			var death_place = jQuery(user_form).find('tr#death_place');
			jQuery(user_form).find('select[name="living"]').change(function(){
				if(parseInt(jQuery(this).val())){
					jQuery(death_date).hide();
					jQuery(death_place).hide();
				} else {
					jQuery(death_date).show();
					jQuery(death_place).show();
				}
			});
			jQuery(user_form).find('select[name="gender"]').change(function(){
				var val = (jQuery(this).val()=='f')?module.female:module.male;
				jQuery(user_form).find('div.avatar img').attr('src', module.css_path+val);
			});
			jQuery(user_form).find('div.next').click(function(){
				if(!fn.verify_data(user_form)){
                    storage.alert(module.error_message, function(){});
					return false;
				}
				var args = {};
				jQuery(user_form).find('input,select').each(function(i, el){
					var val = jQuery(el).val();
					var name = jQuery(el).attr('name');
					args[name] = val;
				});
				module.args_pull.push(args);
				module.title_count++;
				fn.set_title(user_form);
				if(module.title_count < 3){
					fn.clear_form(user_form);
				} else {
					fn.finish_create(user_form);
				}
			});
			
		},
        get_title:function(c){
            switch(c){
                case 0:
                    return module.msg.FTT_MOD_TREE_CREATOR_TITLES_ABOUT_YOURSELF;
                break;
                case 1:
                    return module.msg.FTT_MOD_TREE_CREATOR_TITLES_YOUR_MOTHER;
                break;
                case 2:
                    return module.msg.FTT_MOD_TREE_CREATOR_TITLES_YOUR_FATHER;
                break;
                case 3:
                    return module.msg.FTT_MOD_TREE_CREATOR_TITLES_GETTING_STARTED;
                break;
                default:
                    return '';
                break;
            }
        },
		set_title:function(user_form){
			jQuery(user_form).dialog('option', 'title',fn.get_title(module.title_count));
		},
		clear_form:function(user_form){
			jQuery(user_form).find('input').each(function(i, el){
				jQuery(el).val('');
			});
			jQuery(user_form).find('select').each(function(i, el){
				if(jQuery(el).attr('name') == 'gender' && module.title_count == 2){
					jQuery(el).find('option:last').attr("selected", "selected");
				} else {
					jQuery(el).find('option:first').attr("selected", "selected");
				}
				jQuery(el).change();
			});
		},
		box:function(title, args){
			var sb = host.stringBuffer();
			sb._('<div class="box">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td rowspan="4"><div class="avatar"><img src="')._(module.css_path)._((args.gender=='f')?module.female:module.male)._('" width="40px" height="45px"></div></td>');
					sb._('</tr>');
					sb._('<tr>');
						sb._('<td><div class="title">')._(title)._(':</div></td>');
						sb._('<td><div class="value">')._([args.first_name,args.last_name].join(' '))._('</div></td>');
					sb._('</tr>');
				sb._('</table>');
			sb._('</div>');
			return sb.result();
		},
		convert_to_string:function(args_pull, callback){
            var user = storage.usertree.user;
            if(user != null && typeof(user.id) != 'undefined'){
                var title = ['self','mother','father'];
                var string = '{';
                jQuery(args_pull).each(function(i, el){
                    string += '"'+title[i]+'":{'
                    for(var key in el){
                        string += '"'+key+'":"'+el[key]+'",';
                    }
                    string = string.substr(0, string.length -1);
                    string += '},';
                });
                string += '"facebook_id":"'+user.id+'"';
                string += '}';
                callback(string);
            }
		},
		finish_create:function(user_form){
			var sb = host.stringBuffer();
			sb._(fn.box('Self', module.args_pull[0]));
			sb._(fn.box('Mother', module.args_pull[1]));
			sb._(fn.box('Father', module.args_pull[2]));
			sb._('<div class="finish_button"><span>Create Tree</span></div>');
			jQuery(user_form).html(sb.result());
			jQuery(user_form).find('.finish_button').click(function(){
				fn.convert_to_string(module.args_pull, function(query){
                    fn.ajax('create_tree', query, function(res){
                        var json = storage.getJSON(res.responseText);
                        if(json.error){
                            if(confirm(json.error)){
                                fn.ajax('abortRequest', null, function(){
                                    storage.alert(module.msg.FTT_MOD_TREE_CREATOR_ALERT_ABORT_REQUEST_TRY_AGAIN, function(){});
                                });
                                return false;
                            } else {
                                jQuery(user_form).dialog('close');
                                return false;
                            }
                        }
                        module.reload = true;
                        sb.clear();
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
                        sb._('<div class="switch_to_myfamily"><span>Go to my Family Tree</span></div>')
                        jQuery(user_form).html(sb.result());
                        jQuery(user_form).dialog('option', 'width', 500);
                        jQuery(user_form).find('.switch_to_myfamily').click(function(){
                            window.location.reload();
                        });
                    });
                });
			});
		},
        set_user_data:function(form, callback){
          var user = storage.usertree.user;
          if(user != null && typeof(user.id) != 'undefined'){
              jQuery(form).find('div.avatar').html('<img width="135px" height="150px" src="https://graph.facebook.com/'+user.id+'/picture" />');
              jQuery(form).find('input[name="first_name"]').val(user.first_name);
              jQuery(form).find('input[name="last_name"]').val(user.last_name);
              jQuery(form).find('select[name="gender"] option[value="'+user.gender[0]+'"]').attr('selected', 'selected');
              callback();
          }
        },
		create_new_tree:function(e){
			var user_form = fn.user_form();
            fn.set_user_data(user_form, function(){
                jQuery(module.dialog_box).dialog('close');
                jQuery(user_form).dialog(module.create_tree_settings);
                jQuery(user_form).parent().addClass('ftt_tree_creator');
                jQuery(user_form).parent().css('top', '20px');
                fn.set_title(user_form);
                fn.user_form_events(user_form);
            });
		},
		set_facebook_friends:function(html){
			var cont = jQuery(html).find('div.tc_ftt_friends');
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
            jQuery(ul).find('div.request').click(fn.send_friend_request);
		},
        set_start_content:function(dialog_box){
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
			var html = jQuery(sb.result());
			jQuery(html).find('div.tc_footer span.button').click(fn.create_new_tree);
			fn.set_facebook_friends(html);
			jQuery(dialog_box).append(html);
		},
        get_facebook_friends_string:function(callback){
            FB.api('/me/friends', function(response){
                callback(response);
            });
        },
		init:function(){
            var user = storage.usertree.user;
            if(user != null && typeof(user.id) != 'undefined'){
                module.fProfile = user;
                fn.get_facebook_friends_string(function(response){
                    var args = JSON.stringify({me:module.fProfile, friends:response.data});
                    fn.ajax('init', args, function(res){
                        module.initData = storage.getJSON(res.responseText);
                        if(typeof(module.initData.msg) != 'undefined'){
                            module.msg = module.initData.msg;
                        }
                        var body = fn.body();
                        var dialog_box = fn.dialog_box();
                        module.body = body;
                        module.dialog_box = dialog_box;
                        jQuery(parent).append(body);
                        fn.connect_to_family_treetop(body);
                        fn.set_start_content(dialog_box);
                    });
                });
            }
		}
	}
	
	fn.init();
}

