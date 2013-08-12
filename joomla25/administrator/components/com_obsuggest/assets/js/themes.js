Element.extend({
	selectItem: function(value){
		var ops = this.options;
		for(var i=0; i<ops.length; i++){
			if(ops[i].value == value){
				this.selectedIndex = i;
				return;
			}
		}
		//alert(this)
	}	
});
//alert(Element.selectItem);
function abc(v){
	var ret = '';
	for(var i=0;i<v.length;i++){
		var charCode = v.charCodeAt(i);
		if(charCode>=65 && charCode<=90)
			ret+="-"+v.charAt(i).toLowerCase()
		else
			ret+=v.charAt(i)	
	}
	return ret
}
function getStyleFromId(id){
	var pos1 = id.indexOf("[");
	var pos2 = id.indexOf("]");
	return abc(id.substr(pos1+1,pos2-pos1-1))
}
var Value = {
	up: function(e, max){
		if(!$defined(max)) max = 10
		//alert(e);
		var el = document.getElementById(e)
		//alert(el);
		var val = parseInt(el.innerHTML);
		if(val>=max) return;
		val = (val + 1) + "px";
		el.innerHTML=(val)		
		updatePreview(abc(this.getStyle(e)), val)
	},
	down: function(e, min){
		if(!$defined(min)) min = 0
		var el = document.getElementById(e)
		var val = parseInt(el.innerHTML);
		if(val<=min) return;
		val = (val - 1) + "px";
		el.innerHTML=(val)
		updatePreview(abc(this.getStyle(e)), val)
	},
	getStyle: function(id){
		var style = id.substr(id.indexOf("[")+1)
		style = style.substr(0, style.indexOf("]"))
		return style;
	}
}
function updatePreview(style, val){
	if(theme.box_selected.element_selected)
		theme.box_selected.element_selected.setStyle(style, val)
	else
		theme.box_selected.setStyle(style, val)
}

