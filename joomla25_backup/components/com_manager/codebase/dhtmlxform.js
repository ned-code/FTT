function dhtmlXForm(parentObj, data) {
	
	//init data processing part
	this.loadedCollection = {};
	this.inputs = [];
	this.commands = [];
	this.validators = [];
	this.formId;
	this.i18n = {};
	this.i18n.confirm_delete = 'Are you sure that you want to delete information from this form?';
	this.xmlLoader = new dtmlXMLLoaderObject(this.doLoadDetails, this, true, this.no_cashe);
	this.commandsCollection = {
		load: 'load',
		save: 'save',
		remove: 'remove',
		reset: 'reset',
		validate: 'validate'
	};
	
	//end of data processing part init
	
	var that = this;
	
	this.skin = "dhx_skyblue";
	this.setSkin = function(skin) {
		this.skin = skin;
		this.cont.className = "dhxlist_obj_"+this.skin;
		this.cont.style.fontSize = (this.skin == "dhx_web"?"12px":"11px");
	}
	
	this._type = "checkbox";
	this._rGroup = "default";
	
	this.cont = (typeof(parentObj)=="object"?parentObj:document.getElementById(parentObj));
	
	if (!parentObj._isNestedForm) {
		this._parentForm = true;
		this.cont.style.fontSize = (this.skin == "dhx_web"?"12px":"11px");
		this.cont.className = "dhxlist_obj_"+this.skin;
		this.setFontSize = function(fs) {
			this.cont.style.fontSize = fs;
		}
	}
	
	
	this.base = document.createElement("DIV");
	this.base.className = "dhxlist_base";
	this.cont.appendChild(this.base);
	
	this.setSizes = function() {
		this.base.style.height = this.cont.offsetHeight+"px";
		this.base.style.overflow = "auto";
	}
	
	this._parseInputs();
	
	this.t = document.createElement("TABLE");
	this.t.className = "dhxlist_items_set";
	this.t.border = 0;
	this.t.cellSpacing = 1;
	this.t.cellPadding = 0;
	this.tb = document.createElement("TBODY");
	
	this.t.appendChild(this.tb);
	this.base.appendChild(this.t);
	
	var tr = document.createElement("TR");
	tr._type = "dhxlist_hdr";
	tr.className = "dhxlist_tbl_head";
	this.tb.appendChild(tr);
	
	var th1 = document.createElement("TH");
	var th2 = document.createElement("TH");
	th1.className = "dhxlist_img_cell dhxlist_tbl_head";
	th2.className = "dhxlist_tbl_head";
	tr.appendChild(th1);
	tr.appendChild(th2);
	
	
	tr.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
	th1.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
	th2.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
	
	this._genStr = function(w) {
		var s = ""; var z = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (var q=0; q<w; q++) s += z.charAt(Math.round(Math.random() * (z.length-1)));
		return s;
	}
	
	this.idPrefix = "dhxList_"+this._genStr(12)+"_";
	
	this.objPull = {};
	this.itemPull = {};
	this._ic = 0;
	
	this._addItem = function(type, id, data, sId, lp) {
		
		if (!type) type = this._type;
		var tr = document.createElement("TR");
		tr._idd = id;
		
		if (type == "list") {
			
			if (sId != null) tr._sId = sId;
			
			if (this.getItemType(lp)=="fieldset") {
				tr._fs = true;
				data._fsText = this.getItemText(lp);
				data._fsWidth = this.getItemWidth(lp);
				this.itemPull[this.idPrefix+id]._fs = tr;
			};
			
			this.tb.appendChild(tr);
			var listData = this.items[type].render(tr, data); //(this.getItemType(lp)=="fieldset"?this.getItemText(lp):null)
			
			this.tb.appendChild(tr);
			
			if (!this.itemPull[this.idPrefix+id]._listObj) this.itemPull[this.idPrefix+id]._listObj = [];
			if (!this.itemPull[this.idPrefix+id]._list) this.itemPull[this.idPrefix+id]._list = [];
				
			(this.itemPull[this.idPrefix+id]._listObj).push(listData[0]);
			(this.itemPull[this.idPrefix+id]._list).push(listData[1]);
			
			listData[1].checkEvent = function(evName) {
				return that.checkEvent(evName);
			}
			listData[1].callEvent = function(evName, evData) {
				return that.callEvent(evName, evData);
			}
			
			return listData[1];
			
		} else {
			
			this.tb.appendChild(tr);
			if (type != "input") tr.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
			
			if (type == "label" && this._ic == 0) data._isTopmost = true;
			
			this.objPull[this.idPrefix+id] = this.items[type].render(tr, data);
			this.itemPull[this.idPrefix+id] = tr;
			
			tr.checkEvent = function(evName) {
				return that.checkEvent(evName);
			}
			tr.callEvent = function(evName, evData) {
				return that.callEvent(evName, evData);
			}
			tr._autoCheck = function() {
				that._autoCheck();
			}
		}
		
		this._ic++;
		
	}
	
	/*********************************************************************************************************************************************
		OBJECT INIT
	*********************************************************************************************************************************************/
	
	this._initObj = function(data) {
		
		for (var q=0; q<data.length; q++) {
			
			var type = (data[q].type||"checkbox");
			
			var id = data[q].name||this._genStr(12);
			if (this.objPull[this.idPrefix+id] != null || type=="radio") id = this._genStr(12);
			
			var obj = data[q];
			obj.label = obj.label||"";
			obj.value = obj.value||"";
			obj.checked = !!obj.checked;
			obj.disabled = !!obj.disabled;
			obj.name = obj.name||this._genStr(12);
			obj.options = obj.options||[];
			obj.rows = obj.rows||"none";
			obj.uid = this._genStr(12);
			
			this._addItem(type, id, obj);
			
			if (this._parentEnabled === false) this._disableItem(id);
			
			for (var w=0; w<obj.options.length; w++) {
				if (obj.options[w].list != null) {
					if (!obj.options[w].value) obj.options[w].value = this._genStr();
					var subList = this._addItem("list", id, obj.options[w].list, obj.options[w].value);
					subList._subSelect = true;
					subList._subSelectId = obj.options[w].value;
				}
				this._autoCheck();
			}
			
			
			if (data[q].list != null) {
				if (!data[q].listParent) data[q].listParent = data[q].name;
				var subList = this._addItem("list", id, data[q].list, null, data[q].listParent);//(data[q].listParent=="fieldset"));
				this._autoCheck();
			}
		}
		
		this._parseInputs();
	}
	
	/*********************************************************************************************************************************************
		XML
	*********************************************************************************************************************************************/
	
	this._attrs = ["type", "name", "value", "label", "check", "checked", "disabled", "text", "rows", "select", "selected", "validate", "bind", "command", "width"];
	
	this._xmlToObject = function(xmlData, itemTag) {
		var obj = [];
		for (var q=0; q<xmlData.childNodes.length; q++) {
			if (String(xmlData.childNodes[q].tagName||"").toLowerCase() == itemTag) {
				var p = {};
				var t = xmlData.childNodes[q];
				for (var w=0; w<this._attrs.length; w++) if (t.getAttribute(this._attrs[w]) != null) p[this._attrs[w]] = t.getAttribute(this._attrs[w]);
				if (!p.text && itemTag == "option") try { p.text = t.firstChild.nodeValue; } catch(e){}
				if (itemTag != "option" && t.childNodes.length > 0) p[(p.type=="select"?"options":"list")] = this._xmlToObject(t, (p.type=="select"?"option":itemTag));
				if (itemTag == "option" && xmlData.childNodes[q].getElementsByTagName("item").length > 0) p["list"] = this._xmlToObject(t, "item");
				if (p.list) p.listParent = p.name;
				obj[obj.length] = p;
			}
		}
		return obj;
	}
	
	this._xmlParser = function() {
		that._initObj(that._xmlToObject(this.getXMLTopNode("items"), "item"));
		that.callEvent("onXLE",[]);
		if (typeof(that._doOnLoad) == "function") that._doOnLoad();
	}
	
	this._doOnLoad = null;
	this._xmlLoader = new dtmlXMLLoaderObject(this._xmlParser, window);
	
	this.loadStruct = function(xmlFile, onLoadFunction) {
		this._doOnLoad = (onLoadFunction||null);
		this.callEvent("onXLS", []);
		this._xmlLoader.loadXML(xmlFile);
	}
	this.loadStructString = function(xmlString, onLoadFunction) {
		this._doOnLoad = (onLoadFunction||null);
		this._xmlLoader.loadXMLString(xmlString);
	}
	
	/*********************************************************************************************************************************************
		AUTOCHECK (Global enable/disable functionality)
	*********************************************************************************************************************************************/
	
	this._autoCheck = function(enabled) {
		for (var a in this.itemPull) {
			var isEnabled = (typeof(enabled)=="undefined"?true:enabled)&&this.itemPull[a]._checked;
			if (this.itemPull[a]._list) {
				for (var q=0; q<this.itemPull[a]._list.length; q++) {
					var list = this.itemPull[a]._list[q];
					list._parentEnabled = isEnabled&&(typeof(this._parentEnabled)=="undefined"?true:this._parentEnabled);
					for (var b in list.itemPull) {
						var idd = list.itemPull[b]._idd;
						if (list._subSelect === true) {
							var sVal = this.getItemValue(this.itemPull[a]._idd);
							isEnabled = (list._subSelectId == sVal && this.itemPull[a]._enabled);
							for (var w=0; w<this.tb.childNodes.length; w++) {
								var p = this.tb.childNodes[w];
								if (p._sId != null) p.style.display = (sVal==p._sId?"":"none");
							}
						}
						if (isEnabled) list._enableItem(idd); else list._disableItem(idd);
						if (list.itemPull[b]._list) list._autoCheck(isEnabled);
					}
				}
			}
		}
	}
	
	/*********************************************************************************************************************************************
		PUBLIC API
	*********************************************************************************************************************************************/
	
	this.doWithItem = function(id, method, a, b, c, d) {
		// radio
		//console.log(method)
		if (typeof(id) == "object") {
			var group = id[0];
			var value = id[1];
			var item = null;
			var res = null;
			for (var k in this.itemPull) {
				if ((this.itemPull[k]._value == value || value === null) && this.itemPull[k]._group == group) return this.objPull[k][method](this.itemPull[k], a, b, c, d);
				if (this.itemPull[k]._list != null && !res) {
					for (var q=0; q<this.itemPull[k]._list.length; q++) {
						res = this.itemPull[k]._list[q].doWithItem(id, method, a, b, c);
					}
				}
			}
			return res;
		// checkbox, input, select, label
		} else {
			if (!this.itemPull[this.idPrefix+id]) {
				var res = null;
				for (var k in this.itemPull) {
					if (this.itemPull[k]._list && !res) {
						for (var q=0; q<this.itemPull[k]._list.length; q++) {
							if(!res) res = this.itemPull[k]._list[q].doWithItem(id, method, a, b, c, d);
						}
					}
				}
				return res;
			} else {
				return this.objPull[this.idPrefix+id][method](this.itemPull[this.idPrefix+id], a, b, c, d);
			}
		}
	}
	
	this.removeItem = function(id, value) {
		if (value != null) id = this.doWithItem([id, value], "destruct"); else this.doWithItem(id, "destruct");
		this._clearItemData(id);
	}
	
	this._clearItemData = function(id) {
		if (this.itemPull[this.idPrefix+id]) {
			id = this.idPrefix+id;
			try {
				this.objPull[id] = null;
				this.itemPull[id] = null;
				delete this.objPull[id];
				delete this.itemPull[id];
			} catch(e) {}
		} else {
			for (var k in this.itemPull) {
				if (this.itemPull[k]._list) {
					for (var q=0; q<this.itemPull[k]._list.length; q++) this.itemPull[k]._list[q]._clearItemData(id);
				}
			}
		}
	}
	
	this.isItem = function(id, value) {
		if (value != null) id = [id, value];
		return this.doWithItem(id, "isExist");
	}
	
	this.getItemType = function(id, value) {
		if (value != null) id = [id, value];
		return this.doWithItem(id, "getType");
	}
	
	/* iterator */
	this.forEachItem = function(handler) {
		for (var a in this.objPull) {
			handler(String(a).replace(this.idPrefix,""));
			if (this.itemPull[a]._list) {
				for (var q=0; q<this.itemPull[a]._list.length; q++) this.itemPull[a]._list[q].forEachItem(handler);
			}
		}
	}
	
	/* text */
	this.setItemLabel = function(id, value, text) {
		if (text != null) id = [id, value]; else text = value;
		this.doWithItem(id, "setText", text);
	}
	
	this.getItemText = function(id, value) {
		if (value != null) id = [id, value];
		return this.doWithItem(id, "getText");
	}
	
	/* state */
	this._enableItem = function(id) {
		this.doWithItem(id, "enable");
	}
	
	this._disableItem = function(id) {
		this.doWithItem(id, "disable");
	}
	
	this._isItemEnabled = function(id) {
		return this.doWithItem(id, "isEnabled");
	}
	
	/* selection */
	this.checkItem = function(id, value) {
		if (value != null) id = [id, value];
		this.doWithItem(id, "check");
		this._autoCheck();
	}
	
	this.uncheckItem = function(id, value) {
		if (value != null) id = [id, value];
		this.doWithItem(id, "unCheck");
		this._autoCheck();
	}
	
	this.isItemChecked = function(id, value) {
		if (value != null) id = [id, value];
		return this.doWithItem(id, "isChecked");
	}
	
	this.getCheckedValue = function(id) {
		return this.doWithItem([id, null], "getChecked");
	}
	
	/* value */
	this.setItemValue = function(id, value) {
		return this.doWithItem(id, "setValue", value);
	}
	
	this.getItemValue = function(id) {
		return this.doWithItem(id, "getValue");
	}
	
	/* visibility */
	this.showItem = function(id) {
		this.doWithItem(id, "show");
	}
	
	this.hideItem = function(id) {
		this.doWithItem(id, "hide");
	}
	
	this.isItemHidden = function(id) {
		return this.doWithItem(id, "isHidden");
	}
	
	/* options (select only) */
	this.getOptions = function(id) {
		return this.doWithItem(id, "getOptions");
	}
	
	/* width/height */
	this.setItemWidth = function(id, width) {
		this.doWithItem(id, "setWidth", width);
	}
	
	this.getItemWidth = function(id) {
		return this.doWithItem(id, "getWidth");
	}
	
	this.setItemHeight = function(id, height) { // textarea
		this.doWithItem(id, "setHeight", height);
	}
	
	/* position */
	/*
	this.setItemPosition = function(id, value, position) {
		if (position != null) id = [id, value]; else position = value;
		this.doWithItem(id, "setPosition", position);
	}
	
	this.getItemPosition = function(id, value) {
		if (value != null) id = [id, value];
		return this.doWithItem(id, "getPosition");
	}
	
	this._setPosition = function(item, pos) {
		var itemNext = null;
		var j = 1;
		var tb = item.parentNode;
		for (var q=0; q<tb.childNodes.length; q++) {
			var it = tb.childNodes[q];
			if (!(it._type == "list" || it._type == "dhxlist_hdr")) {
				if (j == pos && !itemNext) itemNext = it;
				j++;
			}
			it = null;
		}
		if (itemNext != null) tb.insertBefore(item, itemNext); else tb.appendChild(item);
		itemNext = null;
	}
	
	this._getPosition = function(item) {
		var pos = null;
		var j = 1;
		var tb = item.parentNode;
		for (var q=0; q<tb.childNodes.length; q++) {
			var it = tb.childNodes[q];
			if (!(it._type == "list" || it._type == "dhxlist_hdr")) { if (it == item) pos = j; else j++; }
			it = null;
		}
		return pos;
	}
	*/
	
	this.clear = function() {
		var usedRAs = {};
		this.formId = (new Date()).valueOf();//remove form id, so next operation will be insert
		this.resetDataProcessor("inserted");
			
		for (var a in this.itemPull) {
			var t = this.itemPull[a]._idd;
			// checkbox
			if (this.itemPull[a]._type == "ch") this.uncheckItem(t);
			// input/textarea
			if (this.itemPull[a]._type == "ta") this.setItemValue(t, "");
			// select
			if (this.itemPull[a]._type == "se") {
				var opts = this.getOptions(t);
				if (opts.length > 0) opts[0].selected = true;
			}
			// radiobutton
			if (this.itemPull[a]._type == "ra") {
				var g = this.itemPull[a]._group;
				if (!usedRAs[g]) { this.checkItem(g, this.doWithItem(t, "_getFirstValue")); usedRAs[g] = true; }
			}
			// nested lists
			if (this.itemPull[a]._list) for (var q=0; q<this.itemPull[a]._list.length; q++) this.itemPull[a]._list[q].clear();
		}
		usedRAs = null;
		if (this._parentForm) this._autoCheck();
		/*
		for (var a in this.objPull) this.removeItem(String(a).replace(this.idPrefix,""));
		this.objPull = null;
		this.itemPull = null;
		*/
	}
	
	this.unload = function() {
		
		for (var a in this.objPull) this.removeItem(String(a).replace(this.idPrefix,""));
		
		this._attrs = null;
		this._xmlLoader.destructor();
		this._xmlLoader = null;
		this._xmlParser = null;
		this._xmlToObject = null;
		this.loadXML = null;
		this.loadXMLString = null;
		
		this.items = null;
		this.objPull = null;
		this.itemPull = null;
		
		this._addItem = null;
		this._genStr = null;
		this._initObj = null;
		this._autoCheck = null;
		this._clearItemData = null;
		this._enableItem = null;
		this._disableItem = null;
		this._isItemEnabled = null;
		this.forEachItem = null;
		this.isItem = null;
		this.clear = null;
		this.doWithItem = null;
		this.getItemType = null;
		this.removeItem = null;
		this.unload = null;
		
		this.attachEvent = null;
		this.callEvent = null;
		this.checkEvent = null;
		this.detachEvent = null;
		this.eventCatcher = null;
		
		this.setItemPosition = null;
		this.getItemPosition = null;
		this._setPosition = null;
		this._getPosition = null;
		
		this.setItemLabel = null;
		this.getItemText = null;
		this.setItemValue = null;
		this.getItemValue = null;
		this.showItem = null;
		this.hideItem = null;
		this.isItemHidden = null;
		this.checkItem = null;
		this.uncheckItem = null;
		this.isItemChecked = null;
		this.getOptions = null;
		
		// some more
		this.xmlLoader.destructor();
		this.xmlLoader = null;
		this._ic = null;
		this._add_css_ = null;
		this._createBlock = null;
		this._createHash = null;
		this._createList = null;
		this._createQuery = null;
		this._del_css_ = null;
		this._getElementValue = null;
		this._is_css_ = null;
		this._loadOptions = null;
		this._loadToForm = null;
		this._parseInputs = null;
		this._parseXML = null;
		this._processObj = null;
		this._setDefaultValues = null;
		this._setElementValue = null;
		this._ulToObject = null;
		this.commandsCollection = null;
		this.loadedCollection = null;
		this.i18n = null;
		this.inputs = null;
		this.bindCommand = null;
		this.bindField = null;
		this.bindValidator = null;
		this.load = null;
		this.loadStruct = null;
		this.loadStructString = null;
		this.remove = null;
		this.reset = null;
		this.save = null;
		this.setFontSize = null;
		this.setItemHeight = null;
		this.setItemWidth = null;
		this.setSkin = null;
		this.validate = null;
		this.commands = null;
		this.validators = null;
		
		var tr = this.tb.childNodes[0];
		tr.childNodes[0].onselectstart = null;
		tr.childNodes[1].onselectstart = null;
		while (tr.childNodes.length > 0) tr.removeChild(tr.childNodes[0]);
		tr.onselectstart = null;
		tr.parentNode.removeChild(tr);
		tr = null;
		
		this.tb.parentNode.removeChild(this.tb);
		this.tb = null;
		
		this.t.parentNode.removeChild(this.t);
		this.t = null;
		
		this._rGroup = null;
		this._type = null;
		
		this.skin = null;
		this.idPrefix = null;
		
		while (this.base.childNodes.length > 0) this.base.removeChild(this.base.childNodes[0]);
		if (this.base.parentNode) this.base.parentNode.removeChild(this.base);
		this.base = null;
		
		this.cont.className = "";
		this.cont = null;
		
		//try { for (var a in this) delete this[a]; } catch(e) {}
		
	}
	
	for (var a in this.items) {
		
		this.items[a].t = a;
		
		if (!this.items[a].show) {
			this.items[a].show = function(item) {
				item.style.display = "";
			}
		}
		
		if (!this.items[a].hide) {
			this.items[a].hide = function(item) {
				item.style.display = "none";
			}
		}
		
		if (!this.items[a].isHidden) {
			this.items[a].isHidden = function(item) {
				return (item.style.display == "none");
			}
		}
		
		this.items[a].getType = function() {
			return this.t;
		}
		
		this.items[a].isExist = function() {
			return true;
		}
		/*
		this.items[a].getPosition = function(item) {
			return that._getPosition(item);
		}
		
		this.items[a].setPosition = function(item, position) {
			return that._setPosition(item, position);
		}
		*/
	}
	
	dhtmlxEventable(this);
	this.attachEvent("_onButtonClick", function(name, cmd){
		var i = {"save":true, "validate":true, "reset":true};
		if (i[cmd]) this[cmd](); else this.callEvent("onButtonClick", [name, cmd]);
	});
	
	if (data != null && typeof data == "object") {
		this._initObj(data);
	}
};


