function FamousFamilyBackend(obj){
	var module = this;
	obj = jQuery('#'+obj);
	
	module.json = null;
	
	if(jQuery("#iframe-famous-family").length==0){
		var iframe = '<iframe id="iframe-famous-family" name="#iframe-famous-family" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">';
		jQuery(obj).append(iframe);
	}
	var modal = jQuery('<div class="jmb-famous-family-modal" style="display:none;">&nbsp;</div>');
	jQuery(obj).append(modal);
	
	var showModal = function(){
		var width = jQuery(obj).width();
		var height = jQuery(obj).height();
		jQuery(modal).css('width', width+'px').css('height', height+'px').show();
	}
	var hideModal = function(){
		jQuery(modal).hide();
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
	var setDeletEventHandler = function(tr){
		var div = jQuery(tr).find('div.delete');
		jQuery(div).click(function(){
			var individuals_key = jQuery(div).attr('id');
			var famous_family_key = jQuery(div).attr('famous_family');
			module.ajax('deleteTreeKeeper', individuals_key+';'+famous_family_key, function(){
				jQuery(tr).remove();
				delete module.json.sort_families[famous_family_key].keepers[individuals_key];
			});
		});
	}
	var treeItemClick = function(box, object, html_object){
		if(jQuery(object).hasClass('active')) return false;
		var id = jQuery(object).parent().attr('id');
		jQuery(box).find('.jmb-famous-family-backend-tree-item span').removeClass('active');
		jQuery(object).addClass('active');
		createContent(id, html_object);
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
				sb._('<div><input name="tree_name"></div>');
			sb._('</div>');	
			sb._('<div class="jmb-famous-family-backend-content-item">')
				sb._('<div><span>Famous Person:</span></div>');
				sb._('<div>')
					sb._('<table>');
						sb._('<tr>');
							sb._('<td><div>*FirstName</div><div><input name="first_name"></div></td>');
							sb._('<td><div>LastName</div><div><input name="last_name"></div></td>');
							sb._('<td><div>KnowAs</div><div><input name="know_as"></div></td>');
						sb._('</tr>');
					sb._('</table>');
				sb._('</div>');
			sb._('</div>');	
			sb._('<div class="jmb-famous-family-backend-content-item">')
				sb._('<div><span>Gender:</span></div>');
				sb._('<div><select name="gender"><option value="M">Male</option><option value="F">Female</option></select></div>');
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
			if(res.error) { alert(res.error); return;  }
			alert(res.message);
			module.json.sort_families[res.family.id] = res.family;
			var box = jQuery(obj).find('.jmb-famous-family-backend-tree');
			var div = jQuery('<div id="'+res.family.id+'" class="jmb-famous-family-backend-tree-item"><span>'+res.family.name+'</span></div>');
			jQuery(box).append(div);	
			jQuery(div).find('span').click(function(){
				treeItemClick(box, this, html_object)
			});
		});
		jQuery(box).append(content);
	}
	
	var createContent = function(id, html_object){
		var object = module.json.sort_families[id];
		var box = jQuery(html_object).find('.jmb-famous-family-backend-content');
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
				sb._('<div>')
					sb._('<select name="individuals_id">');
						jQuery(object.relatives).each(function(i, ind){
							sb._('<option value="')._(ind.id)._('">')._(getName(ind))._('</option>');
						});
					sb._('</select>');
				sb._('</div>');
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
								sb._('<td><div><span>')._(getLastLogin(object.keepers[key], module.json.time))._('</span></div></td>');
								sb._('<td style="width:22px;"><div id="')._(key)._('" famous_family="')._(object.id)._('" class="delete"><span>&nbsp;</span></div></td>');
							sb._('</tr>');
						}
					}
				sb._('</table>');
				sb._('<div class="jmb-famous-family-backend-content-keepers-add"><span>Add Tree Keeper</span></div>');
			sb._('</div>');
		sb._('</div>');	
		var content = jQuery(sb.result());
		jQuery(content).find('select[name="individuals_id"][value="'+object.individuals_id+'"]').attr('selected', 'selected');
		setSelectOption(content, object.permission);
		jQuery(content).find('.jmb-famous-family-backend-content-keepers-add').click(function(){
			var st = host.stringBuffer();
			st._('<form id="jmb_create_famous_family_keeper" method="post" target="iframe-famous-family">');
				st._('<div class="jmb-famous-family-keeper-create">');
					st._('<span>Select Keeper:</span>');
					st._('<select name="individuals_id">');
						jQuery(module.json.keeper_list).each(function(i, keeper){
							st._('<option value="')._(keeper.id)._('">')._(getName(keeper))._('</option>')
						});
					st._('</select>');
					st._('<input type="submit" value="Save"><input type="button" value="Close">');
				st._('</div>');
			st._('</form>');
			var keeperForm = jQuery(st.result());
			showModal();
			jQuery(obj).append(keeperForm);
			jQuery(keeperForm).find('input[value="Close"]').click(function(){
				jQuery(keeperForm).remove();
				hideModal();
			});
			module.ajaxForm(keeperForm, 'createTreeKeepers', object.id, function(res){
				if(res.keeper_info){
					var keeper = res.keeper_info[0];
					var individuals_id = keeper.individuals_id;
					if(module.json.sort_families[object.id]){
						if(!module.json.sort_families[object.id].keepers){
							module.json.sort_families[object.id].keepers = {};
						}
						module.json.sort_families[object.id].keepers[individuals_id] = keeper;
					}
					var time = res.time;
					var table = jQuery(content[1]).find('table');
					var st = host.stringBuffer();
					st._('<tr>');
						st._('<td><div><span>')._(getName(keeper))._('</span></div></td>');
						st._('<td><div><span>')._(getLastLogin(keeper, time))._('</span></div></td>');
						st._('<td style="width:22px;"><div id="')._(individuals_id)._('" famous_family="')._(object.id)._('" class="delete"><span>&nbsp;</span></div></td>');
					st._('</tr>');
					var tr = jQuery(st.result());
					setDeletEventHandler(tr);
					jQuery(table).append(tr);
				}				
				jQuery(keeperForm).remove();
				hideModal();
				alert(res.message);
			});
		});
		jQuery(content[0]).find('input[value="Delete"]').click(function(){
			var box = jQuery(obj).find('.jmb-famous-family-backend-tree');
			module.ajax('deleteFamousFamily', object.tree_id, function(res){
				jQuery(box).find('.jmb-famous-family-backend-tree-item span').removeClass('active');
				jQuery(box).find('#'+object.id).remove();
				jQuery(content).remove();
			});		
		});
		jQuery(content[1]).find('tr').each(function(i,e){ setDeletEventHandler(e); });		
		module.ajaxForm(content, 'save', object.id, function(res){
			alert(res.message);
		});
		jQuery(box).append(content);
	}
	var createFamousFamiliesTree = function(html_object){
		var box = jQuery(obj).find('.jmb-famous-family-backend-tree');
		jQuery(module.json.families).each(function(i,e){
			var div = jQuery('<div id="'+e.id+'" class="jmb-famous-family-backend-tree-item"><span>'+e.name+'</span></div>');
			jQuery(box).append(div);
		});	
		jQuery(box).find('.jmb-famous-family-backend-tree-item span').click(function(){
			treeItemClick(box, this, html_object)
		});
		jQuery(box).parent().find('.jmb-famous-family-backend-tree-add span').click(function(){
			jQuery(box).find('.jmb-famous-family-backend-tree-item span').removeClass('active');
			createNewContent(html_object);
		});
	}
	
	var html_object = createBody();	
	module.ajax('getFamousFamiliesTree',null, function(res){
		var json = jQuery.parseJSON(res.responseText);
		module.json = json;
		createFamousFamiliesTree(html_object);
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



