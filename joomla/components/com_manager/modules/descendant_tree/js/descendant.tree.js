function JMBDescendantTreeObject(obj){
	var	module = this,
		id = jQuery(obj).attr('id');
		
	module.obj = obj;
	module.baseurl = jQuery('body').attr('_baseurl');	
	module.imgPath = module.baseurl+"components/com_manager/modules/descendant_tree/imgs/"
	module.imagePath = module.baseurl+"components/com_manager/codebase/imgs/csh_bluebooks_custom/";
	module.profile_container = jQuery('<div id="jmb_desc_profile_cont"></div>')[0];
	module.dhxLayout = null;
	module.dhxTree = null;
	module.modal = null;
	module.members = null;
	module.select = null;
	module.first = null;
	module.lang = null;
	
	module.profile = new DescendantTreeProfile(module);
	
	module.check(id);		
}

JMBDescendantTreeObject.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("descendant_tree", "JMBDescendantTree", func, params, function(res){
				callback(res);
		})
	},
	overlay:function(){
		var	module = this,
			modal_box;

		modal_box = jQuery('<div class="jmb-dtp-modal"></div>');
		jQuery(modal_box).width(jQuery(module.profile_container).parent().width()+'px');
		jQuery(modal_box).height(jQuery(module.profile_container).parent().height()+'px');
		jQuery(module.profile_container).parent().append(modal_box);
		jQuery(modal_box).hide();

		return {
			on:function(){
				jQuery(modal_box).width(jQuery(module.profile_container).parent().width()+'px');
				jQuery(modal_box).height(jQuery(module.profile_container).parent().height()+'px');
				jQuery(modal_box).show();	
			},
			off:function(){
				jQuery(modal_box).hide();
			},
		}
	},
	check:function(id){
		var	module = this,
			object;
		object = jQuery('#'+id);
		if(object.length!=0){
			module.init(id);
		} else {
			setTimeout(function(){
				module.check(id);
			}, 250);
		}
	},
	init:function(id){
		var	module = this,
			dhxLayout,
			dhxTree,
			select,
			items,
			user;

		// set main dhxmlx Layout
		dhxLayout = new dhtmlXLayoutObject(id, "2U");
		dhxLayout.cells("a").hideHeader();
		dhxLayout.cells("b").hideHeader();
		dhxLayout.cells("a").setWidth(380);
		dhxLayout.cells("a").fixSize(true);
		
		dhxLayout.cells("b").attachObject(module.profile_container);		

		// set layout in left side[layout.cells('a')]
		dhxTree = dhxLayout.cells("a").attachTree();
		//dhxTree.setIconSize("16","16")
		dhxTree.setIconSize("16","16");
		dhxTree.setSkin('dhx_skyblue');
		dhxTree.setImagePath(module.imagePath);

		module.dhxLayout = dhxLayout;
		module.dhxTree = dhxTree;
		module.modal = module.overlay();
		
		
		module.loadTree(dhxTree, 'mother');		
		
		dhxTree.attachEvent("onXLE", function(tree,id){
			var correct_style = function(item){
				var	length = item.childsCount,
					childs = item.childNodes,
					offset = (item.span.childNodes[0].nodeName == 'DIV')?0:1;
				if(length == 0) return false;
				jQuery(childs).each(function(i, child){
					if(offset){
						jQuery(child.htmlNode).css('margin-left', '7px');
					} else {
						if(child.span.childNodes[0].nodeName == 'DIV'){
							jQuery(child.span).css('padding-left', '10px');
						}
					}
					correct_style(child);
				});
			}
			correct_style(dhxTree._idpull[0].childNodes[0]);

			jQuery('div[name="descendant-node"]').each(function(index, element){
				jQuery(element).click(function(){
					module.click(this);
				});
			});
			
			user = jQuery('div[name="descendant-node"][user="true"]');
			jQuery(user[0]).click();
			jQuery('div.containerTableStyle').scrollTop((jQuery(user[0]).offset().top - 300));
		});
	},
	loadTree:function(dhxTree, render){
		var	module = this,
			json;
		render = (render=='father')?'father':'mother';
		module.ajax('getTree', render, function(res){
			json = jQuery.parseJSON(res.responseText);
			module.lang = json.lang;
			module.first = json.key;
			module.members = json.members;
			dhxTree.loadXMLString(json.xml);
			dhxTree.openAllItems(0);
			storage.core.modulesPullObject.unset('JMBDescendantTreeObject');
		});
	},
	loadTreeById:function(id){
		/* 
		* to fix;
		*/
		var dhxTree = this.dhxTree;
		dhxTree.deleteChildItems('0');
		dhxTree.deleteItem('0');
		this._ajax('getTreeById', id, function(res){
			dhxTree.loadXMLString(res.responseText);
			dhxTree.openAllItems(0);
		});
	},
	click:function(element){
		var	module = this;	
		if(module.select===element) return false;
		if(module.select!=null) jQuery(module.select).css('background', 'none');
		storage.tooltip.cleaner();
		jQuery(element).css('background', 'yellow');
		module.select = element;
		//item click
		module.treeClick(element);
	},
	treeClick:function(obj){
		var	module = this;
		module.profile.render(module.members[jQuery(obj).attr('id')]);
	}
}
