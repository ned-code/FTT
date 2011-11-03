function JMBLoginButtonObject(obj){
	var div = jQuery('#jmb_connect_with_facebook');
	jQuery(div).addClass('jmb-facebook-login-button');
	jQuery(obj).append(div);
	jQuery(div).show();
}

JMBLoginButtonObject.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("login_button", "JMBLoginButtonClass", func, params, function(res){
				callback(res);
		})
	}
}




