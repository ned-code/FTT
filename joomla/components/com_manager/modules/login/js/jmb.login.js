function JMBLogin(obj){
	var module = this;
	obj = jQuery('#'+obj);

	if(window!=window.top){
		jQuery(obj).hide();
		return false;
	}
	this.dialog_div = jQuery('<div></div>');
	
	var parent = this;
	var get_avatar = function(id){
		return ['<img src="index.php?option=com_manager&task=getResizeImage&fid=',id,'&w=50&h=50">'].join('');
	}
	
	var fid = jQuery('body').attr('_fid');
	var alias = jQuery('body').attr('_alias');
	
	jQuery(obj).find('div#_login').hide();
	jQuery(obj).find('div#_content').hide();
	
	if(fid){
		var box = jQuery(obj).find('div#_content');
		jQuery(obj).find('div#_content').show();
		jQuery(box).find('.title').html('FirstName LastName');
		var buttons = jQuery('<ul class="buttons"><li><span id="profile">Profile</span></li><li><span id="settings">Settings</span></li><li><span id="logout">Logout</span></li></ul>');
		jQuery(buttons).find('span').click(function(){
				parent[jQuery(this).attr('id')](fid)
		});
		jQuery(box).find('.content').css('width', '130px').append(buttons);
		jQuery(box).find('.avatar').html(get_avatar(fid));
	} else {
		jQuery(obj).find('div#_login').show();
	}
}

JMBLogin.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("login", "JMBLogin", func, params, function(res){
				callback(res);
		})
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




