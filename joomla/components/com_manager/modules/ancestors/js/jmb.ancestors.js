function JMBAncestorsObject(obj){
	var	module = this,
		cont = jQuery('<div id="jit" class="jmb-ancestors-jit"></div>'),
		home_button = jQuery('<div class="home"></div>'),
		json, parse;
		
	jQuery(obj).append(cont);
	jQuery(obj).append(home_button);

	module.path = storage.baseurl+"components/com_manager/modules/ancestors/";
	module.imagePath = module.path+'images/';
	module.container = cont;
	module.home = home_button;
	module.tree = null;
	module.usertree = null;
	module.user = null;
	module.st = null;
	module.objects = {};	
	module.active = null;
	
	module.ajax('get', null, function(res){
		json = jQuery.parseJSON(res.responseText);
		module.usertree = json.usertree;
		module.user = json.user;
		module.tree = module.getTree(json.user);
		module.st = module.init();
		storage.core.modulesPullObject.unset('JMBAncestorsObject');
	});
	
	jQuery(home_button).click(function(){
		if(module.user==null) return false;
		module.render(module.tree);
		return false;
	})
}

JMBAncestorsObject.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("ancestors", "JMBAncestors", func, params, function(res){
				callback(res);
		})
	},
	avatar:function(el){
		var	module = this,
			sb = host.stringBuffer(),
			user = el.user,
			media = el.media,
			facebook_id = user.facebook_id,
			image = (user.gender!='M')?'female.png':'male.png',
			src = [module.imagePath,image].join('');
			
		if(media!=null&&media.avatar!=null){
			return sb._('<img class="" src="index.php?option=com_manager&task=getResizeImage&id=')._(media.avatar.media_id)._('&w=72&h=80">').result(); 
		}
		//get facebook image
		if(facebook_id !== '0'){
			return sb._('<img class="" src="index.php?option=com_manager&task=getResizeImage&fid=')._(facebook_id)._('&w=72&h=80">').result();
		}
		//get default image
		return sb._('<img class="" width="72px" height="80px" src="')._(src)._('">').result();		
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
					id = parseInt(jQuery(this).attr('id'));
					if(id!=0){
						/*
						tree = $jit.json.getSubtree(module.tree, id);
						storage.tooltip.cleaner(function(){
							module.render(tree);
						});
						*/
						module.st.onClick(id);
						module.active = id;
					}
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
					object:module.usertree[node.id],
					target:object
				});
			},
			edit:function(){
				object = jQuery(label).find('.jit-edit-button');
				storage.tooltip.render('edit', {
					individuals:module.usertree,
					object:module.usertree[node.id],
					target:object
				});
			},
			facebook:function(){
				jQuery(label).find('.jit-facebook-icon').click(function(){
					window.open(['http://www.facebook.com/profile.php?id=',node.id].join(''),'new','width=320,height=240,toolbar=1');
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
			data = node.data,
			parse,
			prew,
			object;
			
		if(!data.is_exist) return '<div class="jit-node-item-question">&nbsp;</div>';		
		parse = data.parse;
		object = data.object;
		
		prew = function(){
			var	id = node.data.prew,
				objects = module.objects;
			if(id){
				return (objects[id].prew)?objects[id].prew:id;
			}
			return 0;			
		}
		
		sb._('<div class="jit-node-item">');			
			sb._('<table>');
				sb._('<tr>');
					sb._('<td>');
						sb._('<div id="')._(parse.gedcom_id)._('-view" class="photo">')._(module.avatar(object));
							sb._('<div id="')._(parse.gedcom_id)._('-edit" class="jit-edit-button">&nbsp;</div>');
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
							sb._('<div class="birt">B: ')._(parse.date('birth'))._('</div>');
						}
						if(parse.is_death){
							sb._('<div class="deat">D: ')._(parse.date('death'))._('</div>');
						}
						if(parse.relation){
							sb._('<div class="relation">')._(parse.relation)._('</div>');
						}
					sb._('</div></td>')
				sb._('</tr>')
			sb._('</table>');
			//style="display:none;"
			sb._('<div id="')._(prew(node.data.prew))._('" class="jit-node-arrow left">&nbsp;</div>');
			sb._('<div id="')._((node.data.next?node.data.next:0))._('" class="jit-node-arrow right">&nbsp;</div>');
		sb._('</div>');
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
			set_ancestors;
			
		get_parents = function(id){
			if(id[0]==='_'||!usertree[id]) return false;
			return usertree[id].parents;
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
				id: parse.gedcom_id,
				name: parse.name,
				data:{
					object:object,
					parse:parse,
					prew:(prew)?prew.id:false,
					is_exist:true
				},
				children:[]
			}
			module.objects[parse.gedcom_id] = { id:parse.gedcom_id, prew:(prew)?prew.id:false }
			return node;
		}
		
		set_null_data = function(){
			count++;
			return {
				id:'_'+count,
				name:'',
				data:{ is_exist:false },
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
					el.data.next = ind;
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
	init:function(){
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
			transition: $jit.Trans.Quart.easeInOut,
			Node: {
				height: 80,
				width: 210,
				type: 'rectangle',
				color:'#c3c3c3',  
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
			onCreateLabel: function(label, node){
				label.id = node.id;            
				label.innerHTML = module.node(label, node);
				click = module.click(label, node);
				click.init();
			},
			onPlaceLabel: function(label, node){
				var	left = jQuery(label).find('div.jit-node-arrow.left'),
					right = jQuery(label).find('div.jit-node-arrow.right'),
					data = node.data,
					active = module.active,
					mod = node._depth%2;
				
				jQuery(left).show();
				jQuery(right).show();
				if(!data.prew || mod!=0 || node.id != active){
					jQuery(left).hide();
				}
				if(mod || node.id == active){
					jQuery(right).hide();
				}
				
			},
			onBeforePlotNode:function(node){},
			onBeforePlotLine:function(adj){
				adj.data.$color = "#999";
				if(adj.nodeTo.id==module.active){
					adj.data.$color = "#F5FAE6";
				}
			}
		});
		
		//load json data
		st.loadJSON(module.tree);
		//compute node positions and layout
		st.compute();
		//emulate a click on the root node.
		module.active = st.root;
		st.select(st.root);
		return st;	
	},
	render:function(tree){
		var	module = this,
			st = module.st;
		//load json data
		st.loadJSON(tree);
		//compute node positions and layout
		st.compute();
		//emulate a click on the root node.
		st.select(st.root);
	}
}