dhtmlXForm.prototype = {
	load: function(url, callback){
		var that = this;
		var params = '';
		var dirty = false;

		for (var i in this.inputs)
			if (this._getElementValue(this.inputs[i]) != this.inputs[i].defaultValue)
				dirty = true;

		if (dirty && !this.callEvent("onDirty", [that.formId]))
			return false;
			
		this.callEvent("onXLS", [this.formId]);
		this.xmlLoader.onloadAction = function(that, b, c, d, xml){
			that._parseXML(xml);
			that.callEvent("onXLE", [that.formId]);
			that._loadToForm();

			if (callback)
				callback(that.formId, xml);
		}
		
		var id = url.match(/(\?|\&)id\=([a-z0-9_]*)/i);
		if (id && id[0])
			this.formId = id[0].split("=")[1];
		this.xmlLoader.loadXML(url);
	},
	_parseXML: function(xml){
		var root = xml.getXMLTopNode("data");
		var inputs = root.childNodes;

		if (inputs.length == 0){
			this.formId = (new Date()).valueOf();
			this.resetDataProcessor("inserted");
			return false;
		}
		
		this.resetDataProcessor("updated");
		
			

		for (var i = 0; i < inputs.length; i++){
			if (inputs[i].nodeType == 1)
				this.loadedCollection[inputs[i].nodeName] = inputs[i].childNodes[0].nodeValue;
		}
		return true;
	},
	_parseInputs: function(){
		var that = this;
		var els = this.cont.getElementsByTagName("*");
		var bind;
		var command;
		var validate;
		var connector;

		for (var i = 0; i < els.length; i++){
			bind = els[i].getAttribute("bind");

			if (bind !== null){
				var obj = this._processObj(els[i]);
				obj.defaultValue = this._getElementValue(obj);
				this.inputs[bind] = obj;
			}
			command = els[i].getAttribute("command");
			if (!els[i]._dhx_bind){
				this.bindCommand(els[i], command);
				els[i]._dhx_bind=true;
			}
			validate = els[i].getAttribute("validate");
			this.bindValidator(els[i], validate);
			connector = els[i].getAttribute("connector");

			if (connector !== null){
				this._loadOptions(connector, els[i]);
			}
		}
	},
	_loadOptions: function(connector, el){
		var that = this;
		dhtmlxAjax.get(connector, function(xml){
			that._createList(el, xml);
			that = null;
		});
	},
	_createList: function(el, xml){
		var root = xml.getXMLTopNode("data");
		var inputs = root.childNodes;
		var bind = el.getAttribute("bind");
		var text = '';

		for (var i = 0; i < inputs.length; i++){
			var value = inputs[i].getAttribute("value");
			var label = inputs[i].getAttribute("label");

			switch (el.tagName.toLowerCase()){
				case 'select':
					el.options[el.options.length] = new Option(label, value);
					break;

				case 'input':
					var type = el.getAttribute("type");

					if (type == 'radio'){
						var id = "id_" + Math.round(Math.random() * 2000);

						if (value){
							var checked = 'checked';
						}else{
							var checked = '';
						}
						var option = document.createElement("DIV");
						option.innerHTML = '<input id="' + id + '" type="radio" value="' + value + '" name="' + el.name
							+ '" bind="' + el.getAttribute('bind') + '" ' + checked + ' /><label for="' + id + '">'
							+ value + '</label>';
						el.parentNode.appendChild(option);
						option.className = "dhx_autocreated_radio";

						if (bind){
							this.inputs[bind].raArray.push(document.getElementById(id));
						}
					}
					break;
			}
		}

		if ((bind !== null) && (this.inputs[bind] !== undefined)){
			this._setElementValue(this.inputs[bind], this.loadedCollection[bind]);
		}
	},
	_loadToForm: function(){
		if (this.callEvent("onBeforeDataLoad",
			[
			this.formId,
			this.loadedCollection
			]) == false){
			return false;
		}

		for (var i in this.loadedCollection)
			if (this.inputs[i] !== undefined)
				this._setElementValue(this.inputs[i], this.loadedCollection[i]);
			
		for (var a in this.itemPull){
			var el = this.itemPull[a];
			if ((el._group || el._type == "ch" )&& el._bind){
				var val = this.loadedCollection[el._bind];
				if (val) 
					this.checkItem(el._group, val );
				else
					this.uncheckItem(el._group, el._value );
			}
		}
		
		this._setDefaultValues();
	},
	_processObj: function(obj){
		var objectArray = [];

		if ((obj.tagName == 'INPUT') && (obj.getAttribute("type").toLowerCase() == 'radio')){
			var radios = document.getElementsByName(obj.name);
			var raArray = [];

			for (var i = 0; i < radios.length; i++){
				raArray[i] = radios[i];
			}
			objectArray['raArray'] = raArray;
		}
		objectArray['object'] = obj;
		return objectArray;
	},
	bindField: function(id, name){
		if (typeof (id) != 'object'){
			id = document.getElementById(id);
		}

		if ((id !== null) && (this.inputs[name] === undefined)){
			var obj = this._processObj(id);
			obj.defaultValue = this._getElementValue(obj);
			this.inputs[name] = obj;
			return true;
		}else{
			return false;
		}
	},
	bindCommand: function(id, command){
		var that = this;

		if (typeof (id) != 'object'){
			id = document.getElementById(id);
		}

		if ((id !== null) && (this.commandsCollection[command] !== undefined)){
			dhtmlxEvent(id, "click", function(){
				that[command]();
			});
			return true;
		}else{
			return false;
		}
	},
	bindValidator: function(id, validator){
		var valid = [];

		if (typeof (id) != 'object'){
			var el = document.getElementById(id);
		}else{
			var el = id;
		}

		if ((el !== null) && (validator !== null)){
			var obj = this._processObj(el);
			valid['id'] = id;
		}else{
			if (this.inputs[id] !== undefined){
				var obj = this.inputs[id];
				valid['id'] = id;
			}else{
				return false;
			}
		}
		valid['obj'] = obj;

		if (window.dhtmlxValidation && dhtmlxValidation["is"+validator] !== undefined){
			valid['type'] = 'built_in';
		}else{
			if (window[validator] !== undefined){
				valid['type'] = 'custom';
			}else{
				valid['type'] = 'regexp';
			}
		}
		valid['validator'] = validator;
		valid['class'] = '';
		this.validators.push(valid);
		return true;
	},
	_createQuery: function(pref){
		pref = pref || "";
		var query = [];
		var els = this.cont.getElementsByTagName("*");
		for (var i = 0; i < els.length; i++){
			var name = els[i].getAttribute("bind")||els[i].getAttribute("name");
			if (name)
				query.push(pref+name+"="+encodeURIComponent(this._getElementValue({object:els[i]})));
		}
		
		for (var a in this.itemPull){
			var el = this.itemPull[a];
			if ((el._type == "ch" || el._type == "ra") && el._bind){
				if (this.isItemChecked((el._group || el._name), el._value))
					query.push(pref+el._bind+"="+(encodeURIComponent(el._value)||"true"));
			}
		}
		
		if (this._userdata && this._userdata[this.formId])
			for (var key in this._userdata[this.formId])
				query.push(pref+key+"="+encodeURIComponent(this._userdata[this.formId][key]));
	
		return query.join("&");
	},
	_createBlock: function(){
		var block = document.createElement('div');
		block.className = "dhx_form_cover";
		document.body.appendChild(block);
		this.block = block;
	},
	_createHash: function(){
		var hash = {};

		for (var i in this.inputs){
			hash[i] = this._getElementValue(this.inputs[i]);
		}
		return hash;
	},
	save:function(){ 
		if (this.dp)
			this.dp.sendData();
	},
	send:function(url, mode,  callback){
		if (!this.validate()) return;
		
		var that = this;
		this.savingFlag = true;

		if (!this.block)
			this._createBlock();
		this.block.style.display = 'block';
		
		var query = this._createQuery();

		if (!this.callEvent("onBeforeSave",[this.formId,this._createHash()])){
			this.block.style.display = 'none';
			return false;
		}
		
		var cback = function(){	
			that.savingFlag = false;			
			that.block.style.display = 'none';	
			if (callback) callback(xml);
		};
		
		if (mode=="post")
			dhtmlxAjax.post(url,query,cback);
		else
			dhtmlxAjax.get(url+((url.indexOf("?")==-1)?"?":"&")+query,cback);
		
	},	
	_setDefaultValues: function(){
		for (var i in this.inputs){
			this.inputs[i].defaultValue = this._getElementValue(this.inputs[i]);
		}
	},
	reset: function(all){
		if (this.callEvent("onBeforeReset",
			[
			this.formId,
			this._createHash()
			]) == false){
			return false;
		}

		if (all == true){
			for (var i in this.inputs){
				this._setElementValue(this.inputs[i], this.inputs[i].defaultValue);
			}
		}else{
			this._loadToForm();
		}
		this.callEvent("onAfterReset", [this.formId]);
	},
	_is_css_: function(node,css){
		return (node.className.indexOf(css)!=-1)
	},
	_add_css_: function(node,css){
		node.className+=" "+css;
	},
	_del_css_: function(node,css){
		node.className=node.className.replace(new RegExp(css,"g"),"");
	},
	validate: function(){
		var invalid = [];
		var flag = true;
		
		if (this.callEvent("onBeforeValidate", [this.formId]) == false){
			return false;
		}
		var mark = (new Date()).valueOf();
		for (var i = 0; i < this.validators.length; i++){
			
			var func = this.validators[i]['validator'];
			var value = this._getElementValue(this.validators[i]['obj']);
			var res = true;

			switch (this.validators[i]['type']){
				case 'built_in':
					res = dhtmlxValidation["is"+func](value);
					break;

				case 'custom':
					res = window[func](value);
					break;

				case 'regexp':
					patt = new RegExp(this.validators[i]['validator']);
					res = patt.test(value);
			}
			var check_field = this.validators[i]['obj']['object'];
			if (check_field._invalid != mark)
				check_field._invalid=false;
			if (res !== true){
				this._add_css_(check_field,'dhtmlx_validation_error');
				check_field._invalid = mark;
				flag = false;
				this.callEvent("onValidateError",[
					check_field,
					value,
					res
				]);
			}else{
				if (this._is_css_(check_field,'dhtmlx_validation_error')
					&& (!check_field._invalid)){
					this._del_css_(check_field,"dhtmlx_validation_error");
					this.callEvent("onValidateSuccess",[
						check_field,
						value,
						res
					]);
				}
			}
		}
		
		this.callEvent("onAfterValidate", [this.formId,flag]);
		return flag;
	},
	_getElementValue: function(elem){
		var value = '';

		switch (elem['object'].tagName){
			case 'INPUT':
			case 'BUTTON':
				var elType = elem['object'].getAttribute('type');

				switch (elType.toLowerCase()){
					case undefined:
					case 'button':
					case 'hidden':
					case 'password':
					case 'reset':
					case 'submit':
					case 'text':
						value = elem['object'].value;
						break;

					case 'image':
						value = elem['object'].src;
						break;

					case 'checkbox':
						if (elem['object'].checked == true){
							value = 1;
						}else{
							value = 0;
						}

					case 'radio':
						for (var i in elem['raArray']){
							if (elem['raArray'][i].checked == true){
								value = elem['raArray'][i].value;
							}
						}
						break;

					case 'file': break;
				}
				break;

			case 'TEXTAREA':
				value = elem['object'].value;
				break;

			case 'SELECT':
				value = (elem['object'].options[elem['object'].selectedIndex]||{}).value;
				break;

			default:
				value = elem['object'].innerHTML;
				break;
		}
		return value;
	},
	_setElementValue: function(elem, value){
		switch (elem['object'].tagName){
			case 'INPUT':
			case 'BUTTON':
				var elType = elem['object'].getAttribute('type');

				switch (elType.toLowerCase()){
					case undefined:
					case 'button':
					case 'hidden':
					case 'password':
					case 'reset':
					case 'submit':
					case 'text':
						elem['object'].value = value;
						break;
						
					case 'img':
					case 'image':
						elem['object'].src = value;
						break;

					case 'checkbox':
						if (value == '1'){
							elem['object'].checked = true;
						}else{
							elem['object'].checked = false;
						}

					case 'radio':
						for (var i in elem['raArray']){
							if (elem['raArray'][i].value == value){
								elem['raArray'][i].checked = true;
							}
						}
						break;

					case 'file': break;
				}
				break;

			case 'TEXTAREA':
				elem['object'].value = value;
				break;

			case 'SELECT':
				for (var i = 0; i < elem['object'].options.length; i++){
					if (elem['object'].options[i].value == value){
						elem['object'].options[i].selected = true;
					}
				}
				break;

			default:
				elem['object'].innerHTML = value;
				break;
		}
	}
};


