function JMBFamilyLine(){
	var	module = this,	
		cont,
		fn,
		objPull,
		options;
		
	options = {
		"Bulletin Board":{
			select:false,
			eye:true,
			pencil:true
		},
		"Descendants":{
			select:false,
			eye:false,
			pencil:false
		},
		"Families":{
			select:false,
			eye:false,
			pencil:false
		},
		"Ancestors":{
			select:false,
			eye:false,
			pencil:false
		}
	}
		
	//protected
	fn = {
		ajax:function(func, params, callback){
			host.callMethod("family_line", "JMBFamilyLine", func, params, function(res){
					callback(res);
			});
		},
		set:{
			align:function(type){
				var top, left;
				left = jQuery(window).width() / 2 - jQuery(cont).width() / 2;	
				top = 40;
				jQuery(cont).css('top', top).css('left', left);
				return this;
			}
		},
		get:{
		},
		draw:{
			_canvas:null,
			_context:null,
			_total:null,
			_colors:["#22b14c", "#C3C3C3"],
			segment:function(data, sofar, i){
				var	canvas = this._canvas,
					context = this._context,
					colors = this._colors,
					center_x, 
					center_y, 
					radius,
					thisvalue;
				
				thisvalue = data / this._total;
					
				context.save();
				
				center_x = Math.floor(canvas.width / 2);
				center_y = Math.floor(canvas.height / 2);
				radius = Math.floor(canvas.width / 2);
				context.beginPath();
				context.moveTo(center_x, center_y);
				context.arc(
					center_x, 
					center_y, 
					radius, 
					Math.PI * (- 0.5 + 2 * sofar), 
					Math.PI * (- 0.5 + 2 * (sofar + thisvalue)),
					false
				);
				context.closePath();
				context.fillStyle = colors[i];
				context.fill();
				context.restore();
				
				return sofar + thisvalue;
			},
			init:function(object, total, data){
				var sofar = 0, k;
				if(data.length > 2) return false;
				this._canvas = object;
				this._context = object.getContext("2d");
				this._total = total;
				k = total - data;
				sofar = this.segment(data, sofar, 0);
				this.segment(k, sofar, 1);
			}
		},
		click:function(){
			var icons = jQuery(cont).find('div.icon');
			jQuery(icons).click(function(){				
				var list = this.classList;
				switch(list[2]){
					case 'pencil':
						if(jQuery(this).hasClass('active')){
							jQuery(cont).find('div.title.'+list[1]).removeClass('active');
						} else {
							jQuery(cont).find('div.title.'+list[1]).addClass('active');
						}					
					case 'eye':
						if(jQuery(this).hasClass('active')){
							jQuery(this).removeClass('active');
						} else {
							jQuery(this).addClass('active');
						}
					break;
					
					case 'select':
						if(!jQuery(this).hasClass('active')){
							jQuery(cont).find('div.icon.'+(list[1]=='mother'?'father':'mother')+'.select').removeClass('active');
							jQuery(this).addClass('active');
						}
					break;
				}		
				if(list[1] != 'settings') objPull.event(this);
			});
		},
		pull:function(){
			var	sub = this,
				pull = [];
			return {
				bind:function(name, callback){
					var object = { id:name, func:callback }
					pull.push(object);
				},
				event:function(object){
					var	list = object.classList,
						key,
						ev;
						
					ev = {
						line:list[1],
						type:list[2],
						active:jQuery(object).hasClass('active')
					}
					for(key in pull){
						pull[key].func(ev);
					}
				}
			}
		},
		init:function(settings, json){
			if(!settings) return false;
			if(cont){
				jQuery(cont).remove();
				cont = null;
			}
			sb = host.stringBuffer();	
			sb._('<div class="jmb-family-line-container">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td class="left"></td>');
						if(settings.select) sb._('<td><div class="icon mother select">&nbsp;</div></td>');
						if(settings.pencil) sb._('<td><div class="icon mother pencil">&nbsp;</div></td>');
						if(settings.eye) sb._('<td><div class="icon mother eye active">&nbsp;</div></td>');
						sb._('<td><div class="title mother"><span>Mother</span><div id="chart"><canvas width="21px" height="21px"></canvas></div></div></td>');
						sb._('<td><div class="title father"><div id="chart"><canvas width="21px" height="21px"></canvas></div><span>Father</span></div></td>');
						if(settings.eye) sb._('<td><div class="icon father eye active">&nbsp;</div></td>');
						if(settings.pencil) sb._('<td><div class="icon father pencil">&nbsp;</div></td>');
						if(settings.select) sb._('<td><div class="icon father select">&nbsp;</div></td>');
						sb._('<td class="right"></td>');
						sb._('<td class="options left">');
							sb._('<div style="display:none" id="adopted">');
								sb._('<select name="relation">');
									sb._('<option value="biological">Biological</option>');
									sb._('<option value="adopted">Adopted</option>');
								sb._('</select>');
							sb._('</div>');
						sb._('</td>');
						sb._('<td class="options right">');
							sb._('<div id="button" class="icon settings">&nbsp;</div>');
						sb._('</td>');
					sb._('</tr>');
				sb._('</table>');
			sb._('</div>');
			cont =  jQuery(sb.result());
			jQuery(document.body).append(cont);
			fn.click();
			fn.set.align();
			fn.draw.init(jQuery(cont).find('div.mother canvas')[0], json.size[0], json.size[1]);
			fn.draw.init(jQuery(cont).find('div.father canvas')[0], json.size[0], json.size[2]);
			
			return this;
		}
	}

	objPull = fn.pull();	

	//public
	this.bind = function(name, callback){
		objPull.bind(name, callback);
	}
	this.init = function(page){
		fn.ajax('get',null, function(res){
			var json = jQuery.parseJSON(res.responseText);
			var title = page.page_info.title;
			fn.init(options[title], json);
		});
	};
}





