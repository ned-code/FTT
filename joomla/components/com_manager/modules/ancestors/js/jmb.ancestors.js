function JMBAncestors(obj){
	obj = jQuery('#'+obj);	
	var cont = jQuery('<div id="jit" class="jmb-ancestors-jit"></div>');
	jQuery(obj).append(cont);

	this.json = null;
	this.response = null;
	this.ancestors = null;
	this.objects = null;
	this.imgPath = null;
	this.st = null;
	
	var self = this;
	this._ajax('get', null, function(res){
		var req = jQuery.parseJSON(res.responseText);
		self.response = req;
		self.ancestors = req.ancestors;
		self.objects = req.objects;
		self.json = req.json;
		self.imgPath = req.path;
		self.st = self.load(self.json);
	});
	_A = this;
}

JMBAncestors.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("ancestors", "JMBAncestors", func, params, function(res){
				callback(res);
		})
	},
	_getDataIndividual:function(id){
		return this.ancestors[id.substr(1, id.length)];
	},
	_getName:function(id){
		var data = this._getDataIndividual(id);
		var f=(data.indiv.FirstName)?data.indiv.FirstName:'',
			l=(data.indiv.LastName)?data.indiv.LastName:'';
		if(f.length==0){
			return l;
		}
		return [f,l].join(' '); 
	},
	_getEventString:function(id, type){
		var data = this._getDataIndividual(id);
		if(data.indiv[type].length!=0){
			var event = data.indiv[type][0];
			var year = (event.From&&event.From.Year)?event.From.Year:null, 
				place = (event.Place&&event.Place.Locations.length!=0)?event.Place.Locations[0].Country:null;
			if(year!=null&&place!=null){
				return [year,' from ',place].join("");
			} else if(year!=null&&place==null){
				return year;
			} else if(year==null&&place!=null){
				return ['from ', place].join("");
			}
			return false;
		}
	},
	_getAvatar:function(id){
		var data = this._getDataIndividual(id);
		var fId, av, defImg;
		fId = data.indiv.FacebookId;
		av = data.avatar;
		defImg = (data.indiv.Gender=="M")?'male.gif':'female.gif';
		if(av != null && av.FilePath != null){
			return ['<img src="index.php?option=com_manager&task=getResizeImage&id=',av.Id, '&w=72&h=80">'].join("");
		}
		else if(fId != '0'){
			return ['<img src="index.php?option=com_manager&task=getResizeImage&fid=', fId, '&w=72&h=80">'].join("");
		}
		var defImgPath = [self.imgPath, '/components/com_manager/modules/ancestors/images/', defImg].join("");
		return ['<img height="80px" width="72px" src="', defImgPath, '">'].join("");
	},
	_createNode:function(label, node){
		if(!node.data.flag) return ''; 
		var self = this;
		var sb = host.stringBuffer();
		var gender = node.data.gender;
		var birth, death;
		sb._('<div class="jit-node-item">');			
			sb._('<table>');
				sb._('<tr>');
					sb._('<td><div class="photo">')._(self._getAvatar(node.id))._('</div></td>');
					sb._('<td valign="top"><div class="data')._((gender=='M')?' male':' female')._('">')
						sb._('<div class="name">')._(self._getName(node.id))._('</div>');
						if(birth = self._getEventString(node.id, 'Birth')){
							sb._('<div class="birt">B: ')._(birth)._('</div>');
						} 
						if(death = self._getEventString(node.id, 'Death')){
							sb._('<div class="deat">D: ')._(death)._('</div>');
						}
					sb._('</div></td>')
				sb._('</tr>')
			sb._('</table>');
			if(node._depth == 0 && node.data.prew){
				sb._('<div class="jit-node-arrow left">&nbsp;</div>');
			}
			if(node._depth == 2 && node.data.next){
				sb._('<div class="jit-node-arrow right">&nbsp;</div>');
			}
		sb._('</div>');
		return sb.result();
	},
	_onClick:function(label, node){
		var prew = (this.objects[node.data.prew])?this.objects[node.data.prew].data.prew:node.data.prew;
		var clickItemId = (node._depth==0)?prew:node.id;
		if(clickItemId){
			var tree = $jit.json.getSubtree(this.json, clickItemId);
			this.render(tree);
		}
	},
	load:function(json){
		var self = this;
		//Create a new ST instance
		var st = new $jit.ST({
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
			    color:'#999',  
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
				//console.log(node);
			    label.id = node.id;            
			    label.innerHTML = self._createNode(label, node);
			    jQuery(label).find('.jit-node-arrow').click(function(){
			    	self._onClick(label, node);
			    });
			}
		});
		//load json data
		st.loadJSON(json);
		//compute node positions and layout
		st.compute();
		//emulate a click on the root node.
		st.select(st.root);	
		return st;
	}, 
	render:function(json){
		var st = this.st;
		//load json data
		st.loadJSON(json);
		//compute node positions and layout
		st.compute();
		//emulate a click on the root node.
		st.select(st.root);
	}
}

