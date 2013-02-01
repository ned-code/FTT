(function($, $ftt){
    $ftt.module.create("MOD_FAMILIES", function(name, parent, ajax, renderType, popup){
        var	module = this,
            $fn,
            json,
            gedcom_id;

        $fn = {
            _ajax:function(func, params, callback){
                ajax.callMethod("families", "JMBFamilies", func, params, function(res){
                    callback(res);
                })
            },
            _generateBorders:function(n){
                var retBorders = [],
                    isBorders = {},
                    each,
                    getColor,
                    setColor;

                getColor = function(){ return '#'+Math.floor(Math.random()*16777215).toString(16); }
                setColor = function(color){
                    if(!color){
                        color = getColor();
                    }
                    if(!isBorders[color]){
                        isBorders[color] = true;
                        retBorders.push(color);
                        return true;
                    } else {
                        return false;
                    }
                }
                each = function(start, end, callback){
                    var i, length;
                    if('object' === typeof(end)){
                        length = end.length;
                    } else if('string' === typeof(end)){
                        length = "0" + end;
                    } else if('number' === typeof(end)){
                        length = end;
                    }
                    for(i = start ; i < length ; i++){
                        if(!callback(i, end)){
                            i--;
                        }
                    }
                }
                each(0, ["#3f48cc","#1d9441","#b97a57","#934293","#eab600","#00a2e8","#ed1c24","#7092be"], function(i, colors){
                    return setColor(colors[i]);
                });
                each(8, 100, function(i, length){
                    return setColor(false);
                });

                return retBorders;
            },
            _getBorderColor:function(sp){
                if(!sp) return "#000000";
                var color = module.borders[module.border_iter];
                module.border_iter++;
                module.spouse_border[sp[0]] = color;
                return color;
            },
            _getImageSize:function(type, k){
                var	imageSize = module.imageSize,
                    size = imageSize[type],
                    width = Math.round(size.width*k),
                    height = Math.round(size.height*k);
                return {
                    width: width,
                    height: height
                };
            },
            _avatar:function(object, type, k){
                var size = $fn._getImageSize(type, k);
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
                var families, spouses = [], family, spouse, sps = {}, childrens = {}, childs, el, child, def, object, parents;
                families = object.families;
                def = object.user.default_family;
                if(families==null) return [];
                for(var key in families){
                    if (!families.hasOwnProperty(key)) continue;
                    if(key!='length'){
                        family = families[key];
                        if(family.spouse!=null && 'undefined' !== typeof(module.usertree[family.spouse])){
                            if(!sps[family.spouse] && 'undefined' !== typeof(module.usertree[family.spouse])){
                                sps[family.spouse] = family.spouse;
                                spouse = [family.id, family.spouse];
                                spouses.push(spouse);
                            }
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
                    object = storage.usertree.pull[storage.usertree.gedcom_id];
                    parents = object.parents;
                    for(key in parents){
                        if(!parents.hasOwnProperty(key)) continue;
                        if(key != 'length'){
                            def = key;
                            break;
                        }
                    }
                } else if(storage.usertree.gedcom_id in sps){
                    def = storage.usertree.gedcom_id;
                }
                return spouses.sort(function(){
                    if(arguments[0][1] == def || arguments[0][0] == def){
                        return -1;
                    } else {
                        return 1;
                    }
                });
            },
            _childrens:function(object, spouses){
                var childrens = [], isChild = {};
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
                                    if(!isChild[child.gedcom_id] && 'undefined' !== typeof(module.usertree[child.gedcom_id])){
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
                    if('undefined' === typeof(object)) return 0;
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
                var object = module.usertree[gedcom_id];
                var parent_key = $fn._checkParents(object);
                if(parent_key && object.families == null){
                    return parent_key;
                }
                return gedcom_id;
            },
            _home:function(cont){
                $(cont).find('div.home').click(function(){
                    module.clickItem = false;
                    storage.tooltip.cleaner(function(){
                        $fn.render(module.start_id);
                    });
                });
            },
            _create:function(){
                var	sb = module.fn.stringBuffer();
                sb._('<div class="jmb-families-sircar">&nbsp;</div>');
                sb._('<div class="jmb-families-event">&nbsp;</div>');
                sb._('<div class="jmb-families-spouse">&nbsp;</div>');
                sb._('<div class="jmb-families-former-spouse-container">&nbsp;</div>');
                sb._('<div class="jmb-families-former-sircar-container">&nbsp;</div>');
                sb._('<div class="home">&nbsp;</div>');
                return $(sb.result());
            },
            _info:function(object, spouse){
                if(!spouse) return '';
                var	sb = module.fn.stringBuffer(),
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
                    sb._('<div>')._((date!=null&&date[2]!=null)?date[2]:'')._('</div>');
                    sb._('<div>')._(location)._('</div>');
                    sb._('</div>');
                    return $(sb.result());
                }
                return '';
            },
            _checkParents:function(object){
                if(!object || object==null) return false;
                var fn,
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
                var parse = storage.usertree.parse(object),
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
                var	sb = module.fn.stringBuffer(),
                    usertree = module.usertree,
                    object = usertree[gedcom_id],
                    gedcom_id = (object)?object.user.gedcom_id:false,
                    facebook_id = (object)?object.user.facebook_id:false,
                    parents = (object)?object.parents:false,
                    get = storage.usertree.parse(object),
                    fam_opt = ("undefined" !== typeof(storage.family_line.get))?storage.family_line.get.opt(): false,
                    parent_key;

                if('undefined' === typeof(object)) return false;

                sb._('<div>');
                if(parent_key = $fn._checkParents(object)){
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
                sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" class="jmb-families-parent-img">')._($fn._avatar(object, 'parent', 1));
                if(get.is_editable && !module.popup){
                    sb._('<div id="')._(gedcom_id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
                }
                if(facebook_id != '0'){
                    sb._('<div class="jmb-families-fb-icon parent" id="')._(facebook_id)._('">&nbsp;</div>');
                }
                if(get.is_death || get.turns > 120){
                    sb._('<div class="jmb-families-death-marker parent">&nbsp;</div>');
                }
                sb._('</div>');
                sb._('</div></div>');
                sb._('<div>');
                sb._('<div class="jmb-families-parent-name">')._($fn._getName(object))._('</div>');
                sb._('<div class="jmb-families-parent-date">')._($fn._getDate(get))._('</div>');
                sb._('</div>');
                if(object.families!=null){
                    sb._('<div class="jmb-families-arrow-left">&nbsp</div>');
                }
                sb._('</div>');
                return $(sb.result());
            },
            _spouse:function(spouse, bcolor){
                var	sb = module.fn.stringBuffer(),
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

                if('undefined' === typeof(object)) return false;

                sb._('<div>');
                if(parent_key = $fn._checkParents(object)){
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
                sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" class="jmb-families-parent-img" style="border:2px solid ')._(bcolor)._(';">')._($fn._avatar(object, 'parent', 1));
                if(get.is_editable && !module.popup){
                    sb._('<div id="')._(gedcom_id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
                }
                if(facebook_id != '0'){
                    sb._('<div class="jmb-families-fb-icon parent" id="')._(facebook_id)._('">&nbsp;</div>');
                }
                if(get.is_death || get.turns > 120){
                    sb._('<div class="jmb-families-death-marker parent">&nbsp;</div>');
                }
                sb._('</div>');
                sb._('</div></div>');
                sb._('<div>');
                sb._('<div class="jmb-families-parent-name">')._($fn._getName(object))._('</div>');
                sb._('<div class="jmb-families-parent-date">')._($fn._getDate(get))._('</div>');
                sb._('</div>');
                if(object.families!=null){
                    sb._('<div class="jmb-families-arrow-right" style="background:')._(bcolor)._(';">&nbsp</div>');
                }
                sb._('</div>');
                return $(sb.result());
            },
            _former_spouse:function(spouse, bcolor, position){
                var	sb = module.fn.stringBuffer(),
                    family_id = spouse[0],
                    gedcom_id = spouse[1],
                    usertree = module.usertree,
                    object = usertree[gedcom_id],
                    gedcom_id = (object)?object.user.gedcom_id:false,
                    facebook_id = (object)?object.user.facebook_id:false,
                    get = storage.usertree.parse(object);

                if('undefined' === typeof(object)) return false;

                sb._('<div id="')._(gedcom_id)._('" class="jmb-families-former-spouse-div ')._(position)._('">');
                sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" class="jmb-families-former-img" style="border:2px solid ')._(bcolor)._('">')._($fn._avatar(object, 'parent', 0.5));
                if(get.is_editable && !module.popup){
                    sb._('<div id="')._(gedcom_id)._('-edit" class="jmb-families-edit-button former">&nbsp;</div>');
                }
                if(facebook_id != '0'){
                    sb._('<div class="jmb-families-fb-icon former" id="')._(facebook_id)._('">&nbsp;</div>');
                }
                if(get.is_death || get.turns > 120){
                    sb._('<div class="jmb-families-death-marker">&nbsp;</div>');
                }
                sb._('</div>');
                sb._('<div>');
                sb._('<div class="jmb-families-parent-name former">')._($fn._getName(object))._('</div>');
                sb._('<div class="jmb-families-parent-date former">')._($fn._getDate(get))._('</div>');
                sb._('</div>');
                sb._('<div class="jmb-families-former-arrow-')._(position)._('" style="background:')._(bcolor)._(';">&nbsp</div>');
                sb._('<div class="jmb-families-former-arrow-')._(position)._(' text" style="color:')._(bcolor)._(';">')._($fn._getMerrageYear(get, family_id))._('</div>');
                sb._('</div>');
                return $(sb.result());
            },
            _child:function(child, len, position){
                var	k = 1,
                    sb = module.fn.stringBuffer(),
                    usertree = module.usertree,
                    gedcom_id = child.gedcom_id,
                    object = usertree[gedcom_id],
                    user = (object)?object.user:false,
                    families = (object)?object.families:false,
                    facebook_id = (user)?user.facebook_id:false,
                    edit_button = (k!=1)?'jmb-families-edit-button child small':'jmb-families-edit-button child',
                    child_button_active = (k!=1)?'jmb-families-button childs active small':'jmb-families-button childs active',
                    child_button_unactive = (k!=1)?'jmb-families-button childs small':'jmb-families-button childs',
                    arrow_class = (k!=1)?'jmb-families-arrow-up small':'jmb-families-arrow-up',
                    get = (object)?storage.usertree.parse(object):false,
                    fam_opt = storage.family_line.get.opt(),
                    bcolor = (len>1)?module.spouse_border[child.family_id]:"#000000";

                if('undefined' === typeof(object)) return false;

                sb._('<div id="')._(gedcom_id)._('" class="jmb-families-child" style="height:')._(Math.round(170*k))._('px;top:')._(position.top)._('px;left:')._(position.left)._('px;">');
                sb._('<div id="father_line" style="border: 2px solid ')
                sb._((user.is_father_line&&fam_opt.father&&fam_opt.father.pencil)?fam_opt.father.pencil:'#F5FAE6');
                sb._(';">');
                sb._('<div id="mother_line" style="border: 2px solid ')
                sb._((user.is_mother_line&&fam_opt.mother&&fam_opt.mother.pencil)?fam_opt.mother.pencil:'#F5FAE6');
                sb._(';">');
                sb._('<div id="')._(gedcom_id)._('-view" type="imgContainer" style="height:')._(Math.round(80*k))._('px;width:')._(Math.round(72*k))._('px;border:2px solid ')._(bcolor)._('" class="jmb-families-child-img">')._($fn._avatar(object, 'child', k));
                if(get.is_editable && !module.popup){
                    sb._('<div id="')._(gedcom_id)._('-edit" class="')._(edit_button)._('">&nbsp;</div>');
                }
                if(facebook_id != '0'){
                    sb._('<div class="jmb-families-fb-icon child" id="')._(facebook_id)._('">&nbsp;</div>');
                }
                if(get.is_death || get.turns > 120){
                    sb._('<div class="jmb-families-death-marker parent">&nbsp;</div>');
                }
                sb._('</div>')
                sb._('</div></div>');
                sb._('<div>');
                sb._('<div class="jmb-families-child-name">')._($fn._getName(object))._('</div>');
                sb._('<div class="jmb-families-child-date">')._($fn._getDate(get))._('</div>');
                sb._('</div>');
                if(families != null){
                    sb._('<div id="')._(gedcom_id)._('" class="')._(child_button_active)._('">&nbsp;</div>');
                } else {
                    sb._('<div id="null" class="')._(child_button_unactive)._('">&nbsp;</div>');
                }
                sb._('<div class="')._(arrow_class)._('" style="background:')._(bcolor)._(';">&nbsp</div>');
                return $(sb.result());
            },
            _setFormer:function(cont, spouses, position){
                var i, spouse;
                if(spouses.length != 0){
                    if(spouses.length > 1){
                        for( i = 1 ; i < spouses.length ; i++ ){
                            spouse =  $fn._former_spouse(spouses[i], $fn._getBorderColor(spouses[i]), position);
                            if(spouse){
                                $(cont).append(spouse);
                            }
                        }
                        $(cont).addClass('active');
                        if(spouses.length > 3){
                            $(cont).addClass('scroll');
                        }
                    } else {
                        $(cont).removeClass('active');
                    }
                } else {
                    $(cont).removeClass('active');
                }
            },
            _setFormerBySircar:function(cont, spouses){
                $fn._setFormer(cont[4], spouses, 'right');
                $(cont[4]).css({top:$fn._getTopFormerSpouseBox(spouses),left:"10px",visibility:"hidden"});
            },
            _setFormerBySpouse:function(cont, spouse){
                var object = module.usertree[spouse[1]],
                    spouses = $fn._spouses(object, spouse[0]);
                if(spouses.length != 0){
                    $fn._setFormer(cont[3], spouses, 'left');
                    $(cont[3]).css({top:$fn._getTopFormerSpouseBox(spouses),left:"600px",visibility:"hidden"});
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
                $(cont).find('.jmb-families-button').each(function(index, element){
                    $(element).click(function(){
                        var id, isParent, object, prev;
                        if( (id = $(this).attr('id')) == 'null'){
                            return false;
                        }
                        isParent = $(this).hasClass('parent');
                        object = isParent?$(element).parent().parent():$(element).parent();
                        var clickItem = {
                            parentId: module.now_id,
                            targetId: $(object).attr('id'),
                            object:object,
                            is_parent:isParent,
                            offset:$(object).offset(),
                            position:$(object).position()
                        }
                        module.clickItem = clickItem;
                        $fn.reload(id, $(this).hasClass('parent'));
                    });
                });
            },
            _key:function(id, type){
                var	usertree = module.usertree,
                    object = usertree[id],
                    parents = object.parents;
                if(type){
                    return $fn._parentId(parents);
                } else {
                    return id;
                }
            },
            _view:function(cont){
                var	usertree = module.usertree,
                    gedcom_id;
                $(cont).find('.jmb-families-avatar.view').each(function(i,e){
                    gedcom_id = $(e).parent().attr('id').split('-')[0];
                    storage.tooltip.render('view', {
                        button_facebook:false,
                        button_edit:false,
                        offsetParent:document.body,
                        gedcom_id:gedcom_id,
                        target:e,
                        afterEditorClose:function(){
                            storage.tooltip.cleaner(function(){
                                module.usertree = storage.usertree.pull;
                                $fn.render(module.now_id);
                            });
                        }
                    });
                });
            },
            _edit:function(cont){
                var	usertree = module.usertree,
                    gedcom_id;
                $(cont).find('.jmb-families-edit-button').each(function(i,e){
                    gedcom_id = $(e).attr('id').split('-')[0];
                    storage.tooltip.render('edit', {
                        button_edit:false,
                        button_facebook:false,
                        gedcom_id:gedcom_id,
                        target:e,
                        offsetParent:document.body,
                        afterEditorClose:function(){
                            storage.tooltip.cleaner(function(){
                                module.usertree = storage.usertree.pull;
                                $fn.render(module.now_id);
                            });
                        }
                    });
                });
            },
            _facebook:function(cont){
                var id;
                $(cont).find('.jmb-families-fb-icon').each(function(i,e){
                    $(e).click(function(){
                        id = $(e).attr('id');
                        window.open('http://www.facebook.com/profile.php?id='+id,'new','width=320,height=240,toolbar=1')
                    });
                });
            },
            _tooltips:function(cont){
                var pull = module.nameTooltip,
                    sb = module.fn.stringBuffer();
                $(pull).each(function(i, el){
                    var parse = storage.usertree.parse(el);
                    var div = $(cont).find('div#'+parse.gedcom_id).find('.jmb-families-child-name,.jmb-families-parent-name');
                    sb.clear();
                    $(div).tipsy({
                        gravity: 'sw',
                        html: true,
                        fallback: sb._('<div>')._(parse.nick)._('</div>').result()
                    });
                });
                module.nameTooltip = [];
            },
            _win:function(cont){
                $(cont).find('div[type="imgContainer"]').each(function(i,div){
                    $(div).mouseenter(function(){
                        $(div).find('.jmb-families-edit-button').addClass('hover');
                        $(div).find('.jmb-families-fb-icon').addClass('hover');
                    }).mouseleave(function(){
                            $(div).find('.jmb-families-edit-button').removeClass('hover');
                            $(div).find('.jmb-families-fb-icon').removeClass('hover');
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
                var	cont = $fn._create(),
                    object = module.usertree[gedcom_id],
                    spouses = $fn._spouses(object),
                    childrens = $fn._childrens(object, spouses),
                    sircar,
                    info,
                    spouse,
                    childs = [];

                $(module.parent).html('');

                module.cont = cont;
                module.now_id = gedcom_id;

                $(module.parent).append(cont);

                sircar = $fn._sircar(gedcom_id);
                if(sircar){
                    $(cont[0]).css({top:"21px",left:"155px",visibility:"hidden"}).attr('id', gedcom_id).append(sircar);
                }

                if(spouses.length != 0){
                    info = $fn._info(object, spouses[0]);
                    $(cont[1]).css({top:"113px", left:"312px",visibility:"hidden"}).append(info);

                    spouse = $fn._spouse(spouses[0], $fn._getBorderColor((spouses.length>1)?spouses[0]:false));
                    if(spouse){
                        $(cont[2]).attr('id', spouses[0][1]).css({top:"21px",left:"430px",visibility:"hidden"}).append(spouse[0]);
                    }
                }

                if(spouses.length != 0){
                    $fn._setFormerBySircar(cont, spouses);
                    $fn._setFormerBySpouse(cont, spouses[0]);
                }


                var start_top = $fn._start_top(spouses.length);
                childrens = $fn._sortByBirth(childrens, storage.usertree.pull);
                if(childrens.length!=0){
                    var row_length = $fn._length(childrens.length);
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
                        childs[i] = $fn._child(childrens[i], spouses.length, pos);
                        if(childs[i]){
                            $(childs[i]).css("visibility","hidden");
                            $(module.parent).append(childs[i]);
                            index++;
                        }
                    }
                }

                if(module.popup){
                    $fn._arrows(module.parent);
                    $(module.parent).find('.jmb-families-avatar').each(function(i, el){
                        $(el).droppable({
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
                    $fn._arrows(module.parent);
                    $fn._view(module.parent);
                    $fn._edit(module.parent);
                    $fn._facebook(module.parent);
                    $fn._tooltips(module.parent);
                    $fn._win(module.parent);
                    $fn._home(module.parent);
                }

                $(module.parent).height(start_top + 200);
                //$(module.parent).css('overflow', 'hidden');
                if(!module.clickItem || $.browser.msie){
                    $fn.startAnimation(cont, childs);
                } else {
                    $fn.animation(cont, childs);
                }
            },
            startAnimation:function(cont, childs){
                $(cont[0]).css('left', '-155px').css("visibility", "visible").css('position', 'absoloute').animate({ "left":"+=310"},"slow");
                $(cont[1]).css("opacity", "0").css("visibility", "visible").animate({"opacity":1}, "slow");
                $(cont[2]).css('left', '760px').css("visibility", "visible").css('position', 'absoloute').animate({ "left":"-=330"},"slow");
                $(cont[3]).css('left', '760px').css("visibility", "visible").css('position', 'absoloute').animate({ "left":"-=160"},"slow");
                $(cont[4]).css('left', '-155px').css("visibility", "visible").css('position', 'absoloute').animate({ "left":"+=165"},"slow");
                $(childs).each(function(i, el){
                    $(el).css("opacity", "0").css("visibility", "visible").css("position", "position").animate({"opacity":1}, 300*i);
                });
            },
            animation:function(cont, childs){
                var	clickItem = module.clickItem,
                    childsPos = module.childsPos,
                    id =  $(clickItem.object).attr('id'),
                    clone = $(clickItem.object).find('img').clone();
                if(clickItem.is_parent){
                    var position = clickItem.position;
                    var pos = childsPos[id];
                    $(clone).css({position:"absolute",top:position.top+"px",left:position.left+"px",visibility:"visible"}).show();
                    $(module.parent).append(clone);
                    $(childs).each(function(i, el){
                        if($(el).attr('id') == id){
                            $(clone).animate({
                                width:"72px",
                                height:"80px",
                                top:(pos.top+6)+"px",
                                left:(pos.left+6)+"px"
                            }, 1000, function(){
                                $(clone).remove();
                                $(el).css({opacity:0, visibility:"visible"}).animate({"opacity":1}, 250);
                                $(cont[0]).css("left", "-155px").css("visibility", "visible").animate({ "left":"+=310"},"slow");
                                $(cont[1]).css("opacity", "0").css("visibility", "visible").animate({"opacity":1}, "slow");
                                $(cont[2]).css("left", "760px").css("visibility", "visible").animate({ "left":"-=330"},"slow");
                                $(cont[3]).css("left", "760px").css("visibility", "visible").show().animate({ "left":"-=160"},"slow");
                                $(cont[4]).css("left", "-155px").css("visibility", "visible").show().animate({ "left":"+=165"},"slow");
                                $(childs).each(function(i, el){
                                    if($(el).attr('id') != id){
                                        $(el).css("opacity", 0).css("visibility", "visible").animate({"opacity":1}, 300*i);
                                    }
                                });
                                //$(module.parent).css('overflow', 'visible');
                            });
                        }
                    });
                } else {
                    var pos = childsPos[id];
                    $(clone).css({position:"absolute",top:pos.top+"px",left:pos.left+"px",visibility:"visible"}).show();
                    $(module.parent).append(clone);
                    $(clone).animate({
                        width:"108px",
                        height:"120px",
                        top:"101px",
                        left:"126px"
                    }, 1000, function(){
                        $(clone).remove();
                        $(cont[0]).css("opacity", 0).css("visibility", "visible").animate({ "opacity":1}, "slow");
                        $(cont[1]).css("opacity", "0").css("visibility", "visible").animate({"opacity":1}, "slow");
                        $(cont[2]).css("left", "760px").css("visibility", "visible").animate({ "left":"-=330"},"slow");
                        $(cont[3]).css("left", "760px").css("visibility", "visible").show().animate({ "left":"-=160"},"slow");
                        $(cont[4]).css("left", "-155px").css("visibility", "visible").show().animate({ "left":"+=165"},"slow");
                        $(childs).each(function(i, el){
                            $(el).css("opacity", 0).css("visibility", "visible").animate({"opacity":1}, 300*i);
                        });
                        //$(module.parent).css('overflow', 'visible');
                    });
                }

            },
            reload:function(id, type){
                storage.tooltip.cleaner(function(){
                    module.border_iter = 0;
                    $fn.render(id);
                });
            }
        }

        module.popup = (typeof(popup) == 'undefined')?false:popup;
        module.parent = parent;
        module.path = $ftt.global.base+"components/com_manager/modules/families/";
        module.cssPath = module.path+'css/';
        module.now_id = null;
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

        module.borders = $fn._generateBorders(100);
        module.border_iter = 0;
        module.spouse_border = {};

        module.loggedByFamous = parseInt($(document.body).attr('_type'));
        module.settings = storage.settings;
        module.colors = module.settings.colors;
        module.usertree = storage.usertree.pull;
        module.start_id = $fn._first(storage.usertree.gedcom_id);

        if("undefined" !== typeof(storage.family_line.bind)){
            storage.family_line.bind('JMBFamiliesObject', function(res){
                var divs = $(module.cont).parent().find('div.jmb-families-sircar,div.jmb-families-spouse,div.jmb-families-child');
                $(divs).each(function(i, el){
                    var id = $(el).attr('id');
                    var object = module.usertree[id];
                    var user = object.user;
                    var bg_color = (res._active)?res._background:"#F5FAE6";
                    var type = 'is_'+res._line+'_line';
                    if(parseInt(user[type])){
                        $(el).find('div#'+res._line+'_line').css('border', '2px solid '+bg_color);
                    }
                });
            });
        }

        $(module.parent).ready(function(){
            $fn.render(module.start_id);
            storage.core.modulesPullObject.unset('JMBFamiliesObject');
        });
    });
})(jQuery, $FamilyTreeTop);


function JMBFamiliesObject(obj, popup){
    $FamilyTreeTop.module.init("MOD_FAMILIES", obj, $FamilyTreeTop.fn.mod("ajax"), "full", popup);
}
