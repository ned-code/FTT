$FamilyTreeTop.create("latest_events", function($){
    'use strict';
    var $this = this,
        $birthBox = $('#latestBriths'),
        $marrBox = $('#latestMarriages'),
        $deathBox = $('#latestDeaths'),
        $fn;

    $fn = {
        setHolderImage: function(img){
            Holder.run({
                images: img
            });
            return img;
        },
        setEvents: function(box, events, type){
            var user, family, husb, wife, div, ev, tr, td, avatar;
            for(var prop in events){
                if(!events.hasOwnProperty(prop)) continue;
                if(prop == 3) break;
                tr = $('<tr></tr>');
                td = $('<td style="width:45px;"></td>');

                if(type == "marr"){
                    family = $this.mod('usertree').family(events[prop].family_id);
                    husb =  $this.mod('usertree').user(family.husb);
                    wife =  $this.mod('usertree').user(family.wife);

                    avatar = husb.avatar(["25", "25"]);
                    $fn.setHolderImage(avatar[0]);
                    div = $('<div></div>');
                    $(div).append(avatar);
                    $(td).append(div);

                    avatar = wife.avatar(["25", "25"]);
                    $fn.setHolderImage(avatar[0]);
                    div = $('<div></div>');
                    $(div).append(avatar);
                    $(td).append(div);

                    ev = family.event();

                    $(tr).append('<td class="text-center" style="width:100px; vertical-align: middle;">'+$this.mod('usertree').parseDate(ev.date)+'</td>');
                    $(tr).append(td);
                    $(tr).append('<td><div gedcom_id="'+husb.gedcom_id+'">'+husb.name()+'</div><div><i class="icon-leaf"></i>'+husb.relation+'</div><div gedcom_id="'+wife.gedcom_id+'">'+wife.name()+'</div><div><i class="icon-leaf"></i>'+wife.relation+'</div></td>');
                    $(tr).find('div[gedcom_id]').each(function(i, el){
                        $this.mod('popovers').render({
                            target: el,
                            placement: "left"
                        });
                    });
                } else {
                    user = $this.mod('usertree').user(events[prop].gedcom_id);
                    ev = user[type]();
                    avatar = user.avatar(["25","25"]);
                    $fn.setHolderImage(avatar[0]);
                    $(td).append(avatar);
                    $(tr).append('<td class="text-center" style="width:100px; vertical-align: middle;">'+$this.mod('usertree').parseDate(ev.date)+'</td>');
                    $(tr).append(td);
                    $(tr).append('<td><div gedcom_id="'+user.gedcom_id+'">'+user.name()+'</div><div><i class="icon-leaf"></i>'+user.relation+'</div></td>');
                    $this.mod('popovers').render({
                        target: $(tr).find('div[gedcom_id]'),
                        placement: "left"
                    });
                }
                $(box).append(tr);
            }
        }
    }

    $this.init = function(events){
        var birth = events.BIRT, death = events.DEAT, marr = events.MARR;
        if("undefined" !== typeof(birth)){
            $fn.setEvents($birthBox, birth, 'birth');
        }
        if("undefined" !== typeof(death)){
            $fn.setEvents($deathBox, death, 'death');
        }
        if("undefined" !== typeof(marr)){
            $fn.setEvents($marrBox, marr, 'marr');
        }
    }
});