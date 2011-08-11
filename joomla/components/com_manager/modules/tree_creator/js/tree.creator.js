function JMBTreeCreator(obj){
	this.html = null;
	
	this.obj = jQuery(['#',obj].join(''));
	
	this.create();
	this.buttons();
}

JMBTreeCreator.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("tree_creator", "TreeCreator", func, params, function(req){
				callback(req);
		})
	},
	createTree:function(){
		alert('createTree');
	},
	createTreeWithGedcom:function(){
		jQuery()
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
					sb._('<td>');
						sb._('<div class="gedcom">');
							sb._('<div id="gedcom" class="button">Create Tree With Gedcom</div>');
							sb._('<fieldset><legend>Gedcom</legend>Creating a genealogy tree is easy with Family Tree Top.</fieldset>');
						sb._('</div>');
					sb._('</td>');
				sb._('</tr>');
			sb._('</table>');
			sb._('<div class="upload">');
				sb._('<div class="form"><form id="jmb:profile:addspouse" method="post" target="iframe-profile"><input type="file" name="upload"><input type="submit" value="Send"></form></div>');
				sb._('<div class="result"></div>')
			sb._('</div>');
		sb._('</div>');
		this.html = jQuery(sb.result());
		jQuery(this.obj).append(this.html);
	}
}




