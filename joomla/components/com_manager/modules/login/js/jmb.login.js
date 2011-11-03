function JMBLogin(obj){
	var module = this;

	if(window!=window.top){
		jQuery(obj).hide();
		return false;
	}
	
	var facebook_id = jQuery('body').attr('_fid');
	this.dialog_div = jQuery('<div></div>');

	var getAvatar = function(json){
		if(json.avatar!=null){
			return ['<img src="index.php?option=com_manager&task=getResizeImage&id=',json.avatar.Id,'&w=50&h=50">'].join('');
		}
		if(json.individ){
			var gen = json.individ.Gender;
			var img = (gen=="M")?'male.png':'female.png';
			return ['<img width="50px" height="50px" src="',json.path,'/components/com_manager/modules/login/imgs/',img,'">'].join('');
		}			
	}
	
	var getName = function(json){
		if(!json.individ) return null;
		return [(json.individ.Nick!=null)?json.individ.Nick:json.individ.FirstName, (json.individ.LastName!=null)?json.individ.LastName:''].join(' ');
	}
	
	
	
	jQuery(obj).find('div#profile_login').hide();
	jQuery(obj).find('div#profile_content').hide();
	
	module.ajax('status',null,function(res){
		var json = jQuery.parseJSON(res.responseText);
		var type;
		if(json.alias == 'login'){
			type = json.alias;
		} else if(json.alias == 'home'){
			type = json.alias;
		} else if(json.alias == 'first-page'){
			type = json.alias;
		} else {
			type = (json.login_type!=null)?json.login_type:'_login';
		}
		switch(type){
			case 'first-page': 
				jQuery('.jmb_header_profile_box').hide();	
			break;
			
			case "home":
			case "family_tree":
				if(facebook_id){
					var box = jQuery(obj).find('div#profile_content');
					var table = jQuery('<table><tr><td><div class="jmb-profile-box-content"></div></td><td><div class="jmb-profile-box-avatar"></div></td></tr></table>');
					var divs = jQuery('<div><span class="jmb-profile-box-title"></span></div><div></div>');
					var buttons = jQuery('<ul class="buttons"><li><span id="profile">Profile</span></li><li><span id="settings">Settings</span></li><li><span id="logout">Logout</span></li></ul>');
					jQuery(buttons).find('span').click(function(){
							module[jQuery(this).attr('id')](json.facebook_id);
					});
					jQuery(divs[0]).find('span').html(getName(json));
					jQuery(divs[1]).append(buttons);
					jQuery(table).find('.jmb-profile-box-content').append(divs);
					jQuery(table).find('.jmb-profile-box-avatar').html(getAvatar(json));
					jQuery(box).append(table);
					jQuery(box).show();
				} else {
					//jQuery(obj).find('div#profile_login').show();
					jQuery(obj).hide();
				}
			break;
		
			case "login":
			case "_login":
				//jQuery(obj).find('div#profile_login').show();
				jQuery(obj).hide();
			break;
			
			case "famous_family":
				if(json.tree_id!=null){
					var box = jQuery(obj).find('div#profile_content');
					var table = jQuery('<table><tr><td><div class="jmb-profile-box-content"></div></td><td><div class="jmb-profile-box-avatar"></div></td></tr></table>');
					var divs = jQuery('<div style="margin-left:3px;"></div><div style="text-align:center;"></div><div style="text-align:center;"></div>');
					var span = jQuery('<span class="jmb-profile-box-title">'+getName(json)+'</span>');
					var buttons = jQuery('<ul class="buttons"><li><span id="logout">Exit this Family Tree</span></li></ul>');
					jQuery(buttons).find('span').click(function(){
						module.famousFamilyLogout();
					});
					jQuery(divs[0]).html('You logged in as:');
					jQuery(divs[1]).append(span);
					jQuery(divs[2]).append(buttons);
					jQuery(table).find('.jmb-profile-box-content').append(divs);
					jQuery(table).find('.jmb-profile-box-avatar').html(getAvatar(json));
					jQuery(box).append(table);
				} else {
					var box = jQuery(obj).find('div#profile_content');
					var table = jQuery('<table><tr><td><div class="jmb-profile-box-content"></div></td><td><div class="jmb-profile-box-avatar"></div></td></tr></table>');
					jQuery(table).find('.jmb-profile-box-content').addClass('jmb-profile-box-text').html('Please select a family from the list below');
					jQuery(box).append(table);
				}
				jQuery(obj).find('div#profile_content').show();
			break;
		}
	});
}

JMBLogin.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("login", "JMBLogin", func, params, function(res){
				callback(res);
		})
	},
	famousFamilyLogout:function(){
		this.ajax('familyLogout',null,function(){
			window.location.reload();
		});
	},
	profile:function(fid){
		var pr = new JMBProfile();
		this.ajax('get', null, function(res){
			var response = jQuery.parseJSON(res.responseText);
			var json = {
				data: response.fmbUser,
				fmbUser:response.fmbUser,
				imgPath:response.imgPath
			}
			pr.profile.render(json);
		});
	},
	settings:function(fid){
		var settings = {
			close:function(){
				jQuery(this).dialog("destroy");
				jQuery(this).remove();
			},
			width:700,
			height:500,
			resizable: false,
			draggable: false,
			position: "top",
			closeOnEscape: false,
			modal:true
		}
		jQuery(this.dialog_div).dialog("destroy");
		jQuery(this.dialog_div).dialog(settings);
		jQuery(this.dialog_div).parent().css('top', '10px');
	},
	logout:function(fid){
		FB.logout(function(response) {
				window.location.reload();	
		});

	}
}




