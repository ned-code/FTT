function JMBLatestUpdatesObject(offsetParent){	
	var	module = this,	
		cont,
		content,
		fn;
	
	fn = {
		ajax:function(func, params, callback){
			host.callMethod("latest_updates", "JMBLatestUpdates", func, params, function(res){
					callback(res);
			})
		},
		finish:function(){
			storage.core.modulesPullObject.unset('JMBLatestUpdatesObject');
		},
		start:function(callback){
			fn.ajax('get', null, function(res){
				callback(jQuery.parseJSON(res.responseText));
			});
		},
		content:function(json){
			var	ul,
				li,
				color,
				data = json.data,
				config = json.config,
				colors = config.colors,
				lang = json.language;
			ul = jQuery('<ul></ul>');
			for(var key in data){
				if(data.hasOwnProperty(key)&&data[key]){
					if(data[key][2]){
						color = colors[data[key][2]];
					} else {
						color= 'gray';
					}
					li = '<li id="'+data[key][0]+'"><div><span class="title">'+lang[key]+':</span>&nbsp;<span style="color:#'+color+'" class="value">'+data[key][1]+'</span></div></li>';
					jQuery(ul).append(li);
				}
			}
			return ul;
		},
		create:function(json){
			var	sb = host.stringBuffer(), 
				config = json.config, 
				colors = config.colors,
				lang = json.language,
				h_color = (config.login_type=="famous_family")?colors.famous_header:colors.family_header;			
			sb._('<div class="jmb-lu-header" style="background:#'+h_color+';">');
				sb._('<span>'+lang['HEADER']+'</span>');
			sb._('</div>');
			sb._('<div class="jmb-lu-content"></div>');
			sb._('<div class="jmb-lu-button">');
				sb._('<span>'+lang['SHOW']+'...</span>');
			sb._('</div>');
			return jQuery(sb.result());
		}
	
	}
	
	fn.start(function(json){
		cont = fn.create(json);
		content = fn.content(json);
		jQuery(cont[1]).append(content);
		jQuery(offsetParent).append(cont);
		fn.finish();
	});
}



