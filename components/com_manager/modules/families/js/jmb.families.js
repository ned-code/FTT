function JMBFamiliesObject(obj, popup){
	var	module = this,
		json,
		gedcom_id;


	module.popup = (typeof(popup) == 'undefined')?false:popup;
	module.parent = obj;
	module.path = storage.baseurl+"/components/com_manager/modules/families/";
	module.cssPath = module.path+'css/';
	module.now_id = null;
	module.usertree = null;
	module.colors = null;
	module.cont = null;
	module.start_id = null;
    module.nameTooltip = [];
	module.clickItem = false;
	module.childsPos = {};
    module.mask = {};
    module.famId = 0;
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
	module.borders = module._generateBorders(100);
    module.border_iter = 0;
	module.spouse_border = {};

	storage.family_line.bind('JMBFamiliesObject', function(res){
		var divs = jQuery(module.cont).parent().find('div.jmb-families-sircar,div.jmb-families-spouse,div.jmb-families-child');
		jQuery(divs).each(function(i, el){
			var id = jQuery(el).attr('id');
			var object = module.usertree[id];
			var user = object.user;
			var bg_color = (res._active)?res._background:"#F5FAE6";
			var type = 'is_'+res._line+'_line';
			if(parseInt(user[type])){
				jQuery(el).find('div#'+res._line+'_line').css('border', '2px solid '+bg_color);		
			}
		});
	});

    module.loggedByFamous = parseInt(jQuery(document.body).attr('_type'));
	module.settings = storage.settings;
	module.colors = module.settings.colors;
    module.usertree = storage.usertree.pull;
	module.start_id = module._first(storage.usertree.gedcom_id);


    jQuery(module.parent).ready(function(){
        module.render(module.start_id);
        storage.core.modulesPullObject.unset('JMBFamiliesObject');
    });
}
JMBFamiliesObject.prototype = {
	_ajax:function(func, params, callback){
        storage.callMethod("families", "JMBFamilies", func, params, function(res){
				callback(res);
		})
	},
    _generateBorders:function(n){
        var retBorders = [];
        var isBorders = {};
        var getColor = function(){ return '#'+Math.floor(Math.random()*16777215).toString(16); }
        for(var i = 0 ; i < n ; i++ ){
            var color = getColor();
            if(!isBorders[color]){
                isBorders[color] = true;
                retBorders.push(color);
            } else {
                i--;
            }
        }
        return retBorders;
    },
    _getBorderColor:function(sp){
        if(!sp) return "#000000";
        var module = this,
            color = module.borders[module.border_iter];
        module.border_iter++;
        module.spouse_border[sp[0]] = color;
        return color;
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
        var module = this,
            size = module._getImageSize(type, k);
        return storage.usertree.avatar.get({
            object:object,
            cssClass:"jmb-families-avatar view",
            width:size.width,
            height:size.height
        });
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
    _getTopFormerSpouseBox:function(s){
        var l = s.length;
        switch(l){
            case 2:
                return '69px';
                break;

            default:
                return '0';
                break;
        }
    },
	_spouses:function(object, defaultFamily){
        if(!object) return false;
        var module = this,families, spouses = [], family, spouse, childrens = {}, childs, el, child, def;
        families = object.families;
        def = object.user.default_family;
		if(families==null) return [];
		for(var key in families){
			if (!families.hasOwnProperty(key)) continue;
			if(key!='length'){
				family = families[key];
				if(family.spouse!=null && 'undefined' !== typeof(module.usertree[family.spouse])){
					spouse = [family.id, family.spouse];
					spouses.push(spouse);

                    childs = family.childrens;
                    for (el in childs){
                        if(!childs.hasOwnProperty(el)) continue;
                        child = childs[el];
                        if(!childrens[child.gedcom_id] && 'undefined' !== typeof(module.usertree[child.gedcom_id])){
                            childrens[child.gedcom_id] = child;
                        }
                    }
				}
			}
		}
        if(typeof(defaultFamily) !== 'undefined'){
            def = defaultFamily;
        } else if(storage.usertree.gedcom_id in childrens) {
            def = module.famId;
        }
        return spouses.sort(function(){
			if(arguments[0][0] == def){
				return -1;
			} else {
				return 1;
			}
		});
	},
	_childrens:function(object, spouses){
		var module = this, childrens = [], isChild = {};
        getChilds(object);
        if(spouses.length != 0){
            getChilds(module.usertree[spouses[0][1]]);
        }
		return childrens;
        function getChilds(object){
            var families = object.families,
                family,
                child;
            if(!families) return [];
            for(var key in families){
                if(!families.hasOwnProperty(key)) continue;
                if(key !== 'length'){
                    family = families[key];
                    if(family.childrens != null){
                        for(var i = 0 ; i < family.childrens.length ; i++){
                            child = family.childrens[i];
                            if(!isChild[child.gedcom_id]){
                                isChild[child.gedcom_id] = true;
                                childrens.push(child);
                            }
                        }
                    }
                }
            }
        }
	},
    _sortByBirth:function(ch, p){
        var fn = {};
        fn.getParseObjectDate = function(id){
            var object = p[id];
            var parse = storage.usertree.parse(object);
            return parse.date("birth", 2);
        }
        return ch.sort(function(a,b){
            var _a = fn.getParseObjectDate(a.gedcom_id);
            var _b = fn.getParseObjectDate(b.gedcom_id);
            if(_a != 0 && _b != 0){
                return _a - _b;
            } else {
                if(_a == 0){
                    return 1;
                } else {
                    return -1;
                }
            }
        });
    },
	_first:function(gedcom_id){
        var module = this;
        var object = module.usertree[gedcom_id];
        var parent_key = module._checkParents(object);
        if(parent_key && object.families == null){
            return parent_key;
        }
        return gedcom_id;
	},
	_home:function(cont){
		var	module = this;	
		jQuery(cont).find('div.home').click(function(){
			module.clickItem = false;
            storage.tooltip.cleaner(function(){
                module.render(module.start_id);
            });
		});
	},
	_create:function(){
		var	sb = host.stringBuffer();
		sb._('<div class="jmb-families-sircar">&nbsp;</div>');
		sb._('<div class="jmb-families-event">&nbsp;</div>');
		sb._('<div class="jmb-families-spouse">&nbsp;</div>');
		sb._('<div class="jmb-families-former-spouse-container">&nbsp;</div>');
		sb._('<div class="jmb-families-former-sircar-container">&nbsp;</div>');
		sb._('<div class="home">&nbsp;</div>');
		return jQuery(sb.result());
	},
	_info:function(object, spouse){
        if(!spouse) return '';
		var	module = this,
			sb = host.stringBuffer(),
			event = object.families[spouse[0]].marriage,
			date,
			place,
			location = '';
			
		if(event!=null){
			date = event.date;
			place = event.place;
			if(place != null && place[0].country != null){
				location = place[0].country;
			} else {
                location = '';
            }
			sb._('<div>');
				sb._('<div>')._((date[2]!=null)?date[2]:'')._('</div>');
				sb._('<div>')._(location)._('</div>');
			sb._('</div>');
            return jQuery(sb.result());
		}
		return '';
	},
	_checkParents:function(object){
        if(!object || object==null) return false;
        var module = this,
            fn,
            parents,
            key,
            family,
            fatherId,
            motherId,
            fatherFamilyCount,
            motherFamilyCount;

        fn = {
            getFamilyCount:function(family, id){
                if(!id) return 0;
                var families = object.families;
                if(families != null){
                    return families.length;
                }
                return 0;
            }
        }

        parents = object.parents;
        if(parents != null){
            for(key in parents){
                if(parents.hasOwnProperty(key)){
                    if(key != 'length'){
                        module.famId = key;
                        family = parents[key];
                        fatherId = (family.father!= null && module.usertree[family.father.gedcom_id])?family.father.gedcom_id:false;
                        motherId = (family.mother!= null && module.usertree[family.mother.gedcom_id])?family.mother.gedcom_id:false;
                        fatherFamilyCount = fn.getFamilyCount(family, fatherId);
                        motherFamilyCount = fn.getFamilyCount(family, motherId);
                        if(fatherId && motherId){
                            if(fatherFamilyCount == motherFamilyCount){
                                return fatherId;
                            } else if(fatherFamilyCount > motherFamilyCount){
                                return fatherId;
                            } else {
                                motherId;
                            }
                        } else {
                            return (fatherId)?fatherId:motherId;
                        }
                    }
                }
            }
        }
        return false;
	},
    _getName:function(object){
        var module = this,
            parse = storage.usertree.parse(object),
            nick = parse.nick;

        if(nick.length > 12){
            module.nameTooltip.push(object);
            return nick.substr(0,6)+'...';
        } else {
            return nick;
        }
    },
    _getMerrageYear:function(r, id){
        return r.marr(id, 'date', 2);
    },
	_sircar:function(gedcom_id){
		var	module = this,
			sb = host.stringBuffer(),
			usertree = module.usertree,
			object = usertree[gedcom_id],
			gedcom_id = (object)?object.user.gedcom_id:false,
			facebook_id = (object)?object.user.facebook_id:false,
			parents = (object)?object.parents:false,
			get = storage.usertree.parse(object),
			fam_opt = storage.family_line.get.opt(),
            parent_key;

        if('undefined' === typeof(object)) return '';

		sb._('<div>');
			if(parent_key = module._checkParents(object)){
				sb._('<div  id="')._(parent_key)._('" class="jmb-families-button parent active">&nbsp;</div>');
			} else {
				sb._('<div  id="null" class="jmb-families-button parent">&nbsp;</div>');
			}
			sb._('<div id="father_line" style="width:116px;border: 2px solid ')
				sb._((object.user.is_father_line&&fam_opt.father&&fam_opt.father.pencil)?fam_opt.father.pencil:'#F5FAE6');
			sb._(';">');
			sb._('<div id="mother_line" style="width:112px;border: 2px solid ')
				sb._((object.user.is_mother_line&&fam_opt.mother&&fam_opt.mother.pencil)?fam_opt.mother.pencil:'#F5FAE6');
			sb._(';">');
				sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" class="jmb-families-parent-img">')._(module._avatar(object, 'parent', 1));
                    if(get.is_editable && !module.popup){
                        sb._('<div id="')._(gedcom_id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
                    }
					if(facebook_id != '0'){
						sb._('<div class="jmb-families-fb-icon parent" id="')._(facebook_id)._('">&nbsp;</div>');
					}
					if(get.is_death){
						sb._('<div class="jmb-families-death-marker parent">&nbsp;</div>');
					}
				sb._('</div>');
			sb._('</div></div>');
			sb._('<div>');
				sb._('<div class="jmb-families-parent-name">')._(module._getName(object))._('</div>');
				sb._('<div class="jmb-families-parent-date">')._(module._getDate(get))._('</div>');
			sb._('</div>');
			if(object.families!=null){
				sb._('<div class="jmb-families-arrow-left">&nbsp</div>');
			}
		sb._('</div>');		
		return jQuery(sb.result());
	},
	_spouse:function(spouse, bcolor){
		var	module = this,
			sb = host.stringBuffer(),
			family_id = spouse[0],
			gedcom_id = spouse[1],
			usertree = module.usertree,
			object = usertree[gedcom_id],
			gedcom_id = (object)?object.user.gedcom_id:false,
			facebook_id = (object)?object.user.facebook_id:false,
			parents = (object)?object.parents:false,
			get = storage.usertree.parse(object), 
			fam_opt = storage.family_line.get.opt(),
			parent_key;

        if('undefined' === typeof(object)) return '';

		sb._('<div>');
			if(parent_key = module._checkParents(object)){
				sb._('<div  id="')._(parent_key)._('" class="jmb-families-button parent active">&nbsp;</div>');
			} else {
				sb._('<div  id="null" class="jmb-families-button parent">&nbsp;</div>');
			}
			sb._('<div id="father_line" style="width:116px;border: 2px solid ')
				sb._((object.user.is_father_line&&fam_opt.father&&fam_opt.father.pencil)?fam_opt.father.pencil:'#F5FAE6');
			sb._(';">');
			sb._('<div id="mother_line" style="width:112px;border: 2px solid ')
				sb._((object.user.is_mother_line&&fam_opt.mother&&fam_opt.mother.pencil)?fam_opt.mother.pencil:'#F5FAE6');
			sb._(';">');
				sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" class="jmb-families-parent-img" style="border:2px solid ')._(bcolor)._(';">')._(module._avatar(object, 'parent', 1));
					if(get.is_editable && !module.popup){
                        sb._('<div id="')._(gedcom_id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
                    }
                    if(facebook_id != '0'){
						sb._('<div class="jmb-families-fb-icon parent" id="')._(facebook_id)._('">&nbsp;</div>');
					}
					if(get.is_death){
						sb._('<div class="jmb-families-death-marker parent">&nbsp;</div>');
					}
				sb._('</div>');
			sb._('</div></div>');
			sb._('<div>');
				sb._('<div class="jmb-families-parent-name">')._(module._getName(object))._('</div>');
				sb._('<div class="jmb-families-parent-date">')._(module._getDate(get))._('</div>');
			sb._('</div>');
			if(object.families!=null){
				sb._('<div class="jmb-families-arrow-right" style="background:')._(bcolor)._(';">&nbsp</div>');
			}
		sb._('</div>');		
		return jQuery(sb.result());
	},
	_former_spouse:function(spouse, bcolor, position){
		var	module = this,
			sb = host.stringBuffer(),
			family_id = spouse[0],
			gedcom_id = spouse[1],
			usertree = module.usertree,
			object = usertree[gedcom_id],
			gedcom_id = (object)?object.user.gedcom_id:false,
			facebook_id = (object)?object.user.facebook_id:false,
			get = storage.usertree.parse(object);

        if('undefined' === typeof(object)) return '';
			
		sb._('<div id="')._(gedcom_id)._('" class="jmb-families-former-spouse-div ')._(position)._('">');
            sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" class="jmb-families-former-img" style="border:2px solid ')._(bcolor)._('">')._(module._avatar(object, 'parent', 0.5));
                if(get.is_editable && !module.popup){
                    sb._('<div id="')._(gedcom_id)._('-edit" class="jmb-families-edit-button former">&nbsp;</div>');
                }
                if(facebook_id != '0'){
                    sb._('<div class="jmb-families-fb-icon former" id="')._(facebook_id)._('">&nbsp;</div>');
                }
                if(get.is_death){
                    sb._('<div class="jmb-families-death-marker">&nbsp;</div>');
                }
            sb._('</div>');
			sb._('<div>');
				sb._('<div class="jmb-families-parent-name former">')._(module._getName(object))._('</div>');
				sb._('<div class="jmb-families-parent-date former">')._(module._getDate(get))._('</div>');
			sb._('</div>');
            sb._('<div class="jmb-families-former-arrow-')._(position)._('" style="background:')._(bcolor)._(';">&nbsp</div>');
            sb._('<div class="jmb-families-former-arrow-')._(position)._(' text" style="color:')._(bcolor)._(';">')._(module._getMerrageYear(get, family_id))._('</div>');
		sb._('</div>');
		return jQuery(sb.result());
	},
	_child:function(child, len, position){
		var	module = this,
			k = 1,
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
			fam_opt = storage.family_line.get.opt(),
			bcolor = (len>1)?module.spouse_border[child.family_id]:"#000000";

		sb._('<div id="')._(gedcom_id)._('" class="jmb-families-child" style="height:')._(Math.round(170*k))._('px;top:')._(position.top)._('px;left:')._(position.left)._('px;">');
			sb._('<div id="father_line" style="border: 2px solid ')
				sb._((user.is_father_line&&fam_opt.father&&fam_opt.father.pencil)?fam_opt.father.pencil:'#F5FAE6');
			sb._(';">');
			sb._('<div id="mother_line" style="border: 2px solid ')
				sb._((user.is_mother_line&&fam_opt.mother&&fam_opt.mother.pencil)?fam_opt.mother.pencil:'#F5FAE6');
			sb._(';">');
				sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" style="height:')._(Math.round(80*k))._('px;width:')._(Math.round(72*k))._('px;border:2px solid ')._(bcolor)._('" class="jmb-families-child-img">')._(module._avatar(object, 'child', k));
					if(get.is_editable && !module.popup){
                        sb._('<div id="')._(gedcom_id)._('-edit" class="')._(edit_button)._('">&nbsp;</div>');
                    }
                    if(facebook_id != '0'){
						sb._('<div class="jmb-families-fb-icon child" id="')._(facebook_id)._('">&nbsp;</div>');
					}
					if(get.is_death){
						sb._('<div class="jmb-families-death-marker parent">&nbsp;</div>');
					}
				sb._('</div>')
			sb._('</div></div>');	
			sb._('<div>');
				sb._('<div class="jmb-families-child-name">')._(module._getName(object))._('</div>');
				sb._('<div class="jmb-families-child-date">')._(module._getDate(get))._('</div>');
			sb._('</div>');
            if(families != null){
                sb._('<div id="')._(gedcom_id)._('" class="')._(child_button_active)._('">&nbsp;</div>');
            } else {
                sb._('<div id="null" class="')._(child_button_unactive)._('">&nbsp;</div>');
            }
			sb._('<div class="')._(arrow_class)._('" style="background:')._(bcolor)._(';">&nbsp</div>');
		return jQuery(sb.result());
	},
    _setFormer:function(cont, spouses, position){
        var module = this, i, spouse;
        if(spouses.length != 0){
            if(spouses.length > 1){
                for( i = 1 ; i < spouses.length ; i++ ){
                    spouse =  module._former_spouse(spouses[i], module._getBorderColor(spouses[i]), position);
                    jQuery(cont).append(spouse);
                }
                jQuery(cont).addClass('active');
                if(spouses.length > 3){
                    jQuery(cont).addClass('scroll');
                }
            } else {
                jQuery(cont).removeClass('active');
            }
        } else {
            jQuery(cont).removeClass('active');
        }
    },
    _setFormerBySircar:function(cont, spouses){
        var module = this;
        module._setFormer(cont[4], spouses, 'right');
        jQuery(cont[4]).css({top:module._getTopFormerSpouseBox(spouses),left:"10px",visibility:"hidden"});
    },
    _setFormerBySpouse:function(cont, spouse){
        var module = this,
            object = module.usertree[spouse[1]],
            spouses = module._spouses(object, spouse[0]);
        if(spouses.length != 0){
            module._setFormer(cont[3], spouses, 'left');
            jQuery(cont[3]).css({top:module._getTopFormerSpouseBox(spouses),left:"600px",visibility:"hidden"});
        }
    },
    _getDate:function(get){
        var b,d;
        b = get.date('birth', 2);
        d = get.date('death', 2);
        if(b != 0 && d != 0){
            return b + " - " +d;
        } else if(b != 0 && d == 0){
            return b;
        } else if(b == 0 && d != 0){
            return ".... - " +d;
        } else {
            return "....";
        }
    },
	_arrows:function(cont){
		var module = this;
		jQuery(cont).find('.jmb-families-button').each(function(index, element){
			jQuery(element).click(function(){
                var id, isParent, object, prev;
				if( (id = jQuery(this).attr('id')) == 'null'){
					return false;
				}
                isParent = jQuery(this).hasClass('parent');
                object = isParent?jQuery(element).parent().parent():jQuery(element).parent();
                var clickItem = {
                    parentId: module.now_id,
                    targetId: jQuery(object).attr('id'),
                    object:object,
                    is_parent:isParent,
                    offset:jQuery(object).offset(),
                    position:jQuery(object).position()
                }
                module.clickItem = clickItem;
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
				button_facebook:false,
				button_edit:false,
				offsetParent:document.body,
				gedcom_id:gedcom_id,
				target:e,
                afterEditorClose:function(){
                    storage.tooltip.cleaner(function(){
                        module.usertree = storage.usertree.pull;
                        module.render(module.now_id);
                    });
                }
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
                    button_edit:false,
                    button_facebook:false,
                    gedcom_id:gedcom_id,
                    target:e,
                    offsetParent:document.body,
                    afterEditorClose:function(){
                        storage.tooltip.cleaner(function(){
                            module.usertree = storage.usertree.pull;
                            module.render(module.now_id);
                        });
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
    _tooltips:function(cont){
        var module = this,
            pull = module.nameTooltip,
            sb = host.stringBuffer();
        jQuery(pull).each(function(i, el){
            var parse = storage.usertree.parse(el);
            var div = jQuery(cont).find('div#'+parse.gedcom_id).find('.jmb-families-child-name,.jmb-families-parent-name');
            sb.clear();
            jQuery(div).tipsy({
                gravity: 'sw',
                html: true,
                fallback: sb._('<div>')._(parse.nick)._('</div>').result()
            });
        });
        module.nameTooltip = [];
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
	_length:function(len){
		var limit = 7;
		var rows = Math.ceil(len/limit);
		return Math.round(len/rows);
	},
	_start_top:function(len){
		return 280;
	},
	render:function(gedcom_id){
        var	module = this,
            cont = module._create(),
            object = module.usertree[gedcom_id],
            spouses = module._spouses(object),
            childrens = module._childrens(object, spouses),
            sircar,
            info,
            spouse,
            childs = [];

        jQuery(module.parent).html('');

        module.cont = cont;
        module.now_id = gedcom_id;

        jQuery(module.parent).append(cont);

        sircar = module._sircar(gedcom_id);
        jQuery(cont[0]).css({top:"21px",left:"155px",visibility:"hidden"}).attr('id', gedcom_id).append(sircar);

        if(spouses.length != 0){
            info = module._info(object, spouses[0]);
            jQuery(cont[1]).css({top:"113px", left:"312px",visibility:"hidden"}).append(info);

            spouse = module._spouse(spouses[0], module._getBorderColor((spouses.length>1)?spouses[0]:false));
            jQuery(cont[2]).attr('id', spouses[0][1]).css({top:"21px",left:"430px",visibility:"hidden"}).append(spouse[0]);
        }

        if(spouses.length != 0){
            module._setFormerBySircar(cont, spouses);
            module._setFormerBySpouse(cont, spouses[0]);
        }


        var start_top = module._start_top(spouses.length);
        childrens = module._sortByBirth(childrens, storage.usertree.pull);
        if(childrens.length!=0){
            var row_length = module._length(childrens.length);
            var left_del = 100;
            var index = 0;
            var start_left = 375 - 100*(row_length/2);
            for(var i = 0 ; i < childrens.length ; i++){
                if(index == row_length){
                    start_top += 185;
                    index = 0;
                    if((childrens.length-i)<row_length){
                        start_left = 375 - 100*((childrens.length-i)/2);
                    }
                }
                var pos = {top:start_top, left:start_left+(index*left_del)};
                module.childsPos[childrens[i].gedcom_id] = pos;
                childs[i] = module._child(childrens[i], spouses.length, pos);
                jQuery(childs[i]).css("visibility","hidden");
                jQuery(module.parent).append(childs[i]);
                index++;
            }
        }

        if(module.popup){
            module._arrows(module.parent);
            jQuery(module.parent).find('.jmb-families-avatar').each(function(i, el){
                jQuery(el).droppable({
                    drop: function(){
                        storage.ntf.onDrop(this);
                    },
                    over: function(){
                        storage.ntf.onDropIn(this);
                    },
                    out: function(){
                        storage.ntf.onDropOut(this);
                    }
                });
            });
        } else {
            module._arrows(module.parent);
            module._view(module.parent);
            module._edit(module.parent);
            module._facebook(module.parent);
            module._tooltips(module.parent);
            module._win(module.parent);
            module._home(module.parent);
        }

        jQuery(module.parent).height(start_top + 200);
        jQuery(module.parent).css('overflow', 'hidden');
        if(!module.clickItem || jQuery.browser.msie){
            module.startAnimation(cont, childs);
        } else {
            module.animation(cont, childs);
        }
	},
	startAnimation:function(cont, childs){
        jQuery(cont[0]).css('left', '-155px').css("visibility", "visible").css('position', 'absoloute').animate({ "left":"+=310"},"slow");
        jQuery(cont[1]).css("opacity", "0").css("visibility", "visible").animate({"opacity":1}, "slow");
        jQuery(cont[2]).css('left', '760px').css("visibility", "visible").css('position', 'absoloute').animate({ "left":"-=330"},"slow");
        jQuery(cont[3]).css('left', '760px').css("visibility", "visible").css('position', 'absoloute').animate({ "left":"-=160"},"slow");
        jQuery(cont[4]).css('left', '-155px').css("visibility", "visible").css('position', 'absoloute').animate({ "left":"+=165"},"slow");
        jQuery(childs).each(function(i, el){
            jQuery(el).css("opacity", "0").css("visibility", "visible").css("position", "position").animate({"opacity":1}, 300*i);
        });
	},
	animation:function(cont, childs){
		var	module = this, 
			clickItem = module.clickItem,
			childsPos = module.childsPos,
			id =  jQuery(clickItem.object).attr('id'),
			clone = jQuery(clickItem.object).find('img').clone();
		if(clickItem.is_parent){
			var position = clickItem.position;
			var pos = childsPos[id];
			jQuery(clone).css({position:"absolute",top:position.top+"px",left:position.left+"px",visibility:"visible"}).show();
			jQuery(module.parent).append(clone);
			jQuery(childs).each(function(i, el){
				if(jQuery(el).attr('id') == id){
					jQuery(clone).animate({
						width:"72px",
						height:"80px",
						top:(pos.top+6)+"px",
						left:(pos.left+6)+"px"
					}, 1000, function(){
						jQuery(clone).remove();
						jQuery(el).css({opacity:0, visibility:"visible"}).animate({"opacity":1}, 250);
						jQuery(cont[0]).css("left", "-155px").css("visibility", "visible").animate({ "left":"+=310"},"slow");
                        jQuery(cont[1]).css("opacity", "0").css("visibility", "visible").animate({"opacity":1}, "slow");
						jQuery(cont[2]).css("left", "760px").css("visibility", "visible").animate({ "left":"-=330"},"slow");
						jQuery(cont[3]).css("left", "760px").css("visibility", "visible").show().animate({ "left":"-=160"},"slow");
                        jQuery(cont[4]).css("left", "-155px").css("visibility", "visible").show().animate({ "left":"+=165"},"slow");
						jQuery(childs).each(function(i, el){
							if(jQuery(el).attr('id') != id){
								jQuery(el).css("opacity", 0).css("visibility", "visible").animate({"opacity":1}, 300*i);
							}
						});
						jQuery(module.parent).css('overflow', 'visible');
					});
				}
			});
		} else {
			var pos = childsPos[id];
			jQuery(clone).css({position:"absolute",top:pos.top+"px",left:pos.left+"px",visibility:"visible"}).show();
			jQuery(module.parent).append(clone);
			jQuery(clone).animate({
				width:"108px",
				height:"120px",
				top:"101px",
				left:"126px"
			}, 1000, function(){
				jQuery(clone).remove();
				jQuery(cont[0]).css("opacity", 0).css("visibility", "visible").animate({ "opacity":1}, "slow");
                jQuery(cont[1]).css("opacity", "0").css("visibility", "visible").animate({"opacity":1}, "slow");
				jQuery(cont[2]).css("left", "760px").css("visibility", "visible").animate({ "left":"-=330"},"slow");
				jQuery(cont[3]).css("left", "760px").css("visibility", "visible").show().animate({ "left":"-=160"},"slow");
                jQuery(cont[4]).css("left", "-155px").css("visibility", "visible").show().animate({ "left":"+=165"},"slow");
				jQuery(childs).each(function(i, el){
					jQuery(el).css("opacity", 0).css("visibility", "visible").animate({"opacity":1}, 300*i);
				});
				jQuery(module.parent).css('overflow', 'visible');
			});
		}
		
	},
	reload:function(id, type){
		var	module = this;
		storage.tooltip.cleaner(function(){
            module.border_iter = 0;
			module.render(id);
		});	
	}
}
