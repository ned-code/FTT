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
			self.parent.loadTree(dhxTree, jQuery(storage.header.activeButton).text());
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
			sb._('<div class="jmb-dtp-header">');
				sb._('<div class="jmb-dtp-header-name">&nbsp;</div>');
			sb._('</div>');
			sb._('<div class="jmb-dtp-body">');
				sb._('<div class="jmb-dtp-body-info">');
					sb._('<table>');
						sb._('<tr>');
							sb._('<td><div class="jmb-profile-avatar"><div class="jmb-dtp-facebook-icon" style="display:none">&nbsp;</div><div id="edit-button" class="jmb-dtp-body-edit-button">&nbsp;</div></div></td>');
							sb._('<td>');
								sb._('<div class="jmb-dtp-body-info-born">&nbsp;</div>');
								sb._('<div class="jmb-dtp-body-info-died">&nbsp;</div>');
								sb._('<div class="jmb-dtp-body-info-relation">&nbsp;</div>');
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
				sb._('</div>');
				sb._('<div class="jmb-dtp-body-space">&nbsp;</div>');
				sb._('<div class="jmb-dtp-body-media">&nbsp;</div>');
			sb._('</div>');
			sb._('<div class="jmb-dtp-footer">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td>');
							sb._('<div class="jmb-dtp-footer-mail-button">&nbsp;</div>');
						sb._('</td>');
						sb._('<td>');
							sb._('<div class="jmb-dtp-footer-info">&nbsp;</div>');
						sb._('</td>');
					sb._('</tr>');
				sb._('</table>');
			sb._('</div>');
		sb._('</div>');	
		var obj = jQuery(sb.result());
		parent.dhxLayout.cells("b").attachObject(obj[0]);
		
		var height = jQuery(obj).parent().height();
		jQuery(obj).height(height);

		jQuery(obj).find(".jmb-dtp-footer-mail-button").click(function(){
			if(self.json){
				if(self.json.indiv.FacebookId == '0') {
					alert('email request send.');
				}
			}
		})
		 
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
	getDate:function(ev){
		var year  = (ev&&ev.From.Year)?ev.From.Year:false;
		if(year){
			return year;
		}
		else{
			return 'unknown';
		}
	},
	getPlace:function(obj){
		return (obj[0]!=null)?obj[0]:'';
	},
	getMedia:function(json){
		return '&nbsp;';
	},
	getBorn:function(json){
		if(json.Birth){
			var b = json.Birth[0];
			//var place = this.getPlace(b.Place.Hierarchy);
			var st = '<b>Born</b>: '+this.getDate(b);
			//st += (place)?' in <span style="color:#'+this.colors.location+'">'+place.Name+'</span>.':'';
			return st;	
		}
		return '&nbsp;'; 
	},
	getDied:function(json){
		if(json.Death){
			var d = json.Death[0];
			//var place = this.getPlace(d.Place.Hierarchy);
			var st = '<b>Died</b>: '+this.getDate(d);
			//st += (place)?' in <span style="color:#'+this.colors.location+'">'+place.Name+'</span>.':'';
			return st;	
		}
		return '&nbsp;';
	},
	getInfo:function(json){
		if(json.FacebookId == 0){
			var st = json.FirstName+' is not registered.<br>';
			st += 'Click here to send '+json.FirstName+'an email invitation.';
			return st; 
		}
		return '&nbsp;';
	},
	getRelation:function(json){
		return '&nbsp;';
	},
	setAvatar:function(obj, json){
		var imgObject = jQuery(obj).find('img');
		if(jQuery(imgObject).length>0) jQuery(imgObject).remove();
		jQuery(obj).find('.jmb-dtp-facebook-icon').removeAttr('id').hide().html('&nbsp;');
		
		var fId = json.indiv.FacebookId;
		var avatar = json.avatar;
		var img;
		if(avatar != null && avatar.FilePath != null){
			img = '<img width="72px" height="80px" src="'+avatar.FilePath+'">';
		} else if(fId != '0'){
			img = '<img width="72px" height="80px" src="http://graph.facebook.com/'+fId+'/picture">';
		} else {
			var imgName = (json.indiv.Gender=="M")?'male.gif':'female.gif';
			img = '<img width="72px" height="80px" src="'+json.path+'/components/com_manager/modules/descendant_tree/imgs/'+imgName+'">';;
		}
		if(fId != '0'){
			var imgPath = json.path+"/components/com_manager/modules/families/css/facebook_icon.png"; 
			var f_div = jQuery(obj).find('.jmb-dtp-facebook-icon').attr('id', fId).html('<img src="'+imgPath+'" width="14x" height="14px">').show();
		}
		var div = jQuery(obj).find('.jmb-profile-avatar').append(img);
	},
	setColors:function(colors){
		this.colors.male = colors['M'];
		this.colors.female = colors['F'];
		this.colors.location = colors['L'];
	},
	clear:function(){
		var obj = self.body;
		jQuery(obj).find('.jmb-dtp-header-name').html('&nbsp;');
		//jQuery(obj).find('.jmb-dtp-body-media').html('');
		jQuery(obj).find('.jmb-dtp-body-info-born').html('&nbsp;');
		jQuery(obj).find('.jmb-dtp-body-info-died').html('&nbsp;');
		jQuery(obj).find('.jmb-dtp-body-info-relation').html('&nbsp;');
		jQuery(obj).find('.jmb-dtp-footer-info').html('&nbsp;');
	},
	render:function(id){
		var self = this;
		this.setModal(true);
		jQuery(self.editDiv).remove();
		this._ajax('getPersonInfoJSON', id, function(response){
			var json = jQuery.parseJSON(response.responseText);
			var obj = self.body;
			var ind = json.indiv;
			self.setColors(json.colors);
			jQuery(obj).find('.jmb-dtp-header-name').html(ind.FirstName+' '+ind.LastName);
			//jQuery(obj).find('.jmb-dtp-body-media').html(self.getMedia(ind));
			jQuery(obj).find('.jmb-dtp-body-info-born').html(self.getBorn(ind));
			jQuery(obj).find('.jmb-dtp-body-info-died').html(self.getDied(ind));
			jQuery(obj).find('.jmb-dtp-body-info-relation').html(self.getRelation(ind));
			jQuery(obj).find('.jmb-dtp-footer-info').html(self.getInfo(ind));
			self.setAvatar(obj, json)
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
