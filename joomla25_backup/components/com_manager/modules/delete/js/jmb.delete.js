function JMBDelete(button){
    console.log('module loaded');
}

JMBDelete.prototype = {
	_ajax:function(func, params, callback){
        storage.callMethod("delete", "JMBDelete", func, params, function(req){
				callback(req);
		})
	}	
}




