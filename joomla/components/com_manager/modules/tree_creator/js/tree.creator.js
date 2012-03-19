function JMBTreeCreatorObject(parent){
	var module = this, fn;
	
	module.body = null;
	module.dialog_box = null;
	
	module.dialog_settings = {
		width:700,
		height:500,
		title: 'Welcome to Family TreeTop',
		resizable: false,
		draggable: false,
		position: "top",
		closeOnEscape: false,
		modal:true,
		close:function(){
			
		}	
	}

	
	fn = {
		ajax:function(func, params, callback){
			host.callMethod("tree_creator", "TreeCreator", func, params, function(res){
					callback(res);
			})
		},
		body:function(){
			var sb = host.stringBuffer();
			sb._('<div id="button"><span>Connect to Family TreeTop</span></div>');
			return jQuery(sb.result());
		},
		dialog_box:function(){
			var sb = host.stringBuffer();
			sb._('<div id="dialog_box" class="dialog_box"></div>');
			return jQuery(sb.result());
		},
		create_dialog_window:function(){
			jQuery(module.dialog_box).dialog(module.dialog_settings);
			jQuery(module.dialog_box).parent().addClass('ftt_tree_creator');
			jQuery(module.dialog_box).parent().css('top', '20px');
		},
		connect_to_family_treetop:function(body){
			jQuery(body).find('span').click(function(){
				fn.create_dialog_window();
			});
		},
		send_friend_request:function(e){
			console.log(e);
			alert('send request');
		},
		create_new_tree:function(e){
			alert('create new tree');
			console.log(e);
		},
		set_facebook_friends:function(html){
			var cont = jQuery(html).find('div.tc_ftt_friends');
			FB.api('/me/friends', function(response){
				var data = response.data;
				var query = '{';
				for(var key in data){
					query += '"'+data[key].id+'":"'+data[key].name+'",';
				}
				query = query.substr(0, query.length - 1)+'}';
				fn.ajax('verify_facebook_friends', query, function(res){
					var json = jQuery.parseJSON(res.responseText);
					var ul = jQuery('<ul></ul>');
					jQuery(json.result).each(function(i, el){
						var li = jQuery('<li></li>');
						var sb = host.stringBuffer();
						sb._('<table>');
							sb._('<tr>');
								sb._('<td>');
									sb._('<div class="avatar">');
										sb._('<img src="index.php?option=com_manager&task=getResizeImage&fid=')._(el.facebook_id)._('&w=50&h=50">');
									sb._('</div>');
								sb._('</td>');
								sb._('<td><div class="name">')._(el.name)._('</div></td>');
								sb._('<td>');
									sb._('<div class="request" facebook_id="')._(el.facebook_id)._('" gedcom_id="')._(el.gedcom_id)._('">');
										sb._('<span>Request Invitation</span>');
									sb._('</div>');
								sb._('</td>');
							sb._('</tr>');
						sb._('</table>');
						var html = sb.result();
						jQuery(li).append(html);						
						jQuery(ul).append(li);
					});
					jQuery(cont).append(ul);
					jQuery(ul).find('div.request').click(fn.send_friend_request);
				});
			});
			
		},
		set_start_content:function(dialog_box){
			var sb = host.stringBuffer();
			sb._('<div class="tc_content">');
				sb._('<div class="tc_header">');
					sb._('<div><span>Are You Related?</span></div>');
					sb._('<div><span>Some of your Facebook friends are members of Family TreeTop. Are you related to any of the people listed below? If so, you many request an invitation to join their familytree.</span></div>');
				sb._('</div>');
				sb._('<div class="tc_ftt_friends">');
				sb._('</div>');
				sb._('<div class="tc_footer">');
					sb._('<div><span>if you are not related to anyone listed below, <span class="button">click here</span> to create new Family Tree</span></div>');
				sb._('</div>');
			sb._('</div>');
			var html = jQuery(sb.result());
			jQuery(html).find('div.tc_footer span.button').click(fn.create_new_tree);
			fn.set_facebook_friends(html);
			jQuery(dialog_box).append(html);
		},
		init:function(){
			var body = fn.body();
			var dialog_box = fn.dialog_box();
			module.body = body;
			module.dialog_box = dialog_box;
			jQuery(parent).append(body);
			fn.connect_to_family_treetop(body);
			fn.set_start_content(dialog_box);
			
		}
	}
	
	fn.init();
}

