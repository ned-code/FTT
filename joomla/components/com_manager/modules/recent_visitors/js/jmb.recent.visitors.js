function JMBRecentVisitorsObject(obj){
	obj = jQuery('#'+obj);
	
	var parent = this;
	//var content = jQuery('<div class="jmb-rv-header"><span>Recent Visitors</span></div><div class="jmb-rv-content"></div><div class="jmb-rv-button"><span>Show all...</span></div>');
	var content = null;
	var sb = host.stringBuffer();
	var profile =  new JMBProfile();
	
	var createBody = function(json){
		var lang = json.lang;
		var header_background_color = (json.config.login_type=='famous_family')?json.config.colors.famous_header:json.config.colors.family_header;
		return jQuery('<div class="jmb-rv-header" style="background:#'+header_background_color+';"><span>'+lang['HEADER']+'</span></div><div class="jmb-rv-content"></div><div class="jmb-rv-button"><span>'+lang['SHOW']+'...</span></div>');
	}
	
	var get_avatar = function(object){
		if(!object) return '';
		if(object.avatar!=null){
			return ['<img src="index.php?option=com_manager&task=getResizeImage&id=',object.avatar,'&w=32&h=32">'].join(''); 
		} else {
			return ['<img src="index.php?option=com_manager&task=getResizeImage&fid=',object.fid,'&w=32&h=32">'].join(''); 
			
		}
	}
		
	var get_name = function(object){ return [object.first_name, object.middle_name, object.last_name].join(' '); }	
	
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
		var st = host.stringBuffer();
		var name = get_name(object);
		var time = get_difference(time, object);
		var fallback = st._('<div>')._(name)._('</div>')._('<div>')._(time)._('</div>').result();
		jQuery(container).tipsy({
			gravity: 'sw',
			html: true,
			fallback: fallback
		});
	}
	
	var init_visitors = function(ul, json, count){
		var st = host.stringBuffer();
		for(var i=0;i<count;i++){
			var li = jQuery(st.clear()._('<li id="')._(json.response[i].id)._('" ><div class="avatar">')._(get_avatar(json.response[i]))._('</div></li>').result());
			jQuery(ul).append(li);
			init_tipty_tooltip(json.time, json.response[i], li);
		}
	}
	
	var init_button = function(json){
		jQuery(content[2]).click(function(){
			jQuery(content[1]).html('');
			var ul = jQuery('<ul></ul>');
			init_visitors(ul, json, json.response.length);
			jQuery(content[1]).append(ul);	
		});
	}
	
	var init_mini_profile = function(ul,json){
		var li = jQuery(ul).find('li');
		jQuery(li).each(function(i,e){
			var id = jQuery(e).attr('id');
			var div = jQuery(e).find('div.avatar');
			profile.tooltip.render({
				target:div,
				id:id+'-rv',
				type:'mini',
				data:json.objects[id],
				imgPath:json.path,
				fmbUser:json.fmbUser,
				eventType:'click'
			});	
		});
	}
	
	
	var render = function(callback){
		var id = jQuery(storage.header.activeButton).attr('id');
		parent.ajax('get_recent_visitors', id, function(res){
			var json = jQuery.parseJSON(res.responseText);
			if(json.objects.length == 0) return;
			parent.lang = json.lang;
			content = createBody(json);
			var count = (json.response.length<=15)?json.response.length:15;
			var ul = jQuery('<ul></ul>');
			init_visitors(ul, json, count);
			init_mini_profile(ul, json);
			init_button(json);
			jQuery(content[1]).append(ul);	
			jQuery(obj).append(content);
			if(callback) callback();
		});
	}
	
	var headerHandler = function(){
		storage.addEvent(storage.header.clickPull, function(object){
			profile.tooltip.cleaner();
			jQuery(content[1]).html('');
			render();
		});
	}	

	render(function(){
		headerHandler();
	});
}

JMBRecentVisitorsObject.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("recent_visitors", "JMBRecentVisitors", func, params, function(res){
				callback(res);
		})
	}
}

