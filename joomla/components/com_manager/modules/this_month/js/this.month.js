function JMBThisMonthObject(obj){
	//vars 
	this.obj = obj;
	this.json = null;
	this.content = { table:null, birth:null, death:null, marr:null };
	this.b_count = 0;
	
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
		host.callMethod("this_month", "JMBThisMonth", func, params, function(req){
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
		return jQuery('<table><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table><div class="empty" style="display:none;"><div class="text">No events to show for this month</div><div class="button"><span>How do i add events?</span></div></div>');
	},
	_createEventTableView:function(id, type, title){
		return jQuery(['<div id="',id,'"><div class="jmb-this-month-view ',type,'">',title,'</div><div class="jmb-this-month-content"><table></table></div></div>'].join(''));
	},
	_createBody:function(json){
		var self = this;
		var c = self.content;
		var lang = json.language;
		c.table = self._createTableView();
		c.birth = self._createEventTableView('jmb-this-month-birth', 'birthday', lang.BIRTHDAYS+':');
		c.death = self._createEventTableView('jmb-this-month-death', 'deceased', lang.REMEMBER+':');
		c.marr = self._createEventTableView('jmb-this-month-marr', 'marriage', lang.ANNIVERSARIES+':');
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
				if(!json.members[e.gid]) return;
				var	ind_key = e.gid,
					members = json.members,
					data = members[ind_key],
					birth = data.user.birth,
					date = (birth!=null)?birth.date:null,
					gender = data.user.gender,
					color = json.config.colors[gender],
					append;
					
				self.b_count++;
				if(data.user.death!=null) return;
				
				append = sb._('<tr><td><div class="date">')
						._((date!=null)?date[0]:'')._('</div></td><td><div class="img-')
						._(gender)._('">&nbsp;</div></td><td><div id="')
						._(ind_key)._('" class="person ')
						._(gender)._('"><font color="')
						._(color)._('">')
						._(self._getFullName(data.user))._('</font> (turns ')
						._(self._getTurns(date))._(')</div></td></tr>').result();
				sb.clear();
				jQuery(view).append(append);
			});
			if(self.b_count==0){
				var howdo = self.json.language['HOWDO'].replace('%%',self.json.language['BIRTHDAYS']+' ').split('.');	
				self._setMessage(view, 'howToDo.html','#jmb-this-month-birth', ['<div class="message">',howdo[0],'<font color="#b6bad9">',howdo[1],'</font></div>'].join(''));
			}
		} else {
			var howdo = self.json.language['HOWDO'].replace('%%',self.json.language['BIRTHDAYS']+' ').split('.');	
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
				if(!json.members[e.gid]) return;
				var	ind_key = e.gid,
					members = json.members,
					data = members[ind_key],
					death = data.user.death,
					date = (death!=null)?death.date:null,
					gender = data.user.gender,
					color = json.config.colors[gender],
					append;
				
				append = sb._('<tr><td><div class="date">')
					._((date!=null)?date[0]:'')._('</div></td><td><div class="img-')
					._(gender)._('">&nbsp;</div></td><td><div id="')
					._(ind_key)._('" class="person"><font color="')
					._(color)._('">')
					._(self._getFullName(data.user))._('</font> (')
					._(self._getTurns(date))._(' years ago)</div></td></tr>').result();
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
		if(events.m!=null&&events.m.length!=0){
			var m = events.m;
			jQuery(m).each(function(i,e){
				if(!json.members[e.husb]||!json.members[e.wife]) return;
				var	fam_key = e.id,
					members = json.members,
					data = members[fam_key],
					family = self._getFamilyInfo(e, members),
					date = family.event.date,
					append;

				append = sb._('<tr><td><div class="date">')
					._((date!=null)?date[0]:'')
					._('</div></td><td><div class="anniversaries-start">&nbsp</div></td><td><div id="')
					._(family.husb.user.gedcom_id)._('" class="person"><font color="')
					._(json.config.colors[family.husb.user.gender])._('">')
					._(self._getFullName(family.husb.user))._('</font></div><div id="')
					._(family.wife.user.gedcom_id)._('" class="person"><font color="')
					._(json.config.colors[family.wife.user.gender])._('">')
					._(self._getFullName(family.wife.user))._('</font></div></td><td><div class="anniversaries-end">&nbsp;</div></td><td><div>(')
					._(self._getTurns(date))._(' years ago)</div></td></tr>').result();
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
		var render = null;
		var settings = ['{"month":"',month,'","sort":"',sort,'","render":"',render,'"}'].join('');
		this._ajax("load", settings, function(req){
			var json = jQuery.parseJSON(req.responseText);
			self.json = json;
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
	render:function(json, callback){
		var self = this;
		var table = self._createBody(json);
		jQuery(self.table).find('.jmb-this-month-body').append(table);
		//set documents
		self._setHEAD(json);
		if(json.events.b.length!=0||json.events.d.length!=0||json.events.m!=null){
			if(json.settings.event.birthdays == 'true') self._setBIRTH(table, json);
			if(json.settings.event.deaths == 'true') self._setDEATH(table, json);
			if(json.settings.event.anniversaries == 'true') self._setMARR(table,  json);
		} else {
			self._setNull(table);
		}

		//events
		jQuery(table).find('.jmb-this-month-content .person font').each(function(i,e){
			storage.tooltip.render('view', {
				object:self.json.members[jQuery(e).parent().attr('id')],
				target:jQuery(e).parent()
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