/*
function JMBTreeCreatorObject(obj){
	this.html = null;
	
	this.obj = jQuery(['#',obj].join(''));
	
	if(jQuery("#iframe-tree-creator").length==0){
		var iframe = '<iframe id="iframe-tree-creator" name="#iframe-tree-creator" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">';
		jQuery(document.body).append(iframe);
	}	
	this.create();
	this.buttons();
}

JMBTreeCreatorObject.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("tree_creator", "TreeCreator", func, params, function(req){
				callback(req);
		})
	},
	_ajaxForm:function(obj, method, args, before,callback){
		var sb = host.stringBuffer();
		var url = sb._('index.php?option=com_manager&task=callMethod&module=tree_creator&class=TreeCreator&method=')._(method)._('&args=')._(args).result();
		jQuery(obj).ajaxForm({
			url:url,
			dataType:"json",
			target:"#iframe-tree-creator",
			beforeSubmit:function(){
				return before();	
			},
			success:function(data){
				callback(data);
			}
		});
	},
	createTree:function(){
		this._ajax('create', null, function(){
			window.location.reload();
		});
	},
	createTreeWithGedcom:function(){
		jQuery(this.html).find('table').hide();
		jQuery(this.html).find('div.upload').show();
	},
	getName:function(object){
		var result = [];
		(object.FirstName!=null)?result.push(object.FirstName):null;
		(object.MiddleName!=null)?result.push(object.MiddleName):null;
		(object.LastName!=null)?result.push(object.LastName):null;
		return result.join(' ');
	},
	buttons:function(){
		var self = this;
		jQuery(this.html).find('div.button').click(function(){
			var id = jQuery(this).attr('id');
			switch(id){
				case "tree": self.createTree(); break;
				case "gedcom": self.createTreeWithGedcom(); break;
			}
			return false;
		});
	},
	parse:function(e){
		var arr = [];
		jQuery(e).each(function(i,e){
			arr.push(e.Id);
		});
		return arr.join(',');
	},
	resultHandler:function(object){
		var self = this;
		jQuery(object).find('input').click(function(){
			var id = jQuery(this).attr('id');
			var indKey = jQuery(object).find('select option:selected').val();
			self._ajax(id, indKey, function(){
				if(id==="cancel"){
					jQuery(self.html).find('div.upload').hide();
					jQuery(self.html).find('div.result').html('');
					jQuery(self.html).find('table').show();
				}else {
					window.location.reload();
				}	
			});
		})
	},
	result:function(elements){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div><span>Find yourself:</span><select>');
			jQuery(elements).each(function(i,e){
				sb._('<option value="')._(e.Id)._('">')._(self.getName(e))._('</option>');
			});
		sb._('</select><input id="send" type="button" value="Send"><input id="cancel" type="button" value="Cancel">');
		return sb.result();
	},
	create:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div class="jmb-tree-creator-body">')
			sb._('<table>');
				sb._('<tr>');
					sb._('<td>')
						sb._('<div class="tree">');
							sb._('<div id="tree" class="button">Create Tree</div>');
							sb._('<fieldset><legend>Tree</legend>Creating a genealogy tree is easy with Family Tree Top.</fieldset>');
						sb._('</div>');
					sb._('</td>');
				sb._('</tr>');
				sb._('<tr>');
					sb._('<td>');
						sb._('<div class="gedcom">');
							sb._('<div id="gedcom" class="button">Create Tree With Gedcom</div>');
							sb._('<fieldset><legend>Gedcom</legend>Creating a genealogy tree is easy with Family Tree Top.</fieldset>');
						sb._('</div>');
					sb._('</td>');
				sb._('</tr>');
			sb._('</table>');
			sb._('<div class="upload" style="display:none;">');
				sb._('<div class="form"><form id="jmb:profile:addspouse" method="post" target="iframe-profile"><input type="file" name="upload"><input type="submit" value="Upload"></form></div>');
				sb._('<div class="result"></div>')
			sb._('</div>');
		sb._('</div>');
		this.html = jQuery(sb.result());
		self._ajaxForm(jQuery(this.html).find('form'), 'upload', null,function(){ }, function(json){
			var select = jQuery(self.result(json.res.Individuals));
			var div = jQuery(self.html).find('div.result');
			jQuery(div).html('');
			jQuery(div).append(select);
			self.resultHandler(select);
			var args = self.parse(json.res.Individuals)+';'+[json.res.Families].join(',');
		});
		jQuery(this.obj).append(this.html);
	}
}
*/



