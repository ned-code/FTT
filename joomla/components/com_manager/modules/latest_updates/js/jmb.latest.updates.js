function JMBLatestUpdatesObject(offsetParent){	
	var	module = this,	
		type = jQuery(document.body).attr('_type'),
		usertree = storage.usertree.pull,
		settings = storage.settings,
        message = {
            FTT_MOD_LATEST_UPDATES_HEADER:"Latest Updates",
            FTT_MOD_LATEST_UPDATES_NEW_PHOTO:"New photo",
            FTT_MOD_LATEST_UPDATES_JUST_REGISTER:"Just Registered",
            FTT_MOD_LATEST_UPDATES_PROFILE_CHANGES:"Profile Changes",
            FTT_MOD_LATEST_UPDATES_FAMILY_MEMBER_ADDED:"Family member added",
            FTT_MOD_LATEST_UPDATES_FAMILY_MEMBER_DELETED:"Family member deleted",
            FTT_MOD_LATEST_UPDATES_SHOW_ALL:"Show all"
        },
		cont,
		content,
		data,
		usertree,
		fn;
	
	fn = {
		ajax:function(func, params, callback){
            storage.callMethod("latest_updates", "JMBLatestUpdates", func, params, function(res){
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
            var sb = host.stringBuffer(),
                colors = settings.colors,
                ul = jQuery('<ul></ul>'),
                gedcom_id;
            for(var key in data){
                if(data.hasOwnProperty(key)&&data[key]){
                    var color;
                    gedcom_id = data[key][0];
                    sb._('<li id="')._(gedcom_id)._('">');
                        sb._('<div>');
                            sb._('<span class="title">');
                                sb._(message[key]);
                            sb._(':</span>');
                            sb._('&nbsp;');
                            sb._('<span style="color:#');
                                    sb._(data[key][2]?colors[data[key][2]]:'gray');
                            sb._('" class="value">');
                                sb._(data[key][1]);
                            sb._('</span>');
                        sb._('</div>');
                    sb._('</li>');
                    var li = jQuery(sb.result());
                    sb.clear();
                    if(gedcom_id != null){
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
				h_color = (type=="famous_family")?colors.famous_header:colors.family_header;			
			sb._('<div class="jmb-lu-header" style="background:#'+h_color+';">');
				sb._('<span>')._(message.FTT_MOD_LATEST_UPDATES_HEADER)._('</span>');
			sb._('</div>');
			sb._('<div class="jmb-lu-content"></div>');
			sb._('<div class="jmb-lu-button">');
				//sb._('<span>')._(message.FTT_MOD_LATEST_UPDATES_SHOW_ALL)._('...</span>');
			sb._('</div>');
			return jQuery(sb.result());
		}
	
	}
	
	fn.start(function(json){
        if(json.language){
            message = json.language;
        }
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




