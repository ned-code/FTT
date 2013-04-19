$FamilyTreeTop.create("members", function($){
    'use strict';
    var $this = this,
        $box = $('#membersTable'),
        $filter = $('#filterMembers'),
        $pull = {},
        $fn;

    $fn = {}

    //<tr><td>Cousin</td><td>FirstName LastName</td><td></td><td></td></tr>
    /*
    <li>
        <label class="checkbox">
            <input type="checkbox"> 2 Siblings
        </label>
    </li>
    */

    $this.init = function(){
        var users = $this.mod('usertree').getUsers();
        for ( var key in users ){
            if(!users.hasOwnProperty(key)) continue;
            var object = $this.mod('usertree').user(users[key].gedcom_id);
            var birth = object.birth();
            var tr = $('<tr></tr>');
            if("undefined" === typeof($pull[object.relationId])){
                $pull[object.relationId] = [];
            }
            $pull[object.relationId].push(object);
            $(tr).append('<td>'+object.relation+'</td>');
            $(tr).append('<td>'+object.name()+'</td>');
            $(tr).append('<td>'+$this.mod('usertree').parseDate(birth.date)+'</td>');
            $(tr).append('<td>'+$this.mod('usertree').parsePlace(birth.place)+'</td>');
            $($box).append(tr);
        }
        var ul = $($filter).find('ul');
        for(var prop in $pull){
            if(!$pull.hasOwnProperty(prop)) continue;
            var object = $pull[prop];
            $(ul).append('<li><label class="checkbox"><input type="checkbox">'+object.length+' '+$this.mod('usertree').getRelationName(prop)+'</label></li>')
        }
    }
});