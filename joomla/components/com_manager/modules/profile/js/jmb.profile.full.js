function JMBProfileFull(parent){
	this.parent = parent;
	this.json = null;
	this.menuActiveItem = null;
	this.spouseIndex = 0;
	
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
		var args = ''+self.json.data.indiv.Id;
		self.parent._ajaxForm(jQuery(htmlObject).find('form'), 'updateIndiv', args, 
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
	_personUnionInfoHTML:function(object){
		var self = this;
		var html = '<div class="jmb-dialog-profile-content-unions-person-info">';
			html += '<div class="jmb-dialog-profile-content-unions-person-info-name">'+self.parent._getFullName(object)+'</div>';
			if(object.Birth){
				html += '<div class="jmb-dialog-profile-content-unions-person-info-birthdate">'+self.parent._getEventDate(object.Birth)+'</div>';
				html += '<div class="jmb-dialog-profile-content-unions-person-info-birthplace">'+self.parent._getFullPlace(object.Birth.Place)+'</div>';
			}
		html += '</div>';
		return html;
	},
	_unionLinkImages:function(data, spouse){
		var self = this;
		var html = '<div class="jmb-dialog-profile-content-unions-image">';
			html += '<table>';
				html += '<tr>';
					html += '<td><div>'+self.parent._getAvatar(data,60,66)+'</div></td>';
					html += '<td><div>'+self.parent._getAvatar(spouse,60,66)+'</div></td>';
				html += '</tr>';
			html += '</table>';
		html += '</div>';
		return html;
	},
	_unionHTML:function(index, data, spouse){
		var self = this;
		var html = '<div id="jmb-union-'+index+'" class="jmb-dialog-profile-content-union" spouse_id="'+spouse.id+'">';
			html +='<form id="jmb-profile-addpsc-'+index+'" method="post" target="iframe-profile">';
				html += '<div class="jmb-dialog-profile-content-unions-header">';
					html += '<span style="float:left;">Union '+(index+1)+'</span>';
					html += '<span style="float:right;"><input type="submit" value="Save"></span>';
				html += '</div>';
				html += '<div class="jmb-dialog-profile-content-unions-body">';
					html += '<table>';
						html += '<tr>';
							html += '<td valign="top">'+self._personUnionInfoHTML(data.indiv)+'</td>';
							html += '<td valign="top">'+self._unionLinkImages(data,spouse)+'</td>';
							html += '<td valign="top">'+self._personUnionInfoHTML(spouse.indiv)+'</td>';
						html += '</tr>';
						html += '<tr>';
							html += '<td valign="top" colspan="3"><div class="jmb-dialog-profile-content-unions-part">'+self.parent._formUnionEventFields()+'</div></td>';
						html += '</tr>';
					html += '</table>';
				html += '</div>';
			html += '</form>';
		html += '</div>';
		return html;
	},
	_unionsHTML:function(){
		var self = this;
		var data = self.json.data;
		var html = '<div class="jmb-dialog-profile-content-unions">';
			jQuery(self.json.data.spouses).each(function(i, spouse){
				if(!spouse.id) return;
				html += self._unionHTML(i, data, spouse);
			});	
		html += '</div>';
		return html;
	},
	_unionCancelButton:function(object){
		var self = this;
		jQuery(object).find('.jmb-dialog-profile-content-unions-header input[value="Cancel"]').click(function(){
			jQuery(object).remove();
			self.spouseIndex--;
		})
	},
	_unionAdd:function(input, object){
		var self = this;
		var html = '<div id="jmb-union-'+self.spouseIndex+'" class="jmb-dialog-profile-content-union add" spouse_id="null">';
			html += '<form id="jmb:profile:addspouse" method="post" target="iframe-profile">';
			html += '<div class="jmb-dialog-profile-content-unions-header">';
				html += '<span style="float:left;">Union '+self.spouseIndex+'</span>';
				html += '<span style="float:right;"><input type="submit" value="Save"></span>';
				html += '<span style="float:right;"><input type="button" value="Cancel"></span>';
			html += '</div>';
			html += '<table>';
				html += '<tr>';
					html += '<td valign="top">';
						html += '<div class="jmb-dialog-photo">'+self.parent._getSpouseAvatar(self.json.data, 135, 150)+'</div>';
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
					html += '</td>';
				html += '</tr>';
				html += '<tr>';
					html += '<td colspan="2">';
						html += self.parent._formUnionEventFields();
					html += '</td>';
				html += '</tr>';
			html += '</table>';
			html += '</form>';
		html += '</div>';
		var htmlObject = jQuery(html);
		var gender = (self.json.data.indiv.Gender=="M")?"F":"M";
		jQuery(htmlObject).find('.jmb-dialog-form-gender input[value="'+gender+'"]').attr('checked','checked');
		jQuery(htmlObject).find('.jmb-dialog-button-submit').remove();
		jQuery(htmlObject).find('input[placeholder="Year"]').css('width', '80px');
		self.parent._buttonUploadPhoto(htmlObject);
		self.parent._buttonLiving(htmlObject, function(){
			jQuery(htmlObject).find('input[placeholder="Year"]').css('width', '80px');
		});
		self.parent._buttonsGender(htmlObject);
		self._unionCancelButton(htmlObject);
		
		var args = self.json.data.indiv.Id+';'+self.json.data.indiv.Gender;
		self.parent._ajaxForm(jQuery(htmlObject).find('form'), 'addSpouse', args, 
		function(res){
 			if(!self.parent._valid(htmlObject, 'date', {prefix:'b_'})){
 				alert('Incorrect Birth date.');
 				return false;
 			}
 			if(!self.parent._valid(htmlObject, 'date', {prefix:'d_'})){
 				alert('Incorrect Death date.');
 				return false;
 			}
 			if(!self.parent._valid(htmlObject, 'date', {prefix:'m_'})){
 				alert('Incorrect Marrige date.');
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
			jQuery(htmlObject).remove();
			var html = self._unionHTML(self.spouseIndex, json.data, json.spouse);
			self.json.data = json.data;
			jQuery(object[0]).append(html);
		});	
		jQuery(object[0]).append(htmlObject);
		self.spouseIndex++;
	},
	_unions:function(){
		var self = this;
		var data = self.json.data;
		var html = self._unionsHTML();
		html += '<div class="jmb-dialog-profile-content-unions-add"><input type="button" value="Add another union"></div>';
		var htmlObject = jQuery(html);
		//set data
		self.spouseIndex = jQuery(data.spouses).length+1;
		jQuery(data.spouses).each(function(i, spouse){
			var target =  jQuery(htmlObject).find('#jmb-union-'+i);
			self.parent._setUnionData(target, spouse);
			var args = data.indiv.Id+';'+spouse.id;
			self.parent._ajaxForm(jQuery(htmlObject).find('form#jmb-profile-addpsc-'+i), 'updateUnion', args, 
			function(res){
			}, function(json){
			});
		});	
		var input = jQuery(htmlObject[1]).find('input');
		jQuery(input).click(function(){
			self._unionAdd(this, htmlObject);
		});
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
		jQuery(self.parent.dContent.object).find('div#profile-basic').click();
	}
}
