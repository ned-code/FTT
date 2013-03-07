$FamilyTreeTop.create("usertree", function($){
    'use strict';
    var $this = this,
        $fn,
        usermap,
        data;

    $fn = {

    }

    $this.init = function(dataString, userString){
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
            name:function(){
                var $name = [];
                if(ind.first_name != null) $name.push(ind.first_name);
                if(ind.last_name != null){
                    if(ind.middle_name != null) $name.push(ind.middle_name);
                    $name.push(ind.last_name);
                }
                return $name.join(' ');
            },
            isParents:function(){
                var parents = $this.getParents(gedcom_id);
                return parents.father || parents.mother || false;
            }
        }
    }

    $this.family = function(family_id){
        if("undefined" === typeof(family_id)) return false;
        if("undefined" === typeof(data.fam[family_id])) return false;
        var fam = data.fam[family_id];
        return {
            change_time: fam.change_time,
            family_id: fam.family_id,
            husb: fam.husb,
            id: fam.id,
            type: fam.type,
            wife: fam.wife
        }
    }

    $this.getFamilyIdByGedcomId = function(gedcom_id){
        var obj = {family_id: null, father: null, mother: null};
        if("undefined" === typeof(data.fam.gedcom_id[gedcom_id])) return obj;
        var families = data.fam.gedcom_id[gedcom_id];
        for(var key in families){
            var family = families[key];
            obj.family_id = family.family_id;
            obj.father = family.husb;
            obj.mother = family.wife;
        }
        return obj;
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

    $this.init($FamilyTreeTop.dataString, $FamilyTreeTop.userString);
});