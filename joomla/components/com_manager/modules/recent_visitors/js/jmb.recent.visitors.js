function JMBRecentVisitorsObject(obj){	
	var parent = this;
	var content = null;
	var sb = host.stringBuffer();
	
	var createBody = function(json){
		var lang = json.lang;
		var header_background_color = (json.config.login_type=='famous_family')?json.config.colors.famous_header:json.config.colors.family_header;
		return jQuery('<div class="jmb-rv-header" style="background:#'+header_background_color+';"><span>'+lang['HEADER']+'</span></div><div class="jmb-rv-content"></div><div class="jmb-rv-button"><span>'+lang['SHOW']+'...</span></div>');
	}
	
	var get_avatar = function(object){
		if(!object) return;
		var	media = object.media,
			avatar = (media!=null)?media.avatar:null,
			facebook_id = object.user.facebook_id;
		if(avatar!=null){
			return ['<img src="index.php?option=com_manager&task=getResizeImage&id=',avatar.media_id,'&w=32&h=32">'].join(''); 
		} else {
			return ['<img src="index.php?option=com_manager&task=getResizeImage&fid=',facebook_id,'&w=32&h=32">'].join(''); 
			
		}
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
			var user = objects[key].user;
			var li = jQuery(st.clear()._('<li id="')._(user.gedcom_id)._('" ><div class="avatar">')._(get_avatar(objects[key]))._('</div></li>').result());
			jQuery(ul).append(li);
			init_tipty_tooltip(json.time, objects[key], li);
		}
	}
	
	var init_mini_profile = function(ul,json){
		var li = jQuery(ul).find('li');
		jQuery(li).each(function(i,e){	
			var id = jQuery(e).attr('id');
			var div = jQuery(e).find('div.avatar');
			storage.tooltip.render('view', {
				object:json.objects[id],
				target:div
			});
		});
	}

	var render = function(callback){
		parent.ajax('getRecentVisitors', null, function(res){
			var json = jQuery.parseJSON(res.responseText);
			if(json.objects.length == 0){
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
	
	var headerHandler = function(){
		storage.addEvent(storage.header.clickPull, function(object){
			jQuery(content[1]).html('');
			render();
		});
	}	

	render(function(){
		headerHandler();
		storage.core.modulesPullObject.unset('JMBRecentVisitorsObject');
	});
}

JMBRecentVisitorsObject.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("recent_visitors", "JMBRecentVisitors", func, params, function(res){
				callback(res);
		})
	}
}

