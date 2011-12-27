function JMBLogin(){
	var	module = this,
		fn,
		facebook_id;

	if(window!=window.top){
		jQuery(obj).hide();
		return false;
	}
	
	//init vars
	facebook_id = jQuery('body').attr('_fid');
	
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
		user:function(callback){
			var json;
			fn.ajax('user', null, function(res){
				json = jQuery.parseJSON(res.responseText);
				if(callback){
					storage.usertree.user = json.user_id;
					storage.usertree.pull = json.usertree;
					callback(json.usertree[json.user_id]);
				}
			});
		},
		setName:function(object, cont){
			var	box = jQuery(cont).find('div.login span'),
				parse = storage.usertree.parse(object);
			jQuery(box).html(parse.name);			
		},
		setAvatar:function(object ,cont){
			var	box = jQuery(cont).find('div.avatar'),
				parse = storage.usertree.parse(object),
				media = object.media,
				sb = host.stringBuffer(),
				image;
			if(media!=null&&media.avatar!=null){
				image = sb._('<img class="jmb-families-avatar view" src="index.php?option=com_manager&task=getResizeImage&id=')._(media.avatar.media_id)._('&w=22&h=22">').result(); 
			} else {
				image = sb._('<img class="jmb-families-avatar view" src="index.php?option=com_manager&task=getResizeImage&fid=')._(parse.facebook_id)._('&w=22&h=22">').result();
			}
			jQuery(box).html(image);
		},
		init:function(callback){
			var cont;
			jQuery(document.body).ready(function(){
				if(facebook_id.length!=0){
					cont = fn.create();
					fn.user(function(object){
						fn.setName(object, cont);
						fn.setAvatar(object, cont);
						fn.click(cont);
						jQuery(document.body).append(cont);
						callback();
					});
				} else {
					cont = fn.connect();
					fn.login(cont);
					jQuery(document.body).append(cont);
					callback();
				}				
			});
		}
	}
	
	module.init = function(callback){ fn.init(callback); }
}

