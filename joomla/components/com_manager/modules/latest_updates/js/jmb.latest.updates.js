function JMBLatestUpdates(obj){
	obj = jQuery('#'+obj);
	
	var items = ["New photo","Profile changes","Just registered"];
	var html = jQuery('<div class="jmb-lu-header"><span>Latest Updates</span></div><div class="jmb-lu-content"></div><div class="jmb-lu-button"><span>Show All...</span></div>');
	
	var get_content = function(mass){
		var st = host.stringBuffer();
		var ul = jQuery('<ul></ul>');
		for(var i=0;i<mass.length;i++){
			var li = st.clear()._('<li><div><span class="title">')._(mass[i])._(':</span><span class="text"></span></div></li>').result();
			jQuery(ul).append(li);
		}
		return ul;
	}
	
	var get_name = function(ind){
		return [ind.FirstName,ind.MiddleName,ind.LastName].join(' ');
	}
	
	var get_new_photo_text = function(json, colors){
		return '<font style="color:#'+colors[json.indiv.Gender]+'">'+get_name(json.indiv)+'</font>';
	}
	var get_profile_changes_text = function(json, colors){
		return '<font style="color:#'+colors[json.indiv.Gender]+'">'+get_name(json.indiv)+'</font>';
	}
	var get_registered_user_text = function(json, colors){
		return '<font style="color:#'+colors[json.indiv.Gender]+'">'+get_name(json.indiv)+'</font>';
	}
	
	var ul = get_content(items);
	jQuery(html[1]).append(ul);
	jQuery(obj).append(html);
	
	this.ajax('get', null, function(res){
		var json = jQuery.parseJSON(res.responseText);
		var li = jQuery(ul).find('li');
		jQuery(li[0]).find('span.text').html(get_new_photo_text(json.new_photo, json.colors));
		jQuery(li[1]).find('span.text').html(get_profile_changes_text(json.profile_changes, json.colors));
		jQuery(li[2]).find('span.text').html(get_registered_user_text(json.just_registered, json.colors));
	})
}

JMBLatestUpdates.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("latest_updates", "JMBLatestUpdates", func, params, function(res){
				callback(res);
		})
	},

}




