function JMBLogin(obj){
	obj = jQuery('#'+obj);

	if(window!=window.top){
		jQuery(obj).hide();
		return false;
	}
	
	
	this.dialog_div = jQuery('<div></div>');
	
	var box = jQuery('<div class="body"><div class="title">&nbsp;</div><div class="content">&nbsp;</div><div class="avatar"></div></div>');
	jQuery(obj).append(box);
	
	var parent = this;
	var get_avatar = function(id){
		return ['<img src="index.php?option=com_manager&task=getResizeImage&fid=',id,'&w=50&h=50">'].join('');
	}
	
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

}

JMBLogin.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("login", "JMBLogin", func, params, function(res){
				callback(res);
		})
	},
	init:function(){
		FB.init({
			appId: storage.fb.appId, 
			status:storage.fb.status, 
			cookie:storage.fb.cookie, 
			xfbml:storage.fb.xfbml
		});
	},
	profile:function(me){
		var pr = new JMBProfile();
		this.ajax('get', me.id, function(res){
			var response = jQuery.parseJSON(res.responseText);
			var json = {
				data: response.fmbUser,
				fmbUser:response.fmbUser,
				imgPath:response.imgPath
			}
			pr.profile.render(json);
		});
	},
	settings:function(){
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
	logout:function(){
		FB.logout(function(response) {
			window.location.reload();
  		});
	}
}




