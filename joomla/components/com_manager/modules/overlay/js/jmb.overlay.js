function JMBOverlay(){
	this.settings = {	
		parent:document.body,
		width: 320,
		height: 240,
		headerHeight:30,
		align:'center',
		object:false,
		title:false	
	}
	this.overlay = jQuery('<div class="jmb-overlay"><div class="jmb-overlay-container"><div class="jmb-overlay-header"></div><div class="jmb-overlay-body"></div><div class="jmb-overlay-close">&nbsp;</div></div></div>');
	this.modal = jQuery('<div class="jmb-overlay-modal">&nbsp;</div>');
}

JMBOverlay.prototype = {
	_extend:function(params1, params2){
		if(!params1) params1 = {};
		return jQuery.extend(params1,params2);
	},
	_header:function(settings){
		if(!settings.title) { return this.hideHeader(); }
		jQuery(this.overlay).find('.jmb-overlay-header').css('height', settings.headerHeight+'px').html(settings.title);
	},
	_body:function(settings){
		if(!settings.object) return false;
		jQuery(this.overlay).find('.jmb-overlay-body').css('max-width', settings.width+'px').css('max-height', ((!settings.title)?settings.height:settings.height-settings.headerHeight)+'px').html('').append(settings.object);
	},
	getSize:function(){
		var width, height;
		width = jQuery(document).width();
		height = jQuery(document).height();
		return [width,height];
	},
	hideHeader:function(){
		jQuery(this.overlay).find('.jmb-overlay-header').hide();
	},
	showHeader:function(){
		jQuery(this.overlay).find('.jmb-overlay-header').show();
	},
	show:function(e){
		var self = this,size = this.getSize();
		jQuery(this.modal).css('width',size[0]+'px');
		jQuery(this.modal).css('height',size[1]+'px');
		jQuery(document.body).append(this.modal);
		jQuery(this.overlay).show();
		jQuery(this.overlay).find('.jmb-overlay-close').click(function(){ self.close(); });
		jQuery(this.modal).click(function(){ self.close(); })
	},
	hide:function(){
		jQuery(this.modal).remove();
		jQuery(this.overlay).hide();
	},
	close:function(){
		jQuery(this.modal).remove();
		jQuery(this.overlay).remove();
	},
	offset:function(offset){
		jQuery(this.overlay)
		.css('top', offset.top+'px')
		.css('left',offset.left+'px');
	},
	align:function(settings){
		var size = this.getSize();
		var top, left;
		switch(settings.align){
			case "left":
				top = 100;
				left = 100;
			break;
			
			case "center":
				top = 100;
				left = size[0]/2-settings.width/2;
			break;
			
			case "right":
				top = 100;
				left = size[0]-100-settings.width;
			break;
		}
		this.offset({top:top,left:left});
	},
	render:function(settings){
		if(!settings) settings = {};
		var set = this._extend( this.settings, settings);
		jQuery(this.overlay)
		.css('width', set.width+'px')
		.css('height', set.height+'px')
		.css('display', 'none');
		this._header(set);
		this._body(set);
		this.align(set);
		jQuery(set.parent).append(this.overlay);
	}	
}




