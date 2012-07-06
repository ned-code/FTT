function LayoutManipulator(parent, rowId, type){
	this.parent = parent;
	this.obj = parent.tr[rowId][3].div;

	var obj = this.obj
	jQuery(obj).addClass('lManipulator');
	/**
	* create table structure
	*/
	this.table = {};
	var table = this.table;
	this.tr = {}
	var tr = this.tr;
	this.td = {}
	var td = this.td;
	this.div = {};
	var div = this.div;
	table = document.createElement('table');
	table.cellPadding = "0";
	table.cellSpacing = "1";
		tr[0] = table.insertRow(0);
			td[0] = tr[0].insertCell(0);
			td[1] = tr[0].insertCell(1);
			td[2] = tr[0].insertCell(2);
		tr[1] = table.insertRow(1);
			td[3] = tr[1].insertCell(0);
			td[3].colSpan = "3";
			
	jQuery(obj).append(table);
	
	//create div
	div[0] = this._div(td[0], 'lManipulatorImg1', 'lManipulatorImg lManipulatorImg1', true);
	div[1] = this._div(td[1], 'lManipulatorImg2', 'lManipulatorImg lManipulatorImg2', true);
	div[2] = this._div(td[2], 'lManipulatorImg3', 'lManipulatorImg lManipulatorImg3', true);
	div[3] = this._div(td[3], 'lManipulatorParam', 'lManipulatorParam', false);
	
	
	switch(type){
		case "single":
			this._click(div[0], false);
		break;
		
		case "double":
			this._click(div[1], false);
		break;
		
		case "triple":
			this._click(div[2], false);
		break;
	}
	return this;
}
	
LayoutManipulator.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("content_manager", "ContentManager", func, params, function(req){
				callback(req);
		})
	},
	_div:function(parent, elemType, className, f){
		var self = this;
		var div = document.createElement('div');
		div.elemType = elemType;
		jQuery(div).addClass(className);
		jQuery(parent).append(div);
		if(f){
			jQuery(div).click(function(){
				self._click(this, true);
			});
		}
		return div;
	},
	_changeType:function(layoutType){
		var tr = this.obj.parentNode.parentNode;
		this._ajax('changeLayoutType', tr.index+';'+layoutType, function(){});
	},
	_click:function(div, change){
		var changeType;
		var obj = this.obj;
		if(obj.activeDiv){
			var o = obj.activeDiv;		
			switch(o.elemType){
				case "lManipulatorImg1":
					jQuery(o).removeClass('lManipulatorImgSelected1');
				break;	
				
				case "lManipulatorImg2":
					jQuery(o).removeClass('lManipulatorImgSelected2');
				break;	
				
				case "lManipulatorImg3": 
					jQuery(o).removeClass('lManipulatorImgSelected3');
				break;	
			}
		}
		
		switch(div.elemType){
			case "lManipulatorImg1": 
				jQuery(div).addClass('lManipulatorImgSelected1');
				jQuery(div[3]).text('100');
				changeType = 'single';
			break;	
			
			case "lManipulatorImg2":
				jQuery(div).addClass('lManipulatorImgSelected2');
				jQuery(div[3]).text('50-50');
				changeType = 'double';
			break;	
			
			case "lManipulatorImg3":
				jQuery(div).addClass('lManipulatorImgSelected3');
				jQuery(div[3]).text('30-30-30');
				changeType = 'triple';
			break;	
		}
		obj.activeDiv = div;
		if(!change) return;
		this._changeType(changeType);
	}
}
