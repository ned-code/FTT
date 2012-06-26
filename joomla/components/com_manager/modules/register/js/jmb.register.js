function JMBRegister(obj){
	obj = jQuery('#'+obj);
	var self = this;
	FB.init({
		appId: storage.fb.appId, 
		status:storage.fb.status, 
		cookie:storage.fb.cookie, 
		xfbml:storage.fb.xfbml
	});
	this.user_id  = 0;
	this.parent = obj;
	
	this._ajax('render',null,function(res){
		jQuery(obj).html(res.responseText);
		self.buttonInit(obj);
		
	})
}

JMBRegister.prototype = {
	_ajax:function(func, params, callback){
        storage.callMethod("register", "JMBRegister", func, params, function(res){
				callback(res);
		})
	},
	buttonInit:function(obj){
		var self = this;
		// create family tree
		jQuery(obj).find('.jmb-register-button').click(function(){
			self._ajax('createProfile', null, function(res){
				window.location.reload();
			})
		});
		// request invitions
		jQuery(obj).find('.jmb-register-friends-item').click(function(){
				alert('request invitions');
		});
	}
}




