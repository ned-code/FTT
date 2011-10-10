function JMBLogin(obj){
	var module = this;
	obj = jQuery('#'+obj);

	if(window!=window.top){
		jQuery(obj).hide();
		return false;
	}
	this.dialog_div = jQuery('<div></div>');

	var getAvatar = function(id){
		return ['<img src="index.php?option=com_manager&task=getResizeImage&fid=',id,'&w=50&h=50">'].join('');
	}
	
	var getName = function(json){
		return [(json.individ.Nick!=null)?json.individ.Nick:json.individ.FirstName, (json.individ.LastName!=null)?json.individ.LastName:''].join(' ');
	}
	
	
	jQuery(obj).find('div#_login').hide();
	jQuery(obj).find('div#_content').hide();
	
	module.ajax('status',null,function(res){
		var json = jQuery.parseJSON(res.responseText);
		switch(json.login_type){
			case "family_tree":
				if(json.facebook_id){
					var box = jQuery(obj).find('div#_content');
					jQuery(obj).find('div#_content').show();
					jQuery(box).find('.title').html(getName(json));
					var buttons = jQuery('<ul class="buttons"><li><span id="profile">Profile</span></li><li><span id="settings">Settings</span></li><li><span id="logout">Logout</span></li></ul>');
					jQuery(buttons).find('span').click(function(){
							module[jQuery(this).attr('id')](json.facebook_id);
					});
					jQuery(box).find('.content').css('width', '130px').append(buttons);
					jQuery(box).find('.avatar').html(getAvatar(json.facebook_id));
				} else {
					jQuery(obj).find('div#_login').show();
				}
			break;
			
			case "famous_family":
				jQuery(obj).find('div#_content').show();
				if(json.tree_id!=null){
					var box = jQuery(obj).find('div#_content');
					var buttons = jQuery('<ul class="buttons"><li><span id="logout">Logout</span></li></ul>');
					var content = jQuery('<div>'+getName(json)+'</div><div></div>');
					jQuery(content[0]).css('font-size','16px').css('font-weight','bold');
					jQuery(content[1]).append(buttons);
					jQuery(buttons).find('span').click(function(){
						module.famousFamilyLogout();
					});
					jQuery(box).find('.title').html('You are logged in as:');
					jQuery(box).find('.content').css('top','0px').css('left','40px').append(content);
				} else {
					jQuery(obj).find('div#_content').find('.content').css('width','130px').css('font-weight', 'bold').css('font-size','14px').css('top','5px').html('Please select a family from the list below');
				}
			break;
		}
	});
	
	/*
	FB.getLoginStatus(function(response) {
		switch(response.status){
			case 'connected':
				FB.api('/me', function(me) {
					jQuery(box).find('.title').html(me.name);
					var buttons = jQuery('<ul class="buttons"><li><span id="profile">Profile</span></li><li><span id="settings">Settings</span></li><li><span id="logout">Logout</span></li></ul>');
					jQuery(buttons).find('span').click(function(){
						parent[jQuery(this).attr('id')](me)
					});
					jQuery(box).find('.content').css('width', '130px').append(buttons);
					jQuery(box).find('.avatar').html(get_avatar(me.id));
				});	
			break;
			
			case 'unknown':
				jQuery(box).find('.title').html('<span>Login to access your family tree</span>');
				jQuery(box).find('.content').css('width', '180px').html('<fb:login-button>Connect with Facebook</fb:login-button>');
				jQuery(box).find('.avatar').hide();
				parent.init();
			break;
		}
	});
	
	FB.Event.subscribe('auth.login', function(response) {
		window.location.reload();
	});
        FB.Event.subscribe('auth.logout', function(response) {
        	window.location.reload();
        });
        */
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




