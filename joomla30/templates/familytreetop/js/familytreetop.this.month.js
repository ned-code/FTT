$FamilyTreeTop.create("this_month", function($){
    'use strict';

    var $this = this,
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
                birthdays:$fn.getEventByType('BIRT', month),
                anniversary:$fn.getEventByType('MARR', month),
                weremember:$fn.getEventByType('DEAT', month)
            }
        },
        render: function(month){
            if(month == 0){
                $fn.setAllMonths();
            } else {
                $data = $fn.getData(month);
                $fn.setEvents($data, 'birthdays');
                $fn.setEvents($data, 'weremember');
                $fn.setEvents($data, 'anniversary');
            }
            $fn.setFamilyLine();
            $fn.setPopovers();
        },
        setAllMonths: function(){
            var box = $($parent).find('[familytreetop="all"]'),
                table = $(box).find('table'),
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
            $($parent).find('[familytreetop="birthdays"]').hide();
            $($parent).find('[familytreetop="anniversary"]').hide();
            $($parent).find('[familytreetop="weremember"]').hide();

            for(prop in data){
                if(!data.hasOwnProperty(prop) || prop == 0) continue;
                month = data[prop];
                tr = $('<tr familytreetop-row ><td style="text-align: center; background: #c3c3c3;" colspan="5">'+($('#months').find('[data-familytreetop="'+prop+'"]').text())+'</td></tr>');
                $(table).append(tr);

                for(key in month){
                    if(!month.hasOwnProperty(key)) continue;
                    item = month[key];
                    tr = $('<tr class="familytreetop-hover-effect" familytreetop-row></tr>');
                    $(tr).append('<td>'+(item.date.start_day || "")+'</td>');
                    $(tr).append('<td><i class="icon-gift"></i></td>');
                    if(item.event.gedcom_id != null){
                        user = $this.mod('usertree').user(item.event.gedcom_id);
                        $(tr).attr('gedcom_id', user.gedcom_id);
                        $(tr).append('<td gedcom_id="'+user.gedcom_id+'">'+user.name()+'</td>');
                        $(tr).append('<td style="font-size: 12px;color:#b7b7b7;">'+user.turns()+'</td>');
                        $(tr).append('<td>'+user.relation+'</td>');
                        $this.mod('popovers').render({
                            target: $(tr).find('td[gedcom_id]')
                        });
                    } else if(item.event.family_id != null){
                        family = $this.mod('usertree').family(item.event.family_id);
                        husb = $this.mod('usertree').user(family.husb);
                        wife = $this.mod('usertree').user(family.wife);
                        $(tr).attr('gedcom_id', "family:" + husb.gedcom_id + "," + wife.gedcom_id);
                        $(tr).append('<td><div gedcom_id="'+husb.gedcom_id+'">'+husb.name()+'</div><div gedcom_id="'+wife.gedcom_id+'">'+wife.name()+'</div></td>');
                        $(tr).append('<td style="font-size: 12px;color:#b7b7b7;"><div>'+husb.turns()+'</div><div>'+wife.turns()+'</div></td>');
                        $(tr).append('<td><div>'+husb.relation+'</div><div>'+wife.relation+'</div></td>');

                        $(tr).find('div[gedcom_id]').each(function(i, el){
                            $this.mod('popovers').render({
                                target: el
                            });
                        });
                    }
                    $(table).append(tr);
                }
            }
            $(box).show();
        },
        setEvents: function(data, type){
            var parent =  $($parent).find('[familytreetop="'+type+'"]'), table = $(parent).find('table');
            if(!data[type] || data[type].length == 0){
                $(parent).hide();
                return false;
            } else {
                $(parent.show());
            }
            $($parent).find('[familytreetop="all"]').hide();
            $(table).html('');
            $(parent).find('li span[gedcom_id]').unbind();
            $(parent).find('li').remove();
            switch(type){
                case "birthdays":
                case "weremember":
                    data[type].forEach(function(e){
                        var tr = $('<tr class="familytreetop-hover-effect" gedcom_id="'+e.gedcom_id+'" style="cursor:pointer;"></re>'),
                            event = $this.mod('usertree').getEvent(e.id),
                            user = $this.mod('usertree').user(e.gedcom_id),
                            avatar = user.avatar(["25","25"]),
                            sb = $this.stringBuffer(),
                            div,
                            txt,
                            html;

                        sb._('<td style="width:24px;"><div class="familytreetop-this-month-data">')._(event.date.start_day || "")._('</div></td>');
                        sb._(' ');
                        sb._('<td');
                        sb._(' gedcom_id="')._(user.gedcom_id)._('"><div data-familytreetop-color="')._(user.gender)._('">');
                            sb._(user.shortname());
                        sb._('</div>');
                        sb._('<div><i class="icon-leaf"></i>')._(user.relation)._('</div>')
                        sb._('</td>');
                        sb._('<td style="font-size: 12px;color:#b7b7b7;">')._((type=="birthdays")?user.turns():user.died())._('</td>');

                        html = $(sb.ret());

                        if($this.mod('usertree').isAvatar(avatar[0])){
                            div = $(html).find('[data-familytreetop-color]');
                            txt = $(div).text();
                            $(div).text('');
                            $(div).append(avatar);
                            $(div).append(" "+txt);
                        }

                        $(tr).append(html);
                        $(table).append(tr);

                        $this.mod('popovers').render({
                            target: $(tr).find('td[gedcom_id]')
                        });
                    });
                    break;

                case "anniversary":
                    data[type].forEach(function(e){
                        var tr = $('<tr class="familytreetop-hover-effect" style="cursor:pointer;"></tr>'),
                            event = $this.mod('usertree').getEvent(e.id),
                            family = $this.mod('usertree').family(e.family_id),
                            husb = $this.mod('usertree').user(family.husb),
                            wife = $this.mod('usertree').user(family.wife),
                            av = {
                                husb:husb.avatar(["25","25"]),
                                wife:wife.avatar(["25","25"])
                            },
                            sb = $this.stringBuffer(),
                            html;

                        if(!husb || !wife) return false;

                        $(tr).attr('gedcom_id', "family:" + husb.gedcom_id + "," + wife.gedcom_id);

                        sb._('<td style="width:24px;"><div class="familytreetop-this-month-data">')._(event.date.start_day || "")._('</div></td>');
                        sb._(' ');
                        sb._('<td><ul class="unstyled inline">');
                            sb._('<li><span');
                                sb._('" gedcom_id="')._(husb.gedcom_id)._('"><div familytreetop-el="husb" data-familytreetop-color="')._(husb.gender)._('">')._(husb.shortname())._('</div><div><i class="icon-leaf"></i>')._(husb.relation)._('</div>');
                            sb._('</span></li>');
                                sb._('<li>+</li>');
                            sb._('<li><span');
                                sb._(' gedcom_id="')._(wife.gedcom_id)._('"><div familytreetop-el="wife" data-familytreetop-color="')._(wife.gender)._('">')._(wife.shortname())._('</div><div><i class="icon-leaf"></i>')._(wife.relation)._('</div>');
                            sb._('</span></li>');
                        sb._('</ul></td>');
                        sb._('<td style="font-size: 12px;color:#b7b7b7;">')._(family.married())._('</td>');

                        html = $(sb.ret());

                        $(html).find('[familytreetop-el]').each(function(index, element){
                            var avatar = av[$(this).attr('familytreetop-el')], text;
                            if($this.mod('usertree').isAvatar(avatar[0])){
                                text = $(element).text();
                                $(element).text('');
                                $(element).append(avatar);
                                $(element).append(text);
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
                var month = $(this).find('option:selected').val();
                $fn.render(month);
            });
        }
    }

    $this.init = function(month){
        $month = month;
        $parent = $('#thisMonth');
        $fn.setMonthSelectChange($parent);
        $fn.render($month);
    }

});
