function JMBDescendantTreeObject(obj){
	var module = this;
	var id = jQuery(obj).attr('id');
	module.obj = obj;
	module.call(id);		
}

JMBDescendantTreeObject.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("descendant_tree", "JMBDescendantTree", func, params, function(res){
				callback(res);
		})
	},
	call:function(id){
		var module = this;
		if(jQuery('#'+id).length>0){
			module.load(id);
		} else {
			setTimeout(function(){
				module.call(id);
			}, 1000);
		}
	},
	load:function(id){
		var self = this;
		var dhxLayout;
		var dhxTree;
		var selectDiv;
		var base_url = jQuery('body').attr('_baseurl');
		
		// set main dhxmlx Layout
		dhxLayout = new dhtmlXLayoutObject(id, "2U");
		dhxLayout.cells("a").hideHeader();
		dhxLayout.cells("b").hideHeader();
		dhxLayout.cells("a").setWidth(380);
		dhxLayout.cells("a").fixSize(true);
		
		// set layout in left side[layout.cells('a')]
		dhxTree = dhxLayout.cells("a").attachTree();
		//dhxTree.setIconSize("16","16")
		dhxTree.setIconSize("16","16");
		dhxTree.setSkin('dhx_skyblue');
		dhxTree.setImagePath(base_url+"components/com_manager/codebase/imgs/csh_bluebooks_custom/");
		
		this.dhxLayout  = dhxLayout;
		this.dhxTree = dhxTree;
		this.selectDiv = selectDiv;
		this.firstParent = null;
		this.show_desc = this.selectDesc(dhxTree.allTree);
		
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
	},
	loadTree:function(dhxTree, render){
		var parent = this;
		render = (render=='father')?'father':'mother';
		this._ajax('getTree', render, function(res){
			var json = jQuery.parseJSON(res.responseText);
			parent.lang = json.lang;
			parent.firstParent = json.key;
			parent.profile = new DescendantTreeProfile(parent);
			/*
			storage.header.famLine.show();
			storage.header.famLine.mode({
				enabled:['mother','father'], 
				click:'mother',
				event:function(){
					parent.profile._headerEvent();
					parent.show_desc.init();
				}
			});
			*/
			parent.show_desc.load(json, render);
			dhxTree.loadXMLString(json.xml);
			dhxTree.openAllItems(0);
			storage.core.modulesPullObject.unset('JMBDescendantTreeObject');
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
	selectDesc:function(offsetParent){
		var module = this;
		var htmlObject = {};
		var inputs = {};
		var check = false;
		var treeJson = false;
		var sb = host.stringBuffer();
		var container = jQuery('<div class="jmb-descendants-tree-show-container"></div>');
		var overlay = jQuery('<div class="jmb-dt-show-overlay">&nbsp;</div>');
		var parent = jQuery('<div class="jmb-descendats-tree-node-select">&nbsp;</div>');
		var block = false;
		jQuery(offsetParent).append(parent);
		return {
			initClose:function(){
				var _parent = this;
				jQuery(htmlObject[2]).click(function(){
					_parent.close();
				})
			},
			initSelectButton:function(){
				var _parent = this;
				jQuery(parent).click(function(){
					if(block) return false;
					var height = jQuery(offsetParent).parent().height();
					var width = jQuery(offsetParent).parent().width();
					jQuery(overlay).width(width).height(height);
					jQuery(container).append(htmlObject);
					jQuery(offsetParent).parent().append(overlay);
					jQuery(offsetParent).parent().append(container);
					_parent.initInputButtons();
					_parent.initClose();
					_parent.initData(treeJson);
					return false;
				});
			},
			initInputButtons:function(){
				inputs = jQuery(htmlObject[0]).find('input');
				jQuery(inputs).attr('disabled', false).attr('checked', false).attr('id', '0');
				jQuery(inputs).click(function(){
					jQuery(inputs).attr('checked', false);		
					jQuery(this).attr('checked', true);
					module.firstParent = jQuery(this).attr('id');
				});
			},
			initData:function(object){
				var _parent = this;
				var cells = jQuery(htmlObject[0]).find('td');
				_parent.setDescendants(object.grandparents, cells[4]);
				_parent.setDescendants(object.grandfatherparents, cells[8]);
				_parent.setDescendants(object.grandmothetparents, cells[2]);
				check = jQuery(htmlObject[0]).find('input#'+module.firstParent);
				jQuery(check).attr('checked', true);
				jQuery(cells[3]).parent().find('div#parent span').html(object.type);
			},
			setDescendants:function(object, cell){
				var span = jQuery(cell).parent().find('div.count span');
				var input = jQuery(cell).find('input');
				if(!object){
					jQuery(input).attr('disabled', true);
					jQuery(span).html('&nbsp;');
					return false;
				} 
				jQuery(input).attr('id', object.key);
				jQuery(span).html([object.count,' ', module.lang['DESCENDANTS']].join(' '));
				return true;
			},
			getCount:function(object){
				if(!object) return false;
				var parents = object.parents;
				var f_count = (parents.father)?parents.father.descendants:false;
				var m_count = (parents.mother)?parents.mother.descendants:false;
				if(f_count&&m_count){
					return (f_count>=m_count)?{key:parents.father.key,count:f_count}:{key:parents.mother.key,count:m_count};	
				} else if(f_count||m_count){
					return (f_count)?{key:parents.father.key,count:f_count}:{key:parents.mother.key,count:m_count};	
				}
				return false;
			},
			parse:function(json, type){
				var _parent = this;
				var tree = json.tree;
				var parent = (type=='father')?tree.parents.father:tree.parents.mother;
				var grandfather = (parent)?parent.parents.father:false;
				var grandmother = (parent)?parent.parents.mother:false;
				var gp_count = _parent.getCount(parent);
				var ggf_count = _parent.getCount(grandfather);
				var ggm_count = _parent.getCount(grandmother);
				var ggp_count = (ggf_count>ggm_count)?ggf_count:ggm_count;
				var diff = (gp_count&&ggp_count)?(ggp_count - gp_count):false;
				type = (type=='father')?module.lang['FATHER']:module.lang['MOTHER'];
				var key;
				if(diff){
					key = (diff>3)?ggp_count.key:gp_count.key;
				} else {
					key = (gp_count)?gp_count.key:json.key;
				}
				return {
					start: key,
					type:type,
					grandparents: gp_count,
					grandfatherparents: ggf_count,
					grandmothetparents: ggm_count
				}
				
			},
			close:function(){
				jQuery(htmlObject[2]).unbind();
				jQuery(inputs).unbind();
				jQuery(container).remove();
				jQuery(overlay).remove();
				var id = jQuery(check).attr('id');
				if(id!=module.firstParent){
					module.loadTreeById(module.firstParent);
				}
			},
			load:function(json, type){
				var _parent = this;
				treeJson = _parent.parse(json, type);
				block = false;
				if(!treeJson.grandparents) block = true;
			},
			init:function(){
				var _parent = this;
				sb._('<table>');
					sb._('<tr>');
						sb._('<td></td>');
						sb._('<td><div class="title"><span>')._(module.lang['GRANDMOTHER'])._('</span></div></td>');
						sb._('<td><div class="content"><div class="button"><input type="checkbox"></div><div class="text"><div class="header"><span>')._(module.lang['GREAT_GRANDPARENTS'])._('</span></div><div class="count"><span>&nbsp;</span></div></div></div></td>');
					sb._('</tr>');
					sb._('<tr>');
						sb._('<td><div id="parent" class="title"><span></span></div></td>');
						sb._('<td><div class="content"><div class="button"><input type="checkbox"></div><div class="text"><div class="header"><span>')._(module.lang['GRANDPARENTS'])._('</span></div><div class="count"><span>&nbsp;</span></div></div></div></td>');
						sb._('<td></td>');
					sb._('</tr>');
					sb._('<tr>');
						sb._('<td></td>');
						sb._('<td><div class="title"><span>')._(module.lang['GRANDFATHER'])._('</span></div></td></td>');
						sb._('<td><div class="content"><div class="button"><input type="checkbox"></div><div class="text"><div class="header"><span>')._(module.lang['GREAT_GRANDPARENTS'])._('</span></div><div class="count"><span>&nbsp;</span></div></div></div></td>');
					sb._('</tr>');
				sb._('</table>');
				sb._('<div class="jmb-dt-show-header"><span>Show descendants of:</span></div>');
				sb._('<div class="jmb-dt-show-close">&nbsp;</div>');
				htmlObject = jQuery(sb.result()); 
				_parent.initSelectButton();	
				return htmlObject;
			}
		}		
	}
}
