$FamilyTreeTop.create("members", function($){
    'use strict';
    var $this = this,
        $box = $('#membersTable'),
        $fn;

    $fn = {}

    //<tr><td>Cousin</td><td>FirstName LastName</td><td></td><td></td></tr>

    $this.init = function(){
        var users = $this.mod('usertree').getUsers();
        for ( var key in users ){
            if(!users.hasOwnProperty(key)) continue;
            var object = $this.mod('usertree').user(users[key].gedcom_id);
            var birth = object.birth();
            var tr = $('<tr></tr>');
            $(tr).append('<td>'+object.relation+'</td>');
            $(tr).append('<td>'+object.name()+'</td>');
            $(tr).append('<td>'+$this.mod('usertree').parseDate(birth.date)+'</td>');
            $(tr).append('<td>'+$this.mod('usertree').parsePlace(birth.place)+'</td>');
            $($box).append(tr);
        }
    }
});