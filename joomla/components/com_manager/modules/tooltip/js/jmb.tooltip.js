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
				fontSize: '12px'
			}
		}
	};
	module.viewSettings = {
		button_facebook:true,
		button_edit:true,
		style:{
			fill: '#628638', 
			strokeStyle: '#628638', 
			spikeLength: 40, 
			spikeGirth: 30, 
			padding: 0, 
			cornerRadius: 0, 
			trigger: 'none',
			positions:['left','right','bottom'],
			closeWhenOthersOpen: false,
			textzIndex:       999,
			boxzIndex:        998,
			wrapperzIndex:    997,
			width:405,
			cssStyles: {
				fontFamily: '"lucida grande",tahoma,verdana,arial,sans-serif', 
				fontSize: '12px'
			}
		}
	};
	module.idPull = {};
	module.stPull = {};
	module.btActive = [];
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
			object = settings.object,
			user = object.user,
			media = object.media,
			get = storage.usertree.parse(object),
			name = get.full_name,
			birthday = get.date('birth'),
			death = get.date('death'),
			relation = get.relation,
			place;
		sb._('<div id="')._(user.gedcom_id)._('-tooltip-view" class="jmb-tooltip-view-container">');
			sb._('<div class="jmb-tooltip-view-content">');
				sb._('<div class="jmb-tooltip-view-info">');
					sb._('<table>');
						sb._('<tr>');
							sb._('<td class="jmb-tooltip-view-avatar">')
							sb._('<div class="image">')._(module._avatar(settings));
								if(settings.button_edit){
									sb._('<div class="jmb-tooltip-view-edit">&nbsp;</div>');
								}
								if(user.facebook_id!=='0'&&settings.button_facebook){
									sb._('<div class="jmb-tooltip-view-facebook">&nbsp;</div>');
								}	
								if(get.is_death){
									sb._('<div class="jmb-tooltip-view-death-marker">&nbsp;</div>');
								}
							sb._('</td>');
							sb._('</div>');
							sb._('<td class="jmb-tooltip-view-info-data">');
								sb._('<div><span>Name:</span> <span class="text">')._(name)._('</span></div>');
								if(get.is_birth){
									place = get.place('birth');
									sb._('<div><span>Born:</span> <span class="text">')._(birthday)._((place.length!=0)?' ('+place.city+','+place.country+')':'')._('</span></div>');
								}
								if(get.is_death){
									place = get.place('death');
									sb._('<div><span>Deceased:</span> <span class="text">')._(death)._((place.length!=0)?' ('+place.city+','+place.country+')':'')._('</span></div>');
								}
								if(relation){
									sb._('<div><span>Relation:</span> <span class="text">')._(relation)._('</span></div>');
								}
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
					sb._('<div class="jmb-tooltip-view-switch"><span id="')._(get.getcom_id)._('">Show full profile</span></div>')
				sb._('</div>');
				if(media!=null&&media.photos.length!=0){
					sb._('<div class="jmb-tooltip-view-images">');
						sb._(module._images(settings));
					sb._('</div>');
				}
			sb._('</div>');
			if(user.facebook_id==='0' && get.turns < 100 && get.is_alive){
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
		var	module = this,
			sb = host.stringBuffer(),
			user = settings.object.user,
			gedcom_id = user.gedcom_id,
			get = storage.usertree.parse(settings.object),
			nick = get.nick;
		
		sb._("<div id='")._(gedcom_id)._("-tooltip-edit' class='jmb-profile-tooltip-container'>");
			sb._("<div class='jmb-profile-tooltip-button-edit'><span>Edit this Profile</span></div>");
			sb._("<div class='jmb-profile-tooltip-fieldset'><fieldset>");
				sb._("<legend>Add:</legend>");
				sb._("<div class='jmb-profile-tooltip-parent'><span>Parent</span></div>");
				sb._("<div class='jmb-profile-tooltip-spouse'><span>Spouse</span></div>");
				sb._("<div class='jmb-profile-tooltip-bs'><span>Brother or Sister</span></div>");
				sb._("<div class='jmb-profile-tooltip-child'><span>Child</span></div>");
			sb._('</fieldset></div>');
			if(user.facebook_id==='0' && get.turns < 100 && get.is_alive){
				sb._("<div class='jmb-profile-tooltip-send'>");
					sb._('<div class="info"><span>')._(nick)._(' is not regitred.</span></div>');
					sb._('<div class="invitions"><span class="click">Send ')._(nick)._(' an invitions.</span></div>');
					if(storage.notifications.is_accepted){
						sb._('<div class="link"><span>Link with existing request.</span></div>');
					}
					/*
					sb._('<table>');
						sb._('<tr>');
							sb._('<td rowspan="3">');
								sb._("<div class='jmb-profile-tooltip-send-img'>&nbsp;</div>");
							sb._('</td>');
							sb._('<td><span class="info">')._(nick)._(' is not registred.</span></td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td><span  class="click">Send ')._(nick)._(" an invations.</span></td>");
						sb._('</tr>');
						if(storage.notifications.is_accepted){
							sb._('<tr>');
								sb._('<td><span  class="link">Link with existing request.</span></td>');
							sb._('</tr>');
						}
					sb._('</table>');
					*/
				sb._('</div>');
			}
			sb._("<div class='jmb-profile-tooltip-close'><a href='javascript:void(jQuery(storage.tooltip.btActive[storage.tooltip.btActive.length-1].target).btOff());'><div>&nbsp;</div></a></div>");
		sb._('</div>');
		return jQuery(sb.result());
	},
	_create:function(type, settings){
		return (type==='view')?this._view(settings):this._edit(settings);
	},
	_setSettings:function(type, settings){
		var 	module = this,
			id = settings.object.user.gedcom_id,
			result = {},
			default_settings;					
		default_settings = (type==='view')?module.viewSettings:module.editSettings;

		jQuery.extend(result, default_settings, settings);

		if(settings.offsetParent){
			result.style.offsetParent = settings.offsetParent;
		}
		if(settings.preBuild){
			result.style.preBuild = settings.preBuild;
		}
		if(settings.preShow){
			result.style.preShow = settings.preShow;
		}
		
		module.stPull[module._getId(id,type)] = result;

		return module.stPull[module._getId(id,type)];
	},
	_images:function(settings){
		var 	module = this,
			object = settings.object,
			media = object.media,
			photos = (media!=null)?media.photos:false,
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
			image = (user.gender!='M')?'female.png':'male.png',
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
			if(module.btActive.length!=0&&typeof(settings.sub_item) == "undefined"){
				if(typeof(module.btActive[module.btActive.length-1].sub_item) != "undefined"){
					jQuery(module.btActive[module.btActive.length-2].target).btOff();
				} else {
					jQuery(module.btActive[module.btActive.length-1].target).btOff();
				}
			} 
			module.btActive[module.btActive.length] = settings;
			jQuery(settings.target).btOn();
			return false;
		});
	},
	_button_view:function(cont, settings){
		var	module = this,
			object = settings.object,
			offset;
			
		jQuery(cont).find('div.image').mouseenter(function(){
			jQuery(this).find('div.jmb-tooltip-view-edit').addClass('active');
			jQuery(this).find('div.jmb-tooltip-view-facebook').addClass('active');
		}).mouseleave(function(){
			jQuery(this).find('div.jmb-tooltip-view-edit').removeClass('active');
			jQuery(this).find('div.jmb-tooltip-view-facebook').removeClass('active');
		});
		jQuery(cont).find('div.jmb-tooltip-view-facebook').click(function(){
			window.open('http://www.facebook.com/profile.php?id='+storage.usertree.user,'new','width=320,height=240,toolbar=1');
		});
		jQuery(cont).find('div.jmb-tooltip-view-switch span').click(function(){
			var id = jQuery(this).attr('id');
			var st = module.stPull[module._getId(id,'view')];
			storage.profile.editor('view', {
				object:object,
				events:{
					afterEditorClose:function(obj){
						object = obj;
						if(typeof(settings.afterEditorClose)==='function'){
							settings.afterEditorClose(obj);
						}
					}
				}
			});
		});
		offset = jQuery(cont).find('div.jmb-tooltip-view-edit').offset();
		storage.tooltip.render('edit', {
			sub_item:true,
			object:object,
			target:jQuery(cont).find('div.jmb-tooltip-view-edit'),
			preBuild:function(){
				offset = jQuery('div.bt-content').find('div.jmb-tooltip-view-edit').offset();
			},
			preShow:function(box){
				if(offset!=null){
					jQuery(box).offset({top:offset.top + 20 , left:offset.left});
				}
			}
		});
	},
	_button_edit:function(cont, settings){
		var	module = this,
			object = settings.object,
			divs,
			add;
			
		divs = jQuery(cont).find('.jmb-profile-tooltip-fieldset div');
		add = storage.profile.add({
			object:object,
			events:{
				afterEditorClose:function(object){
					settings.object = object;
					if(typeof(settings.afterEditorClose)==='function'){
						settings.afterEditorClose(object);
					}
				}
			}
		});
		jQuery(divs).each(function(index, el){
			jQuery(el).click(function(){
				var class_name = jQuery(this).attr('class').split('-');
				var method = class_name[class_name.length-1]
				add[method]().init();
			});
		});
		jQuery(cont).find('.jmb-profile-tooltip-button-edit').click(function(){
			var id = jQuery(this).parent().attr('id').split('-')[0];
			var st = module.stPull[module._getId(id,'edit')];
			storage.profile.editor('edit', {
				object:st.object,
				events:{
					afterEditorClose:function(object){
						st.object = object;
						if(typeof(st.afterEditorClose)==='function'){
							st.afterEditorClose(object);
						}
					}
				}
			});
		});
	},
	_buttons:function(cont, settings, type){
		var	module = this;		
		switch(type){
			case "edit":
				module._button_edit(cont, settings);	
			break;
		
			case "view":
				module._button_view(cont, settings);
			break;
		}
	},
	_invitation:function(cont, type, settings){
		var class_name;
		switch(type){
			case "view": class_name = '.jmb-tooltip-view-send .send'; break;
			case "edit": class_name = '.jmb-profile-tooltip-send span.click'; break;
			default: return;
		}
		jQuery(cont).find(class_name).click(function(){
			storage.invitation.render(settings.object);
		});
	},
	link_with_request:function(cont, type, st){
		var class_name;
		switch(type){
			//case "view": class_name = '.jmb-tooltip-view-send .send'; break;
			case "edit": class_name = '.jmb-profile-tooltip-send div.link span'; break;
			default: return;
		}
		jQuery(cont).find(class_name).click(function(){
			storage.notifications.link(st);
		});
	},
	_getId:function(id, type){
		return [type,id].join(':');
	},
	cleaner:function(callback){
		var module = this, i, pull;
		if(module.btActive.length!=0){
			jQuery(module.btActive[module.btActive.length-1].target).btOff();
		}
		module.idPull = {};
		module.btActive = [];
		if(callback) callback();
	},
	render:function(type, settings){
		var	module = this,
			object = settings.object,
			id,
			cont;		
			
		if(!module._checkType(type)) return;
		if(object!=null){
			module._getId(object.user.gedcom_id,type);
		} else {
			return false;
		}
		st = module._setSettings(type, settings);
		
		if(!module.idPull[id]){
			cont = module._create(type, st);
			storage.media.init(cont);	
		
			jQuery(document.body).append(cont);
			jQuery(cont).hide();
		} else {
			cont = module.idPull[id];
		}
		
		st.style.contentSelector = ["jQuery('#", st.object.user.gedcom_id, "-tooltip-", type,"')"].join('');
		
		jQuery(st.target).bt(st.style);
		module._click(st);
		module._invitation(cont, type, st);
		module.link_with_request(cont, type, st);
		module._buttons(cont, st, type);
	}
}
