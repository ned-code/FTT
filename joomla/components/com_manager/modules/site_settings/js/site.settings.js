function SiteSettings(obj){
	//vars
	this.header = null;
	this.body = null;
	this.rows = null;
	this.offsetParent = null;
	this.activeTab = null;
	this.activeLang = null;
	this.activeMod = null;
	
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
					self[func](json);
				});
			},
			getModules:function(func){
				self.ajax('getModules',args,function(res){
					var json = jQuery.parseJSON(res.responseText);
					self[func](json);
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
	ajaxForm:function(obj, method, args,beforeSubmit, success){
		var sb = host.stringBuffer();
		var url = sb._('index.php?option=com_manager&task=callMethod&module=profile&class=JMBProfile&method=')._(method)._('&args=')._(args).result();
		jQuery(obj).ajaxForm({
			url:url,
			dataType:"json",
			target:"#iframe-settings",
			beforeSubmit:function(){
				return beforeSubmit();	
			},
			success:function(data){
				success(data);
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
	translated:function(object){
		var self = this;
		var buttonsRow = jQuery(this.rows).find('div.buttons');
		var form = jQuery('<form id="language" method="post" target="iframe-settings"><div><input id="new" type="submit" value="New"><input id="update" type="submit" value="Update"><input id="delete" type="submit" value="Delete"></div><div><input id="upload" name="upload" type="file"></div></form>');
		jQuery(buttonsRow).html('');
		jQuery(buttonsRow).append(form);
		jQuery(form).find('input').click(function(){
			var id = jQuery(this).attr('id');
			if(id=='upload') return false;
			var args = [id,jQuery(object).attr('id')].join(';');
			self.ajaxForm(form, 'setLanguage', args, function(){}, function(){})
		})
	},
	noTranslation:function(object){
		var self = this;
		var buttonsRow = jQuery(this.rows).find('div.buttons');
		var form = jQuery('<form id="language" method="post" target="iframe-settings"><div><input id="new" type="submit" value="New"></div><div><input id="upload" name="upload" type="file"></div></form>');
		jQuery(buttonsRow).html('');
		jQuery(buttonsRow).append(form);
		var args = ['new',jQuery(object).attr('id')].join(';');
		self.ajaxForm(form, 'setLanguage', args, function(){}, function(){})
	},
	createModulesList:function(json){
		var self = this;
		var sb = host.stringBuffer();
		var moduleRow = jQuery(this.rows).find('div.modules');
		jQuery(moduleRow).html('');		
		sb._('<ul>');
			for(var key in json.modules){
				var module = json.modules[key];
				sb._('<li id="')._(module.id||'null')._('" name="')._(module.name||'null')._('" class="')._((key in json.parse)?'translated':'no-translation')._('" >')._(module.title||'unknown')._('</li>');
			}
		sb._('</ul>');
		var object = jQuery(sb.result());
		jQuery(object).find('li').click(function(){
			if(jQuery(this).hasClass('active')) return false;
			self.active(this,'activeMod');
			if(jQuery(this).hasClass('translated')){
				self.translated(this)
			}
			if(jQuery(this).hasClass('no-translation')){
				self.noTranslation(this)
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



