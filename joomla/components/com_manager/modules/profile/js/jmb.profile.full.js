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
		var sb = host.stringBuffer();
		for(var key in item){
			if(typeof(item[key])=='object'){
				sb._(self._menuItemParse(item[key], key));
			}
			else{
				if(key == 'name'){
					sb._('<div id="')._(parent)._('-')._(key)._('" class="jmb-dialog-profile-menu-item-parent"><span>')._(item.name)._('</span></div>');
				}else{
					sb._('<div id="')._(parent)._('-')._(key)._('" class="jmb-dialog-profile-menu-item-child"><span>')._(item[key])._('</span></div>');
				}
			}
		}
		return sb.result();	
	},
	_menu:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div class="jmb-dialog-profile-menu-container">');
			sb._(self._menuItemParse(self.menu));
		sb._('</div>');	
		return sb.result();
	},
	_edit:function(p){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div>');
			sb._('<table>');
				sb._('<tr> <td valign="top" style="width:150px;">')._(self._menu())._('</td> <td valign="top"><div class="jmb-dialog-profile-content"></div></td></tr>');
			sb._('</table>');
		sb._('</div>');
		return sb.result();
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
		
			case "events":
				self._events();
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
		var object = self.json.data;
		var sb = host.stringBuffer();
		sb._('<div class="jmb-dialog-profile-content-basic"><form id="jmb:fullprofile:basic" method="post" target="iframe-profile">');
			sb._('<div class="jmb-dialog-profile-content-basic-body">');
				sb._('<table style="width:100%;"><tr>');
					sb._('<td valign="top" style="width:160px;">')
						sb._('<div class="jmb-dialog-photo">')._(self.parent._getAvatar(object, 135, 150))._('</div>');
						sb._('<div class="jmb-dialog-photo-button">');
							sb._('<span class="jmb-dialog-photo-button-wrapper">');
								sb._('<input type="file" name="photo" id="photo">');
								sb._('<span class="jmb-dialog-photo-button2">Upload Photo</span>');
								sb._('<div class="jmb-dialog-photo-context"></div>');
							sb._('</span>');
						sb._('</div>');
					sb._('</td>');
					sb._('<td valign="top">');
						sb._(self.parent._formBasicFields());
					sb._('</td>');
				sb._('</tr></table>');
			sb._('</div>');
		sb._('</form></div>')
		var html = sb.result();
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
		var sb = host.stringBuffer();
		sb._('<div class="jmb-dialog-profile-content-unions-person-info">');
			sb._('<div class="jmb-dialog-profile-content-unions-person-info-name">')._(self.parent._getFullName(object))._('</div>');
			if(object.Birth){
				sb._('<div class="jmb-dialog-profile-content-unions-person-info-birthdate">')._(self.parent._getEventDate(object.Birth))._('</div>');
				sb._('<div class="jmb-dialog-profile-content-unions-person-info-birthplace">')._(self.parent._getFullPlace(object.Birth.Place))._('</div>');
			}
		sb._('</div>');
		return sb.result();
	},
	_unionLinkImages:function(data, spouse){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div class="jmb-dialog-profile-content-unions-image">');
			sb._('<table>');
				sb._('<tr>');
					sb._('<td><div>')._(self.parent._getAvatar(data,60,66))._('</div></td>');
					sb._('<td><div>')._(self.parent._getAvatar(spouse,60,66))._('</div></td>');
				sb._('</tr>');
			sb._('</table>');
		sb._('</div>');
		return sb.result();
	},
	_unionHTML:function(index, data, spouse){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div id="jmb-union-')._(index)._('" class="jmb-dialog-profile-content-union" spouse_id="')._(spouse.id)._('">');
			sb._('<form id="jmb-profile-addpsc-')._(index)._('" method="post" target="iframe-profile">');
				sb._('<div class="jmb-dialog-profile-content-unions-header">');
					sb._('<span style="float:left;">Union ')._(index+1)._('</span>');
					sb._('<span style="float:right;"><input type="submit" value="Save"></span>');
				sb._('</div>');
				sb._('<div class="jmb-dialog-profile-content-unions-body">');
					sb._('<table>');
						sb._('<tr>');
							sb._('<td valign="top">')._(self._personUnionInfoHTML(data.indiv))._('</td>');
							sb._('<td valign="top">')._(self._unionLinkImages(data,spouse))._('</td>');
							sb._('<td valign="top">')._(self._personUnionInfoHTML(spouse.indiv))._('</td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td valign="top" colspan="3"><div class="jmb-dialog-profile-content-unions-part">')._(self.parent._formUnionEventFields())._('</div></td>');
						sb._('</tr>');
					sb._('</table>');
				sb._('</div>');
			sb._('</form>');
		sb._('</div>');
		return sb.result();
	},
	_unionsHTML:function(){
		var self = this;
		var sb = host.stringBuffer();
		var data = self.json.data;
		sb._('<div class="jmb-dialog-profile-content-unions">');
			jQuery(self.json.data.spouses).each(function(i, spouse){
				if(!spouse.id) return;
				sb._(self._unionHTML(i, data, spouse))
			});	
		sb._('</div>');
		return sb.result();
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
		var sb = host.stringBuffer();
		sb._('<div id="jmb-union-')._(self.spouseIndex)._('" class="jmb-dialog-profile-content-union add" spouse_id="null">');
			sb._('<form id="jmb:profile:addspouse" method="post" target="iframe-profile">');
			sb._('<div class="jmb-dialog-profile-content-unions-header">');
				sb._('<span style="float:left;">Union ')._(self.spouseIndex)._('</span>');
				sb._('<span style="float:right;"><input type="submit" value="Save"></span>');
				sb._('<span style="float:right;"><input type="button" value="Cancel"></span>');
			sb._('</div>');
			sb._('<table>');
				sb._('<tr>');
					sb._('<td valign="top">');
						sb._('<div class="jmb-dialog-photo">')._(self.parent._getSpouseAvatar(self.json.data, 135, 150))._('</div>');
						sb._('<div class="jmb-dialog-photo-button">');
							sb._('<span class="jmb-dialog-photo-button-wrapper">');
								sb._('<input type="file" name="photo" id="photo">');
								sb._('<span class="jmb-dialog-photo-button2">Upload Photo</span>');
								sb._('<div class="jmb-dialog-photo-context"></div>');
							sb._('</span>');
						sb._('</div>');
					sb._('</td>');
					sb._('<td valign="top">');
						sb._(self.parent._formBasicFields());
					sb._('</td>');
				sb._('</tr>');
				sb._('<tr>');
					sb._('<td colspan="2">');
						sb._(self.parent._formUnionEventFields());
					sb._('</td>');
				sb._('</tr>');
			sb._('</table>');
			sb._('</form>');
		sb._('</div>');
		var html = sb.result();
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
	_events:function(){
		var self = this;
		var data = self.json.data;
		var sb = host.stringBuffer();
			sb._('<div class="jmb-dialog-profile-content-events">');
				sb._('<div class="header"><div class="button"><span>Edit existing event</span></div><div class="button active"><span>Create new Event</span></div></div>');
				sb._('<div class="body">');
					sb._('<div class="header">');
						sb._('<div class="title">Event</div>');
						sb._('<div class="buttons">');
							sb._('<input type="button" value="Save">');
							sb._('<input type="button" value="Delete">');
							sb._('<input type="button" value="Cancel">');
						sb._('</div>');
					sb._('</div>');
					sb._('<div class="content">');
						sb._('<table>');
							sb._('<tr>');
								sb._('<td><div class="title">Duration</div></td>');
								sb._('<td valign="top">');
									sb._('<div><input type="radio"><span>Single Day Event</span></div>');
									sb._('<div><input type="radio"><span>Prolonged Event</span></div>');
								sb._('</td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td><div class="title">Type</div></td>');
								sb._('<td><select><option>Graduation</option></select></td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td><div class="title">Date</div></td>');
								sb._('<td><select><option>Day</option></select><select><option>Month</option></select><input type="text" maxlength="4"></td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td><div class="title">Place</div></td>');
								sb._('<td><input type="text"></td>')
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td><div class="title">Location</div></td>');
								sb._('<td><input type="text"><input type="text"><input type="text"></td>');
							sb._('</tr>');
						sb._('</table>');
					sb._('</div>');
				sb._('</div>');
				sb._('<div class="list">');
					sb._('<div>1900 - Born in Toronto,Ontario Canada</div>');
					sb._('<div>1901 - Moves to Braga,Portugal</div>');
					sb._('<div>1902 - Graduates from Central Commerce High School</div>');
					sb._('<div class="active">1903 - Graduates from UT university</div>');
					sb._('<div>1999 - Marries Jane Fonda</div>');
				sb._('</div>');
			sb._('</div>');
		var html = sb.result();
		var htmlObject = jQuery(html);
		
		jQuery(self.parent.dWindow).find('div.jmb-dialog-profile-content').append(htmlObject);
	},
	render:function(p){
		var self = this;
		self.json = p;
		if(!self.parent.imgPath) self.parent.imgPath = p.imgPath;
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
