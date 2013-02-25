function ActionManipulator(parent, rowId, lock){
	//objects	
	this.obj = parent.tr[rowId][5].div;
	this.parent = parent;
	this.parentTr = parent.tr[rowId];
	
	//vars
	this.table = {};
	this.tr = {};
	this.td = {};
	this.div = {};
	
	//create table structure
	this.table = document.createElement('table');
	this.table.cellPadding = "0";
	this.table.cellSpacing = "0";
		this.tr[0] = this.table.insertRow(0);
			this.td[0] = this.tr[0].insertCell(0);
			this.td[1] = this.tr[0].insertCell(1);
			this.td[2] = this.tr[0].insertCell(2);
	//this.obj.appendChild(this.table);	
	jQuery(this.obj).append(this.table);
	
	
	//craete div element in td
	if(lock){
		this.div[0] = this._div(this.td[0],'lock', 'aManipulatorImg aManipulatorLock');
 	}
 	else {
 		this.div[0] = this._div(this.td[0],'unlock', 'aManipulatorImg aManipulatorUnLock');	
 	}
	this.div[1] = this._div(this.td[1],'up', 'aManipulatorImg aManipulatorUp');
	this.div[2] = this._div(this.td[1],'down', 'aManipulatorImg aManipulatorDown');
	this.div[3] = this._div(this.td[2],'close', 'aManipulatorImg aManipulatorClose');
	//return object
	return this;
}

ActionManipulator.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("content_manager", "ContentManager", func, params, function(req){
				callback(req);
		})
	},
	_div:function(parent, elemType, className){
		var self = this;
		var div = document.createElement('div');
		if(elemType == "up" || elemType == "down") { jQuery(div).css('float', 'left'); };
		div.elemType = elemType;
		//parent.appendChild(div);
		jQuery(parent).append(div);
		jQuery(div).addClass(className);
		jQuery(div).click(function(){
			self._click(elemType);
		});
		return div;
	},
	
	_click:function(elemType){
		var self = this;
		switch(elemType){
			case "lock":
				this.div[0].elemType ='unlock';
				this.div[0].className = 'aManipulatorImg aManipulatorUnLock';	
				jQuery(this.div[0]).unbind('click');
				jQuery(this.div[0]).click(function(){
					self._click('unlock');
				});
				
			break;
			
			case "unlock":
				this.div[0].elemType = 'lock';
				this.div[0].className = 'aManipulatorImg aManipulatorLock';	
				jQuery(this.div[0]).unbind('click');
				jQuery(this.div[0]).click(function(){
					self._click('lock');
				});
			break;
			
			case "up":
				this.parent.up(this);
			break;
			
			case "down":
				this.parent.down(this);
			break;
			
			case "close":
				this.parent.close(this);
			break;
		}
	}
}
