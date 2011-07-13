function JMBThisMonth(obj){
	obj = jQuery('#'+obj);
	//vars 
	this.obj = obj;
	this.json = null;
	this.content = { table:null, birth:null, death:null, marr:null };
	
	//objects
	this.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	this.table = jQuery('<table width="100%"><tr><td><div class="jmb-this-month-header"></div></td></tr><tr><td><div class="jmb-this-month-body"></div></td></tr></table>');
	this.profile = new JMBProfile();
	
	//appends
	jQuery(obj).append(this.table);
	
	//workspace
	var self = this;
	self.load(this._getThisMonth(), 'false', function(json){
		self.render(json);
	});
	
	storage.addEvent(storage.tabs.clickPull, function(object){
		self.profile.cleaner();
	});
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
			return f+" "+m+" "+l;
		}
		else if(f!=''&&m==''&&l!=''){
			return f+" "+l;
		}
		else if(f==''&&m==''&&l!=''){
			return l;
		}
		else if(f==''&&m!=''&&l==''){
			return f;
		}
	},
	_getTurns:function(event){
		var year = event.Year;
		var n_year = (new Date()).getFullYear()
		return (n_year-year);
	},
	_cn:function(n){
		return (n[0]='0')?n[1]:n;
	},
	_createTableView:function(){
		return jQuery('<table><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>');
	},
	_createEventTableView:function(id, title){
		return jQuery('<div id="'+id+'"><div class="jmb-this-month-view">'+title+'</div><div class="jmb-this-month-content"><table></table></div></div>');
	},
	_createBody:function(){
		var self = this;
		var c = self.content;
		c.table = self._createTableView();
		c.birth = self._createEventTableView('jmb-this-month-birth', 'Birthdays:');
		c.death = self._createEventTableView('jmb-this-month-death', 'We remember:');
		c.marr = self._createEventTableView('jmb-this-month-marr', 'Anniversaries:');
		jQuery(c.table[0].rows[0].cells[0]).append(c.birth);
		jQuery(c.table[0].rows[2].cells[0]).append(c.death);
		jQuery(c.table[0].rows[1].cells[0]).append(c.marr);
		return c.table;
	},
	_createMonthsSelect:function(json){
		var sb = host.stringBuffer();
		for(var i=0;i<12;i++){
			sb._('<option ')._((i==json.settings.opt.month-1)?'selected':'')._(' value="')._(i+1)._('">')._(this.months[i])._('</option>')
		}
		return sb.result();
	},
	_createSortSelect:function(json){
		var date = json.settings.opt.date;
		var sb = host.stringBuffer();
		var sort_date = json.settings.split_event.year;
		var sort_type = json.settings.split_event.type;
		if(date < sort_date && sort_type == '-1'){
			return sb._('<option value="1">After ')._(sort_date)._('</option><option selected value="-1">Before ')._(sort_date)._('</option><option value="0">All Years</option>').result();
		} else if(date < sort_date && sort_type == '0'){
			return sb._('<option value="1">After ')._(sort_date)._('</option><option value="-1">Before ')._(sort_date)._('</option><option selected value="0">All Years</option>').result();
		} else if(date < sort_date && sort_type == '1'){
			return sb._('<option selected value="1">After ')._(sort_date)._('</option><option value="-1">Before ')._(sort_date)._('</option><option value="0">All Years</option>').result();
		} else if(date > sort_date && sort_type == '-1'){
			return sb._('<option selected value="-1">Before ')._(sort_date)._('</option><option value="0">All Years</option>').result();
		} else if(date > sort_date && sort_type == '0'){
			return sb._('<option selected value="0">All Years</option>').result();
		} else if(date > sort_date && sort_type == '1'){
			return sb._('<option value="0">All Years</option>').result();
		}
	},
	_setHEAD:function(json){
		var header = jQuery(this.table).find('.jmb-this-month-header');
		var sb = host.stringBuffer();
		sb._('<span>Special Days in</span>: <select name="months">')._(this._createMonthsSelect(json))._('</select> <select name="sort">')._(this._createSortSelect(json))._('</select>');
		jQuery(header).append(sb.result());
	},
	_setBIRTH:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-birth table');
		var sb = host.stringBuffer();
		var events = json.events;
		if(events.b){
			var b = events.b;
			for(var key in b){
				if(!b[key].death && typeof(key) != 'undefined' ){
					var gender = (json.descedants[key].indiv.Gender=='M')?'male':'female';
					var color = json.colors[json.descedants[key].indiv.Gender];
					var append = sb._('<tr><td><div class="date">')._(b[key].event.Day)._('</div></td><td><div class="img-')._(gender)._('">&nbsp;</div></td><td><div id="')._(key)._('" class="person ')._(gender)._('"><font color="')._(color)._('">')._(self._getFullName(json, key))._('</font> (turns ')._(self._getTurns(b[key].event))._(')</div></td></tr>').result();
					sb.clear();
					jQuery(view).append(append);
				} 
			}
		} else {
			self._setMessage(view, 'howToDo.html','#jmb-this-month-birth', '<div class="message">There are currently no "birthdays" associated with this month. <font color="#b6bad9">How do i add some?</font></div>');
		}
	},
	_setDEATH:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-death table');
		var events = json.events;
		var sb = host.stringBuffer();
		if(events.d){
			var d = events.d;
			for(var key in d){
				if(typeof(key) != 'undefined' ){
					var gender = (json.descedants[key].indiv.Gender=='M')?'male':'female';
					var color = json.colors[json.descedants[key].indiv.Gender];
					var append = sb._('<tr><td><div class="date">')._(d[key].event.Day)._('</div></td><td><div class="img-')._(gender)._('">&nbsp;</div></td><td><div id="')._(key)._('" class="person"><font color="')._(color)._('">')._(self._getFullName(json, key))._('</font> (turns ')._(self._getTurns(json.descedants[key].indiv.Birth))._(')</div></td></tr>').result();
					sb.clear();
					jQuery(view).append(append);
				} 
			}
		} else {
			self._setMessage(view, 'howToDo.html','#jmb-this-month-death', '<div class="message">There are currently no "we remember" associated with this month. <font color="#b6bad9">How do i add some?</font></div>');
		}
	},
	_setMARR:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-marr table');
		var events = json.events;
		var sb = host.stringBuffer();
		if(events.u){
			var u = events.u;
			for(var key in u){
				if(typeof(key)!='undefined'){
					var sircar = {
						id:u[key].sircar,
						color:json.colors[json.descedants[u[key].sircar].indiv.Gender],
						name:self._getFullName(json, u[key].sircar)
					}
					var spouse = {
						id:u[key].spouse,
						color:json.colors[json.descedants[u[key].spouse].indiv.Gender],
						name:self._getFullName(json, u[key].spouse)
					}
					var append = sb._('<tr><td><div class="date">')._(u[key].event.Day)._('</div></td><td><div class="anniversaries-start">&nbsp</div></td><td><div id="')._(sircar.id)._('" class="person"><font color="')._(sircar.color)._('">')._(sircar.name)._('</font></div><div id="')._(spouse.id)._('" class="person"><font color="')._(spouse.color)._('">')._(spouse.name)._('</font></div></td><td><div class="anniversaries-end">&nbsp;</div></td><td><div>(')._(self._getTurns(u[key].event))._(' years ago)</div></td></tr>').result();
					sb.clear();
					jQuery(view).append(append);
				}
			}
		} else {
			self._setMessage(view, 'howToDo.html','#jmb-this-month-marr', '<div class="message">There are currently no "anniversaries" associated with this month. <font color="#b6bad9">How do i add some?</font></div>');
		}
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
		var settings = month+';'+sort;
		this._ajax("load", settings, function(req){
			var json = jQuery.parseJSON(req.responseText);
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
	render:function(json){
		var self = this;
		var table = self._createBody();
		jQuery(self.table).find('.jmb-this-month-body').append(table);
		//set documents
		self._setHEAD(json);
		if(json.settings.event.birthdays == 'true') self._setBIRTH(table, json);
		if(json.settings.event.deaths == 'true') self._setDEATH(table, json);
		if(json.settings.event.anniversaries == 'true') self._setMARR(table,  json);
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

