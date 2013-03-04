$FamilyTreeTop.create("usertree", function($){
    var $this = this,
        $fn,
        data;

    $fn = {

    }

    $this.init = function(dataString){
       data = $.parseJSON(dataString);
       console.log(data);
    }

    $this.user = function(gedcom_id){
        if(data.ind.length = 0 && "undefined" === typeof(data.ind[gedcom_id])) return false;
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
            }
        }
    }

    $this.family = function(family_id){
        if(data.fam.length = 0 && "undefined" === typeof(data.fam[family_id])) return false;
        var fam = data.fam[gedcom_id];
        return {
            change_time: fam.change_time,
            family_id: fam.family_id,
            husb: fam.husb,
            id: fam.id,
            type: fam.type,
            wife: fam.wife
        }
    }

    $this.init($FamilyTreeTop.dataString);
});