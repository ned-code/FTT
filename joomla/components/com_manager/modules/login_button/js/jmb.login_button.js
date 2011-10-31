function JMBLoginButton(obj){
	obj = jQuery('#'+obj);
	var module = this;
	var div = jQuery('<div class="fb-login-button" data-show-faces="true" data-width="200" data-max-rows="1">Connect With Facebook</div>');
	jQuery(obj).append(div);
	FB.XFBML.parse();
	FB.Event.subscribe('auth.login',function(response){
		if(response.status=='connected'){
			var auth = response.authResponse;
			module.ajax('setAccessToken', auth.accessToken, function(res){
				window.location.reload();
			});
		}
	});
}

JMBLoginButton.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("login_button", "JMBLoginButton", func, params, function(res){
				callback(res);
		})
	}
}




