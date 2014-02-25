$FamilyTreeTop.create("form", function($){
    'use strict';
    var $this = this,
        $fn;

    $fn = {
        getDaysInMonth:function(month, year) {
            var monthDays = [
                [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            ];
            if (month<1 || month>12) return 0;
            return monthDays[((year%4==0) && ((year%100!=0) || (year%400==0)))?1:0][month-1];
        }
    }

    $this.input = {
        get:function(name, title, value){
            var row = $('<div class="row-fluid"></div>'),
                span = $('<div class="span12"></div>'),
                label = $('<label><small></small></label>'),
                input = $('<div><input class="span12" type="text" placeholder=""></div>');

            $(label).attr('for', name);
            $(label).find('small').text(title);
            $(input).find('input').attr('placeholder', title).attr('id', name).attr('name', name).val(value || "");
            $(span).append(label).append(input);
            $(row).append(span);
            return row;
        }
    }

    $this.select = {
        get:function(name, title, options, selected){
            var row = $('<div class="row-fluid"></div>'),
                span = $('<div class="span12"></div>'),
                label = $('<label><small></small></label>'),
                select = $('<select></select>');

            $(select).attr('id', name).attr('name', name);
            var option;
            switch(typeof(options)){
                case "number":
                    for(var i = 0; i < options; i++){
                        option = $('<options value="'+i+'">'+i+'</options>');
                        if("undefined" !== typeof(selected) && i == selected){
                            $(option).attr('selected', 'selected');
                        }
                        $(select).append(option);
                    }
                    break;

                case "object":
                    if(options instanceof Array){
                        options.forEach(function(element, index){
                            option = $('<options value="'+index+'">'+element+'</options>');
                            if("undefined" !== typeof(selected) && element == selected){
                                $(option).attr('selected', 'selected');
                            }
                            $(select).append(option);
                        });
                    } else {
                        for(var prop in options){
                            if(!options.hasOwnProperty(prop)) continue;
                            option = $('<options value="'+prop+'">'+options[prop]+'</options>');
                            if("undefined" !== typeof(selected) && options[prop] == selected){
                                $(option).attr('selected', 'selected');
                            }
                            $(select).append(option);
                        }
                    }
                    break;
            }
            if(title.length > 0){
                $(label).attr('for', name);
                $(label).find('small').text(title);
                $(span).append(label)
            }
            $(span).append(select);
            $(row).append(span);
            return row;
        },
        days: function(month, year){
            var sb, length;

            if("undefined" === typeof(month) || month == 0 ){
                month = 1;
            }
            if("undefined" === typeof(year) || year.length == 0){
                year = 4;
            }

            sb = $this.stringBuffer();
            length = $fn.getDaysInMonth(month, year);
            for(var i = 1 ; i <= length; i++){
                sb._('<option value="')._(i)._('">')._(i)._('</option>');
            }
            return sb.ret();
        }
    }
});
