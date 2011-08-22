function JMBProfileFull(parent){
	this.parent = parent;
	this.json = null;
	this.activeMenu = null;
	this.menuActiveItem = null;
	this.menuEventsActiveItem = null
	this.spouseIndex = 0;
	this.eventObject = null;
	this.binds = [];
	
	this.menu = {
		"edit":{
			"basic":"Basic Details",
			"unions":"Unions",
			"events":"Events",
			"photos":"Photos"
		},
		"view":{
			"vprofile":"Profile",
			"vphotos":"Photos"
		}
	}
	
	
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
				jQuery(data.events).each(function(i,e){
					if(e.Type=='MARR'&&json.marriage){
						data.events.splice(i,1, json.marriage);
					}
				});
			});
		});	
		var input = jQuery(htmlObject[1]).find('input');
		jQuery(input).click(function(){
			self._unionAdd(this, htmlObject);
		});
		jQuery(self.parent.dWindow).find('div.jmb-dialog-profile-content').append(htmlObject);
	},
	_eventsDeleteFromJson:function(id){
		var self = this;
		var events = self.json.data.events;
		jQuery(events).each(function(i,e){
			if(e.Id==id) delete events.splice(i, 1);
		})
	},
	_eventsDeleteObject:function(htmlObject, object, event_id){
		var self = this;
		if(confirm('Are you sure you want to delete this event?')){
			self.parent._ajax('deleteEvent', event_id, function(res){
				var response = jQuery.parseJSON(res.responseText);
				if(response.error) { alert(response.error); return; }
				jQuery(object).parent().remove();
				self._eventsDeleteFromJson(event_id);
			});
		}
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
						sb._('<tr><td valign="top"><div style="margin-top:5px;" class="title"><span>Duration:</span></div></td><td><div class="radio"><input name="duration" type="radio" value="EVO"><span id="single">Single Day Event</span></div><div class="radio"><input name="duration" type="radio" value="BET"><span id="prolonged">Prolonged Event</span></div></td></tr>');
						sb._('<tr><td><div class="title"><span>Type:<span></div></td><td><select name="type"></select></td></tr>');
						sb._('<tr id="date"><td><div class="title"><span>Date:<span></div></td><td><select name="f_day">')._(self.parent._selectDays())._('</select><select name="f_month">')._(self.parent._selectMonths())._('</select><input maxlength="4" type="text" placeholder="Year" name="f_year"><input name="f_option" type="checkbox"> Unknown</td></tr>');
						sb._('<tr id="end_date"><td><div class="title"><span>End Date:<span></div></td><td><select name="t_day">')._(self.parent._selectDays())._('</select><select name="t_month">')._(self.parent._selectMonths())._('</select><input maxlength="4" type="text" placeholder="Year" name="t_year"><input name="t_option" type="checkbox"> Unknown</td></tr>');
						sb._('<tr><td><div class="title"><span>Place:<span></div></td><td><input name="_place" placeholder="Place" type="text"></td></tr>');
						sb._('<tr><td><div class="title"><span>Location:<span></div></td><td><input name="_town" type="text" placeholder="Town/City"><input name="_state" type="text" placeholder="Prov/State"><input name="_country" type="text" placeholder="Country"></td></tr>');
					sb._('</table>');
				sb._('</div>')
		sb._('</div>');
		return sb.result();
	},
	_eventsBlockList:function(){
		var self = this;
		var sb = host.stringBuffer();
		var data = self.json.data;
		sb._('<div class="jmb-dialog-events-list">');
			sb._('<ul>');
				jQuery(data.events).each(function(i,e){
					if(e.FamKey!=null||e.Type=='BIRT'||e.Type=='DEAT'){
						sb._('<li><div id="readonly" class="button">&nbsp;</div><div id="switch" class="text">')._(self.parent._getEventLine(data, e))._('</div></li>');
					} else {
						sb._('<li id="')._(i)._('"><div id="edit" class="button"><span>Edit</span></div><div id="delete" class="button">&nbsp;</div><div id="switch" class="text">')._(self.parent._getEventLine(data, e))._('</div></li>');
					}	
				});	
			sb._('</ul>');
		sb._('</div>');
		return sb.result();
	},
	_eventsSetDefaultEditBlock:function(htmlObject){
		jQuery(htmlObject).find('div.radio span#single').click();
		jQuery(htmlObject).find('input[type="button"][value="Delete"]').show();
		jQuery(htmlObject).find('select[name="type"] option:first-child').attr('selected', 'selected');
		jQuery(htmlObject).find('select[name="f_day"] option[value="0"]').attr('selected', 'selected');
		jQuery(htmlObject).find('select[name="f_month"] option[value="0"]').attr('selected', 'selected');
		jQuery(htmlObject).find('input[name="f_year"]').val('');
		jQuery(htmlObject).find('input[name="f_option"]').attr('checked', 'checked');
		jQuery(htmlObject).find('select[name="t_day"] option[value="0"]').attr('selected', 'selected');
		jQuery(htmlObject).find('select[name="t_month"] option[value="0"]').attr('selected', 'selected');
		jQuery(htmlObject).find('input[name="t_year"]').val('');
		jQuery(htmlObject).find('input[name="t_option"]').attr('checked', 'checked');
		jQuery(htmlObject).find('input[name="_place"]').val('');
		jQuery(htmlObject).find('input[name="_town"]').val('');
		jQuery(htmlObject).find('input[name="_state"]').val('');
		jQuery(htmlObject).find('input[name="_country"]').val('');
	},
	_eventsSetEditBlock:function(htmlObject, index){
		var self = this;
		var event = self.json.data.events[index];
		var fromChecked = (event.From.Day==null&&event.From.Month==null&&event.From.Year==null)?'checked':'';
		var toChecked = (event.To.Day==null&&event.To.Month==null&&event.To.Year==null)?'checked':'';
		jQuery(htmlObject).find('input[value="'+event.DateType+'"]').click();
		jQuery(htmlObject).find('input[type="button"][value="Delete"]').show();
		jQuery(htmlObject).find('select[name="type"] option[value="'+event.Name.toLowerCase()+'"]').attr('selected', 'selected');
		jQuery(htmlObject).find('select[name="f_day"] option[value="'+((event.From.Day!=null)?event.From.Day:'0')+'"]').attr('selected', 'selected');
		jQuery(htmlObject).find('select[name="f_month"] option[value="'+((event.From.Month!=null)?event.From.Month:'0')+'"]').attr('selected', 'selected');
		jQuery(htmlObject).find('input[name="f_year"]').val((event.From.Year!=null)?event.From.Year:'');
		jQuery(htmlObject).find('input[name="f_option"]').attr('checked', fromChecked);
		jQuery(htmlObject).find('select[name="t_day"] option[value="'+((event.To.Day!=null)?event.To.Day:'0')+'"]').attr('selected', 'selected');
		jQuery(htmlObject).find('select[name="t_month"] option[value="'+((event.To.Month!=null)?event.To.Month:'0')+'"]').attr('selected', 'selected');
		jQuery(htmlObject).find('input[name="t_year"]').val((event.To.Year!=null)?event.To.Year:'');
		jQuery(htmlObject).find('input[name="t_option"]').attr('checked', toChecked);
		jQuery(htmlObject).find('input[name="_place"]').val((event.Place)?event.Place.Name:'');
		jQuery(htmlObject).find('input[name="_town"]').val((event.Place.Locations.length!=0&&event.Place.Locations[0].City!=null)?event.Place.Locations[0].City:'');
		jQuery(htmlObject).find('input[name="_state"]').val((event.Place.Locations.length!=0&&event.Place.Locations[0].State!=null)?event.Place.Locations[0].State:'');
		jQuery(htmlObject).find('input[name="_country"]').val((event.Place.Locations.length!=0&&event.Place.Locations[0].Country!=null)?event.Place.Locations[0].Country:'');
	},
	_eventsHeaderEvents:function(htmlObject){
		var self = this;
		jQuery(htmlObject).find('.jmb-dialog-events-header span').click(function(){
			jQuery(htmlObject).find('.jmb-dialog-events-list').hide();
			self._eventsSetDefaultEditBlock(htmlObject);
			jQuery(htmlObject).find('input[type="button"][value="Delete"]').hide();
			jQuery(htmlObject).find('.jmb-dialog-events-edit').show();
			self.parent._ajaxForm(jQuery(htmlObject).find('form'), 'createEvent', self.json.data.indiv.Id, function(res){}, function(json){
				var sb, e, li, liDivs;
				sb = host.stringBuffer();
				e = json.event;
				self.json.data.events.push(e);
				sb._('<li id="')._(self.json.data.events.length-1)._('"><div id="edit" class="button"><span>Edit</span></div><div id="delete" class="button">&nbsp;</div><div id="switch" class="text">')._(self.parent._getEventLine(data, e))._('</div></li>');
				li = jQuery(sb.result());
				jQuery(htmlObject).find('.jmb-dialog-events-list ul').append(li);
				liDivs = jQuery(li).find('div').each(function(i,e){
					jQuery(e).click(function(){
						self._eventsListLiDivSetEvent(htmlObject, this);
					});
				});	
			});
		});
	},
	_eventsEditEvents:function(htmlObject){	
		var self = this;
		var sb = host.stringBuffer();
		jQuery(htmlObject).find('.jmb-dialog-events-edit-buttons input').each(function(i,e){
			jQuery(e).click(function(){
				switch(jQuery(this).val()){
					case "Delete":
						var object = self.eventObject;
						var index = jQuery(object).parent().attr('id');
						var event_id = self.json.data.events[index].Id;
						self._eventsDeleteObject(htmlObject, object, event_id);
					case "Close":
						jQuery(htmlObject).find('.jmb-dialog-events-edit').hide();
						jQuery(htmlObject).find('.jmb-dialog-events-list').show();
						self._eventsSetDefaultEditBlock(htmlObject);
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
			jQuery(htmlObject).find('tr#end_date').hide();
			if(type=='EVO'){
				jQuery(htmlObject).find('tr#date').show();
			} else {
				jQuery(htmlObject).find('tr#date').show();
				jQuery(htmlObject).find('tr#end_date').show();
			}
			var types = (type=='EVO')?self.singleDayEvents:self.prolongedEvents;
			jQuery(types).each(function(i,e){
				sb.clear()._('<option value="')._(e.name)._('">')._(e.title)._('</option>');
				jQuery(htmlObject).find('select[name="type"]').append(sb.result())
			});
		});
	},
	_eventsListLiDivSetEvent:function(htmlObject, object){
		var self = this;
		self.binds.push(object);
		var index = jQuery(object).parent().attr('id');
		var event_id = (index)?self.json.data.events[index].Id:null;
		switch(jQuery(object).attr('id')){
			case "edit":
				if(!jQuery(object).parent().hasClass('active')) return;
				jQuery(htmlObject).find('.jmb-dialog-events-list').hide();
				jQuery(htmlObject).find('.jmb-dialog-events-edit').show();
				self._eventsSetEditBlock(htmlObject, index);
				self.eventObject = object;
				self.parent._ajaxForm(jQuery(htmlObject).find('form'), 'updateEvent', event_id, function(res){}, function(json){
					self.json.data.events[index] = json.event;
					var swithText = self.parent._getEventLine(self.json.data, json.event)
					jQuery(htmlObject).find('li#'+index+' div.text').html(swithText);
				});
			break;
			
			case "delete":
				if(!jQuery(object).parent().hasClass('active')) return;
				self._eventsDeleteObject(htmlObject, object, event_id);
			break;
					
			case "switch":
				if(jQuery(object).parent().hasClass('active')) return;
				jQuery('div.jmb-dialog-events-list ul li').removeClass('active');
				jQuery(object).parent().addClass('active');
			break;
		}
	},
	_eventsListEvents:function(htmlObject){
		var self = this;
		jQuery(htmlObject).find('div.jmb-dialog-events-list ul li div').each(function(i,e){
			jQuery(e).click(function(){
				self._eventsListLiDivSetEvent(htmlObject, this);
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
		jQuery(self.parent.dWindow).find('div.jmb-dialog-profile-content').append(htmlObject);
	},
	_photosClick:function(object, htmlObject, data){
		jQuery(htmlObject).find('div.list-item').removeClass('active');
		jQuery(object).addClass('active');
		jQuery(htmlObject).find('input#set,input#unset').hide();
		var id = jQuery(object).parent().attr('id');
		var inputId = (id==data.avatar.Id)?'unset':'set';
		jQuery('input#'+inputId).show();
	},
	_photos:function(){
		var self = this;
		var data = self.json.data;
		var sb = host.stringBuffer();
			sb._('<div class="jmb-dialog-photos-content">');
				sb._('<div class="buttons"><form id="jmb:profile:photos" method="post" target="iframe-profile"><input name="upload" type="file"><input type="submit" value="Send"></form><div class="switch-avatar"><input id="set" type="button" value="Set Avatar" style="display:none;" ><input id="unset" type="button" value="Unset Avatar" style="display:none;"></div></div>');
				sb._('<div class="list">');
					sb._('<ul>');
						jQuery(data.photo).each(function(i,e){
							sb._('<li id="')._(e.Id)._('">') 
								sb._('<div class="list-item">');
									sb._('<div class="header"><span>')._('120.04KB')._('</span><div class="delete">&nbsp;</div></div>');
									sb._('<div class="item">')._(self.parent._getImage(e, 100,100))._('</div>');
								sb._('</div>');
							sb._('</li>');
						});
					sb._('</ul>');
				sb._('</div>');
			sb._('</div>');
		var htmlObject = jQuery(sb.result());
		jQuery(htmlObject).find('div.delete').click(function(){
			var li = jQuery(this).parent().parent().parent()
			var id = jQuery(li).attr('id');
			if(data.avatar&&id == data.avatar.Id&&!confirm('This image is the avatar you sure you want to remove it?')){
				return false;
			}
			self.parent._ajax('deletePhoto', id, function(res){
				jQuery(li).remove();
			})
		});
		jQuery(htmlObject).find('div.list-item').click(function(){
			//self._photosClick(this, htmlObject, data);
		});
		self.parent._ajaxForm(jQuery(htmlObject).find('form'), 'uploadPhoto', data.indiv.Id, function(res){}, function(json){
			sb.clear()._('<li id="')._(json.Id)._('">') 
				sb._('<div class="list-item">');
					sb._('<div class="header"><span>')._('120.04KB')._('</span><div class="delete">&nbsp;</div></div>');
					sb._('<div class="item">')._(self.parent._getImage(json, 100,100))._('</div>');
				sb._('</div>');
			sb._('</li>');
			var li = jQuery(sb.result());
			jQuery(htmlObject).find('ul').append(li);
			jQuery(li).find('div.list-item').click(function(){
				self._photosClick(this, htmlObject, data);
			});
		});
		jQuery(self.parent.dWindow).find('div.jmb-dialog-profile-content').append(htmlObject);
	},
	_getTimeLine:function(object){
		var self = this,
			sb = host.stringBuffer(),
			events = object.events;
		events.sort(function(a, b) { 
			return a.From.Year - b.From.Year;
		})
		sb._('<ul>');
			jQuery(events).each(function(i, event){
				sb._('<li>')._(self.parent._getEventLine(object, event))._('</li>');
			});
		sb._('</ul>');		
		return sb.result();
	},
	_vprofile:function(){
		var self = this;
		var sb = host.stringBuffer();
		var object = self.json.data;
		sb._('<div class="jmb-dialog-view-profile">');
			sb._('<div class="jmb-dialog-view-profile-content">')
			sb._('<table>');
				sb._('<tr>');
					sb._('<td><div class="jmb-dialog-photo">')._(self.parent._getAvatar(object, 135, 150))._('</div></td>');
					sb._('<td valign="top">');
						sb._('<table style="margin-top: 10px;">');
							sb._('<tr>');
								sb._('<td><div class="title"><span>Full Name:</span></div></td>');
								sb._('<td><div id="full_name" class="text"><span>')._(self.parent._getFullName(object.indiv))._('</span></div></td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td><div class="title"><span>Know As:</span></div></td>');
								sb._('<td><div id="know_as" class="text"><span>')._(self.parent._getKnowAs(object.indiv))._('</span></div></td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td><div class="title"><span>Birthday:</span></div></td>');
								var birth = (object.indiv.Birth)?object.indiv.Birth[0]:false;
								sb._('<td><div id="birthday" class="text"><span>')._(self.parent._getEventDate(birth))._('</span></div></td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td><div class="title"><span>Birthplace:</span></div></td>');
								var birthplace = (birth)?self.parent._getFullPlace(birth.Place):'';								
								sb._('<td><div id="birthplace" class="text"><span>')._((birthplace)?birthplace:'')._('</span></div></td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td><div class="title"><span>Relation:</span></div></td>');
								sb._('<td><div id="relation" class="text"><span>')._(self.parent._getRelation(self.json))._('</span></div></td>');
							sb._('</tr>');
						sb._('</table>');
					sb._('</td>');
				sb._('</tr>');
				sb._('<tr>');
					sb._('<td colspan="2">');
						sb._('<div class="list">');
							sb._('<div class="list-header"><span>Time line:</span></div>');
								sb._(self._getTimeLine(object));
						sb._('</div>')
					sb._('</td>');
				sb._('</tr>');
			sb._('</table>');
			sb._('</div>');
		sb._('</div>');
		var html = sb.result();
		var htmlObject = jQuery(html);
		jQuery(self.parent.dWindow).find('div.jmb-dialog-profile-content').append(htmlObject);
	},
	_firstCharToUpper:function(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	_menu:function(object, type){
		var self = this;
		var sb = host.stringBuffer();
		var divMenu = jQuery(object).find('.jmb-dialog-profile-menu-container');
		for(var key in self.menu[type]){
			sb._('<div id="')._(key)._('" class="jmb-dialog-profile-menu-item-parent"><span>')._(self.menu[type][key])._('</span></div>');
		}
		jQuery(self.activeMenu).find('div.jmb-dialog-profile-menu-item-parent').unbind();
		jQuery(self.activeMenu).remove();
		var html = sb.result();
		var htmlObject = jQuery(html);
		self.activeMenu = htmlObject;
		jQuery(divMenu).append(htmlObject);
		return divMenu;
	},
	_setMenuItem:function(id){
		var self = this;
		switch(id){
			case "basic": self._basic(); break;
			case "unions": self._unions(); break;
			case "events": self._events(); break;
			case "photos": self._photos(); break;
			case "vprofile": self._vprofile(); break;
		}
	},
	_mode:function(type){
		var self = this;
		var object = self.parent.dContent.object;
		var menu = self._menu(object, type);
		jQuery(menu).find('div.jmb-dialog-profile-menu-item-parent').click(function(){
			if(jQuery(this).hasClass('active')) return;
			if(self.menuActiveItem) jQuery(self.menuActiveItem).removeClass('active');
			var id = jQuery(this).attr('id');
			jQuery(this).addClass('active');
			jQuery(object).find('div.jmb-dialog-profile-content').html('');
			self._setMenuItem(id);
			self.menuActiveItem = this;
		});
		var item = (type=='edit')?'div#basic':'div#vprofile';
		jQuery(menu).find(item).click();
	},	
	_headerButton:function(b, callback){
		jQuery(b).find('div[type="button"]').click(function(){
			if(jQuery(this).hasClass('active')) return false;
			jQuery(b).find('.active').removeClass('active');
			jQuery(this).addClass('active');	
			callback(this);
		});
	},
	_container:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div class="jmb-editor-container">');
			sb._('<table>');
				sb._('<tr><td valign="top" style="width:150px;"><div class="jmb-dialog-profile-menu-container"></div></td><td valign="top"><div class="jmb-dialog-profile-content"></div></td></tr>');
			sb._('</table>');
		sb._('</div>');
		return sb.result();
	},
	render:function(p){
		var self = this;
		self.json = p;
		if(!self.parent.imgPath) self.parent.imgPath = p.imgPath;
		self.parent._dialog({
			title:self.parent._getFullName(self.json.data.indiv),
			height: 450,
		});
		jQuery('.jmb-dialog-container').css({
			background:"white",
			border:"none"
		});
		//set button edt\view
		var buttons = jQuery('<div class="jmb-dialog-interface-button"><div type="button" value="edit"><span>Edit</span></div><div value="view" type="button" class="active"><span>View</span></div></div>');
		jQuery(self.parent.dWindow).parent().find('.ui-dialog-titlebar').append(buttons);	
		
		var html = self._container();
		self.parent.dContent.object = jQuery(html);
		self.parent.dContent.flag = true;
		jQuery(self.parent.dWindow).append(self.parent.dContent.object);
		
		self._headerButton(buttons, function(object){
				var val = jQuery(object).attr('value');
				switch(val){
					case "edit": self._mode("edit"); break;
					case "view": self._mode("view"); break;
				}
		});
		self._mode("view");
		
	}
}
