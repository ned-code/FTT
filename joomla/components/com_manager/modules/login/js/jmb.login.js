function JMBLogin(){
	var	module = this,
		fn,
		fb_logged;

	if(window!=window.top){
		jQuery(obj).hide();
		return false;
	}
	
	//init vars
	fb_logged = jQuery(document.body).attr('_fb');
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
		menu:function(){
			var menu, sb = host.stringBuffer();
			sb._('<div class="menu">');
				sb._('<div id="profile"><span>Profile</span></div>');
				sb._('<div id="preferences"><span>Preferences</span></div>');
				sb._('<div id="language"><span>Language: English</span></div>');
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
					language:function(){},
					logout:function(){
						FB.logout(function(){
							window.location.reload();
						});
					},
				},
				init:function(){
					var _menu = this;
					jQuery(menu).find('div').click(function(){
						if(jQuery(this).hasClass('active')) return false;
						jQuery(menu).find('div').removeClass('active');
						jQuery(this).addClass('active');
						_menu.click[jQuery(this).attr('id')]();
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
						json = '{"access_token":"'+response.authResponse.accessToken+'"}';
						fn.ajax('facebook', json, function(){
							window.location.reload();
						});
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
			var	box = jQuery(cont).find('div.login span'),parse, name;
			if(object.link){
				jQuery(box).html(object.name);
			} else {
				parse = storage.usertree.parse(object);
				jQuery(box).html(parse.name);	
			}		
		},
		setAvatar:function(object ,cont){
			var	box = jQuery(cont).find('div.avatar'),
				sb = host.stringBuffer(),
				parse,
				media,
				image;
			if(object.link){
				image = sb._('<img src="index.php?option=com_manager&task=getResizeImage&fid=')._(object.id)._('&w=22&h=22">').result();
			} else {
				parse = storage.usertree.parse(object);
				media = object.media;
				if(media!=null&&media.avatar!=null){
					image = sb._('<img src="index.php?option=com_manager&task=getResizeImage&id=')._(media.avatar.media_id)._('&w=22&h=22">').result(); 
				} else {
					image = sb._('<img src="index.php?option=com_manager&task=getResizeImage&fid=')._(parse.facebook_id)._('&w=22&h=22">').result();
				}
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
					sb._('<tr><td><div class="text"><span>You logged in:</span></div></td><td rowspan="3"><div class="avatar">')._(fn.getAvatar(object))._('</div></td></tr>');
					sb._('<tr><td><div class="name"><span>')._(parse.name)._('</span></div></td></tr>');
					sb._('<tr><td><div class="logout"><span>Exit this Family Trees</span></div></td></tr>');
				sb._('</table>');
			sb._('</div>');
			htmlObject = jQuery(sb.result());
			jQuery(htmlObject).find('div.logout span').click(function(){
				fn.ajax('famous', 'logout', function(res){
				});
			});
			jQuery('div.jmb_header_body').append(htmlObject);
		},
		check:function(){
			if(type == 'famous_family' && alias == 'myfamily'){
				if(storage.usertree.user!=null){
					ch = storage.usertree.pull[storage.usertree.user];
					fn.famous(ch);
				} else {
					fn.user(function(object){
						fn.famous(object);
					}, true);
				}
			}	
		},
		user:function(callback, f){
			var json, object, me;
			fn.ajax('user', null, function(res){
				json = jQuery.parseJSON(res.responseText);
				if(json.user_id != null){
					object = json.usertree[json.user_id];
					storage.usertree.user = json.user_id;
					storage.usertree.pull = json.usertree;
					if(f){ callback(object); return true; }
					if(object.user.facebook_id=='0'){
						FB.api('/me', function(res){
							callback(res)
						});
						return true;
					}
					callback(object);
					return true;
				} 
				callback(false);
				return false;
			});
		},
		init:function(callback){
			var cont, ch;
			jQuery(document.body).ready(function(){
				fn.user(function(object){
					if(object){
						cont = fn.create();
						fn.setName(object, cont);
						fn.setAvatar(object, cont);
						if(!object.link) fn.click(cont);
					} else {
						cont = fn.connect();
						fn.login(cont);	
					}
					jQuery(document.body).append(cont);
					fn.check();
					callback();
				});			
			});
		}
	}
	
	module.init = function(callback){ fn.init(callback); }
}

