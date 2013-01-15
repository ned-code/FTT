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

    module.menu = null;

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
			var sb = storage.stringBuffer();
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
			var sb = storage.stringBuffer();
			sb._('<div class="jmb-profile-cont">');
				sb._('<div class="facebook"><span>')._(msg.FTT_MOD_LOGIN_CONNECT_WITH_FACEBOOK)._('</span></div>');
			sb._('</div>');
			return jQuery(sb.result());
		},
		langList:function(object){
			var st = storage.stringBuffer();
			st._('<ul>');
			jQuery(settings.languages).each(function(i,el){
				if(parseInt(el.published)){
                    var def = (object.def)?object.def:settings.default_language;
                    if(el.lang_code == def){
                        st._('<li>');
                        st._('<div class="flag ')._(el.lang_code)._('">&nbsp;</div>');
                        st._('<div><input name="country" type="radio" checked="checked" value="')._(el.lang_code)._('"></div>');
                        st._('<div class="title">')._(el.title)._('</div>');
                        st._('</li>');
                    } else {
                        st._('<li>');
                            st._('<div class="flag ')._(el.lang_code)._('">&nbsp;</div>');
                            st._('<div><input name="country" type="radio" value="')._(el.lang_code)._('"></div>');
                            st._('<div class="title">')._(el.title)._('</div>');
                        st._('</li>');
                    }
				}
			});
			st._('</ul>');
            st._('<div class="ftt-button-ok"><input type="button" value="OK"></div>');
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
			var module = this, menu, list, sb = storage.stringBuffer(), contEl;
			sb._('<div class="menu">');
                if(settings.user_data && settings.user_data.pull.length != 0){
                    sb._('<div id="profile"><span>')._(msg.FTT_MOD_LOGIN_PROFILE)._('</span></div>');
                }
                sb._('<div id="language"><span>')._(msg.FTT_MOD_LOGIN_LANGUAGE)._(': ')._(this.getDefaultLang())._('</span></div>');
				sb._('<div id="to_facebook"><span>')._('Return to Facebook')._('</span></div>');
                sb._('<div id="logout"><span>')._(msg.FTT_MOD_LOGIN_LOGOUT)._('</span></div>');
			sb._('</div>');
			menu = jQuery(sb.result());
			return {
                viewLanguage:function(object ,c){
                    this.click.language(object, c);
                },
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
                        if(settings.user_data){
                            var data = settings.user_data,
                                gedcom_id = data.gedcom_id,
                                tree_id = data.tree_id,
                                users = data.users,
                                pull = data.pull;
                                storage.profile.editor('edit', {
                                    gedcom_id:gedcom_id,
                                    owner_id:gedcom_id,
                                    tree_id:tree_id,
                                    pull:pull,
                                    users:users,
                                    events:{
                                        afterEditorClose:function(p){
                                            jQuery(obj).removeClass('active');
                                            settings.user_data.pull = p;
                                            storage.tooltip.update();

                                        }
                                    }
                                });
                        }
                        callback();
					},
					language:function(object, callback){
                        var langBox = jQuery('<div class="ftt-profile-language-list"></div>');
                        jQuery(langBox).append(module.langList(object));
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
                        var selectRadioButton = function(){
                            var input = jQuery(this).parent().find('input').attr('checked', 'checked');
                        }
                        jQuery(langBox).find('div.flag').click(selectRadioButton);
                        jQuery(langBox).find('div.title').click(selectRadioButton);
                        jQuery(langBox).find('div.ftt-button-ok input').click(function(){
                            //if(confirm("Are you sure you want to set the language?")){
                                var id = jQuery(langBox).find('input:checked').val();
                                var prgb = jQuery('<div class="ftt-language-progressbar"><div><span>Loading...</span></div></div>');
                                jQuery(langBox).append(prgb);
                                fn.ajax('language', id, function(res){
                                    callback(id);
                                    setTimeout(function(){
                                        window.location.reload();
                                    }, 1000)
                                });
                            //}
                            return false;
                        })
					},
                    to_facebook:function(object, callback){
                        window.top.location.href = storage.app.link;
                        callback();
                    },
					logout:function(object, callback){
                        jfbcLogoutFacebook = true;
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
            var div = jQuery("<div class='ftt-preloader-alert'><div>You are now being logged in using your Facebook credentials</div></div>");
            jQuery(div).hide();
            jQuery("#_profile").append(div);
            jQuery(cont).find('div.facebook span').click(function(){
				FB.login(function(response){
					if(response.authResponse){
                        storage.alert(div, function(){});
                        jQuery(div).show();
						window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=loginFacebookUser&return=myfamily';
					} else {
						alert('Login failed.')
					}
				}, {scope: jfbcRequiredPermissions});
			});
		},
		click:function(cont){
			var menu = this.menu();
            module.menu = menu;
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
            if(typeof(data) != 'undefined'  && typeof(data.facebookId) != 'undefined'){
                var	box = jQuery(cont).find('div.avatar');
                jQuery(box).html('<img width="22px" height="22px" src="http://graph.facebook.com/'+data.facebookId+'/picture">');
            }
		},
		getAvatar:function(object){
            return storage.usertree.avatar.get({
                object:object,
                width:50,
                height:50
            });
		},
		user:function(callback){
			var json, object;
			fn.ajax('user', null, function(res){
                if(!res) callback(false);
                json = storage.getJSON(res.responseText);
                settings.languages = json.languages;
                settings.default_language = json.default_language;
                settings.user_data = json.data;
                msg = json.msg;

                if(json.user.facebookId != 0){
                    storage.usertree.user = json.user;
                    callback(json.user);
                } else {
                    callback(false);
                }
			});
		},

        famous:function(){
            if(storage.usertree.gedcom_id == null) return false;
            var object = storage.usertree.pull[storage.usertree.gedcom_id];
            var	sb = storage.stringBuffer(), parse = storage.usertree.parse(object), htmlObject;
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
                    window.location.href = storage.baseurl + 'index.php/famous-family'
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
            jQuery("#_profile").append(cont);
        },
        createBox:function(data){
            if(loggedByFamous){
                fn.famous();
            }
            if(data){
                fn.facebook(data);
            } else {
                var cont = fn.connect();
                fn.login(cont);
                jQuery("#_profile").append(cont);
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
            function _ajax_ (url, callback){
                jQuery.ajax({
                    url: url,
                    type: "POST",
                    dataType: "json",
                    complete : callback
                });
            }
            function _redirect_ (){
                var bUrl = jQuery(document.body).attr('_baseurl');
                window.location.href= bUrl+'index.php/myfamily';
            }
            if(alias == 'home' || alias == 'famous-family') {
                _ajax_("index.php?option=com_manager&task=setLocation&alias=myfamily" ,function(){
                    _redirect_();
                });
            } else if(loggedByFamous){
                _ajax_("index.php?option=com_manager&task=clearFamousData" ,function(){
                    _redirect_();
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

