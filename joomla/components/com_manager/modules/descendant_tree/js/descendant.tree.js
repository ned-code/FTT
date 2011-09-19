function JMBDescendantTree(obj){
	var self = this;
	obj = jQuery("#"+obj);
	var dhxLayout;
	var dhxTree;
	var selectDiv;
	
	// set main dhxmlx Layout
	dhxLayout = new dhtmlXLayoutObject("descendant_tree", "2U");
	dhxLayout.cells("a").hideHeader();
	dhxLayout.cells("b").hideHeader();
	dhxLayout.cells("a").setWidth(380);
	dhxLayout.cells("a").fixSize(true);
	
	// set layout in left side[layout.cells('a')]
	dhxTree = dhxLayout.cells("a").attachTree();
	//dhxTree.setIconSize("16","16")
	dhxTree.setIconSize("16","16");
	dhxTree.setSkin('dhx_skyblue');
	dhxTree.setImagePath("components/com_manager/codebase/imgs/csh_bluebooks_custom/");
	
	this.dhxLayout  = dhxLayout;
	this.dhxTree = dhxTree;
	this.selectDiv = selectDiv;
	//this.profileEdit = new MemberProfileEdit(this);
	this.profile = new DescendantTreeProfile(this);
	//this.profileEdit = new DescendantTreeProfileEdit(this);
	this.obj = obj;
	this.firstParent = null;
	this.selection = null;

	var node_select_previous = jQuery('<div class="jmb-descendats-tree-node-select">&nbsp;</div>');
	jQuery(dhxTree.allTree).append(node_select_previous);
	self.showDescedantOf(node_select_previous);
	
	storage.header.famLine.show();
	storage.header.famLine.mode('mother');
	
	self.loadTree(dhxTree, 'mother');		
	dhxTree.attachEvent("onXLE", function(tree,id){
		var items = this.getAllSubItems(0).split(',');
                jQuery(items).each(function(i,e){
                	if(e.substr(0,1) == "F") {
                		dhxTree._idpull[e].htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0].style.width = '32px';
                	}
                });
		jQuery('div[name="descendant-node"]').each(function(index, element){
			jQuery(element).click(function(){
				self.click(element);
			});
		});
		var user = jQuery('[name="descendant-node"][user="true"]');
		jQuery(user[0]).click();
		var x = jQuery(user[0]).offset().top - 300;
		jQuery('div.containerTableStyle').animate({scrollTop: x}, 250);
	});	
}

JMBDescendantTree.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("descendant_tree", "JMBDescendantTree", func, params, function(res){
				callback(res);
		})
	},
	loadTree:function(dhxTree, render){
		var parent = this;
		render = (render=='father')?'father':'mother';
		this._ajax('getTree', render, function(res){
			var json = jQuery.parseJSON(res.responseText);
			dhxTree.loadXMLString(json.xml);
			dhxTree.openAllItems(0);
			parent.selection = json.selection;
			jQuery(parent.selection_html).find('#grandparents input').attr('checked', 'checked');
		});
	},
	loadTreeById:function(id){
		var dhxTree = this.dhxTree;
		dhxTree.deleteChildItems('0');
		dhxTree.deleteItem('0');
		this._ajax('getTreeById', id, function(res){
			dhxTree.loadXMLString(res.responseText);
			dhxTree.openAllItems(0);
		});
	},
	click:function(element){
		if(this.selectDiv) jQuery(this.selectDiv).css('background', 'none');
		jQuery(element).css('background', 'yellow');
		this.selectDiv = element;
		//item click
		this.treeClick(element);
	},
	treeClick:function(obj){
		var profile = this.profile;
		var id = jQuery(obj).attr('id');
		profile.render(id);	
	},
	showDescedantOf:function(obj){
		var parent = this;
		var sb = host.stringBuffer();
		var container = jQuery('<div class="jmb-descendants-tree-show-container"></div>');
		sb._('<table>');
			sb._('<tr>');
				sb._('<td></td>');
				sb._('<td><div class="title"><span>Grandmother</span></div></td>');
				sb._('<td><div id="grandmother_parents" class="content"><div class="button"><input type="checkbox"></div><div class="text"><div class="header"><span>Great Grandparents</span></div><div class="count"><span>&nbsp;</span></div></div></div></td>');
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td><div id="parent" class="title"><span></span></div></td>');
				sb._('<td><div id="grandparents" class="content"><div class="button"><input type="checkbox"></div><div class="text"><div class="header"><span>Grandparents</span></div><div class="count"><span>&nbsp;</span></div></div></div></td>');
				sb._('<td></td>');
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td></td>');
				sb._('<td><div class="title"><span>Grandfather</span></div></td></td>');
				sb._('<td><div id="grandfather_parents"  class="content"><div class="button"><input type="checkbox"></div><div class="text"><div class="header"><span>Great Grandparents</span></div><div class="count"><span>&nbsp;</span></div></div></div></td>');
			sb._('</tr>');
		sb._('</table>');
		sb._('<div class="jmb-dt-show-header"><span>Show descendants of:</span></div>');
		sb._('<div class="jmb-dt-show-close">&nbsp;</div>');
		var html = jQuery(sb.result());
		var overlay = jQuery('<div class="jmb-dt-show-overlay">&nbsp;</div>');
		parent.selection_html = html[0];
		
		jQuery(obj).click(function(){
			if(!parent.selection.response) return;
			//set width,height to overlay div
			var height = jQuery(obj).parent().height();
			var width = jQuery(obj).parent().width();
			jQuery(overlay).width(width).height(height);
			//append div to tree div
			jQuery(container).append(html);
			jQuery(obj).parent().append(overlay);
			jQuery(obj).parent().append(container);
			//close button
			jQuery(html[2]).click(function(){
				jQuery(html[2]).unbind();
				jQuery(container).remove();
				jQuery(overlay).remove();
				jQuery(html[0]).find('input').unbind();
				parent.loadTreeById(parent.firstParent);
			});
			
			var p = jQuery(storage.header.activeButton).attr('id');
			p = p[0].toUpperCase() + p.substr(1);
			jQuery(html[0]).find('#parent span').html(p);
			
			var set_count = function(object, json){
				if(!json){
					jQuery(object).find('input').attr('disabled', true);
					jQuery(object).find('div.count span').html('&nbsp;');
					return;
				} 
				jQuery(object).find('div.count span').html([json.count,' Descendants'].join(' '));
			}
			
			var res = parent.selection.response;
			jQuery(html[0]).find('input').attr('disabled', false);
			set_count(jQuery(html[0]).find('#grandparents'), res.grandparents);
			set_count(jQuery(html[0]).find('#grandfather_parents'), res.greatgrandparents.father);
			set_count(jQuery(html[0]).find('#grandmother_parents'), res.greatgrandparents.mother);
			
			jQuery(html[0]).find('input').click(function(){
				jQuery(html[0]).find('input').attr('checked', false);
				var id = jQuery(this).parent().parent().attr('id');
				jQuery(this).attr('checked', true);
				switch(id){
					case "grandparents": parent.firstParent = res.grandparents.id; break;
					case "grandfather_parents": parent.firstParent = res.greatgrandparents.father.id; break;
					case "grandmother_parents": parent.firstParent = res.greatgrandparents.mother.id; break;
				}
			});
			
		});
	}
}
