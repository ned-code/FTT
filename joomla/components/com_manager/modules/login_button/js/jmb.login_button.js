function JMBLoginButtonObject(obj){
	obj = jQuery('#'+obj);
	var module = this;
	//var div = jQuery('<div class="fb-login-button" data-show-faces="true" data-width="200" data-max-rows="1">Connect With Facebook</div>');
	var div = jQuery('#jmb_connect_with_facebook');
	jQuery(div).show();
	jQuery(obj).append(div);
}

JMBLoginButtonObject.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("login_button", "JMBLoginButtonClass", func, params, function(res){
				callback(res);
		})
	}
}




