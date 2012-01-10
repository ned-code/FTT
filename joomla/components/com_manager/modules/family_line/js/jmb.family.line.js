function JMBFamilyLine(){
	var	module = this,	
		cont,
		fn;
	//protected
	fn = {
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
				
				thisvalue = data[i] / this._total;
					
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
			init:function(object, data){
				var sofar = 0;
				if(data.length > 2) return false;
				this._canvas = object;
				this._context = object.getContext("2d");
				this._total = data[0] + data[1];
				for(var i = 0; i < data.length; i++){
					sofar = this.segment(data, sofar, i);
				}
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
			});
		},
		init:function(settings){
			sb = host.stringBuffer();			
			sb._('<div class="jmb-family-line-container">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td class="left"></td>');
						sb._('<td><div class="icon mother select">&nbsp;</div></td>');
						sb._('<td><div class="icon mother pencil">&nbsp;</div></td>');
						sb._('<td><div class="icon mother eye active">&nbsp;</div></td>');
						sb._('<td><div class="title mother"><div id="chart"><canvas width="21px" height="21px"></canvas></div><span>Mother</span></div></td>');
						sb._('<td><div class="title father"><span>Father</span><div id="chart"><canvas width="21px" height="21px"></canvas></div></div></td>');
						sb._('<td><div class="icon father eye active">&nbsp;</div></td>');
						sb._('<td><div class="icon father pencil">&nbsp;</div></td>');
						sb._('<td><div class="icon father select">&nbsp;</div></td>');
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
			fn.draw.init(jQuery(cont).find('div.mother canvas')[0], [220, 447]);
			fn.draw.init(jQuery(cont).find('div.father canvas')[0], [447, 220]);
			
			return this;
		}
	}	

	options = {
		
	}	
	
	
	//public
	this.init = function(){
		fn.init({});
	};
}





