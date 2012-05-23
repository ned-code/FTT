function JMBDelete(button){
    console.log('module loaded');
}

JMBDelete.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("delete", "JMBDelete", func, params, function(req){
				callback(req);
		})
	}	
}




