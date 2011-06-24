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



