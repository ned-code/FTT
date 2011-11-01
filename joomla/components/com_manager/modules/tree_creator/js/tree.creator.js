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




