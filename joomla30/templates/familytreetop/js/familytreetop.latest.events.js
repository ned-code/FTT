$FamilyTreeTop.create("latest_events", function($){
    'use strict';
    var $this = this,
        $birthBox = $('#latestBriths'),
        $marrBox = $('#latestMarriages'),
        $deathBox = $('#latestDeaths'),
        $fn;

    $fn = {

    }

    $this.init = function(events){
        var birth = events.BIRT, death = events.DEAT, marr = events.MARR;
        if("undefined" !== typeof(birth)){
            for(var prop in birth){
                if(!birth.hasOwnProperty(prop)) continue;
                if(prop == 3) break;
                var user = $this.mod('usertree').user(birth[prop].gedcom_id);
                var b = user.birth();
                var tr = $('<tr></tr>');
                var td = $('<td style="width:45px;"></td>');
                var avatar = user.avatar(["35","35"]);
                $(td).append(avatar);
                $(tr).append('<td class="text-center" style="width:100px; vertical-align: middle;">'+$this.mod('usertree').parseDate(b.date)+'</td>');
                $(tr).append(td);
                $(tr).append('<td><div>'+user.name()+'</div><div><i class="icon-leaf"></i>'+user.relation+'</div></td>');
                $($birthBox).append(tr);

                Holder.run({
                    images: avatar[0]
                });
            }
        }
        if("undefined" !== typeof(death)){
            for(var prop in death){
                if(!death.hasOwnProperty(prop)) continue;
                if(prop == 3) break;
                var user = $this.mod('usertree').user(death[prop].gedcom_id);
                var d = user.death();
                var tr = $('<tr></tr>');
                var td = $('<td style="width:45px;"></td>');
                var avatar = user.avatar(["35","35"]);
                $(td).append(avatar);
                $(tr).append('<td class="text-center" style="width:100px; vertical-align: middle;">'+$this.mod('usertree').parseDate(d.date)+'</td>');
                $(tr).append(td);
                $(tr).append('<td><div>'+user.name()+'</div><div><i class="icon-leaf"></i>'+user.relation+'</div></td>');
                $($deathBox).append(tr);

                Holder.run({
                    images: avatar[0]
                });
            }
        }
        if("undefined" !== typeof(marr)){

        }
    }
});