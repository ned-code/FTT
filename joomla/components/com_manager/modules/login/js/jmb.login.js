function JMBLogin(){
	var	module = this,
		fn,
		settings = {},
		type = '',
		alias = '',
		path = "/components/com_manager/modules/login/imgs/",
		notifications,
		fb_logged;

	//init vars
	type = jQuery(document.body).attr('_type');
	alias = jQuery(document.body).attr('_alias');

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
			var module = this, menu, list, sb = host.stringBuffer(), contEl;
			sb._('<div class="menu">');
				sb._('<div id="profile"><span>Profile</span></div>');
				sb._('<div id="language"><span>Language: ')._(this.getDefaultLang())._('</span></div>');
				sb._('<div id="logout"><span>Log Out</span></div>');
			sb._('</div>');
			menu = jQuery(sb.result());
            if(storage.usertree.gedcom_id == null){
                jQuery(menu).find('div#profile').remove();
            }
			return {
				on:function(object, callback){
					var m = this;
                    jQuery(object).parent().append(menu);
					m.init();
                    jQuery(document.body).click(function(ev){
                        m.off();
                        callback();
                    });
					return this;
				},
				off:function(){
					jQuery(menu).remove();
					jQuery(menu).find('div').unbind();
                    jQuery(document.body).unbind();
					return this;
				},
				click:{
					profile:function(obj){
                        var id = storage.usertree.gedcom_id;
                        if(id != null){
                            storage.profile.editor('edit', {
                                gedcom_id:id,
                                events:{
                                    afterEditorClose:function(){
                                        jQuery(obj).removeClass('active');
                                        storage.tooltip.update();
                                    }
                                }
                            });
                        }
					},
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
                        /*
						FB.logout(function(){
							window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=logout&return=login';
						});
						*/
                        jfbc.login.logout_button_click();
					}
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
			jQuery(cont).click(function(){
                var button = jQuery(this).find('div.button');
				if(jQuery(button).hasClass('active')){
                    jQuery(button).removeClass('active');
                    menu.off();
                    jQuery(document.body).unbind();
				} else {
					jQuery(button).addClass('active');
					menu.on(button, function(){
                        jQuery(button).removeClass('active');
                        menu.off();
                    });
				}
                return false;
			});
		},
		setName:function(data, cont){
			var	box = jQuery(cont).find('div.login span'), parse;
			jQuery(box).html(data.name);
		},
		setAvatar:function(data ,cont){
            if(typeof(data) != 'undefined'  && typeof(data.id) != 'undefined'){
                var	box = jQuery(cont).find('div.avatar');
                jQuery(box).html('<img width="22px" height="22px" src="http://graph.facebook.com/'+data.id+'/picture">');
            }
		},
		getAvatar:function(object){
            return storage.usertree.avatar.get({
                object:object,
                width:50,
                height:50
            });
		},
		set_global_data:function(json){
			storage.usertree.gedcom_id = json.usertree.gedcom_id;
			storage.usertree.facebook_id = json.usertree.facebook_id;
			storage.usertree.tree_id = json.usertree.tree_id;
			storage.usertree.permission = json.usertree.permission;
			storage.usertree.users = json.usertree.users;
			storage.usertree.pull = json.usertree.pull;
		},
		user:function(callback){
			var json, object;
			fn.ajax('user', null, function(res){
                json = jQuery.parseJSON(res.responseText);
                settings.languages = json.languages;
                settings.default_language = json.default_language;
                storage.notifications.init(json.notifications);
                storage.settings = json.settings;
                if(json.usertree){
                    fn.set_global_data(json);
                }
                FB.api('me', function(data){
                    if(data.error){
                        callback(false);
                    } else {
                        callback(data);
                    }
                });
			});
		},
        famous:function(){
            if(storage.usertree.gedcom_id == null) return false;
            var object = storage.usertree.pull[storage.usertree.gedcom_id];
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
        facebook:function(data){
            var cont = fn.create();
            fn.setName(data, cont);
            fn.setAvatar(data, cont);
            fn.click(cont);
            jQuery(document.body).append(cont);
        },
		init:function(callback){
			var cont;
			fn.user(function(data){
				fb_logged = jQuery(document.body).attr('_fb');
				switch(alias){
                    case "myfamily":
                        if(type=="famous_family"){
                            fn.famous();
                        } else {
                            fn.facebook(data);
                        }
                    break;


					case "home":
					case "login":
					case "first-page":
					case "invitation":
					case "famous-family":
                        if(!parseInt(fb_logged)){
                            cont = fn.connect();
                            fn.login(cont);
                            jQuery(document.body).append(cont);
                        } else if(data) {
                            fn.facebook(data);
                        }
					break;
				}
				callback();
			});
		}
	}

    if(window!=window.top){
        module.init = function(callback){
            host.callMethod("login", "JMBLogin", 'user', null, function(res){
                json = jQuery.parseJSON(res.responseText);
                fn.set_global_data(json);
                callback();
            });
        }
        return false;
    }

	module.init = fn.init;
}

