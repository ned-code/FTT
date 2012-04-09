function JMBRecentVisitorsObject(obj){	
	var parent = this;
	var content = null;
	var sb = host.stringBuffer();
	var type = jQuery(document.body).attr('_type');
	var alias = jQuery(document.body).attr('_alias');
	var settings = storage.settings;
	
	var createBody = function(json){
		var lang = json.lang;
		var header_background_color = (type=='famous_family')?settings.colors.famous_header:settings.colors.family_header;
		return jQuery('<div class="jmb-rv-header" style="background:#'+header_background_color+';"><span>'+lang['HEADER']+'</span></div><div class="jmb-rv-content"></div><div class="jmb-rv-button"><span>'+lang['SHOW']+'...</span></div>');
	}
	
	var get_avatar = function(object){
        return storage.usertree.avatar.get({
            object:object,
            width:32,
            height:32
        });
	}
	
	var get_time = function(time){ 
		var t = time.split(/[- :]/); 
		return (t[0]!='0000'&&t[1]!='00'&&t[2]!='00')?new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]): false; 
	}
	
	var get_difference = function(time, object){
		var now = get_time(time);
		var t   = get_time(object.last_login);
		if(!now||!t) return 'unknown';
		var dif = Math.round((now.getTime() - t.getTime())/1000);
		var d = Math.floor(dif/86400);
		var h = Math.floor(dif/3600%24);
		var lang = parent.lang;
		return (d!=0)?d+' '+lang['DAYS']+' '+h+' '+lang['HOURS']+' '+lang['AGO']:h+' '+lang['HOURS']+' '+lang['AGO'];
	}
	
	var init_tipty_tooltip = function(time, object, container){
		if(!object) return;
		var 	st = host.stringBuffer(),
			user = object.user,
			name = [user.first_name, user.last_name].join(' '),
			time = get_difference(time, user),
			fallback = st._('<div>')._(name)._('</div>')._('<div>')._(time)._('</div>').result();
		jQuery(container).tipsy({
			gravity: 'sw',
			html: true,
			fallback: fallback
		});
	}
	
	var init_visitors = function(ul, json){	
		var st = host.stringBuffer();
		var objects = json.objects;
		for(var key in objects){
            var object = storage.usertree.pull[objects[key].gedcom_id];
			var user = object.user
			st.clear();
			st._('<li id="')._(user.gedcom_id)._('" >');
				st._('<div id="father_line" style="border: 2px solid #F5FAE6;">');
					st._('<div id="mother_line" style="border: 2px solid #F5FAE6;">')
						st._('<div class="avatar">')._(get_avatar(object))._('</div>');
					st._('</div>');
				sb._('</div>')
			st._('</li>');
			var html = st.result()
			var li = jQuery(html);
			jQuery(ul).append(li);
			init_tipty_tooltip(json.time, object, li);
		}
	}

    var setMiniTooltip = function(div, id){
        storage.tooltip.render('view', {
            object:storage.usertree.pull[id],
            target:div,
            afterEditorClose:function(){
                jQuery(storage.tooltip.idPull['edit:'+id]).remove();
                jQuery(storage.tooltip.idPull['view:'+id]).remove();
                delete storage.tooltip.idPull['edit:'+id];
                delete storage.tooltip.idPull['view:'+id];
                delete storage.tooltip.stPull['edit:'+id];
                delete storage.tooltip.stPull['view:'+id];
                setMiniTooltip(div, id);
            }
        });
    }

	var init_mini_profile = function(ul,json){
		var li = jQuery(ul).find('li');
		jQuery(li).each(function(i,e){	
			var id = jQuery(e).attr('id');
			var div = jQuery(e).find('div.avatar');
			setMiniTooltip(div, id);
		});
	}

	var render = function(callback){
		parent.ajax('getRecentVisitors', null, function(res){
			var json = jQuery.parseJSON(res.responseText);
			if(json.error || json.objects.length == 0){
				storage.core.modulesPullObject.unset('JMBRecentVisitorsObject');
				return jQuery(obj).remove();
			}
			parent.lang = json.lang;
			content = createBody(json);
			var ul = jQuery('<ul></ul>');
			init_visitors(ul, json);
			init_mini_profile(ul, json);
			jQuery(content[1]).append(ul);	
			jQuery(obj).append(content);
			if(callback) callback();
		});
	}
	
	render(function(){
		storage.core.modulesPullObject.unset('JMBRecentVisitorsObject');
	});
	
	// family line part
		
	storage.family_line.bind('JMBRecentVisitorsObject', function(res){
		jQuery(content[1]).find('li').each(function(i, el){
			var type = 'is_'+res._line+'_line';
			var id = jQuery(el).attr('id');
			var object = storage.usertree.pull[id];
			var user = object.user;
			switch(res._type){
				case "pencil":
					if(parseInt(user[type])){
						var bg_color = (res._active)?res._background:"#F5FAE6";
						jQuery(el).find('div#'+res._line+'_line').css('border', '2px solid '+bg_color);		
					}
				break;
				
				case "eye":
					if(parseInt(user.is_father_line)&&parseInt(user.is_mother_line)){
						var opt = [res.opt.mother.eye, res.opt.father.eye];
						if(!opt[0]&&!opt[1]){
							jQuery(el).hide();
						} else if(opt[0]||opt[1]){
							jQuery(el).show();
						}
					} else {
						if(parseInt(user[type])){
							if(res._active){
								jQuery(el).show();
							} else {
								jQuery(el).hide();
							}
						}
					}
				break;
			}
		});		
	});
}

JMBRecentVisitorsObject.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("recent_visitors", "JMBRecentVisitors", func, params, function(status){
				callback(status);
		})
	}
}

