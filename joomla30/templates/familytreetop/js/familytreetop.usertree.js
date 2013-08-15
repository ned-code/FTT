$FamilyTreeTop.create("usertree", function($){
    'use strict';
    var $this = this,
        $fn,
        trPull = [],
        usermap,
        usersmap,
        data;

    $fn = {

    }

    $this.trigger = function(callback){
        trPull.push(callback);
    }

    $this.call = function(){
        for(var prop in trPull){
            if(!trPull.hasOwnProperty(prop)) continue;
            trPull[prop]();
        }
    }

    $this.init = function(dataString, userString, usersString){
        if(dataString.length != 0){
            data = $.parseJSON(dataString);
            window._A = data;
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
    }

    $this.update = function(response){
        var prop, items, key, id, list, i, els;
        for(prop in response){
            if(!response.hasOwnProperty(prop)) continue;
            items = response[prop];
            switch(prop){
                case "chi":
                    for(var key in items){
                        if(!items.hasOwnProperty(key)) continue;
                        list = items[key];
                        for(id in list){
                            if(!list.hasOwnProperty(id)) continue;
                            els = list[id];
                            if("undefined" === typeof(data[prop][key][id])){
                                data[prop][key][id] = [];
                            }
                            data[prop][key][id].push(els);
                        }
                    }
                    break;
                case "eve":
                    for(var key in items){
                        if(!items.hasOwnProperty(key)) continue;
                        list = items[key];
                        for(id in list){
                            if(!list.hasOwnProperty(id)) continue;
                            if("all" == key){
                                data[prop][key][id] = list[id];
                            } else {
                                els = list[id];
                                for(i in els){
                                    if(!els.hasOwnProperty(i)) continue;
                                    if("undefined" === typeof(data[prop][key][id])){
                                        data[prop][key][id] = {};
                                    }
                                    data[prop][key][id][i] = els[i];
                                }
                            }
                        }
                    }
                    break;
                case "fam":
                    for(var key in items){
                        if(!items.hasOwnProperty(key)) continue;
                        list = items[key];
                        for(id in list){
                            if(!list.hasOwnProperty(id)) continue;
                            if("family_id" == key){
                                data[prop][key][id] = list[id];
                            } else {
                                els = list[id];
                                for(i in els){
                                    if(!els.hasOwnProperty(i)) continue;
                                    if("undefined" === typeof(data[prop][key][id])){
                                        data[prop][key][id] = [];
                                    }
                                    data[prop][key][id].push(els[i]);
                                }
                            }
                        }
                    }
                    break;
                case "med":
                    break;
                case "ind":
                case "pla":
                case "dat":
                case "rel":
                    for(key in items){
                        if(!items.hasOwnProperty(key)) continue;
                        data[prop][key] = items[key];
                    }
                    break;
            }
        }
        $this.call();
        return true;
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
        var ind = data.ind[gedcom_id], usermap = $this.usermap();
        return {
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
                    return $this.getRelationName(relation);
                }
                return "unknown";
            })(),
            relation2: (function(){
                var relation = $this.getRelation(ind.gedcom_id);
                if(relation){
                    return $this.getRelationName(relation, true);
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
            medias: function(){
              return $this.getMedias(ind.gedcom_id);
            },
            birth:function(path){
                var e = $this.getUserEventByType(ind.gedcom_id, 'BIRT'), st, prop, val = "";
                if(!e) return "";
                if("undefined" === typeof(path)){
                    return e || "";
                }
                st = path.split('.');
                for(prop in st){
                    if(!st.hasOwnProperty(prop)) continue;
                    val = (val=="")?e[st[prop]]:val[st[prop]];
                }
                return ("undefined"!==typeof(val))?val:"";
            },
            death:function(){
                return $this.getUserEventByType(ind.gedcom_id, 'DEAT');
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
                } else if(!_isParentExist_(parents) && _isChildrenExist_(childrens) && !_isSpousesExist_(spouses)){
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
            },
            isFatherLine:function(){
                var object, id, _user;
                if(data.con == null) return false;
                if("undefined" !== typeof(data.con[ind.gedcom_id])){
                    object = data.con[ind.gedcom_id];
                    if(object.length > 1){
                        _user = $this.user(object[1]);
                        id = parseInt(_user.relationId);
                        if(id==4){
                            return true;
                        } else if(id > 4 && id < 9){
                            return true;
                        } else if(id == 105 || id == 106 || id == 205 || id == 206){
                            return true;
                        }
                    }
                }
                return false;
            },
            isMotherLine:function(){
                var object, id, _user;
                if(data.con == null) return false;
                if("undefined" !== typeof(data.con[ind.gedcom_id])){
                    object = data.con[ind.gedcom_id];
                    if(object.length > 1){
                        _user = $this.user(object[1]);
                        id = parseInt(_user.relationId);
                        if(id==3){
                            return true;
                        } else if(id > 4 && id < 9){
                            return true;
                        } else if(id == 105 || id == 106 || id == 205 || id == 206){
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    }

    $this.family = function(family_id){
        if("undefined" === typeof(family_id)) return false;
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

    $this.getRelName = function(obj, id, suffix, postfix){
        var val = data.rel["_NAMES"][id], name;
        if(data.rel != null && "undefined" !== typeof(val)){
            name = $('#relations').find('[data-familytreetop="'+val.name+'"]').text()
            return ((_is_(suffix))?_getSuffix_(obj):"") + " " + name + " " + ((_is_(postfix))?_getPostfix_(obj):"");
        }
        return false;
        function _is_(k){
            return "undefined" === typeof(k) || ( "undefined"!==typeof(k)&&k );
        }
        function _getSuffix_(o){
            return (o.json!=null&&"undefined"!=typeof(o.json.suffix))?o.json.suffix:"";
        }
        function _getPostfix_(o){
            return (parseInt(o.in_law))?"in-law":"";
        }
    }

    $this.getRelationName = function(object, flag){
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
            return $this.getRelName(obj, id, suffix, postfix);
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

    $this.getFAmilyEventByType = function(family_id, type){
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
        var ret = "";
        if(date.start_year != null){
            ret += date.start_year + " - ";
        }
        if(date.start_month != null){
            ret += short[parseInt(date.start_month)] + " ";
        }
        if(date.start_day != null){
            ret += date.start_day;
        }
        return ret;
    }

    $this.parsePlace = function(place){
        if("undefined" === typeof(place) || place == null) return '';
        var ret = [];
        if(place.city != null){
            ret.push(place.city);
        }
        if(place.state != null){
            //ret.push(place.state);
        }
        if(place.country != null){
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
                data.med.gedcom_id[gedcom_id].role = "AVAT";
            } else {
                data.med.gedcom_id[gedcom_id].role = "IMAG";
            }
        }
        data.med.all[media_id].role = "AVAT";
    }
    $this.unsetAvatar = function(gedcom_id, media_id){
        if("undefined" === typeof(data.med.gedcom_id[gedcom_id])) return false;
        if("undefined" === typeof(data.med.all[media_id])) return false;
        for(var key in data.med.gedcom_id[gedcom_id]){
            if(!data.med.gedcom_id[gedcom_id].hasOwnProperty(key)) continue;
            if(data.med.gedcom_id[gedcom_id][key].id == media_id){
                data.med.gedcom_id[gedcom_id].role = "IMAG";
            }
        }
        data.med.all[media_id].role = "IMAG";
    }

    $this.mediaRemove = function(media_id){
        if("undefined" === typeof(data.med.all[media_id])) return false;
        var d =  data.med.all[media_id]
        for(var key in d){
            if(!d.hasOwnProperty(key)) continue;
            var gedcom_id = d.gedcom_id;
            if("undefined" !== typeof(data.med.gedcom_id[gedcom_id])){
                for(var index in data.med.gedcom_id[gedcom_id]){
                    if(!data.med.gedcom_id[gedcom_id].hasOwnProperty(index)) continue;
                    if(data.med.gedcom_id[gedcom_id][index].id = media_id){
                        data.med.gedcom_id[gedcom_id].splice(index, 1);
                    }
                }
            }
        }
        delete data.med.all[media_id];
    }

    $this.getData = function(){
        return data;
    }

    $this.getUsers = function(){
        return data.ind;
    }

    $this.init($FamilyTreeTop.dataString, $FamilyTreeTop.userString, $FamilyTreeTop.users);
});



