function JMBLatestUpdatesObject(offsetParent){	
	var	module = this,	
		type = jQuery(document.body).attr('_type'),
		alias = jQuery(document.body).attr('_alias'),
		usertree = storage.usertree.pull,
		settings = storage.settings,
		cont,
		content,
		data,
		usertree,
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
				colors = settings.colors,
				lang = json.language,
				gedcom_id;
			ul = jQuery('<ul></ul>');
			for(var key in data){
				if(data.hasOwnProperty(key)&&data[key]){
					if(data[key][2]){
						color = colors[data[key][2]];
					} else {
						color= 'gray';
					}
					gedcom_id = data[key][0];
					li = jQuery('<li id="'+gedcom_id+'"><div><span class="title">'+lang[key]+':</span>&nbsp;<span style="color:#'+color+'" class="value">'+data[key][1]+'</span></div></li>');
					if(gedcom_id!=null){
						storage.tooltip.render('view', {
							gedcom_id:gedcom_id,
							target:li,
                            afterEditorClose:function(){
                                storage.tooltip.update();
                            }
						});
					} else {
						jQuery(li).css('cursor', 'default');
					}
					jQuery(ul).append(li);
				}
			}
			return ul;
		},
		create:function(json){
			var	sb = host.stringBuffer(), 
				colors = settings.colors,
				lang = json.language,
				h_color = (type=="famous_family")?colors.famous_header:colors.family_header;			
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
		data = json.data;
		cont = fn.create(json);
		content = fn.content(json);
		jQuery(cont[1]).append(content);
		jQuery(offsetParent).append(cont);
		fn.finish();
	});
	
	storage.family_line.bind('JMBLatestUpdatesObject', function(res){
		if(res._type!= 'pencil') return false;
		jQuery(content).find('li').each(function(i, el){
			var type = 'is_'+res._line+'_line';
			var id = jQuery(el).attr('id');
			var object = usertree[id];
			var user = object.user;
			var span = jQuery(el).find('span.value');
			if(parseInt(user.is_father_line)&&parseInt(user.is_mother_line)){
				var opt = storage.family_line.get.opt();
				if(opt.mother.pencil&&opt.father.pencil){
					jQuery(span).addClass('jmb-familiy-line-bg');
				} else {
					jQuery(span).removeClass('jmb-familiy-line-bg');
					if(opt.mother.pencil||opt.father.pencil){
						if(opt[res._line].pencil){
							jQuery(span).css('background-color', opt[res._line].pencil);	
						} else {
							jQuery(span).css('background-color', (opt.mother.pencil)?opt.mother.pencil:opt.father.pencil);
						}
					} else {
						jQuery(span).css('background-color', 'white');	
					}
				}
			} else {
				if(parseInt(user[type])){
					jQuery(span).css('background-color', res._background);	
				}
			}
		});
	});
}




