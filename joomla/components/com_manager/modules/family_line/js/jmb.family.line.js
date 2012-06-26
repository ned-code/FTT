function JMBFamilyLine(){
	var	module = this,
        loadData,
        message,
		cont,
		fn,
		objPull,
		options,
		alias;

    message = {
        FTT_MOD_FAMILY_LINE_MOTHER:"Mother",
        FTT_MOD_FAMILY_LINE_FATHER:"Father"
    }
		
	alias = jQuery(document.body).attr('_alias');
		
	options = {
		"Bulletin Board":{
			select:false,
			eye:true,
			pencil:true
		},
		"Descendants":{
			select:true,
			eye:false,
			pencil:false
		},
		"Families":{
			select:false,
			eye:false,
			pencil:true
		},
		"Ancestors":{
			select:false,
			eye:false,
			pencil:true
		}
	}
		
	//protected
	fn = {
		ajax:function(func, params, callback){
            storage.callMethod("family_line", "JMBFamilyLine", func, params, function(res){
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
			opt:function(){
				var response = {};
				jQuery(cont).find('div.icon').each(function(i,e){
					var list;
					if(jQuery(e).attr('id')!='button'){
						list = jQuery(e).attr('class').split(/\s+/);
						if(!response[list[1]]) response[list[1]] = {};
						if(jQuery(e).hasClass('active')){
							response[list[1]][list[2]] = fn.get.bg(e);
						} else {
							response[list[1]][list[2]] = false;
						}
					}
				});
				return response;
			},
			bg:function(div){
				var rgb = jQuery(div).css('backgroundColor');
                var hex = rgb.match(/^#[0-9a-f]{3,6}$/i);
				var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                if(parts == null){
                    return rgb;
                }
				delete(parts[0]);
				for (var i = 1; i <= 3; ++i) {
					parts[i] = parseInt(parts[i]).toString(16);
					if (parts[i].length == 1) parts[i] = '0' + parts[i];
				}
				color = '#' + parts.join('');
				return color;
			}
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
                if(typeof(object) == 'undefined') return false;
                if(!object.getContext) return false;
				this._canvas = object;
				this._context = object.getContext("2d");
				this._total = total;
				k = total - data;
				sofar = this.segment(data, sofar, 0);
				this.segment(k, sofar, 1);
			}
		},
		overlay:function(titles, type){
			var target = (type=='mother')?titles[0]:titles[1];
			var div = jQuery('<div id="overlay" style="position:absolute;top:0px;left:0px;opacity:0.7;background:#C3C3C3;">&nbsp;</div>');
			jQuery(div).css('width', (jQuery(target).parent().width())+'px');
			jQuery(div).css('height', (jQuery(target).parent().height())+'px');
			jQuery(target).append(div);
		},
		click:function(settings){
			var icons = jQuery(cont).find('div.icon');
			var titles = jQuery(cont).find('div.title');
			jQuery(icons).click(function(){
				//var list = this.classList;
				var list = jQuery(this).attr('class').split(/\s+/);
				var type = (list[1]=='mother')?'father':'mother';
				switch(list[2]){
					case 'pencil':
						if(settings.eye){
							var eye = jQuery(cont).find('div.icon.'+list[1]+'.eye');
							if(!jQuery(eye).hasClass('active')){
								return false;
							}
						}
						if(jQuery(this).hasClass('active')){
							jQuery(cont).find('div.title.'+list[1]).removeClass('active');
							jQuery(this).removeClass('active');
						} else {
							jQuery(cont).find('div.title.'+list[1]).addClass('active');
							jQuery(this).addClass('active');
						}	
					break;	
				
					case 'eye':
						if(jQuery(this).hasClass('active')){
							jQuery(this).removeClass('active');
							fn.overlay(titles, list[1]);
						} else {
							jQuery(this).addClass('active');
							jQuery((list[1]=='mother')?titles[0]:titles[1]).find('div#overlay').remove();
						}
					break;
					
					case 'select':
						if(!jQuery(this).hasClass('active')){
							jQuery(cont).find('div.icon.'+type+'.select').removeClass('active');
							jQuery(this).addClass('active');
							fn.overlay(titles, type);
							jQuery((type=='mother')?titles[1]:titles[0]).find('div#overlay').remove();
						}
					break;
				}		
				if(list[1] != 'settings') objPull.change(this);
			});
		},
		pull:function(){
			var	sub = this,
				pull = {};
			return {
				clear:function(){
					pull = {};
				},
				bind:function(name, callback){
					var object = { id:name, func:callback }
					pull[name] = object;
				},
				opt:function(){
					var response = {};
					jQuery(cont).find('div.icon').each(function(i,e){
						var list;
						if(jQuery(e).attr('id')!='button'){
							list = jQuery(e).attr('class').split(/\s+/);
							if(!response[list[1]]) response[list[1]] = {};
							response[list[1]][list[2]] = jQuery(e).hasClass('active');
						}
					});
					return response;
				},
				bg:function(div){
					var rgb = jQuery(div).css('backgroundColor');
                    var hex = rgb.match(/^#[0-9a-f]{3,6}$/i);
					var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                    if(parts == null){
                        return rgb;
                    }
                    delete(parts[0]);
					for (var i = 1; i <= 3; ++i) {
						parts[i] = parseInt(parts[i]).toString(16);
						if (parts[i].length == 1) parts[i] = '0' + parts[i];
					}
					color = '#' + parts.join('');
					return color;
				},
				jsonString:function(status){
					var json_string = '{';
					for(var key in status){
						var el = status[key];
						json_string += '"'+key+'":{';
						for(var k in el){
							json_string += '"'+k+'":"'+((el[k])?1:0)+'",'; 
						}
						json_string = json_string.substr(0, json_string.length-1);
						json_string +='},';
					}
					json_string = json_string.substr(0, json_string.length-1);
					json_string += '}';
					return json_string;
				},
				change:function(div){
					var	status, opt, list;
					list = jQuery(div).attr('class').split(/\s+/);
					opt = this.opt();
					status = {
						_active:jQuery(div).hasClass('active'),
						_line:list[1],
						_type:list[2],
						_background:this.bg(div),
						cont:cont,
						div:div,
						classList:list,
						opt:opt,
						jsonString:this.jsonString(options)	
					}
					for(key in pull){
						pull[key].func(status)
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
			var sb = host.stringBuffer();
			sb._('<div class="jmb-family-line-container">');
				sb._('<table cellspacing="0">');
					sb._('<tr>');
						sb._('<td class="left"></td>');
						if(settings.select) sb._('<td><div class="icon mother select active">&nbsp;</div></td>');
						if(settings.pencil) sb._('<td><div class="icon mother pencil">&nbsp;</div></td>');
						if(settings.eye) sb._('<td><div class="icon mother eye active">&nbsp;</div></td>');
						sb._('<td><div class="title mother"><span>')._(message.FTT_MOD_FAMILY_LINE_MOTHER)._('</span><div id="chart"><canvas width="21px" height="21px"></canvas></div></div></td>');
						sb._('<td><div class="title father"><div id="chart"><canvas width="21px" height="21px"></canvas></div><span>')._(message.FTT_MOD_FAMILY_LINE_FATHER)._('</span></div></td>');
						if(settings.eye) sb._('<td><div class="icon father eye active">&nbsp;</div></td>');
						if(settings.pencil) sb._('<td><div class="icon father pencil">&nbsp;</div></td>');
						if(settings.select) sb._('<td><div class="icon father select">&nbsp;</div></td>');
						sb._('<td class="right"></td>');
                        /*
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
						*/
					sb._('</tr>');
				sb._('</table>');
			sb._('</div>');
			cont =  jQuery(sb.result());
			jQuery(document.body).append(cont);
			fn.click(settings);
			fn.set.align();
			fn.draw.init(jQuery(cont).find('div.mother canvas')[0], json.size[0], json.size[1]);
			fn.draw.init(jQuery(cont).find('div.father canvas')[0], json.size[0], json.size[2]);
			
			if(settings.select){
				var titles = jQuery(cont).find('div.title');
				fn.overlay(titles, 'father');
			}
			
			return this;
		}
	}

	objPull = fn.pull();	
	
	//public
	this.get = fn.get;
	this.bind = function(name, callback){
        var clickActive = false;
        objPull.bind(name, function(res){
            if(clickActive) return false;
            clickActive = true;
            setTimeout(function(){
                callback(res);
                clickActive = false;
            }, 1);
        });
	}
	this.init = function(page){
		objPull.clear();
		if(alias!='myfamily') return false;
        if(typeof(loadData) != 'undefined'){
            var title = page.page_info.title;
            fn.init(options[title], loadData);
        } else {
            fn.ajax('get',null, function(res){
                var json = jQuery.parseJSON(res.responseText);
                var title = page.page_info.title;
                if(typeof(json.language)!='undefined'){
                    message = json.language;
                }
                loadData = json;
                fn.init(options[title], json);
            });
        }
	};
	
	jQuery(window).resize(function() {
		fn.set.align();
	});
}





