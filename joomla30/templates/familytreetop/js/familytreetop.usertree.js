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
            facebook_id: (function(){
                if(ind.gedcom_id in usersmap){
                    return usersmap[ind.gedcom_id].facebook_id;
                } else {
                    return 0;
                }
            })(),
            relation: (function(){
                var relation_id = $this.getRelation(ind.gedcom_id);
                if(relation_id[0]){
                    var name = $this.getRelationName(relation_id);
                    if(relation_id[1]){
                        return name;
                    } else {
                        return name+'-in-law';
                    }
                }
                return "";
            })(),
            relationId:(function(){
                var relation_id = $this.getRelation(ind.gedcom_id);
                if(relation_id[1]){
                    return relation_id[0].relation_id;
                }
                return 0;
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
            birth:function(){
                return $this.getUserEventByType(ind.gedcom_id, 'BIRT');
            },
            death:function(){
                return $this.getUserEventByType(ind.gedcom_id, 'DEAT');
            },
            event:function(id){
                if("undefined" === typeof(id)) return false;
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
            wife: fam.wife
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

    $this.isRelationBelongTo = function(target_id, object){
        var map = $this.getRelationMap(target_id);
        for(var prop in map){
            if(!map.hasOwnProperty(prop)) continue;
            if(map[prop] in object) return true;
        }
        return false;
    }

    $this.getRelation = function(gedcom_id){
        if(data.rel == null) return [false, true];
        if("undefined" !== typeof(data.rel[gedcom_id])){
            return [data.rel[gedcom_id], true];
        } else {
            var spouses = $this.getSpouses($this.usermap().gedcom_id, true);
            if($this.isRelationBelongTo(gedcom_id, spouses)){
                for(var prop in spouses){
                    if(!spouses.hasOwnProperty(prop)) continue;
                    if("undefined" !== typeof(data.rel._SPOUSES[prop])){
                        var map = data.rel._SPOUSES[prop];
                        if("undefined" !== typeof(map[gedcom_id])){
                            return [map[gedcom_id], false];
                        }
                    }
                }
            }
        }
        return [false, true];
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
        var object = $this.getConnection(gedcom_id);
        //console.log(object);
    }

    $this.getRelationName = function(object){
        var relationId = object[0].relation_id,
            json = object[0].json,
            suffix = (json!=null&&"undefined"!=typeof(json.suffix))?json.suffix:"";
        if(data.rel != null && "undefined" !== typeof(data.rel._NAMES[relationId])){

            return (suffix) + " " + $('#relations').find('[data-familytreetop="'+data.rel["_NAMES"][relationId].name+'"]').text();
        }
        return "undefined";
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
        var ind = $this.user(gedcom_id);
        var families = data.fam.gedcom_id[gedcom_id];
        var spouses = [];
        for(var key in families){
            if(!families.hasOwnProperty(key)) continue;
            if(parseInt(ind.gender)){
                if("undefined" !== typeof(how_object)){
                    spouses[families[key].wife] = true;
                } else {
                    spouses.push(families[key].wife);
                }
            } else {
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
            ret.push(place.state);
        }
        if(place.country != null){
            ret.push(place.country);
        }
        return ret.join("-");
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
                'https://graph.facebook.com/'+usersmap[gedcom_id].facebook_id+'/picture/',
                $('<img class="'+style+'" />')
            ];
        } else if(size[0] in {"35":true, "50":true, "90":true, "140":true}) {
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



