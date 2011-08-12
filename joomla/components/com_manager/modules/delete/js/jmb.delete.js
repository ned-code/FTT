function JMBDelete(obj){
	this.obj = jQuery('#'+obj);
	var div = jQuery('<div class="button">Delete my families tree</div>');	
	jQuery(this.obj).append(div);
	var self = this;
	jQuery(div).click(function(){
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




