function JMBTooltip(){
	var module = this;
	module.editSettings = {
		style:{
			fill: '#F7F7F7', 
			strokeStyle: '#B7B7B7', 
			spikeLength: 40, 
			spikeGirth: 10, 
			padding: 8, 
			cornerRadius: 0, 
			trigger: 'none',
			closeWhenOthersOpen: true,
			textzIndex:       999,
			boxzIndex:        998,
			wrapperzIndex:    997,
			cssStyles: {
				fontFamily: '"lucida grande",tahoma,verdana,arial,sans-serif', 
				fontSize: '11px'
			}
		}
	};
	module.viewSettings = {
		style:{
			fill: '#628638', 
			strokeStyle: '#628638', 
			spikeLength: 40, 
			spikeGirth: 30, 
			padding: 0, 
			cornerRadius: 0, 
			trigger: 'none',
			closeWhenOthersOpen: true,
			textzIndex:       999,
			boxzIndex:        998,
			wrapperzIndex:    997,
			width:405,
			cssStyles: {
				fontFamily: '"lucida grande",tahoma,verdana,arial,sans-serif', 
				fontSize: '11px'
			}
		}
	};
	module.objPull = {
		length:0
	};
	module.idPull = {};
	module.btActive = null;
	module.path = "/components/com_manager/modules/tooltip/image/";
}


