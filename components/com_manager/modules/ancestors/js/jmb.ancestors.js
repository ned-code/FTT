function JMBAncestorsObject(obj, popup){
	var	module = this,
		cont = jQuery('<div id="jit" class="jmb-ancestors-jit"></div>'),
		home_button = jQuery('<div class="jmb-ancestors-home"></div>'),
		json, parse;
		
	jQuery(obj).append(cont);
	jQuery(obj).append(home_button);

	module.parent = obj;
	module.nodePull = [];
	module.overlay = jQuery('<div class="jmb-ancestors-overlay">&nbsp;</div>');
	module.path = storage.baseurl+"components/com_manager/modules/ancestors/";
	module.imagePath = module.path+'images/';
	module.container = cont;
	module.home = home_button;
	module.tree = null;
	module.usertree = null;
	module.user = null;
	module.st = null;
	module.objects = {};	
	module.spouse = null;
	module.nodes = null;
	module.clickNode = null;
    module.targetNode = null;
    module.loggedByFamous = parseInt(jQuery(document.body).attr('_type'));
    module.prefix = 'jit'+((new Date()).valueOf());

	jQuery(home_button).click(function(){
		if(module.user==null) return false;
        module.st.select(module.st.root);
        return false;
	})
	
	storage.family_line.bind('JMBAncestorsObject', function(res){
		var nodes = module.nodePull;
		for(var index in nodes){
			var el = nodes[index];
			var data = el.node.data.ftt_storage;
			var label = el.label;
			var user = (data.is_exist)?data.object.user:false;
			if(!user) continue;
            var selector = 'div#'+res._line+'_line';
            if(res._active){
                jQuery(label).find(selector).addClass(res._line);
            } else {
                jQuery(label).find(selector).removeClass(res._line);
            }
		}
	});

	module.usertree = storage.usertree.pull;
	module.user = module.usertree[storage.usertree.gedcom_id];
	module.tree = module.getTree(module.user);

    jQuery(module.parent).ready(function(){
        (function(){
            var loader = function(){
                if(jQuery('#jit').length != 0 && typeof($jit.ST) === 'function'){
                    module.init(function(){
                        storage.core.modulesPullObject.unset('JMBAncestorsObject');
                    });
                } else {
                    setTimeout(function(){
                        loader();
                    }, 250)
                }
            }
            loader();
        })()
    })

    core.destroy.set('ancestors', function(){

    });
}