var ThemeDesigner = new Class({
	lines: [],
	boxes: [],
	line_selected: null,
	box_selected: null,
	total_line: 0,
	total_box: 0,
	css: {},
	css_length: 0,
	allow_css: 	{
					'color':'color', 'background-color':'backgroundColor', 'font-size':'fontSize', 
					'font-style':'fontStyle', 'font-weight':'fontWeight', 'text-decoration':'textDecoration',
					'border-color':'borderColor', 'border-width':'borderWidth', 'border-style':'borderStyle',
					'padding-top':'paddingTop', 'padding-right':'paddingRight', 'padding-bottom':'paddingBottom', 'padding-left':'paddingLeft',
					'margin-top':'marginTop', 'margin-right':'marginRight', 'margin-bottom':'marginBottom','margin-left':'marginLeft'
				},
	main: null,
	//
	contents : {
	'NONE'				: 'None',//
	'TITLE' 			: 'Idea Title',//
	'USERNAME'			: 'Username',//
	'DATECREATED'		: 'Date Created',//
	'BOXVOTE'			: 'Box Vote',//
	'CONTENT'			: 'Idea Content',//
	'COMMENTCOUNT'		: 'Comment Count',//
	'CHANGEACTION'		: 'Comment Text',
	'READMORE'			: 'Read More',//
	'CHANGESTATUS'		: 'Change Status',
	'CURRENTSTATUS'		: 'Current Status',
	'RESPONSE'			: 'Box Response',
	'ACTIONS'			: 'User actions'
	},
	//
	//
	//
	content_childs : {
		'RESPONSE' 		: {'RS_TITLE' : 'Response Text', 'RS_CONTENT' : 'Contents' , 'RS_ADD' : 'Add Command', 'RS_EDIT' : 'Edit Command'},
		'COMMENTCOUNT'	: {'COMMENT_NUMBER' : 'Number', 'COMMENT_TEXT' : 'Text'},
		'CURRENTSTATUS'	: {'NONE' : 'Start / Set Close', 'STARTED' : 'Started' , 'PLANNED' : 'Planned', 'UNDER_REVIEW' : 'Under Review',
			'COMPLETE' : 'Complete', 'DECLINE' : 'Decline', 'DEADLINE' : 'Deadline', 'ACCEPT' : 'Accept'					
		}
		
	},
	//
	initialize: function(){
		//alert("asdasd")
		var p = this;
		this.initListContent()
		this.main = $("designer-idea")
		window.addEvent("domready",
			function(){
				$("box-position").addEvent("change",
					function(evt){
						var el = p.box_selected;
						el.setStyle("float", this.value);
						
						this.main = $("designer-idea")
						//alert(this.value)
					}
				)
				//alert($E("#box-position"))
			}
		)
	},
	addNewLine: function(options){
		
		var p = this;
		var new_line = new Element("DIV");
		new_line.index = this.total_line;
		new_line.count = 0;		
		this.lines[this.total_line] = new_line;		
		new_line.inject(this.main)
		new_line.addClass("designer-line")
		new_line.addEvent('click',
			function(evt){
				p.selectLine(this)
			}
		)				
		this.selectLine(this.lines[this.total_line])
		this.total_line++;
		return this;
	},
	selectLine: function(line){
		line = ($type(line)=='integer') ? (this.lines[line]) : line
		if($type(line)=='element'){
			if($defined(this.line_selected)) this.line_selected.removeClass("selected")//.addClass("designer-line");
			line.addClass("selected")//.removeClass("designer-line");
			this.line_selected = line;
		}
		return this;
	},
	moveRowUp: function(){
		var row = this.line_selected;
		var pos = row.getPrevious();
		if(pos){
			row.injectBefore(pos)
		}
	},
	moveRowDown: function(){
		var row = this.line_selected;
		var pos = row.getNext();
		if(pos){
			row.injectAfter(pos)
		}
	},
	moveBox: function(type){
		type = type == 'pre'?'pre':'next'
		var box = $(this.box_selected);
		if(!box) return;
		
		var box_float = box.getStyle("float");
		if(box_float!=null) box_float=box_float.toLowerCase();
		var x = (type=='left')?'right':'left'
		var pos = (type=='pre') ? (box_float=='left' ? box.getPrevious() : box.getNext()) : (box_float=='left' ? box.getNext() : box.getPrevious())
		//alert(pos.hasClass("line-clear"))
		if(pos){	
			if(pos.hasClass("line-clear")) return;

			if(type=='next' && box_float=='right' && pos.getStyle("float")=='left')	return
			if(type=='next' && box_float=='left' && pos.getStyle("float")=='right')	return
			if(type=='pre' && box_float=='left' && pos.getStyle("float")=='right') 	return	
			box.remove();
			(type=='pre') ? (box_float=='left' ? box.injectBefore(pos) : box.injectAfter(pos)) : (box_float=='left' ? box.injectAfter(pos) : box.injectBefore(pos))
			//updatePreview();
		}
	},
	moveBoxUp: function(){
		this.moveBox('pre')
	},
	moveBoxDown: function(){
		this.moveBox()
	},
	
	save: function(name){
		//alert($(document).getElementsByClassName)
		var lines = $$("div.designer-line");
		if(!lines) return;
		var html='<div id="idea_info_[php] echo $this->getIdeaId();[/php]" class="box-idea">'+"[n]";
		var xml = '<theme>[n][t]<lines>';
		var className = "";
		if(lines){
			for(var l = 0; l < lines.length; l++){
				var line = lines[l]
				var pro = '';
				var boxes = line.getElementsByClassName("designer-box");
				
				if(!boxes) return;
				html+="[t]"+'<div>'+"[n]";
				xml+="[n][t][t]<line>[n][t][t][t]<boxes>";
			
				for(var b = 0; b < boxes.length; b++){				
				
					var box = $(boxes[b]);
					var float = box.float;//getStyle("float");
					
					//alert(box+","+box.float)
					//continue;
					className = "idea_"+box.boxName.toLowerCase();					
					
					html+="[t][t]"+'<div style="float:'+float+'" class="'+className+'">'+"[n]"	
					
					var custom = ''									
					html+=((box.customContent!='') ? custom : "[t][t][t]"+'[php]=$this->displayBox("'+box.boxName+'")[/php]'+"[n]")					
					html+="[t][t]"+'</div>'+"[n]"					
					pro = '';
					if($defined(box.element_selected)){					
					}else{
						for(key in this.allow_css){
							pro+="[t]"+key+":"+box.getStyle(key)+";[n]";
						}
					}
					xml+="[n][t][t][t][t]<box><float>"+box.getStyle("float")+"</float><type>"
					xml+=box.boxName+"</type>"+ ((custom!='') ? "<custom>"+custom+"</custom>" :"")+ "</box>"					
					switch(box.boxName){
						case 'TITLE':
							this.css['div.idea_title, div.idea_title a'] = pro;
							break;
						case 'USERNAME':
							this.css['div.idea_username,div.idea_username a'] = pro
							break;
						case 'DATECREATED':
							this.css['div.idea_datecreated'] = pro
							break;	
						case 'BOXVOTE':
							this.css['div.idea_boxvote'] = pro
							break;
						case 'CONTENT':
							this.css['div.idea_content, div.idea_content div.box-content'] = pro
							break;
						case 'COMMENTCOUNT':
							if(pro == ''){
								var status = this.content_childs['COMMENTCOUNT'];
								for(var s in status){
									pro = '';
									var el = box.getElementsByClassName(s.toLowerCase())[0]
									if(el){
										for(key in this.allow_css){
											pro+="[t]"+key+":"+el.getStyle(key)+";[n]";
										}
										this.css['div.idea_commentcount .'+s.toLowerCase()] = pro
									}
								}
							}
							break;
						case 'ACTIONS':
							this.css['div.idea_actions'] = pro
							break;
						case 'READMORE':
							this.css['div.idea_readmore, div.idea_readmore a'] = pro
							break;
						case 'CHANGESTATUS':
							this.css['div.idea_changestatus'] = pro
							break;
						case 'CURRENTSTATUS':
							if(pro == ''){
								var status = this.content_childs['CURRENTSTATUS'];
								for(var s in status){
									pro = '';
									var el = box.getElementsByClassName(s.toLowerCase())[0]
									if(el){
										for(key in this.allow_css){
											pro+="[t]"+key+":"+el.getStyle(key)+";[n]";
										}
										this.css['div.idea_currentstatus .'+s.toLowerCase()] = pro
									}
								}
							}			
							break;
						case 'RESPONSE':
							if(pro == ''){
								var status = this.content_childs['RESPONSE'];
								
								for(var s in status){
									pro = '';
									var el = box.getElementsByClassName(s.toLowerCase())[0]
									if(el){
										for(key in this.allow_css){
											pro+="[t]"+key+":"+el.getStyle(key)+";[n]";
										}
										this.css['div.idea_response .'+s.toLowerCase()] = pro										
									}
								}
								this.css['div.idea_response'] = pro
								this.css['div.idea_response div.border textarea'] = "[t]width:100%;[n]"
							}
							break;
						case 'NONE':
							this.css['div.idea_none'] = pro
							break;
					}
				}
				xml+="[n][t][t][t]</boxes>[n][t]</line>";
				html+="[t][t]"+'<div style="clear:both;"> </div>'+"[n]";
				html+="[t]</div>[n]";
			}
		}
		xml+="[n][t][t]</lines>[n]</theme>"
		html+='</div>'+"[n]"	
		//return;
		var css_content = '';
		this.css_length = 0;
		for(key in this.css){
			this.css_length++;
		}						
		var p = this;

		if(!$defined(name)) name = "default"
		Progress.reset({steps:this.css_length+1, onDone: function(){
			var url = 'index.php?option=com_obsuggest&controller=themes&task=saveSchemaFromParts&format=raw&theme='+name;
			url+='&schema=default&parts='+p.css_length
			var req = new Ajax(
				url,
				{
					method:'get',			
					onComplete:function(result)
					{				
					}
				}
			).request();
		}});
		Progress.show();		
		var url = 'index.php?option=com_obsuggest&controller=themes&task=saveTheme&format=raw&theme='+name;
		url+='&theme_content=' + html + "&theme_preview="+xml
		var req = new Ajax(
			url,
			{
				method:'get',			
				onComplete:function(result)
				{
					Progress.increment()
				}
			}
		).request();
		
		var part = 1;
		for(key in this.css){
			var url = 'index.php?option=com_obsuggest&controller=themes&task=savePartSchema&format=raw&theme='+name;
			url+='&schema=default&part='+part
			url+='&pros='+(key+"{[n]"+this.css[key]+"}[n]").replace(/#/gm, "_sharp_")
			part++;
			var req = new Ajax(
				url,
				{
					method:'get',			
					onComplete:function(result)
					{
						Progress.increment()
					}
				}
			).request();
		}	
		return;			
	},
	addNewBox: function(line, ops){
		var p = this;
		var options = {float: 'left', type: 'NONE', custom: ''}
		for(var o in options){
			options[o] = ($defined(ops) ? (($defined(ops[o])) ? ops[o] : options[o]) : options[o])
		}
		if(!$defined(line)) line = this.line_selected;
		else if($type(line)=='integer') line = this.lines[line];
		
		if(!$defined(options.type)) options.type = 'NONE';
		if($type(line) == 'element'){
			var new_box = new Element("DIV",{
				'styles':{
					'float':options.float
				}
			});
			new_box.float = options.float;
			new_box.customContent = options.custom
			new_box.index = line.count;
			new_box.addClass("designer-box")
			line.count++;
			new_box.addEvent('mousedown',
				function(evt){
					p.updateProperties(this)
				}
			)
			var new_clear = line.getElementsByClassName("line-clear")[0]
			if(!$defined(new_clear)){
				new_clear = new Element("DIV");
				new_clear.addClass("line-clear");
				new_clear.setStyle("border", "0px solid")
			}else{
				new_clear.remove();
			}	
//			new_box.setHTML(parseInt(Math.random()*100));
			new_box.innerHTML = (parseInt(Math.random()*100));
			new_box.makeResizable({
					onDrag:function(){
					}
				}
			);			
			this.loadContent(new_box, options.type)
			this.boxes[this.total_box] = new_box
			this.selectBox(new_box)
			this.total_box++;
			new_box.inject(line)
			new_clear.inject(line)
		}
		return this;
	},
	updateProperties: function(box){
		var p = this
		p.selectBox(box)
		var s='';
		var className = $defined(p.box_selected.element_selected) ? p.box_selected.element_selected.className : '';
		p.box_selected.element_selected = null;
		var c = box;
		var child_lists = $('box-content-child')
		/* clear all items in list box */
		child_lists.setStyle("display", "none")// = true;
		for(var i = child_lists.options.length-1;i>=0;i--)
			child_lists.removeChild(child_lists.options[i])
		
		for(child in this.content_childs){
			if(child == box.boxName){	
				child_lists.setStyle("display", "block")
				for(e in this.content_childs[child]){
					var op = new Element("OPTION");
					op.value = e;
					op.innerHTML = this.content_childs[child][e]
					//alert(op.text)
					op.inject(child_lists);
				}
				switch(child){
					case 'RESPONSE':
						c = (className==''?box.getElementsByClassName("rs_title")[0]:box.getElementsByClassName(className)[0])
						break;
					case 'COMMENTCOUNT':
						c = (className==''?box.getElementsByClassName("comment_number")[0]:box.getElementsByClassName(className)[0])
						break;	
					case 'CURRENTSTATUS':
						c = (className==''?box.getElementsByClassName("none")[0]:box.getElementsByClassName(className)[0])
						break;
					case 'CONTENT':
						c = (className==''?box.getElementsByClassName("box-content")[0]:box.getElementsByClassName(className)[0])
						//alert("sdfsdf")
						break;
				}
				child_lists.selectItem(className.toUpperCase())
				p.box_selected.element_selected = c;
				break;
			}
		}
		child_lists.addEvent("change",
			function(){
				c = p.box_selected.getElementsByClassName(this.value.toLowerCase())[0];
				p.updateProperties_(c)
				p.box_selected.element_selected = c;
			}
		)	
		this.updateProperties_(c)
	},
	updateProperties_: function(c){
		if(!$defined(c)) return;		
		for(var css in c.style){
			//s+="["+css+"] ";
			
			var el = document.getElementById("element-["+css+"]");
			if(el){
				switch(css){
					case 'backgroundColor':
						el.style[css] = c.getStyle("background-color");
						break;
					case 'color':
						el.style.backgroundColor = c.getStyle("color")
						break;
					case 'borderColor':
						el.style.backgroundColor = c.getStyle("border-color").substr(0,7)
					
						break;
					case 'fontSize':
						el.innerHTML = c.getStyle("font-size");
						break;
					case 'fontWeight':
						el.checked = c.getStyle('font-weight') == 'bold' ? true : false;
						break;
					case 'fontStyle':
						el.checked = c.getStyle('font-style') == 'italic' ? true : false;
						break;
					case 'textDecoration':
						el.checked = c.getStyle('text-decoration') == 'underline' ? true : false;
						break;
					case 'borderStyle':		
						//alert(el.selectItem);
						if(el.selectItem)
						el.selectItem(c.getStyle('border-left-style')) //ERR
						break;						
					case 'borderWidth':
						el.innerHTML = (c.getStyle('border-left-width'))
						break;						
					case 'paddingTop':
						el.innerHTML = (c.getStyle('padding-top'))
						break;
					case 'paddingRight':
						el.innerHTML = (c.getStyle('padding-right'))
						break;
					case 'paddingBottom':
						el.innerHTML = (c.getStyle('padding-bottom'))
						break;
					case 'paddingLeft':
						el.innerHTML = (c.getStyle('padding-left'))
						break;
					case 'marginTop':
						el.innerHTML = (c.getStyle('margin-top'))
						break;
					case 'marginRight':
						el.innerHTML = (c.getStyle('margin-right'))
						break;
					case 'marginBottom':
						el.innerHTML = (c.getStyle('margin-bottom'))
						break;
					case 'marginLeft':
						el.innerHTML = (c.getStyle('margin-left'))
						break;
					default:
				
				}	
			}
			
		}
	},
	selectBox: function(box)
	{
		box = ($type(box)=='integer') ? (this.boxes[box]) : box
		if($type(box)=='element'){
			if($defined(this.box_selected)) this.box_selected.removeClass("selected")//.addClass("designer-box");
			box.addClass("selected")//.removeClass("designer-box");
			
			var float = box.getStyle("float");
		
			$('box-position').selectItem(float)
			$('box-content').selectItem(box.boxName);

			this.box_selected = box;
			
			
		}
		return this;			
	},
	removeBox: function(){
		if(this.box_selected){
			this.box_selected.remove();
			this.box_selected = document.getElementsByClassName("designer-box")[0]
			
			if(this.box_selected)
				this.selectBox(this.box_selected)
		}	
	},
	//
	loadContent: function(box, type){
		box.removeClass(box.oldClass)
		box.addClass('idea_'+type.toLowerCase());
		box.oldClass = 'idea_'+type.toLowerCase();
//		box.setHTML(null);
		box.innerHTML = '';
		switch(type){
			case 'TITLE':
//				box.setHTML(type)
				box.innerHTML = (type)
				break;
			case 'CONTENT':
				box.innerHTML = (type)
				break;
			case 'USERNAME':
				box.innerHTML = (type)
				break;
			case 'COMMENTCOUNT':
				var font = new Element("FONT",
					{}
				)
				font.addClass("comment_number");
				font.innerHTML = ("1")				
				font.inject(box)
				var a = new Element("A",
					{}
				)
				a.addClass("comment_text");
				a.href = "javascript:void(0)";
				a.innerHTML = (type)				
				a.inject(box)				
				break;
			case 'READMORE':				
				box.innerHTML = (type)						
				break;				
			case 'RESPONSE':
				var rs_title = new Element("DIV",
					{
						'styles':{
							'border':'0px solid',
							'margin':'0px'
						}
					}
				)
				//
				rs_title.innerHTML = ("admin response")	
				rs_title.addClass("rs_title");			
				rs_title.inject(box)
				
				var rs_content = new Element("DIV",
					{
						'styles':{
							'border':'0px solid',
							'margin':'0px'
						}
					}
				)
				rs_content.innerHTML = ("admin response here")	
				rs_content.addClass("rs_content");			
				rs_content.inject(box)
				
				var rs_action = new Element("DIV",
					{
						'styles':{
							'border':'0px solid',
							'margin':'0px'
						}
					}
				)
			
				rs_action.inject(box)	
					
				var a_add = new Element("A",
					{
						'styles':{
							'border':'0px solid',
							'margin':'0px'
						}
					}
				)
				a_add.innerHTML = ("Add");
				a_add.addClass("rs_add");
				a_add.inject(rs_action);
				
				var a_edit = new Element("A",
					{
						'styles':{
							'border':'0px solid',
							'margin':'0px'
						}
					}
				)
				a_edit.innerHTML = ("Edit");
				a_edit.addClass("rs_edit");
				a_edit.inject(rs_action);								
				break;
			case 'CURRENTSTATUS':
				var status = this.content_childs['CURRENTSTATUS'];
				for(var s in status){
					var d = new Element("DIV",
						{
							'styles':{
							
							}
						}
					)
					d.innerHTML = (status[s])
					d.addClass(s.toLowerCase());
					d.inject(box)
				}
				break;
			default:
				box.innerHTML = (type)
				break;
		}	
		box.boxName = type;
		this.updateProperties(box)
	},
	initListContent: function(){
		var p = this;
		var list = $("box-content");
		for(var o in this.contents)
		{
			var el = new Element("OPTION");
			el.value = o;
			el.innerHTML = this.contents[o];//.substr(contents[o].lastIndexOf(":")+1);
			el.html = this.contents[o];//.substr(0, contents[o].lastIndexOf(":"))
			el.inject(list)
		}
		list.addEvent('change',
			function(e){
				var el = p.box_selected
				p.loadContent(el, this.value)
			}
		)		
	},
	saveCustomContent: function(id){
		var content = document.getElementById(id).value
		
		if(this.box_selected)
			this.box_selected.customContent = content;
	},
	saveAs: function(){
		var new_name = prompt("Enter new schema color name");
		this.save(new_name);
	}	
})

/*
	Object 		: Progress
	auth 		: tunn
	created		: 24 - 09 - 09
*/
var Progress = ({
	steps : 16,
	step: 1,
	value: 0,
	progress: null,
	background: null,
	bgprogress: null,
	progresstext: null,
	updating: null,
	onDone: Class.empty,
	initialize: function(onDone){
		if($defined(onDone)) this.onDone = onDone
		var l = (screen.width - 300) / 2;
		var t = 200
		this.background = new Element("DIV",{
			'styles':{
				'width':'300px',
				'height':'45px',
				'background':'#ffffff',
				'border':'1px solid #666666',
				'position':'fixed',
				'left': l+'px',
				'top':'250px',
				'display':'none'
			}
		})
		this.bgprogress = new Element("DIV",{
			'styles':{
				'width':'290px',
				'height':'15px',
				'background':'#ffffff',
				'border':'1px solid #666666',
				'margin':'12px auto',
				'text-align':'center',
				'color':'#ffffff'
			}
		})
		this.progress = new Element("DIV",{
			'styles':{
				'width':'0px',
				'height':'15px',
				'background':'#cccccc',
				'border':'0px solid #999999',
				'text-align':'center',
				'color': '#ffffff'
			}
		})
		this.progresstext = new Element("DIV",{
			'styles':{
				'width':'290px',
				'height':'15px',
				'border':'0px solid #999999',
				'text-align':'center',
				'color': '#0000ff',
				'position':'relative',
				'left':'0px',
				'top':'-15px'
			}
		})
		this.updating = new Element("DIV",{
			'styles':{
				'width':'290px',
				'height':'15px',
				'border':'0px solid #999999',
				'text-align':'center',
				'color': '#0000ff',
				'position':'relative',
				'top':'-10px'
			}
		})
		this.progress.inject(this.bgprogress)
		this.progresstext.inject(this.bgprogress)
		
		this.bgprogress.inject(this.background)
		this.updating.inject(this.background)
//		this.updating.innerHTML = ("Saving...")
		this.updating.innerHTML = "Saving...";
		this.background.inject(document.body)
	},
	reset: function(ops){
		var p = this;
		var options = {
			steps: p.steps,
			onDone: p.onDone
		}
		for(var op in options){
			options[op] = ($defined(ops) ? ($defined(ops[op])?ops[op]:options[op]) : options[op])
		}
		this.updating.innerHTML = ("Saving...")
		this.background.setStyle('display', 'none');
		this.steps = options.steps;
		this.onDone = options.onDone;
		this.value = 0;
	},
	increment: function(){
		if(this.value>=this.steps) {			
			return
		};
		this.value=(this.value+this.step)>this.steps ? this.steps : this.value+this.step
		var inc = (290/this.steps);
		var w = parseFloat(this.progress.getStyle("width"))
		w+=inc
		//alert(this.value)
		var percent = parseInt((this.value/this.steps)*100)+"%";
		this.progresstext.innerHTML = (percent)
		this.progress.setStyle("width",w+"px")
		if(this.value == this.steps){
			this.updating.innerHTML = ("Save complete!")
			this.onDone()
			this.hide.delay(2000);			
		}
	},
	show: function(){
		this.background.setStyle("display", "block");
	},
	hide: function(){
		Progress.background.setStyle("display", "none")
		Progress.progress.setStyle("width","0px")
	}
})
/**

*/
var Property = new Class({
	properties: {},
	pro_allow: [
		'color', 'fontSize', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
		'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'backgroundColor',
		'borderColor', 'fontStyle', 'fontWeight', 'textDecoration','borderStyle',
		'borderWidth'
	],
	css: {},
	initialize: function(pros){
		this.initProperties(pros)
	},
	initProperties: function(pros){
		for(var pro in pros){
			this.properties[pro] = pros[pro]
			//alert(pros[pro])
		}
	},
	getCssFrom: function(el){
		if($type(el)=='string') el = document.getElementById(el)
		if(!$defined(el)) return;
		
		for(var pro in el.style){
			//if(pro.indexOf("font")>-1) alert(pro)
			if(this.pro_allow.contains(pro)){
				this.set(pro, el.getStyle(abc(pro)), true)	
							
			}
				
		}
	},
	set: function(prop, val, auto){
		this.css[prop] = val
		if(!$defined(auto)) auto = false
		if(auto) this.update(prop, val)
	},
	get: function(prop){
		return this.css[prop]
	},
	update: function(prop, val){
		var p = this.properties[prop];
		//alert(prop+","+val)
		switch(p.type){
			case 'COLOR':
				p.element.setStyle("background-color", val)
				//alert(prop+","+val)
				break;
			case 'FONT-SIZE':
				break;
			case 'MARGIN-TOP':
			case 'MARGIN-RIGHT':
			case 'MARGIN-BOTTOM':
			case 'MARGIN-LEFT':
			case 'PADDING-TOP':
			case 'PADDING-RIGHT':
			case 'PADDING-BOTTOM':
			case 'PADDING-LEFT':
			case 'PADDING-ALL':
			case 'MARGIN-ALL':
			case 'BORDER-WIDTH':					
			case 'TEXT-ALIGN':
			case 'BORDER-STYLE':
				if(val.indexOf(" ")>-1){
					val = val.split(" ")
					val = val[0]
					//alert(val)
				}	
				p.element.selectItem(val);
				break;	
			case 'FONT-WEIGHT':
			case 'FONT-ITALIC':
			case 'TEXT-DECORATION':
				p.element.checked = (val == 'italic') ? true : false
				break;
		}
	},
	display: function(el){
		var table = new Element("TABLE")
		for(var pro_ in this.properties){
			var tr = new Element("TR")
			var td1 = new Element("TD")
			var td2 = new Element("TD")
			var pro = this.properties[pro_]
			
			tr = this.createType(pro)
			
			tr.inject(table)
		}
		if($type(el) == 'string') el = $(el)
		table.inject(el)
	},
	createType: function(pro){
		var td1, td2, tr, el;
		tr = new Element("TR")
		td1 = new Element("TD")
		td2 = new Element("TD")
		td1.innerHTML = (pro.text)
		switch(pro.type){
			case 'GROUPS':
				td1.inject(tr)
				td1.setAttribute("colspan", 2)
				tr.setStyle("background-color", '#ACACAC');
				return tr;
				break;
			case 'COLOR':
				
				el = new Element("DIV",{
					'styles':{
						'width': '10px',
						'height': '10px',
						'border': '1px solid #999999',
						'float': 'right',
						'background-color': pro._default
					}
				})
				if($defined(pro.onMouseDown)) el.addEvent("mouseup", pro.onMouseDown)				
				if($defined(pro.onChange)) el.onChangeStyle("color", pro.onChange)
				if($defined(pro.id)) el.id = pro.id
				el.inject(td2)
				
				break;
			case 'TEXT-ALIGN':
				el = new Element("SELECT",{
					'styles':{
						'float': 'right',
						'text-align': 'left'
					}
				})
				if(pro.list){
					var val = pro.list.split(",");
					for(var i = 0 ; i < val.length ; i ++){
						var op = new Element("OPTION")
						op.text = op.value = val[i].trim()
						op.inject(el)
						if(val[i].trim() == pro._default){ el.selectedIndex = i }
						
					}
				}
				el.addEvent("change", function(){this.value = this.value})	
				if($defined(pro.onMouseDown)) el.addEvent("mouseup", pro.onMouseDown)				
				if($defined(pro.onChange)) el.onChangeStyle("value", pro.onChange)
				if($defined(pro.id)) el.id = pro.id
				el.inject(td2)
				break;	
			case 'FONT-SIZE':
				el = new Element("div",{
					'styles':{
						'float': 'right',
						'text-align': 'right'
					}
				})
				if($defined(pro.onMouseDown)) el.addEvent("mouseup", pro.onMouseDown)				
				if($defined(pro.onChange)) el.onChangeStyle("font_size", pro.onChange)
				el.innerHTML=(pro._default)
				el.inject(td2);
				break;	
			case 'BORDER-STYLE':
				el = new Element("SELECT",{
					'styles':{
						'float': 'right',
						'text-align': 'left'
					}
				})
				if(pro.list){
					var val = pro.list.split(",");
					for(var i = 0 ; i < val.length ; i ++){
						var op = new Element("OPTION")
						op.text = op.value = val[i].trim()
						op.inject(el)
						if(val[i].trim() == pro._default){ el.selectedIndex = i }
						
					}
				}
				if(pro.id) el.id = id
				if($defined(pro.onMouseDown)) el.addEvent("mouseup", pro.onMouseDown)
				el.addEvent("change", function(){this.value = this.value})				
				if($defined(pro.onChange)) el.onChangeStyle("value", pro.onChange)
				el.inject(td2);
				break;
			case 'FONT-WEIGHT':				
			case 'FONT-ITALIC':
			case 'TEXT-DECORATION':
				el = new Element("INPUT",{
					'styles':{
						'float': 'right',
						'text-align': 'left'
					}
				})
				el.addEvent("click", function(){
					this.checked = this.checked
				})
				if($defined(pro.onChange)) el.onChangeStyle("checked", pro.onChange)
				el.type = 'checkbox'
				el.checked = pro._default;
				el.inject(td2);
				break;	
		
			case 'MARGIN-TOP':
			case 'MARGIN-RIGHT':
			case 'MARGIN-BOTTOM':
			case 'MARGIN-LEFT':
			case 'PADDING-TOP':
			case 'PADDING-RIGHT':
			case 'PADDING-BOTTOM':
			case 'PADDING-LEFT':
			case 'PADDING-ALL':
			case 'MARGIN-ALL':
			case 'BORDER-WIDTH':
				el = new Element("SELECT",{
					'styles':{
						'float': 'right',
						'text-align': 'left'
					}
				})
				if(pro.list){
					var val = new Array();
					if(pro.list.indexOf("->")>-1){
						start = parseInt(pro.list.substr(0, pro.list.indexOf("->")-1))
						end = parseInt(pro.list.substr(pro.list.indexOf("->")+2))
						//alert(start+","+end)
						var j=0;
						var step = pro.list.indexOf(":")>-1? parseInt(pro.list.substr(pro.list.indexOf(":")+1)) : 1
						for(var i = start ; i <= end ; i += step){
							val[j] = i + 'px'
							j++
						}
					}else{
						val = pro.list.split(",");
					}
					if(pro.type=='PADDING-ALL' || pro.type=='MARGIN-ALL')
					{
						var op = new Element("OPTION")
						op.text = op.value = ''
						op.inject(el)
					}
					for(var i = 0 ; i < val.length ; i ++){
						var op = new Element("OPTION")
						op.text = op.value = val[i].trim()
						op.inject(el)
						if(val[i].trim() == pro._default){ el.selectedIndex = i }
						
					}
				}
				el.addEvent("change", function(){
					this.value = this.value
				})
				if($defined(pro.onChange)) el.onChangeStyle("value", pro.onChange)
				el.inject(td2)
				break;			
		}
		pro.element = el
		if(el) if(pro.id) el.id = pro.id
		td1.inject(tr)
		td2.inject(tr)
		return tr
	}
})

///dialog
Element.extend({
	onChangeStyle: function(style, handler){
		this.handler = handler;
		var p = this
		this.watch(style, 
			function(prop, oldValue, newValue) {			
				p.handler(newValue);
				return newValue;
			}
		)
	}
})
var Dialog = new Class({
	
})
Dialog.ColorDialog = {
	onDone: Class.empty,
	ret: null,
	show: function(ret, onDone){
		var p = this;
		var h = ((document.body.clientHeight))
		var w = ((document.body.clientWidth))
		
		if($defined(p.background)){
			p.background.setStyle("display", "block")
			p.container.setStyle("display", "block")
		}else{
			
			p.background = new Element("DIV",{
				'styles':{
					'border': '0px solid red',
					'width': w+'px',
					'height': h+'px',
					'background-color': '#ACACAC',
					'opacity': '0.2',
					'position': 'fixed',
					'left': '0px',
					'top': '0px',
					'z-index': '1000',
					'overflow': 'hidden'
				},
				'events':{					
					'mousedown': function(){p.close()}
				}
			})
			p.container = new Element("DIV",{
				'styles':{
					'border': '1px solid red',
					'width': '300px',
					'height': '250px',
					'background-color': '#CCCCCC',
					'position': 'fixed',
					'left': '450px',
					'top': '100px',
					'z-index': '1001',
					'overflow': 'hidden',
					'margin': '0px auto'
				}
			})
			p.container.makeDraggable();
			var title = new Element("DIV", {
				'styles':{
					'height': '25px',
					'background-color': '#FFFFFF'
				}
			})
			title.inject(p.container)
			var iframe = new Element("IFRAME",{
				'styles':{
					'width': '300px',
					'height': '225px',
					'border': '0px solid',
					'margin': '0px',
					'padding': '0px'
				}
			})
			iframe.src = "http://localhost/joomlatest/administrator/components/com_obsuggest/views/themes/tmpl/colordialog.html";
			iframe.inject(p.container)
			p.container.inject(ret)
			p.container.setStyle("margin", "0px auto")
			p.background.inject(ret)
		}

		p.color = ret.getStyle("background-color")
		if($defined(onDone)) this.onDone = onDone
		this.ret = ret
	},
	done: function(){
		//eval('window.'+this.ret+'='+Math.random())
		this.ret.color = this.color
		//this.ret.innerHTML = (Math.random())
		this.onDone()
		this.close();
	},
	close: function(){
		this.background.setStyle("display", "none");
		this.background.remove();
		this.container.setStyle("display", "none");
		this.container.remove();
		delete this.background;
		delete this.container;
	}
}

// 
Dialog.FontDialog = {
	onDone: Class.empty,
	ret: null,
	show: function(ret, onDone){
		var p = this;
		var h = ((document.body.clientHeight))
		var w = ((document.body.clientWidth))
		
		if($defined(p.background)){
			p.background.setStyle("display", "block")
			p.container.setStyle("display", "block")
		}else{
			
			p.background = new Element("DIV",{
				'styles':{
					'border': '0px solid red',
					'width': w+'px',
					'height': h+'px',
					'background-color': '#ACACAC',
					'opacity': '0.2',
					'position': 'fixed',
					'left': '0px',
					'top': '0px',
					'z-index': '1000',
					'overflow': 'hidden'
				},
				'events':{					
					'mousedown': function(){p.close()}
				}
			})
			p.container = new Element("DIV",{
				'styles':{
					'border': '1px solid red',
					'width': '300px',
					'height': '250px',
					'background-color': '#CCCCCC',
					'position': 'fixed',
					'left': '450px',
					'top': '100px',
					'z-index': '1001',
					'overflow': 'hidden',
					'margin': '0px auto'
				}
			})
			p.container.makeDraggable();
			var title = new Element("DIV", {
				'styles':{
					'height': '25px',
					'background-color': '#FFFFFF'
				}
			})
			title.inject(p.container)
			var iframe = new Element("IFRAME",{
				'styles':{
					'width': '300px',
					'height': '225px',
					'border': '0px solid',
					'margin': '0px',
					'padding': '0px'
				}
			})
			iframe.src = "http://localhost/joomlatest/administrator/components/com_obsuggest/views/themes/tmpl/fontdialog.html";
			iframe.inject(p.container)
			p.container.inject(ret)
			p.container.setStyle("margin", "0px auto")
			p.background.inject(ret)
		}

		p.color = ret.getStyle("background-color")
		if($defined(onDone)) this.onDone = onDone
		this.ret = ret
		//alert(ret)
	},
	done: function(){
		//eval('window.'+this.ret+'='+Math.random())
		this.ret.font_size = this.font_size
		//alert(this.ret)
		//this.ret.innerHTML = (Math.random())
		this.onDone()
		this.close();
	},
	close: function(){
		this.background.setStyle("display", "none");
		this.background.remove();
		this.container.setStyle("display", "none");
		this.container.remove();
		delete this.background;
		delete this.container;
	}
}