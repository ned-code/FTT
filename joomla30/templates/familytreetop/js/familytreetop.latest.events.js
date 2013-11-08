$FamilyTreeTop.create("latest_events", function($){
    'use strict';
    var $this = this,
        $birthBox = $('#latestBriths'),
        $marrBox = $('#latestMarriages'),
        $deathBox = $('#latestDeaths'),
        $languages,
        $fn;

    $fn = {
        setHolderImage: function(img){
            Holder.run({
                images: img
            });
            return img;
        },
        setNull: function(box){
            $(box).append('<tr familytreetop="null" ><td colspan="3" style="text-align:center; padding: 20px;"><i class="icon-calendar-empty" style="font-size:28px;"></i> <span>'+$languages['none']+'</span></td></tr>')
        },
        setEvents: function(box, events, type){
            var user, family, husb, wife, div, ev, tr, td, avatar;
            for(var prop in events){
                if(!events.hasOwnProperty(prop)) continue;
                if(prop == 3) break;
                tr = $('<tr class="familytreetop-last-event-item"></tr>');
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
                    div = $('<div style="margin-top: 5px;"></div>');
                    $(div).append(avatar);
                    $(td).append(div);

                    ev = family.event();
                    $(tr).addClass('familytreetop-hover-effect');
                    $(tr).attr('gedcom_id', 'family:' + husb.gedcom_id + "," + wife.gedcom_id);
                    $(tr).append('<td class="text-center" style="padding-left:10px;width:100px; vertical-align: middle;">'+$this.mod('usertree').parseDate(ev.date)+'</td>');
                    $(tr).append(td);
                    $(tr).append('<td><div gedcom_id="'+husb.gedcom_id+'"><div data-familytreetop-color="'+husb.gender+'">'+husb.name()+'</div><div class="familytreetop-this-month-relation"><i class="icon-leaf"></i>'+husb.relation+'</div></div><div gedcom_id="'+wife.gedcom_id+'"><div style="margin-top: 5px;" data-familytreetop-color="'+wife.gender+'">'+wife.name()+'</div><div class="familytreetop-this-month-relation"><i class="icon-leaf"></i>'+wife.relation+'</div></div></td>');
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
                    $(tr).addClass('familytreetop-hover-effect');
                    //$(tr).attr('gedcom_id', user.gedcom_id);
                    $(td).append(avatar);
                    $(tr).append('<td class="text-center" style="padding-left:10px;width:100px; vertical-align: middle;">'+$this.mod('usertree').parseDate(ev.date)+'</td>');
                    $(tr).append(td);
                    $(tr).append('<td><div div="'+user.gedcom_id+'" data-familytreetop-color="'+user.gender+'" gedcom_id="'+user.gedcom_id+'">'+user.name()+'</div><div class="familytreetop-this-month-relation"><i class="icon-leaf"></i>'+user.relation+'</div></td>');
                    $this.mod('popovers').render({
                        target: $(tr).find('div[gedcom_id]'),
                        placement: "left"
                    });
                }
                $(box).append(tr);
            }
        },
        setFamilyLine:function(){
            $("#latest_events").find('tr[gedcom_id]').each(function(index, element){
                var gedcom_id = $(element).attr('gedcom_id'), gparts;
                gparts = gedcom_id.split(':');
                if(gparts[0] == "family"){
                    gparts = gparts[1].split(',');
                    $this.mod('familyline').bind(element, gparts[0]);
                    $this.mod('familyline').bind(element, gparts[1]);
                } else {
                    $this.mod('familyline').bind(element,  gedcom_id);
                }
            });
        },
        onFamilyLine:function(args){
            if(args.type == "eye"){
                var b = 0 , d = 0, m = 0;
                $($birthBox).find('tr').each(function(i,e){
                    if($(e).css('display') != 'none' && $(e).attr('familytreetop') != 'null' ){
                        b++;
                    }
                });
                $($deathBox).find('tr').each(function(i,e){
                    if($(e).css('display') != 'none' && $(e).attr('familytreetop') != 'null' ){
                        d++;
                    }
                });
                $($marrBox).find('tr').each(function(i,e){
                    if($(e).css('display') != 'none' && (e).attr('familytreetop') != 'null' ){
                        m++;
                    }
                });
                if(args.active){
                    if(b != 0) $($birthBox).find('[familytreetop="null"]').remove();
                    if(d != 0) $($deathBox).find('[familytreetop="null"]').remove();
                    if(m != 0) $($marrBox).find('[familytreetop="null"]').remove();
                } else{
                    if(b == 0) $fn.setNull($birthBox);
                    if(d == 0) $fn.setNull($deathBox);
                    if(m == 0) $fn.setNull($marrBox);
                }
            }
            return true;
        }
    }

    $this.init = function(events, languages){
        $languages = languages;
        var birth = events.BIRT, death = events.DEAT, marr = events.MARR;
        if("undefined" !== typeof(birth)){
            $fn.setEvents($birthBox, birth, 'birth');
        } else {
            $fn.setNull($birthBox);
        }
        if("undefined" !== typeof(death)){
            $fn.setEvents($deathBox, death, 'death');
        }else {
            $fn.setNull($deathBox);
        }
        if("undefined" !== typeof(marr)){
            $fn.setEvents($marrBox, marr, 'marr');
        }else {
            $fn.setNull($marrBox);
        }
        $fn.setFamilyLine();
        $this.mod('familyline').resp($fn.onFamilyLine);
    }
});