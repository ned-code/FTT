function JMBProfileTooltip(parent){
	this.parent = parent;
	this.storage = {
		length:0
	};
	this.defaultParams = {
		target:null,
		type:null,
		data:{},
		imgPath:null,
		fmbUser:null
	}
	this.defaultMiniProfileParams = {
		settings:{
			fill: '#628638', 
			strokeStyle: '#628638', 
			spikeLength: 40, 
			spikeGirth: 30, 
			padding: 0, 
			cornerRadius: 0, 
			trigger: 'none',
			closeWhenOthersOpen: true,
			textzIndex:       999,
			boxzIndex:        998,
			wrapperzIndex:    997,
			width:420,
			cssStyles: {
				fontFamily: '"lucida grande",tahoma,verdana,arial,sans-serif', 
				fontSize: '11px'
			}
		},
	};
	this.defaultTooltipParams = {
		settings:{
			fill: '#F7F7F7', 
			strokeStyle: '#B7B7B7', 
			spikeLength: 40, 
			spikeGirth: 10, 
			padding: 8, 
			cornerRadius: 0, 
			trigger: 'none',
			closeWhenOthersOpen: true,
			textzIndex:       999,
			boxzIndex:        998,
			wrapperzIndex:    997,
			cssStyles: {
				fontFamily: '"lucida grande",tahoma,verdana,arial,sans-serif', 
				fontSize: '11px'
			}
		}
	};
	this.btActive = null;
}

