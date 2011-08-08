function SiteSettings(obj){
	//vars
	this.header = null;
	this.body = null;
	this.rows = null;
	this.offsetParent = null;
	this.activeTab = null;
	this.activeLang = null;
	this.activeMod = null;
	this.langJSON = null;
	this.modJSON = null;
	this.titleNum = 0;
	this.valueNum = 0;
	
	//set vars
	this.offsetParent = jQuery('#'+obj);	
	this.body = jQuery('<div class="site-settings-container"><div class="settings-tabs"></div><div class="settings-content"></div></div>');
	this.progressbar = jQuery('<div class="settings-progressbar">&nbsp;</div>');
	this.iframe = jQuery('<iframe id="iframe-settings" name="iframe-settings" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">')
		
	//create
	this.createTabs();
	
	//append
	jQuery(this.offsetParent).append(this.body);
	if(jQuery('#iframe-settings').length==0){
		jQuery(document.body).append(this.iframe);
	}
	_A = this;
}

SiteSettings.prototype = {
	_ajax:function(args){
		var self = this;
		return {
			getLanguages:function(func){
				self.ajax('getLanguages',args,function(res){
					var json = jQuery.parseJSON(res.responseText);
					self.langJSON = json;
					self[func](json);
				});
			},
			getModules:function(func){
				self.ajax('getModules',args,function(res){
					var json = jQuery.parseJSON(res.responseText);
					self.modJSON = json;
					self[func](json, args);
				});
			}
		}
	},
	ajax:function(func, params, callback){
		var self = this;
		self.modal(true);
		host.callMethod("site_settings", "SiteSettings", func, params, function(req){
				self.modal(false);
				callback(req);
		})
	},
	ajaxForm:function(obj, method, args,beforeSubmit, callback){
		var self = this;
		var sb = host.stringBuffer();
		var url = sb._('index.php?option=com_manager&task=callMethod&module=site_settings&class=SiteSettings&method=')._(method)._('&args=')._(args).result();
		self.modal(true);
		jQuery(obj).ajaxForm({
			url:url,
			dataType:"json",
			target:"#iframe-settings",
			beforeSubmit:function(){
				return beforeSubmit();	
			},
			success:function(data){
				self.modal(false);
				callback(data);
			}
		});
	}, 
	modal:function(f){
		if(f){
			var width=jQuery(this.offsetParent).parent().width(),height=jQuery(this.offsetParent).parent().height();
			jQuery(this.progressbar).css('width',width+'px').css('height',height+'px');
			return jQuery(this.body).find('.settings-content').append(this.progressbar);
		}
		return jQuery(this.progressbar).remove();
	},
	active:function(o,e){
		if(this[e]) jQuery(this[e]).removeClass('active');
		jQuery(o).addClass('active');
		this[e] = o;
	},
	getNormalName:function(object, key){
		var self = this;
		var modName = jQuery(object).attr('name');
		modName = (modName.split('_').length==2)?modName.split('_').join('').toUpperCase():modName.toUpperCase();
		var keyName = 'COM_MANAGER_'+modName+'_';
		return key.replace(keyName, '').toLowerCase();
	},
	setFormButton:function(object){
		jQuery(object).find('input[name="index"]').click(function(){
			jQuery(this).parent().parent().find('div.remove').hide();
			jQuery(this).parent().find('div.remove').show();
		});
		jQuery(object).find('div.remove').click(function(){
			jQuery(this).parent().remove();
		});
	},
	translated:function(object, p){
		var self = this;
		var sb = host.stringBuffer();
		var buttonsRow = jQuery(this.rows).find('div.buttons');
		sb._('<form id="language" method="post" target="iframe-settings"><div><input id="update" type="submit" value="Update"><input id="delete" type="submit" value="Delete"></div><div><input id="upload" name="upload" type="file"></div>');
			sb._('<div class="values">');
				var langPack = self.modJSON.parse[jQuery(object).attr('name')];
				for(var key in langPack){
					var index = self.getNormalName(object, key);
					sb._('<div class="value"><input name="index" type="radio"><input name="title')._(++self.titleNum)._('" value="')._(index)._('" type="text" style="width: 75px;"><span>=</span><input name="value')._(++self.valueNum)._('" value="')._(langPack[key])._('" type="text"><div style="display:none;" class="remove">&nbsp;</div></div>');
				}
				sb._('<div class="valueAdd"><input type="button" value="Add"></div>');
			sb._('</div>')
		sb._('</form>');
		var form = jQuery(sb.result());
		jQuery(buttonsRow).html('');
		jQuery(buttonsRow).append(form);
		jQuery(form).find('input#update,input#delete').click(function(){
			var id = jQuery(this).attr('id');
			var name = jQuery(object).attr('name');
			var args = [id,p,name].join(';');
			self.ajaxForm(form, 'setLanguage', args, function(){}, function(data){
				if(data){
					if(id=='delete'){
						jQuery(object).removeClass('translated').addClass('no-translation'); 
						self.noTranslation(object, p);
						jQuery(object).click();
						delete self.modJSON.parse[name];
					} else {
						self.modJSON.parse[name] = data.upload_ini[name];
					}
				} else {
					alert('incorrect language file for this module was not added');
				}
			});
		});
		jQuery(form).find('input[type="button"]').click(function(){
			var item = jQuery(sb.clear()._('<div class="value"><input name="index" type="radio"><input name="title')._(++self.titleNum)._('" value="" type="text" style="width: 75px;"><span>=</span><input name="value')._(++self.valueNum)._('" value="" type="text"><div style="display:none;" class="remove">&nbsp;</div></div>').result());
			self.setFormButton(item);
			jQuery(form).find('div.values').append(item);
			jQuery(item).insertBefore(jQuery(this).parent());
			
		});
		self.setFormButton(form);
	},
	noTranslation:function(object, p){
		var self = this;
		var buttonsRow = jQuery(this.rows).find('div.buttons');
		var sb = host.stringBuffer();
		sb._('<form id="language" method="post" target="iframe-settings"><div><input id="new" type="submit" value="New"></div><div><input id="upload" name="upload" type="file"></div>');
			sb._('<div class="values">');
				sb._('<div class="valueAdd"><input type="button" value="Add"></div>');
			sb._('</div>');
		sb._('</form>');
		var form = jQuery(sb.result());
		jQuery(buttonsRow).html('');
		jQuery(buttonsRow).append(form);
		var args = ['new',p,jQuery(object).attr('name')].join(';');
		jQuery(form).find('input#new').click(function(){
			self.ajaxForm(form, 'setLanguage', args, function(){}, function(data){
				if(data){ 
					jQuery(object).removeClass('no-translation').addClass('translated'); 
					self.translated(object, p);
					jQuery(object).click();
				} else {
					alert('incorrect language file for this module was not added');
				}
			});
		});
		jQuery(form).find('input[type="button"]').click(function(){
			var item = jQuery(sb.clear()._('<div class="value"><input name="index" type="radio"><input name="title')._(++self.titleNum)._('" value="" type="text" style="width: 75px;"><span>=</span><input name="value')._(++self.valueNum)._('" value="" type="text"><div style="display:none;" class="remove">&nbsp;</div></div>').result());
			self.setFormButton(item);
			jQuery(form).find('div.values').append(item);
			jQuery(item).insertBefore(jQuery(this).parent());
			
		});
		self.setFormButton(form);
	},
	createModulesList:function(json, args){
		var self = this;
		var sb = host.stringBuffer();
		var moduleRow = jQuery(this.rows).find('div.modules');
		jQuery(moduleRow).html('');		
		sb._('<ul>');
			for(var key in json.modules){
				var module = json.modules[key];
				sb._('<li id="')._(module.id||'null')._('" name="')._(module.name||'null')._('" class="')._((key in json.parse)?'translated':'no-translation')._('" >')._(module.name||'unknown')._('</li>');
			}
		sb._('</ul>');
		var object = jQuery(sb.result());
		jQuery(object).find('li').click(function(){
			if(jQuery(this).hasClass('active')) return false;
			self.active(this,'activeMod');
			if(jQuery(this).hasClass('translated')){
				self.translated(this, args)
			}
			if(jQuery(this).hasClass('no-translation')){
				self.noTranslation(this, args)
			}
			return false;
		})
		jQuery(moduleRow).append(object);
	},
	createLanguagesList:function(json){
		var self = this;
		var languageRow = jQuery(this.rows).find('div.languages');
		var sb = host.stringBuffer();
		sb._('<ul>');
		jQuery(json).each(function(i, lang){
			sb._('<li id="')._(lang.lang_code)._('" published="')._(lang.published)._('" >')._(lang.title)._('</li>');
		});
		sb._('</ul>');
		var object = jQuery(sb.result());
		jQuery(object).find('li').click(function(){
			if(jQuery(this).hasClass('active')) return false;
			self.active(this,'activeLang');
			self._ajax(jQuery(this).attr('id')).getModules('createModulesList');
			return false;
		})
		jQuery(languageRow).append(object);
	},
	language:function(){
		var self = this;
		var sb = host.stringBuffer();
		this.rows = jQuery(self.body).find('.settings-content').append('<table width="100%"><tr><td valign="top" style="width: 25%;"><div class="languages"></div></td><td valign="top" style="width: 25%;"><div class="modules"></div></td><td valign="top" style="width: 50%;"><div class="buttons"></div></td></tr></table>');
		self._ajax(null).getLanguages('createLanguagesList');
	},
	handleTabs:function(object){
		var self = this;
		jQuery(self.header).find('li').click(function(){
			if(jQuery(this).hasClass('active')) return false;
			self.active(this,'activeTab');
			var id = jQuery(this).attr('id');
			switch(id){
				case 'language': self.language(); break;
			}
			return false;
		});
		jQuery(self.header).find('li').first().click();
	},
	createTabs:function(){
		var self = this;
		var sb,tabs,header;
		tabs = ['Language'];
		sb = host.stringBuffer();
		sb._('<ul>');
		jQuery(tabs).each(function(i,e){
			sb._('<li id="')._(e.toLowerCase())._('">')._('<div class="item">')._(e)._('</div></li>');
		});
		sb._('</ul>');
		self.header = jQuery(sb.result());
		self.handleTabs();
		jQuery(this.body).find('.settings-tabs').append(this.header);
	}
};



