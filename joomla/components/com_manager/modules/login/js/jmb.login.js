function JMBLogin(){
	var	module = this,
		fn,
		settings = {},
		notifications,
		fb_logged;

	if(window!=window.top){
		module.init = function(callback){ 
			host.callMethod("login", "JMBLogin", 'user', null, function(res){
				json = jQuery.parseJSON(res.responseText);
				if(json.user_id != null){
					storage.usertree.user = json.user_id;
					storage.usertree.pull = json.usertree;
				}
				callback();
			});
		}
		return false;
	}
	
	//init vars
	type = jQuery(document.body).attr('_type');
	alias = jQuery(document.body).attr('_alias');
	path = "/components/com_manager/modules/login/imgs/";
	
	//init functions
	fn = {
		ajax:function(func, params, callback){
			host.callMethod("login", "JMBLogin", func, params, function(res){
				callback(res);
			});
		},
		create:function(){
			var sb = host.stringBuffer();
			sb._('<div class="jmb-profile-cont">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td><div class="avatar"></div></td>');
						sb._('<td><div class="login"><span></span></div></td>');
						sb._('<td><div class="settings"><div class="button"></div></div></td>');	
					sb._('</tr>');
				sb._('</table>');
			sb._('</div>');
			return jQuery(sb.result());
		},
		connect:function(){
			var sb = host.stringBuffer();
			sb._('<div class="jmb-profile-cont">');
				sb._('<div class="facebook"><span>Connect With Facebook</span></div>');
			sb._('</div>');
			return jQuery(sb.result());
		},
		langList:function(){
			var st = host.stringBuffer();
			st._('<ul>');
			jQuery(settings.languages).each(function(i,el){
				if(parseInt(el.published)){
					st._('<li id="')._(el.lang_code)._('">')._(el.title)._('</li>');	
				}
			});
			st._('</ul>');
			var html = jQuery(st.result());	
			return html;
		},
		getDefaultLang:function(){
			var lang = settings.languages;
			for(var key in lang){
				var l = lang[key];
				if(settings.default_language!=null){
					if(l.lang_code == settings.default_language){
						return l.title;
					}
				} else {
					if(parseInt(l.def)){
						return l.title;
					}
				}
			}
		},
		menu:function(){
			var module = this, menu, list, sb = host.stringBuffer();
			sb._('<div class="menu">');
				sb._('<div id="profile"><span>Profile</span></div>');
				sb._('<div id="preferences"><span>Preferences</span></div>');
				sb._('<div id="language"><span>Language: ')._(this.getDefaultLang())._('</span></div>');
				sb._('<div id="logout"><span>Log Out</span></div>');
			sb._('</div>');
			menu = jQuery(sb.result());
			return {
				on:function(object){
					jQuery(object).parent().append(menu);
					this.init();
					return this;
				},
				off:function(){
					jQuery(menu).remove();
					jQuery(menu).find('div').unbind();
					return this;
				},
				click:{
					profile:function(){
						storage.profile.editor('edit', {
							object:storage.usertree.pull[storage.usertree.user],
							events:{
								afterEditorClose:function(object){
									storage.usertree.pull[storage.usertree.user] = object;
								}
							}
						});
					},
					preferences:function(){},
					language:function(object){
						if(!jQuery(object).hasClass('collapse')){
							list = module.langList();
							jQuery(object).append(list);
							jQuery(object).addClass('collapse');
							jQuery(list).find('li').click(function(){
								if(confirm("Are you sure you want to set the language?")){
									fn.ajax('language', jQuery(this).attr('id'), function(res){
										window.location.reload();
									});
								}
								return false;
							});
						} else {
							jQuery(list).remove();
							jQuery(object).removeClass('collapse');
						}
						jQuery(object).removeClass('active');
					},
					logout:function(){
						FB.logout(function(){
							window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=logout&return=login';
						});
					},
				},
				init:function(){
					var _menu = this;
					jQuery(menu).find('div').click(function(){
						if(jQuery(this).hasClass('active')) return false;
						jQuery(menu).find('div').removeClass('active');
						jQuery(this).addClass('active');
						_menu.click[jQuery(this).attr('id')](this);
						return false;
					});
					return this;
				}
			}
	
		},
		login:function(cont){
			var json;
			jQuery(cont).find('div.facebook span').click(function(){
				FB.login(function(response){
					if(response.authResponse){
						window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=loginFacebookUser&return=myfamily';
					} else {
						alert('Login failed.')
					}
				});
			});
		},
		click:function(cont){
			var menu = this.menu();
			jQuery(cont).find('div.button').click(function(){
				if(jQuery(this).hasClass('active')){
					jQuery(this).removeClass('active');
					menu.off();
				} else {
					jQuery(this).addClass('active');
					menu.on(this);
				}
			});
		},
		setName:function(object, cont){
			var	box = jQuery(cont).find('div.login span'),parse;
			parse = storage.usertree.parse(object);
			jQuery(box).html(parse.name);		
		},
		setAvatar:function(object ,cont){
			var	box = jQuery(cont).find('div.avatar'),
				sb = host.stringBuffer(),
				parse,
				media,
				image;
			parse = storage.usertree.parse(object);
			media = object.media;
			if(media!=null&&media.avatar!=null){
				image = sb._('<img src="index.php?option=com_manager&task=getResizeImage&id=')._(media.avatar.media_id)._('&w=22&h=22">').result(); 
			} else {
				image = sb._('<img src="index.php?option=com_manager&task=getResizeImage&fid=')._(parse.facebook_id)._('&w=22&h=22">').result();
			}
			jQuery(box).html(image);
		},
		getAvatar:function(object){
			var 	sb = host.stringBuffer(), 
				parse = storage.usertree.parse(object), 
				media = object.media, 
				img = (parse.gender=="M")?'male.png':'female.png',
				src = storage.baseurl+path+img;
			if(media!=null&&media.avatar!=null){
				return sb._('<img src="index.php?option=com_manager&task=getResizeImage&id=')._(media.avatar.media_id)._('&w=50&h=50">').result(); 
			} else {
				return sb._('<img height="50px" width="50px" src="')._(src)._('">').result();
			}
		},
		famous:function(object){
			var	sb = host.stringBuffer(), parse = storage.usertree.parse(object), htmlObject;
			sb._('<div class="jmb-profile-famous-cont">');
				sb._('<table>');
					sb._('<tr><td><div class="text"><span>You logged in as:</span></div></td><td rowspan="3"><div class="avatar">')._(fn.getAvatar(object))._('</div></td></tr>');
					sb._('<tr><td><div class="name"><span>')._(parse.name)._('</span></div></td></tr>');
					sb._('<tr><td><div class="logout"><span>Exit this Family Trees</span></div></td></tr>');
				sb._('</table>');
			sb._('</div>');
			htmlObject = jQuery(sb.result());
			jQuery(htmlObject).find('div.logout span').click(function(){
				fn.ajax('famous', 'logout', function(res){
					window.location.reload();
				});
			});
			jQuery('div.jmb-header-container').append(htmlObject);
		},
		set_global_data:function(json){
			storage.usertree.gedcom_id = json.usertree.gedcom_id;
			storage.usertree.facebook_id = json.usertree.facebook_id;
			storage.usertree.tree_id = json.usertree.tree_id;
			storage.usertree.permission = json.usertree.permission;
			storage.usertree.users = json.usertree.users;
			storage.usertree.pull = json.usertree.pull;
			storage.notifications.init(json.notifications);
		},
		get_data_user:function(json){
			return json.usertree.pull[json.usertree.gedcom_id];
		},
		user:function(callback){
			var json, object;
			fn.ajax('user', null, function(res){
				json = jQuery.parseJSON(res.responseText);
				if(json.usertree){
					fn.set_global_data(json);
					settings.languages = json.languages;
					settings.default_language = json.default_language;
					object = fn.get_data_user(json);
					callback(object);
					return true;
				}
				callback(false);
				return false;
			});
		},
		init:function(callback){
			var cont, ch;
			fn.user(function(object){
				fb_logged = jQuery(document.body).attr('_fb');
				switch(alias){
					case "home":
					case "login":
					case "first-page":
					case "invitation":
					case "myfamily":
					case "famous-family":
						if(type=='myfamily'){
							if(!parseInt(fb_logged)){
								cont = fn.connect();
								fn.login(cont);
							} else {
								cont = fn.create();
								fn.setName(object, cont);
								fn.setAvatar(object, cont);
								if(!object.link){
									fn.click(cont);
								}
							}
							jQuery(document.body).append(cont);
						} else {
							fn.famous(object);
						}
					break;
				}
				callback();
			});
		}
	}
	
	module.init = fn.init;
}

