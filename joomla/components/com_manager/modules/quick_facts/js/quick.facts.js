function JMBQuickFactsObject(obj){
	obj = jQuery('#'+obj);	
	
	var profile =  new JMBProfile();
	
	var createBody = function(json){
		var sb = host.stringBuffer();
		var lang = json.lang;
		var header_background_color = (json.config.login_type=='famous_family')?json.config.colors.famous_header:json.config.colors.family_header;
		sb._('<div class="jmb_qf_header" style="background:#')._(header_background_color)._(';"><span>')._(lang['HEADER'])._('</span></div>');
		sb._('<div class="jmb_qf_content">');
			sb._('<div id="number_family_members" class="jmb_qf_item"><span class="jmb_qf_title">')._(lang['HEADER'])._(':</span><span class="jmb_qf_text"></span></div>');
			sb._('<div id="youngest_living_member" class="jmb_qf_item"><span class="jmb_qf_title">')._(lang['YOUNGEST'])._(':</span><span class="jmb_qf_text"></span></div>');
			sb._('<div id="oldest_living_member" class="jmb_qf_item"><span class="jmb_qf_title">')._(lang['OLDEST'])._(':</span><span class="jmb_qf_text"></span></div>');
			sb._('<div id="earliest_document" class="jmb_qf_item"><span class="jmb_qf_title">')._(lang['EARLIEST'])._(':</span><span class="jmb_qf_text"></span></div>');
		sb._('</div>');
		sb._('<div class="jmb_qf_button"><span>')._(lang['SHOW_MORE_STATS'])._('...</span></div>');;
		var html = sb.result();
		var htmlObject = jQuery(html);
		jQuery(obj).append(htmlObject);
		return htmlObject;
	}
	
	var getTurn = function(indiv){
		if(!indiv&&!indiv.Birth.length==0&&indiv.Birth[0].From==null&&indiv.Birth[0].From.Year==null) return 'unknown';
		return (new Date()).getFullYear() - indiv.Birth[0].From.Year;
	}
	var getFullName = function(indiv){
		var st = host.stringBuffer(),
		f = (indiv.FirstName!='')?indiv.FirstName:false,
		m = (indiv.MiddleName!='')?indiv.MiddleName:false,
		l = (indiv.LastName!='')?indiv.LastName:false;
		if(f&&m&&l){
			return st._(f)._(' ')._(m)._(' ')._(l).result();
		} else if(f&&!m&&l){
			return st._(f)._(' ')._(l).result();
		} else{
			return f;
		}
	}	
	var getNumberFamilyString = function(json){ 
		var st = host.stringBuffer();
		var lang = json.lang;
		return st._('<font style="color:green;">')._(json.count)._('</font> ( ')._(json.living)._(' ')._(lang['LIVING'])._(' )').result(); 
	}
	var getYoungestMemberString = function(json){
		if(json.youngest == null) return 'unknown';
		var st = host.stringBuffer();
		var lang = json.lang;
		st._('<font style="color:#')._(json.config.colors[json.youngest.indiv.Gender])._(';">')._(getFullName(json.youngest.indiv))._('</font> ( ')._(getTurn(json.youngest.indiv))._(' ')._(lang['YEARS'])._(' )');	
		return st.result();
	}
	var getOldestMemberString = function(json){
		if(json.oldest == null) return 'unknown';
		var st = host.stringBuffer();
		var lang = json.lang;
		st._('<font style="color:#')._(json.config.colors[json.oldest.indiv.Gender])._(';">')._(getFullName(json.oldest.indiv))._('</font> ( ')._(getTurn(json.oldest.indiv))._(' ')._(lang['YEARS'])._(' )');	
		return st.result();
	}
	var getEarliestDocumentString = function(json){
		if(json.earliest == null) return '<font style="color:blue;">"Incognito"</font> (unknown)';
		var st = host.stringBuffer();
		var lang = json.lang;
		st._('<font style="color:#')._(json.config.colors[json.earliest.indiv.Gender])._(';">')._(getFullName(json.earliest.indiv))._('</font> ( ')._(getTurn(json.earliest.indiv))._(' ')._(lang['YEARS'])._(' )');	
		return st.result();
	}
	var setMiniProfile = function(object, json, name){
		if(json[name] == null) return 0;
		profile.tooltip.render({
			target:object,
			id:json[name].indiv.Id+'-qf',
			type:'mini',
			data:json[name],
			imgPath:json.path,
			fmbUser:json.fmbUser,
			eventType:'click'
		});
	}
	
	var clean = function(){
		jQuery(htmlObject).find('div#number_family_members').find('span.jmb_qf_text').html('');		
		jQuery(htmlObject).find('div#youngest_living_member').find('span.jmb_qf_text').html('');
		jQuery(htmlObject).find('div#oldest_living_member').find('span.jmb_qf_text').html('');
		jQuery(htmlObject).find('div#earliest_document').find('span.jmb_qf_text').html('');
	}
	
	
	var parent = this;
	var load = function(){
		var id = jQuery(storage.header.activeButton).attr('id');
		parent._ajax('get', id, function(res){
			var json = jQuery.parseJSON(res.responseText);
			var htmlObject = createBody(json);
			jQuery(htmlObject).find('div#number_family_members').find('span.jmb_qf_text').html(getNumberFamilyString(json));		
			jQuery(htmlObject).find('div#youngest_living_member').find('span.jmb_qf_text').html(getYoungestMemberString(json));
			jQuery(htmlObject).find('div#oldest_living_member').find('span.jmb_qf_text').html(getOldestMemberString(json));
			jQuery(htmlObject).find('div#earliest_document').find('span.jmb_qf_text').html(getEarliestDocumentString(json));
			setMiniProfile(jQuery(htmlObject).find('div#youngest_living_member').find('span.jmb_qf_text'), json, 'youngest');
			setMiniProfile(jQuery(htmlObject).find('div#oldest_living_member').find('span.jmb_qf_text'), json, 'oldest');
			setMiniProfile(jQuery(htmlObject).find('div#earliest_document').find('span.jmb_qf_text'), json, 'earliest');
		})
	}
	
	var init = function(){
		load();
		storage.addEvent(storage.header.clickPull, function(object){
			clean(); load();
		});
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



