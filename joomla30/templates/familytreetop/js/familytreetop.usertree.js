$FamilyTreeTop.create("usertree", function($){
    'use strict';
    var $this = this,
        $fn,
        usermap,
        data;

    $fn = {

    }

    $this.init = function(dataString, userString, facebookString){
        if(dataString.length != 0){
            data = $.parseJSON(dataString);
            console.log(data);
        } else {
            data = null;
        }
        if(userString.length != 0){
            usermap = $.parseJSON(userString);
            console.log(usermap);
        } else {
            usermap = null;
        }
    }

    $this.usermap = function(){
        return usermap;
    }

    $this.user = function(gedcom_id){
        if("undefined" === typeof(gedcom_id)) return false;
        if("undefined" === typeof(data.ind[gedcom_id])) return false;
        var ind = data.ind[gedcom_id];
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
            birth:function(){
                return $this.getUserEventByType(ind.gedcom_id, 'BIRT');
            },
            death:function(){
                return $this.getUserEventByType(ind.gedcom_id, 'DEAT');
            },
            event:function(id){
                if("undefined" === typeof(id)) return false;
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

    $this.getSpouses = function(gedcom_id){
        if("undefined" === typeof(data.fam.gedcom_id[gedcom_id])) return [];
        var ind = $this.user(gedcom_id);
        var families = data.fam.gedcom_id[gedcom_id];
        var spouses = [];
        for(var key in families){
            if(!families.hasOwnProperty(key)) continue;
            if(parseInt(ind.gender)){
                spouses.push(families[key].wife);
            } else {
                spouses.push(families[key].husb);
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
                return ret;
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

    $this.init($FamilyTreeTop.dataString, $FamilyTreeTop.userString);
});