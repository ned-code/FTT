function DescendantTreeProfile(parent){
	var self = this;	
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var colors = {
		male:null,  
		female:null, 
		location:null
	};
	
	this.json = false;
	this.parent = parent;	
	this.months = months;
	this.colors = colors;
	this.body = this.createDiv(parent);	
	this.modal = this.createModal();
	this.renderType = null;
	this.editDiv = null;
	this.profile = new JMBProfile();
	this._headerEvent();
}

DescendantTreeProfile.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("descendant_tree", "JMBDescendantTree", func, params, function(res){
				callback(res);
		})
	},
	_headerEvent:function(){
		var self = this;
		storage.addEvent(storage.header.clickPull, function(object){
			var dhxTree = self.parent.dhxTree;
			dhxTree.deleteChildItems('0');
			dhxTree.deleteItem('0');
			self.parent.loadTree(dhxTree, jQuery(storage.header.activeButton).attr('id'));
			self.profile.tooltip.cleaner();
		})
		//when click tabs;
		storage.addEvent(storage.tabs.clickPull, function(object){
			self.profile.cleaner();
		});
	},
	createDiv:function(parent){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div id="jmb-dtp-container" class="jmb-dtp-container">');
			sb._('<div class="jmb-dtp-body">');
				sb._('<div class="jmb-dtp-body-info">');
					sb._('<table>');
						sb._('<tr>');
							sb._('<td><div class="jmb-dtp-body-info-avatar"><div class="jmb-dtp-facebook-icon" style="display:none">&nbsp;</div><div id="edit-button" class="jmb-dtp-body-edit-button">&nbsp;</div></div></td>');
							sb._('<td>');
								sb._('<div class="jmb-dtp-body-info-name"><span class="title">Name:</span>&nbsp;<span class="text"></span></div>');
								sb._('<div class="jmb-dtp-body-info-born"><span class="title">Born:</span>&nbsp;<span class="text"></span></div>');
								sb._('<div class="jmb-dtp-body-info-birthplace"><span class="title">Birthplace:</span>&nbsp;<span class="text"></span></div>');
								sb._('<div class="jmb-dtp-body-info-relation"><span class="title">Relation:</span>&nbsp;<span class="text"></span></div>');
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
					sb._('<div style="display:none;" class="jmb-dtp-body-info-switch">Switch to Full Profile</div>');
				sb._('</div>');
				sb._('<div class="jmb-dtp-body-space">&nbsp;</div>');
				sb._('<div class="jmb-dtp-body-media">&nbsp;</div>');
			sb._('</div>');
			sb._('<div class="jmb-dtp-footer"></div>');
		sb._('</div>');	
		var obj = jQuery(sb.result());
		jQuery(obj).find('.jmb-dtp-body-info-switch').click(function(){
			self.profile.profile.render({
				data: self.json,
				imgPath:self.json.path,
			}); 
		});
		parent.dhxLayout.cells("b").attachObject(obj[0]);		 
		return obj;
	},
	createModal:function(){
		var div = jQuery('<div class="jmb-dtp-modal"></div>');
		jQuery(div).width(jQuery(this.body).parent().width()+'px');
		jQuery(div).height(jQuery(this.body).parent().height()+'px');
		jQuery(this.body).parent().append(div);
		jQuery(div).hide();
		return div;
		
	},
	setModal:function(flag){
		if(flag){
			jQuery(this.modal).width(jQuery(this.body).parent().width()+'px');
			jQuery(this.modal).height(jQuery(this.body).parent().height()+'px');
			jQuery(this.modal).show();
		}
		else {
			jQuery(this.modal).hide();
		}
	},
	getName:function(ind){
		return [(ind.Nick!=null)?ind.Nick:ind.FirstName,(ind.LastName!=null)?ind.LastName:''].join(' ');
	},
	setName:function(obj, json){
		jQuery(obj).find('.jmb-dtp-body-info-name').find('span.text').html(this.getName(json.indiv));
	},
	getBirthdate:function(ind){
		var event = (ind.Birth.length>0)?ind.Birth[0]:false;
		if(!event) return event;
		return [(event.From.Day!=null)?event.From.Day:'',(event.From.Month!=null)?this.months[event.From.Month]:'',(event.From.Year!=null)?event.From.Year:''].join(' ');
	},
	setBirthdate:function(obj, json){
		jQuery(obj).find('.jmb-dtp-body-info-born').find('span.text').html(this.getBirthdate(json.indiv));
	},
	getBirthplace:function(ind){
		var event, place;
		event = (ind.Birth.length>0)?ind.Birth[0]:false;
		if(!event) return event;
		place = (event.Place!=null)?event.Place:false;
		if(!place) return place;
		return place.Name;
	},
	setBirthplace:function(obj, json){
		jQuery(obj).find('.jmb-dtp-body-info-birthplace').find('span.text').html(this.getBirthplace(json.indiv));
	},
	getRelation:function(ind){
		return (ind.Relation!=null)?ind.Relation:false;
	},
	setRelation:function(obj, json){
		jQuery(obj).find('.jmb-dtp-body-info-relation').find('span.text').html(this.getRelation(json.indiv));
	},
	getAvatar:function(obj, x, y){
		if(!obj) return '';
		var self = this;
		var fId = obj.indiv.FacebookId,
			av = obj.avatar,		
			defImg=(obj.indiv.Gender=="M")?'male.png':'female.png';	
		if(av!= null&&av.FilePath != null){
			return ['<img src="index.php?option=com_manager&task=getResizeImage&id=',av.Id,'&w=',x,'&h=',y,'">'].join('');
		}
		else if(fId != '0'){
			return ['<img src="index.php?option=com_manager&task=getResizeImage&fid=',fId,'&w=',x,'&h=',y,'">'].join('');
		}
		var defImgPath = [obj.path,'/components/com_manager/modules/descendant_tree/imgs/',defImg].join('');
		return ['<img height="',y,'px" width="',x,'px" src="',defImgPath,'">'].join('');
	},
	setAvatar:function(obj, json){
		var imgObject = jQuery(obj).find('img');
		if(jQuery(imgObject).length>0) jQuery(imgObject).remove();
		jQuery(obj).find('.jmb-dtp-facebook-icon').removeAttr('id').hide().html('&nbsp;');
		if(json.indiv.FacebookId!='0'){
			var image = ['<img src="',json.path,'/components/com_manager/modules/families/css/facebook_icon.png" width="14x" height="14px">'].join('');
			jQuery(obj).find('.jmb-dtp-facebook-icon').attr('id', json.indiv.FacebookId).html(image).show();;
		}
		var avatar = this.getAvatar(json, 72, 80);
		jQuery(obj).find('.jmb-dtp-body-info-avatar').append(avatar);
		
	},
	setEditButton:function(obj, json){
		var editButton = jQuery(obj).find('#edit-button');
		if(jQuery(editButton).length>0) jQuery(editButton).remove();
		var html = '<div class="jmb-dtp-body-edit-button" id="edit-button" bt-xtitle="" title="">&nbsp;</div>';
		jQuery(obj).find('.jmb-dtp-body-info-avatar').append(html);
	},
	permission:function(json){
		var self = this, permission = json.fmbUser.indiv.Permission, relation = json.indiv.Relation;
		if(permission=='USER'){
			switch(relation){
				case 'self':
				case 'spouse':
				case 'father':
				case 'mother':
				case 'son':
				case 'daughter':
				case 'brother':
				case 'sister':
					return true;
				break;
				
				default: return false;	
			}
		}
		return true;
	},
	setSwitchButton:function(obj, json){
		var switchButton = jQuery(obj).find('.jmb-dtp-body-info-switch');
		
		var permission = this.permission(json);
		if(permission){
			jQuery(switchButton).show();
		} else {
			jQuery(switchButton).hide();
		}
	},
	setColors:function(colors){
		this.colors.male = colors['M'];
		this.colors.female = colors['F'];
		this.colors.location = colors['L'];
	},
	clear:function(){
	},
	setBodyInfo:function(obj, json){
		this.setEditButton(obj, json);
		this.setSwitchButton(obj, json);
		this.setAvatar(obj, json);
		this.setName(obj, json);	
		this.setBirthdate(obj, json);
		this.setBirthplace(obj, json);
		this.setRelation(obj, json);
	},
	setBodySpace:function(obj, json){
		var text = [json.indiv.FirstName,'is your', this.getRelation(json.indiv)].join(' ');
		jQuery(obj).find('.jmb-dtp-body-space').html(text);
	},
	getPhoto:function(obj, x,y){
		return ['<img src="index.php?option=com_manager&task=getResizeImage&id=',obj.Id,'&w=',x,'&h=',y,'">'].join('');
	},
	getImage:function(image, x, y){
		var sb = host.stringBuffer();
		return sb._('<a href="')._(image.FilePath)._('" rel="prettyPhoto[pp_gal]" title=""><img src="index.php?option=com_manager&task=getResizeImage&id=')._(image.Id)._('&w=')._(x)._('&h=')._(y)._('" alt="" /></a>').result();
	},
	setBodyMedia:function(obj, json){
		var ul = jQuery(obj).find('.jmb-dtp-body-media').find('ul');
		if(ul.length>0) jQuery(ul).remove();
		if(json.photo.length==0) return;
		var self = this, sb = host.stringBuffer();
		sb._('<ul class="media-list">');
			jQuery(json.photo).each(function(i,photo){
				sb._('<li class="media-item">')._(self.getImage(photo, 50, 50))._('</li>');
			});
		sb._('</ul>');
		var html = jQuery(sb.result());
		self.profile.media.init(html);
		jQuery(obj).find('.jmb-dtp-body-media').append(html);
	},
	validToInvitation:function(json){
		var self = this, death = (json.indiv.Death.length>0)?json.indiv.Death[0]:false, birth = (json.indiv.Birth.length>0)?json.indiv.Birth[0]:false, date = new Date();
		if(birth&&birth.From!=null&&birth.From.Year){
			var year = date.getFullYear() - birth.From.Year;
			if(year > 100) return false;
		}
		if(death) return false;
		return true;
	},
	setSendMail:function(obj, json){
		var table = jQuery(obj).find('.jmb-dtp-footer').find('table');
		if(table.length!=0) jQuery(table).remove();
		if(json.indiv.FacebookId!='0'||!this.validToInvitation(json)) return;
		var self = this, sb = host.stringBuffer(), name = json.indiv.FirstName;
		sb._('<table>');			
			sb._('<tr>');
				sb._('<td><div class="email">&nbsp;</div></td>');
				sb._('<td>');
					sb._('<div><span>')._(name)._(' is not registred.</span></div>');
					sb._('<div><span class="send" style="color:blue;cursor:pointer">Click here to send ')._(name)._(' an email invitation.</span></div>');
				sb._('</td>');
			sb._('</tr>');
			
		sb._('</table>');
		var html = jQuery(sb.result());
		jQuery(html).find('span.send').click(function(){
			var p = {
				fmbUser:json.fmbUser,
				data:json
			}	
			self.profile.invitation.render(p);
		})
		jQuery(obj).find('.jmb-dtp-footer').append(html);
	},
	set:function(obj, json){
		this.setBodyInfo(obj, json);
		this.setBodySpace(obj, json);
		this.setBodyMedia(obj, json);
		this.setSendMail(obj, json);
	},
	render:function(id){
		var self = this;
		this.setModal(true);
		jQuery(self.editDiv).remove();
		this._ajax('getPersonInfoJSON', id, function(response){
			var json = jQuery.parseJSON(response.responseText);
			var obj = self.body;
			jQuery(obj).find('.jmb-dtp-body-info-switch').show();
			self.setColors(json.colors);
			self.set(obj, json);
			//when we click in facebook icon
			jQuery(obj).find('.jmb-dtp-facebook-icon').click(function(){
				var id = jQuery(this).attr('id');
				window.open('http://www.facebook.com/profile.php?id='+id,'new','width=320,height=240,toolbar=1')
			});
			//edit profile button
			var button = jQuery(obj).find(".jmb-dtp-body-edit-button");
			self.profile.tooltip.cleaner();
			self.profile.tooltip.render({
				target: button,
				fmbUser:json.fmbUser,
				id:jQuery(button).attr('id'),
				type: 'tooltip',
				data: json,
				imgPath:json.path,
				eventType:'click',
				parent:document.body
			});
			self.setModal(false);
			self.json = json;
		})
	}
}
