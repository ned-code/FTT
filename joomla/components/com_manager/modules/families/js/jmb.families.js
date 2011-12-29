function JMBFamiliesObject(obj){
	var	module = this,
		json,
		gedcom_id;
		
	module.parent = obj;
	module.path = storage.baseurl+"/components/com_manager/modules/families/";
	module.cssPath = module.path+'css/';
	module.json = null;
	module.user = null;
	module.now_id = null;
	module.usertree = null;
	module.colors = null;
	module.cont = null;
	module.start_id = null;
	module.imageSize = {
		parent:{
			width:108,
			height:120
		},
		child:{
			width:72,
			height:80
		}
	}
	
	module._ajax('getFamilies', null, function(res){
		json = jQuery.parseJSON(res.responseText);
		module.json = json;
		module.user = json.user;
		module.usertree = json.usertree;
		module.colors = json.colors;
		module.start_id = module._first(json.user.user.gedcom_id);
		module.render(module.start_id);
		storage.core.modulesPullObject.unset('JMBFamiliesObject');
	});
}
JMBFamiliesObject.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("families", "JMBFamilies", func, params, function(res){
				callback(res);
		})
	},
	_getImageSize:function(type, k){
		var	module = this,
			imageSize = module.imageSize,
			size = imageSize[type],
			width = Math.round(size.width*k),
			height = Math.round(size.height*k);
		return {
			width: width,
			height: height 
		};
	},
	_avatar:function(object, type, k){
		var	module = this,
			sb = host.stringBuffer(),
			user = object.user,
			facebook_id = user.facebook_id,
			media = object.media,
			image = (user.gender!='M')?'female.png':'male.png',
			src = [module.cssPath,image].join(''),
			size = module._getImageSize(type, k);		
		//get avatar image
		if(media!=null&&media.avatar!=null){
			return sb._('<img class="jmb-families-avatar view" src="index.php?option=com_manager&task=getResizeImage&id=')._(media.avatar.media_id)._('&w=')._(size.width)._('&h=')._(size.height)._('">').result(); 
		}
		//get facebook image
		if(facebook_id !== '0'){
			return sb._('<img class="jmb-families-avatar view" src="index.php?option=com_manager&task=getResizeImage&fid=')._(facebook_id)._('&w=')._(size.width)._('&h=')._(size.height)._('">').result();
		}
		//get default image
		return sb._('<img class="jmb-families-avatar view" height="')._(size.height)._('px" width="')._(size.width)._('px" src="')._(src)._('">').result();		
	},
	_parentId:function(parents){
		var mother, father;
		for(var key in parents){
			if(key!='length'){
				mother = parents[key].mother;
				father = parents[key].father;
				return (mother)?mother.gedcom_id:father.gedcom_id;
			}
		}
	},
	_spouses:function(families){
		if(families==null) return [];
		var spouses = [], family, spouse;
		for(var key in families){
			if (!families.hasOwnProperty(key)) continue;
			if(key!='length'){
				family = families[key];
				if(family.spouse!=null){
					spouse = [family.id, family.spouse];
					spouses.push(spouse);
				}
			}
		}
		return spouses;
	},
	_childrens:function(families){
		var childrens = [], family, child;
		for(var key in families){
			if (!families.hasOwnProperty(key)) continue;
			if(key!='length'){
				family = families[key];
				if(family.childrens!=null){
					for(var i = 0 ; i < family.childrens.length ; i ++){
						child = family.childrens[i];
						childrens.push(child);
					}
				}
			}
		}
		return childrens;
	},
	_childrensCount:function(families){
		var	module = this,
			count = 0;
		for(var key in families){
			if (!families.hasOwnProperty(key)) continue;
			if(key!='length'&&families[key].childrens!=null){
				count += families[key].childrens.length;
			}
		}
		return count;	
	},
	_first:function(gedcom_id){
		var	module = this;
			object = module.usertree[gedcom_id],
			families = object.families,
			parents = object.parents;
		if(families!=null&&module._childrensCount(families)!=0){
			return gedcom_id;
		} else {
			if(parents.length!=0){
				return module._parentId(parents);
			}
		}
		return gedcom_id;
	},
	_home:function(cont){
		var	module = this,
			gedcom_id = module.user.gedcom_id;
		jQuery(cont).find('div.home').click(function(){
			module.render(module.start_id);
		});
	},
	_create:function(){
		var	sb = host.stringBuffer();
		sb._('<div class="jmb-families-body">');
			sb._('<table width="100%">');
				sb._('<tr>');
					sb._('<td style="width:170px;"><div style="width:150px;" class="jmb-families-header">&nbsp;</div></td>');
					sb._('<td style="width:150px;"><div class="jmb-families-sircar">&nbsp;</div></td>');
					sb._('<td style="width:90px;"><div class="jmb-families-event">&nbsp;</div></td>');
					sb._('<td style="width:150px;"><div class="jmb-families-spouse">&nbsp;</div></td>');
					sb._('<td style="width:170px;"><div class="jmb-families-spouse-container">&nbsp;</div></td>');
				sb._('</tr>');
				sb._('<tr>');
					sb._('<td colspan="5" align="center"><div class="jmb-families-childs-container">&nbsp;</div></td>');
				sb._('</tr>');
			sb._('</table>');
			sb._('<div class="home">&nbsp;</div>');
		sb._('</div>');
		return jQuery(sb.result());
	},
	_info:function(object, spouse){
		var	module = this,
			sb = host.stringBuffer(),
			event = object.families[spouse[0]].event,
			date,
			place,
			location = '';
			
		if(event!=null){
			date = event.date;
			place = event.place;
			if(place != null){
				location = place.country;
			}
			sb._('<div>');
				sb._('<div>')._(date[2])._('</div>');
				sb._('<div>')._(location)._('</div>');
			sb._('</div>');
		}
		return '';
	},
	_checkParents:function(parents){
		if(parents==null) return false;
		var module = this, key, family, father, mother;
		
		for(key in parents){
			if(key!='length'){
				family = parents[key];
				father = (family.father!=null&&module.usertree[family.father.gedcom_id])?family.father.gedcom_id:false;
				mother = (family.mother!=null&&module.usertree[family.mother.gedcom_id])?family.mother.gedcom_id:false;
				return (mother)?mother:father;
			}
		}
		return false;
	},
	_sircar:function(gedcom_id){
		var	module = this,
			sb = host.stringBuffer(),
			usertree = module.usertree,
			object = usertree[gedcom_id],
			gedcom_id = object.user.gedcom_id,
			facebook_id = object.user.facebook_id,
			parents = object.parents,
			get = storage.usertree.parse(object);
		sb._('<div>');
			if(parent_key = module._checkParents(parents)){
				sb._('<div  id="')._(parent_key)._('" class="jmb-families-button parent active">&nbsp;</div>');
			} else {
				sb._('<div  id="null" class="jmb-families-button parent">&nbsp;</div>');
			}
			sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" class="jmb-families-parent-img">')._(module._avatar(object, 'parent', 1));
				sb._('<div id="')._(gedcom_id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
				if(facebook_id != '0'){
					sb._('<div class="jmb-families-fb-icon parent" id="')._(facebook_id)._('">&nbsp;</div>');
				}
				if(get.is_death){
					sb._('<div class="jmb-families-death-marker parent">&nbsp;</div>');
				}
			sb._('</div>');
			sb._('<div>');
				sb._('<div class="jmb-families-parent-name">')._(get.nick)._('</div>');
				sb._('<div class="jmb-families-parent-date">')._(get.birth('year'))._('</div>');
			sb._('</div>');
			if(families!=null){
				sb._('<div class="jmb-families-arrow-left">&nbsp</div>');
			}
		sb._('</div>');		
		return jQuery(sb.result());
	},
	_spouse:function(spouse){
		var	module = this,
			sb = host.stringBuffer(),
			family_id = spouse[0],
			gedcom_id = spouse[1],
			usertree = module.usertree,
			object = usertree[gedcom_id],
			gedcom_id = object.user.gedcom_id,
			facebook_id = object.user.facebook_id,
			parents = object.parents,
			get = storage.usertree.parse(object), 
			parent_key;
		sb._('<div>');
			if(parent_key = module._checkParents(parents)){
				sb._('<div  id="')._(parent_key)._('" class="jmb-families-button parent active">&nbsp;</div>');
			} else {
				sb._('<div  id="null" class="jmb-families-button parent">&nbsp;</div>');
			}
			sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" class="jmb-families-parent-img">')._(module._avatar(object, 'parent', 1));
				sb._('<div id="')._(gedcom_id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
				if(facebook_id != '0'){
					sb._('<div class="jmb-families-fb-icon parent" id="')._(facebook_id)._('">&nbsp;</div>');
				}
				if(get.is_death){
					sb._('<div class="jmb-families-death-marker parent">&nbsp;</div>');
				}
			sb._('</div>');
			sb._('<div>');
				sb._('<div class="jmb-families-parent-name">')._(get.nick)._('</div>');
				sb._('<div class="jmb-families-parent-date">')._(get.birth('year'))._('</div>');
			sb._('</div>');
			if(families!=null){
				sb._('<div class="jmb-families-arrow-right">&nbsp</div>');
			}
		sb._('</div>');		
		return jQuery(sb.result());
	},
	_former_spouse:function(spouse){
		var	module = this,
			sb = host.stringBuffer(),
			family_id = spouse[0],
			gedcom_id = spouse[1],
			usertree = module.usertree,
			object = usertree[gedcom_id],
			gedcom_id = object.user.gedcom_id,
			facebook_id = object.user.facebook_id,
			parents = object.parents,
			get = storage.usertree.parse(object);
			
		sb._('<div class="jmb-families-spouse-div">');
			sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" class="jmb-families-parent-img">')._(module._avatar(object, 'parent', 1));
				sb._('<div id="')._(gedcom_id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
				if(facebook_id != '0'){
					sb._('<div class="jmb-families-fb-icon parent" id="')._(facebook_id)._('">&nbsp;</div>');
				}
				if(get.is_death){
					sb._('<div class="jmb-families-death-marker parent">&nbsp;</div>');
				}
			sb._('</div>');
			sb._('<div>');
				sb._('<div class="jmb-families-parent-name">')._(get.nick)._('</div>');
				sb._('<div class="jmb-families-parent-date">')._(get.birth('year'))._('</div>');
			sb._('</div>');
		sb._('</div>');
		return jQuery(sb.result());
	},
	_child:function(child, k){
		var	module = this,
			sb = host.stringBuffer(),
			usertree = module.usertree,
			gedcom_id = child.gedcom_id,
			object = usertree[gedcom_id],
			user = object.user,
			families = object.families,
			facebook_id = user.facebook_id,
			edit_button = (k!=1)?'jmb-families-edit-button child small':'jmb-families-edit-button child',
			child_button_active = (k!=1)?'jmb-families-button childs active small':'jmb-families-button childs active',
			child_button_unactive = (k!=1)?'jmb-families-button childs small':'jmb-families-button childs',
			arrow_class = (k!=1)?'jmb-families-arrow-up small':'jmb-families-arrow-up',
			get = storage.usertree.parse(object),
			date = get.birth('year');

		sb._('<div childId="')._(gedcom_id)._('" class="jmb-families-child" style="height:')._(Math.round(170*k))._('px;">');
		sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" style="height:')._(Math.round(80*k))._('px;width:')._(Math.round(72*k))._('px;" class="jmb-families-child-img">')._(module._avatar(object, 'child', k));	
				sb._('<div id="')._(gedcom_id)._('-edit" class="')._(edit_button)._('">&nbsp;</div>');
				if(facebook_id != '0'){
					sb._('<div class="jmb-families-fb-icon child" id="')._(facebook_id)._('">&nbsp;</div>');
				}
				if(get.is_death){
					sb._('<div class="jmb-families-death-marker parent">&nbsp;</div>');
				}
			sb._('</div>')
			sb._('<div>');
				sb._('<div class="jmb-families-child-name">')._(get.nick)._('</div>');
				if(date.length!=0) sb._('<div class="jmb-families-child-date">')._(date)._('</div>');
			sb._('</div>');
			if(module._childrensCount(families)!=0){
				sb._('<div id="')._(gedcom_id)._('" class="')._(child_button_active)._('">&nbsp;</div>');
			} else {
				sb._('<div id="null" class="')._(child_button_unactive)._('">&nbsp;</div>');
			}
			
			sb._('<div class="')._(arrow_class)._('">&nbsp</div>');
			if(date.length==0) sb._('<div>&nbsp;</div>');
		return jQuery(sb.result());
	},
	_arrows:function(cont){
		var module = this, id;
		jQuery(cont).find('.jmb-families-button').each(function(index, element){
			jQuery(element).click(function(){
				if( (id = jQuery(this).attr('id')) == 'null'){
					return false;
				}
				module.reload(id, jQuery(this).hasClass('parent'));
			});
		});
	},
	_key:function(id, type){
		var	module = this,
			usertree = module.usertree,
			object = usertree[id],
			parents = object.parents;
		if(type){
			return module._parentId(parents);
		} else {
			return id;	
		}
	},
	_view:function(cont){
		var	module = this,
			usertree = module.usertree, 
			gedcom_id;
		jQuery(cont).find('.jmb-families-avatar.view').each(function(i,e){
			gedcom_id = jQuery(e).parent().attr('id').split('-')[0];
			storage.tooltip.render('view', {
				object:usertree[gedcom_id],
				target:e
			});
		});
	},
	_edit:function(cont){
		var	module = this,
			usertree = module.usertree,
			gedcom_id;
		jQuery(cont).find('.jmb-families-edit-button').each(function(i,e){
			gedcom_id = jQuery(e).attr('id').split('-')[0];
			storage.tooltip.render('edit', {
				object:usertree[gedcom_id],
				target:e,
				afterEditorClose:function(object){
					module.render(module.now_id);	
				}
			});
		});
	},
	_facebook:function(cont){
		var id;
		jQuery(cont).find('.jmb-families-fb-icon').each(function(i,e){
			jQuery(e).click(function(){
				id = jQuery(e).attr('id');
				window.open('http://www.facebook.com/profile.php?id='+id,'new','width=320,height=240,toolbar=1')
			});
		});
	},
	_win:function(cont){
		var	module = this;
		jQuery(cont).find('div[type="imgContainer"]').each(function(i,div){
			jQuery(div).mouseenter(function(){
				jQuery(div).find('.jmb-families-edit-button').addClass('hover');
				jQuery(div).find('.jmb-families-fb-icon').addClass('hover');
			}).mouseleave(function(){
				jQuery(div).find('.jmb-families-edit-button').removeClass('hover');
				jQuery(div).find('.jmb-families-fb-icon').removeClass('hover');
			});
		});
	},
	render:function(gedcom_id){
		var	module = this,
			object = module.usertree[gedcom_id],
			families = object.families,
			cont = module._create(),
			spouses = module._spouses(families),
			childrens = module._childrens(families),
			sircar, 
			info,
			spouse,
			i,
			childrens_table,
			row_count,
			k;
				
		if(module.cont!=null){
			jQuery(module.cont).remove();
		}
		module.cont = cont;
		module.now_id = gedcom_id;
		
		jQuery(module.parent).append(cont);
		
		module._home(cont);	
		
		sircar = module._sircar(gedcom_id);
		jQuery(cont).find('.jmb-families-sircar').append(sircar);

		if(spouses.length!=0){
			info = module._info(object, spouses[0]);
			jQuery(cont).find('.jmb-families-event').append(info);
			spouse = module._spouse(spouses[0]);
			jQuery(cont).find('.jmb-families-spouse').append(spouse);
			if(spouse.length > 1){
				for(i = 1 ; i < spouses.length ; i ++){
					spouse = module._former_spouse(spouses[i]);
					jQuery(cont).find('.jmb-families-spouse-container').append(spouse);
				}
			}
		}
		
		if(childrens.length!=0){
			childrens_table = jQuery('<table align="center" width="100%"><tr><td valing="top"></td></tr><tr><td valing="top"></td></tr></table>');
			row_count = (childrens.length > 10 && childrens.length < 20)? Math.round(childrens.length/2):10;
			k = (childrens.length<10||(childrens.length>10&&childrens.length<20))?1:0.9;
			for(i = 0; i < childrens.length ; i++){
				child = module._child(childrens[i], k);
				jQuery(childrens_table[0].rows[(i<row_count)?0:1].cells[0]).append(child);
			}
			jQuery(cont).find('.jmb-families-childs-container').append(childrens_table);
		}	
		
		module._arrows(cont);
		module._view(cont);
		module._edit(cont);
		module._facebook(cont);
		module._win(cont);
	},
	reload:function(id, type){
		var	module = this;
		storage.tooltip.cleaner(function(){
			module.render(id);
		});		
	}
}
