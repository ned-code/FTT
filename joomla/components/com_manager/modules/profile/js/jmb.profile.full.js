function JMBProfileFull(parent){
	this.parent = parent;
	this.json = null;
	this.menuActiveItem = null;
	
	this.menu = {
		"profile":{
			name:"Profile",
			"basic":"Basic Details",
			"unions":"Unions",
			"events":"Events",
			"sources":"Sources",
			"notes":"Notes"
		},
		"media":{
			name:"Media",
			"self":"Self",
			"family":"Family",
			"other":"Other"
		}
	};
}

JMBProfileFull.prototype = {
	cleaner:function(){
		this.menuActiveItem = null;
	},
	_menuItemParse:function(item, parent){
		var self = this;
		var html = '';
		for(var key in item){
			if(typeof(item[key])=='object'){
				html += self._menuItemParse(item[key], key);
			}
			else{
				if(key == 'name'){
					html += '<div id="'+parent+'-'+key+'" class="jmb-dialog-profile-menu-item-parent"><span>'+item.name+'</span></div>';
				}else{
					html += '<div id="'+parent+'-'+key+'" class="jmb-dialog-profile-menu-item-child"><span>'+item[key]+'</span></div>';
				}
			}
		}
		return html;	
	},
	_menu:function(){
		var self = this;
		var html = '<div class="jmb-dialog-profile-menu-container">';
			html += self._menuItemParse(self.menu);
		html += '</div>';
		return html;
	},
	_edit:function(p){
		var self = this;
		var html = '<div>';
			html += '<table>';
				html += '<tr> <td valign="top" style="width:150px;">'+self._menu()+'</td> <td valign="top"><div class="jmb-dialog-profile-content"></div></td> </tr>';
			html += '</table>'
		html += '</div>';
		return html;
	},
	_setMenuItem:function(parent, name){
		var self = this;
		switch(name){
			case "basic":
				self._basic();
			break;
			
			case "unions":
				self._unions();
			break;
		}
	},
	_setMenu:function(object){
		var self = this;
		var first = true;
		jQuery(object).find('div.jmb-dialog-profile-menu-container div').each(function(i,e){
			var id = jQuery(e).attr('id');
			if(id.split('-')[1] != 'name'){
				jQuery(e).click(function(){
					if(self.menuActiveItem){
						if(jQuery(self.menuActiveItem).attr('id').split('-')[1] == id.split('-')[1]) return;
						jQuery(self.menuActiveItem).removeClass('active');
					}
					jQuery(e).addClass('active');
					self.menuActiveItem = e;
					jQuery(object).find('div.jmb-dialog-profile-content').html('');
					self._setMenuItem(id.split('-')[0], id.split('-')[1]);
				})
			}
		});
	},
	_basic:function(){
		var self = this;
		var object = self.json.data
		var html = '<div class="jmb-dialog-profile-content-basic"><form id="jmb:fullprofile:basic" method="post" target="iframe-profile">';
			html += '<div class="jmb-dialog-profile-content-basic-body">';
				html += '<table style="width:100%;"><tr>';
					html += '<td valign="top" style="width:160px;">';
						html += '<div class="jmb-dialog-photo">'+self.parent._getAvatar(object, 135, 150)+'</div>';
						html += '<div class="jmb-dialog-photo-button">';
							html += '<span class="jmb-dialog-photo-button-wrapper">';
								html += '<input type="file" name="photo" id="photo" />';
								html += '<span class="jmb-dialog-photo-button2">Upload Photo</span>';
								html += '<div class="jmb-dialog-photo-context"></div>';
							html += '</span>';
						html += '</div>';
					html += '</td>';
					html += '<td valign="top">';
						html += self.parent._formBasicFields();
					html += '</td>'
				html += '</tr></table>';
			html += '</div>'
		html += '</form></div>';
		var htmlObject = jQuery(html);
		//set events
		self.parent._buttonUploadPhoto(htmlObject);
		self.parent._buttonCancel(htmlObject);
		self.parent._buttonLiving(htmlObject);
		self.parent._buttonsGender(htmlObject);
		
		//set data
		self.parent._setData(htmlObject, self.json.data);
		
		//ajaxForm
		var args = 'indiv;'+self.json.data.indiv.Id;
		self.parent._ajaxForm(jQuery(htmlObject).find('form'), 'save', args, 
		function(res){
 			if(!self.parent._valid(htmlObject, 'date', {prefix:'b_'})){
 				alert('Incorrect Birth date.');
 				return false;
 			}
 			if(!self.parent._valid(htmlObject, 'date', {prefix:'d_'})){
 				alert('Incorrect Death date.');
 				return false;
 			}
 			if(!self.parent._valid(htmlObject, 'firstName', {})){
 				alert('Not set "First name".')
 				return false;
 			}
 			if(!self.parent._valid(htmlObject, 'photo', {})){
 				alert('Incorrect image(try to use .jpg,.gif,.png).');
 				return false;
 			}
 			return true;
		}, function(json){
			if(json.p){
				jQuery(htmlObject).find('.jmb-dialog-photo').html(self._getPhoto(json, 135, 150));
			}
		});
		
		jQuery(htmlObject).find('.jmb-dialog-form-gender input[value="'+self.json.data.indiv.Gender+'"]').attr('checked', true);
		jQuery(self.parent.dWindow).find('div.jmb-dialog-profile-content').append(htmlObject);
	},
	_personUnionInfoHTML:function(){
		var html = '<div class="jmb-dialog-profile-content-unions-person-info">';
			html += '<div class="jmb-dialog-profile-content-unions-person-info-name">FIRSTNAME LASTNAME</div>';
			html += '<div class="jmb-dialog-profile-content-unions-person-info-birthdate">BIRTHDATE</div>';
			html += '<div class="jmb-dialog-profile-content-unions-person-info-birthplace">BIRTHPLACE</div>';
		html += '</div>';
		return html;
	},
	_unionsHTML:function(){
		var self = this;
		var html = '<div class="jmb-dialog-profile-content-unions">';
			html += '<div class="jmb-dialog-profile-content-unions-header">';
				html += '<span style="float:left;">Union 1</span>';
				html += '<span style="float:right;"><input type="submit" value="Save"></span>';
			html += '</div>';
			html += '<div class="jmb-dialog-profile-content-unions-body">';
				html +='<form>';
					html += '<table>';
						html += '<tr>';
							html += '<td valign="top">'+self._personUnionInfoHTML()+'</td>';
							html += '<td valign="top"><div class="jmb-dialog-profile-content-unions-image male">&nbsp;</div></td>';
							html += '<td valign="top">'+self._personUnionInfoHTML()+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td valign="top" colspan="3"><div class="jmb-dialog-profile-content-unions-part">'+self.parent._formUnionEventFields()+'</div></td>';
						html += '</tr>';
					html += '</table>';
				html += '</form>';
			html += '</div>';
		html += '</div>';
		return html;
	},
	_unions:function(){
		var self = this;
		var html = self._unionsHTML();
		html += '<div class="jmb-dialog-profile-content-unions-add"><input type="button" value="Add another union"></div>';
		var htmlObject = jQuery(html);
		jQuery(self.parent.dWindow).find('div.jmb-dialog-profile-content').append(htmlObject);
	},
	render:function(p){
		var self = this;
		self.json = p;
		self.parent._dialog({
			title:self.parent._getFullName(self.json.data.indiv),
			height: 450,
		});
		//set button edt\view
		var buttons = jQuery('<div class="jmb-dialog-interface-button"><div type="button" class="active"><span>Edit</span></div><div type="button"><span>View</span></div></div>');
		jQuery(self.parent.dWindow).parent().find('.ui-dialog-titlebar').append(buttons);
		jQuery(buttons).find('div[type="button"]').each(function(i,e){
			jQuery(e).click(function(){
				if(jQuery(this).hasClass('active')) return false;
				jQuery(buttons).find('.active').removeClass('active');
				jQuery(e).addClass('active');
			});
		});
		
		var html = self._edit(); 
		self.parent.dContent.object = jQuery(html);
		self.parent.dContent.flag = true;
		
		self._setMenu(self.parent.dContent.object);
		jQuery('.jmb-dialog-container').css({
			background:"white",
			border:"none"
		});
		jQuery(self.parent.dWindow).append(self.parent.dContent.object);
	}
}
