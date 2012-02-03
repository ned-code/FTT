function JMBQuickFactsObject(object){	
	var	module = this,
		json,
		cont,
		fn;
		
	fn = {
		getTurn:function(user){
			var	birth = user.birth,
				date = (birth!=null)?birth.date:null;
			if(date===null) return 'unknown';
			return (new Date()).getFullYear() - date[2];
		},
		getFullName:function(user){
			return [user.first_name,user.middle_name, user.last_name].join(' ');
		},
		getNumberFamilyString:function(){ 
			var sb = host.stringBuffer();
			var lang = json.lang;
			sb._('<font style="color:green;">')._(json.count)._('</font> ( ');
				sb._(json.living)._(' ');
				sb._(lang['LIVING'])._(' )'); 
			return sb.result();
		},
		getYoungestMemberString:function(){
			if(json.youngest == null) return 'unknown';
			var sb = host.stringBuffer();
			var lang = json.lang;
			sb._('<font id="')._(json.youngest.user.gedcom_id)._('" style="color:#');
				sb._(json.config.colors[json.youngest.user.gender])._(';">');
					sb._(fn.getFullName(json.youngest.user));
			sb._('</font> ( ');
			sb._(fn.getTurn(json.youngest.user))._(' ')
			sb._(lang['YEARS'])._(' )');
			return sb.result();
		},
		getOldestMemberString:function(){
			if(json.oldest == null) return 'unknown';
			var sb = host.stringBuffer();
			var lang = json.lang;
			sb._('<font id="')._(json.oldest.user.gedcom_id)._('" style="color:#');
				sb._(json.config.colors[json.oldest.user.gender]);
			sb._(';">');
				sb._(fn.getFullName(json.oldest.user));
			sb._('</font> ( ');
			sb._(fn.getTurn(json.oldest.user))._(' ');
			sb._(lang['YEARS'])._(' )');	
			return sb.result();
		},
		create:function(){
			var sb = host.stringBuffer();
			var lang = json.lang;
			var header_background_color = (json.config.login_type=='famous_family')?json.config.colors.famous_header:json.config.colors.family_header;
			sb._('<div class="jmb_qf_header" style="background:#')._(header_background_color)._(';"><span>')._(lang['HEADER'])._('</span></div>');
			sb._('<div class="jmb_qf_content">');
				sb._('<div id="number_family_members" class="jmb_qf_item">');
					sb._('<span class="jmb_qf_title">')._(lang['NUMBER'])._(':</span>');
					sb._('<span class="jmb_qf_text">')._(fn.getNumberFamilyString())._('</span>');
				sb._('</div>');
				sb._('<div id="youngest_living_member" class="jmb_qf_item">');
					sb._('<span class="jmb_qf_title">')._(lang['YOUNGEST'])._(':</span>');
					sb._('<span class="jmb_qf_text">')._(fn.getYoungestMemberString())._('</span>');
				sb._('</div>');
				sb._('<div id="oldest_living_member" class="jmb_qf_item">');
					sb._('<span class="jmb_qf_title">')._(lang['OLDEST'])._(':</span>');
					sb._('<span class="jmb_qf_text">')._(fn.getOldestMemberString())._('</span>');
				sb._('</div>');
			sb._('</div>');
			sb._('<div class="jmb_qf_button"><span>')._(lang['SHOW_MORE_STATS'])._('...</span></div>');
			
			var html = sb.result();
			var htmlObject = jQuery(html);
			jQuery(object).append(htmlObject);
			return htmlObject;
		},
		setMiniProfile:function(target, object){
			if(object == null) return fasle;
			storage.tooltip.render('view', {
				object:object,
				target:target
			});
		},
		init:function(callback){
			module._ajax('get', null, function(res){
				json = jQuery.parseJSON(res.responseText);
				cont = fn.create();
				fn.setMiniProfile(jQuery(cont).find('div#youngest_living_member'), json.youngest);
				fn.setMiniProfile(jQuery(cont).find('div#oldest_living_member'), json.oldest);
				callback();
			});
		}
	}
	
	
	fn.init(function(){
		storage.core.modulesPullObject.unset('JMBQuickFactsObject');
	});
	
	storage.family_line.bind('JMBQuickFactsObject', function(res){
		if(res._type != 'pencil') return false;
		var usertree = {}
		usertree[json.youngest.user.gedcom_id] = json.youngest;
		usertree[json.oldest.user.gedcom_id] = json.oldest;
		jQuery(cont).find('div#youngest_living_member font,div#oldest_living_member font').each(function(i, el){
			var type = 'is_'+res._line+'_line';
			var id = jQuery(el).attr('id');
			var user =  usertree[id].user;
			if(parseInt(user.is_father_line)&&parseInt(user.is_mother_line)){
				var opt = storage.family_line.get.opt();
				if(opt.mother.pencil&&opt.father.pencil){
					jQuery(el).addClass('jmb-familiy-line-bg');
				} else {
					jQuery(el).removeClass('jmb-familiy-line-bg');
					if(opt.mother.pencil||opt.father.pencil){
						if(opt[res._line].pencil){
							jQuery(el).css('background-color', opt[res._line].pencil);	
						} else {
							jQuery(el).css('background-color', (opt.mother.pencil)?opt.mother.pencil:opt.father.pencil);
						}
					} else {
						jQuery(el).css('background-color', 'white');	
					}
				}
			} else {
				if(parseInt(user[type])){
					jQuery(el).css('background-color', res._background);	
				}
			}
		});
	});
}

JMBQuickFactsObject.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("quick_facts", "JMBQuickFacts", func, params, function(res){
				callback(res);
		})
	}
}