JMBProfileTooltip.prototype = {
	_tooltipContainer:function(p){
		var self = this;
		var sb = host.stringBuffer();
		var id = jQuery(p.target).attr('id');
		sb._("<div id='")._(id)._("-content' class='jmb-profile-tooltip-container'>");
			sb._("<div class='jmb-profile-tooltip-button-edit'><span>Edit this Profile</span></div>");
			sb._("<div class='jmb-profile-tooltip-fieldset'><fieldset>");
				sb._("<legend>Add:</legend>");
				sb._("<div class='jmb-profile-tooltip-parent'><span>Parent</span></div>");
				sb._("<div class='jmb-profile-tooltip-spouse'><span>Spouse</span></div>");
				sb._("<div class='jmb-profile-tooltip-bs'><span>Brother or Sister</span></div>");
				sb._("<div class='jmb-profile-tooltip-child'><span>Child</span></div>");
			sb._('</fieldset></div>');
			sb._("<div class='jmb-profile-tooltip-options'><span type='title'>More Options</span><table style='display:none;'><tr><td><div class='jmb-profile-tooltip-options-delete'><span type='delete'>Delete this Person</span></div></td></tr></table></div>")
			if(p.data.indiv.FacebookId == '0'){
				var name = (p.data.indiv.Nick!='')?p.data.indiv.Nick:p.data.indiv.FirstName;
				sb._("<div class='jmb-profile-tooltip-send'>");
					sb._('<table>');
						sb._('<tr>');
							sb._('<td rowspan="2">');
								sb._("<div class='jmb-profile-tooltip-send-img'>&nbsp;</div>");
							sb._('</td>');
							sb._('<td><span> ')._(name)._(' is not registred.</span></td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._("<td><span>Send ")._(name)._(" an invations.</span></td>");
						sb._('</tr>');
					sb._('</table>');
				sb._('</div>');
			}
			sb._("<div class='jmb-profile-tooltip-close'><a href='javascript:void(jQuery(\"#")._(id)._("\").btOff());'><div>&nbsp;</div></a></div>");
		sb._('</div>');
		var html = sb.result();
		var divObj = jQuery(html);
		return divObj;
	},
	_miniProfileContainer:function(p){
		var id = jQuery(p.target).attr('id');
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div id="')._(id)._('-content" class="jmb-profile-mini-container">');
			sb._('<div class="jmb-profile-mini-info">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td class="jmb-profile-mini-photo"><div>')._(self.parent._getAvatar(p.data,81,90))._('</div></td>');
						sb._('<td class="jmb-profile-mini-info-body">');
							sb._('<div><span>Name:</span> ')._(self.parent._getFullName(p.data.indiv))._('</div>');
							sb._('<div><span>Born:</span> ')._(self.parent._getEventDate(p.data.indiv.Birth))._('</div>');
							var relation = self.parent._getRelation(p);
							if(relation != 0) sb._('<div><span>Relation to you:</span> ')._(relation)._('</div>');
						sb._('</td>');
					sb._('</tr>');
				sb._('</table>');
				sb._('<div class="jmb-profile-mini-switch"><span>Switch to Full Profile</span></div>');
			sb._('</div>');
			sb._('<div class="jmb-profile-mini-images">');
				sb._(self.parent._photos(p.data.photo));
			sb._('</div>');
		sb._('</div>');
		var html = sb.result();
		var htmlObject = jQuery(html);
		return htmlObject;
	},
	_clickTooltip:function(p, type){
		var self = this;
		var tooltip = jQuery('div.bt-content');
		switch(type){
			case "edit":
				jQuery(tooltip).find('.jmb-profile-tooltip-button-edit').click(function(){
					self.parent.profile.render(p);
				});
			break;
			case "parent":
				jQuery(tooltip).find('.jmb-profile-tooltip-parent').click(function(){
					self.parent._addPSC(p, type);
				});
			break;
			case "spouse":
				jQuery(tooltip).find('.jmb-profile-tooltip-spouse').click(function(){
					self.parent._addSpouse(p);
				});
			break;
			case "bs":
				jQuery(tooltip).find('.jmb-profile-tooltip-bs').click(function(){
					self.parent._addPSC(p, type);
				});
			break;
			case "child":
				jQuery(tooltip).find('.jmb-profile-tooltip-child').click(function(){
					self.parent._addPSC(p, type);
				});
			break;
			case "send":
				jQuery(tooltip).find('.jmb-profile-tooltip-send').click(function(){
					alert('send request');
				});
			break;
			case "options":
				jQuery(tooltip).find('.jmb-profile-tooltip-options span[type="title"]').click(function(){
					var table = jQuery(tooltip).find('.jmb-profile-tooltip-options table');
					if(jQuery(table).css('display') == "none"){
						jQuery(table).css('display', 'block');
					}
					else {
						jQuery(table).css('display', 'none');
					}
				});
			break;
			case "delete":
				jQuery(tooltip).find('.jmb-profile-tooltip-options-delete').click(function(){
					var children = p.data.children;
					var name = self.parent._getFullName(p.data.indiv);
					if(jQuery(children).length == 0){
						var message = 'You are about to delete '+name+' from your family tree. Are you sure you want to do this?';
						self.confirm(message, {
							object:this,
							display:'inline',
							buttons:[{
									title:"Yes",
									click:function(e){ self._deleteUser(p, 'delete', function(){ jQuery(e.htmlObject).remove(); jQuery(e.modalWindow).remove(); }); }
								},
								{
									title:"No",
									click:function(e){ jQuery(e.htmlObject).remove(); jQuery(e.modalWindow).remove(); }
								}]
						});
					} else {
						var message = 'Warning: '+name+' has '+jQuery(children).length+' descendants. What would you like to do?';
						self.confirm(message, {
							object:this,
							display:'block',
							buttons:[{
									title:'<font color="red">Delete '+name+'</font> but <font color="green">keep descendants</font>.',
									click:function(e){ self._deleteUser(p, 'deleteAndKeep', function(){ jQuery(e.htmlObject).remove(); jQuery(e.modalWindow).remove(); }); }
								},
								{
									title:'<font color="red">Delete '+name+'</font> and also <font color="red">delete all descendants</font>.',
									click:function(e){ self._deleteUser(p, 'deleteAll', function(){ jQuery(e.htmlObject).remove(); jQuery(e.modalWindow).remove(); }); }
								}]
						});
						
					}
				});
			break;		
			case "switch":
				jQuery(tooltip).find('.jmb-profile-mini-switch').click(function(){
					self.parent.profile.render(p);
				});
			break;
		}
	},
	cleaner:function(){
		//delete sub items
		var self = this;
		var s = self.storage;
		jQuery(s).each(function(i,e){
			jQuery(e).remove();
			delete e;
		})
		s.length = 0;
		//delete active tooltip
		this.hideTooltip();
	},
	hideTooltip:function(){
		jQuery(this.btActive).btOff();
		this.btActive = null;
	},
	_eventClick:function(p, buttons){
		var self = this;
		jQuery(p.target).click(function(){
			jQuery(p.target).btOn();
			self.btActive = p.target;
			jQuery(buttons).each(function(i,e){
				self._clickTooltip(p, e);
			});
		});
	},
	_eventMouseEnter:function(p, buttons){
		var self = this;
		jQuery(p.target).mouseenter(function(){
			jQuery(p.target).btOn();
			self.btActive = p.target;
			jQuery(buttons).each(function(i,e){
				self._clickTooltip(p, e);
			});
		});
	},
	_deleteUser:function(p, type, callback){
		var self = this;
		var args = p.data.indiv.Id+';'+type;
		self.parent._ajax('delete', args, function(){
			callback();
		});
	},
	confirm:function(message, settings){
		var wHeight = jQuery(document.body).height();
		var wWidth = jQuery(document.body).width();
		var confirm = {};
		var sb = host.stringBuffer();
		
		//set functions;
		var modalWindow = jQuery('<div style="width:'+wWidth+'px;height:'+wHeight+'px;position:absolute;z-index:4999;background:#000;opacity:0.7;top:0px;left:0px;">&nbsp;</div>');
		
		var createDivButton = function(value){
			return jQuery('<div class="jmb-confirm-button">'+value+'</div>')
		}
		var modal = function(flag){
			return (flag)?jQuery(document.body).append(modalWindow):jQuery(modalWindow).remove();
		}
		
		//create html&htmlObject;
		sb._('<div class="jmb-confirm">');
			sb._('<div class="jmb-confirm-header">')._(message)._('</div>');
			sb._('<div class="jmb-confirm-body"></div>');
			sb._('<div class="jmb-confirm-close">&nbsp;</div>');
		sb._('<div>')
		
		var htmlObject = jQuery(html);
		//set buttons;
		jQuery(settings.buttons).each(function(i,e){
			var button = createDivButton(e.title);
			jQuery(button).css('display', settings.display);
			jQuery(htmlObject).find('.jmb-confirm-body').append(button);
			jQuery(button).click(function(){
				e.click(confirm);
			})
		});
		//set params;
		var offset = jQuery(settings.object).offset();
		jQuery(htmlObject).css('z-index', '5000');
		jQuery(htmlObject).css('top', (offset.top-60)+'px');
		jQuery(htmlObject).css('left', (offset.left-160)+'px');
		
		//close button
		jQuery(htmlObject).find('.jmb-confirm-close').click(function(){ jQuery(htmlObject).remove(); modal(false); });
			
		//set object;
		confirm.html = html;
		confirm.htmlObject = htmlObject;
		confirm.settings = settings;
		confirm.modalWindow = modalWindow;
		
		//append to window;
		modal(true);
		jQuery(document.body).append(htmlObject);	
	},
	render:function(p){
		var buttons, container;
		var self = this;
		if(!p) return;
		if(!self.parent.imgPath) self.parent.imgPath = p.imgPath;
		if(p.type == 'tooltip'){
			buttons = ["edit","parent","spouse","bs","child","send","options","delete"];
			jQuery.extend(p, this.defaultTooltipParams);
			container = this._tooltipContainer(p);
		}
		else if(p.type == 'mini'){
			buttons = ["switch"];
			jQuery.extend(p, this.defaultMiniProfileParams);
			container = this._miniProfileContainer(p);		
		}
		var l = self.storage.length++;
		self.storage[l] = container;
		p.settings.contentSelector = "jQuery('#"+jQuery(p.target).attr('id')+"-content')";
		if(p.parent) p.settings.offsetParent = p.parent;
		
		jQuery(document.body).append(container);
		jQuery(container).hide();
		
		jQuery(p.target).bt(p.settings);
		if(p.eventType == 'click'){
			self._eventClick(p, buttons);
		}
		else if(p.eventType == 'mouseenter'){
			self._eventMouseEnter(p, buttons);
		}
		
		self.parent.json = p;
	}
}
