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
        jQuery(h).css('background', getHeaderColor());
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
/*
function JMBThisMonthObject(obj){
	//vars 
	this.obj = obj;
	this.alias = jQuery(document.body).attr('_alias');
	this.loggedByFamous = parseInt(jQuery(document.body).attr('_type'));
	this.settings = {};
	this.json = {};
	this.content = { table:null, birth:null, death:null, marr:null };


    this.message = {
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
	
	//objects
	this.table = jQuery('<table cellpadding="0" cellspacing="0" width="100%"><tr><td><div class="jmb-this-month-header"></div></td></tr><tr><td><div class="jmb-this-month-body"></div></td></tr></table>');
	
	//appends
	jQuery(obj).append(this.table);
	
	//workspace
	var self = this;
	self.load(this._getThisMonth(), 'false', function(json){
		self.render(json, function(){
			storage.core.modulesPullObject.unset('JMBThisMonthObject');
		});
	});
	
	storage.family_line.bind('JMBThisMonthObject', function(res){
		jQuery(self.obj).find('div.person').each(function(i,el){
			var type = 'is_'+res._line+'_line';
			var id = jQuery(el).attr('id');
			var object = self.json.members[id];
			var user = object.user;
			switch(res._type){
				case "pencil":
					var font = jQuery(el).find('font');
					if(parseInt(user.is_father_line)&&parseInt(user.is_mother_line)){
						var opt = storage.family_line.get.opt();
						if(opt.mother.pencil&&opt.father.pencil){
							jQuery(font).addClass('jmb-familiy-line-bg');
						} else {
							jQuery(font).removeClass('jmb-familiy-line-bg');
							if(opt.mother.pencil||opt.father.pencil){
								if(opt[res._line].pencil){
									jQuery(font).css('background-color', opt[res._line].pencil);	
								} else {
									jQuery(font).css('background-color', (opt.mother.pencil)?opt.mother.pencil:opt.father.pencil);
								}
							} else {
								jQuery(font).css('background-color', 'white');	
							}
						}
					} else {
						if(parseInt(user[type])){
							jQuery(font).css('background-color', res._background);	
						}
					}
				break;
				
				case "eye":
					var element = jQuery(el).parents('tr').filter(':first');
					if(parseInt(user.is_father_line)&&parseInt(user.is_mother_line)){
						var opt = [res.opt.mother.eye, res.opt.father.eye];
						if(!opt[0]&&!opt[1]){
							jQuery(element).hide();
						} else if(opt[0]||opt[1]){
							jQuery(element).show();
						}
					} else {
						if(parseInt(user[type])){
							if(res._active){
								jQuery(element).show();
							} else {
								jQuery(element).hide();
							}
						}
					}
				break;
			}
		});
	});
}

JMBThisMonthObject.prototype = {
	_ajax:function(func, params, callback){
        storage.callMethod("this_month", "JMBThisMonth", func, params, function(req){
				callback(req);
		})
	},
	_getThisMonth:function(){
		return (new Date()).getMonth()+1;
	},
	_getFullName:function(user){
		return [user.first_name,user.middle_name,user.last_name].join(' ');
	},
	_getTurns:function(date){
		if(date==null) return '';
		return (new Date()).getFullYear() - date[2];
	},
	_getMarrEvent:function(family_key, husb, wife){
		if(husb.families.length!=0){
			for(var key in husb.families){
				if(key!='length'&&key==family_key){
					return husb.families[key].marriage;	
				}
			}
		}
		if(wife.families.length!=0){
			for(var key in wife.families){
				if(key!='length'&&key==family_key){
					return wife.families[key].marriage;	
				}
			}
		}
		return false;
	},
	_getFamilyInfo:function(e, members){
		var	module = this,
			sircar_key = e.husb,
			spouse_key = e.wife,
			family_key = e.id,
			husb = members[sircar_key],
			wife = members[spouse_key],
			event = module._getMarrEvent(family_key, husb, wife);
		return {
			husb:husb,
			wife:wife,
			event:event
		}	
			
	},
	_cn:function(n){
		return (n[0]='0')?n[1]:n;
	},
	_createTableView:function(){
		return jQuery('<table><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table><div class="empty" style="display:none;"></div>');
	},
	_createEventTableView:function(id, type, title){
		return jQuery(['<div id="',id,'"><div class="jmb-this-month-view ',type,'">',title,'</div><div class="jmb-this-month-content"><table></table></div></div>'].join(''));
	},
	_createBody:function(json){
		var self = this;
		var c = self.content;
        var message = this.message;
        var birthdays = message.FTT_MOD_THIS_MONTH_BIRTHDAYS;
        var remembers = message.FTT_MOD_THIS_MONTH_REMEMBER;
        var anniversaries = message.FTT_MOD_THIS_MONTH_ANNIVERSARIES;
		c.table = self._createTableView();
		c.birth = self._createEventTableView('jmb-this-month-birth', 'birthday', birthdays+':');
		c.death = self._createEventTableView('jmb-this-month-death', 'deceased', remembers+':');
		c.marr = self._createEventTableView('jmb-this-month-marr', 'marriage', anniversaries+':');
		jQuery(c.table[0].rows[0].cells[0]).append(c.birth);
		jQuery(c.table[0].rows[2].cells[0]).append(c.death);
		jQuery(c.table[0].rows[1].cells[0]).append(c.marr);
		return c.table;
	},
	_createMonthsSelect:function(json){
		var sb = storage.stringBuffer();
		var message = this.message;
		var monthNames = [  "JANUARY",
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
                            "DECEMBER"];
		for(var i=0;i<12;i++){
            var monthName = monthNames[i];
            var monthLanguageName = message['FTT_MOD_THIS_MONTH_'+monthName];
			sb._('<option ')
                sb._((i==json.settings.opt.month-1)?'selected':'');
                sb._(' value="')._(i+1)._('">');
                    sb._(monthLanguageName);
            sb._('</option>');
		}
		return sb.result();
	},
	_createSortSelect:function(json){
		var date = json.settings.opt.date;
		var sb = host.stringBuffer();
		var sort_date = json.settings.split_event.year;
		var sort_type = json.settings.split_event.type;
        var message = this.message;
        var option = (function(){
            return {
                after:function(selected){
                    sb._('<option ')._(selected?'selected':'')._(' value="1">')
                        sb._(message.FTT_MOD_THIS_MONTH_AFTER);
                        sb._(' ');
                        sb._(sort_date);
                    sb._('</option>');
                },
                before:function(selected){
                    sb._('<option ')._(selected?'selected':'')._(' value="-1">');
                        sb._(message.FTT_MOD_THIS_MONTH_BEFORE);
                        sb._(' ');
                        sb._(sort_date);
                    sb._('</option>');
                },
                all:function(selected){
                    sb._('<option ')._(selected?'selected':'')._(' value="0">');
                        sb._(message.FTT_MOD_THIS_MONTH_ALL_YEARS);
                        sb._(' ');
                    sb._('</option>');
                }
            }
        })();
        sb.clear();
		if(date < sort_date && sort_type == '-1'){
            return sb._(option.after())._(option.before(true))._(option.all()).result();
		} else if(date < sort_date && sort_type == '0'){
            return sb._(option.after())._(option.before())._(option.all(true)).result();
		} else if(date < sort_date && sort_type == '1'){
            return sb._(option.after(true))._(option.before())._(option.all()).result();
		} else if(date > sort_date && sort_type == '-1'){
            return sb._(option.before(true))._(option.all()).result();
		} else if(date > sort_date && sort_type == '0'){
            return sb._(option.all(true)).result();
		} else if(date > sort_date && sort_type == '1'){
            return sb._(option.all()).result();
		}
	},
	_setHEAD:function(json){
		var self = this;
		var header = jQuery(this.table).find('.jmb-this-month-header');
		var header_background_color = (self.loggedByFamous)?self.settings.colors.famous_header:self.settings.colors.family_header;
		jQuery(header).css('background', '#'+header_background_color);
		var sb = host.stringBuffer();
        var message = this.message;
		sb._('<span>')._(message.FTT_MOD_THIS_MONTH_HEADER)._('</span>: <select name="months">')._(this._createMonthsSelect(json))._('</select>');
		if(json.settings.opt.date<1900) sb._('<select name="sort">')._(this._createSortSelect(json))._('</select>');
		jQuery(header).append(sb.result());
	},
    _getHowDoText:function(type){
        var module = this,
            message = module.message;
        return message.FTT_MOD_THIS_MONTH_HOWDO.replace('%%', message[type]).split('.');
    },
	_setBIRTH:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-birth table');
		var sb = host.stringBuffer();
		var events = json.events;
		if(events.b&&events.b.length!=0){
			var b = events.b;
			jQuery(b).each(function(i,e){	
				if(!json.members[e.gid]) return;
				var	ind_key = e.gid,
					members = json.members,
					data = members[ind_key],
					birth = data.user.birth,
					date = (birth!=null)?birth.date:null,
					gender = data.user.gender,
					color = self.settings.colors[gender],
					append;

                append = sb._('<tr><td><div class="date">')
						._((date!=null&&date[0]!=null)?date[0]:'')._('</div></td><td><div class="img-')
						._(gender)._('">&nbsp;</div></td><td><div id="')
						._(ind_key)._('" class="person ')
						._(gender)._('"><font color="')
						._(color)._('">')
						._(self._getFullName(data.user))._('</font> (turns ')
						._(self._getTurns(date))._(')</div></td></tr>').result();
				sb.clear();
				jQuery(view).append(append);
			});
		} else {
            jQuery("#jmb-this-month-birth").remove();
            //var howdo = self._getHowDoText('FTT_MOD_THIS_MONTH_BIRTHDATS');
			//self._setMessage(view, 'howToDo.html','#jmb-this-month-birth', ['<div class="message">',howdo[0],'<font color="#b6bad9">',howdo[1],'</font></div>'].join(''));
		}
	},
	_setDEATH:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-death table');
		var events = json.events;
		var sb = host.stringBuffer();
		if(events.d&&events.d.length!=0){
			var d = events.d;
			jQuery(d).each(function(i,e){
				if(!json.members[e.gid]) return;
				var	ind_key = e.gid,
					members = json.members,
					data = members[ind_key],
					death = data.user.death,
					date = (death!=null)?death.date:null,
					gender = data.user.gender,
					color = self.settings.colors[gender],
					append;
				
				append = sb._('<tr><td><div class="date">')
					._((date!=null&&date[0]!=null)?date[0]:'')._('</div></td><td><div class="img-')
					._(gender)._('">&nbsp;</div></td><td><div id="')
					._(ind_key)._('" class="person"><font color="')
					._(color)._('">')
					._(self._getFullName(data.user))._('</font> (')
					._(self._getTurns(date))._(' years ago)</div></td></tr>').result();
				sb.clear();
				jQuery(view).append(append);
			});

		} else {
            jQuery('#jmb-this-month-death').remove();
            //var howdo = self._getHowDoText('FTT_MOD_THIS_MONTH_REMEMBER');
		    //self._setMessage(view, 'howToDo.html','#jmb-this-month-death', ['<div class="message">',howdo[0],'<font color="#b6bad9">',howdo[1],'</font></div>'].join(''));
		}
	},
	_setMARR:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-marr table');
		var events = json.events;
		var sb = host.stringBuffer();
		if(events.m!=null&&events.m.length!=0){
			var m = events.m;
			jQuery(m).each(function(i,e){
				if(!json.members[e.husb]||!json.members[e.wife]) return;
				var	members = json.members,
					family = self._getFamilyInfo(e, members),
					date = (family.event!=null&&family.event.date)?family.event.date:null,
					append;

				append = sb._('<tr><td><div class="date">')
					._((date!=null&&date[0]!=null)?date[0]:'')
					._('</div></td><td><div class="anniversaries-start">&nbsp</div></td><td><div id="')
					._(family.husb.user.gedcom_id)._('" class="person"><font color="')
					._(self.settings.colors[family.husb.user.gender])._('">')
					._(self._getFullName(family.husb.user))._('</font></div><div id="')
					._(family.wife.user.gedcom_id)._('" class="person"><font color="')
					._(self.settings.colors[family.wife.user.gender])._('">')
					._(self._getFullName(family.wife.user))._('</font></div></td><td><div class="anniversaries-end">&nbsp;</div></td><td><div>(')
					._(self._getTurns(date))._(' years ago)</div></td></tr>').result();
				sb.clear();
				jQuery(view).append(append);
				
			});
		} else {
            jQuery('#jmb-this-month-marr').remove();
            //var howdo = self._getHowDoText('FTT_MOD_THIS_MONTH_ANNIVERSARIES');
			//self._setMessage(view, 'howToDo.html','#jmb-this-month-marr', ['<div class="message">',howdo[0],'<font color="#b6bad9">',howdo[1],'</font></div>'].join(''));
		}
	},
	_setNull:function(table){
		var self = this;
		var empty = jQuery(table).parent().find('.empty')
		jQuery(table).hide();
		jQuery(empty).show();	
		jQuery(empty).text('There are no events on record for the this month.');
	},
	_setMessage:function(view, hCode, target, message){
		var mes = jQuery(message);
		jQuery(view).remove();
		jQuery('.jmb-this-month-body').find(target).find('.jmb-this-month-content').append(mes);
		jQuery(mes).find('font').click(function(){
			host.getHelpWindow('thismonthhowdoiaddsome');
		})
	},
	load:function(month, sort, callback){
		var module = this;
		var render = null;
		var settings = ['{"month":"',month,'","sort":"',sort,'","render":"',render,'"}'].join('');
		this._ajax("load", settings, function(req){
			//var json = jQuery.parseJSON(req.responseText);
            var json = storage.getJSON(req.responseText);
            module.json =  json;
            if(json.language){
                module.message = json.language;
            }
			module.json.members = storage.usertree.pull;
			module.settings = storage.settings;
			callback(json);
		});
	},
	reload:function(){
		var self = this;
		var header = jQuery(self.table).find('.jmb-this-month-header');
		var month = jQuery(header).find('select[name="months"]').val();
		var sort = jQuery(header).find('select[name="sort"]').val();
		self.load(month, sort, function(json){
			jQuery(header).html('');
			jQuery(self.content.table).remove();
			self.render(json);
		});
	},
    sort:function(events){
        var birth = events.b;
        var s_birth = [];
        if(birth.length!=0){
            for(var key in birth){
                var object = birth[key];
                var gedcom_id = object.gid;
                var userdata = storage.usertree.pull[gedcom_id];
                if(typeof(userdata) != 'undefined'){
                    var user = userdata.user;
                    if(user.death==null){
                        s_birth.push({"gid":gedcom_id});
                    }
                }
            }
        }
        events.b = s_birth;
        return events;
    },
	render:function(json, callback){
		var self = this;
		var table = self._createBody(json);
        json.events = self.sort(json.events);
		jQuery(self.table).find('.jmb-this-month-body').append(table);
		//set documents
		self._setHEAD(json);
		if(json.events.b.length!=0||json.events.d.length!=0||(json.events.m!=null&&json.events.m.length!=0)){
			if(json.settings.event.birthdays == 'true') self._setBIRTH(table, json);
			if(json.settings.event.deaths == 'true') self._setDEATH(table, json);
			if(json.settings.event.anniversaries == 'true') self._setMARR(table,  json);
		} else {
			self._setNull(table);
		}

		//events
		jQuery(table).find('.jmb-this-month-content .person font').each(function(i,e){
            var parent = jQuery(e).parent();
            var id = jQuery(parent).attr('id');
            var object = storage.usertree.pull[id];
            var facebook_id = object.user.facebook_id;
			storage.tooltip.render('view', {
				gedcom_id:id,
				target:parent
			});
		});
		jQuery(self.table).find('select[name="months"]').change(function(){
			self.reload();
		});
		jQuery(self.table).find('select[name="sort"]').change(function(){
			self.reload();
		});
		if(callback) callback();		
	}
}
*/
