function JMBThisMonthObject(obj){
    var module = this;

    module.parent = obj;
    module.msg = {
        FTT_MOD_THIS_MONTH_HEADER:"Special Days in",
        FTT_MOD_THIS_MONTH_BIRTHDAYS:"Birthdays",
        FTT_MOD_THIS_MONTH_ANNIVERSARIES:"Anniversaries",
        FTT_MOD_THIS_MONTH_REMEMBER:"We remember",
        FTT_MOD_THIS_MONTH_ALL_YEARS:"All Years",
        FTT_MOD_THIS_MONTH_BEFORE:"Before",
        FTT_MOD_THIS_MONTH_AFTER:"After",
        FTT_MOD_THIS_MONTH_HOWDO:"There are currently no %% associated with this month. How do i add some?",
        FTT_MOD_THIS_MONTH_JANUARY:"January",
        FTT_MOD_THIS_MONTH_FEBRUARY:"February",
        FTT_MOD_THIS_MONTH_MARCH:"March",
        FTT_MOD_THIS_MONTH_APRIL:"April",
        FTT_MOD_THIS_MONTH_MAY:"May",
        FTT_MOD_THIS_MONTH_JUNE:"June",
        FTT_MOD_THIS_MONTH_JULY:"July",
        FTT_MOD_THIS_MONTH_AUGUST:"August",
        FTT_MOD_THIS_MONTH_SEPTEMBER:"September",
        FTT_MOD_THIS_MONTH_OCTOBER:"October",
        FTT_MOD_THIS_MONTH_NOVEMBER:"November",
        FTT_MOD_THIS_MONTH_DECEMBER:"December"
    }

    module.tableString = '<table cellpadding="0" cellspacing="0" width="100%"><tr><td><div class="jmb-this-month-header"></div></td></tr><tr><td><div class="jmb-this-month-body"></div></td></tr></table>';

    module.table = false;
    module.data = false;
    module.earliestDate = false;

    module.month = false;
    module.sort = 1;
    module.separator = 1900

    init(getThisMonth());

    function ajax(method,args,callback){
        storage.callMethod("this_month", "JMBThisMonth", method, args, function(req){
            callback(module.data = storage.getJSON(req.responseText));
        })
    }
    function init(month){
        ajax("load", month, function(data){
            render(data);
        });
    }
    function render(data){
        setMsg(data.msg);
        setEarliestDateOfEvents()
        appendTable();
        setContent(getTableBody());
        setMonthSelectHandler();
        if(isSort()){
            setSortSelectHandler();
        }
        exit();
    }
    function reload(){
        getSelectMonth()
        clear();
        init(module.month);
    }
    function exit(){
        storage.core.modulesPullObject.unset('JMBThisMonthObject');
    }
    function clear(){
        jQuery(module.table).remove();
        jQuery(module.parent).html();
        module.table = false;
        module.data = false;
        module.earliestDate = false;
    }
    function appendTable(){
        jQuery(module.parent).append(getTable());
    }
    function eventExist(t){
        var e = module.data.events;
        if(e && typeof(e[t])!='undefined' && e[t] != null && e[t].length!=0){
            return e[t];
        }
        return false;
    }
    function memberExist(id){
        return typeof(storage.usertree.pull[id]) != 'undefined'
    }
    function isSort(){
        return module.separator > module.earliestDate;
    }
    function isMeetsTheRequirementsOf(year){
        if(!year) return false;
        if(isSort()){
            switch(module.sort){
                case 1: return year > module.separator;
                case 0: return true;
                case -1: return year < module.separator;
                default: return false;
            }
        }
        return true;
    }
    function setContent(t){
        setHeader(t);
        setBirthdays(t);
        setMarriages(t);
        setDeaths(t);
    }
    function setMonthSelectHandler(){
        jQuery(module.table).find('select[name="months"]').change(reload);
    }
    function setSortSelectHandler(){
        jQuery(module.table).find('select[name="sort"]').change(function(){
            module.sort = parseInt(jQuery(this).val());
            var data = module.data;
            clear();
            render(module.data = data);
        });
    }
    function setHeader(t){
        var header = jQuery(module.table).find('.jmb-this-month-header');
        setHeaderBackground(header);
        var sb = storage.stringBuffer();
        sb._('<span>');
            sb._(getMsg('HEADER'));
        sb._('</span>');
        sb._(getHeaderMonthSelect());
        if(isSort()){
            sb._(getHeaderSortSelect())
        }
        jQuery(header).append(sb.result());
    }
    function setHeaderBackground(h){
        //jQuery(h).css('background', getHeaderColor());
    }
    function setUserContent(t, type, selector){
        var el = jQuery('.jmb-this-month-body').find(selector+' table');
        var events;
        if(events = eventExist(type)){
            jQuery(events).each(function(i, data){
                if(!memberExist(data.gedcom_id)) return false;
                if(!isMeetsTheRequirementsOf(data.event_year)) return false;
                setUserTooltip(setUserEventContent(el, data, type));
            });
        } else {
            jQuery(selector).remove();
        }
    }
    function setUserEventContent(el, data, type){
        var user = getUserData(data.gedcom_id);
        var sb = storage.stringBuffer();
        sb._('<tr><td><div class="date">');
            sb._(getEventDate(getUserEvent(user, type)))._('</div></td><td><div class="img-');
            sb._(getUserData(user))._('">&nbsp;</div></td><td><div id="');
            sb._(getUserGedcomId(user))._('" class="person ');
            sb._(getUserGender(user))._('"><font color="');
            sb._(getColor(getUserGender(user)))._('">');
            sb._(getUserName(user))._('</font> (turns ');
            sb._(getEventTurns(getUserEvent(user, type)))._(')</div></td></tr>');
        var tr = jQuery(sb.result());
        jQuery(el).append(tr);
        return jQuery(tr).find('div.person');
    }
    function setUserTooltip(divs){
        jQuery(divs).each(function(i, target){
            var id = jQuery(target).attr('id');
            storage.tooltip.render('view', {
                gedcom_id:id,
                target:target
            });
        });
    }
    function setBirthdays(t){
        setUserContent(t, "birth", "#jmb-this-month-birth");
    }
    function setDeaths(t){
        setUserContent(t, "death", "#jmb-this-month-death");
    }
    function setMarriages(t){
        var el = jQuery('.jmb-this-month-body').find('#jmb-this-month-marr table');
        var events;
        if(events = eventExist('marriage')){
            jQuery(events).each(function(i, data){
                if(!memberExist(data.wife) || !memberExist(data.husb)) return false;
                var family = getFamilyData(data);
                if(!isMeetsTheRequirementsOf(getEventYear(family.event))) return false;
                setUserTooltip(setMarriageContent(el, family));
            });
        } else {
            jQuery('#jmb-this-month-marr').remove();
        }
    }
    function setMarriageContent(el, family){
        var sb = storage.stringBuffer();
        sb._('<tr><td><div class="date">');
            sb._(getEventDate(family.event));
            sb._('</div></td><td><div class="anniversaries-start">&nbsp</div></td><td><div id="');
            sb._(getUserGedcomId(family.husb))._('" class="person"><font color="');
            sb._(getColor(getUserGender(family.husb)))._('">');
            sb._(getUserName(family.husb))._('</font></div><div id="');
            sb._(getUserGedcomId(family.wife))._('" class="person"><font color="');
            sb._(getColor(getUserGender(family.wife)))._('">');
            sb._(getUserName(family.wife))._('</font></div></td><td><div class="anniversaries-end">&nbsp;</div></td><td><div>(');
            sb._(getEventTurns(family.event))._(' years ago)</div></td></tr>');
        var tr = jQuery(sb.result());
        jQuery(el).append(tr);
        return jQuery(tr).find('div.person');
    }
    function setMsg(msg){
        for(var key in module.msg){
            if(typeof(msg[key]) != 'undefined'){
                module.msg[key] = msg[key];
            }
        }
        return true;
    }
    function setContentInRow(settings){
        jQuery(getTableCellByRow(settings.table,settings.rowIndex)).append(getCurrentEventTableView(settings.id, settings.type, settings.title));
    }
    function setEarliestDateOfEvents(){
        var events = module.data.events;
        var date = 9999;
        for(var key in events){
            if(events.hasOwnProperty(key)){
                var earliestDate = getEarliestDateOfEvent(events[key]);
                if(date > earliestDate){
                    date = earliestDate;
                }
            }
        }
        return module.earliestDate = date;
    }
    function getMsg(n){
        var t = 'FTT_MOD_THIS_MONTH_'+n;
        if(typeof(module.msg[t]) != 'undefined'){
            return module.msg[t];
        }
        return '';
    }
    function getEarliestDateOfEvent(e){
        var date = 9999;
        for(var k in e){
            if(e.hasOwnProperty(k)){
                var d = e[k].event_year;
                if(date > d){
                    date = d;
                }
            }
        }
        return date;
    }
    function getFamilyData(data){
        var husb = getUserData(data.husb);
        var wife = getUserData(data.wife);
        var event = getMarriageEvent(data.id, husb, wife);
        return {
            husb:husb,
            wife:wife,
            event:event
        }
    }
    function getMarriageEvent(id, husb, wife){
        if(husb.families.length!=0){
            for(var key in husb.families){
                if(key!='length'&&key==id){
                    return husb.families[key].marriage;
                }
            }
        }
        if(wife.families.length!=0){
            for(var key in wife.families){
                if(key!='length'&&key==id){
                    return wife.families[key].marriage;
                }
            }
        }
        return false;
    }
    function getHeaderColor(){
        var colors = storage.settings.colors;
        var user = storage.usertree.user;
        if(parseInt(user.loginType)){
            return ['#',colors.famous_header].join('');
        } else {
            return ['#',colors.family_header].join('');
        }
    }
    function getColor(gender){
        var colors = storage.settings.colors;
        if(typeof(gender) != 'undefined'){
            return ['#',colors[gender]].join('');
        }
        return '';
    }
    function getUserData(id){
        return storage.usertree.pull[id];
    }
    function getUserName(data){
        return [data.user.first_name,data.user.middle_name,data.user.last_name].join(' ');
    }
    function getUserGedcomId(data){
        return data.user.gedcom_id;
    }
    function getUserGender(data){
        return data.user.gender;
    }
    function getUserEvent(data, type){
        return data.user[type];
    }
    function getEventYear(event){
        var date = event.date;
        return (date!=null&&date[2]!=null)?date[2]:false
    }
    function getEventDate(event){
        var date = event.date;
        return (date!=null&&date[0]!=null)?date[0]:''
    }
    function getEventTurns(event){
        if(event.date==null) return '';
        return (new Date()).getFullYear() - event.date[2];
    }
    function getHeaderMonthSelect(){
        var sb = storage.stringBuffer();
        var monthNames = getMonthNames();
        sb._('<select name="months">')
        for( var i = 0 ; i < 12 ; i++ ){
            sb._('<option ')._(getSelected(i))._(' value="')._(getMonthValue(i))._('" >');
                sb._(getMonthName(i, monthNames));
            sb._('</option>');
        }
        sb._('</select>');
        return sb.result();
        function isSelected(i){
            return i == module.month - 1;
        }
        function getMonthValue(i){
            return i+1;
        }
        function getSelected(i){
            if(isSelected(i)){
                return 'selected';
            }
            return '';
        }
        function getMonthNames(){
            return [
                "JANUARY",
                "FEBRUARY",
                "MARCH",
                "APRIL",
                "MAY",
                "JUNE",
                "JULY",
                "AUGUST",
                "SEPTEMBER",
                "OCTOBER",
                "NOVEMBER",
                "DECEMBER"
            ];
        }
        function getMonthName(i,n){
            return getMsg(n[i])
        }
    }
    function getHeaderSortSelect(){
        var sb = storage.stringBuffer();
        sb._('<select name="sort">');
            sb._('<option ')._(getSelected(1))._(' value="1">')._(getMsg('AFTER'))._(' ')._(module.separator)._('</option>');
            sb._('<option ')._(getSelected(0))._(' value="0">')._(getMsg('ALL_YEARS'))._('</option>');
            sb._('<option ')._(getSelected(-1))._(' value="-1">')._(getMsg('BEFORE'))._(' ')._(module.separator)._('</option>');
        sb._('</select>');
        return sb.result();
        function isSelect(n){
            if(module.sort == n){
                return true;
            }
            return false;
        }
        function getSelected(n){
            if(isSelect(n)){
                return 'selected';
            }
            return '';
        }
        return '';
    }
    function getTableBody(){
        var table = getTableView()[0];
        setContentInRow({
            table: table,
            rowIndex: 0,
            id: 'jmb-this-month-birth',
            type: 'birthday',
            title: getMsg('BIRTHDAYS')
        });
        setContentInRow({
            table: table,
            rowIndex: 1,
            id: 'jmb-this-month-marr',
            type: 'marriage',
            title: getMsg('ANNIVERSARIES')
        });
        setContentInRow({
            table: table,
            rowIndex: 2,
            id: 'jmb-this-month-death',
            type: 'deceased',
            title: getMsg('REMEMBER')
        });
        jQuery(module.table).find('.jmb-this-month-body').append(table);
        return table;
    }
    function getTableCellByRow(t, index){
        return t.rows[index].cells[0];
    }
    function getTableView(){
        return jQuery('<table><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table><div class="empty" style="display:none;"></div>');
    }
    function getCurrentEventTableView(id, type, title){
        return jQuery(['<div id="',id,'"><div class="jmb-this-month-view ',type,'">',title,'</div><div class="jmb-this-month-content"><table></table></div></div>'].join(''));
    }
    function getTable(){
        return module.table = jQuery(module.tableString);
    }
    function getThisMonth(){
        return module.month = ((new Date()).getMonth()+1);
    }
    function getSelectMonth(){
        return module.month = jQuery(module.table).find('select[name="months"]').val();
    }
}