$FamilyTreeTop.create("usertree", function($){
    'use strict';
    var $this = this,
        $fn,
        trPull = [],
        cache = {},
        usermap,
        usersmap,
        relationList = {},
        data;

    $fn = {

    }

    $this.trigger = function(data, callback){
        trPull.push({call:callback, data:data});
    }

    $this.call = function(){
        for(var prop in trPull){
            if(!trPull.hasOwnProperty(prop)) continue;
            var el = trPull[prop];
            el.call(el.data);
        }
    }

    $this.init = function(dataString, userString, usersString){
        if(dataString){
            data = dataString;
            //console.log(data);
        } else {
            data = null;
        }
        if(userString.length != 0){
            usermap = $.parseJSON(userString);
            //console.log(usermap);
        } else {
            usermap = null;
        }
        if(usersString.length != 0){
            usersmap = $.parseJSON(usersString);
            //console.log(usersmap);
        } else {
            usersmap = [];
        }

        var relations = $('#relations div');
        $(relations).each(function(index, element){
            var key = $(element).attr('data-familytreetop');
            relationList[key] = $(element).text();
        });
    }

    $this.update = function(response){
        cache = {};
        _each_(response, function(key, item){
            switch(key){
                case "chi":
                    _setData_("chi.all", item);
                    _setData_("chi.gedcom_id", item);
                    _setData_("chi.family_id", item);
                    break;
                case "dat":
                    _setData_("dat", item);
                    break;
                case "eve":
                    _setData_("eve.all", item);
                    _setData_("eve.gedcom_id", item);
                    _setData_("eve.family_id", item);
                    break;
                case "fam":
                    _setData_("fam.gedcom_id", item);
                    _setData_("fam.family_id", item);
                    break;
                case "ind":
                    _setData_("ind", item);
                    break;
                case "pla":
                    _setData_("pla", item);
                    break;
                case "rel":
                    _setData_("rel", item);
                    break;
                default:
                    break;
            }
        });
        $this.call();
        return true;
        function _setData_(key, item){
            var parts, element;
            parts = __getParts__(key);
            element = __getElement__(item, parts);
            if(parts[0] == "chi" && parts[1] == "family_id"){
                _each_(element, function(k, i){
                    if("undefined" === typeof(data[parts[0]][parts[1]][k])){
                        data[parts[0]][parts[1]][k] = [];
                    }
                    data[parts[0]][parts[1]][k].push(i[0]);
                });
            } else {
                if(parts.length == 2){
                    jQuery.extend(true, data[parts[0]][parts[1]], element);
                } else {
                    jQuery.extend(true, data[parts[0]], element);
                }
            }
            return true;
            function __getParts__(k){
                return k.split(".");
            }
            function __getElement__(i,p){
                return (p.length==2)?i[p[1]]:i;
            }
        }
        function _each_(a, c){
            for(var k in a){
                if(!a.hasOwnProperty(k)) continue;
                c(k, a[k]);
            }
            return true;
        }
    }

    $this.usermap = function(){
        return usermap;
    }

    $this.usersmap = function(){
        return usersmap;
    }


    $this.user = function(gedcom_id){
        if("undefined" === typeof(gedcom_id)) return false;
        if("undefined" === typeof(data.ind[gedcom_id])) return false;
        if("undefined" !== typeof(cache[gedcom_id])) return cache[gedcom_id];
        var ind = data.ind[gedcom_id], usermap = $this.usermap();
        var res = {
            change_time: ind.change_time,
            create_time: ind.create_time,
            creator_id: ind.creator_id,
            family_id: ind.family_id,
            first_name: ind.first_name,
            gedcom_id: ind.gedcom_id,
            gender: ind.gender,
            id: ind.id,
            know_as: ind.know_as,
            last_name: ind.last_name,
            middle_name: ind.middle_name,
            is_father_line: (ind.is_father_line!=null)?parseInt(ind.is_father_line):0,
            is_mother_line: (ind.is_mother_line!=null)?parseInt(ind.is_mother_line):0,
            inLaw: (function(){
                var relation = $this.getRelation(ind.gedcom_id);
                if(relation){
                    return parseInt(relation.in_law);
                }
                return 0;
            })(),
            facebook_id: (function(){
                if(ind.gedcom_id in usersmap){
                    return usersmap[ind.gedcom_id].facebook_id;
                } else {
                    return 0;
                }
            })(),
            relation: (function(){
                var relation = $this.getRelation(ind.gedcom_id);
                if(relation){
                    return $this.getRelationName(relation, false, ind);
                }
                return "unknown";
            })(),
            relation2: (function(){
                var relation = $this.getRelation(ind.gedcom_id);
                if(relation){
                    return $this.getRelationName(relation, true, ind);
                }
                return "unknown";
            })(),
            relationId:(function(){
                var relation = $this.getRelation(ind.gedcom_id);
                if(relation){
                    return relation.relation_id;
                }
                return 0;
            })(),
            proxyRelation: (function(){
                var relation = $this.getRelationId(ind.gedcom_id);
                if("object" === typeof(relation)){
                    var n = _name_(relation[1].obj.target_id), rn = $this.getRelationName($this.getRelation(ind.gedcom_id), true);
                    return n + " is the " + rn;
                } else {
                    if("undefined" !== typeof(relation)){
                        var rel = $this.getRelation(ind.gedcom_id);
                        return $this.getRelationName(rel)
                    } else {
                        return "unknown";
                    }
                }
                return true;
                function _name_(id){ return $this.getName(data.ind[id]); }
            })(),
            delete: function(){
                _deleteFromChi_();
                _deleteFromCon_();
                _deleteFromEve_();
                _deleteFromFam_();
                _deleteFromMed_();
                _deleteFromRel_();
                delete data.ind[ind.gedcom_id];
                delete cache[ind.gedcom_id];
                $this.call();
                function _deleteFromChi_(){
                    if(data.chi.length == 0 || "undefined" === typeof(data.chi.gedcom_id[ind.gedcom_id])) return false;
                    var chi = data.chi.gedcom_id[ind.gedcom_id];
                    if(chi.length <= 0) return false;
                    var dat = data.chi.family_id[chi[0].family_id];
                    for(var key in dat){
                        if(!dat.hasOwnProperty(key)) continue;
                        if(dat[key].gedcom_id == chi[0].gedcom_id){
                            dat.splice(key, 1);
                        }
                    }
                    delete data.chi.all[chi[0].id];
                    delete data.chi.gedcom_id[ind.gedcom_id];
                }
                function _deleteFromCon_(){
                    if(data.con.length == 0 || "undefined" === typeof(data.con[ind.gedcom_id])) return false;
                    var con = data.con[ind.gedcom_id];
                    if("undefined" === typeof(con)) return false;
                    delete data.con[ind.gedcom_id];
                }
                function _deleteFromEve_(){
                    if(data.eve.length == 0) return false;
                    if("undefined" !== typeof(data.eve.gedcom_id[ind.gedcom_id])){
                        var eve = data.eve.gedcom_id[ind.gedcom_id];
                        for(var key in eve){
                            if(!eve.hasOwnProperty(key)) continue;
                            if(data.dat.length != 0 && "undefined" !== typeof(data.dat[key])){
                                delete data.dat[key];
                            }
                            if(data.pla.length != 0 && "undefined" !== typeof(data.pla[key])){
                                delete data.pla[key];
                            }
                            if("undefined" !== typeof(data.eve.all[key])){
                                delete data.eve.all[key];
                            }
                        }
                        delete data.eve.gedcom_id[ind.gedcom_id];
                    }
                }
                function _deleteFromFam_(){
                    if(data.fam.length == 0 || "undefined" === typeof(data.fam.gedcom_id[ind.gedcom_id]) ) return false;
                    var fam = data.fam.gedcom_id[ind.gedcom_id];
                    for (var key in fam){
                        if(!fam.hasOwnProperty(key)) continue;
                        if("undefined" !==typeof(data.fam.family_id[key])){
                            var el = data.fam.family_id[key];
                            var spouse_id = (el.husb == ind.gedcom_id)?el.wife:el.husb;
                            if("undefined" !== typeof(data.fam.gedcom_id[spouse_id])){
                                var families = data.fam.gedcom_id[spouse_id];
                                for(var id in families){
                                    if(!families.hasOwnProperty(id)) continue;
                                    if(key == id){
                                        delete data.fam.gedcom_id[spouse_id][id];
                                    }
                                }
                            }
                            delete data.fam.family_id[key];
                        }
                    }
                    delete data.fam.gedcom_id[ind.gedcom_id];
                }
                function _deleteFromMed_(){
                    if(data.med.length == 0 || "undefined" == typeof(data.med.gedcom_id[ind.gedcom_id])) return false;
                    var med = data.med.gedcom_id[ind.gedcom_id];
                    if(med.length == 0) return false;
                    delete data.med.all[med[0].id];
                    delete data.med.gedcom_id[ind.gedcom_id];
                }
                function _deleteFromRel_(){
                    if("undefined" === typeof(data.rel[ind.gedcom_id])) return false;
                    delete data.rel[ind.gedcom_id];
                }
            },
            connection:function(){
                var object = $this.getConnection(ind.gedcom_id);
                if(object){
                    return object.map(function(v){
                        var relation = $FamilyTreeTop.mod('usertree').user(v).relation;
                        return relation;
                    }).join(" > ");
                }
                return "";
            },
            relationMap:function(){
                return $this.getRelationMap(ind.gedcom_id);
            },
            avatar: function(size, style, src){
                return $this.getImage(ind.gedcom_id, size, style, src);
            },
            username:function(){
               return this.name().toLowerCase().split(' ').join('.');
            },
            name:function(){
                var $name = [];
                if(ind.first_name != null) $name.push(ind.first_name);
                if(ind.last_name != null){
                    if(ind.middle_name != null) $name.push(ind.middle_name);
                    $name.push(ind.last_name);
                }
                return $name.join(' ').replace(/[ \t]{2,}/g, ' ');
            },
            shortname: function(){
                var $name = [];
                if(ind.first_name != null) $name.push(ind.first_name);
                if(ind.last_name != null) $name.push(ind.last_name);
                return $name.join(' ').replace(/[ \t]{2,}/g, ' ');
            },
            nickname:function(short){
                var k = ind.know_as;
                if($this.parseBoolean(k)){
                    return k;
                } else {
                    return ($this.parseBoolean(short))?ind.first_name:this.name();
                }
            },
            medias: function(){
              return $this.getMedias(ind.gedcom_id);
            },
            birth:function(path){
                return $this.getParseUserEventByType(ind.gedcom_id, 'BIRT', path);
            },
            death:function(path){
                return $this.getParseUserEventByType(ind.gedcom_id, 'DEAT', path);
            },
            date: function(){
                var b = $this.parseNum(this.birth('date.start_year'));
                var d = $this.parseNum(this.death('date.start_year'));
                if(!b && d){ return '... - '+d; }
                else if(b && !d){ return b; }
                else if(b && d){ return b + ' - ' + d; }
                else {
                    return '';
                }
            },
            event:function(id){
                if("undefined" === typeof(id)) return false;
            },
            turns: function(){
                var $self = this, date = new Date(), e = $self.birth();
                if(e && e.date && e.date.start_year != null){
                    return "turns " + (date.getFullYear() - e.date.start_year);
                }
                return "";
            },
            died: function(){
                var $self = this, date = new Date(), e = $self.death();
                if(e && e.date && e.date.start_year != null){
                    return "<div><div>died</div><div style='width:75px;'>" + (date.getFullYear() - e.date.start_year) + " years ago</div>";
                }
                return "";
            },
            isCanBeDelete: function(){
                var parents, childrens, spouses;
                parents = $this.getParents(ind.gedcom_id);
                childrens = $this.getChildrens(ind.gedcom_id);
                spouses = $this.getSpouses(ind.gedcom_id);
                if(_isParentExist_(parents) && !_isChildrenExist_(childrens) && !_isSpousesExist_(spouses)){
                    return true;
                } else if(_isSpousesExist_(spouses) && spouses.length == 1 && !_isChildrenExist_(childrens) && !_isParentExist_(parents)){
                    return true;
                }
                return false;
                function _isParentExist_(p){
                    if(p.father == null && p.mother == null){
                        return false;
                    }
                    return true;
                }
                function _isChildrenExist_(c){
                    return (c.length != 0);
                }
                function _isSpousesExist_(s){
                    return (s.length != 0);
                }
            },
            isRegistered:function(){
                return $this.isRegisteredUser(ind.gedcom_id);
            },
            isAlive:function(){
                if(this.death()){
                    return false;
                }
                return true;
            },
            isParentsExist:function(){
                var parents = $this.getParents(gedcom_id);
                return parents.father || parents.mother || false;
            },
            isSpouseExist:function(){
                var spouses = $this.getSpouses(ind.gedcom_id);
                if(spouses.length != 0){
                    return true;
                } else {
                    return false;
                }
            },
            isChildrensExist:function(){
                var childrens = $this.getChildrens(ind.gedcom_id);
                if(childrens.length != 0){
                    return true;
                } else {
                    return false;
                }
            }
        }
        cache[gedcom_id] = res;
        return cache[gedcom_id];
    }

    $this.family = function(family_id){
        if("undefined" === typeof(family_id) || family_id == null) return false;
        if("undefined" === typeof(data.fam.family_id[family_id])) return false;
        var fam = data.fam.family_id[family_id];
        return {
            change_time: fam.change_time,
            family_id: fam.family_id,
            husb: fam.husb,
            id: fam.id,
            type: fam.type,
            wife: fam.wife,
            event:function(){
                return $this.getFamilyEventByType(family_id, 'MARR');
            },
            married: function(){
                var $self = this, date = new Date(), e = $self.event();
                if(e && e.date && e.date.start_year != null){
                    return "<div>married</div><div style='width:75px;'>" + (date.getFullYear() - e.date.start_year) + " years ago</div>";
                }
                return "";
            }
        }
    }

    $this.isCommonAncestorExist = function(id1, id2){
        var data = { a : [], b: [] }, k1,k2, a, b;
        data.a.push([0,id1]);
        data.b.push([0,id2]);
        _setAncestor_(id1, "a", 1);
        _setAncestor_(id2, "b", 1);
        for(k1 in data.a){
            if(!data.a.hasOwnProperty(k1)) continue;
            a = data.a[k1];
            for(k2 in data.b){
                if(!data.b.hasOwnProperty(k2)) continue;
                b = data.b[k2];
                if(a[1] == b[1]){
                    return [a[1], a[0], b[0]];
                }
            }
        }
        return false;
        function _setAncestor_(id, key, level){
            var parents = $this.getParents(id);
            if(parents.family_id != null && parents.father != null){
                data[key].push([level, parents.father]);
                _setAncestor_(parents.father, key, level + 1);
            }
            if(parents.family_id != null && parents.mother != null){
                data[key].push([level, parents.mother]);
                _setAncestor_(parents.mother, key, level + 1);
            }
        }
    }

    $this.isRegisteredUser = function(gedcom_id){
        return (gedcom_id in usersmap);
    }

    $this.isDateInTheEvent = function(event_id, date, postfix){
        var _date, prop;
        if("undefined" !== typeof(data.dat[event_id])){
            _date = data.dat[event_id];
            if("undefined" !== typeof(postfix)){
                return (_date[postfix] == date);
            } else {
                for(prop in _date){
                    if(!_date.hasOwnProperty(prop)) continue;
                    if("undefined" === typeof(date[prop])) return false;
                    if(_date[prop] !== date[prop]) return false;
                }
                return true;
            }
        }
        return false;
    }

    $this.isHolderImg = function(src){
        return $this.isImg('holder.js', src)
    }

    $this.isDefaultImg = function(src){
        var sizes = ["25","35","50","90","150"], src = $this.getImgSrc(src), size;
        for(size in sizes){
            if(src.indexOf("male"+sizes[size]) + 1){
                return true;
            } else if(src.indexOf("female"+sizes[size]) + 1){
                return true;
            }
        }
        return false;
    }

    $this.isAvatar = function(src){
        var src = $this.getImgSrc(src);
        if( (src.indexOf("graph.facebook.com") + 1) ){
            return true;
        } else if( (src.indexOf("joomla30/files") + 1) ){
            return true;
        }
        return false;
    }

    $this.isImg = function(pattern, src){
        return ($this.getImgSrc(src).indexOf(pattern) + 1);
    }

    $this.getImgSrc = function(src){
        var _src, _data_src;
        if("object" === typeof(src)){
            _src = $(src).attr('src');
            _data_src = $(src).attr('data-src');
            if(_src != ""){
                src = _src;
            } else {
                src = _data_src;
            }
        }
        return src;
    }

    $this.setUserFamilyId = function(husb, wife, family_id){
        if("undefined" !== typeof(data.ind[husb])){
            data.ind[husb].family_id = family_id;
            delete cache[husb];
        }
        if("undefined" !== typeof(data.ind[wife])){
            data.ind[wife].family_id = family_id;
            delete cache[wife];
        }
    }

    $this.getRelation = function(gedcom_id){
        if(data.rel == null) return [false, true];
        if("undefined" !== typeof(data.rel[gedcom_id])){
            return data.rel[gedcom_id];
        }
        return false;
    }

    $this.getRelationId = function(gedcom_id){
        return  _getRelationId_($this.getRelation(gedcom_id));
        function _getRelationId_(o){
            var s1,s2,id;
            if(parseInt(o.in_law)){
                s1 = $this.getRelation(o.in_law);
                if(parseInt(s1.in_law)){
                    s2 = $this.getRelation(s1.in_law);
                    if(parseInt(s2.in_law)){
                        id = 1000;
                    } else {
                        if(s1.relation_id == 2){
                            id = [];
                            id.push({obj:s1, id: _getSubRelationId_(s2.relation_id)});
                            id.push({obj:o, id: parseInt(o.relation_id)});
                        } else {
                            id = 1000;
                        }
                    }
                } else {
                    if(s1.relation_id == 2){
                        id = o.relation_id;
                    } else if(o.relation_id == 2){
                        id = _getSubRelationId_(s1.relation_id);
                    } else {
                        id = 1000;
                    }
                }
            } else {
                id = o.relation_id;
            }
            return id;
        }
        function _getSubRelationId_(id){
            switch(parseInt(id)){
                case 2:	return 0;   //SPOUSE
                case 3:	return 4;   //MOTHER
                case 4:	return 3;   //FATHER
                case 5:	return 6;   //DAUGHTER
                case 6:	return 5;   //SON
                case 7:	return 8;   //SISTER
                case 8:	return 7;   //BROTHER
                case 9:	return 9;   //COUSIN
                case 10: //AUNT
                case 11: //UNCLE
                case 12: //NIECE
                case 13: //NEPHEW
                case 103: //GRAND_MOTHER
                case 104: //GRAND_FATHER
                case 105: //GRAND_DAUGHTER
                case 106: //GRAND_SON
                case 110: //GRAND_AUNT
                case 111: //GRAND_UNCLE
                case 112: //GRAND_NIECE
                case 113: //GRAND_NEPHEW
                case 203: //GREAT_GRAND_MOTHER
                case 204: //GREAT_GRAND_FATHER
                case 205: //GREAT_GRAND_DAUGHTER
                case 206: //GREAT_GRAND_SON
                case 210: //GREAT_GRAND_AUNT
                case 211: //GREAT_GRAND_UNCLE
                case 212: //GREAT_GRAND_NIECE
                case 213: //GREAT_GRAND_NEPHEW
                    return 1000;
            }
        }
    }

    $this.getConnectionMap = function(gedcom_id){
        var object;
        if(data.con == null) return false;
        if("undefined" !== typeof(data.con[gedcom_id])){
            object = data.con[gedcom_id];
            if(object){
                var ret = {};
                for(var prop in object){
                    if(!object.hasOwnProperty(prop)) continue;
                    ret[prop] = true;
                }
                return ret;
            }
        }
        return false;
    }

    $this.getConnection = function(gedcom_id){
        var object;
        if(data.con == null) return false;
        if("undefined" !== typeof(data.con[gedcom_id])){
            object = data.con[gedcom_id];
            if(object){
                return object;
            }
        }
        return false;
    }

    $this.getRelationMap = function(gedcom_id){
        var object = $this.getConnection(gedcom_id), pull = [],item, tree, ch, vehicle, prev;
        if(object){
            pull = getPull(object);
            tree = getTree();
            vehicle = pull[1];
            pull = pull[0];
            item = {
                id: $this.generateKey() + '_' + pull[vehicle].usr.gedcom_id,
                name: pull[vehicle].usr.name(),
                data: {
                    usr:pull[vehicle].usr,
                    rel:pull[vehicle].rel
                },
                children: []
            }
            tree.children.push(item);
            setTree(item, vehicle, -1, tree);
            setTree(item, vehicle, 1, tree);
            return [tree, getDeep(pull, vehicle)];
        }
        function setTree(object, index, k, previous){
            var size = index + k, element = pull[size];
            if("undefined" !== typeof(element)){
                var item = {
                     id: $this.generateKey() + '_' + element.usr.gedcom_id,
                     name: element.usr.name(),
                     data: {
                        usr:element.usr,
                        rel:element.rel
                     },
                     children: []
                }
                if(item.data.rel.relation_id == "2"
                    || (item.data.rel.in_law != "0"
                    && item.data.rel.in_law == object.data.usr.gedcom_id)){
                        item.data.in_law = true;
                        previous.children.push(item)
                } else {
                    object.children.push(item);
                }
                setTree(item, size, k, object);
            }
        }
        function getPull(object){
            var pull = [], vehicle = 0;
            for(var prop in object){
                if(!object.hasOwnProperty(prop)) continue;
                var gedcom_id = object[prop],
                    relation = $this.getRelation(gedcom_id),
                    user = $this.user(gedcom_id),
                    relation_id = relation.relation_id;
                pull.push({rel:relation, usr: user});
                if(index(relation_id) == 3 || index(relation_id) == 4){
                    vehicle = pull.length - 1;
                }
            }
            return [pull, vehicle];
        }
        function getDeep(p, v){
            var it = 1 + p.length - v;
            if(it > v){
                return it;
            }
            return v;
        }
        function getTree(){
            return {
                id: $this.generateKey() + '_TOP',
                name: "",
                data: {
                    usr:false,
                    rel:false
                },
                children: []
            }
        }
        function index(id){
            if("undefined" === typeof(id)) return false;
            return parseInt(id.toLocaleString().substr(-1));
        }
    }

    $this.getAutocompleteList = function(){
        var list = {};
        var users = data.ind;
        for(var key in users){
            if(!users.hasOwnProperty(key)) continue;
            var user = $this.user(key);
            list[key] = user;
        }
        return list;
    }

    $this.getName = function(dataObject){
        if("undefined" === typeof(dataObject)) return "unknown";
        var $name = [];
        if(dataObject.first_name != null) $name.push(dataObject.first_name);
        if(dataObject.last_name != null){
            if(dataObject.middle_name != null) $name.push(dataObject.middle_name);
            $name.push(dataObject.last_name);
        }
        return $name.join(' ').replace(/[ \t]{2,}/g, ' ');
    }

    $this.getRelName = function(obj, id, suffix, postfix, user){
        var val = _getRel_(user), name;
        if(data.rel != null && "undefined" !== typeof(val)){
            name = (val)?relationList[val.name]:"";
            return ((_is_(suffix))?_getSuffix_(obj):"") + " " + name + " " + ((_is_(postfix))?_getPostfix_(obj):"");
        }
        return false;
        function _is_(k){
            return "undefined" === typeof(k) || ( "undefined"!==typeof(k)&&k );
        }
        function _getSuffix_(o){
            var suf = (o.json!=null&&"undefined"!=typeof(o.json.suffix))?o.json.suffix:0;
            if(suf){
                return ("undefined" !== typeof(relationList[suf]))?relationList[suf]:suf;
            }
            return "";
        }
        function _getPostfix_(o){
            if( (id == 6 || id == 5 || id == 6 || id == 7) && parseInt(obj.in_law) ){
                return "";
            } else {
                return (parseInt(o.in_law))?relationList["IN_LAW"]:"";
            }
        }
        function _getRel_(user){
            var gender = ("undefined"!=typeof(user)&&$this.parseNum(user.gender));
            if(id == 2){
                return { name:(gender)?"SPOUSE_MALE":"SPOUSE_FEMALE", id: id};
            } else if( (id == 6 || id == 5) && parseInt(obj.in_law) ){
                return { name: (id==5)?"DAUGHTER_IN_LAW":"SON_IN_LAW", id: id };
            } else if( (id == 7 || id == 8) && parseInt(obj.in_law) ){
                return { name: (id==7)?"SISTER_IN_LAW":"BROTHER_IN_LAW", id: id };
            } else if(id == 9){
                return { name:(gender)?"COUSIN_MALE":"COUSIN_FEMALE", id: id};
            } else {
                return ("undefined"!==typeof(data.rel['_NAMES'][id]))?data.rel["_NAMES"][id]:false;
            }
        }
    }

    $this.getRelationName = function(object, flag, user){
        var rel = $this.getRelationId(object.target_id), name;
        if("object" === typeof(rel) && "undefined" !== typeof(flag)){
            name = _getName_(rel[1].obj, rel[1].id, true, false) + " your " + _getName_(rel[0].obj, rel[0].id);
        } else {
            if("object" === typeof(rel)){
                name = _getName_({in_law:1}, 1000);
            } else {
                name = _getName_(object, rel);
            }
        }
        return (name)?name:"undefined";
        function _getName_(obj, id, suffix, postfix){
            return $this.getRelName(obj, id, suffix, postfix, user);
        }
    }


    $this.getExistParent = function(p){
        if("undefined" === typeof(f) || !p) return false;
        if(p.mother != null || p.father != null){
            return (p.mother != null)?p.mother:p.father;
        } else {
            return false;
        }
    }

    $this.getExistParentById = function(id){
        if("undefined" === typeof(id) || id == null || !id) return false;
        var p = $this.mod('usertree').getParents(id);
        if(p.mother != null || p.father != null){
            return (p.mother != null)?p.mother:p.father;
        } else {
            return false;
        }
    }

    $this.getParents = function(gedcom_id){
        var obj = {family_id: null, father: null, mother: null};
        if("undefined" === typeof(data.chi.gedcom_id[gedcom_id])) obj;
        var row =  data.chi.gedcom_id[gedcom_id];
        for(var key in row){
            var family_id = row[key].family_id;
            break;
        }
        if("undefined" !== typeof(data.fam.family_id[family_id])){
            var family = data.fam.family_id[family_id];
            obj.family_id = family.family_id;
            obj.father = family.husb;
            obj.mother = family.wife;
            return obj;
        }
        return obj;
    }

    $this.getSpouses = function(gedcom_id, how_object){
        if("undefined" === typeof(data.fam.gedcom_id[gedcom_id])) return [];
        var families = data.fam.gedcom_id[gedcom_id];
        var spouses = [];
        for(var key in families){
            if(!families.hasOwnProperty(key)) continue;
            var family = families[key];
            if(family.husb == gedcom_id){
                if("undefined" !== typeof(how_object)){
                    spouses[families[key].wife] = true;
                } else {
                    spouses.push(families[key].wife);
                }
            } else if(family.wife == gedcom_id){
                if("undefined" !== typeof(how_object)){
                    spouses[families[key].husb] = true;
                } else {
                    spouses.push(families[key].husb);
                }
            }
        }
        return spouses;
    }

    $this.getFamilyEvent = function(family_id){
        return $this.getFamilyEventByType(family_id, "MARR");
    }

    $this.getFamilyEventByType = function(family_id, type){
        var events, prop, event;
        if("undefined" === typeof(data.eve.family_id[family_id])) return false;
        events = data.eve.family_id[family_id];
        for(prop in events){
            if(!events.hasOwnProperty(prop)) continue;
            event = events[prop];
            if(event.type === type){
                return $this.getEvent(event.id);
            }
        }
    }

    $this.getFamilies = function(id){
        if("undefined" !== typeof(data.fam.gedcom_id[id])){
            return data.fam.gedcom_id[id];
        }
    }

    $this.getFamilyIdByPartners = function(id1, id2){
        var families1, families2, key;
        families1 = sort($this.getFamilies(id1));
        families2 = sort($this.getFamilies(id2));
        for(key in families1){
            if(!families1.hasOwnProperty(key)) continue;
            if(key in families2){
                return key;
            }
        }
        return 0;
        function sort(data){
            var object = {};
            for(var prop in data){
                if(!data.hasOwnProperty(prop)) continue;
                var element = data[prop];
                object[element.family_id] = element;
            }
            return object;
        }
    }

    $this.getChildrens = function(gedcom_id){
        if("undefined" === typeof(data.fam.gedcom_id[gedcom_id])) return [];
        var families = data.fam.gedcom_id[gedcom_id];
        var childrens = [];
        for(var key in families){
            var family_id = families[key].family_id;
            var childs = data.chi.family_id[family_id];
            for(var k in childs){
                var child = childs[k];
                childrens.push(child.gedcom_id);
            }

        }
        return childrens;
    }

    $this.getChildrensByFamily = function(family_id){
        var childrens = [];
        var childs = data.chi.family_id[family_id];
        for(var k in childs){
            var child = childs[k];
            childrens.push(child.gedcom_id);
        }
        return childrens;
    }


    $this.getEvent = function(event_id){
        var ret = {event: false, place: false, date: false };
        if("undefined" !== typeof(data.eve.all[event_id])){
            ret.event = data.eve.all[event_id];
            if("undefined" !== typeof(data.pla[event_id])){
                ret.place = data.pla[event_id]            }

            if("undefined" !== typeof(data.dat[event_id])){
                ret.date = data.dat[event_id]
            }
            return ret;
        }
        return false;
    }

    $this.getUserEvents = function(gedcom_id){
        if("undefined" === typeof( data.eve.gedcom_id[gedcom_id])) return false;
        var events = data.eve.gedcom_id[gedcom_id], prop, pull = [];
        for(prop in events){
            if(!events.hasOwnProperty(prop)) continue;
            pull.push($this.getEvent(events[prop].id));
        }
        return pull;
    }

    $this.getUserEventByType = function(gedcom_id, type){
        if("undefined" === typeof( data.eve.gedcom_id[gedcom_id])) return false;
        var events =  data.eve.gedcom_id[gedcom_id];
        for(var key in events){
            if(!events.hasOwnProperty(key)) continue;
            var event = events[key];
            if(event['type'] == type){
                var event_id = event['id'];
                return $this.getEvent(event_id);
            }

        }
        return false;
    }

    $this.getFamilyEventByType = function(family_id, type){
        if("undefined" === typeof( data.eve.family_id[family_id])) return false;
        var events =  data.eve.family_id[family_id];
        for(var key in events){
            if(!events.hasOwnProperty(key)) continue;
            var event = events[key];
            if(event['type'] == type){
                var event_id = event['id'];
                return $this.getEvent(event_id);
            }

        }
        return false;
    }

    $this.getParseUserEventByType = function(gedcom_id, type, path){
        var e = $this.getUserEventByType(gedcom_id, type), st, prop, val = "";
        if(!e) return "";
        if("undefined" === typeof(path) || !path){
            return e || "";
        }
        st = path.split('.');
        for(prop in st){
            if(!st.hasOwnProperty(prop)) continue;
            val = (val=="")?e[st[prop]]:val[st[prop]];
        }
        return ("undefined"!==typeof(val))?val:"";
    }

    $this.getAllMonthsEvents = function(){
        var pull = {}, records, prop, date, k;
        records = data.eve.all;
        for(prop in records){
            if(!records.hasOwnProperty(prop)) continue;
            date = data.dat[prop];
            if("undefined" !== typeof(date)){
                k = (date.start_month!=null)?date.start_month:0;
                if("undefined" == typeof(pull[k])){
                    pull[k] = {};
                }
                pull[k][prop] = {event: records[prop], date: date};
            }
        }
        return pull;
    }

    $this.getEventsByType = function(type, sort){
        var _data, key, object, id, event, pull = [];
        switch(type){
            case "BIRT":case "DEAT": _data = data.eve.gedcom_id; break;
            case "MARR": _data = data.eve.family_id; break;
            default: return pull;
        }
        for(key in _data){
            if(!_data.hasOwnProperty(key)) continue;
            object = _data[key];
            for(id in object){
                if(!object.hasOwnProperty(id)) continue;
                event = object[id];
                if(event.type == type){
                    if("undefined" !== typeof(sort) && "function" === typeof(sort)){
                        if(sort(event)){
                            pull.push(event);
                        }
                    } else {
                        pull.push(event);
                    }
                }
            }
        }
        return pull;
    }

    $this.parseDate = function(date){
        var short = ["", 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        if("undefined" === typeof(date) || date == null) return '';
        var ret = "", isYear, isMonth, isDay;
        isYear = ("undefined" !== typeof(date.start_year) && date.start_year != null && date.start_year != 0);
        isMonth =("undefined" !== typeof(date.start_month) && date.start_month != null && date.start_month != 0);
        isDay = ("undefined" !== typeof(date.start_day) && date.start_day != null && date.start_day != 0);
        if(isYear){
            ret += date.start_year;
        }
        if(isYear && isMonth){
            ret += " - ";
        }
        if(isMonth){
            ret += short[parseInt(date.start_month)] + " ";
        }
        if(isDay){
            ret += date.start_day;
        }
        return ret;
    }

    $this.parsePlace = function(place){
        if("undefined" === typeof(place) || place == null) return '';
        var ret = [];
        if(place.city != null && place.city.length != 0){
            ret.push(place.city);
        }
        if(place.state != null && place.state.length != 0){
            //ret.push(place.state);
        }
        if(place.country != null && place.country.length != 0){
            ret.push(place.country);
        }
        return ret.join(", ");
    }

    $this.getImage = function(gedcom_id, size, style, src){
        var el = (gedcom_id)?$this.getAvatar(gedcom_id):false,
            user = $this.user(gedcom_id),
            data = [],
            url;

        style = (style)?style:"img-polaroid";
        if(el){
            data = [el.thumbnail_url, $('<img class="'+style+'" />')];
        } else if(gedcom_id && gedcom_id in usersmap){
            data = [
                'https://graph.facebook.com/'+usersmap[gedcom_id].facebook_id+'/picture?width='+size[0]+'&height='+size[1],
                $('<img class="'+style+'" />')
            ];
        } else if(size[0] in {"25":true, "35":true, "50":true,"75":true, "90":true, "140":true}) {
            url = ($this.url().base()+"/templates/familytreetop/images/"+((parseInt(user.gender))?"male":"female")+size[0]+".png");
            data = [
                url,
                $('<img class="'+style+'" src="'+url+'" />')
            ];
        } else {
            url = ($this.url().base()+"/templates/familytreetop/js/holder.js/"+((size)?size.join('x'):"100x100"));
            data = [
                false,
                $('<img class="'+style+'" data-src="'+url+'" />'),
                url
            ];
        }
        if(size){
            data[1].attr('width', size[0] + "px");
            data[1].attr('height', size[1] + "px");
            data[1].css('width', size[0] + "px");
            data[1].css('height', size[1] + "px");
        }
        return (src)
            ?data[0]
            :data[1]
            .attr('gedcom_id', gedcom_id)
            .attr('src', data[0] || "");
    }

    $this.getMedia = function(media_id){
        if("undefined" === typeof(data.med.all[media_id])) return false;
        return data.med.all[media_id]
    }

    $this.updateMedia = function(media){
        data.med.all[media.id] = media;
        if("undefined" === typeof(data.med.gedcom_id[media.gedcom_id])){
            data.med.gedcom_id[media.gedcom_id] = [];
        }
        data.med.gedcom_id[media.gedcom_id].push(media);
    }

    $this.mediaRemove = function(media_id){
        if("undefined" === typeof(data.med.all[media_id])) return false;
        var gedcom_id = data.med.all[media_id].gedcom_id;
        var d = data.med.gedcom_id[gedcom_id];
        for(var key in d){
            if(!d.hasOwnProperty(key)) continue;
            if(d[key].id == media_id){
                data.med.gedcom_id[gedcom_id].splice(key, 1);
            }
        }
        delete data.med.all[media_id];
    }

    $this.getAvatar = function(gedcom_id){
        var medias = $this.getMedias(gedcom_id);
        var ret = false;
        medias.forEach(function(el){
            if(el.role == "AVAT"){
                ret = el;
            }
        });
        return ret;
    }

    $this.getMedias = function(gedcom_id){
        if("undefined" === typeof(data.med.gedcom_id[gedcom_id])) return [];
        return data.med.gedcom_id[gedcom_id];
    }

    $this.setAvatar = function(gedcom_id, media_id){
        if("undefined" === typeof(data.med.gedcom_id[gedcom_id])) return false;
        if("undefined" === typeof(data.med.all[media_id])) return false;
        for(var key in data.med.gedcom_id[gedcom_id]){
            if(!data.med.gedcom_id[gedcom_id].hasOwnProperty(key)) continue;
            if(data.med.gedcom_id[gedcom_id][key].id == media_id){
                data.med.gedcom_id[gedcom_id][key].role = "AVAT";
            } else {
                data.med.gedcom_id[gedcom_id][key].role = "IMAG";
            }
        }
        data.med.all[media_id].role = "AVAT";
        delete cache[gedcom_id];
        $this.call();
    }
    $this.unsetAvatar = function(gedcom_id, media_id){
        if("undefined" === typeof(data.med.gedcom_id[gedcom_id])) return false;
        if("undefined" === typeof(data.med.all[media_id])) return false;
        for(var key in data.med.gedcom_id[gedcom_id]){
            if(!data.med.gedcom_id[gedcom_id].hasOwnProperty(key)) continue;
            if(data.med.gedcom_id[gedcom_id][key].id == media_id){
                data.med.gedcom_id[gedcom_id][key].role = "IMAG";
            }
        }
        data.med.all[media_id].role = "IMAG";
        delete cache[gedcom_id];
        $this.call();
    }

    $this.getData = function(){
        return data;
    }

    $this.getUsers = function(){
        return data.ind;
    }

    $this.init($FamilyTreeTop.dataString, $FamilyTreeTop.userString, $FamilyTreeTop.users);
});



