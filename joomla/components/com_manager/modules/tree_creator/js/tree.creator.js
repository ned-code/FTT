function JMBTreeCreatorObject(parent){
	var module = this, fn;
	
	module.body = null;
	module.dialog_box = null;
	module.error_message = '';
	module.args_pull = [];
	module.request_pull = {};
	module.reload = false;
	module.request_send = false;
	
	module.path = 'modules/tree_creator/'
	module.css_path = [storage.baseurl,storage.url,module.path,'css/'].join('');
	module.female = 'female.png';
	module.male = 'male.png';
	module.titles = ['About Self','Your Mother','Your Father','Finish'];
	module.title_count = 0;
	module.dialog_settings = {
		width:600,
		height:400,
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
		width:510,
		height:450,
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

	
	fn = {
		ajax:function(func, params, callback){
			host.callMethod("tree_creator", "TreeCreator", func, params, function(res){
					callback(res);
			})
		},
		body:function(){
			var sb = host.stringBuffer();
			sb._('<div id="button"><span>Connect to Family TreeTop</span></div>');
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
					sb._('<option value="f">Famale</option>');
					sb._('<option value="m">Male</option>');
				sb._('</select>');
				return sb.result();
			},
			living:function(){
				var sb = host.stringBuffer();
				sb._('<select name="living">');
					sb._('<option value="1">Yes</option>');
					sb._('<option value="0">No</option>');
				sb._('</select>');
				return sb.result();
			},
			relations:function(){
				var sb = host.stringBuffer();
				sb._('<select name="relations">');
					sb._('<option value="Father">Father</option>');
					sb._('<option value="Mother">Mother</option>');
					sb._('<option value="Brother">Brother</option>');
					sb._('<option value="Sister">Sister</option>');
					sb._('<option value="Son">Son</option>');
					sb._('<option value="Daughter">Daughter</option>');
					sb._('<option value="Uncle">Uncle</option>');
					sb._('<option value="Niece">Niece</option>');
					sb._('<option value="Nephew">Nephew</option>');
					sb._('<option value="Aunt">Aunt</option>');
					sb._('<option value="Cousin">Cousin</option>');
					sb._('<option value="Grandmother">Grandmother</option>');
					sb._('<option value="Grandfather">Grandfather</option>');
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
									sb._('<td><div class="title"><span>Gender:</span></div></td>');
									sb._('<td>')._(fn.select.gender())._('</td>');
									sb._('<td><div class="title"><span>Living:</span></div>')._(fn.select.living())._('</td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>First Name:</span></div></td>');
									sb._('<td colspan="2"><div><input name="first_name" class="text" type="text"></div></td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>Middle Name:</span></div></td>');
									sb._('<td colspan="2"><div><input name="middle_name" class="text" type="text"></div></td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>Last Name:</span></div></td>');
									sb._('<td colspan="2"><div><input name="last_name" class="text" type="text"></div></td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>Know As:</span></div></td>');
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
									sb._('<td><div class="title"><span>Born:</span></div></td>');
									sb._('<td>');
										sb._(fn.select.days('b_'));
										sb._(fn.select.month('b_'));
										sb._('<input name="b_year" class="year" maxlength="4" placeholder="Year" type="text">');
									sb._('</td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td><div class="title"><span>Birthplace:</span></div></td>');
									sb._('<td>');
										sb._('<input class="place" name="b_city" placeholder="Town/City" type="text">');
										sb._('<input class="place" name="b_state" placeholder="Prov/State" type="text">');
										sb._('<input class="place" name="b_country" placeholder="Country" type="text">');
									sb._('</td>');
								sb._('</tr>');
								sb._('<tr id="death_date" style="display:none;">');
									sb._('<td><div class="title"><span>Death:</span></div></td>');
									sb._('<td>');
										sb._(fn.select.days('d_'));
										sb._(fn.select.month('d_'));
										sb._('<input name="d_year" class="year" maxlength="4" placeholder="Year" type="text">');
									sb._('</td>');
								sb._('</tr>');
								sb._('<tr id="death_place" style="display:none;">');
									sb._('<td><div class="title"><span>Deathplace:</span></div></td>');
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
			sb._('<div class="next"><span>Next</span></div>');
			sb._('</div>');
			return jQuery(sb.result());
		},
		request_form_box:function(args){
			var sb = host.stringBuffer();
			sb._('<table>');
				if(args){
					sb._('<tr style="height: 88px;">');
						sb._('<td valign="top"><div class="facebook_avatar"><img src="index.php?option=com_manager&task=getResizeImage&fid=')._(args.me.id)._('&w=72&h=80" width="72px" height="80px"></div></td>');
						sb._('<td valign="top"><span style="font-weight: bold;margin-left: 5px;">Gender:</span> ')._(fn.select.gender())._('</td>');
					sb._('</tr>');
				}
				sb._('<tr>');
					sb._('<td><div class="title"><span>Name:</span></div></td>');
					if(args){
						sb._('<td><div class="text"><input name="name" type="text" value="')._(args.me.name)._('"></div></td>');
					} else{
						sb._('<td><div class="text"><input name="name" type="text"></div></td>');
					}
				sb._('</tr>');
				if(args){
					sb._('<tr>');
						sb._('<td><div class="title"><span>Know as:</span></div></td>');
						sb._('<td><div class="text"><input name="nick" type="text"></div></td>');
					sb._('</tr>');
				}
				sb._('<tr>');
					sb._('<td><div class="title"><span>Birth Year:</span></div></td>');
					sb._('<td><div class="text"><input name="b_year" type="text"></div></td>');
				sb._('</tr>');
				sb._('<tr>');
					sb._('<td><div  class="title"><span>Birth Place:</span></div></td>');
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
									sb._('<div class="box_title"><span>You</span></div>');
									sb._('<div class="user_box">')._(fn.request_form_box(args))._('</div>');
								sb._('</div>');
							sb._('</td>');
							sb._('<td>');
								sb._('<div class="box">');
									sb._('<div class="box_title"><span>Your Mother</span></div>');
									sb._('<div class="mother_box">')._(fn.request_form_box())._('</div>');
								sb._('</div>');
							sb._('</td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td>');
								sb._('<div class="box">');
									sb._('<div class="box_title"><span>Your Father</span></div>');
									sb._('<div class="father_box">')._(fn.request_form_box())._('</div>');
								sb._('</div>');
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
				sb._('</div>');
				sb._('<div class="message">');
					sb._('<div class="title"><span>Message:</span></div>');
					sb._('<div class="text"><textarea></textarea></div>');
				sb._('</div>');
				sb._('<div class="button"><span>Send Request to ')._(args.target.name)._('</span></div>');
			sb._('</div>');
			return jQuery(sb.result());
		},
		create_dialog_window:function(){
			jQuery(module.dialog_box).dialog(module.dialog_settings);
			jQuery(module.dialog_box).parent().addClass('ftt_tree_creator');
			jQuery(module.dialog_box).parent().css('top', '20px');
		},
		connect_to_family_treetop:function(body){
			jQuery(body).click(function(){
				fn.create_dialog_window();
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
				fn.ajax('send_request', fn.json_to_string(pull), function(res){
					var response = jQuery.parseJSON(res.responseText);
					if(response.error){
						alert(response.error);
						module.request_send = false;
						return false;
					} else if(response.success){
						jQuery(form).dialog('close');
					}
				});
			});
		},
		send_friend_request:function(e){
			var target = e.currentTarget;
			var facebook_id = jQuery(target).attr('facebook_id');
			var gedcom_id = jQuery(target).attr('gedcom_id');
			var user_name = jQuery(target).attr('user_name');
			FB.api('/me', function(res){
				var args = {me:res, target:{name:user_name, facebook_id:facebook_id, gedcom_id:gedcom_id}};
				var request_form = fn.request_form(args);				
				var option = jQuery(request_form).find('select[name="gender"]').find('option');
				jQuery(option[(res.gender=='male')?1:0]).attr('selected', 'selected');
				jQuery(module.dialog_box).dialog('close');
				jQuery(request_form).dialog(module.request_settings);
				jQuery(request_form).dialog('option', 'title', 'Family TreeTop - Invitation Request');
				jQuery(request_form).parent().addClass('ftt_tree_creator');
				jQuery(request_form).parent().css('top', '20px');
				fn.request_form_event(request_form, args);
			});
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
					alert(module.error_message);
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
		set_title:function(user_form){
			jQuery(user_form).dialog('option', 'title', module.titles[module.title_count]);
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
		convert_to_string:function(args_pull){
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
			return string.substr(0, string.length -1) + '}';
		},
		finish_create:function(user_form){
			var sb = host.stringBuffer();
			sb._(fn.box('Self', module.args_pull[0]));
			sb._(fn.box('Mother', module.args_pull[1]));
			sb._(fn.box('Father', module.args_pull[2]));
			sb._('<div class="finish_button"><span>Create Tree</span></div>');
			jQuery(user_form).html(sb.result());
			jQuery(user_form).find('.finish_button').click(function(){
				var query = fn.convert_to_string(module.args_pull);
				fn.ajax('create_tree', query, function(res){
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
					sb._('<div class="switch_to_myfamily"><span>Switch to MyFamily</span></div>')
					jQuery(user_form).html(sb.result());
					jQuery(user_form).dialog('option', 'width', 500);
					jQuery(user_form).find('.finish_button').click(function(){
						window.location.reload();
					});
				});
			});
		},
		create_new_tree:function(e){
			var user_form = fn.user_form();
			jQuery(module.dialog_box).dialog('close');
			jQuery(user_form).dialog(module.create_tree_settings);
			jQuery(user_form).parent().addClass('ftt_tree_creator');
			jQuery(user_form).parent().css('top', '20px');
			fn.set_title(user_form);
			fn.user_form_events(user_form);
		},
		set_facebook_friends:function(html){
			var cont = jQuery(html).find('div.tc_ftt_friends');
			FB.api('/me/friends', function(response){
				var data = response.data;
				var query = '{';
				for(var key in data){
					query += '"'+data[key].id+'":"'+data[key].name+'",';
				}
				query = query.substr(0, query.length - 1)+'}';
				fn.ajax('verify_facebook_friends', query, function(res){
					var json = jQuery.parseJSON(res.responseText);
					var ul = jQuery('<ul></ul>');
					jQuery(json.result).each(function(i, el){
						var li = jQuery('<li></li>');
						var sb = host.stringBuffer();
						sb._('<table>');
							sb._('<tr>');
								sb._('<td>');
									sb._('<div class="avatar">');
										sb._('<img src="index.php?option=com_manager&task=getResizeImage&fid=')._(el.facebook_id)._('&w=50&h=50">');
									sb._('</div>');
								sb._('</td>');
								sb._('<td><div class="name">')._(el.name)._('</div></td>');
								sb._('<td>');
									sb._('<div class="request" user_name="')._(el.name)._('" facebook_id="')._(el.facebook_id)._('" gedcom_id="')._(el.gedcom_id)._('">');
										sb._('<span>Request Invitation</span>');
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
				});
			});
			
		},
		set_start_content:function(dialog_box){
			var sb = host.stringBuffer();
			sb._('<div class="tc_content">');
				sb._('<div class="tc_header">');
					sb._('<div><span>Are You Related?</span></div>');
					sb._('<div><span>Some of your Facebook friends are members of Family TreeTop. Are you related to any of the people listed below? If so, you many request an invitation to join their familytree.</span></div>');
				sb._('</div>');
				sb._('<div class="tc_ftt_friends">');
				sb._('</div>');
				sb._('<div class="tc_footer">');
					sb._('<div><span>if you are not related to anyone listed below, <span class="button">click here</span> to create new Family Tree</span></div>');
				sb._('</div>');
			sb._('</div>');
			var html = jQuery(sb.result());
			jQuery(html).find('div.tc_footer span.button').click(fn.create_new_tree);
			fn.set_facebook_friends(html);
			jQuery(dialog_box).append(html);
		},
		init:function(){
			var body = fn.body();
			var dialog_box = fn.dialog_box();
			module.body = body;
			module.dialog_box = dialog_box;
			jQuery(parent).append(body);
			fn.connect_to_family_treetop(body);
			fn.set_start_content(dialog_box);
			
		}
	}
	
	fn.init();
}

/*
function JMBTreeCreatorObject(obj){
	this.html = null;
	
	this.obj = jQuery(['#',obj].join(''));
	
	if(jQuery("#iframe-tree-creator").length==0){
		var iframe = '<iframe id="iframe-tree-creator" name="#iframe-tree-creator" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">';
		jQuery(document.body).append(iframe);
	}	
	this.create();
	this.buttons();
}

JMBTreeCreatorObject.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("tree_creator", "TreeCreator", func, params, function(req){
				callback(req);
		})
	},
	_ajaxForm:function(obj, method, args, before,callback){
		var sb = host.stringBuffer();
		var url = sb._('index.php?option=com_manager&task=callMethod&module=tree_creator&class=TreeCreator&method=')._(method)._('&args=')._(args).result();
		jQuery(obj).ajaxForm({
			url:url,
			dataType:"json",
			target:"#iframe-tree-creator",
			beforeSubmit:function(){
				return before();	
			},
			success:function(data){
				callback(data);
			}
		});
	},
	createTree:function(){
		this._ajax('create', null, function(){
			window.location.reload();
		});
	},
	createTreeWithGedcom:function(){
		jQuery(this.html).find('table').hide();
		jQuery(this.html).find('div.upload').show();
	},
	getName:function(object){
		var result = [];
		(object.FirstName!=null)?result.push(object.FirstName):null;
		(object.MiddleName!=null)?result.push(object.MiddleName):null;
		(object.LastName!=null)?result.push(object.LastName):null;
		return result.join(' ');
	},
	buttons:function(){
		var self = this;
		jQuery(this.html).find('div.button').click(function(){
			var id = jQuery(this).attr('id');
			switch(id){
				case "tree": self.createTree(); break;
				case "gedcom": self.createTreeWithGedcom(); break;
			}
			return false;
		});
	},
	parse:function(e){
		var arr = [];
		jQuery(e).each(function(i,e){
			arr.push(e.Id);
		});
		return arr.join(',');
	},
	resultHandler:function(object){
		var self = this;
		jQuery(object).find('input').click(function(){
			var id = jQuery(this).attr('id');
			var indKey = jQuery(object).find('select option:selected').val();
			self._ajax(id, indKey, function(){
				if(id==="cancel"){
					jQuery(self.html).find('div.upload').hide();
					jQuery(self.html).find('div.result').html('');
					jQuery(self.html).find('table').show();
				}else {
					window.location.reload();
				}	
			});
		})
	},
	result:function(elements){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div><span>Find yourself:</span><select>');
			jQuery(elements).each(function(i,e){
				sb._('<option value="')._(e.Id)._('">')._(self.getName(e))._('</option>');
			});
		sb._('</select><input id="send" type="button" value="Send"><input id="cancel" type="button" value="Cancel">');
		return sb.result();
	},
	create:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div class="jmb-tree-creator-body">')
			sb._('<table>');
				sb._('<tr>');
					sb._('<td>')
						sb._('<div class="tree">');
							sb._('<div id="tree" class="button">Create Tree</div>');
							sb._('<fieldset><legend>Tree</legend>Creating a genealogy tree is easy with Family Tree Top.</fieldset>');
						sb._('</div>');
					sb._('</td>');
				sb._('</tr>');
				sb._('<tr>');
					sb._('<td>');
						sb._('<div class="gedcom">');
							sb._('<div id="gedcom" class="button">Create Tree With Gedcom</div>');
							sb._('<fieldset><legend>Gedcom</legend>Creating a genealogy tree is easy with Family Tree Top.</fieldset>');
						sb._('</div>');
					sb._('</td>');
				sb._('</tr>');
			sb._('</table>');
			sb._('<div class="upload" style="display:none;">');
				sb._('<div class="form"><form id="jmb:profile:addspouse" method="post" target="iframe-profile"><input type="file" name="upload"><input type="submit" value="Upload"></form></div>');
				sb._('<div class="result"></div>')
			sb._('</div>');
		sb._('</div>');
		this.html = jQuery(sb.result());
		self._ajaxForm(jQuery(this.html).find('form'), 'upload', null,function(){ }, function(json){
			var select = jQuery(self.result(json.res.Individuals));
			var div = jQuery(self.html).find('div.result');
			jQuery(div).html('');
			jQuery(div).append(select);
			self.resultHandler(select);
			var args = self.parse(json.res.Individuals)+';'+[json.res.Families].join(',');
		});
		jQuery(this.obj).append(this.html);
	}
}
*/



