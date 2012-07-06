function JMBLanguage(){
	var module = this;
	
	var createBody = function(){
		return jQuery('<div id="jmb_language_filter"></div>');
	}

	var createLangIcons = function(langs){
		var ul = jQuery('<ul></ul>');
		jQuery(langs).each(function(i, e){
			if(e.published=='1'){
				var li = jQuery('<li id="'+e.lang_id+'"><a title="'+e.title+'" href="javascript:void(0)"><div class="jmb-language-icon '+e.lang_code+'">&nbsp;</div></a></li>');
				jQuery(ul).append(li);
			}
		});
		return ul;
	}
	
	var setEventHandlerByClick = function(ul){
		jQuery(ul).find('li a').click(function(){
			var id = jQuery(this).parent().attr('id');
			var lang_title = jQuery(this).attr('title');
			module.ajax('setLanguage', id, function(res){
				window.location.reload();
			});
		});
	}
	
	module.ajax('getLanguages', null, function(res){
		//var json = jQuery.parseJSON(res.responseText);
		var json = storage.getJSON(res.responseText);
		var body = createBody();
		var ul = createLangIcons(json.languages);
		setEventHandlerByClick(ul);
		jQuery(body).append(ul);
		jQuery(document.body).append(body);
	});
}

JMBLanguage.prototype = {
	ajax:function(func, params, callback){
        storage.callMethod("language", "JMBLanguage", func, params, function(res){
				callback(res);
		})
	}
}




