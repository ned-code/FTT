function SiteSettings(obj){
	var parent = obj
	var module = this;
	
	var sb = host.stringBuffer();
	sb._('<table width="100%">');
		sb._('<tr>');
			sb._('<td style="width:210px;" valign="top"><div id="modules"></div></td>');
			sb._('<td style="width:100px;" valign="top"><div id="languages"></div></td>');
			sb._('<td valign="top"><div id="variables"></div></td>');
		sb._('</tr>');
	sb._('</table>');
	var table = jQuery(sb.result());
	sb.clear();
	
	jQuery(parent).append(table);
	
	module.table = table;
	module.parent = parent;
	
	module.ajax('getModules', null, function(res){
		if(res&&res.responseText){
			//var json = jQuery.parseJSON(res.responseText);
			var json = storage.getJSON(res.responseText);
			module.moduleListRender(json.modules);
		}
	});
}

SiteSettings.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("site_settings", "SiteSettings", func, params, function(req){
				callback(req);
		});
	},
	getNormalVariableName:function(variable){
		var name = variable.toLowerCase();
		return name[0].toUpperCase()+name.substr(1);
	},
	getJsonString:function(object, language){
		var inputs = jQuery(object).find('input');
		var sb = host.stringBuffer();
		sb._('{"language_file":"')._(language)._('","variables":[')
		jQuery(inputs).each(function(i,e){
			sb._('{"name":"')._(jQuery(e).attr('name'))._('","value":"')._(jQuery(e).val())._('"}');				
			if(inputs.length-1!=i){
				sb._(',');
			}
		});
		sb._(']}');
		return sb.result();
	},
	clickModule:function(module_name){
		var module = this;
		var table = module.table;
		module.ajax('getLanguages', module_name, function(res){
			if(res&&res.responseText){
				//var json = jQuery.parseJSON(res.responseText);
                var json = storage.getJSON(res.responseText);
                jQuery(table).find('div#languages').html('');
				jQuery(table).find('div#variables').html('');
				if(json.success){
					module.languageListRender(json.success.lang_files);
				}
			}
		});
	},
	clickLanguage:function(language){
		var module = this;
		var table = module.table;
		module.ajax('getVariables', language, function(res){
			if(res&&res.responseText){
				//var json = jQuery.parseJSON(res.responseText);
                var json = storage.getJSON(res.responseText);
				jQuery(table).find('div#variables').html('');
				if(json.success){
					module.variableListRender(json.success.variables, language);
				}
			}
		});
	},
	saveVariables:function(object, language){
		var module = this;
		var json_string = module.getJsonString(object, language);
		module.ajax('saveVatiables', json_string, function(res){
			if(res&&res.responseText){
				//var json = jQuery.parseJSON(res.responseText);
                var json = storage.getJSON(res.responseText);
                if(json.result){
					alert('language variables saved successfully.')
				}
			}
		});
	},
	moduleListRender:function(modules){
		if(!modules) return;
		var module = this;
		var table = module.table;
		var ul = jQuery('<ul></ul>');
		jQuery(modules).each(function(i, e){
			var li = jQuery('<li id="'+e.id+'" class="jmb-settings-module-item"><div><span id="'+e.name+'">'+e.title+'</span></div></li>');
			jQuery(ul).append(li);
			jQuery(li).find('span').click(function(){
				if(jQuery(this).hasClass('active')) return;
				jQuery(ul).find('li span').removeClass('active');
				jQuery(this).addClass('active');
				module.clickModule(jQuery(this).attr('id'));
			});
		});
		jQuery(table).find('div#modules').html('').append(ul);
	},
	languageListRender:function(lang_files){
		var module = this;
		var table = module.table;
		var ul = jQuery('<ul></ul>');
		jQuery(lang_files).each(function(i,e){
			var name = e.split('.');
			var lang_name = [name[0],name[2]].join('.');
			var li = jQuery('<li class="jmb-settings-lang-item"><div><span id="'+e+'">'+lang_name+'</span></div></li>');
			jQuery(ul).append(li);
			jQuery(li).find('span').click(function(){
				if(jQuery(this).hasClass('active')) return;
				jQuery(ul).find('li span').removeClass('active');
				jQuery(this).addClass('active');
				module.clickLanguage(jQuery(this).attr('id'));	
			});
		});
		jQuery(table).find('div#languages').append(ul);
	},
	variableListRender:function(variables, language){
		if(!variables) return;
		var module = this;
		var table = module.table;
		var div = jQuery('<div id="controller"><input type="button" value="Save"></div><div id="values"><ul></ul></div>');
		var ul = jQuery(div[1]).find('ul');
		for(var key in variables){
			var li = jQuery('<li><div><span>'+module.getNormalVariableName(key)+'</span>: <input name="'+key+'" value="'+variables[key]+'" type="text"></div></li>');
			jQuery(ul).append(li);
		}
		jQuery(div[0]).find('input').click(function(){
			module.saveVariables(div[1], language);
		});
		jQuery(table).find('div#variables').append(div);
	}
};



