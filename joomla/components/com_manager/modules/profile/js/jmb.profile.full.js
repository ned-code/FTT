function JMBProfileFull(parent){
	this.parent = parent;
	this.json = null;
	this.menuActiveItem = null;
	this.menuEventsActiveItem = null
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
	this.singleDayEvents = [
		{name:'graduation',title:'Graduation'},
		{name:'immigration',title:'Immigration'},
		{name:'hired',title:'Hired'},
		{name:'award',title:'Award'},
		{name:'moved',title:'Moved Location'}
	];
	this.prolongedEvents = [
		{name:'occupation',title:'Occupation'},
		{name:'travel',title:'Travel'},
		{name:'lived',title:'Lived abroad'},
		{name:'elementary_school',title:'Attended Elementary School'},
		{name:'secondary_school',title:'Attended Secondary School'},
		{name:'post-secondaty_school',title:'Attended Post-Secondary School'},
	]
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
				sb._('<tr> <td valign="top" style="width:150px;">')._(self._menu())._('</td><td valign="top"><div class="jmb-dialog-profile-content"></div></td></tr>');
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
		var field = self.parent._form(sb);
		sb._('<div class="jmb-dialog-profile-content-basic"><form id="jmb:fullprofile:basic" method="post" target="iframe-profile">');
			sb._('<div class="jmb-dialog-button-submit"><input type="submit" value="Save"><input type="button" value="Cancel"></div>');
			sb._('<div class="jmb-dialog-profile-content-basic-body">');
				sb._('<table style="width:100%;">');
					sb._('<tr>');
						sb._('<td>')._(self.parent._formAvatar(sb, object, 135, 150))._('<td>');
						sb._('<td valing="top">');
							sb._(self.parent._formBasicFieldsInfo());
						sb._('</td>');
					sb._('</tr>');
					sb._('<tr>');
						sb._('<td colspan="4">');
							sb._(self.parent._formBasicFieldsEventDate());
						sb._('</td>');
					sb._('</tr>');
				sb._('</table>');
			sb._('</div>');
		sb._('</form></div>');
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
 			return true;
		}, function(json){
			self.json.data.indiv = json.ind;
			if(json.photo) jQuery(htmlObject).find('.jmb-dialog-photo').html(self.parent._getPhoto(json, 135, 150));
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
				sb._('<div class="jmb-dialog-profile-content-unions-person-info-birthdate">')._(self.parent._getEventDate(object.Birth[0]))._('</div>');
				sb._('<div class="jmb-dialog-profile-content-unions-person-info-birthplace">')._(self.parent._getFullPlace(object.Birth[0].Place))._('</div>');
			}
		sb._('</div>');
		return sb.result();
	},
	_unionHTML:function(index, data, spouse){
		var self = this;
		var sb = host.stringBuffer();	
		var indivBirth = (data.indiv.Birth)?data.indiv.Birth[0]:false;
		var indivPlace = (indivBirth)?indivBirth.Place:false;
		var spouseBirth = (spouse.indiv.Birth)?spouse.indiv.Birth[0]:false;
		var spousePlace = (spouseBirth)?indivBirth.Place:false;
		
		sb._('<div id="jmb-union-')._(index)._('" class="jmb-dialog-profile-content-union" spouse_id="')._(spouse.id)._('">');
			sb._('<form id="jmb-profile-addpsc-')._(index)._('" method="post" target="iframe-profile">');
				sb._('<div class="jmb-dialog-profile-content-unions-header">');
					sb._('<div id="title">Union ')._(index+1)._('</div>');
					sb._('<div id="button"><input type="submit" value="Save"></div>');
				sb._('</div>');
				sb._('<div class="jmb-dialog-profile-content-unions-body">');
					sb._('<table>');
						sb._('<tr>');
							sb._('<td>');
								sb._('<div style="margin-left: 30px;">');
									sb._('<div class="jmb-dialog-profile-content-unions-person"><table><tr>');
										sb._('<td><div style="border-right:none;" class="info">')
											sb._('<div class="name">')._(self.parent._getFullName(data.indiv))._('</div>');
											sb._('<div class="date">')._(self.parent._getEventDate(indivBirth))._('</div>');
											sb._('<div class="location">')._(self.parent._getFullPlace(indivPlace))._('</div>');
										sb._('</div></td>');
										sb._('<td><div class="avatar">')._(self.parent._getAvatar(data,72,80))._('</div></td>');
									sb._('</tr></table></div>');
									sb._('<div style="margin-left: 10px;" class="jmb-dialog-profile-content-unions-person"><table><tr>');
										sb._('<td><div class="avatar">')._(self.parent._getAvatar(spouse,72,80))._('</td></div>');
										sb._('<td><div style="border-left:none;" class="info">')
											sb._('<div class="name">')._(self.parent._getFullName(spouse.indiv))._('</div>');
											sb._('<div class="date">')._(self.parent._getEventDate(spouseBirth))._('</div>');
											sb._('<div class="location">')._(self.parent._getFullPlace(spousePlace))._('</div>');
										sb._('</div></td>');
									sb._('</tr></table></div>');
								sb._('</div>');
							sb._('</td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td valign="top"><div class="jmb-dialog-profile-content-unions-part">')._(self.parent._formUnionEventFields())._('</div></td>');
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
					sb._('<div class="jmb-dialog-profile-content-unions-header">');
						sb._('<div id="title">Union ')._(self.spouseIndex)._('</div>');
						sb._('<div id="button"><input type="submit" value="Save"><input type="button" value="Cancel"></div>');
					sb._('</div>');
				sb._('</div>');
			sb._('<table id="container">');
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
				delete spouse.event;
				spouse.event = new Array();
				(json.marriage)?spouse.event[spouse.event.length++]=json.marriage:null;
				(json.divorce)?spouse.event[spouse.event.length++]=json.divorce:null;
			});
		});	
		var input = jQuery(htmlObject[1]).find('input');
		jQuery(input).click(function(){
			self._unionAdd(this, htmlObject);
		});
		jQuery(self.parent.dWindow).find('div.jmb-dialog-profile-content').append(htmlObject);
	},
	_eventsBlockHeader:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div class="jmb-dialog-events-header">Select event to edit  or <div class="active"><span>Create new Event.</span></div></div>');
		return sb.result();
	},
	_eventsBlockEdit:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div class="jmb-dialog-events-edit" style="display:none;">');
			sb._('<form id="jmb:profile:events" method="post" target="iframe-profile">');
				sb._('<div class="jmb-dialog-events-edit-buttons"><input type="submit" value="Save"><input type="button" value="Delete"><input type="button" value="Close"></div>');
				sb._('<div class="jmb-dialog-events-edit-header">Event</div>')
				sb._('<div class="jmb-dialog-events-edit-body">');
					sb._('<table>');
						sb._('<tr><td valign="top"><div style="margin-top:5px;" class="title"><span>Duration:</span></div></td><td><div class="radio"><input name="duration" type="radio" value="single"><span id="single">Single Day Event</span></div><div class="radio"><input name="duration" type="radio" value="prolonged"><span id="prolonged">Prolonged Event</span></div></td></tr>');
						sb._('<tr><td><div class="title"><span>Type:<span></div></td><td><select name="type"></select></td></tr>');
						sb._('<tr id="date"><td><div class="title"><span>Date:<span></div></td><td><select name="day">')._(self.parent._selectDays())._('</select><select name="month">')._(self.parent._selectMonths())._('</select><input maxlength="4" type="text" placeholder="Year" name="year"></td></tr>');
						sb._('<tr id="start_date"><td><div class="title"><span>Start Date:<span></div></td><td><select name="start_day">')._(self.parent._selectDays())._('</select><select name="start_month">')._(self.parent._selectMonths())._('</select><input maxlength="4" type="text" placeholder="Year" name="start_year"></td></tr>');
						sb._('<tr id="end_date"><td><div class="title"><span>End Date:<span></div></td><td><select name="end_day">')._(self.parent._selectDays())._('</select><select name="end_month">')._(self.parent._selectMonths())._('</select><input maxlength="4" type="text" placeholder="Year" name="end_year"></td></tr>');
						sb._('<tr><td><div class="title"><span>Place:<span></div></td><td><input name="place" placeholder="Place" type="text"></td></tr>');
						sb._('<tr><td><div class="title"><span>Location:<span></div></td><td><input name="city" type="text" placeholder="Town/City"><input name="state" type="text" placeholder="Prov/State"><input name="country" type="text" placeholder="Country"></td></tr>');
					sb._('</table>');
				sb._('</div>')
		sb._('</div>');
		return sb.result();
	},
	_eventsBlockList:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div class="jmb-dialog-events-list">');
			sb._('<ul>');
				sb._('<li id="0"><div id="edit" class="button"><span>Edit</span></div><div id="delete" class="button">&nbsp;</div><div id="switch" class="text">1997 - Graduates from UT university.</div></li>');
				sb._('<li id="0" class="active"><div id="edit" class="button"><span>Edit</span></div><div id="delete" class="button">&nbsp;</div><div id="switch" class="text">1997 - Graduates from UT university.</div></li>');
				sb._('<li id="0"><div id="edit" class="button"><span>Edit</span></div><div id="delete" class="button">&nbsp;</div><div id="switch" class="text">1997 - Graduates from UT university.</div></li>');
			sb._('</ul>');
		sb._('</div>');
		return sb.result();
	},
	_eventsSetDefaultEditBlock:function(htmlObject){
		jQuery(htmlObject).find('div.radio span#single').click();
		jQuery(htmlObject).find('select[name="day"] option:selected').attr('selected', '');
		jQuery(htmlObject).find('select[name="day"] option[value="0"]').attr('selected', 'selected');
		jQuery(htmlObject).find('select[name="month"] option:selected').attr('selected', '');
		jQuery(htmlObject).find('select[name="month"] option[value="0"]').attr('selected', 'selected');
		jQuery(htmlObject).find('input[name="year"]').val('');
		jQuery(htmlObject).find('input[name="place"]').val('');
		jQuery(htmlObject).find('input[name="city"]').val('');
		jQuery(htmlObject).find('input[name="state"]').val('');
		jQuery(htmlObject).find('input[name="country"]').val('');
	},
	_eventsHeaderEvents:function(htmlObject){
		jQuery(htmlObject).find('.jmb-dialog-events-header span').click(function(){
			jQuery(htmlObject).find('.jmb-dialog-events-list').hide();
			jQuery(htmlObject).find('.jmb-dialog-events-edit').show();
		});
	},
	_eventsEditEvents:function(htmlObject){	
		var self = this;
		var sb = host.stringBuffer();
		jQuery(htmlObject).find('.jmb-dialog-events-edit-buttons input').each(function(i,e){
			jQuery(e).click(function(){
				switch(jQuery(this).val()){
					case "Delete":
						alert('Delete Event');
					break;
					
					case "Close":
						jQuery(htmlObject).find('.jmb-dialog-events-list').show();
						jQuery(htmlObject).find('.jmb-dialog-events-edit').hide();
					break;
				}
			});
		});
		jQuery(htmlObject).find('div.radio span').click(function(){
			jQuery(this).parent().find('input').click();
		});
		jQuery(htmlObject).find('div.radio input').click(function(){
			jQuery(htmlObject).find('select[name="type"] option').remove();
			var type = jQuery(this).val();
			jQuery(htmlObject).find('tr#date').hide();
			jQuery(htmlObject).find('tr#start_date').hide();
			jQuery(htmlObject).find('tr#end_date').hide();
			if(type=='single'){
				jQuery(htmlObject).find('tr#date').show();
			} else {
				jQuery(htmlObject).find('tr#start_date').show();
				jQuery(htmlObject).find('tr#end_date').show();
			}
			var types = (type=='single')?self.singleDayEvents:self.prolongedEvents;
			jQuery(types).each(function(i,e){
				sb.clear()._('<option value="')._(e.name)._('">')._(e.title)._('</option>');
				jQuery(htmlObject).find('select[name="type"]').append(sb.result())
			});
		});
	},
	_eventsListEvents:function(htmlObject){
		jQuery(htmlObject).find('div.jmb-dialog-events-list ul li div').each(function(i,e){
			jQuery(e).click(function(){
				switch(jQuery(this).attr('id')){
					case "edit":
						if(!jQuery(this).parent().hasClass('active')) return;
						jQuery(htmlObject).find('.jmb-dialog-events-list').hide();
						jQuery(htmlObject).find('.jmb-dialog-events-edit').show();
					break;
					
					case "delete":
						if(!jQuery(this).parent().hasClass('active')) return;
					break;
					
					case "switch":
						if(jQuery(this).parent().hasClass('active')) return;
						jQuery('div.jmb-dialog-events-list ul li').removeClass('active');
						jQuery(this).parent().addClass('active');
					break;
				}
			});
		});
	},
	_events:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div class="jmb-dialog-events-content">');
			sb._(self._eventsBlockHeader());
			sb._(self._eventsBlockEdit());
			sb._(self._eventsBlockList());
		sb._('</div>');
		var html = sb.result();
		var htmlObject = jQuery(html);
		//events
		self._eventsHeaderEvents(htmlObject);
		self._eventsEditEvents(htmlObject);
		self._eventsListEvents(htmlObject);
		self._eventsSetDefaultEditBlock(htmlObject);
		//ajax
		self.parent._ajaxForm(jQuery(htmlObject).find('form'), 'updateEvent', '0', function(res){}, function(json){});	
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
		var buttons = jQuery('<div class="jmb-dialog-interface-button"><div type="button" value="edit" class="active"><span>Edit</span></div><div value="view" type="button"><span>View</span></div></div>');
		jQuery(self.parent.dWindow).parent().find('.ui-dialog-titlebar').append(buttons);
				
		var html = self._edit(); 
		self.parent.dContent.object = jQuery(html);
		self.parent.dContent.flag = true;
		
		jQuery(buttons).find('div[type="button"]').each(function(i,e){
			jQuery(e).click(function(){
				if(jQuery(this).hasClass('active')) return false;
				jQuery(buttons).find('.active').removeClass('active');
				jQuery(e).addClass('active');
				switch(jQuery(e).attr('value')){
					case "edit":
						
					break;
					
					case "view":
						
					break;
				}
			});
		});
		
		self._setMenu(self.parent.dContent.object);
		jQuery('.jmb-dialog-container').css({
			background:"white",
			border:"none"
		});
		jQuery(self.parent.dWindow).append(self.parent.dContent.object);
		jQuery(self.parent.dContent.object).find('div#profile-basic').click();
	}
}
