function FamousFamilyBackend(obj){
	obj = jQuery('#'+obj);
	var html = function(){
		var sb = host.stringBuffer();
		sb._('<table width="100%" cellspacing="0" cellpadding="0">');
			sb._('<tr><td colspan="2"><div class="jmb-famous-family-backend-header"><span>Famous Family Trees - Administration</span></div></td></tr>');
			sb._('<tr>');
			sb._('<td valign="top" style="width:150px;">');
					sb._('<div class="jmb-famous-family-backend-tree">');
						sb._('<div class="jmb-famous-family-backend-tree-header"><span>Famous Family Trees</span></div>');
						sb._('<div class="jmb-famous-family-backend-tree-item"><span>Elvis Presley</span></div>');
						sb._('<div class="jmb-famous-family-backend-tree-item"><span>Elvis Presley</span></div>');
						sb._('<div class="jmb-famous-family-backend-tree-item"><span>Elvis Presley</span></div>');
						sb._('<div class="jmb-famous-family-backend-tree-item"><span>Elvis Presley</span></div>');
						sb._('<div class="jmb-famous-family-backend-tree-item"><span>Elvis Presley</span></div>');
					sb._('</div>');
					sb._('<div class="jmb-famous-family-backend-tree-add"><span>Add New Tree</span></div>')
				sb._('</td>');
				sb._('<td>');
					sb._('<div class="jmb-famous-family-backend-content">');
						sb._('<div class="jmb-famous-family-backend-content-item">')
							sb._('<div><span>Tree Name:</span></div>');
							sb._('<div><input></div>');
						sb._('</div>');	
						sb._('<div class="jmb-famous-family-backend-content-item">')
							sb._('<div><span>Key Member:</span></div>');
							sb._('<div><input></div>');
						sb._('</div>');	
						sb._('<div class="jmb-famous-family-backend-content-item">')
							sb._('<div><span>Description:</span></div>');
							sb._('<div><textarea></textarea></div>');
						sb._('</div>');	
						sb._('<div class="jmb-famous-family-backend-content-item">')
							sb._('<div><span>Who can see this tree:</span></div>');
							sb._('<div><select><option>Everyone</option><option>Tree Kepers</option><option>Nobody</option></select></div>');
						sb._('</div>');	
						sb._('<div class="jmb-famous-family-backend-content-keepers">')
							sb._('<div class="header"><span>Tree Keepers:</span></div>');
							sb._('<div class="body">');
								sb._('<table border="1" bordercolor="#999" width="100%" cellspacing="0" cellpadding="0">');
									sb._('<tr class="head">');
										sb._('<td><div><span>Name</span></div></td>');
										sb._('<td><div><span>Last activity</span></div></td>');
										sb._('<td><div><span>&nbsp;</span></div></td>');
									sb._('<tr>');
									sb._('<tr>');
										sb._('<td><div><span>Greeg William</span></div></td>');
										sb._('<td><div><span>5 days ago</span></div></td>');
										sb._('<td><div><span>x</span></div></td>');
									sb._('<tr>');
								sb._('</table>');
								sb._('<div class="jmb-famous-family-backend-content-keepers-add"><span>Add Tree Keeper</span></div>');
							sb._('</div>');
						sb._('</div>');	
					sb._('</div>');
				sb._('</td>');
			sb._('</tr>');
		sb._('</table>');
		return jQuery(sb.result());
	}

	var htmlObject = html();
	jQuery(obj).append(htmlObject);
	
}

FamousFamilyBackend.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("famous_family_backend", "JMBFamousFamilyBackend", func, params, function(res){
				callback(res);
		})
	}
}



