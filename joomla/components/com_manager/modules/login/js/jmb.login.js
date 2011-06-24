function Login(obj){
	jQuery(obj).html("<fb:login-button>Connect with Facebook</fb:login-button>");
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




