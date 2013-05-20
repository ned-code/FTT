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
            $($parent).find('[familytreetop="birthdays"]').hide();
            $($parent).find('[familytreetop="anniversary"]').hide();
            $($parent).find('[familytreetop="weremember"]').hide();

            var box = $($parent).find('[familytreetop="all"]');
            var data = $this.mod('usertree').getAllMonthsEvents();
            $(box).html('');


            console.log(data);
        },
        setEvents: function(data, type){
            var parent =  $($parent).find('[familytreetop="'+type+'"]'), table = $(parent).find('table');
            if(!data[type] || data[type].length == 0){
                $(parent).hide();
                return false;
            } else {
                $(parent.show());
            }
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
