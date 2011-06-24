function SiteSettings(obj){
	//objects	
	this.obj = obj;
	this.dhxTab = {};
	this.objPull = {};
	this.itemPull = {};
	
	//create objects
	this.createTabbar();

	//add content to tabs
	this.addTabContent('getMainTabContent', 'main');
	//this.addTabContent('getLanguageTabContent', 'language');
	this.addTabContent('getColorTabContent', 'color');
	
	jQuery(document.body).append(jQuery('<iframe id="iframe" style="display:none;" name="iframe:settings">'))
}

SiteSettings.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("site_settings", "SiteSettings", func, params, function(req){
				callback(req);
		})
	},
	createTabbar:function(){
		//create object
		var tabbar= new dhtmlXTabBar(this.obj,"top");
		tabbar.setSkin("dhx_skyblue");
		tabbar.setImagePath(storage.url+'modules/site_settings/img/');
		tabbar.addTab("main","Main","100px");
		tabbar.addTab("language","Language","100px");
		tabbar.addTab("color","Color","100px");
		tabbar.setTabActive('main');
		
		//storage object
		this.dhxTab = tabbar;
	},
	addTabContent:function(func, tab){
		var t = this;
		this.ajax(func, null, function(req){
			var div = document.createElement('div');
			t.objPull[tab] = div;
			jQuery(div).addClass('site-settings-body');
			jQuery(div).html(req.responseText);
			t.dhxTab.cells(tab).attachObject(div);
			t.setIndivEvents(tab);
		});
	},
	setIndivEvents:function(tab){
		switch(tab){
			case 'main':
				this.setSubmitEventHandler('main');
			break;
			
			case 'language':
				this.setChangeEventHandler();
				this.setModuleDelEvent();
			break;
			
			case 'color':
				this.setColorPicker(); 
			break;
		}
	},
	setColorPicker:function(){
		var t = this;
		var div = this.objPull['color'];
		jQuery(div).find('input').ColorPicker({
			onSubmit: function(hsb, hex, rgb, el) {
				jQuery(el).val(hex);
				jQuery(el).ColorPickerHide();
				t.ajax('saveParam',jQuery(el).attr('id')+':'+hex, function(req){})
			},
			onBeforeShow: function () {
				jQuery(this).ColorPickerSetColor(this.value);
			}
		})
		.bind('keyup', function(){
			jQuery(this).ColorPickerSetColor(this.value);
		});
	},
	setSubmitEventHandler:function(tab){
		var t = this;
		var div = this.objPull[tab];
		jQuery(div).find('.site-settings-save input').click(function(){
			var params = '';
			jQuery(div).find('input,textarea').each(function(i,e){
				if(jQuery(e).val() != 'Save') {
					params += jQuery(e).attr('id')+':'+encodeURI(jQuery(e).val());
					params += ';';
				}
			})
			params = params.substr(0, params.length - 1);
			t.ajax('saveParams', params, function(req){});
		})
	},
	loadModuleList:function(value){
		var t = this;
		var div = this.objPull['language'];
		this.ajax('getModulesList', value,function(req){
			jQuery('.site-settings-modules').html(req.responseText);
			t.setModuleDelEvent();
		});
	},
	setModuleDelEvent:function(){
		var t = this;
		var div = this.objPull['language'];
		jQuery(div).find('.site-settings-modules-delete').click(function(){
			var del = this;
			t.ajax('deleteModuleLanguage',jQuery(this).attr('id'), function(){
				jQuery(del).parent().parent().remove();
			});
		});
	},
	setChangeEventHandler:function(){
		var t = this;
		var div = this.objPull['language'];
		t.itemPull['select'] = jQuery(div).find('select');
		t.itemPull['select'].old_value = jQuery(t.itemPull['select']).val();
		//event handler save button click
		jQuery(div).find('.site-settings-save input').click(function(){
			t.ajax('setLanguage',jQuery(div).find('select').val(),function(){});
		});
		//event handler when change option in select
		jQuery(div).find('select').change(function(){
			if(jQuery(this).val() == 'add'){
				var select = this;
				var dialog = document.createElement('div');
				var content = jQuery('<div><table><tr><td><div class="site-settings-label">Name:</div></td><td><div class="site-settings-input"><input style="width:180px;" name="language_name" type="text"></div></td></tr><tr><td><div class="site-settings-label">Type:</div></td><td><div class="site-settings-input"><input style="width:180px;" name="language_value" type="text"></div></td></tr></table></div>');
				jQuery(dialog).dialog({
					autoOpen: false,
					title: 'Add new Language',
					width: 320,
					height: 150,
					resizable: false,
					position: 'center',
					modal: true,
					buttons:{
						'Save':function(){ 
							var name, value;
							name = jQuery(content).find('input[name="language_name"]').val();
							value = jQuery(content).find('input[name="language_value"]').val();
							t.ajax('addNewLanguage',name+';'+value, function(req){
								jQuery(select).find('option[value="add"]').before(jQuery('<option></option>').val(value).html(name));
								jQuery(dialog).dialog('close');
							})
						}
					},
					close:function(){ 
						jQuery(select).find('option[value="'+t.itemPull['select'].old_value+'"]').attr('selected', 'selected');
					}
				});
				jQuery(dialog).append(content);
				jQuery(dialog).dialog('open');
				
			}
			else {
				t.itemPull['select'].old_value = jQuery(this).val();
				t.loadModuleList(jQuery(this).val());
			}
		});
		//event handler delete button click
		jQuery(div).find('.site-settings-delete').click(function(){
			var select = t.itemPull['select'];
			var value = jQuery(select).val()
			if(select[0].options.length == 2) { return; }
			t.ajax('deleteLanguage', value, function(req){
				jQuery(select).find('option[value="'+value+'"]').remove();
				t.itemPull['select'].old_value = jQuery(t.itemPull['select']).val();
			});
		})
	}
};



