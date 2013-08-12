//
//
//
var ColorDialog = new Class({
	options: {
		width: "200px",
		height: "150px",
		autoDisplay: false,
		autoClose: false,
		autoCenter: true,
		onDone: Class.empty,
		onCancel: Class.empty
	},
	parent: null,
	container: null,
	drag: null,
	isIn: false,
	element: null,
	property: null,	
	preview: null,
	sliders: [null, null, null],
	newColorRGB: [0,0,0,1],
	oldColor: null,
	newColor: null,
	
	initialize: function(html, options)
	{
		var p = this;
		window.addEvent('domready',
			function(){
				p.setOptions(options)
				p.createWindow(html)
				//p.initSlider()		
			}
		)			
		
		
	},
	createWindow: function(html)
	{
		var d = this
		var left = null, top = null
		if(this.autoCenter)
		{
			left = (screen.width-parseInt(this.width))/2
			top = (screen.height-parseInt(this.height))/2
			top=200
		}
		this.parent = new Element("DIV",
			{
				'styles':
				{
					'border':'1px solid #999999',
					'height':this.height,
					'width':this.width,
					'background-color': '#ffffff',
					'display': this.autoDisplay ? 'block' : 'none',
					'left': (left) ? left+'px' : '',
					'top': (top) ? top + 'px' : '',
					'position' : 'fixed'
				},
				'events':
				{
					'mouseover': function(){d.isIn = true},
					'mouseout' : function(){
						d.isIn = false
						//if(d.autoClose)
							//d.hide()
							
					}
				}
			}
		)
		
		var dialog_title = new Element("DIV",
			{
				'styles':
				{
					'width': '100%',
					'height': '20px',
					'border-bottom': '1px solid #999999',
					'cursor': 'move',
					'text-align' : 'center'
				},
				'events':
				{
										
				}
			}
		);
		this.container = new Element('DIV',
			{
				'styles':
				{
					'width' : '100%',
					'height' : (parseInt(this.height)-20)+'px',
					'background-color': 'transparent',
					'overflow' : 'hidden'
				},
				'events':
				{
					'mousedown'	: function(e){						
						if(!e) e = window.event;						
						e.cancelBubble = true;						
						if(e.stopPropagation) e.stopPropagation();
					}			
				}
			}
		);
//		dialog_title.setHTML('Select color')
		dialog_title.innerHTML = 'Select color';
		dialog_title.inject(this.parent);
		//
		//
		this.container.inject(this.parent)
		this.parent.makeDraggable()
		this.setHTML(html)
		if(this.options.autoDisplay)
			this.show();
			
		
		window.addEvent('mousedown',
			function()
			{
				if(!d.isIn)
					d.hide()
			}
		)
		window.addEvent('domready',
			function(){
				d.parent.inject(document.body)
				/*
				d.oldColor = document.getElementById('old-color')
				d.newColor = $E('#new-color')
				$E('#color-transparent').addEvent('click',		
					function(){
						d.newColorRGB = this.checked ? [255,255,255,0]:[255,255,255,1]	
					
						d.initSlider(d.newColorRGB)
					}
				)
					*/		
			}
		)
	},
	done: function(){
		//if(this.element)
		//this.element.setStyle("background-color, this.newColor.style.backgroundColor)	//err	
		//this.preview.setStyle('background-color', this.newColor.style.backgroundColor) //err
		//
		//
		this.hide()
		this.onDone()
	},
	cancel: function(){
		this.element.setStyle(this.property, this.oldColor.style.backgroundColor)	//err	
		this.preview.setStyle('background-color', this.oldColor.style.backgroundColor) //err	
		this.hide()
	},
	hide: function()
	{
		this.parent.setStyle('display', 'none');
		this.sliders = [null, null, null];
		this.preview = null;
		this.element = null;
	},
	show: function(id, onDone)
	{
		this.element = ($type(id)=='string')?document.getElementById(id):id
		this.parent.setStyle('display', 'block');
		if($type(onDone)=='function')
			this.onDone = onDone;
		document.getElementById("temoin").setStyle("background-color", this.element.getStyle("background-color"))
		return;
		/*
		var pro = this.recognize(id)
		this.element = $E(pro[0])
		this.property = pro[1]
		this.preview = document.getElementById(id)
		var color = this.preview.getStyle("background-color");;//this.preview.style.backgroundColor	
		if(color!='transparent') color = color.hexToRgb()
		color = (color=='transparent')?[255,255,255,0]:String(color.match(/\d+,\s?\d+,\s?\d+/)).split(',');
		if(!$defined(color[3]))
			color[3] = 1
		this.newColorRGB = color
		this.oldColor.style.backgroundColor = color.rgbToHex()
		this.parent.setStyle('display', 'block');
		
		this.initSlider(this.newColorRGB)*/
	},
	setHTML: function(html)
	{
		switch($type(html))
		{
			case 'string':
				this.container.setHTML(html)
				break;
			case 'element':
			//
				html.inject(this.container)	//err
				//
				break;	
				
		}
			
	},
	setOptions: function(options)	
	{
		if(!$defined(options))
			options = this.options;
		for(var property in this.options)
		{
			this.options[property] = $defined(options[property]) ? options[property] : this.options[property];
			this[property] = this.options[property]
		}
		
	},
	recognize: function(info)
	{
		var ret = new Array(2);
		var pos = info.indexOf('[');
		ret[0] = info.substr( 0, pos); // elements
		ret[1] = info.substr( pos +1, info.length-pos-2); // property
		return ret;
	},
	initSlider: function(rgb){
		var p = this;		
		
		$ES('#color-selector div.slider').each(
			function(el, i){
				p.sliders[i] = new Slider(el, el.getElement('.knob'), {
					steps: 255,  // Steps from 0 to 255
					wheel: true,
					onChange: function(){
						p.newColorRGB[i] = this.step;
						var c=p.newColorRGB.rgbToHex();
						//alert(c)
						p.updateColor(p.newColorRGB.rgbToHex());
						/*if(!p.first)
						{
							$E('#color-transparent').checked = false
							rgb[3] = 1
						}*/
						
					}

				}).set(parseInt(rgb[i]));		
											
			}
		);
		
		//p.first = false
		if(rgb[0]==255 && rgb[1]==255 && rgb[2]==255 && rgb[3]==0)
			$E('#color-transparent').checked = true
		else
			$E('#color-transparent').checked = false
	},
	updateColor: function(color){
		//
		//		
		if(this.newColor)
		{
			this.newColor.setStyle('background-color', color)//err
		}
		//if(this.element)
			//this.element.setStyle(this.property, color)	
		if(this.preview)	
			this.preview.setStyle('background-color', color)
	}
});