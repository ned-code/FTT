function JMBLatestUpdates(obj){
	obj = jQuery('#'+obj);	
	
	var html = null;	
	var profile =  new JMBProfile();
	
	var get_content = function(items){
		var st = host.stringBuffer();
		var ul = jQuery('<ul></ul>');
		for(var i=0;i<items.length;i++){
			var li = st.clear()._('<li><div id="')._(items[i].id)._('"><span class="title">')._(items[i].name)._(':</span><span class="text"></span></div></li>').result();
			jQuery(ul).append(li);
		}
		return ul;
	}
		
	
	
	var get_name = function(indiv){
		var name = [];
		(indiv.FirstName!=null)?name.push(indiv.FirstName):'';
		(indiv.MiddleName!=null)?name.push(indiv.MiddleName):'';
		(indiv.LastName!=null)?name.push(indiv.LastName):'';
		return name.join(' ');
	}
	
	var get_string = function(json, type){
		if(json[type]==null) return '';
		var object = json[type];
		var name = get_name(object.indiv);
		return ['<font style="color:#', json.colors[object.indiv.Gender],';">',name,'</font>'].join('');
	}

	var setMiniProfile = function(object, json, name){
		if(json[name]==null) return;
		profile.tooltip.render({
			target:object,
			id:json[name].indiv.Id+'-lu',
			type:'mini',
			data:json[name],
			imgPath:json.path,
			fmbUser:json.fmbUser,
			eventType:'click'
		});
	}
	
	this.ajax('get', null, function(res){
		var json = jQuery.parseJSON(res.responseText);
		var lang = json.lang;
		var html = jQuery('<div class="jmb-lu-header"><span>'+lang['HEADER']+'</span></div><div class="jmb-lu-content"></div><div class="jmb-lu-button"><span>'+lang['SHOW']+'...</span></div>');
		var structure = [
			{"id":"new_photo","name":lang['PHOTO']},
			{"id":"just_registered","name":lang['REGISTER']},
			{"id":"profile_change","name":lang['PROFILE']},
			{"id":"family_member_added","name":lang['ADDED']},
			{"id":"family_member_deleted","name":lang['DELETED']},
		];
		
		var ul = get_content(structure);
		
		jQuery(ul).find('#new_photo').find('span.text').html(get_string(json, 'new_photo'));
		jQuery(ul).find('#just_registered').find('span.text').html(get_string(json, 'just_registered'));
		jQuery(ul).find('#profile_change').find('span.text').html(get_string(json, 'profile_change'));
		jQuery(ul).find('#family_member_added').find('span.text').html(get_string(json, 'family_member_added'));
		jQuery(ul).find('#family_member_deleted').find('span.text').html(json.family_member_deleted.split(',').join(' '));
		setMiniProfile(jQuery(ul).find('#new_photo').find('span.text'), json, 'new_photo');
		setMiniProfile(jQuery(ul).find('#just_registered').find('span.text'), json, 'just_registered');
		setMiniProfile(jQuery(ul).find('#profile_change').find('span.text'), json, 'profile_change');
		setMiniProfile(jQuery(ul).find('#family_member_added').find('span.text'), json, 'family_member_added');
		
		jQuery(html[1]).append(ul);
		jQuery(obj).append(html);
	})
}

JMBLatestUpdates.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("latest_updates", "JMBLatestUpdates", func, params, function(res){
				callback(res);
		})
	},

}




