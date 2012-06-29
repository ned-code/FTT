function OpenContentManager(obj){
    var module = this;
    module.init(obj);
}

OpenContentManager.prototype = {
	init:function(obj){
		//set object area
		this.parentObj = obj;
		this.table = {};
		this.tr = {};
		this.td = {};
		this.state = {
			maxCount:5
		};
		this.dhxForm = {};
		this.pageIndex  = '';
		this.pageName = '';
		this.pageLayoutType = '';
		
		//set vars
		var self, table, tr, td;
		table = this.table;
		tr = this.tr;
		td = this.td;

		//costruct table
		table = document.createElement('table');
		jQuery(table).css('width', '100%');
		table.border = '0';
		table.cellPadding = "0";
		table.cellSpacing = "0";
			tr[0] = table.insertRow(0);
				td[0] = tr[0].insertCell(0);
				td[1] = tr[0].insertCell(1);
				td[2] = tr[0].insertCell(2);
			tr[1] = table.insertRow(1);
				td[3] = tr[1].insertCell(0);
				td[3].colSpan = "3";
		
		jQuery(this.parentObj).append(table);
		
		//create header element
		this._selectPageSectionCreate(td[0]);
		this._editPageSectionCreate(td[1]);
		this._savePageSectionCreate(td[2]);
	
		jQuery(td[0]).css('width', '200px');
		jQuery(td[1]).css('width', '330px');
		jQuery(td[1]).find('table').css('margin-left', '50px');
		
		document.onselectstart = function () { return false; };
	},
	_ajax:function(func, params, callback){
        storage.callMethod("open_content_manager", "FTTOpenContentManagerClass", func, params, function(req){
				callback(req);
		});
	},
	_createTable:function(rows, cells){
		var table = document.createElement('table');
		for(var row=0; row<rows; row++){
			var tr = table.insertRow(row);
			for(var cell=0; cell<cells; cell++){
				var td = tr.insertCell(cell);
			}
		}
		return table;
	},
	_click:function(obj){
		if(jQuery(obj).parent().attr('class') == 'ui-dialog-content ui-widget-content ui-droppable') return;
		if(this.selectDiv){ 
			jQuery(this.selectDiv).css('background', 'white');
			delete this.selectDiv;
		}
		jQuery(obj).css('background', '#faffbf');
		//set div to storage
		this.selectDiv = obj;
	},
	_getArrayModulesInPage:function(){
		var array = new Array();
		if(typeof(this.state[this.pageIndex]) == 'undefined' ) return array;
		var snapshoot = this.state[this.pageIndex].storage[this.state[this.pageIndex].count];
		var ind = 0;
		for(var i=0; i<snapshoot.tdLength;i++){
			for(var ni=0; ni<snapshoot[i].divLength;ni++){
				array[ind] = snapshoot[i][ni];
				ind++;
			}
		}
		return array;
	},
	_createDivModule:function(parent, params){
		//vars
		var self = this;
		var id, title;
		//get params
		id = params['id'];
		title = params['title'];
		//creaete div;
		var div = document.createElement('div');
		div.storage = {};
		jQuery(div).addClass('ocmModuleDiv');
		jQuery(div).css('height', '52px');
		//create header
		var header = document.createElement('div');
		jQuery(header).addClass('ocmModuleDivHeader');
		jQuery(header).text(title);
		div.header = header;
		
		jQuery(div).append(header);
		//save module info in storage
		div.storage.id = id;
		div.storage.title = title;
		//set draggable
		jQuery(div).draggable({
			cursor: 'move',
			start:function(event, ui){
				this.dragBox = document.createElement('div');
				jQuery(this.dragBox).addClass('ocmDragBox');
				jQuery(document.body).append(this.dragBox);
			},
			drag:function(event, ui){
				jQuery(this.dragBox).offset({ top:event.clientY-27, left:event.clientX-87 })
			},
			stop:function(event, ui){
				jQuery(this.dragBox).remove();
				delete this.dragBox;
			}
		});
		//set handlet from click event
		jQuery(div).click(function(){
			self._click(this);
		});
		//append div to parent
		jQuery(parent).append(div);
		return div;
	},
    _hidePresentOnThePageModules:function(parent){
            if(parent != undefined){
                var self = this;
                var modulesList = parent.childNodes;
                var pageModules = self._getArrayModulesInPage();

                for(var j = 0; j < modulesList.length; j++){
                    modulesList[j].style.display='block';
                }
                
                for(var i = 0; i < pageModules.length; i++){
                    for(var j = 0; j < modulesList.length; j++){
                        if(pageModules[i].title == modulesList[j].storage.title)
                            modulesList[j].style.display='none';
                    }
                }

            }
     },
	_createModules:function(parent){
		var self = this;
		jQuery.ajax({
			url: 'index.php?option=com_manager&task=getModules&f=modules',
			type: "GET",
			dataType: "xml",
			complete : function (req, err) {
                      
				var xml = req.responseXML;
				var modules;
				if(xml.childNodes[0].nodeName=="xml")
                                    modules = xml.childNodes[1];
                                else
                                    modules = xml.childNodes[0];
				for(var i=0;i<modules.childNodes.length;i++){		
					var module, mods, t;
					module = modules.childNodes[i];
					mods = self._getArrayModulesInPage();
					var legnth = mods.length;
					params = {
						'id':module.attributes[1].value ,
						'title':module.attributes[0].value
					};
					self._createDivModule(parent, params);
				}
                                if(self.modules != undefined)
                                    self._hidePresentOnThePageModules(self.modules);
			}
		});        	
		jQuery(parent).droppable({
			accept: '.ocmModuleDiv',
			activeClass:"ocmActive",
			hoverClass: "ocmHover",
			drop:function(event, ui){
				jQuery(this).append(ui.helper);
				jQuery(ui.helper).css('height', '52px');
				jQuery(self.selectDiv).css('background', 'white');
				delete self.selectDiv;
				self._resizeDradDrop();
				self._saveSnapShoot();
			}
		});
	},
	/**
	* resize drag&drop element
	*/
	_resizeDradDrop:function(){
		var table = this.td[3].table;
		var tds = table.childNodes[0].childNodes[0].childNodes;
		for(var i=0;i<tds.length;i++){
			var td = tds[i];
			var height = 290/td.childNodes.length;
			for(var ni=0;ni<td.childNodes.length;ni++){
				var child = td.childNodes[ni];
				jQuery(child).height(height);
			}
		}
	},
	/**
	* rewrite table from snashot
	*/
	_createTableWithSnapShoot:function(sIndex , object){
		var self = this;
		var snapshoot;
		if(object){
			snapshoot = object;
		}
		else{
			if(!this.state[this.pageIndex]) return;
			snapshoot = this.state[this.pageIndex].storage[sIndex];
		}
		
		//create table
		var table = document.createElement('table');
		jQuery(table).addClass('ocmTableView');
		table.tr = table.insertRow(0);
		table.td = {}
		for(var i=0;i<snapshoot.tdLength;i++){
			table.td[i] = table.tr.insertCell(i);
			var width = 100/snapshoot.tdLength;
			jQuery(table.td[i]).width(width+'%');
			jQuery(table.td[i]).css('border','1px dotted #FF0000');
			jQuery(table.td[i]).droppable({
				accept: '.ocmModuleDiv',
				activeClass:"ocmActive",
				hoverClass: "ocmHover",
				drop:function(event, ui){
					jQuery(this).append(ui.helper);
					self._resizeDradDrop();
					self._saveSnapShoot();
				}
			});
			if(snapshoot[i]){
				for(var ni=0;ni<snapshoot[i].divLength;ni++){				
					self._createDivModule(table.td[i], {'id':snapshoot[i][ni].id ,'title':snapshoot[i][ni].title });
				}
			}
		}
		//remove old table
		jQuery(this.td[3].table).remove();
		//add new table
		this.td[3].table = table;
		jQuery(this.td[3]).append(table);
		this._resizeDradDrop();
	},
	/**
	* create table with drag&drop
	* @return object table
	*/
	_createDragDropTable:function(columnCount){
		var self = this;
		//create table
		var table = document.createElement('table');
		jQuery(table).addClass('ocmTableView');
		table.tr = table.insertRow(0);
		table.td = {}
		for(var i=0;i<columnCount;i++){
			table.td[i] = table.tr.insertCell(i);
			var width = 100/columnCount;
			jQuery(table.td[i]).width(width+'%');
			jQuery(table.td[i]).css('border','1px dotted #FF0000');
			jQuery(table.td[i]).droppable({
				accept: '.ocmModuleDiv',
				activeClass:"ocmActive",
				hoverClass: "ocmHover",
				drop:function(event, ui){
					jQuery(this).append(ui.helper);
					self._resizeDradDrop();
					self._saveSnapShoot();
				}
			});	
		}
		//return table object
		return table;
	},
	/**
	* create div element in parent, save link to div object in parent
	* @return div object
	*/
	_div:function(parent){
		//vars
		var div;
		//create div element
		div = document.createElement('div');
		//append div to parent element
		parent.div = div;	
		jQuery(parent).append(div);
		//return div object
		return div;
	},
	/**
	* ajax query  load page info (modules). JSON.
	*/
	_loadPageInfo:function(pageIndex){
		var module = this;
		this._ajax('loadPageInfo', this.pageIndex, function(req){
            //var json = jQuery.parseJSON(req.responseText);
            var json = storage.getJSON(req.responseText);
			if(!json){
				if(module.modules != undefined){
					for(var i=0; i<module.modules.childNodes.length; i++){
                        module.modules.removeChild(module.modules.childNodes[i]);
					}
                    module._createModules(module.modules);
                    module._hidePresentOnThePageModules(module.modules);
				}
				return;
			}
            module._createTableWithSnapShoot(null , json);
            module._saveSnapShoot();
                               
            if(module.modules != undefined){
                for(var i=0; i<module.modules.childNodes.length; i++){
                    module.modules.removeChild(module.modules.childNodes[i]);
                }
                module._createModules(module.modules);
                module._hidePresentOnThePageModules(module.modules);
            }
		});		
	},
	/**
	* change layout to when we change[for a time function]
	*/
	_changeLayoutType:function(index, name, layoutType){
		var table;
                var self = this;
                
                if(self.modules != undefined){
                    self.modules.innerHTML = '';
                }
		switch(layoutType){
			case "single":
				table = this._createDragDropTable(1);
			break;
				
			case "double":
				table = this._createDragDropTable(2);
			break;
				
			case "triple":
				table = this._createDragDropTable(3);
			break;
		}		
		//save page params
		this.pageIndex  = index;
		this.pageName = name;
		this.pageLayoutType = layoutType;
		//set table
		if(this.td[3].table) jQuery(this.td[3].table).remove();
		jQuery(this.td[3]).append(table);
		this.td[3].table = table;
		if(this.state[this.pageIndex]){
			var snapshoot, count
			count = this.state[this.pageIndex].count;
			snapshoot = this.state[this.pageIndex].storage[count]
			this._createTableWithSnapShoot(null , snapshoot);
			this._saveSnapShoot();
                        if(self.modules != undefined){
                        	for(var i=0; i<self.modules.childNodes.length; i++){
                        		self.modules.removeChild(self.modules.childNodes[i]);
                                }
                                self._createModules(self.modules);
                                self._hidePresentOnThePageModules(self.modules);
                        }
		}
		else{
			this._loadPageInfo();
		}
	},
	/**
	* get json object with table params
	*/
	_saveSnapShoot:function(){
		//generate snapshoot
		var obj = {};
		var table = this.td[3].table;
		var td = table.childNodes[0].childNodes[0].childNodes;
		obj.tdLength = td.length;
		for(var i=0;i<td.length;i++){
			var div = td[i].childNodes;
			obj[i] = {}
			obj[i].divLength = div.length;
			for(var ni=0;ni<div.length;ni++){
				var element = div[ni];
				obj[i][ni] = {};
				//save div params
				obj[i][ni].id = element.storage.id
				obj[i][ni].title = element.storage.title
			}
		}
		// set object to state storage
		var pageIndex, count, maxCount;
		pageIndex = this.pageIndex;
		maxCount = this.state.maxCount;
		if(!this.state[pageIndex]){
			this.state[pageIndex] = {};
			this.state[pageIndex].storage = {};
			this.state[pageIndex].count = 0;
		}
		count = this.state[pageIndex].count;
		if(count == 0 && !this.state[pageIndex].storage[0]){
			this.state[pageIndex].storage[0] = obj;
		}
		else if(count == maxCount){
			for(var i=1;i<maxCount;i++){
				this.state[pageIndex].storage[i] = this.state[pageIndex].storage[i+1];
			}
			this.state[pageIndex].storage[maxCount] = obj;
		}
		else{
			if(this.state[pageIndex].storage[count+1]){
				this.state[pageIndex].count++;
				this.state[pageIndex].storage[this.state[pageIndex].count] = obj;
				var ind = this.state[pageIndex].count + 1;
				if(ind == maxCount) {
					delete this.state[pageIndex].storage[ind];	
				}
				else{
					for(var i=ind;i<=maxCount;i++){
						delete this.state[pageIndex].storage[i];
					}
				}
			}
			else{
				this.state[pageIndex].count++;
				this.state[pageIndex].storage[this.state[pageIndex].count] = obj;
			}
		}
	},
	/**
	* section with page selection
	*/
	_selectPageSectionCreate:function(parent){
		var self = this;
		
		this._ajax('getPageInfo', storage.obj.dhxTree.getSelectedItemId(), function(req){
			var json, data, index, title, layoutType, div;
			//get row
			//json = jQuery.parseJSON(req.responseText);
			json = storage.getJSON(req.responseText);
            data = json.data[0];
			//get page params
			index = data.id;
			title = data.title;
			layoutType = data.layoutType;
			//create page title
			div = jQuery('<div class="ocmPageTitle">'+title+'</div>');
			jQuery(parent).append(div);
			self._changeLayoutType(index, title, layoutType);
		});		
	},
	/**
	*
	*/
	_getFormProperties:function(){
		var dhxForm = this.selectDiv.storage.dhxForm;
		var jStr = '[';
		dhxForm.forEachItem(function(id){
			var name, checked, selected, value;
			switch(dhxForm.getItemType(id)){
				case "input":
					name = id;
					value = dhxForm.getItemValue(id);
					jStr += '{"type":"input","name":"'+name+'","value":"'+value+'"},';
				break;
				
				case "checkbox":
					name = id;
					checked = dhxForm.isItemChecked(id);
					jStr += '{"type":"checkbox","name":"'+name+'","checked":"'+checked+'"},';
				break;
				
				case "radio":
					name = dhxForm.itemPull[dhxForm.idPrefix+id]._group;
					value = dhxForm.itemPull[dhxForm.idPrefix+id]._value;
					checked = dhxForm.isItemChecked(id);
					jStr += '{"type":"radio","name":"'+name+'","value":"'+value+'","checked":"'+checked+'"},';
				break;
				
				case "select":
					var opts = dhxForm.getOptions(id);
					name = id;
					selected = opts[opts.selectedIndex].value;
					jStr += '{"type":"select","name":"'+name+'","selected":"'+selected+'"},';
				break;
			}
		});
		jStr =  jStr.substr(0, jStr.length -1)+']';
		return jStr;
	},
	/**
	*
	*/
	_setFormProperties:function(dhxForm, settings){
		for(var i=0;i<settings.length;i++){
			var s, name, checked, selected, value;
			s = settings[i];
			switch(s['type']){
				case "input":
					dhxForm.setItemValue(s['name'], s['value']);
				break;
				
				case "checkbox":
					if(s['checked'] == "true")
						dhxForm.checkItem(s['name']);
					else
						dhxForm.uncheckItem(s['name']);
				break;
				
				case "radio":
					if(s['checked'] == "true")
						dhxForm.checkItem(s['name'], s['value']);
				break;
				
				case "select":
					jQuery(dhxForm.t).find('select[name="'+s['name']+'"]').find('[value="'+s['selected']+'"]').attr("selected", "selected");
					var select = jQuery(dhxForm.t).find('select[name="'+s['name']+'"]');
					dhxForm.items.select.doOnChange(select[0]);
				break;
			}
		}
	
	},
	/**
	*
	*/
	_jmb_search_process:function(body, result){
		this._ajax("search", jQuery(body).val(), function(req){
			var name = jQuery(req.responseXML).find('name').text();
			if(name == ''){
				jQuery(result).find('span').css('color', '#c22828');
				jQuery(result).find('span').html('Not exist');
			}	
			else {
				jQuery(result).find('span').css('color', '#28c248');
				jQuery(result).find('span').html(name);
			}
		})
	},
	/**
	*
	*/
	_jmb_search:function(div, o){
		var self = this;
		var body = jQuery(div).find('[name="'+o.name+'"]');
		var obj = jQuery('<div class="jmb_search_obj"></div>');
		var result = jQuery('<div class="jmb_search_result"><span></span></div>');
		
		jQuery(obj).css('top','-17px');
		jQuery(obj).css('left','155px');
		jQuery(result).css('top','-13px');
		
		jQuery(jQuery(body).parent()).append(obj);
		jQuery(jQuery(body).parent()).append(result);
		jQuery(obj).click(function(){
			self._jmb_search_process(body, result);
		})
		this._jmb_search_process(body, result);
	},
	/**
	*
	*/
	_jmb_tooltip:function(div, obj){
		jQuery(div).find('[name="'+obj.name+'"]').bt(obj.jmb_tooltip, {
			offsetParent:document.body,
			positions: ['top']
		});
	},
	/**
	*
	*/
	_upgradeForm:function(div, st){
		for(var i=0;i<st.length;i++){
			for(var k in st[i]){
				switch(k){
					case 'list':
						this._upgradeForm(div, st[i][k]);
					break;
					
					case 'jmb_tooltip':
						this._jmb_tooltip(div, st[i]);
					break;
					
					case 'jmb_search':
						this._jmb_search(div, st[i]);
					break;
				}
			}
		}
	},
	/**
	* create dialog form
	* @return object table
	*/
	_createDialogForm:function(parent){
		var self = this;
		var moduleId = this.selectDiv.storage.id;
		host.getModuleParametersStructure(moduleId,function(st){
			var structures = eval( '(' + st.responseText + ')' );
			host.getModuleParametersValues(moduleId, function(val){
				var div = document.createElement('div');
				var dhxForm = new dhtmlXForm(div, structures);
				var settings;
				if(val.responseText != ''){
					settings = eval( '(' + val.responseText + ')' );
					self._setFormProperties(dhxForm, settings);
				}
				self._upgradeForm(div, structures);
				jQuery(parent).append(div);
				jQuery(parent).dialog('open');
				self.selectDiv.storage.dhxForm = dhxForm;
			});	 
		});
	},
	_createNewButton:function(parent){
		var self = this;
		var img1 = document.createElement('div');
		jQuery(img1).addClass('ocmImg ocmImgNew');
		img1.select = false;
		jQuery(parent).append(img1);
		jQuery(img1).click(function(){
			if(img1.select){
				img1.select = false;
				jQuery(img1).removeClass('ocmImgNewSelect');
				jQuery(self.modules).dialog( "destroy" );
			}
			else {
				img1.select = true;
				jQuery(img1).addClass('ocmImgNewSelect');
				//create modules_table
				var div = document.createElement('div');
				self.modules = div;
				jQuery(div).dialog({
					autoOpen: false,
					title: 'Add New Module',
					height: 500,
					width: 200,
					resizable: false,
					position: 'left',
					close:function(){
						img1.select = false;
						jQuery(img1).removeClass('ocmImgNewSelect');
					}
				});
				jQuery(div).dialog('open');
				self._createModules(self.modules);
			}
		});	
		return img1;
	},
	_createUndoButton:function(parent){
		var self = this;
		var img2 = document.createElement('div');
		jQuery(img2).addClass('ocmImg ocmImgUndo');
		jQuery(parent).append(img2);
		jQuery(img2).click(function(){
                    if(self.pageIndex != undefined){
			if(self.state[self.pageIndex].count == 0) return;
			self.state[self.pageIndex].count--;
			self._createTableWithSnapShoot(self.state[self.pageIndex].count);
                    }
		});
		return img2;
	},
	_createRendoButton:function(parent){
		var self = this;
		var img3 = document.createElement('div');
		jQuery(img3).addClass('ocmImg ocmImgRendo');
		jQuery(parent).append(img3);
		jQuery(img3).click(function(){
                    if(self.pageIndex != undefined){
			if(self.state[self.pageIndex].count == self.state[self.pageIndex].maxCount) return;
			if(!self.state[self.pageIndex].storage[self.state[self.pageIndex].count+1]) return;
			self.state[self.pageIndex].count++;
			self._createTableWithSnapShoot(self.state[self.pageIndex].count);
                    }
		});
		return img3;
	},
	_createShowButton:function(parent){
		var self = this;
		var img4 = document.createElement('div');
		jQuery(img4).addClass('ocmImg ocmImgShowLines ocmImgShowLinesSelect');
		img4.select = true;
		jQuery(parent).append(img4);
		jQuery(img4).click(function(){
			var border;
			if(img4.select){
				jQuery(img4).removeClass('ocmImgShowLinesSelect');
				img4.select = false;
				jQuery('.ocmTableView TD').css('border', '1px solid #FFF');
			}
			else{
				jQuery(img4).addClass('ocmImgShowLinesSelect');
				img4.select = true;
				jQuery('.ocmTableView TD').css('border', '1px dotted #FF0000');
			}
		})
		return img4;
	},
	_createPropButton:function(parent){
		var self = this;
		var img5 = document.createElement('div');
		jQuery(img5).addClass('ocmImg ocmImgMod');
		jQuery(parent).append(img5);
		jQuery(img5).click(function(){
			if(this.select){	
				this.select = false;
				jQuery(this).removeClass('ocmImgModSelect');
			}else{
				if(!self.selectDiv) return;
				this.select = true;
				jQuery(this).addClass('ocmImgModSelect');
				//properties
				var div = document.createElement('div');
				jQuery(div).dialog({
					autoOpen: false,
					title: self.selectDiv.storage.title+' - Module Settings',
					//height: 240,
					//width: 320,
					resizable: false,
					modal:true,
					close: function(){
						img5.select = false;
						jQuery(img5).removeClass('ocmImgModSelect');
					},
					buttons:{
						'Apply':function(){
							var json = self._getFormProperties();
							var dialog = this;
							host.setModuleParametersValues(self.selectDiv.storage.id, json, function(req){
								var title = jQuery.trim(self.selectDiv.storage.dhxForm.getItemValue('title'));
								jQuery(dialog).dialog('option', 'title', title+' - Module Settings');
								jQuery(self.selectDiv.header).text(title);
								self.selectDiv.storage.title = title;
							});
						},
						'Save':function(){
							var json, dialog;
							dialog = this;
							json = self._getFormProperties();
							host.setModuleParametersValues(self.selectDiv.storage.id, json, function(req){
								jQuery(dialog).dialog("close");
							});
						},
						'Close':function(){ jQuery(this).dialog("close"); }
					}
				});
				self._createDialogForm(div);	
			}		
		});
		return img5;
	},
	_createDeleteButton:function(parent){
		var self = this;
		var img6 = document.createElement('div');
		jQuery(img6).addClass('ocmImg ocmImgDelete');
		jQuery(parent).append(img6);
		jQuery(img6).click(function(){
                    if(self.selectDiv){
                        self.selectDiv.style.height='52px';
                        if(self.modules)
                            self.modules.appendChild(self.selectDiv);
                        else
                            self.selectDiv.parentNode.removeChild(self.selectDiv);
                        self._saveSnapShoot(); 
                    }
                })
                return img6;
	},
	_createButtonTitle:function(title, parent){
		var div = jQuery('<div class="ocmButtonTitle"></div>');
		jQuery(div).html(title);
		jQuery(parent).append(div);
	},
	/**
	* section with buttons(new, add, ...)
	*/
	_editPageSectionCreate:function(parent){
		var self = this;
		var img1, img2, img3, img4, img5, img6;
		
		var table = this._createTable(2, 6);
		jQuery(parent).append(table);
		
		//new 
		img1 = this._createNewButton(table.rows[0].cells[0]);
		this._createButtonTitle('New', table.rows[1].cells[0]);
		//undo
		img2 = this._createUndoButton(table.rows[0].cells[1]);
		this._createButtonTitle('Undo', table.rows[1].cells[1]);
		//rendo
		img3 = this._createRendoButton(table.rows[0].cells[2]);
		this._createButtonTitle('Rendo', table.rows[1].cells[2]);
		//showlines
		//img4 = this._createNewButton(table.rows[0].cells[3]);
		//this._createButtonTitle('Show', table.rows[1].cells[3]);
		//mod properties
		img5 = this._createPropButton(table.rows[0].cells[4]);
		this._createButtonTitle('Prop', table.rows[1].cells[4]);
		//delete
		img6 = this._createDeleteButton(table.rows[0].cells[5]);
		this._createButtonTitle('Delete', table.rows[1].cells[5]);

		//set img to parent object
		this.add = img1;
		this.undo = img2;
		this.rendo = img3;
		//this.show = img4;
		this.mod = img5;
		this.del = img6;
	},
	/**
	* converrt snapshoot object to string object
	* @return string str
	*/
	_convertSnapShootToString:function(obj){
		var str = '{';
		for(var i=0;i<obj.tdLength;i++){
			str += '\"'+i+'\"'+':{';
			for(var ni=0;ni<obj[i].divLength;ni++){
				str +='\"'+ ni+'\"'+':{ "id":'+obj[i][ni].id+', "title":"'+obj[i][ni].title+'"}'
				str += ',';
			}	
			str += '"divLength":'+obj[i].divLength;
			str += '}';
			str += ',';
		}
		str += '"tdLength":'+obj.tdLength
		str += '}'
		return str;
	},
	/**
	* section with button `save` , `discard changes`
	*/
	_savePageSectionCreate:function(parent){
		var self = this;
		//discard changes
		var discardChangesInput = document.createElement('input');
		this.discardChangesInput = discardChangesInput;
		jQuery(discardChangesInput).attr('type', 'submit');
		jQuery(discardChangesInput).val('Discard Changes');
		jQuery(parent).append(discardChangesInput);
		jQuery(discardChangesInput).click(function(){
			self._createTableWithSnapShoot(0);
		})
		
		//save
		var saveInput = document.createElement('input');
		this.saveInput = saveInput;
		jQuery(saveInput).attr('type', 'submit');
		jQuery(saveInput).val('Save');
		jQuery(parent).append(saveInput);
		jQuery(saveInput).click(function(){
                     if(self.pageIndex != undefined){
			var snapshoot = self.state[self.pageIndex].storage[self.state[self.pageIndex].count];
			self.state[self.pageIndex].storage[0] = snapshoot;
			jQuery.ajax({
				url: 'index.php?option=com_manager&task=savePage',
				type: "POST",
				data: 'page_id='+self.pageIndex+'&json='+self._convertSnapShootToString(snapshoot),
				dataType: "html",
				complete : function (req, err) {
						
				}
			});
                     }
		});
	}
}
