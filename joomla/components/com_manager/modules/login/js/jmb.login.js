function Login(obj){
	obj = jQuery('#'+obj);
	
	var login_div = jQuery('<div class="jmb-login-content"><div class="title"><span>Login to access your family tree</span></div><div class="button"><fb:login-button>Connect with Facebook</fb:login-button></div></div>');
	jQuery(obj).append(login_div);
	
	FB.init({
		appId: "184962764872486", 
		status:true, 
		cookie:true, 
		xfbml:true
	});

	FB.Event.subscribe('auth.login', function(response) {
		window.location.reload();
	});
        FB.Event.subscribe('auth.logout', function(response) {
        	window.location.reload();
        });
}

Login.prototype = {
}




