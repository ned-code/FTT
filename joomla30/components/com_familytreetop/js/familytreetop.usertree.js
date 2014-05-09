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
        _clearData_(response);
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
                case "con":
                    _setData_("con", item);
                    break;
                default:
                    break;
            }
        });
        $this.call();
        return true;
        function _clearData_(r){
            _each_(r, function(key, item){
                switch(key){
                    case "ind":
                        var id = __getId__(item);
                        __clearEve__(id);
                        break;
                }
            });
            return true;
            function __getId__(item){
                for(var key in item) return key;
            }
            function __clearEve__(id){
                delete data.eve.gedcom_id[id];
                for(var key in data.eve.all){
                    if(!data.eve.all.hasOwnProperty(key)) continue;
                    if(data.eve.all[key].gedcom_id == id){
                        delete data.eve.all[key];
                    }
                }
            }
        }
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
                if(item.length != 0){
                    if(parts.length == 2){
                        jQuery.extend(true, data[parts[0]][parts[1]], element);
                    } else {
                        jQuery.extend(true, data[parts[0]], element);
                    }
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
            is_can_be_delete: (ind.is_can_be_delete!=null)?parseInt(ind.is_can_be_delete):0,
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
            relationId:(function(){
                var relation = $this.getRelation(ind.gedcom_id);
                if(relation){
                    return relation.relation_id;
                }
                return 0;
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
               return res.name().toLowerCase().split(' ').join('.');
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
                    return ($this.parseBoolean(short))?ind.first_name:res.name();
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
                var b = $this.parseNum(res.birth('date.start_year'));
                var d = $this.parseNum(res.death('date.start_year'));
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
                var $self = res, date = new Date(), e = $self.birth();
                if(e && e.date && e.date.start_year != null){
                    return "turns " + (date.getFullYear() - e.date.start_year);
                }
                return "";
            },
            died: function(){
                var $self = res, date = new Date(), e = $self.death();
                if(e && e.date && e.date.start_year != null){
                    return "<div><div>died</div><div>" + (date.getFullYear() - e.date.start_year) + " years ago</div>";
                }
                return "";
            },
            isDeceased : function(){
                var $self = res, date = new Date(), d = $self.death(), b = $self.birth(), end = 0;
                if(b && b.date && b.date.start_year != null && b.date.start_year != 0){
                    end = (date.getFullYear() - b.date.start_year);
                    if(end > 150) return true;
                }
                if (d) {
                    return true;
                }
                return false;
            },
            isCanBeDelete: function(){
                return res.is_can_be_delete;
            },
            isCanBeEdit: function(){
                var usermap = $this.usermap();
                var isRegistered = res.isRegistered();
                var inLaw = res.inLaw;
                if(usermap.gedcom_id == ind.gedcom_id) return true;
                if(isRegistered) return false;
                if(inLaw){
                    var con = $this.getConnection(res.gedcom_id);
                    var prew = con[con.length - 2];
                    var rel = $this.getRelation(prew);
                    if(parseInt(rel.in_law)){
                        return false;
                    }
                }
                return true;
            },
            isCanAddChild: function(){
                var con = $this.getConnection(ind.gedcom_id);
                var inLaw = res.inLaw;
                if(inLaw && con.length > 1){
                    var id = con[con.length - 2];
                    var families = $this.getFamilies(id);
                    for(var key in families){
                        if(!families.hasOwnProperty(key)) continue;
                        var family = families[key];
                        if( (family.husb == id && family.wife == res.gedcom_id)
                            || (family.wife == id && family.husb == res.gedcom_id)
                            ){
                            return true;
                        }
                    }
                }
                return !inLaw;
            },
            isCanBeInvite: function(){
                var con = $this.getConnection(ind.gedcom_id);
                var isRegistered = res.isRegistered();
                var isAlive = res.isAlive();
                var inLaw = res.inLaw;
                if(inLaw && con.length > 1){
                    var id = con[con.length - 2];
                    var rel = $this.getRelation(id);
                    if(rel && parseInt(rel.relation_id) != 2 && !parseInt(rel.in_law) && !parseInt(rel.by_spouse)){
                        inLaw = 0;
                    }
                }
                if(isRegistered || !isAlive || inLaw) return false;
                return true;
            },
            isRegistered:function(){
                return $this.isRegisteredUser(ind.gedcom_id);
            },
            isAlive:function(){
                if(res.death()){
                    return false;
                }
                return true;
            },
            isSpouse:function(){
                var usermap = $this.mod('usertree').usermap();
                var spouses = $this.getSpouses(usermap.gedcom_id);
                for(var key in spouses){
                    if(!spouses.hasOwnProperty(key)) continue;
                    if(spouses[key] == ind.gedcom_id) return true;
                }
                return false;
            },
            isSpouseParent:function(){
                var usermap = $this.mod('usertree').usermap();
                var spouses = $this.getSpouses(usermap.gedcom_id);
                for(var key in spouses){
                    if(!spouses.hasOwnProperty(key)) continue;
                    var parents = $this.getParents(spouses[key]);
                    if(parents.father == ind.gedcom_id) return true;
                    if(parents.mother == ind.gedcom_id) return true;
                }
                return false;
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
        var res = {
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
                var $self = res, date = new Date(), e = $self.event();
                if(e && e.date && e.date.start_year != null){
                    return "<div>married</div><div>" + (date.getFullYear() - e.date.start_year) + " years ago</div>";
                }
                return "";
            }
        }
        return res;
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

    $this.isParent = function(parent_id, gedcom_id){
        if(!gedcom_id) return false;
        var p =$this.getParents(gedcom_id);
        return (p.father == parent_id || p.mother == parent_id);
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
            _src = $(src).find('img').attr('src');
            _data_src = $(src).find('img').attr('data-src');
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

    $this.getOwnerRelationName = function(user){
        var owner = $this.usermap();
        var rel = $this.getRelation(user.gedcom_id);
        var id = $this.getOwnerRelation(user);
        return $this.getRelationName({
            by_spouse: rel.by_spouse,
            change_time: rel.change_time,
            gedcom_id: owner.gedcom_id,
            id: rel.id,
            in_law: rel.in_law,
            json: rel.json,
            relation_id: id,
            target_id: user.gedcom_id
        }, false, user);
    }

    $this.getOwnerRelation = function(user){
        var G = $this.parseBoolean(user.gender);
        switch($this.parseNum(user.relationId)){
            case 1: return 1; break;
            case 2: return 2; break;
            case 3: return (G)?6:5; break;
            case 4: return (G)?6:5; break;
            case 5: return (G)?4:3; break;
            case 6: return (G)?4:3; break;
            case 7: return (G)?8:7; break;
            case 8: return (G)?8:7; break;
            case 9: return 9; break;
            case 10: return (G)?13:12; break;
            case 11: return (G)?13:12; break;
            case 12: return (G)?11:10; break;
            case 13: return (G)?11:10; break;
            case 103: return (G)?106:105; break;
            case 104: return (G)?106:105; break;
            case 105: return (G)?104:103; break;
            case 106: return (G)?104:103; break;
            case 110: return (G)?113:112; break;
            case 111: return (G)?113:112; break;
            case 112: return (G)?111:110; break;
            case 113: return (G)?111:110; break;
            case 203: return (G)?206:205; break;
            case 204: return (G)?206:205; break;
            case 205: return (G)?204:203; break;
            case 206: return (G)?204:203; break;
            case 210: return (G)?213:212; break;
            case 211: return (G)?213:212; break;
            case 212: return (G)?211:210; break;
            case 213: return (G)?211:210; break;
            case 1000: return 1000; break;
        }
    }

    $this.getRelation = function(gedcom_id){
        if(data.rel == null) return false;
        if("undefined" !== typeof(data.rel[gedcom_id])){
            return data.rel[gedcom_id];
        }
        return false;
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

    $this.getRelationName = function(object, flag, user){
        var name,
            con,
            rel,
            relation_id,
            suffix,
            postfix,
            nameString;
        if("undefined" !== typeof(object)){
            con = $this.getConnection(object.target_id);
            relation_id = parseInt(object.relation_id, 10);
            name = _getName_(relation_id, user);
            suffix = _getSuffix_(object);
            postfix = _getPostfix_(object);

            if( (relation_id == 10 || relation_id == 11) && postfix.length > 0 && con.length > 1 ){
                rel = $this.getRelation(con[con.length - 2]);
                if("undefined"!==typeof(rel) && rel && !$this.parseNum(rel.in_law)){
                    postfix = "";
                }
            }

            if(relation_id == 9){
                nameString = relationList[name] + " " + suffix + " " + postfix;
            } else {
                nameString = suffix + " " + relationList[name] + " " + postfix;
            }
            return $this.trim.call(nameString);
        }
        return "";
        function _getSuffix_(o){
            var suf = (o.json!=null&&"undefined"!=typeof(o.json.suffix))?o.json.suffix:0;
            if(suf){
                suf = suf.toUpperCase();
                return ("undefined" !== typeof(relationList[suf]))?relationList[suf]:suf;
            }
            return "";
        }
        function _getPostfix_(o){
            return (parseInt(o.in_law))?relationList["IN_LAW"]:"";
        }
        function _getName_(id, user){
            var gender = ("undefined"!=typeof(user)&&$this.parseNum(user.gender));
            if(id == 2){
                return (gender)?"SPOUSE_MALE":"SPOUSE_FEMALE";
            } else if(id == 9){
                return (gender)?"COUSIN_MALE":"COUSIN_FEMALE";
            } else {
                return ("undefined"!==typeof(data.rel['_NAMES'][id]))?data.rel["_NAMES"][id].name:false;
            }
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
            obj.father = _getParent_(family, 1);
            obj.mother = _getParent_(family, 0);
            return obj;
        }
        return obj;
        function _getInd_(id){
            if("undefined"!==typeof(data.ind[id])){
                return data.ind[id];
            }
            return false;
        }
        function _getParent_(f, male){
            var husb,wife;
            husb = _getInd_(f.husb);
            wife = _getInd_(f.wife);
            if(male && parseInt(husb.gender) == male){
                return husb.gedcom_id;
            } else if(male && parseInt(husb.gender) != male && parseInt(wife.gender) == male){
                return wife.gedcom_id;
            } else if(!male && parseInt(wife.gender) == male){
                return wife.gedcom_id;
            } else if(!male && parseInt(wife.gender) != male && parseInt(husb.gender) == male){
                return husb.gedcom_id;
            }
            return null;
        }
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
            if(!childs.hasOwnProperty(k)) continue;
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

    $this.getImage = function(gedcom_id, size){
      var user = $this.user(gedcom_id),
          innerSize = [],
          imgSize = [],
          imgMarginLeft = "",
          imgMarginTop = "",
          attr = {},
          avatar = (gedcom_id)?$this.getAvatar(gedcom_id):false,
          $img = $('<img></img>'),
          $outerDiv = $('<div></div>'),
          $innerDiv = $('<div></div>');

      if(size[0] > 50 && size[1] > 50){
        $($outerDiv).addClass('img-thumbnail');
        innerSize.push(parseInt(size[0]) - 10 );
        innerSize.push(parseInt(size[0]) - 10 );
      } else {
        $($outerDiv).addClass('img-rounded');
        innerSize.push(parseInt(size[0]));
        innerSize.push(parseInt(size[0]));
      }

      $outerDiv.attr({
        'gedcom_id' : gedcom_id,
        'style' : "overflow:hidden;width:"+size[0]+"px;height:"+size[1]+"px;"
      });
      $innerDiv.attr({
        'gedcom_id' : gedcom_id,
        'class' : "text-center",
        'style' : "overflow:hidden;width:"+innerSize[0]+"px;height:"+innerSize[1]+"px;"
      });
      $img.attr({
        'gedcom_id' : gedcom_id

      });

      if(avatar){
        attr.src = (function(data){
            if(data.json != null && data.thumbnail_url == ""){
                return data.json.thumbnail.url;
            } else if(data.json == null && data.thumbnail_url != ""){
                return data.thumbnail_url;
            } else {
                return data.url;
            };
        })(avatar);
      } else if(gedcom_id && "undefined" !== typeof(usersmap[gedcom_id])){
        attr.src = 'https://graph.facebook.com/'+usersmap[gedcom_id].facebook_id+'/picture?width='+size[0]+'&height='+size[1];
      } else {
        attr.src = $this.url().base()+"/templates/familytreetop/images/"+((parseInt(user.gender))?"male":"female")+size[0]+".png";
      }

      (function(){
        var scale, k;
        if(avatar){
            scale = [avatar.json.natural.width, avatar.json.natural.height];
            if(scale[0] < scale[1]){
                k = innerSize[0] / scale[0];
            } else if(scale[0] > scale[1]){
                k = innerSize[1] / scale[1];
            } else {
                if(innerSize[0] < innerSize[1]){
                    k = innerSize[0] / scale[0];
                } else {
                    k = innerSize[1] / scale[1];
                }
            }
            imgSize.push(scale[0]*k);
            imgSize.push(scale[1]*k);
        } else {
            imgSize.push(innerSize[0]);
            imgSize.push(innerSize[1]);
        }
      })();

        if(imgSize[0] > innerSize[0]){
            imgMarginLeft = "margin-left: -"+(function(imgWidth, optWidth){
                var width = imgWidth - optWidth;
                return width/2;
            })(imgSize[0], innerSize[0])+"px";
        }
        if(imgSize[1] > innerSize[1]){
            imgMarginTop = "margin-top: -"+(function(imgHeight, optHeight){
                var width = imgHeight - optHeight;
                return width/2;
            })(imgSize[1], innerSize[1])+"px";
        }

      attr.style = "width: "+imgSize[0]+"px; height: "+imgSize[1]+"px;"+imgMarginLeft+imgMarginTop;

      $img.attr(attr);
      $innerDiv.append($img);
      $outerDiv.append($innerDiv);
      return $outerDiv;
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

    $this.getAncestorList = function(){
        var um = $this.usermap();
        var list = {};
        setAncestorList(um.gedcom_id);
        return list;
        function setAncestorList(id){
            var p = $this.getParents(id);
            if(p.family_id == null) return false;
            if(p.father != null){
                list[p.father] = true;
                setAncestorList(p.father);
            }
            if(p.mother != null){
                list[p.mother] = true;
                setAncestorList(p.mother);
            }
        }
    }

    $this.getDescendantList = function(){
        var um = $this.usermap();
        var list = {};
        setDescendantsList(um.gedcom_id);
        return list;
        function setDescendantsList(id){
            var c = $this.getChildrens(id);
            if(c.length > 0){
                for(var key in c){
                    if(!c.hasOwnProperty(key)) continue;
                    var e = c[key];
                    if(e != null){
                        list[e] = true;
                        setDescendantsList(e);
                    }
                }
            }
        }
    }

    $this.getData = function(){
        return data;
    }

    $this.getUsers = function(){
        return data.ind;
    }

    $this.init($FamilyTreeTop.dataString, $FamilyTreeTop.userString, $FamilyTreeTop.users);
});



