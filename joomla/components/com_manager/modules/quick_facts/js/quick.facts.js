function JMBQuickFactsObject(obj){
	/**
	*
	*/
	var createBody = function(json){
		var sb = host.stringBuffer();
		var lang = json.lang;
		var header_background_color = (json.config.login_type=='famous_family')?json.config.colors.famous_header:json.config.colors.family_header;
		sb._('<div class="jmb_qf_header" style="background:#')._(header_background_color)._(';"><span>')._(lang['HEADER'])._('</span></div>');
		sb._('<div class="jmb_qf_content">');
			sb._('<div id="number_family_members" class="jmb_qf_item"><span class="jmb_qf_title">')._(lang['NUMBER'])._(':</span><span class="jmb_qf_text"></span></div>');
			sb._('<div id="youngest_living_member" class="jmb_qf_item"><span class="jmb_qf_title">')._(lang['YOUNGEST'])._(':</span><span class="jmb_qf_text"></span></div>');
			sb._('<div id="oldest_living_member" class="jmb_qf_item"><span class="jmb_qf_title">')._(lang['OLDEST'])._(':</span><span class="jmb_qf_text"></span></div>');
		sb._('</div>');
		sb._('<div class="jmb_qf_button"><span>')._(lang['SHOW_MORE_STATS'])._('...</span></div>');;
		var html = sb.result();
		var htmlObject = jQuery(html);
		jQuery(obj).append(htmlObject);
		return htmlObject;
	}
	/**
	*
	*/
	var getTurn = function(user){
		var	birth = user.birth,
			date = (birth!=null)?birth.date:null;
		if(date===null) return 'unknown';
		return (new Date()).getFullYear() - date[2];
	}
	/**
	*
	*/
	var getFullName = function(user){
		return [user.first_name,user.middle_name, user.last_name].join(' ');
		
	}
	/**
	*
	*/	
	var getNumberFamilyString = function(json){ 
		var st = host.stringBuffer();
		var lang = json.lang;
		return st._('<font style="color:green;">')
			._(json.count)._('</font> ( ')
			._(json.living)._(' ')
			._(lang['LIVING'])._(' )').result(); 
	}
	/**
	*
	*/
	var getYoungestMemberString = function(json){
		if(json.youngest == null) return 'unknown';
		var st = host.stringBuffer();
		var lang = json.lang;
		return st._('<font style="color:#')
			._(json.config.colors[json.youngest.user.gender])._(';">')
			._(getFullName(json.youngest.user))._('</font> ( ')
			._(getTurn(json.youngest.user))._(' ')
			._(lang['YEARS'])._(' )').result();
	}
	/**
	*
	*/
	var getOldestMemberString = function(json){
		if(json.oldest == null) return 'unknown';
		var st = host.stringBuffer();
		var lang = json.lang;
		return st._('<font style="color:#')
			._(json.config.colors[json.oldest.user.gender])._(';">')
			._(getFullName(json.oldest.user))._('</font> ( ')
			._(getTurn(json.oldest.user))._(' ')
			._(lang['YEARS'])._(' )').result();	
	}
	/**
	*
	*/
	var setMiniProfile = function(target, json, name){
		if(json[name]== null) return fasle;
		var object = json[name]
		storage.tooltip.render('view', {
			object:object,
			target:target
		});
	}
	/**
	*
	*/
	var clean = function(){
		jQuery(htmlObject).find('div#number_family_members').find('span.jmb_qf_text').html('');		
		jQuery(htmlObject).find('div#youngest_living_member').find('span.jmb_qf_text').html('');
		jQuery(htmlObject).find('div#oldest_living_member').find('span.jmb_qf_text').html('');
	}
	/**
	*
	*/
	var parent = this;
	var load = function(){
		parent._ajax('get', null, function(res){
			var json = jQuery.parseJSON(res.responseText);
			var htmlObject = createBody(json);
			jQuery(htmlObject).find('div#number_family_members').find('span.jmb_qf_text').html(getNumberFamilyString(json));		
			jQuery(htmlObject).find('div#youngest_living_member').find('span.jmb_qf_text').html(getYoungestMemberString(json));
			jQuery(htmlObject).find('div#oldest_living_member').find('span.jmb_qf_text').html(getOldestMemberString(json));
			setMiniProfile(jQuery(htmlObject).find('div#youngest_living_member').find('span.jmb_qf_text'), json, 'youngest');
			setMiniProfile(jQuery(htmlObject).find('div#oldest_living_member').find('span.jmb_qf_text'), json, 'oldest');
			storage.core.modulesPullObject.unset('JMBQuickFactsObject');
		})
	}
	/**
	*
	*/
	var init = function(){
		load();
	}
	
	init();	
}

JMBQuickFactsObject.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("quick_facts", "JMBQuickFacts", func, params, function(res){
				callback(res);
		})
	}
}



