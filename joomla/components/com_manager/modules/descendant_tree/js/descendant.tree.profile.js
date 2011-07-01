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
	
	jQuery('.jmb_header_fam_line').find('span').each(function(index,element){
		if(jQuery(element).hasClass('active')) self.renderType = jQuery(element).attr('type');
		jQuery(element).bind('click', function(){
			if(!jQuery(this).attr('type') != self.renderType){
				var dhxTree = self.parent.dhxTree;
				dhxTree.deleteChildItems('0');
				dhxTree.deleteItem('0');
				self.parent.loadTree(dhxTree, jQuery(this).attr('type'))
				self.renderType = jQuery(this).attr('type');
			}	
		});
	});
	_DESCEDANTS_TREE = this;
}

DescendantTreeProfile.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("descendant_tree", "DescendantTree", func, params, function(res){
				callback(res);
		})
	},
	createDiv:function(parent){
		var self = this;
		var html = '<div id="jmb-dtp-container" class="jmb-dtp-container">';
			html += '<div class="jmb-dtp-header">';
				html += '<div class="jmb-dtp-header-name">&nbsp;</div>';
				html += '<div class="jmb-dtp-header-vector">&nbsp;</div>';
			html += '</div>';
			html += '<div class="jmb-dtp-body">';	
				html += '<div class="jmb-dtp-body-info">';
					html += '<table>';
						html += '<tr>';
						html += '<td><div class="jmb-dtp-body-info-avatar"><div class="jmb-profile-avatar">&nbsp;</div><div id="edit-button" class="jmb-dtp-body-edit-button">&nbsp;</div></div></td>';
							html += '<td>';
								html += '<div class="jmb-dtp-body-info-born">&nbsp;</div>';
								html += '<div class="jmb-dtp-body-info-died">&nbsp;</div>';
								html += '<div class="jmb-dtp-body-info-relation">&nbsp;</div>';
							html += '</td>';
						html += '</tr>';
					html += '</table>';
				html += '</div>';	
				html += '<div class="jmb-dtp-body-space">&nbsp;</div>'
				html += '<div class="jmb-dtp-body-media">';
					html += '<ul id="mycarousel" class="jcarousel-skin-tango">';
						html += '<li><div id="1" class="jmb-dtp-body-media-item">&nbsp;</div></li>';
						html += '<li><div id="2" class="jmb-dtp-body-media-item">&nbsp;</div></li>';
						html += '<li><div id="3" class="jmb-dtp-body-media-item">&nbsp;</div></li>';
						html += '<li><div id="4" class="jmb-dtp-body-media-item">&nbsp;</div></li>';
						html += '<li><div id="5" class="jmb-dtp-body-media-item">&nbsp;</div></li>';
					html += '</ul>';
				html += '</div>';
			html +='</div>';
			html += '<div class="jmb-dtp-footer">';
				html += '<table>';
					html += '<tr>';
						html += '<td>';
							html += '<div class="jmb-dtp-footer-mail-button">&nbsp;</div>';
						html += '</td>';
						html += '<td>';
							html += '<div class="jmb-dtp-footer-info">&nbsp;</div>';
						html += '</td>';
					html += '</tr>';
				html += '</table>';
			html += '</div>';
		html += '</div>';
		
		var obj = jQuery(html);
		parent.dhxLayout.cells("b").attachObject(obj[0]);
		
		var height = jQuery(obj).parent().height();
		jQuery(obj).height(height);
		

		jQuery(obj).find('#mycarousel').jcarousel({
			wrap: 'circular'
		});

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
		var year  = (ev.Year)?ev.Year:false;
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
			var b = json.Birth;
			var place = this.getPlace(b.Place.Hierarchy);
			var st = '<b>Born</b>: '+this.getDate(b);
			st += (place)?' in <span style="color:#'+this.colors.location+'">'+place.Name+'</span>.':'';
			return st;	
		}
		return '&nbsp;'; 
	},
	getDied:function(json){
		if(json.Death){
			var d = json.Death;
			var place = this.getPlace(d.Place.Hierarchy);
			var st = '<b>Died</b>: '+this.getDate(d);
			st += (place)?' in <span style="color:#'+this.colors.location+'">'+place.Name+'</span>.':'';
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
	getAvatar:function(json){
		/*
		var fId = json.indiv.FacebookId;
		var av = json.avatar;
		if(av != null && av.FilePath != null){
			return '<img height="80px" width="72px" src="'+av.FilePath+'">';
		}
		else if(fId != '0'){
			return '<img height="80px" width="72px" src="http://graph.facebook.com/'+fId+'/picture">';
		}
		return '&nbsp;';
		*/
		var fId = json.indiv.FacebookId;
		var avatar = json.avatar;
		if(avatar != null && avatar.FilePath != null){
			return '<img width="72px" height="80px" src="'+avatar.FilePath+'">';
		} else if(fId != '0'){
			return '<img width="72px" height="80px" src="http://graph.facebook.com/'+fId+'/picture">';
		} else {
			var imgName = (json.indiv.Gender=="M")?'male.gif':'female.gif';
			return '<img width="72px" height="80px" src="'+json.path+'/components/com_manager/modules/descendant_tree/imgs/'+imgName+'">';;
		}
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
			jQuery(obj).find('.jmb-profile-avatar').html(self.getAvatar(json));
			//edit profile button
			var button = jQuery(obj).find(".jmb-dtp-body-edit-button");
			self.profile.tooltip.render({
				target: button,
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
