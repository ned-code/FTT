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
	this.mode = {
		'grandparents':false,
		'grandfather_parents':false,
		'grandmother_parents':false
	}
	
	this._ajax('getDescendantsCount', 'mother', function(res){
		var json = jQuery.parseJSON(res.responseText);
		var node_select_previous = jQuery('<div class="jmb-descendats-tree-node-select">&nbsp;</div>');
		jQuery(dhxTree.allTree).append(node_select_previous);
		self.showDescedantOf(node_select_previous, json);		
	});
	
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
		render = (render=='My Father')?'father':'mother';
		this._ajax('getTree', render, function(res){
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
	showDescedantOf:function(obj, json){
		if(!json.response) return;
		var parent = this;
		var sb = host.stringBuffer();
		var container = jQuery('<div class="jmb-descendants-tree-show-container"></div>');
		sb._('<table>');
			sb._('<tr>');
				sb._('<td></td>');
				sb._('<td><div id="grandmother" class="title"><span>Grandmother</span></div></td>');
				sb._('<td><div class="content"><div class="button"><input type="checkbox"></div><div class="text"><div class="header"><span>Great Grandparents</span></div><div id="gmother_count" class="count"><span>Descedants</span></div></div></div></td>');
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td><div id="parent" class="title"><span></span></div></td>');
				sb._('<td><div class="content"><div class="button"><input type="checkbox"></div><div class="text"><div class="header"><span>Grandparents</span></div><div id="parent_count" class="count"><span>Descedants</span></div></div></div></td>');
				sb._('<td></td>');
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td></td>');
				sb._('<td><div id="grandfather" class="title"><span>Grandfather</span></div></td></td>');
				sb._('<td><div class="content"><div class="button"><input type="checkbox"></div><div class="text"><div class="header"><span>Great Grandparents</span></div><div id="gfather_count" class="count"><span>Descedants</span></div></div></div></td>');
			sb._('</tr>');
		sb._('</table>');
		sb._('<div class="jmb-dt-show-header"><span>Show descendants of:</span></div>');
		sb._('<div class="jmb-dt-show-close">&nbsp;</div>');
		var html = jQuery(sb.result());
		var overlay = jQuery('<div class="jmb-dt-show-overlay">&nbsp;</div>');
		jQuery(obj).click(function(){
			//set width,height to overlay div
			var height = jQuery(obj).parent().height();
			var width = jQuery(obj).parent().width();
			jQuery(overlay).width(width).height(height);
			//append div to tree div
			jQuery(container).append(html);
			jQuery(obj).parent().append(overlay);
			jQuery(obj).parent().append(container);
			//set side
			var r_type = jQuery(storage.header.activeButton).attr('id');
			jQuery(html[0]).find('div#parent span').html(r_type[0].toUpperCase()+r_type.substr(1));		
			
			var set_descendants = function(count, sep){
				var object = jQuery(html[0]).find(sep);
				jQuery(object).parent().parent().show();
				if(count){
					jQuery(object).html(count+' Descedants');
				} else {
					jQuery(object).parent().parent().hide();
				}
			}
			
			var response = json.response;
			jQuery(html[0]).find('div#parent_count span').html(response.grandparents+' Descedants');
			set_descendants(response.grandmother_parents, 'div#gmother_count span');
			set_descendants(response.grandfather_parents, 'div#gfather_count span');
			
			jQuery(html[2]).click(function(){
				jQuery(html[2]).unbind();
				jQuery(container).remove();
				jQuery(overlay).remove();
			});
		});
	}
}
