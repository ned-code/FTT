function JMBDelete(button){
	var self = this;
	jQuery(button).click(function(){
		if(!confirm('You sure you want to remove your tree?')) return false;
		storage.core.modal(true);
		self._ajax('delete', null, function(){
			storage.core.modal(false);
			window.location.reload();
		});
	});
}

JMBDelete.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("delete", "JMBDelete", func, params, function(req){
				callback(req);
		})
	}	
}




