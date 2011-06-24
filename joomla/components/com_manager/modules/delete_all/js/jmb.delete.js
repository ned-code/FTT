function JmbDelete(obj){
	obj = jQuery('#'+obj);
	var self = this;
	var html = '<div>DELETE ALL DATA!</div>';
	var button = jQuery(html);
	jQuery(button).css('border','3px solid #000');
	jQuery(button).css('border-radius','10px');
	jQuery(button).css('font-family','tahoma');
	jQuery(button).css('font-size','12px');
	jQuery(button).css('width','140px');
	jQuery(button).css('height','30px');
	jQuery(button).css('line-height','30px');
	jQuery(button).css('cursor','pointer');
	jQuery(button).css('margin','20px');
	jQuery(button).css('padding','3px');
	jQuery(button).css('text-align','center');
	jQuery(button).css('font-weight','bold');
	jQuery(button).click(function(){
		self._ajax('delete', null, function(){
			//window.location.reload();
		})
	})
	jQuery(obj).append(button);	
}

JmbDelete.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("delete_all", "JmbDelete", func, params, function(res){
			callback(res);
		})
	}
}
