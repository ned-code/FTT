/*
function ThisMonth(obj){
	obj = jQuery('#'+obj);
	//vars
	var self = this;
	this.tipsytooltip = {};
	this.table = {};
	this.select = {};
	this.obj = obj;
	this.header = false;
	this.body = false;
	this.date = new Date();
	this.sort = false;
	this.json = {};
	this.profile = new JMBProfile();

	//create table
	this.table = this._setTable(2,1);
	jQuery(this.table).css("width","100%");
	jQuery(obj).append(this.table);
	
	//render
	this._render();
	this._setResizeHeaderHandler();
}

ThisMonth.prototype = {
	_setResizeHeaderHandler:function(){
		var obj = this.obj;
		jQuery(window).resize(function() {
			var w = jQuery(obj).width() - 2;
			jQuery(obj).find('.tm-header').width();
			jQuery(obj).find('.tm-header-container').css('margin-left',(w/2-70)+"px");
		});
	},
	_setTable:function(row,cell){
		var table = document.createElement('table');
		for(var x=0;x<row;x++){
			 var tr = table.insertRow(x)
			for(var y=0;y<cell;y++){
				var td = tr.insertCell(y);
			}
		}
		return table;
	},
	_getParams:function(){
		var d = this.date;
		return d.getMonth();
	},	
	_checkObject:function(div){
		if(this.body) jQuery(this.body).remove();
		if(this.header) jQuery(this.header).remove();
		this.body = jQuery(div).find('.tm-body');
		this.header = jQuery(div).find('.tm-header');
	},
	_render:function(){	
		var self = this;
		var obj = this.obj;
		var params = this._getParams();
		if(this.sort) params += '|'+this.sort;
		this._ajax("render", params, function(req){
			var json = jQuery.parseJSON(req.responseText);
			self.json = json;
			var div = document.createElement('div');
			jQuery(div).html(json.html);
			//check header and body object
			self._checkObject(div);
			//append
			jQuery(self.table.rows[0].cells[0]).append(self.header);
			jQuery(self.table.rows[1].cells[0]).append(self.body);
			
			//resize header
			var w = jQuery(obj).width() - 2;
			jQuery(obj).find('.tm-header').width();
			jQuery(obj).find('.tm-header-container').css('margin-left',(w/2-70)+"px");
			
			//events
			self._miniprofile();
			jQuery('.tm-header-prew').click(function(){
				self._count(-1);
			})
			jQuery('.tm-header-next').click(function(e){
				self._count(1);
			})
			jQuery('.tm-header-split-select').change(function(){
				self._sort(jQuery(this).val())
			});
		});
	},
	_miniprofile:function(){
		var self = this;
		var json = this.json;
		jQuery('.tm-person').each(function(i,e){
			self.profile.tooltip.render({
				target: jQuery(e),
				type: 'mini',
				data: self.json.desc[jQuery(e).attr('id')],
				imgPath:self.json.path,
				fmbUser:self.json.fmbUser,
				eventType:'mouseenter'
			});
		})
	},
	_sort:function(s){
		this.sort = s;
		this._render(); 
	},
	_count:function(n){
		//this.tipsytooltip.hide();
		this.date.addMonths(n);
		this._render(); 
	},
	_ajax:function(func, params, callback){
		host.callMethod("this_month", "ThisMonth", func, params, function(req){
				callback(req);
		})
	}
};

Date.prototype.addMonths= function(m) {
  var d = this.getDate();
  this.setMonth(this.getMonth() + m);

  if (this.getDate() < d)
    this.setDate(0);
};
*/
function JMBThisMonth(obj){
	obj = jQuery('#'+obj);
	//vars 
	this.obj = obj;
	this.json = null;
	this.content = { table:null, birth:null, death:null, marr:null };
	
	//objects
	this.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	this.thisMonth = this._getThisMonth();
	this.table = jQuery('<table width="100%"><tr><td><div class="jmb-this-month-header"></div></td></tr><tr><td><div class="jmb-this-month-body"></div></td></tr></table>');
	this.profile = new JMBProfile();
	
	//appends
	jQuery(obj).append(this.table);
	
	//workspace
	var self = this;
	self.load(self.thisMonth, 'false', function(json){
		self.render(json);
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
	_createMonthsSelect:function(){
		var html = '';
		for(var i=0;i<12;i++){
			html += '<option '+((i==this.thisMonth-1)?'selected':'')+' value="'+(i+1)+'">'+this.months[i]+'</option>';
		}
		return html;
	},
	_setHEAD:function(){
		var header = jQuery(this.table).find('.jmb-this-month-header');
		var html = '<span>Special Days in</span>: <select>'+this._createMonthsSelect()+'</select> <select><option value="1">After 1900</option></select>';
		jQuery(header).append(html);
	},
	_setBIRTH:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-birth table');
		var events = json.events;
		if(events.b){
			var b = events.b;
			for(var key in b){
				if(!b[key].death && typeof(key) != 'undefined' ){
					var gender = (json.descedants[key].indiv.Gender=='M')?'male':'female';
					var color = json.colors[json.descedants[key].indiv.Gender];
					jQuery(view).append('<tr><td><div class="date">'+b[key].event.Day+'</div></td><td><div class="img-'+gender+'">&nbsp;</div></td><td><div id="'+key+'" class="person '+gender+'"><font color="'+color+'">'+self._getFullName(json, key)+'</font> (turns '+self._getTurns(b[key].event)+')</div></td></tr>');
				} 
			}
		} else {
			var message = jQuery('<div class="message">There are currently no "birthdays" associated with this month. <font color="#b6bad9">How do i add some?</font></div>');
			jQuery(view).remove();
			jQuery('.jmb-this-month-body').find('#jmb-this-month-birth').find('.jmb-this-month-content').append(message);
		}
	},
	_setDEATH:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-death table');
		var events = json.events;
		if(events.b){
			var d = events.d;
			for(var key in d){
				if(typeof(key) != 'undefined' ){
					var gender = (json.descedants[key].indiv.Gender=='M')?'male':'female';
					var color = json.colors[json.descedants[key].indiv.Gender];
					jQuery(view).append('<tr><td><div class="date">'+d[key].event.Day+'</div></td><td><div class="img-'+gender+'">&nbsp;</div></td><td><div id="'+key+'" class="person"><font color="'+color+'">'+self._getFullName(json, key)+'</font> (turns '+self._getTurns(json.descedants[key].indiv.Birth)+')</div></td></tr>');
				} 
			}
		} else {
			var message = jQuery('<div class="message">There are currently no "we remember" associated with this month. <font color="#b6bad9">How do i add some?</font></div>');
			jQuery(view).remove();
			jQuery('.jmb-this-month-body').find('#jmb-this-month-birth').find('.jmb-this-month-content').append(message);
		}
	},
	_setMARR:function(table, json){
		var self = this;
		var view = jQuery('.jmb-this-month-body').find('#jmb-this-month-marr table');
		var events = json.events;
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
					jQuery(view).append('<tr><td><div class="date">'+u[key].event.Day+'</div></td><td><div class="anniversaries-start">&nbsp</div></td><td><div id="'+sircar.id+'" class="person"><font color="'+sircar.color+'">'+sircar.name+'</font></div><div id="'+spouse.id+'" class="person"><font color="'+spouse.color+'">'+spouse.name+'</font></div></td><td><div class="anniversaries-end">&nbsp;</div></td><td><div>('+self._getTurns(u[key].event)+' years ago)</div></td></tr>');
				}
			}
		} else {
			var message = jQuery('<div class="message">There are currently no "anniversaries" associated with this month. <font color="#b6bad9">How do i add some?</font></div>');
			jQuery(view).remove();
			jQuery('.jmb-this-month-body').find('#jmb-this-month-birth').find('.jmb-this-month-content').append(message);
		}
	},
	load:function(month, sort, callback){
		var settings = month+';'+sort;
		this._ajax("load", settings, function(req){
			var json = jQuery.parseJSON(req.responseText);
			callback(json);
		});
	},
	render:function(json){
		var self = this;
		var table = self._createBody();
		jQuery(self.table).find('.jmb-this-month-body').append(table);
		//set documents
		self._setHEAD();
		self._setBIRTH(table, json);
		self._setDEATH(table, json);
		self._setMARR(table,  json);
		//events
		jQuery(table).find('.jmb-this-month-content .person font').each(function(i,e){
			jQuery(e).click(function(){
				self.profile.tooltip.render({
					target:jQuery(e).parent(),
					type:'mini',
					data:json.descedants[jQuery(e).parent().attr('id')],
					imgPath:json.path,
					fmbUser:json.fmbUser,
					eventType:'click'
				});	
			});
		});
	}
}

