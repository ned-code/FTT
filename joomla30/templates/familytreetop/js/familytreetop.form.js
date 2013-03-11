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

    $this.select = {
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
