function JMBAncestors(obj){
	obj = jQuery('#'+obj);	
	var cont = jQuery('<div id="jit" class="jmb-ancestors-jit"></div>');
	jQuery(obj).append(cont);
	
	var self = this;
	this.index = 0;
	this.maxIndex = 50;
	var json = this._createPerson('me')
	this._createJson([json]);

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
		    label.id = node.id;            
		    label.innerHTML = self._createNode(node);
		    label.onclick = function(){
			st.onClick(node.id);
		    };
		},
		onBeforePlotNode: function(node){
			if (node.selected) {  
				node.data.$color = "#999";  
			}  
			else {  
				delete node.data.$color;  
			} 
		},
		onBeforePlotLine: function(adj){
		    if (adj.nodeFrom.selected && adj.nodeTo.selected) {
			adj.data.$color = "#000";
			adj.data.$lineWidth = 3;
		    }
		    else {
			delete adj.data.$color;
			delete adj.data.$lineWidth;
		    }
		}
	});
	//load json data
	st.loadJSON(json);
	//compute node positions and layout
	st.compute();
	//emulate a click on the root node.
	st.onClick(st.root);  
	
	_A = st;
}

JMBAncestors.prototype = {
	_createPerson:function(name){
		var object = {};
		var sb = host.stringBuffer();
		object.id = sb._(name)._('_')._(this.index).result();
		object.name = sb.clear()._(name)._('_')._(this.index).result();
		object.data = {};
		object.children = [];
		this.index++;
		return object;
	},
	_createFamily:function(child){
		var father = this._createPerson('father');
		var mother = this._createPerson('mother');
		child.children.push(father);
		child.children.push(mother);
		return [father, mother];
	},
	_createJson:function(persons){
		var array = new Array();
		for(var i=0;i<persons.length;i++){
			if(this.index >= this.maxIndex) return;
			var parents = this._createFamily(persons[i]);
			array = array.concat(parents[0], parents[1]);
		}
		this._createJson(array)
	},
	_createNode:function(node){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div class="jit-node-item">');			
			sb._('<table>');
				sb._('<tr>');
					sb._('<td><div class="photo">&nbsp;</div></td>');
					sb._('<td valign="top"><div class="data">')
						sb._('<div class="name">')._(node.name)._('</div>');
						sb._('<div class="birt">B: Year Country</div>');
						sb._('<div class="deat">D: Year Country</div>');
					sb._('</div></td>')
				sb._('</tr>')
			sb._('</table>');
			
		sb._('</div>');
		return sb.result();
	}
}