dhtmlXForm.prototype.items = {};

/* checkbox */
dhtmlXForm.prototype.items.checkbox = {
	
	render: function(item, data) {
		
		var td1 = document.createElement("TD");
		var td2 = document.createElement("TD");
		td1.className = "dhxlist_img_cell";
		td2.className = "dhxlist_txt_cell";
		td1.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
		td2.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
		
		item._type = "ch";
		item._enabled = true;
		item._checked = false;
		item._value = String(data.value);
		item._bind = data.bind;
		
		var p = document.createElement("DIV");
		p.className = "dhxlist_img chbx0";
		p.innerHTML = "&nbsp;";
		td1.appendChild(p);
		
		var t = document.createElement("DIV");
		t.className = "dhxlist_txt";
		t.innerHTML = "<span class='nav_link' onkeypress='e=event||window.arguments[0];if(e.keyCode==32||e.charCode==32){e.cancelBubble=true;e.returnValue=false;_dhxForm_doClick(this,\"click\");return false;}' role='link' tabindex='0'>"+data.label+'</span>';
		td2.appendChild(t);
		
		
		var k = document.createElement("INPUT");
		k.type = "HIDDEN";
		k.value = String(data.value);
		
		item.appendChild(td1);
		item.appendChild(td2);
		item.appendChild(k);
		
		if (data.checked == true) this.check(item);
		if (data.disabled == true) this.disable(item);
		
		
		var that = this;
		item.onclick = function() {
			if (!this._enabled) return;
			
			var args = [this._idd, this._value, this._checked];
			if (this.checkEvent("onBeforeChange")) if (this.callEvent("onBeforeChange", args) !== true) return;
			
			that.setChecked(this, !this._checked);
			this._autoCheck();
			// that._autoCheck();
			this.callEvent("onChange", args);
		}
		
		return this;
	},
	
	destruct: function(item) {
		
		var td1 = item.childNodes[0];
		var td2 = item.childNodes[1];
		
		td1.onselectstart = null;
		td2.onselectstart = null;
		
		while (td1.childNodes.length > 0) td1.removeChild(td1.childNodes[0]);
		while (td2.childNodes.length > 0) td2.removeChild(td2.childNodes[0]);
		
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		
		td1 = null;
		td2 = null;
		
		if (item._list) {
			for (var q=0; q<item._list.length; q++) {
				item._list[q].unload();
				var tb = item.parentNode;
				for (var w=0; w<tb.childNodes.length; w++) if (tb.childNodes[w]._type == "list" && tb.childNodes[w]._idd == item._idd) item._listObj[q].destruct(tb.childNodes[w]);
				item._listObj[q] = null;
				item._list[q] = null;
			}
		}
		
		item.onclick = null;
		item.onselectstart = null;
		item._autoCheck = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	doCheckValue: function(item) {
		if (item._checked && item._enabled) {
			item.childNodes[2].setAttribute("name", String(item._idd));
		} else {
			item.childNodes[2].removeAttribute("name");
		}
	},
	
	setChecked: function(item, state) {
		item._checked = (state===true?true:false);
		item.childNodes[0].childNodes[0].className = "dhxlist_img "+(item._checked?"chbx1":"chbx0");
		item.childNodes[1].childNodes[0].className = "dhxlist_txt "+(item._checked?"checked":"");
		this.doCheckValue(item);
	},
	
	check: function(item) {
		this.setChecked(item, true);
	},
	
	unCheck: function(item) {
		this.setChecked(item, false);
	},
	
	isChecked: function(item) {
		return item._checked;
	},
	
	enable: function(item) {
		item.className = "";
		item._enabled = true;
		item.childNodes[1].childNodes[0].childNodes[0].tabIndex = null;
		item.childNodes[1].childNodes[0].childNodes[0].removeAttribute("disabled");
		this.doCheckValue(item);
	},
	
	disable: function(item) {
		item.className = "disabled";
		item._enabled = false;
		item.childNodes[1].childNodes[0].childNodes[0].tabIndex = -1;
		item.childNodes[1].childNodes[0].childNodes[0].setAttribute("disabled", "true");
		this.doCheckValue(item);
	},
	
	isEnabled: function(item) {
		return item._enabled;
	},
	
	setText: function(item, text) {
		item.childNodes[1].childNodes[0].childNodes[0].innerHTML = text;
	},
	
	getText: function(item) {
		return item.childNodes[1].childNodes[0].childNodes[0].innerHTML;
	}
	
};

/* radio */
dhtmlXForm.prototype.items.radio = {
	
	input: {},
	
	firstValue: {},
	
	render: function(item, data,uid) {
		//group, text, value, checked, disabled, uid
		var td1 = document.createElement("TD");
		var td2 = document.createElement("TD");
		td1.className = "dhxlist_img_cell";
		td2.className = "dhxlist_txt_cell";
		td1.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
		td2.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
		
		item._type = "ra";
		item._enabled = true;
		item._checked = false;
		item._group = data.name;
		item._value = String(data.value);
		item._uid = uid;
		item._bind = data.bind;
		
		var p = document.createElement("DIV");
		p.className = "dhxlist_img rdbt0";
		td1.appendChild(p);
		
		var t = document.createElement("DIV");
		t.className = "dhxlist_txt";
		t.innerHTML = "<span class='nav_link' onkeypress='e=event||window.arguments[0];if(e.keyCode==32||e.charCode==32){e.cancelBubble=true;e.returnValue=false;_dhxForm_doClick(this,\"click\");return false;}' role='link' tabindex='0'>"+data.label+'</span>';
		td2.appendChild(t);
		
		item.appendChild(td1);
		item.appendChild(td2);
		
		if (this.input[data.name] == null) {
			var k = document.createElement("INPUT");
			k.type = "HIDDEN";
			k.name = data.name;
			k.firstValue = item._value;
			item.appendChild(k);
			this.input[data.name] = k;
		}
		
		if (!this.firstValue[data.name]) this.firstValue[data.name] = String(data.value);
		
		if (data.checked == true) this.check(item);
		if (data.disabled == true) this.disable(item);
		
		var that = this;
		item.onclick = function() {
			if (!(item._enabled && !item._checked)) return;
			var args = [this._group, this._value, true];
			if (this.checkEvent("onBeforeChange")) if (this.callEvent("onBeforeChange", args) !== true) return;
			that.setChecked(this, true);
			this._autoCheck();
			this.callEvent("onChange", args);
		}
		
		return this;
	},
	
	destruct: function(item, value) {
		
		// check if any items will left to keep hidden input on page
		if (item.childNodes[item.childNodes.length-1] == this.input[item._group]) {
			var tb = item.parentNode;
			var done = false;
			for (var q=0; q<tb.childNodes.length; q++) {
				var it = tb.childNodes[q];
				if (it._idd != item._idd && it._group == item._group && it._type == "ra" && !done) {
					it.appendChild(this.input[item._group]);
					done = true;
				}
				it = null;
			}
			if (done == false) {
				// remove hidden input
				this.input[item._group] = null;
			}
		}
		
		var id = item._idd;
		
		var td1 = item.childNodes[0];
		var td2 = item.childNodes[1];
		
		td1.onselectstart = null;
		td2.onselectstart = null;
		
		while (td1.childNodes.length > 0) td1.removeChild(td1.childNodes[0]);
		while (td2.childNodes.length > 0) td2.removeChild(td2.childNodes[0]);
		
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		
		td1 = null;
		td2 = null;
		
		if (item._list) {
			for (var q=0; q<item._list.length; q++) {
				item._list[q].unload();
				var tb = item.parentNode;
				for (var w=0; w<tb.childNodes.length; w++) if (tb.childNodes[w]._type == "list" && tb.childNodes[w]._idd == item._idd) item._listObj[q].destruct(tb.childNodes[w]);
				item._listObj[q] = null;
				item._list[q] = null;
			}
		}
		
		item.onclick = null;
		item.onselectstart = null;
		item._autoCheck = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.parentNode.removeChild(item);
		item = null;
		
		return id;
	},
	
	doCheckValue: function(item) {
		var tb = item.parentNode;
		var value = null;
		for (var q=0; q<tb.childNodes.length; q++) {
			var ra = tb.childNodes[q];
			if (ra._type == "ra" && ra._group == item._group && ra._checked && ra._enabled) value = ra._value;
		}
		if (value != null) {
			this.input[item._group].setAttribute("name", String(item._group));
			this.input[item._group].value = value;
		} else {
			this.input[item._group].removeAttribute("name");
		}
	},
	
	setChecked: function(item, state) {
		state = (state===true?true:false);
		var tb = item.parentNode;
		var group = item._group;
		for (var q=0; q<tb.childNodes.length; q++) {
			if (tb.childNodes[q]._group == group && tb.childNodes[q]._type == "ra") {
				var needCheck = false;
				var it = tb.childNodes[q];
				if (it._idd == item._idd) {
					if (it._checked != state) { it._checked = state; needCheck = true; }
				} else {
					if (it._checked) { it._checked = false; needCheck = true; }
				}
				if (needCheck) {
					it.childNodes[0].childNodes[0].className = "dhxlist_img "+(it._checked?"rdbt1":"rdbt0");
					it.childNodes[1].childNodes[0].className = "dhxlist_txt "+(it._checked?"checked":"");
				}
				it = null;
			}
		}
		this.doCheckValue(item);
	},
	
	getChecked: function(item) {
		return this.input[item._group].value;
	},
	
	_getFirstValue: function(item) {
		return this.firstValue[item._group];
	},
	
	check: function(item) {
		this.setChecked(item, true);
	},
	
	unCheck: function(item) {
		this.setChecked(item, false);
	},
	
	isChecked: function(item) {
		return item._checked;
	},
	
	enable: function(item) {
		item.className = "";
		item._enabled = true;
		item.childNodes[1].childNodes[0].childNodes[0].tabIndex = 0;
		item.childNodes[1].childNodes[0].childNodes[0].removeAttribute("disabled");
		this.doCheckValue(item);
	},
	
	disable: function(item) {
		item.className = "disabled";
		item._enabled = false;
		item.childNodes[1].childNodes[0].childNodes[0].tabIndex = -1;
		item.childNodes[1].childNodes[0].childNodes[0].setAttribute("disabled", "true");
		this.doCheckValue(item);
	},
	
	isEnabled: function(item) {
		return item._enabled;
	},
	
	setText: function(item, text) {
		item.childNodes[1].childNodes[0].childNodes[0].innerHTML = text;
	},
	
	getText: function(item) {
		return item.childNodes[1].childNodes[0].childNodes[0].innerHTML;
	}

};

dhtmlXForm.prototype.items.select = {
	
	render: function(item, data) {
		
		var td1 = document.createElement("TD");
		td1.colSpan = "2";
		td1.className = "dhxlist_txt_cell";
		td1.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
		
		item._type = "se";
		item._enabled = true;
		item._value = null;
		item._newValue = null;
		
		var j = document.createElement("DIV");
		j.className = "dhxlist_txt_label";
		j.innerHTML = data.label;
		td1.appendChild(j);
		if (data.label.length == 0) j.style.display = "none";
		
		var p = document.createElement("DIV");
		p.className = "dhxlist_cont";
		td1.appendChild(p);
		
		var t = document.createElement("SELECT");
		t.className = "dhxlist_txt_select";
		t.name = item._idd;
		p.appendChild(t);
		
		if (data.validate) t.setAttribute("validate",data.validate);
		if (data.bind) t.setAttribute("bind",data.bind);
		if (data.connector) t.setAttribute("connector",data.connector);
		if (data.width) t.style.width = parseInt(data.width)+"px";
		
		var that = this;
		t.onclick = function() {
			that.doOnChange(this);
		}
		t.onkeydown = function() {
			that.doOnChange(this);
		}
		t.onchange = function() { // needed for safari/chrome
			that.doOnChange(this);
		}
		
		var opts = data.options;
		for (var q=0; q<opts.length; q++) {
			var opt = new Option(opts[q].text||opts[q].label, opts[q].value);
			t.options.add(opt);
			if (opts[q].selected == true || opts[q].selected == "true") {
				opt.selected = true;
				item._value = opts[q].value;
			}
		}
		
		item.appendChild(td1);
		
		return this;
	},
	
	destruct: function(item) {
		
		var sel = item.childNodes[0].childNodes[1].childNodes[0];
		sel.onclick = null;
		sel.onkeydown = null;
		sel.parentNode.removeChild(sel);
		sel = null;
		
		var td1 = item.childNodes[0];
		td1.onselectstart = null;
		while (td1.childNodes.length > 0) td1.removeChild(td1.childNodes[0]);
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		td1 = null;
		
		if (item._list) {
			for (var q=0; q<item._list.length; q++) {
				item._list[q].unload();
				var tb = item.parentNode;
				for (var w=0; w<tb.childNodes.length; w++) if (tb.childNodes[w]._type == "list" && tb.childNodes[w]._idd == item._idd) item._listObj[q].destruct(tb.childNodes[w]);
				item._listObj[q] = null;
				item._list[q] = null;
			}
		}
		
		item.onselectstart = null;
		item._autoCheck = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	doOnChange: function(sel) {
		var item = sel.parentNode.parentNode.parentNode;
		item._newValue = sel.options[sel.selectedIndex].value;
		if (item._newValue != item._value) {
			if (item.checkEvent("onBeforeChange")) {
				if (item.callEvent("onBeforeChange", [item._idd, item._value, item._newValue]) !== true) {
					// restore last value
					for (var q=0; q<sel.options.length; q++) if (sel.options[q].value == item._value) sel.options[q].selected = true;
					return;
				}
			}
			item._value = item._newValue;
			item.callEvent("onChange", [item._idd, item._value]);
		}
		item._autoCheck();
	},
	
	setText: function(item, text) {
		if (!text) text = "";
		item.childNodes[0].childNodes[0].innerHTML = text;
		item.childNodes[0].childNodes[0].style.display = (text.length==0||text==null?"none":"");
	},
	
	getText: function(item) {
		return item.childNodes[0].childNodes[0].innerHTML;
	},
	
	enable: function(item) {
		item.className = "";
		item._enabled = true;
		item.childNodes[0].childNodes[1].childNodes[0].removeAttribute("disabled");
	},
	
	disable: function(item) {
		item.className = "disabled";
		item._enabled = false;
		item.childNodes[0].childNodes[1].childNodes[0].setAttribute("disabled", true);
	},
	
	getOptions: function(item) {
		return item.childNodes[0].childNodes[1].childNodes[0].options;
	},
	
	setValue: function(item, val) {
		var opts = this.getOptions(item);
		for (var q=0; q<opts.length; q++) if (opts[q].value == val) opts[q].selected = true;
	},
	
	getValue: function(item) {
		var k = -1;
		var opts = this.getOptions(item);
		for (var q=0; q<opts.length; q++) if (opts[q].selected) k = opts[q].value;
		return k;
	},
	
	setWidth: function(item, width) {
		item.childNodes[0].childNodes[1].childNodes[0].style.width = width+"px";
	}
	
	
};

/* input */

dhtmlXForm.prototype.items.input = {
	
	render: function(item, data) {
		
		var td1 = document.createElement("TD");
		td1.colSpan = "2";
		td1.className = "dhxlist_txt_cell";
		
		item._type = "ta";
		item._enabled = true;
		
		var j = document.createElement("DIV");
		j.className = "dhxlist_txt_label";
		j.innerHTML = data.label;
		td1.appendChild(j);
		if (data.label.length == 0) j.style.display = "none";
		
		var p = document.createElement("DIV");
		p.className = "dhxlist_cont";
		td1.appendChild(p);
		
		if (isNaN(data.rows)) {
			var t = document.createElement("INPUT");
			t.type = "TEXT";
		} else {
			var t = document.createElement("TEXTAREA");
			t.style.height = 14*(data.rows||1)+"px"
		}
		if (data.validate)
			t.setAttribute("validate",data.validate);
		if (data.bind)
			t.setAttribute("bind",data.bind);
		if (data.width)
			t.style.width = parseInt(data.width)+"px";
			
		t.name = item._idd;
		t._idd = item._idd;
		t.className = "dhxlist_txt_textarea";
		p.appendChild(t);
		
		t.value = (data.value||"");
		item._value = t.value;
		
		item.appendChild(td1);
		
		t.onblur = function() {
			if (item.checkEvent("onBeforeChange")) if (item.callEvent("onBeforeChange",[this._idd, item._value, this.value]) !== true) {
				// restore
				this.value = item._value;
				return;
			}
			// accepted
			item._value = this.value;
			item.callEvent("onChange",[this._idd, this.value]);
		}
		
		return this;
		
	},
	
	destruct: function(item) {
		
		var inp = item.childNodes[0].childNodes[1].childNodes[0];
		inp.onblur = null;
		inp.parentNode.removeChild(inp);
		inp = null;
		
		var td1 = item.childNodes[0];
		td1.onselectstart = null;
		while (td1.childNodes.length > 0) td1.removeChild(td1.childNodes[0]);
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		td1 = null;
		
		if (item._list) {
			for (var q=0; q<item._list.length; q++) {
				item._list[q].unload();
				var tb = item.parentNode;
				for (var w=0; w<tb.childNodes.length; w++) if (tb.childNodes[w]._type == "list" && tb.childNodes[w]._idd == item._idd) item._listObj[q].destruct(tb.childNodes[w]);
				item._listObj[q] = null;
				item._list[q] = null;
			}
		}
		
		item.onselectstart = null;
		item._autoCheck = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	setText: function(item, text) {
		if (!text) text = "";
		item.childNodes[0].childNodes[0].innerHTML = text;
		item.childNodes[0].childNodes[0].style.display = (text.length==0||text==null?"none":"");
	},
	
	getText: function(item) {
		return item.childNodes[0].childNodes[0].innerHTML;
	},
	
	setValue: function(item, value) {
		item.childNodes[0].childNodes[1].childNodes[0].value = value;
	},
	
	getValue: function(item) {
		return item.childNodes[0].childNodes[1].childNodes[0].value;
	},
	
	enable: function(item) {
		item.className = "";
		item._enabled = true;
		item.childNodes[0].childNodes[1].childNodes[0].removeAttribute("disabled");
	},
	
	disable: function(item) {
		item.className = "disabled";
		item._enabled = false;
		item.childNodes[0].childNodes[1].childNodes[0].setAttribute("disabled", true);
	},
	
	setWidth: function(item, width) {
		item.childNodes[0].childNodes[1].childNodes[0].style.width = width+"px";
	}
	
	
};

/* password */
dhtmlXForm.prototype.items.password = {
	
	render: function(item, data) {
		
		var td1 = document.createElement("TD");
		td1.colSpan = "2";
		td1.className = "dhxlist_txt_cell";
		
		item._type = "pw";
		item._enabled = true;
		
		var j = document.createElement("DIV");
		j.className = "dhxlist_txt_label";
		j.innerHTML = data.label;
		td1.appendChild(j);
		if (data.label.length == 0) j.style.display = "none";
		
		var p = document.createElement("DIV");
		p.className = "dhxlist_cont";
		td1.appendChild(p);
		
		var t = document.createElement("INPUT");
		t.type = "PASSWORD";
		
		if (data.validate)
			t.setAttribute("validate",data.validate);
		if (data.bind)
			t.setAttribute("bind",data.bind);
		if (data.width)
			t.style.width = parseInt(data.width)+"px";
			
		t.name = item._idd;
		t._idd = item._idd;
		t.className = "dhxlist_txt_textarea";
		p.appendChild(t);
		
		t.value = (data.value||"");
		item._value = t.value;
		
		item.appendChild(td1);
		
		t.onblur = function() {
			if (item.checkEvent("onBeforeChange")) if (item.callEvent("onBeforeChange",[this._idd, item._value, this.value]) !== true) {
				// restore
				this.value = item._value;
				return;
			}
			// accepted
			item._value = this.value;
			item.callEvent("onChange",[this._idd, this.value]);
		}
		
		return this;
		
	},
	
	destruct: function(item) {
		
		var inp = item.childNodes[0].childNodes[1].childNodes[0];
		inp.onblur = null;
		inp.parentNode.removeChild(inp);
		inp = null;
		
		var td1 = item.childNodes[0];
		td1.onselectstart = null;
		while (td1.childNodes.length > 0) td1.removeChild(td1.childNodes[0]);
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		td1 = null;
		
		if (item._list) {
			for (var q=0; q<item._list.length; q++) {
				item._list[q].unload();
				var tb = item.parentNode;
				for (var w=0; w<tb.childNodes.length; w++) if (tb.childNodes[w]._type == "list" && tb.childNodes[w]._idd == item._idd) item._listObj[q].destruct(tb.childNodes[w]);
				item._listObj[q] = null;
				item._list[q] = null;
			}
		}
		
		item.onselectstart = null;
		item._autoCheck = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	setText: function(item, text) {
		if (!text) text = "";
		item.childNodes[0].childNodes[0].innerHTML = text;
		item.childNodes[0].childNodes[0].style.display = (text.length==0||text==null?"none":"");
	},
	
	getText: function(item) {
		return item.childNodes[0].childNodes[0].innerHTML;
	},
	
	setValue: function(item, value) {
		item.childNodes[0].childNodes[1].childNodes[0].value = value;
	},
	
	getValue: function(item) {
		return item.childNodes[0].childNodes[1].childNodes[0].value;
	},
	
	enable: function(item) {
		item.className = "";
		item._enabled = true;
		item.childNodes[0].childNodes[1].childNodes[0].removeAttribute("disabled");
	},
	
	disable: function(item) {
		item.className = "disabled";
		item._enabled = false;
		item.childNodes[0].childNodes[1].childNodes[0].setAttribute("disabled", true);
	},
	
	setWidth: function(item, width) {
		item.childNodes[0].childNodes[1].childNodes[0].style.width = width+"px";
	}
	
	
};


/* file */
dhtmlXForm.prototype.items.file = {
	
	render: function(item, data) {
		
		var td1 = document.createElement("TD");
		td1.colSpan = "2";
		td1.className = "dhxlist_txt_cell";
		
		item._type = "fl";
		item._enabled = true;
		
		var j = document.createElement("DIV");
		j.className = "dhxlist_txt_label";
		j.innerHTML = data.label;
		td1.appendChild(j);
		if (data.label.length == 0) j.style.display = "none";
		
		var p = document.createElement("DIV");
		p.className = "dhxlist_cont";
		td1.appendChild(p);
		
		var t = document.createElement("INPUT");
		t.type = "FILE";
		
		if (data.validate) t.setAttribute("validate",data.validate);
		if (data.bind) t.setAttribute("bind",data.bind);
		if (data.width) t.style.width = parseInt(data.width)+"px";
				
		t.name = item._idd;
		t._idd = item._idd;
		t.className = "dhxlist_txt_textarea";
		p.appendChild(t);
		
		t.value = (data.value||"");
		item._value = t.value;
		
		item.appendChild(td1);
		
		return this;
		
	},
	
	destruct: function(item) {
		
		var inp = item.childNodes[0].childNodes[1].childNodes[0];
		inp.onblur = null;
		inp.parentNode.removeChild(inp);
		inp = null;
		
		var td1 = item.childNodes[0];
		td1.onselectstart = null;
		while (td1.childNodes.length > 0) td1.removeChild(td1.childNodes[0]);
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		td1 = null;
		
		if (item._list) {
			for (var q=0; q<item._list.length; q++) {
				item._list[q].unload();
				var tb = item.parentNode;
				for (var w=0; w<tb.childNodes.length; w++) if (tb.childNodes[w]._type == "list" && tb.childNodes[w]._idd == item._idd) item._listObj[q].destruct(tb.childNodes[w]);
				item._listObj[q] = null;
				item._list[q] = null;
			}
		}
		
		item.onselectstart = null;
		item._autoCheck = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	setText: function(item, text) {
		if (!text) text = "";
		item.childNodes[0].childNodes[0].innerHTML = text;
		item.childNodes[0].childNodes[0].style.display = (text.length==0||text==null?"none":"");
	},
	
	getText: function(item) {
		return item.childNodes[0].childNodes[0].innerHTML;
	},
	
	enable: function(item) {
		item.className = "";
		item._enabled = true;
		item.childNodes[0].childNodes[1].childNodes[0].removeAttribute("disabled");
	},
	
	disable: function(item) {
		item.className = "disabled";
		item._enabled = false;
		item.childNodes[0].childNodes[1].childNodes[0].setAttribute("disabled", true);
	},
	
	setWidth: function(item, width) {
		item.childNodes[0].childNodes[1].childNodes[0].style.width = width+"px";
	}
	
	
};


/* label */

dhtmlXForm.prototype.items.label = {
	
	render: function(item, data) {
		
		var td1 = document.createElement("TD");
		td1.colSpan = "2";
		td1.className = "dhxlist_txt_label2";
		td1.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
		
		item.appendChild(td1);
		
		item._type = "lb";
		item._enabled = true;
		item._checked = true;
		
		
		var t = document.createElement("DIV");
		t.className = "dhxlist_txt_label2"+(data._isTopmost?" topmost":"");
		t.innerHTML = data.label;
		td1.appendChild(t);
		
		
		return this;
	},
	
	destruct: function(item) {
		
		var td1 = item.childNodes[0];
		td1.onselectstart = null;
		while (td1.childNodes.length > 0) td1.removeChild(td1.childNodes[0]);
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		td1 = null;
		
		if (item._list) {
			for (var q=0; q<item._list.length; q++) {
				item._list[q].unload();
				var tb = item.parentNode;
				for (var w=0; w<tb.childNodes.length; w++) if (tb.childNodes[w]._type == "list" && tb.childNodes[w]._idd == item._idd) item._listObj[q].destruct(tb.childNodes[w]);
				item._listObj[q] = null;
				item._list[q] = null;
			}
		}
		
		item.onselectstart = null;
		item._autoCheck = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	enable: function(item) {
		item.className = "";
		item._enabled = true;
	},
	
	disable: function(item) {
		item.className = "disabled";
		item._enabled = false;
	},
	
	isEnabled: function(item) {
		return item._enabled;
	},
	
	setText: function(item, text) {
		item.childNodes[0].childNodes[0].innerHTML = text;
	},

	getText: function(item) {
		return item.childNodes[0].childNodes[0].innerHTML;
	}
	
};

dhtmlXForm.prototype.items.button = {
	
	render: function(item, data) {
		
		var td1 = document.createElement("TD");
		td1.colSpan = "2";
		
		td1.innerHTML = '<div class="dhx_list_btn" role="link" tabindex="0" dir="ltr" '+
					'onkeypress="e=event||window.arguments[0];if((e.keyCode==32||e.charCode==32)&&!this.parentNode._busy){this.parentNode._busy=true;e.cancelBubble=true;e.returnValue=false;_dhxForm_doClick(this.childNodes[0],[\'mousedown\',\'mouseup\']);return false;}" '+
					'onblur="_dhxForm_doClick(this.childNodes[0],\'mouseout\');" >'+
					'<table cellspacing="0" cellpadding="0" border="0" align="left">'+
						'<tr>'+
							'<td class="btn_l">&nbsp;</td>'+
							'<td class="btn_m"><div class="btn_txt">'+data.value+'</div></td>'+
							'<td class="btn_r">&nbsp;</td>'+
						'</tr>'+
					'</table>'+
				"</div>";
		
		td1._type = "bt";
		td1._enabled = true;
		td1._cmd = data.command;
		td1._name = data.name;
		
		item.type = "bt";
		
		item.appendChild(td1);
		
		// item onselect start also needed once
		// will reconstructed!
		
		td1.onselectstart = function(e){e=e||event;e.cancelBubble=true;e.returnValue=false;return false;}
		
		td1.childNodes[0].childNodes[0].onmouseover = function(){
			var td1 = this.parentNode.parentNode;
			if (!td1._enabled) return;
			this._isOver = true;
			this.className = "dhx_list_btn_over";
			td1 = null;
		}
		td1.childNodes[0].childNodes[0].onmouseout = function(){
			var td1 = this.parentNode.parentNode;
			if (!td1._enabled) return;
			this.className = "";
			this._allowClick = false;
			this._pressed = false;
			this._isOver = false;
			td1 = null;
		}
		td1.childNodes[0].childNodes[0].onmousedown = function(){
			if (this._pressed) return;
			var td1 = this.parentNode.parentNode;
			if (!td1._enabled) return;
			this.className = "dhx_list_btn_pressed";
			this._allowClick = true;
			this._pressed = true;
			td1 = null;
		}
		
		td1.childNodes[0].childNodes[0].onmouseup = function(){
			if (!this._pressed) return;
			var td1 = this.parentNode.parentNode;
			if (!td1._enabled) return;
			td1._busy = false;
			this.className = (this._isOver?"dhx_list_btn_over":"");
			if (this._pressed && this._allowClick) item.callEvent("_onButtonClick", [td1._name, td1._cmd]);
			this._allowClick = false;
			this._pressed = false;
			td1 = null;
		}
		
		return this;
	},
	
	destruct: function(item) {
		
		var t = item.childNodes[0].childNodes[0].childNodes[0];
		t.onmouseover = null;
		t.onmouseout = null;
		t.onmousedown = null;
		t.onmouseup = null;
		t = null;
		
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		
		if (item._list) {
			for (var q=0; q<item._list.length; q++) {
				item._list[q].unload();
				var tb = item.parentNode;
				for (var w=0; w<tb.childNodes.length; w++) if (tb.childNodes[w]._type == "list" && tb.childNodes[w]._idd == item._idd) item._listObj[q].destruct(tb.childNodes[w]);
				item._listObj[q] = null;
				item._list[q] = null;
			}
		}
		
		item.onselectstart = null;
		item._autoCheck = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	enable: function(item) {
		item.className = "";
		item._enabled = true;
		item.childNodes[0]._enabled = true;
		item.childNodes[0].childNodes[0].tabIndex = 0;
		item.childNodes[0].childNodes[0].removeAttribute("disabled");
	},
	
	disable: function(item) {
		item.className = "disabled";
		item._enabled = false;
		item.childNodes[0]._enabled = false;
		item.childNodes[0].childNodes[0].tabIndex = -1;
		item.childNodes[0].childNodes[0].setAttribute("disabled", "true");
	},
	
	isEnabled: function(item) {
		return item._enabled;
	},
	
	setText: function(item, text) {
		item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].innerHTML = text;
	},

	getText: function(item) {
		return item.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].innerHTML;
	}
	
};

/* hidden item */
dhtmlXForm.prototype.items.hidden = {
	
	render: function(item, data) {
		
		item.style.display = "none";
		
		var td = document.createElement("TD");
		td.colspan = 2;
		td.innerHTML = '<input type="HIDDEN" name="'+data.name+'" value="'+data.value+'">';
		item.appendChild(td);
		
		item._name = data.name;
		item._type = "hd";
		item._enabled = true;
		
		
		return this;
	},
	
	destruct: function(item) {
		
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		
		if (item._list) {
			for (var q=0; q<item._list.length; q++) {
				item._list[q].unload();
				var tb = item.parentNode;
				for (var w=0; w<tb.childNodes.length; w++) if (tb.childNodes[w]._type == "list" && tb.childNodes[w]._idd == item._idd) item._listObj[q].destruct(tb.childNodes[w]);
				item._listObj[q] = null;
				item._list[q] = null;
			}
		}
		
		item.onselectstart = null;
		item._autoCheck = null;
		item.callEvent = null;
		item.checkEvent = null;
		item.parentNode.removeChild(item);
		item = null;
		
	},
	
	enable: function(item) {
		item._enabled = true;
		item.childNodes[0].childNodes[0].setAttribute("name", item._name);
	},
	
	disable: function(item) {
		item._enabled = false;
		item.childNodes[0].childNodes[0].removeAttribute("name");
	},
	
	isEnabled: function(item) {
		return this._enabled;
	},
	
	show: function() {
		
	},
	
	hide: function() {
		
	},
	
	isHidden: function() {
		return true;
	},
	
	setValue: function(item, val) {
		item.childNodes[0].childNodes[0].value = val;
	},
	
	getValue: function(item) {
		return item.childNodes[0].childNodes[0].value;
	}
	
};

/* sub list */
dhtmlXForm.prototype.items.list = {
	
	render: function(item, type) {
		
		var td2 = document.createElement("TD");
		td2.className = "dhxlist_txt_cell";
		
		item._type = "list";
		item._enabled = true;
		
		var t = document.createElement("DIV");
		t._isNestedForm = true;
		t.style.width = "100%";
		
		
		if (item._fs === true) {
			
			td2.colSpan = "2";
			item.appendChild(td2);
			
			var t2 = document.createElement("FIELDSET");
			t2.className = "dhxlist_fs";
			t2.style.width = type._fsWidth;
			td2.appendChild(t2);
			t2.innerHTML = "<legend class='fs_legend'>"+type._fsText+"</legend>";
			t2.appendChild(t)
		} else {
			var td1 = document.createElement("TD");
			td1.className = "dhxlist_img_cell";
			td1.onselectstart = function(e){e=e||event;e.returnValue=false;return false;}
			td1.innerHTML = "&nbsp;";
			item.appendChild(td1);
			item.appendChild(td2);
			td2.appendChild(t);
		}
		
		var listData = [this, new dhtmlXForm(t, type)];
		return listData;
	},
	
	destruct: function(item) {
		
		var td1 = item.childNodes[0];
		var td2 = item.childNodes[1];
		
		td1.onselectstart = null;
		
		while (td1.childNodes.length > 0) td1.removeChild(td1.childNodes[0]);
		while (td2.childNodes.length > 0) td2.removeChild(td2.childNodes[0]);
		
		while (item.childNodes.length > 0) item.removeChild(item.childNodes[0]);
		
		td1 = null;
		td2 = null;
		
		item.parentNode.removeChild(item);
		item = null;
		
	}
};

/* fieldset */
dhtmlXForm.prototype.items.fieldset = {
	
	render: function(item, data) {
		
		var td1 = document.createElement("TD");
		var td2 = document.createElement("TD");
		item.appendChild(td1);
		item.appendChild(td2);
		td2.innerHTML = data.label;
		item.style.display = "none";
		
		item._enabled = true;
		item._checked = true;
		
		item._width = (data.width||"100%");
		
		return this;
		
	},
	
	destruct: function(item) {
		
		
	},
	
	setText: function(item, text) {
		item.childNodes[1].innerHTML = text;
	},
	
	getText: function(item) {
		return item.childNodes[1].innerHTML;
	},
	
	enable: function(item) {
		item._enabled = true;
		item._fs.className = "";
	},
	
	disable: function(item) {
		item._enabled = false;
		item._fs.className = "disabled";
	},
	
	isEnabled: function(item) {
		return item._enabled;
	},
	
	setWidth: function(item, width) {
		item._fs.childNodes[0].childNodes[0].style.width = width;
		item._width = width;
	},
	
	getWidth: function(item) {
		return item._width;
	}
	
	
	
};

//loading from UL list

dhtmlXForm.prototype._ulToObject = function(ulData, a) {
	var obj = [];
	for (var q=0; q<ulData.childNodes.length; q++) {
		if (String(ulData.childNodes[q].tagName||"").toLowerCase() == "li") {
			var p = {};
			var t = ulData.childNodes[q];
			for (var w=0; w<a.length; w++) if (t.getAttribute(a[w]) != null) p[String(a[w]).replace("ftype","type")] = t.getAttribute(a[w]);
			if (!p.label) try { p.label = t.firstChild.nodeValue; } catch(e){}
			var n = t.getElementsByTagName("UL");
			if (n[0] != null) p[(p.type=="select"?"options":"list")] = dhtmlXForm.prototype._ulToObject(n[0], a);
			obj[obj.length] = p;
		}
		if (String(ulData.childNodes[q].tagName||"").toLowerCase() == "div") {
			var p = {};
			p.type = "label";
			try { p.label = ulData.childNodes[q].firstChild.nodeValue; } catch(e){}
			obj[obj.length] = p;
		}
	}
	return obj;
}

dhtmlxEvent(window, "load", function(){
	var a = ["ftype", "name", "value", "label", "check", "checked", "disabled", "text", "rows", "select", "selected", "command"];
	var k = document.getElementsByTagName("UL");
	var u = [];
	for (var q=0; q<k.length; q++) {
		if (k[q].className == "dhtmlxForm") {
			var listNode = document.createElement("DIV");
			u[u.length] = [k[q], listNode, dhtmlXForm.prototype._ulToObject(k[q], a)];
		}
	}
	for (var q=0; q<u.length; q++) {
		u[q][0].parentNode.insertBefore(u[q][1], u[q][0]);
		var listObj = new dhtmlXForm(u[q][1], u[q][2]);
		u[q][0].parentNode.removeChild(u[q][0]);
		u[q][0] = null;
		u[q][1] = null;
		u[q][2] = null;
		u[q] = null;
	}
});


//all purpose set of rules, based on http://code.google.com/p/validation-js
dhtmlxValidation=function(){}
dhtmlxValidation.prototype={
	trackInput:function(el,rule,callback_error,callback_correct){
			dhtmlxEvent(el,"keyup",function(e){ 
				if (!dhtmlxValidation.checkInput(el,rule)){
					if(!callback_error || callback_error(el,el.value,rule))
						el.className+=" dhtmlx_live_validation_error";
				} else {
					el.className=el.className.replace(/[ ]*dhtmlx_live_validation_error/g,"");
					if (callback_correct)
						callback_correct(el,el.value,rule);
				}
			});
	},
	checkInput:function(input,rule){
		return this.checkValue(input.value,rule);
	},
	checkValue:function(value,rule){
		if (!rule) return;
		if (typeof rule!="string" && rule.length){
			var final_res=true;
			for (var i=0; i<rule.length; i++){
				var res=this.checkValue(value,rule[i]);
				final_res=final_res&&res;
			}
			return final_res;
		}
		if (!this["is"+rule]) alert("Incorrect validation rule: "+rule);
		return this["is"+rule](value);
	},
	
	isEmpty: function(value) {
		return value == '';
	},
	isNotEmpty: function(value) {
		return !value == '';
	},
	isValidBoolean: function(value) {
		return !!value.match(/^(0|1|true|false)$/);
	},
	isValidEmail: function(value) {
		return !!value.match(/(^[a-z]([a-z0-9_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\-\.]*)(\.[a-z]{2,3})$)/i); 
	},
	isValidInteger: function(value) {
		return !!value.match(/(^-?\d+$)/);
	},
	isValidNumeric: function(value) {
		return !!value.match(/(^-?\d\d*[\.|,]\d*$)|(^-?\d\d*$)|(^-?[\.|,]\d\d*$)/);
	},
	isValidAplhaNumeric: function(value) {
		return !!value.match(/^[_\-a-z0-9]+$/gi);
	},
	// 0000-00-00 00:00:00 to 9999:12:31 59:59:59 (no it is not a "valid DATE" function)
	isValidDatetime: function(value) {
		var dt = value.match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/);
		return dt && !!(dt[1]<=9999 && dt[2]<=12 && dt[3]<=31 && dt[4]<=59 && dt[5]<=59 && dt[6]<=59) || false;
	},
	// 0000-00-00 to 9999-12-31
	isValidDate: function(value) {
		var d = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		return d && !!(d[1]<=9999 && d[2]<=12 && d[3]<=31) || false;
	},
	// 00:00:00 to 59:59:59
	isValidTime: function(value) {
		var t = value.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
		return t && !!(t[1]<=24 && t[2]<=59 && t[3]<=59) || false;
	},
	// 0.0.0.0 to 255.255.255.255
	isValidIPv4: function(value) { 
		var ip = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
		return ip && !!(ip[1]<=255 && ip[2]<=255 && ip[3]<=255 && ip[4]<=255) || false;
	},
	isValidCurrency: function(value) { // Q: Should I consider those signs valid too ? : ¢|€|₤|₦|¥
		return value.match(/^\$?\s?\d+?[\.,\,]?\d+?\s?\$?$/) && true || false;
	},
	// Social Security Number (999-99-9999 or 999999999)
	isValidSSN: function(value) {
		return value.match(/^\d{3}\-?\d{2}\-?\d{4}$/) && true || false;
	},
	// Social Insurance Number (999999999)
	isValidSIN: function(value) {
		return value.match(/^\d{9}$/) && true || false;
	}	
}
dhtmlxValidation=new dhtmlxValidation();

// extended container functionality
if (window.dhtmlXContainer) {
	// attach form functionality
	if (!dhtmlx.attaches) dhtmlx.attaches = {};
	if (!dhtmlx.attaches["attachForm"]) {
		dhtmlx.attaches["attachForm"] = function(data) {
			var obj = document.createElement("DIV");
			obj.id = "dhxFormObj_"+this._genStr(12);
			obj.style.position = "relative";
			obj.style.width = "100%";
			obj.style.height = "100%";
			obj.cmp = "form";
			this.attachObject(obj);
			//
			this.vs[this.av].form = new dhtmlXForm(obj, data);
			this.vs[this.av].form.setSkin(this.skin);
			this.vs[this.av].form.setSizes();
			//this.formId = obj.id;
			this.vs[this.av].formObj = obj;
			return this.vs[this.av].form;
		}
	}
	// detach form functionality
	if (!dhtmlx.detaches) dhtmlx.detaches = {};
	if (!dhtmlx.detaches["detachForm"]) {
		dhtmlx.detaches["detachForm"] = function(contObj) {
			if (!contObj.form) return;
			contObj.form.unload();
			contObj.form = null;
			//contObj.formId = null;
			contObj.formObj = null;
			contObj.attachForm = null;
		}
	}
}

dhtmlXForm.prototype.dummy = function(){
};
dhtmlXForm.prototype._changeFormId = function(oldid, newid){
	this.formId = newid;
};
dhtmlXForm.prototype._dp_init=function(dp){
	dp._methods=["dummy","","_changeFormId","dummy"];
	
	dp._getRowData=function(id,pref){
		return this.obj._createQuery(pref);
	}
	dp._clearUpdateFlag=function(){}
	
	dp.attachEvent("onAfterUpdate",function(sid, action, tid){
		if (action == "inserted" || action == "updated")
			dp.setUpdated(this.obj.formId, true, "updated");
		return true;
	});
	dp.autoUpdate = false;
	this.dp = dp;
	this.formId = (new Date()).valueOf();
	this.resetDataProcessor("inserted");
}
dhtmlXForm.prototype.setUserData=function(id,name,value){
	if (!this._userdata) 
		this._userdata={};
	this._userdata[id] = (this._userdata[id]||{});
	this._userdata[id][name] = value;
}
dhtmlXForm.prototype.getUserData=function(id,name){
	if (this._userdata)
		return ((this._userdata[id]||{})[name])||"";
	return "";
}
dhtmlXForm.prototype.resetDataProcessor=function(mode){
	if (!this.dp) return;
	this.dp.updatedRows = []; this.dp._in_progress = [];
	this.dp.setUpdated(this.formId,true,mode);
}


dhtmlXForm.prototype.setRTL = function(state) {
	this._rtl = (state===true?true:false);
	this.base.className = (this._rtl?"dhxform_rtl":"");
}

_dhxForm_doClick = function(obj, evType) {
	if (typeof(evType) == "object") {
		var t = evType[1];
		evType = evType[0];
	}
	if (document.createEvent) {
		var e = document.createEvent("MouseEvents");
		e.initEvent(evType, true, false);
		obj.dispatchEvent(e);
	} else if (document.createEventObject) {
		var e = document.createEventObject();
		e.button = 1;
		obj.fireEvent("on"+evType, e);
	}
	if (t) window.setTimeout(function(){_dhxForm_doClick(obj,t);},100);
}