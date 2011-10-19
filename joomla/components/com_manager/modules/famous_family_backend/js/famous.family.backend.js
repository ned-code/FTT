function FamousFamilyBackend(obj){
	var module = this;
	obj = jQuery('#'+obj);
	
	if(jQuery("#iframe-famous-family").length==0){
		var iframe = '<iframe id="iframe-famous-family" name="#iframe-famous-family" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">';
		jQuery(obj).append(iframe);
	}

 	var createBody = function(){
		var sb = host.stringBuffer();
		sb._('<table width="100%" cellspacing="0" cellpadding="0">');
			sb._('<tr><td colspan="2"><div class="jmb-famous-family-backend-header"><span>Famous Family Trees - Administration</span></div></td></tr>');
			sb._('<tr>');
			sb._('<td valign="top" style="width:150px;">');
					sb._('<div class="jmb-famous-family-backend-tree">');
						sb._('<div class="jmb-famous-family-backend-tree-header"><span>Famous Family Trees</span></div>');
					sb._('</div>');
					sb._('<div class="jmb-famous-family-backend-tree-add"><span>Add New Tree</span></div>')
				sb._('</td>');
				sb._('<td>');
					sb._('<div class="jmb-famous-family-backend-content">');
						
					sb._('</div>');
				sb._('</td>');
			sb._('</tr>');
		sb._('</table>');
		return jQuery(sb.result());
	}
	var getName = function(object){ return [object.first_name, object.middle_name, object.last_name].join(' ') }
	var getTime = function(time){ 
		var t = time.split(/[- :]/); 
		return (t[0]!='0000'&&t[1]!='00'&&t[2]!='00')?new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]): false; 
	}
	var getLastLogin = function(object, time){
		var now = getTime(time);
		var t   = getTime(object.last_login);
		if(!now||!t) return 'unknown';
		var dif = Math.round((now.getTime() - t.getTime())/1000);
		var d = Math.floor(dif/86400);
		var h = Math.floor(dif/3600%24);
		return (d!=0)?d+' days '+h+' hours ago':h+' hors ago';
	}
	var setSelectOption = function(content, permission){
		jQuery(content).find('select[name="permission"] option[value="'+permission+'"]').attr('selected', 'selected');
	}
	var createNewContent = function(html){
		var box = jQuery(html).find('.jmb-famous-family-backend-content');
		var sb = host.stringBuffer();
		jQuery(box).html('');
		//create html
		sb._('<form id="jmb_create_famous_family" method="post" target="iframe-famous-family">');
			sb._('<div class="jmb-famous-family-backend-buttons"><input type="submit" value="Save"></div>');
			sb._('<div class="jmb-famous-family-backend-content-item">')
				sb._('<div><span>Tree Name:</span></div>');
				sb._('<div><input name="name" value=""></div>');
			sb._('</div>');	
			sb._('<div class="jmb-famous-family-backend-content-item">')
				sb._('<div><span>Key Member:</span></div>');
				sb._('<div><input name="individuals_id" value=""></div>');
			sb._('</div>');	
			sb._('<div class="jmb-famous-family-backend-content-item">')
				sb._('<div><span>Description:</span></div>');
				sb._('<div><textarea name="description"></textarea></div>');
			sb._('</div>');	
			sb._('<div class="jmb-famous-family-backend-content-item">')
				sb._('<div><span>Who can see this tree:</span></div>');
				sb._('<div><select name="permission"><option value="2">Everyone</option><option value="1">Tree Kepers</option><option value="0">Nobody</option></select></div>');
			sb._('</div>');	
		sb._('</form>');
		var content = jQuery(sb.result());
		module.ajaxForm(content, 'createNewFamousFamily', null, function(res){
			alert(res.message);
		});
		jQuery(box).append(content);
	}
	
	var createContent = function(object, html, time){
		var box = jQuery(html).find('.jmb-famous-family-backend-content');
		var sb = host.stringBuffer();
		jQuery(box).html('');
		//create html
		sb._('<form id="jmb_create_famous_family" method="post" target="iframe-famous-family">');
			sb._('<div class="jmb-famous-family-backend-buttons"><input type="submit" value="Save"><input type="button" value="Delete"></div>');
			sb._('<div class="jmb-famous-family-backend-content-item">')
				sb._('<div><span>Tree Name:</span></div>');
				sb._('<div><input name="name" value="')._(object.name)._('"></div>');
			sb._('</div>');	
			sb._('<div class="jmb-famous-family-backend-content-item">')
				sb._('<div><span>Key Member:</span></div>');
				sb._('<div><input name="individuals_id" value="')._(object.individuals_id)._('"></div>');
			sb._('</div>');	
			sb._('<div class="jmb-famous-family-backend-content-item">')
				sb._('<div><span>Description:</span></div>');
				sb._('<div><textarea name="description">')._(object.description)._('</textarea></div>');
			sb._('</div>');	
			sb._('<div class="jmb-famous-family-backend-content-item">')
				sb._('<div><span>Who can see this tree:</span></div>');
				sb._('<div><select name="permission"><option value="2">Everyone</option><option value="1">Tree Kepers</option><option value="0">Nobody</option></select></div>');
			sb._('</div>');	
		sb._('</form>');
		sb._('<div class="jmb-famous-family-backend-content-keepers">')
			sb._('<div class="header"><span>Tree Keepers:</span></div>');
			sb._('<div class="body">');
				sb._('<table border="1" bordercolor="#999" width="100%" cellspacing="0" cellpadding="0">');
					sb._('<tr class="head">');
						sb._('<td><div><span>Name</span></div></td>');
						sb._('<td><div><span>Last activity</span></div></td>');
						sb._('<td><div><span>&nbsp;</span></div></td>');
					sb._('</tr>');
					if(object.keepers){
						for(var key in object.keepers){
							sb._('<tr>');
								sb._('<td><div><span>')._(getName(object.keepers[key]))._('</span></div></td>');
								sb._('<td><div><span>')._(getLastLogin(object.keepers[key], time))._('</span></div></td>');
								sb._('<td style="width:22px;"><div id="')._(key)._('" class="delete"><span>&nbsp;</span></div></td>');
							sb._('</tr>');
						}
					}
				sb._('</table>');
				sb._('<div class="jmb-famous-family-backend-content-keepers-add"><span>Add Tree Keeper</span></div>');
			sb._('</div>');
		sb._('</div>');	
		var content = jQuery(sb.result())
		setSelectOption(content, object.permission);
		module.ajaxForm(content, 'save', object.id, function(res){
			alert(res.message);
		});
		jQuery(box).append(content);
	}
	var createFamousFamiliesTree = function(json, html){
		var box = jQuery(obj).find('.jmb-famous-family-backend-tree');
		jQuery(json.families).each(function(i,e){
			var div = jQuery('<div id="'+e.id+'" class="jmb-famous-family-backend-tree-item"><span>'+e.name+'</span></div>');
			jQuery(box).append(div);
		});	
		jQuery(box).find('.jmb-famous-family-backend-tree-item span').click(function(){
			if(jQuery(this).hasClass('active')) return false;
			var id = jQuery(this).parent().attr('id');
			jQuery(box).find('.jmb-famous-family-backend-tree-item span').removeClass('active');
			jQuery(this).addClass('active');
			createContent(json.sort_families[id], html, json.time);
		});
		jQuery(box).parent().find('.jmb-famous-family-backend-tree-add span').click(function(){
			createNewContent(html);
		});
	}
	
	var html_object = createBody();	
	module.ajax('getFamousFamiliesTree',null, function(res){
		var json = jQuery.parseJSON(res.responseText);
		createFamousFamiliesTree(json, html_object);
	});
	
	
	jQuery(obj).append(html_object);
	
}

FamousFamilyBackend.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("famous_family_backend", "JMBFamousFamilyBackend", func, params, function(res){
				callback(res);
		})
	},
	ajaxForm:function(obj, method, args, success){
		var sb = host.stringBuffer();
		var url = sb._('index.php?option=com_manager&task=callMethod&module=famous_family_backend&class=JMBFamousFamilyBackend&method=')._(method)._('&args=')._(args).result();
		jQuery(obj).ajaxForm({
			url:url,
			dataType:"json",
			target:"#iframe-famous-family",
			success:function(data){
				success(data);
			}
		});
	}
}