JMBAncestorsObject.prototype = {
	ajax:function(func, params, callback){
		storage.callMethod("ancestors", "JMBAncestors", func, params, function(res){
				callback(res);
		})
	},
	avatar:function(el){
        return storage.usertree.avatar.get({
            object:el,
            width:72,
            height:80
        });
	},
	click:function(label, node){
		var	module = this,
			sub,
			id,
			object,
			tree;
		return {
			arrow:function(){
				sub = this;
				jQuery(label).find('.jit-node-arrow').click(function(){
					id = jQuery(this).attr('id');
					module.targetNode = id;
					module.st.onClick(id);
				});
			},
			photo:function(){
				object = jQuery(label).find('div.photo');
				jQuery(object).mouseenter(function(){
					jQuery(label).find('.jit-edit-button').addClass('hover');
					jQuery(label).find('.jit-facebook-icon').addClass('hover');
				}).mouseleave(function(){
					jQuery(label).find('.jit-edit-button').removeClass('hover');
					jQuery(label).find('.jit-facebook-icon').removeClass('hover');
				});
				storage.tooltip.render('view', {
					button_facebook:false,
					button_edit:false,
					gedcom_id:node.id.split('_')[1],
					target:object,
                    afterEditorClose:function(){
                        storage.tooltip.cleaner(function(){
                            module.render();
                        });
                    }
				});
			},
			edit:function(){
				object = jQuery(label).find('.jit-edit-button');
				storage.tooltip.render('edit', {
                    button_edit:false,
                    button_facebook:false,
                    gedcom_id:node.id.split('_')[1],
					target:object,
                    afterEditorClose:function(){
                        storage.tooltip.cleaner(function(){
                            module.render();
                        });
                    }
				});
			},
			facebook:function(){
				jQuery(label).find('.jit-facebook-icon').click(function(){
                    var id = jQuery(this).attr('id');
					window.open(['http://www.facebook.com/profile.php?id=',id].join(''),'new','width=320,height=240,toolbar=1');
					return false;
				});
			},
			init:function(){
				sub = this;
				if(node.id[0]!=='_'){
					sub.arrow();
					sub.photo();
					sub.edit();
					sub.facebook();
				}
			}
		}
	},
	node:function(label, node){
		var	module = this,
			sb = host.stringBuffer(),
			data = node.data.ftt_storage,
			parse,
			place,
			prew,
			object,
			fam_opt;
			
		if(!data.is_exist) return '<div class="jit-node-item-question">&nbsp;</div>';		
		parse = data.parse;
		object = data.object;
		fam_opt = storage.family_line.get.opt();
		
		prew = function(){
			var	id = node.data.ftt_storage.prew,
				objects = module.objects;
			if(id){
				return (objects[id].prew)?objects[id].prew:id;
			}
			return 0;			
		}
		
		event_string = function(type){
			var p = parse.place(type);
			var year = parse[type]('year');
			var city = (p.city!=null)?p.city:'';
			var country = (p.country!=null)?p.country:'';
			if(p.length!=0){
				return year + ' ('+city+((country.length!=0)?','+country.substr(0, 3):'')+')';
			}
			return year;			
		}
		
		sb._('<div id="father_line" class="line-without-border">')
		sb._('<div id="mother_line" class="line-without-border">')
		sb._('<div class="jit-node-item">');			
			sb._('<table>');
				sb._('<tr>');
					sb._('<td>');
						sb._('<div id="')._(parse.gedcom_id)._('-view" class="photo">')._(module.avatar(object));
							if(!module.loggedByFamous && parse.is_editable){
                                sb._('<div id="')._(parse.gedcom_id)._('-edit" class="jit-edit-button">&nbsp;</div>');
                            }
                            if(parse.facebook_id != '0'){
								sb._('<div class="jit-facebook-icon" id="')._(parse.facebook_id)._('">&nbsp;</div>');
							}
							if(parse.is_death){
								sb._('<div class="jit-death-marker">&nbsp;</div>');
							}
						sb._('</div>');
					sb._('</td>');
					sb._('<td valign="top"><div class="data')._((parse.gender=='M')?' male':' female')._('">')
						sb._('<div class="name">')._(parse.name)._('</div>');
						if(parse.is_birth){
							place = parse.place('birth');
							sb._('<div class="birt">B: ')._(event_string('birth'))._('</div>');
						}
						if(parse.is_death){
							place = parse.place('death');
							sb._('<div class="deat">D: ')._(event_string('death'))._('</div>');
						}
						if(parse.relation){
							sb._('<div class="relation">')._(parse.relation)._('</div>');
						}
					sb._('</div></td>')
				sb._('</tr>')
			sb._('</table>');
			//style="display:none;"
			sb._('<div id="')._(prew(node.data.ftt_storage.prew))._('" class="jit-node-arrow left">&nbsp;</div>');
			sb._('<div id="')._((node.data.ftt_storage.next?node.data.ftt_storage.next:0))._('" class="jit-node-arrow right">&nbsp;</div>');
		sb._('</div>');
		sb._('</div></div>');
		return sb.result();
	},
	getTree:function(ch){
		var	module = this,
			user = module.user,
			usertree = module.usertree,
			tree = {},
			count = 0,
			get_parents,
			get_parents_id,
			set_data,
			set_null_data,
			set_ancestors,
            getPfexix;

        getPfexix = function(){
            var a = [];
            for(var key in arguments){
                if(arguments.hasOwnProperty(key)) a.push(arguments[key]);
            }
            return a.join('_');
        }

		get_parents = function(id){
			if(id[0]==='_'||!usertree[id.split('_')[1]]) return false;
			return usertree[id.split('_')[1]].parents;
		}
		
		get_parents_id = function(par){
			var first, key;
			for(key in par){
				first = par[key];
				break;
			}
			return [(first.mother!=null)?first.mother.gedcom_id:false,(first.father!=null)?first.father.gedcom_id:false];
		}
		
		set_data = function(id, prew){
			if(!usertree[id]) return set_null_data();
			var	object = usertree[id],
				parse = storage.usertree.parse(object),
				node;
			
			node = {
				id: getPfexix(module.prefix, parse.gedcom_id),
				name: parse.name,
				data:{
					ftt_storage:{
						object:object,
						parse:parse,
						prew:(prew)?prew.id:false,
						is_exist:true
					}
				},
				children:[]
			}
			module.objects[getPfexix(module.prefix, parse.gedcom_id)] = { id:parse.gedcom_id, prew:(prew)?prew.id:false }
			return node;
		}
		
		set_null_data = function(){
			count++;
			return {
				id: getPfexix('', module.prefix, count),
				name:'',
				data:{ ftt_storage:{ is_exist:false} },
				children:[]
			}
		}
						
		set_ancestors = function(el){
			var	ind = el.id,	
				parents = get_parents(ind),
				ids;
			if(parents&&parents.length!=0){
				ids = get_parents_id(parents);
				el.children.push(set_data(ids[0], el));
				el.children.push(set_data(ids[1], el));
				if(ids){
					el.data.ftt_storage.next = ind;
				}
				if(ids[0]){
					set_ancestors(el.children[0]);
				}
				if(ids[1]){
					set_ancestors(el.children[1]);
				}				
			} else {
				el.children.push(set_null_data());
				el.children.push(set_null_data());
			}
		}
		
		tree = set_data(ch.user.gedcom_id);
		set_ancestors(tree);
		return tree;
	},
	init:function(callback){
		var	module = this,
			st,
			click;

		//Create a new ST instance
		st = new $jit.ST({
			injectInto: 'jit',
			levelsToShow: 2,
			levelDistance: 30,
			offsetX:240,
			offsetY:0,
			duration: 800,
			//transition: $jit.Trans.Quart.easeInOut,
			transition: $jit.Trans.Quint.easeOut,
			Node: {
				height: 84,
				width: 214,
				type: 'rectangle',
				color:'#C3C3C3',  
				lineWidth: 2,  
				align:"center",  
				overridable: true
			},
			Edge: {
				type: 'bezier',
				lineWidth: 2,  
				color:'#999',  
				overridable: true
			},
			onBeforeCompute: function(node){  
				//overlay
				var	width = jQuery(module.parent).width(), 
					height  = jQuery(module.parent).height();
				jQuery(module.overlay).css('width', width+'px').css('height', height+'px');
				jQuery(module.parent).append(module.overlay);
				//set spouse				
				var parent = node.getParents();
				if(parent.length!=0){
					var ptree = $jit.json.getSubtree(module.tree, parent[0].id);
					var id = (ptree.children[0].id != node.id)?ptree.children[0].id:ptree.children[1].id;
					module.spouse = module.st.graph.getNode(id);
				} else {
					module.spouse = null;
				}
					
				//set active nodes
				var subtree = $jit.json.getSubtree(module.tree, node.id);
				var nodes = {};
				var set_node = function(tr, level){
					if(level == 3) return false; 
					nodes[tr.id] = tr.id;
					if(tr.children!=0){
						set_node(tr.children[0], level + 1);
						set_node(tr.children[1], level + 1);
					}
				}
				set_node(subtree, 0);
				module.nodes = nodes;	
			},  
			onAfterCompute: function(){  
				jQuery(module.overlay).remove();
			},  
			onCreateLabel: function(label, node){
				label.id = node.id;
				label.innerHTML = module.node(label, node);
				click = module.click(label, node);
				click.init();
				module.nodePull.push({"node":node,"label":label});
			},
			onPlaceLabel: function(label, node){
				var	left = jQuery(label).find('div.jit-node-arrow.left'),
					right = jQuery(label).find('div.jit-node-arrow.right'),
					data = node.data.ftt_storage,
					active = module.st.clickedNode.id,
					mod = node._depth%2;
				
				jQuery(left).show();
				jQuery(right).show();
				if(!data.prew || mod!=0 || node.id != active){
					jQuery(left).hide();
				}
				if(mod || node.id == active){
                    jQuery(right).hide();
				}
                if(data.object && data.object.parents == null){
                    jQuery(right).hide();
                }

				if(node.id in module.nodes){
					jQuery(label).css('visibility', 'visible');
				} else {
					jQuery(label).css('visibility', 'hidden');
				}
			},
			onBeforePlotNode:function(node){
				if(node.id in module.nodes /*&& module.nodes[node.id][0] == '_'*/){
					node.data.$color = "#C3C3C3"
				} else {
					node.data.$color = "#EDF0F8"
				}
			},
			onBeforePlotLine:function(adj){	
				adj.data.$color = "#EDF0F8";
				if(adj.nodeTo.id in module.nodes && adj.nodeFrom.id in module.nodes){
					adj.data.$color = "#999";
				}
			}
		});
		
		module.st = st;

		//load json data
		st.loadJSON(module.tree);
		//compute node positions and layout
		st.compute();
		//emulate a click on the root node.
        st.onClick(st.root, {
            onComplete:function() {
                if(callback){
                    callback();
                }
            }
        });

        module.targetNode = st.root;
	},
	render:function(){
		var	module = this,
			st = module.st;

        module.tree = module.getTree(module.user);

		//load json data
		st.loadJSON(module.tree);
		//compute node positions and layout
		st.compute();
		//emulate a click on the root node.
		st.select(module.targetNode);
	}
}

