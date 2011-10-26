function JMBThisMonth(obj){
	obj = jQuery('#'+obj);
	//vars 
	this.obj = obj;
	this.json = null;
	this.content = { table:null, birth:null, death:null, marr:null };
	this.b_count = 0;
	
	//objects
	this.table = jQuery('<table cellpadding="0" cellspacing="0" width="100%"><tr><td><div class="jmb-this-month-header"></div></td></tr><tr><td><div class="jmb-this-month-body"></div></td></tr></table>');
	this.profile = new JMBProfile();
	
	//appends
	jQuery(obj).append(this.table);
	
	//workspace
	var self = this;
	self.load(this._getThisMonth(), 'false', function(json){
		self.render(json);
		storage.addEvent(storage.header.clickPull, function(object){
			self.reload();
		});
	});
	
	storage.addEvent(storage.tabs.clickPull, function(object){
		self.profile.cleaner();
	});
	
	
	
	storage.header.famLine.show();
	storage.header.famLine.mode();	
}

JMBThisMonth.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("this_month", "JMBThisMonth", func, params, function(req){
				callback(req);
		})
	},
	_getThisMonth:function(){
		return (new Date()).getMonth()+1;
	},
	_getFullName:function(json, id){
		var user = json.descedants[id].indiv;
		var f,l,m, result;
		f = user.FirstName;
		m = user.MiddleName;
		l = user.LastName;
		if(f!=''&&m!=''&&l!=''){
			return [f,m,l].join(' ');
		}
		else if(f!=''&&m==''&&l!=''){
			return [f,l].join(' ')
		}
		else if(f==''&&m==''&&l!=''){
			return l;
		}
		else if(f==''&&m!=''&&l==''){
			return f;
		}
	},
	_getTurns:function(event){
		if(!event) return '';
		var year = event.From.Year;
		var n_year = (new Date()).getFullYear()
		return (n_year-year);
	},
	_getMarrEvent:function(data){
		for(var i=0;i<data.events.length;i++){
			if(data.events[i].Type=='MARR'){
				return data.events[i];
			}
		}
		return false;
	},
	_cn:function(n){
		return (n[0]='0')?n[1]:n;
	},
	_createTableView:function(){
		return jQuery('<table><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table><div class="empty" style="display:none;"><div class="text">No events to show for this month</div><div class="button"><span>How do i add events?</span></div></div>');
	},
	_createEventTableView:function(id, title){
		return jQuery(['<div id="',id,'"><div class="jmb-this-month-view">',title,'</div><div class="jmb-this-month-content"><table></table></div></div>'].join(''));
	},
	_createBody:function(json){
		var self = this;
		var c = self.content;
		var lang = json.language;
		c.table = self._createTableView();
		c.birth = self._createEventTableView('jmb-this-month-birth', lang.BIRTHDAYS+':');
		c.death = self._createEventTableView('jmb-this-month-death', lang.REMEMBER+':');
		c.marr = self._createEventTableView('jmb-this-month-marr', lang.ANNIVERSARIES+':');
		jQuery(c.table[0].rows[0].cells[0]).append(c.birth);
		jQuery(c.table[0].rows[2].cells[0]).append(c.death);
		jQuery(c.table[0].rows[1].cells[0]).append(c.marr);
		return c.table;
	},
	_createMonthsSelect:function(json){
		var sb = host.stringBuffer();
		var lang = this.json.language;
		var month_names = [ "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE","JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER" ];
		for(var i=0;i<12;i++){
			sb._('<option ')._((i==json.settings.opt.month-1)?'selected':'')._(' value="')._(i+1)._('">')._(lang[month_names[i]])._('</option>')
		}
		return sb.result();
	},
	_createSortSelect:function(json){
		var date = json.settings.opt.date;
		var sb = host.stringBuffer();
		var sort_date = json.settings.split_event.year;
		var sort_type = json.settings.split_event.type;
		var lang = json.language;
		if(date < sort_date && sort_type == '-1'){
			return sb._('<option value="1">')._(lang['AFTER'])._(' ')._(sort_date)._('</option><option selected value="-1">')._(lang['BEFORE'])._(' ')._(sort_date)._('</option><option value="0">')._(lang['ALLYEARS'])._(' ')._('</option>').result();
		} else if(date < sort_date && sort_type == '0'){
			return sb._('<option value="1">')._(lang['AFTER'])._(' ')._(sort_date)._('</option><option value="-1">')._(lang['BEFORE'])._(' ')._(sort_date)._('</option><option selected value="0">')._(lang['ALLYEARS'])._(' ')._('</option>').result();
		} else if(date < sort_date && sort_type == '1'){
			return sb._('<option selected value="1">')._(lang['AFTER'])._(' ')._(sort_date)._('</option><option value="-1">Before ')._(sort_date)._('</option><option value="0">')._(lang['ALLYEARS'])._(' ')._('</option>').result();
		} else if(date > sort_date && sort_type == '-1'){
			return sb._('<option selected value="-1">')._(lang['BEFORE'])._(' ')._(sort_date)._('</option><option value="0">')._(lang['ALLYEARS'])._(' ')._('</option>').result();
		} else if(date > sort_date && sort_type == '0'){
			return sb._('<option selected value="0">')._(lang['ALLYEARS'])._(' ')._('</option>').result();
		} else if(date > sort_date && sort_type == '1'){
			return sb._('<option value="0">')._(lang['ALLYEARS'])._(' ')._('</option>').result();
		}
	},
	_setHEAD:function(json){
		var header = jQuery(this.table).find('.jmb-this-month-header');
		var header_background_color = (json.config.login_type=='famous_family')?json.config.colors.famous_header:json.config.colors.family_header;
		jQuery(header).css('background', '#'+header_background_color);
		var sb = host.stringBuffer();
		sb._('<span>')._(json.language['HEADER'])._('</span>: <select name="months">')._(this._createMonthsSelect(json))._('</select>');
		if(json.settings.opt.date<1900) sb._('<select name="sort">')._(this._createSortSelect(json))._('</select>');
		jQuery(header).append(sb.result());
	},
	_setBIRTH:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-birth table');
		var sb = host.stringBuffer();
		var events = json.events;
		if(events.b&&events.b.length!=0){
			var b = events.b;
			jQuery(b).each(function(i,e){	
				var data, key, birth, gender, color, append;
				key = e.gid;	
				data = json.descedants[key];
				if(data.indiv.Death.length!=0) return;
				self.b_count++;
				birth = data.indiv.Birth[0];
				gender = (data.indiv.Gender=='M')?'male':'female';
				color = json.config.colors[data.indiv.Gender];
				append = sb._('<tr><td><div class="date">')._((birth.From.Day!=null)?birth.From.Day:'')._('</div></td><td><div class="img-')._(gender)._('">&nbsp;</div></td><td><div id="')._(key)._('" class="person ')._(gender)._('"><font color="')._(color)._('">')._(self._getFullName(json, key))._('</font> (turns ')._(self._getTurns(birth))._(')</div></td></tr>').result();
				sb.clear();
				jQuery(view).append(append);
			});
			if(self.b_count==0){
				var howdo = self.json.language['HOWDO'].replace('%%',self.json.language['BIRTHDAYS']+' ').split('.');	
				self._setMessage(view, 'howToDo.html','#jmb-this-month-birth', ['<div class="message">',howdo[0],'<font color="#b6bad9">',howdo[1],'</font></div>'].join(''));
			}
		} else {
			var howdo = self.json.language['HOWDO'].replace('%%',self.json.languagelanguage['BIRTHDAYS']+' ').split('.');	
			self._setMessage(view, 'howToDo.html','#jmb-this-month-birth', ['<div class="message">',howdo[0],'<font color="#b6bad9">',howdo[1],'</font></div>'].join(''));
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
				var data, key, death, gender, color, append;
				key = e.gid;
				data = json.descedants[key];
				death = data.indiv.Death[0];
				gender = (data.indiv.Gender=='M')?'male':'female';
				color = json.config.colors[data.indiv.Gender];
				append = sb._('<tr><td><div class="date">')._((death.From.Day!=null)?death.From.Day:'')._('</div></td><td><div class="img-')._(gender)._('">&nbsp;</div></td><td><div id="')._(key)._('" class="person"><font color="')._(color)._('">')._(self._getFullName(json, key))._('</font> (turns ')._(self._getTurns(data.indiv.Birth[0]))._(')</div></td></tr>').result();
				sb.clear();
				jQuery(view).append(append);
			});
			
		} else {
			var howdo = self.json.language['HOWDO'].replace('%%',self.json.language['REMEMBER']+' ').split('.');	
			self._setMessage(view, 'howToDo.html','#jmb-this-month-death', ['<div class="message">',howdo[0],'<font color="#b6bad9">',howdo[1],'</font></div>'].join(''));
		}
	},
	_setMARR:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-marr table');
		var events = json.events;
		var sb = host.stringBuffer();
		if(events.m&&events.m.length!=0){
			var m = events.m;
			jQuery(m).each(function(i,e){
				var key, sircar, spouse, event, append;
				sircar = {
					id:e.husb,
					color:json.config.colors[json.descedants[e.husb].indiv.Gender],
					name:self._getFullName(json, e.husb)
				}
				spouse = {
					id:e.wife,
					color:json.config.colors[json.descedants[e.wife].indiv.Gender],
					name:self._getFullName(json, e.wife)
				}	
				event = self._getMarrEvent((e.husb!=null)?json.descedants[e.husb]:json.descedants[e.wife]);
				append = sb._('<tr><td><div class="date">')._((event&&event.From&&event.From.Day)?event.From.Day:'')._('</div></td><td><div class="anniversaries-start">&nbsp</div></td><td><div id="')._(sircar.id)._('" class="person"><font color="')._(sircar.color)._('">')._(sircar.name)._('</font></div><div id="')._(spouse.id)._('" class="person"><font color="')._(spouse.color)._('">')._(spouse.name)._('</font></div></td><td><div class="anniversaries-end">&nbsp;</div></td><td><div>(')._(self._getTurns(event))._(' years ago)</div></td></tr>').result();
				sb.clear();
				jQuery(view).append(append);
			});
		} else {
			var howdo = self.json.language['HOWDO'].replace('%%',self.json.language['ANNIVERSARIES']+' ').split('.');	
			self._setMessage(view, 'howToDo.html','#jmb-this-month-marr', ['<div class="message">',howdo[0],'<font color="#b6bad9">',howdo[1],'</font></div>'].join(''));
		}
	},
	_setNull:function(table){
		var self = this;
		var empty = jQuery(table).parent().find('.empty')
		jQuery(table).hide();
		jQuery(empty).show();	
		jQuery(empty).find('div.button span').click(function(){
			host.getHelpWindow('thismonthhowdoiaddsome');
			return false;
		})
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
		var self = this;
		var render = jQuery(storage.header.activeButton).attr('id');
		var settings = ['{"month":"',month,'","sort":"',sort,'","render":"',render,'"}'].join('');
		this._ajax("load", settings, function(req){
			var json = jQuery.parseJSON(req.responseText);
			self.json = json;
			callback(json);
		});
	},
	reload:function(){
		var self = this;
		self.profile.cleaner();
		var header = jQuery(self.table).find('.jmb-this-month-header');
		var month = jQuery(header).find('select[name="months"]').val();
		var sort = jQuery(header).find('select[name="sort"]').val();
		self.load(month, sort, function(json){
			jQuery(header).html('');
			jQuery(self.content.table).remove();
			self.render(json);
		});
	},
	render:function(json){
		var self = this;
		var table = self._createBody(json);
		jQuery(self.table).find('.jmb-this-month-body').append(table);
		//set documents
		self._setHEAD(json);
		if(json.events.b.length!=0||json.events.m.length!=0||json.events.m.length!=0){
			if(json.settings.event.birthdays == 'true') self._setBIRTH(table, json);
			if(json.settings.event.deaths == 'true') self._setDEATH(table, json);
			if(json.settings.event.anniversaries == 'true') self._setMARR(table,  json);
		} else {
			self._setNull(table);
		}

		//events
		jQuery(table).find('.jmb-this-month-content .person font').each(function(i,e){
			jQuery(e).click(function(){
				self.profile.tooltip.cleaner();
				self.profile.tooltip.render({
					target:jQuery(e).parent(),
					id:jQuery(e).parent().attr('id'),
					type:'mini',
					data:json.descedants[jQuery(e).parent().attr('id')],
					imgPath:json.path,
					fmbUser:json.fmbUser,
					eventType:'click'
				});	
			});
		});
		jQuery(self.table).find('select[name="months"]').change(function(){
			self.reload();
		});
		jQuery(self.table).find('select[name="sort"]').change(function(){
			self.reload();
		});
	}
}

