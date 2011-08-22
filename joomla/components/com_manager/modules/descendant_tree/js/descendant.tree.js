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

	self.loadTree(dhxTree, jQuery(storage.header.activeButton).text());		
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
		var x = jQuery(user[0]).offset().top - 130;
		console.log(x);
		jQuery('div.containerTableStyle').animate({scrollTop: x}, 500);
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
	}
}
