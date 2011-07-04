function DescendantTree(obj){
	var self = this;
	obj = jQuery("#"+obj);
	var dhxLayout;
	var dhxTree;
	var selectDiv;

	// set css style
	jQuery(obj).css('height', '500px');
	jQuery(obj).css('width', '100%');
	jQuery(obj).css('position', 'relative');
	
	// set main dhxmlx Layout
	dhxLayout = new dhtmlXLayoutObject("descendant_tree", "2U");
	dhxLayout.cells("a").hideHeader();
	dhxLayout.cells("b").hideHeader();
	dhxLayout.cells("a").setWidth(350);
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

	self.loadTree(dhxTree, jQuery(storage.header.activeButton).text());		
	dhxTree.attachEvent("onXLE", function(tree,id){
		var items = this.getAllSubItems(0).split(',');
                jQuery(items).each(function(i,e){
                	if(e.substr(0,1) == "F") {
                		dhxTree._idpull[e].htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0].style.width = '32px';
                	}
                });
		jQuery('div[name="descendant-node"]').each(function(index, element){
			var flag = jQuery(element).attr('user');
			if(flag == 'true'){
				self.click(element);
			}
			jQuery(element).click(function(){
				self.click(element);
			});
		});
	});
}

DescendantTree.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("descendant_tree", "DescendantTree", func, params, function(res){
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
	}
}
