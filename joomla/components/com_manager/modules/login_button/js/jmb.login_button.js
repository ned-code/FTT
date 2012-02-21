function JMBLoginButtonObject(obj){
	var	module = this,
		sb = host.stringBuffer(),
		cont = null;
		
	sb._('<div class="jmb-login-button-container">');
		sb._('<div class="jmb-login-button-title"><span>You must logged in acces you Family Tree</span></div>');
		sb._('<div class="jmb-login-button">');
			sb._('<div class="jmb-login-button-f">f</div>');
			sb._('<div class="jmb-login-button-body">');
				sb._('<div class="jmb-login-button-u"><span>facebook</span></div>');
				sb._('<div class="jmb-login-button-d"><span>login through facebook</span></div>');
			sb._('</div>')
		sb._('</div>');
	sb._('</div>');
	cont = jQuery(sb.result());
	jQuery(obj).append(cont);
	jQuery(cont).find('.jmb-login-button').click(function(){
		FB.login(function(response) {
			if (response.authResponse) {
				window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=loginFacebookUser&return=myfamily';
			} else {
				//console.log('User cancelled login or did not fully authorize.');
			}
		}, {scope: 'email'});
	});
}

JMBLoginButtonObject.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("login_button", "JMBLoginButtonClass", func, params, function(res){
			callback(res);
		})
	}
}




