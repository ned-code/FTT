$FamilyTreeTop.create("this_month", function($){
    'use strict';

    var $this = this,
        $languages,
        $month,
        $parent,
        $data,
        $fn;

    $fn = {
        getEventByType: function(type, month){
            return $this.mod('usertree').getEventsByType(type, function(event){
                if(type == "BIRT"){
                    var events = $this.mod('usertree').getUserEvents(event.gedcom_id);
                    if($this.isExist(events, '$.event.type', 'DEAT')){
                        return false;
                    }
                }
                return $this.mod('usertree').isDateInTheEvent(event.id, month, "start_month");
            });
        },
        getData: function(month){
            return {
                BIRT:$fn.getEventByType('BIRT', month),
                MARR:$fn.getEventByType('MARR', month),
                DEAT:$fn.getEventByType('DEAT', month)
            }
        },
        getEventIcon: function(event){
            switch(event.type){
                case "BIRT": return '<i class="fa fa-gift fa-2x"></i>';
                case "DEAT": return '<i class="fa fa-bookmark fa-2x"></i>';
                case "MARR": return '<i class="fa fa-heart fa-2x"></i>';
                default: return '<i class="fa fa-leaf fa-2x"></i>';
            }
        },
        getEventName: function(type){
           return ("undefined"!==typeof($languages[type]))?$languages[type]:type;
        },
        getNote: function(object, event){
            switch(event.type){
                case "BIRT": return object.turns();
                case "DEAT": return object.died();
                case "MARR": return object.married();
                default: return "";
            }
        },
        getDefaultMonth: function(month){
            var data = $fn.getData(month);
            if($fn.isEmpty(data)){
                return 0;
            } else {
                $data = data;
                return month;
            }
        },
        isEmpty: function(data){
            return "undefined" === typeof(data) || ("undefined" !== typeof(data) && data.BIRT.length == 0 && data.DEAT.length == 0 && data.MARR.length == 0);
        },
        render: function(month){
            if(month == 0){
                $fn.setAllMonths();
            } else {
                $data = $fn.getData(month);
                $fn.setEvents($data, 'BIRT');
                $fn.setEvents($data, 'DEAT');
                $fn.setEvents($data, 'MARR');
            }
            $fn.setFamilyLine();
            $fn.setPopovers();
        },
        setAllMonths: function(){
            var box = $($parent).find('[familytreetop="all"]'),
                table = $(box).find('table'),
                index = 0,
                data = $this.mod('usertree').getAllMonthsEvents(),
                prop,
                month,
                key,
                item,
                tr,
                user,
                family,
                husb,
                wife;

            $(table).find('[familytreetop-row]').remove();
            $($parent).find('[familytreetop="none"]').hide();
            $($parent).find('[familytreetop="all"]').hide();
            $($parent).find('[familytreetop="BIRT"]').hide();
            $($parent).find('[familytreetop="MARR"]').hide();
            $($parent).find('[familytreetop="DEAT"]').hide();

            $("#thisMonth").find('[familytreetop="months"]').find('option[value="0"]').attr('selected', 'selected');

            for(prop in data){
                if(!data.hasOwnProperty(prop) || prop == 0) continue;
                index++;
                month = data[prop];
                tr = $('<tr familytreetop-row ><td style="text-align: center; background: #c3c3c3;" colspan="5">'+($('#months').find('[data-familytreetop="'+prop+'"]').text())+'</td></tr>');
                $(table).append(tr);

                for(key in month){
                    if(!month.hasOwnProperty(key)) continue;
                    item = month[key];
                    tr = $('<tr class="familytreetop-hover-effect" familytreetop-row></tr>');
                    $(tr).append('<td style="text-align: center">'+(item.date.start_day || "")+'</td>');
                    $(tr).append('<td style="text-align: center">'+$fn.getEventIcon(item.event)+'</td>');
                    if(item.event.gedcom_id != null){
                        user = $this.mod('usertree').user(item.event.gedcom_id);
                        $(tr).attr('gedcom_id', user.gedcom_id);
                        $(tr).append('<td data-familytreetop-color="'+user.gender+'" gedcom_id="'+user.gedcom_id+'">'+user.name()+'</td>');
                        $(tr).append('<td style="font-size: 12px;color:#797979;">'+$fn.getNote(user, item.event)+'</td>');
                        $(tr).append('<td class="familytreetop-this-month-relation"><i class="fa fa-leaf"></i> '+user.relation+'</td>');
                        $this.mod('popovers').render({
                            target: $(tr).find('td[gedcom_id]')
                        });
                    } else if(item.event.family_id != null){
                        family = $this.mod('usertree').family(item.event.family_id);
                        husb = $this.mod('usertree').user(family.husb);
                        wife = $this.mod('usertree').user(family.wife);
                        $(tr).attr('gedcom_id', "family:" + husb.gedcom_id + "," + wife.gedcom_id);
                        $(tr).append('<td><div data-familytreetop-color="'+husb.gender+'" gedcom_id="'+husb.gedcom_id+'">'+husb.name()+'</div><div data-familytreetop-color="'+wife.gender+'" gedcom_id="'+wife.gedcom_id+'">'+wife.name()+'</div></td>');
                        $(tr).append('<td style="font-size: 12px;color:#797979;">'+$fn.getNote(family, item.event)+'</td>');
                        $(tr).append('<td class="familytreetop-this-month-relation"><div><i class="fa fa-leaf">&nbsp;</i>'+husb.relation+'</div><div><i class="fa fa-leaf"></i> '+wife.relation+'</div></td>');

                        $(tr).find('div[gedcom_id]').each(function(i, el){
                            $this.mod('popovers').render({
                                target: el
                            });
                        });
                    }
                    $(table).append(tr);
                }
            }
            if(index == 0){
                $($parent).find('[familytreetop="none"]').show();
            } else {
                $(box).show();
            }
        },
        setEvents: function(data, type){
            var parent =  $($parent).find('[familytreetop="'+type+'"]'),
                table = $(parent).find('table');

            $($parent).find('[familytreetop="none"]').hide();
            $($parent).find('[familytreetop="all"]').hide();
            $(table).html('');
            $(parent).find('li span[gedcom_id]').unbind();
            $(parent).find('li').remove();

            if($fn.isEmpty(data)){
                $($parent).find('[familytreetop="none"]').show();
                return false;
            } else {
                $(parent).show();
            }

            switch(type){
                case "BIRT":
                case "DEAT":
                    $(table).append('<tr class="familytreetop-this-month-header"><td style="padding-left: 20px;width:20px;">'+$fn.getEventIcon({type:type})+'</td><td colspan="2">'+$fn.getEventName(type)+'</td></tr>');
                    if(data[type].length == 0){
                        $(table).append('<tr><td colspan="3" style="text-align:center; padding: 20px;"><i class="fa fa-calendar-o muted" style="font-size:28px;color: #acacac;"></i> <span style="color: #acacac;">'+$languages['none']+'</span></td></tr>');
                    } else {
                        data[type].forEach(function(e){
                            var tr = $('<tr class="familytreetop-hover-effect" gedcom_id="'+e.gedcom_id+'" style="cursor:pointer;"></re>'),
                                event = $this.mod('usertree').getEvent(e.id),
                                user = $this.mod('usertree').user(e.gedcom_id),
                                avatar = user.avatar(["35","35"]),
                                sb = $this.stringBuffer(),
                                div,
                                html;

                            sb._('<td style="vertical-align: middle; text-align: center;width:35px;"><div class="familytreetop-this-month-data">')._(event.date.start_day || "")._('</div></td>');
                            sb._('<td>');
                                sb._('<table class="familytreetop-this-month-in">');
                                    sb._('<tr>');
                                        sb._('<td data-familytreetop-avatar></td>');
                                        sb._('<td><div gedcom_id="')._(user.gedcom_id)._('" data-familytreetop-color="')._(user.gender)._('">')._(user.shortname())._('</div><div class="familytreetop-this-month-relation"><i class="fa fa-leaf">&nbsp;</i> ')._(user.relation)._('</div></td>');
                                    sb._('</tr>');
                                sb._('</table>');
                            sb._('</td>');


                            sb._('</td>');
                            sb._('<td style="text-align: right; font-size: 12px;color:#797979; padding-right: 10px;">')._((type=="BIRT")?user.turns():user.died())._('</td>');

                            html = $(sb.ret());

                            if($this.mod('usertree').isAvatar(avatar[0])){
                                div = $(html).find('[data-familytreetop-avatar]');
                                $(div).append(avatar);
                            } else {
                                $(html).find('.familytreetop-this-month-in').css('margin-left', '-9px');
                            }

                            $(tr).append(html);
                            $(table).append(tr);

                            $this.mod('popovers').render({
                                target: $(tr).find('div[gedcom_id]')
                            });
                        });
                    }
                    break;

                case "MARR":
                    $(table).append('<tr class="familytreetop-this-month-header"><td style="padding-left:20px;width:20px;"><i class="fa fa-heart fa-2x"></i></td><td colspan="2">'+$fn.getEventName(type)+'</td></tr>');
                    if(data[type].length == 0){
                        $(table).append('<tr><td colspan="3" style="text-align:center; padding: 20px;"><i class="fa fa-calendar-o muted" style="font-size:28px;color: #acacac;"></i> <span style="color: #acacac;">'+$languages['none']+'</span></td></tr>');
                    } else {
                        data[type].forEach(function(e){
                            var tr = $('<tr class="familytreetop-hover-effect" style="cursor:pointer;"></tr>'),
                                event = $this.mod('usertree').getEvent(e.id),
                                family = $this.mod('usertree').family(e.family_id),
                                husb = $this.mod('usertree').user(family.husb),
                                wife = $this.mod('usertree').user(family.wife),
                                av = {
                                    husb:husb.avatar(["35","35"]),
                                    wife:wife.avatar(["35","35"])
                                },
                                sb = $this.stringBuffer(),
                                html;

                            if(!husb || !wife) return false;

                            $(tr).attr('gedcom_id', "family:" + husb.gedcom_id + "," + wife.gedcom_id);

                            sb._('<td style="vertical-align: middle;text-align: center; width:35px;"><div class="familytreetop-this-month-data">')._(event.date.start_day || "")._('</div></td>');
                            sb._('<td style="padding-left:10px;">');
                                sb._('<table class="familytreetop-this-month-in">');
                                    sb._('<tr>');
                                        sb._('<td familytreetop-el="husb"></td>');
                                        sb._('<td><span gedcom_id="')._(husb.gedcom_id)._('"><div data-familytreetop-color="')._(husb.gender)._('">')._(husb.shortname())._('</div><div class="familytreetop-this-month-relation"><i class="fa fa-leaf"> </i> ')._(husb.relation)._('</div></span></td>');
                                        sb._('<td style="line-height: 40px;">+</td>');
                                        sb._('<td familytreetop-el="wife"></td>');
                                        sb._('<td><span gedcom_id="')._(wife.gedcom_id)._('"><div data-familytreetop-color="')._(wife.gender)._('">')._(wife.shortname())._('</div><div class="familytreetop-this-month-relation"><i class="fa fa-leaf"></i>&nbsp;')._(wife.relation)._('</div></span></td>');
                                    sb._('</tr>');
                                sb._('</table>');
                            sb._('</td>');
                            sb._('<td style="text-align: right; font-size: 12px;color:#797979;padding-right: 10px;">')._(family.married())._('</td>');

                            html = $(sb.ret());

                            $(html).find('[familytreetop-el]').each(function(index, element){
                                var avatar = av[$(this).attr('familytreetop-el')], text;
                                if($this.mod('usertree').isAvatar(avatar[0])){
                                    $(element).append(avatar);
                                } else {
                                    $(html).find('.familytreetop-this-month-in').css('margin-left', '-9px');
                                }
                            });

                            $(tr).append(html);
                            $(table).append(tr);

                            $(tr).find('span[gedcom_id]').each(function(i,el){
                                $this.mod('popovers').render({
                                    target: el
                                });
                            });
                        });
                    }
                    break;

            }
        },
        setFamilyLine:function(){
            $($parent).find('tr[gedcom_id]').each(function(index, element){
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
        setPopovers:function(){
            $($parent).find('span[gedcom_id]').each(function(i,el){
                $this.mod('popovers').render({
                    target: el
                });
            });
        },
        setMonthSelectChange:function(p){
            $(p).find('[familytreetop="months"]').change(function(){
                $month = $(this).find('option:selected').val();
                $fn.render($month);
            });
        },
        setMonthSelectWidth:function(p){
            var select = $(p).find('[familytreetop="months"]'), size = 0, text, element, width;
            $(select).find('option').each(function(i,el){
                var t = $(el).text();
                if(t.length > size){
                    size = t.length;
                    element = el;
                    text = t;
                }
            });
            width = $this.mod('usertree').textWidth(text, "14px 'Helvetica Neue', Helvetica, Arial, sans-serif");
            $(select).css('width',(width+60)+'px');
        }
    }

    $this.init = function(month, lang){
        $languages = lang;
        $parent = $('#thisMonth');
        $fn.setMonthSelectChange($parent);
        $fn.setMonthSelectWidth($parent);
        $month = $fn.getDefaultMonth(month);
        $fn.render($month);
        $this.mod('usertree').trigger($month, $fn.render);
    }

});