JMBTooltip.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("tooltip", "JMBTooltip", func, params, function(res){
				callback(res);
		})
	},
	_checkType:function(type){
		if(type === 'view'){
			return true;
		} else if(type === 'edit'){
			return true;
		} else {
			return false;
		}
	},
	_view:function(settings){
		var	module = this,
			sb = host.stringBuffer(),
			user = settings.object.user,
			media = settings.object.media,
			get = module._get(settings),
			name = get.full_name,
			birthday = get.date('birth'),
			death = get.date('death'),
			relation = get.relation;
		sb._('<div id="')._(user.gedcom_id)._('-tooltip-view" class="jmb-tooltip-view-container">');
			sb._('<div class="jmb-tooltip-view-content">');
				sb._('<div class="jmb-tooltip-view-info">');
					sb._('<table>');
						sb._('<tr>');
							sb._('<td class="jmb-tooltip-view-avatar"><div>')._(module._avatar(settings))._('</div></td>');
							sb._('<td class="jmb-tooltip-view-info-data">');
								sb._('<div><span>Name:</span> <span class="text">')._(name)._('</span></div>');
								sb._('<div><span>Born:</span> <span class="text">')._(birthday)._('</span></div>');
								if(relation){
									sb._('<div><span>Relation:</span> <span class="text">')._(relation)._('</span></div>');
								}
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
				sb._('</div>');
				if(media!=null&&media.photos.length!=0){
					sb._('<div class="jmb-tooltip-view-images">');
						sb._(module._images(settings));
					sb._('</div>');
				}
			sb._('</div>');
			if(user.facebook_id==='0'){
				sb._('<div class="jmb-tooltip-view-send">');
					sb._('<table>');			
						sb._('<tr>');
							sb._('<td><div class="jmb-tooltip-view-icon-email">&nbsp;</div></td>');
							sb._('<td>');
								sb._('<div><span>')._(name)._(' is not registred.</span></div>');
								sb._('<div><span class="send" style="color:blue;cursor:pointer">Click here to send ')._(name)._(' an email invitation.</span></div>');
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
				sb._('</div>')
			}
		sb._('</div>');
		return jQuery(sb.result());
	},
	_edit:function(settings){
	
	},
	_create:function(type, settings){
		return (type==='view')?this._view(settings):this._edit(settings);
	},
	_setSettings:function(type, settings){
		var 	module = this, 
			default_settings;					
		default_settings = (type==='view')?module.viewSettings:module.editSettings;
		return jQuery.extend(settings, default_settings);
	},
	_images:function(settings){
		var 	module = this,
			object = settings.object,
			media = object.media,
			photos = (media!=null)?media.photos:false;
			sb = host.stringBuffer();
		
		if(!photos) return '';
			
		sb._('<ul style="width:')._(55*photos.length)._('px;">');
		jQuery(photos).each(function(i,e){
			sb._('<li><a href="')._(e.path)._('" rel="prettyPhoto[pp_gal]" title=""><img src="index.php?option=com_manager&task=getResizeImage&id=')._(e.media_id)._('&w=50&h=50')._('" alt="" /></a></li>');
		});
		sb._('</ul>')
		return sb.result(); 
	},
	_avatar:function(settings){
		var	module = this,
			sb = host.stringBuffer(),
			object = settings.object,
			user = object.user,
			facebook_id = user.facebook_id,
			media = object.media,
			image = (user.gender!='M')?'male.png':'female.png',
			src = storage.baseurl+module.path+image;
		//get avatar image
		if(media!=null&&media.avatar!=null){
			return sb._('<img src="index.php?option=com_manager&task=getResizeImage&id=')._(media.avatar.media_id)._('&w=81&h=90">').result(); 
		}
		//get facebook image
		if(facebook_id !== '0'){
			return sb._('<img src="index.php?option=com_manager&task=getResizeImage&fid=')._(facebook_id)._('&w=81&h=90">').result();
		}
		//get default image
		return sb._('<img height="90px" width="81px" src="')._(src)._('">').result();		
	},
	_get:function(settings){
		var 	user = settings.object.user;
		return {
			_month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
			gedcom_id:user.gedcom_id,
			relation:(user.relation!=null)?relation:false,
			full_name:(function(){
				var	first_name = user.first_name,
					middle_name = user.middle_name,
					last_name = user.last_name;
					
				return [first_name, middle_name, last_name].join(' ');
			})(),
			date:function(event){
				var 	event = user[event],
					date = (event!=null)?event.date:null,
					day, month, year;
				if(date!=null){
					day = date[0];
					month = this._month[date[1]-1];
					year = date[2];
					return [day,month,year].join(' ');
				}
				return '';
			}
		}
	},
	_click:function(settings){
		var module = this;
		jQuery(settings.target).click(function(){
			if(module.btActive!=null){
				jQuery(module.btActive.target).btOff();	
			}
			module.btActive = settings;
			jQuery(settings.target).btOn();
			return false;
		});
	},
	_invitation:function(cont, settings){
		jQuery(cont).find('.jmb-tooltip-view-send .send').click(function(){
			storage.invitation.render(settings.object);
		});
	},
	_pulling:function(cont, settings){
		var 	module = this,
			gedcom_id = settings.object.user.gedcom_id,
			object = {
				cont:cont,
				settings:settings
			};
		module.idPull[id] = cont;
		module.objPull[module.objPull.length] = object;
		module.objPull.length++;
	},
	cleaner:function(){
		var module = this, i, pull;
		pull = module.objPull;
		for(i = 0 ; i < pull.length ; i++){
			jQuery(pull[i].cont).remove();
			delete pull[i];
		}
		module.idPull = {};
		module.objPull.length = 0;
	},
	render:function(type, settings){
		var	module = this,
			id = settings.object.user.gedcom_id,
			cont;		
		if(!module._checkType(type)) return;
		settings = module._setSettings(type, settings);
		
		if(!module.idPull[id]){
			cont = module._create(type, settings);
			storage.media.init(cont);	
		
			jQuery(document.body).append(cont);
			jQuery(cont).hide();
		} else {
			cont = module.idPull[id];
		}
		
		settings.style.contentSelector = ["jQuery('#", settings.object.user.gedcom_id, "-tooltip-view')"].join('');

		jQuery(settings.target).bt(settings.style);
		
		module._invitation(cont, settings);
		module._click(settings);
		module._pulling(cont, settings);
	}
}
