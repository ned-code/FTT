function JMBLogin(){
	var	module = this,
		fn,
		settings = {},
        loggedByFamous = false,
		alias = '',
		path = "/components/com_manager/modules/login/imgs/",
		notifications,
		fb_logged,
        msg;

    msg = {
        FTT_MOD_LOGIN_PROFILE:"Profile",
        FTT_MOD_LOGIN_LANGUAGE:"Language",
        FTT_MOD_LOGIN_LOGOUT:"Log Out",
        FTT_MOD_LOGIN_CONNECT_WITH_FACEBOOK:"Connect With Facebook",
        FTT_MOD_LOGIN_LANGUAGE_DIALOG:"Language",
        FTT_MOD_LOGIN_FF_LOGGED: "You logged in as",
        FTT_MOD_LOGIN_FF_EXIT: "Exit this Family Trees"

    }

	//init vars
	loggedByFamous = parseInt(jQuery(document.body).attr('_type'));
	alias = jQuery(document.body).attr('_alias');

	//init functions
	fn = {
		ajax:function(func, params, callback){
            storage.callMethod("login", "JMBLogin", func, params, function(res){
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
				sb._('<div class="facebook"><span>')._(msg.FTT_MOD_LOGIN_CONNECT_WITH_FACEBOOK)._('</span></div>');
			sb._('</div>');
			return jQuery(sb.result());
		},
		langList:function(){
			var st = host.stringBuffer();
			st._('<ul>');
			jQuery(settings.languages).each(function(i,el){
				if(parseInt(el.published)){
                    if(el.lang_code == settings.default_language){
                        st._('<li style="background: yellow;" id="')._(el.lang_code)._('">')._(el.title)._('</li>');
                    } else {
                        st._('<li id="')._(el.lang_code)._('">')._(el.title)._('</li>');
                    }

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
				sb._('<div id="profile"><span>')._(msg.FTT_MOD_LOGIN_PROFILE)._('</span></div>');
				sb._('<div id="language"><span>')._(msg.FTT_MOD_LOGIN_LANGUAGE)._(': ')._(this.getDefaultLang())._('</span></div>');
				sb._('<div id="logout"><span>')._(msg.FTT_MOD_LOGIN_LOGOUT)._('</span></div>');
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
					profile:function(obj, callback){
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
                        callback();
					},
					language:function(object, callback){
                        var langBox = jQuery('<div class="ftt-profile-language-list"></div>');
                        jQuery(langBox).append(module.langList());
                        jQuery(langBox).dialog({
                            width:320,
                            height:240,
                            title: msg.FTT_MOD_LOGIN_LANGUAGE_DIALOG,
                            resizable: false,
                            draggable: false,
                            position: "top",
                            closeOnEscape: false,
                            modal:true,
                            close:function(){
                                callback();
                            }
                        });
                        jQuery(langBox).parent().addClass('language');
                        jQuery(langBox).parent().css('top', '20px');
                        jQuery(langBox).find('li').click(function(){
                            if(confirm("Are you sure you want to set the language?")){
                                fn.ajax('language', jQuery(this).attr('id'), function(res){
                                    window.location.reload();
                                });
                            }
                            return false;
                        });
					},
					logout:function(object, callback){
                        jfbc.login.logout_button_click();
                        callback();
					}
				},
				init:function(){
					var _menu = this;
					jQuery(menu).find('div').click(function(){
                        var div = this;
						if(jQuery(div).hasClass('active')) return false;
						jQuery(menu).find('div').removeClass('active');
						jQuery(div).addClass('active');
                        var revert = function(){
                            jQuery(div).removeClass('active');
                        }
						_menu.click[jQuery(this).attr('id')](this, revert);
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
				}, {scope: "user_birthday,user_relationships,email"});

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
            storage.notifications = json.notifications;
            storage.settings = json.settings;
            storage.langString = json.langString;
		},
		user:function(callback){
			var json, object, user;
            user = storage.usertree.user;
			fn.ajax('user', null, function(res){
                if(!res) callback(false);
                json = jQuery.parseJSON(res.responseText);
                settings.languages = json.languages;
                settings.default_language = json.default_language;
                msg = json.msg;
                if(user != null && typeof(user.id) != 'undefined'){
                    callback(user);
                } else {
                    callback(false);
                }
			});
		},

        famous:function(){
            if(storage.usertree.gedcom_id == null) return false;
            var object = storage.usertree.pull[storage.usertree.gedcom_id];
            var	sb = host.stringBuffer(), parse = storage.usertree.parse(object), htmlObject;
            sb._('<div class="jmb-profile-famous-cont">');
            sb._('<table>');
            sb._('<tr><td><div class="text"><span>')._(msg.FTT_MOD_LOGIN_FF_LOGGED)._(':</span></div></td><td rowspan="3"><div class="avatar">')._(fn.getAvatar(object))._('</div></td></tr>');
            sb._('<tr><td><div class="name"><span>')._(parse.name)._('</span></div></td></tr>');
            sb._('<tr><td><div class="logout"><span>')._(msg.FTT_MOD_LOGIN_FF_EXIT)._('</span></div></td></tr>');
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
            if(!data) return false;
            var cont = fn.create();
            fn.setName(data, cont);
            fn.setAvatar(data, cont);
            fn.click(cont);
            jQuery(document.body).append(cont);
        },
        createBox:function(data){
            switch(alias){
                case "myfamily":
                    if(loggedByFamous){
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
        },
		init:function(callback){
			var cont;
			fn.user(function(data){
				fb_logged = jQuery(document.body).attr('_fb');
                setTimeout(function(){
                    fn.createBox(data)
                }, 1);
				callback();
			});
		}
	}

    if(window!=window.top){
        module.init = function(callback){
            if(alias == 'home' || alias == 'famous-family') {
                jQuery.ajax({
                    url: 'index.php?option=com_manager&task=setLocation&alias=myfamily',
                    type: "POST",
                    dataType: "json",
                    complete : function (req, err) {
                        var bUrl = jQuery(document.body).attr('_baseurl');
                        window.location.href= bUrl+'index.php/myfamily';
                    }
                });
            } else if(loggedByFamous){
                jQuery.ajax({
                    url: 'index.php?option=com_manager&task=clearFamousData',
                    type: "POST",
                    dataType: "json",
                    complete : function (req, err) {
                        var bUrl = jQuery(document.body).attr('_baseurl');
                        window.location.href= bUrl+'index.php/myfamily';
                    }
                });
            } else {
                setTimeout(function(){
                    callback();
                }, 1);
            }
        }
        return false;
    } else {
        module.init = fn.init;
    }


}

