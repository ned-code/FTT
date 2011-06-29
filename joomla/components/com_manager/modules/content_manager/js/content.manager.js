function ContentManager(obj){
	obj = jQuery('#'+obj);
	//vars
        var div;

	// create parent div
	var parent_div = document.createElement('div');	
	jQuery(obj).append(parent_div);

	//create div element
	div = document.createElement('div');
	jQuery(div).attr('id', 'content_manager_div')
	jQuery(parent_div).append(div);
	//ajax get content page        
        ContentManager.prototype._ajax('getContentPages', null, function(req){
        	var xml, rows;
		xml = req.responseXML;
		if(xml.childNodes[0].nodeName=="xml")
			rows = xml.childNodes[1].childNodes;
		else
			rows = xml.childNodes[0].childNodes;
		ContentManager.prototype._construct(div.id);		
		for(var i=0;i<rows.length;i++){
			var id, title, layoutType;
			id = jQuery(rows[i].childNodes[0]).text();
			title = jQuery(rows[i].childNodes[1]).text();
			layoutType = jQuery(rows[i].childNodes[2]).text();
			ContentManager.prototype.addRow({
				index:id,
				name:title,
				layoutType:layoutType
			});
		}
	});
	jQuery(document.body).append(jQuery('<iframe id="iframe" style="display:none;" name="iframe:content_manager">'));
	_CONTENT_MANAGER = this;
}

ContentManager.prototype = {
	_construct:function(obj){
		var self = this
		if(typeof(obj) != 'object') obj = document.getElementById(obj);
		
		this.div = jQuery('<div class="cmBody"></div>');
		jQuery(obj).append(this.div);
		
		this.obj = obj;
		this.table = {};
		this.iconTable = {};
		this.tr = {};
		this.tr.index = 0;
		this.tr.count = 0;
		
		//create table
		this.table = document.createElement('table');
		this.table.cellPadding = "1";
		this.table.cellSpacing = "1";
		this.table.border = "1";
			this.tr[0] = this.table.insertRow(0);
			this.tr[0].header = true;
				this.tr[0][0] = this.tr[0].insertCell(0);
				this.tr[0][0].innerHTML = 'Page';
				this.tr[0][1] = this.tr[0].insertCell(1);
				this.tr[0][1].innerHTML = 'Icon';
				this.tr[0][2] = this.tr[0].insertCell(2);
				this.tr[0][2].innerHTML = 'Name';
				this.tr[0][3] = this.tr[0].insertCell(3);
				this.tr[0][3].innerHTML = 'Layout';
				this.tr[0][4] = this.tr[0].insertCell(4);
				this.tr[0][4].innerHTML = 'Who Can See This';
				this.tr[0][5] = this.tr[0].insertCell(5);
				this.tr[0][5].innerHTML = 'Actions';
		jQuery(this.div).append(this.table);
		
		this.input = document.createElement('input');
		jQuery(this.input).attr('type', 'submit');
		jQuery(this.input).val('Add Page');
		jQuery(this.input).insertBefore(this.div);
		
		//handler click(add new page, ajax)
		jQuery(this.input).click(function(){
			var page_name = prompt("Enter the page name", "");
			if(page_name == null || page_name.length ==  0) return;
			var tr = self.addRow({
				name:page_name,
				layoutType:'double'
			});
			self._ajax('createPage',page_name,function(req){
				var id = jQuery.trim(req.responseText);
				tr.index = id;
				var dhxTree = storage.obj.dhxTree;
				for(k in dhxTree._idpull){
					if(dhxTree._idpull[k].label == 'Content manager'){
						dhxTree.insertNewChild(k, 'content_manager:'+id, page_name,0,0,0,0,"");
					}
				}
			})
			
			
		});
	},
	_ajax:function(func, params, callback){
		host.callMethod("content_manager", "ContentManager", func, params, function(req){
				callback(req);
		})
	},
	_createTable:function(rows, cells){
		var table = document.createElement('table');
		for(var row =0; row < rows; row++){
			var tr = table.insertRow(row);
			for(var cell =0; cell < cells; cell++){
				var td = tr.insertCell(cell);
			}
		}
		return table;
	},
	_setIndex:function(rowId, index){
		if(!index) return;
		this.tr[rowId].index = index;
	},
	_setPageN:function(rowId){
		jQuery(this.tr[rowId][0]).css('padding', '0 0 0 10px');
		jQuery(this.tr[rowId][0]).html(rowId)
	},
	_setName:function(rowId, name){
		if(!name){ name = 'no title'; }
		var self = this;
		var div = document.createElement('div');
		jQuery(div).addClass('cmPageName');
		div.innerHTML = name;
		jQuery(this.tr[rowId][2]).append(div);
		jQuery(div).click(function(){
			var page_name = prompt("Enter the page name", "");
			if(page_name == null || page_name.length ==  0) return;
			var id = self.tr[rowId].index;
			this.innerHTML = page_name;
			self._ajax('changePageName',id+';'+page_name, function(){});
		})
	},
	_setLayoutType:function(rowId, layoutType){
		if(!layoutType){ layoutType = 'double'; }
		var self = this;
		var div = this._div(rowId, 3);		
 		//new LayoutManipulator(this, rowId, layoutType);
	},
	_setWCST:function(rowId, select){
		var td = this.tr[rowId][4];
		html_string = '';
		html_string += '<select>';
			html_string += '<option>Visitor</option>';
			html_string += '<option>Guest</option>';
			html_string += '<option>Family Friend</option>';
			html_string += '<option>Family Member</option>';
			html_string += '<option>Tree Manager</option>';
			html_string += '<option>Admin</option>';
			html_string += '</select>';
		td.innerHTML = html_string;
	},
	_setActionType:function(rowId, lock){
		if(!lock){ lock = false; }
		var div = this._div(rowId, 5);
		new ActionManipulator(this, rowId, lock)
	},
	_div:function(rowId, cellId){
		var self = this;
		this.tr[rowId][cellId].div = document.createElement('div');
		var div = this.tr[rowId][cellId].div;
		//this.tr[rowId][cellId].appendChild(div);
		jQuery(this.tr[rowId][cellId]).append(div);
		return div;		
	},
	addRow:function(params){
		if(!params) params = {};
		var self = this;
		this.tr.index++;
		this.tr.count++;
		//create row
		var i = this.tr.index;
		this.tr[i] = this.table.insertRow(this.tr.count);
		for(var ni=0;ni<6;ni++){
			this.tr[i][ni] = this.tr[i].insertCell(ni);
		}		
		//set params
		this._setIndex(i, params.index);
		this._setPageN(i);
		this._setName(i, params.name);
		this._setLayoutType(i, params.layoutType);
		this._setWCST(i, params.select);
		this._setActionType(i, params.actions);
		
		return this.tr[i];
	},
	up:function(obj){	
		if(obj.parentTr.previousSibling.header) return;
		jQuery(obj.parentTr).insertBefore(obj.parentTr.previousSibling);
	},
	down:function(obj){
		jQuery(obj.parentTr).insertAfter(obj.parentTr.nextSibling);
	},
	close:function(obj){
		jQuery(obj.parentTr).remove();
		this.tr.count--;
		var id = obj.parentTr.index
		this._ajax('deleteRow', id, function(){});
		storage.obj.dhxTree.deleteItem('content_manager:'+id, true);
	}

}
