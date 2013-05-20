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
            $fn.setPopovers();
        },
        setAllMonths: function(){
            var box = $($parent).find('[familytreetop="all"]'),
                cont = $(box).find('.span12'),
                data = $this.mod('usertree').getAllMonthsEvents(),
                prop,
                subbox,
                month,
                key,
                item,
                tr,
                user,
                family,
                husb,
                wife;

            $(box).find('[familytreetop="subbox"]:not([_example])').remove();
            $($parent).find('[familytreetop="birthdays"]').hide();
            $($parent).find('[familytreetop="anniversary"]').hide();
            $($parent).find('[familytreetop="weremember"]').hide();

            for(prop in data){
                if(!data.hasOwnProperty(prop) || prop == 0) continue;
                subbox = $(box).find('[_example]').clone();
                $(subbox).removeAttr('_example');
                $(subbox).find('[familytreetop="subbox-header"] span').text($('#months').find('[data-familytreetop="'+prop+'"]').text());

                month = data[prop];

                for(key in month){
                    if(!month.hasOwnProperty(key)) continue;
                    item = month[key];
                    tr = $('<tr></tr>');
                    $(tr).append('<td><div class="familytreetop-this-month-data">'+item.date.start_day || ""+'</div></td>');
                    $(tr).append('<td><i class="icon-gift"></i></td>');
                    if(item.event.gedcom_id != null){
                        user = $this.mod('usertree').user(item.event.gedcom_id);
                        $(tr).append('<td data-familytreetop-color="'+user.gender+'">'+user.name()+'</td>');
                        $(tr).append('<td></td>');
                        $(tr).append('<td>'+user.relation+'</td>');

                    } else if(item.event.family_id != null){
                        family = $this.mod('usertree').family(item.event.family_id);
                        husb = $this.mod('usertree').user(family.husb);
                        wife = $this.mod('usertree').user(family.wife);
                        $(tr).append('<td><div data-familytreetop-color="'+husb.gender+'">'+husb.name()+'</div><div data-familytreetop-color="'+wife.gender+'">'+wife.name()+'</div></td>');
                        $(tr).append('<td></td>');
                        $(tr).append('<td><div>'+husb.relation+'</div><div>'+wife.relation+'</div></td>');
                    }
                    $(subbox).find('table').append(tr);
                }

                $(cont).append(subbox);
                $(subbox).show();
            }

            console.log(data);

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
                        var tr = $('<tr style="cursor:pointer;"></re>'),
                            event = $this.mod('usertree').getEvent(e.id),
                            user = $this.mod('usertree').user(e.gedcom_id),
                            sb = $this.stringBuffer(),
                            html;

                        sb._('<td style="width:24px;"><div class="familytreetop-this-month-data">')._(event.date.start_day || "")._('</div></td>');
                        sb._(' ');
                        sb._('<td data-familytreetop-color="')._(user.gender)._('"');
                        sb._(' gedcom_id="')._(user.gedcom_id)._('">')._(user.shortname());
                        sb._('</td>');

                        html = $(sb.ret());

                        $(tr).append(html);
                        $(table).append(tr);
                    });
                    break;

                case "anniversary":
                    data[type].forEach(function(e){
                        var tr = $('<tr style="cursor:pointer;"></tr>'),
                            event = $this.mod('usertree').getEvent(e.id),
                            family = $this.mod('usertree').family(e.family_id),
                            husb = $this.mod('usertree').user(family.husb),
                            wife = $this.mod('usertree').user(family.wife),
                            sb = $this.stringBuffer(),
                            html;

                        if(!husb || !wife) return false;

                        sb._('<td style="width:24px;"><div class="familytreetop-this-month-data">')._(event.date.start_day || "")._('</div></td>');
                        sb._(' ');
                        sb._('<td>');
                        sb._('<span data-familytreetop-color="')._(husb.gender)._('"');
                        sb._('" gedcom_id="')._(husb.gedcom_id)._('">')._(husb.shortname());
                        sb._('</span>');
                        sb._(' + ');
                        sb._('<span data-familytreetop-color="')._(wife.gender)._('"');
                        sb._(' gedcom_id="')._(wife.gedcom_id)._('">')._(wife.shortname());
                        sb._('</span>');
                        sb._('</td>');

                        html = $(sb.ret());

                        $(tr).append(html);
                        $(table).append(tr);

                    });
                    break;

            }
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
