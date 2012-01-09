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
	module.buttons = module.board();
	
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
			
			module.buttons.init();
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
	},
	board:function(){
		var	module = this,
			cont, 
			modal,
			box;
		cont = jQuery('<div id="jmb_desc_buttons" class="jmb-desc-buttons"><div id="select" class="jmb-desc-button-select">&nbsp;</div><div id="home" class="jmb-desc-button-home">&nbsp;</div></div>');
		return {
			overlay:function(){
				var div = jQuery('<div style="background:gray;opacity:0.6;position:absolute;top:0;left:0;cursor:pointer;">&nbsp;</div>');
				return {
					on:function(){
						var heigth, width;
						width = jQuery(module.dhxTree.allTree).width();
						height = jQuery(module.dhxTree.allTree).height();
						jQuery(div).css('height', height+'px').css('width', width+'px')
						jQuery(module.dhxTree.allTree).parent().append(div);
						jQuery(div).click(function(){
							box.off();
						});
					},
					off:function(){
						jQuery(div).unbind();
						jQuery(div).remove();
					}
				}
			},
			win:function(){
				var sb = host.stringBuffer();
				sb._('<div class="jmb-desc-select">');
					sb._('<div class="jmb-desc-select-title"><span>Show descendants of:</span></div>');
					sb._('<div class="jmb-desc-select-content">');
						sb._('<canvas id="canvas" height="200px" width="340px"></canvas>');
					sb._('</div>');
					sb._('<div class="jmb-desc-select-close">&nbsp;</div>');
				sb._('</div>');
				div = jQuery(sb.result());
				return {
					cont:function(){
						return div;
					},
					node:function(settings){
						var node, sb = host.stringBuffer(), data_style;
						sb._('<div id ="')._(settings.id)._('" class="node')._((settings.descendants)?' descendants':'')._('">');
							if(settings.descendants){
								sb._('<span style="position:relative;top:-5px;"><input type="checkbox"></span>');
							}
							sb._('<span class="title">');
								if(settings.descendants){
									sb._('<div class="text">')._(settings.title)._('</div>');
									sb._('<div class="count">')._('52 Descendants')._('</div>');
								} else {
									sb._(settings.title);
								}
							sb._('</span>');
						sb._('</div>');
						node = jQuery(sb.result());
						if(settings.style){
							data_style = settings.style;
							for(var key in data_style){
								if(data_style.hasOwnProperty(key)){
									jQuery(node).css(key, data_style[key]);
								}
							}
						}
						jQuery(div).find('div.jmb-desc-select-content').append(node);
						if(settings.finish){
							settings.finish();
						}
					},
					on:function(){
						var canvas, ctx, line;
						modal.on();
						jQuery(div).find('div.jmb-desc-select-close').click(function(){
							box.off();
						});
						//draw line
						canvas = jQuery(div).find('canvas')[0];
						ctx = canvas.getContext("2d");
						
						ctx.clearRect(0, 0, canvas.width, canvas.height);
						ctx.strokeStyle = '#000000'; // Цвет обводки
						ctx.fillStyle = '#000000'; // Цвет заливки
						ctx.lineWidth = 1; // Ширина линии

						line = function(x, y, length, hor){
							ctx.save();
							ctx.beginPath();
							ctx.moveTo(x, y);
							if(hor){
								ctx.lineTo(x, y + length);	
							} else {
								ctx.lineTo(x + length, y);
							}
							ctx.closePath();
							ctx.stroke();
							ctx.restore();
						}
						line(10, 100, 60);
						line(70, 50, 100, true);
						line(70, 50, 125);
						line(70, 150, 125);
						line(195, 20, 60, true);
						line(195, 20, 25);
						line(195, 80, 25);
						line(195, 120, 60, true);
						line(195, 120, 25);
						line(195, 180, 25);
						
						//create nodes
						this.node({
							id:'mother',
							title:'Mother',
							style:{
								top:'90px',
								left:'20px'
							}
						});
						this.node({
							id:'grandmother',
							title:'Grandmother',
							style:{
								top:'40px',
								left:'100px'
							}
						});
						this.node({
							id:'grandfather',
							title:'Grandfather',
							style:{
								top:'140px',
								left:'100px'
							}
						});
						this.node({
							id:'grandparents',
							title:'Grandparents',
							descendants:true,
							style:{
								top:'85px',
								left:'80px'
							}
						});
						this.node({
							id:'grandmotherparents',
							title:'Great Grandparents',
							descendants:true,
							style:{
								top:'35px',
								left:'200px'
							}
						});
						this.node({
							id:'grandfatherparents',
							title:'Great Grandparents',
							descendants:true,
							style:{
								top:'135px',
								left:'200px'
							}
						});
						jQuery(module.dhxTree.allTree).parent().append(div);
					},
					off:function(){
						jQuery(div).remove();
						modal.off();
					}
				}
			},
			select:function(){
				jQuery(box.cont()).find('div.jmb-desc-select-close').click(function(){
					box.off();
				});
				box.on();
			},
			home:function(){
				var user = jQuery('div[name="descendant-node"][user="true"]');
				jQuery(user[0]).click();
				jQuery('div.containerTableStyle').scrollTop(0);
				jQuery('div.containerTableStyle').scrollTop((jQuery(user[0]).offset().top - 300));
			},
			init:function(){
				var board = this;
				modal = board.overlay();
				box = board.win();
				jQuery(cont).find('div').click(function(){
					var id = jQuery(this).attr('id');
					board[id]();	
				});
				jQuery(module.dhxTree.allTree).parent().append(cont);
			}
		}
	}
}
