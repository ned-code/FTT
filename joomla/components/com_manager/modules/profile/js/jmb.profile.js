function JMBProfile(){
	var self = this;
	//form flags
	this.living = true;
	this.deathObject = null;
	this.saved = false;
	this.savedObject = null;
	
	//global objects
	this.json = {};
	this.imgPath = null;
	this.month3 = {'1':'Jan', '2':'Feb', '3':'Mar', '4':'Apr', '5':'May', '6':'Jun', '7':'Jul', '8':'Aug', '9':'Sep', '10':'Oct', '11':'Nov', '12':'Dec'};
	this.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	
	//dialog objects window container and content conteiner
	this.dWindow = jQuery('<div id="jmb:dialog" class="jmb-dialog-container"></div>');
	this.dContent = {
		flag:false,
		object:null
	};
	jQuery(this.dWindow).hide();
	jQuery(document.body).append(this.dWindow);
	
	//modal object
	this.modalActive = false;
	this.modalObject = jQuery('<div id="jmb:modal" class="jmb-modal-container">');
	jQuery(this.modalObject).css({
		position: "absolute",
		top: "0px",
		left: "0px",
		width: jQuery(window).width()+"px",
		height: jQuery(window).height()+"px"
	});
	jQuery(this.modalObject).css('z-index', '1000');
	jQuery(this.modalObject).hide();
	jQuery(document.body).append(this.modalObject);
	jQuery(window).resize(function(){
		if(self.modalActive){
			jQuery(self.modalObject).css({
				width: jQuery(window).width()+"px",
				height: jQuery(window).height()+"px"
			});
		}
	});
	
	//sub objects
	this.tooltip = new JMBProfileTooltip(this);
	this.profile = new JMBProfileFull(this);

	if(jQuery("#iframe-profile").length==0){
		var iframe = '<iframe id="iframe-profile" name="#iframe-profile" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">';
		jQuery(document.body).append(iframe);
	}
}

JMBProfile.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("profile", "JMBProfile", func, params, function(res){
			callback(res);
		});
	},
	_ajaxForm:function(obj, method, args, beforeSubmit, success){
		var sb = host.stringBuffer();
		var url = sb._('index.php?option=com_manager&task=callMethod&module=profile&class=JMBProfile&method=')._(method)._('&args=')._(args).result();
		jQuery(obj).ajaxForm({
			url:url,
			dataType:"json",
			target:"#iframe-profile",
			beforeSubmit:function(){
				return beforeSubmit();	
			},
			success:function(data){
				success(data);
			}
		});
	},
	cleaner:function(){
		var self = this;
		self.tooltip.cleaner();
		self.profile.cleaner();
		jQuery(self.dWindow).remove();
		jQuery(self.modalObject).remove();
		jQuery("#iframe-profile").remove();
	},
	_modal:function(flag){
		var self = this;
		if(flag){
			jQuery(self.modalObject).show();
		}
		else{
			jQuery(self.modalObject).hide();
		}
		self.modalActive = flag;
	},
	_dialog:function(params){
		var self = this;
		if(!params) params = {};
		var pDefault = {
			width:700,
			height:500,
			resizable: false,
			draggable: false,
			position: "top",
			closeOnEscape: false,
			//open: function(event, ui) { jQuery(".ui-dialog-titlebar-close").hide(); },
			beforeClose: function(event, ui){
				self._modal(false);
				self.profile.menuActiveItem = null;
				if(typeof(self.json.beforeClose) == 'function') self.json.beforeClose();
			}
		}
		jQuery.extend(pDefault, params);
		self._modal(true);
		if(self.dContent.flag){ 
			jQuery(self.dContent.object).remove();
			self.dContent.object = null;
			self.dContent.flag = false;
		}
		jQuery(self.dWindow).dialog("destroy");
		jQuery(self.dWindow).dialog(pDefault);
		jQuery(self.dWindow).parent().css('top', '10px');
	},
	_getYear:function(indiv){
		if(indiv.Birth){ return indiv.Birth[0].From.Year; }
		return '';
	},
	_getKnowAs:function(indiv){
		return indiv.Nick;
	},
	_getFullName:function(ind){
		var sb = host.stringBuffer();
		var f,l,m, result;
		f = ind.FirstName;
		m = ind.MiddleName;
		l = ind.LastName;
		if(f!=''&&m!=''&&l!=''){
			return sb._(f)._(' ')._(m)._(' ')._(l).result();
		}
		else if(f!=''&&m==''&&l!=''){
			return sb._(f)._(' ')._(l).result();
		}
		else if(f==''&&m==''&&l!=''){
			return l;
		}
		else if(f==''&&m!=''&&l==''){
			return f;
		}
	},
	//NEED TO EDIT!!!!!!
	_getFullPlace:function(location){
		if(!location) return;
		var sb = host.stringBuffer();
		var places = location.Hierarchy;
		jQuery(places).each(function(i,e){
			sb._(e.Name)._(' ');
		});
		return sb.result();
	},
	_getEventDate:function(event){
		var self = this;
		if(!event) return;
		var sb = host.stringBuffer();
		var d,m,y;
		d = event.From.Day;
		m = (event.From.Month!='')?self.month3[event.From.Month]:'';
		y = event.From.Year;
		if(d!=''&&m!=''&&y!=''){
			return sb._(d)._(' ')._(m)._(' ')._(y).result();
		}
		else if(d!=''&&m==''&&y!=''){
			return y;
		}
		else if(d==''&&m==''&&y!=''){
			return y;
		}
		else if(d==''&&m!=''&&y!=''){
			return sb._(m)._(' ')._(y).result();
		}
		else if(d!=''&&m!=''&&y==''){
			return sb._(d)._(' ')._(m).result();
		}
		else {
			return 'unknown';
		}
	},
	_getRelation_:function(id, data, ret){
		for(var a in data){
			if(data[a].id==id) return ret;
		}
		return 0;
	},
	_getRelation:function(obj){
		var self = this;
		var id = obj.fmbUser.indiv.Id;
		//parent;
		if(obj.data.parents){
			var p = obj.data.parents;
			if(p.fatherID==id||p.motherID==id){
				return 'Child';
			}
		}
		//spouse;
		var spouse = self._getRelation_(id, obj.data.spouses, 'Spouse')
		if(spouse != 0){
			return spouse;
		}
		//child;
		var parent = self._getRelation_(id, obj.data.children, 'Parent')
		if(parent != 0){
			return parent;
		}
		return 0;
	},
	_getSpouseAvatar:function(obj, x, y){
		var self = this;
		var sb = host.stringBuffer();
		var fId,av,defImg;
		fId = obj.indiv.FacebookId;
		av = obj.avatar;
		defImg = (obj.indiv.Gender=="F")?'male.gif':'female.gif';
		var defImgPath = sb._(self.imgPath)._('/components/com_manager/modules/profile/image/')._(defImg).result();
		return sb.clear()._('<img class="jmb-families-avatar" height="')._(y)._('px" width="')._(x)._('px" src="')._(defImgPath)._('">').result()
	},
	_getPhoto:function(obj, x,y){
		var self = this;
		var sb = host.stringBuffer();
		return sb._('<img class="jmb-families-avatar" height="')._(y)._('px" width="')._(x)._('px" src="index.php?option=com_manager&task=getResizeImage&id=')._(obj.photo)._('">').result();
	},
	_getAvatar:function(obj, x, y){
		var self = this;
		var sb = host.stringBuffer();
		var fId,av,defImg;
		fId = obj.indiv.FacebookId;
		av = obj.avatar;
		defImg = (obj.indiv.Gender=="M")?'male.gif':'female.gif';
		if(av != null && av.FilePath != null){
			//return sb.clear()._('<img height="')._(y)._('px" width="')._(x)._('px" src="')._(av.FilePath)._('">').result();
			return sb._('<img class="jmb-families-avatar" height="')._(y)._('px" width="')._(x)._('px" src="index.php?option=com_manager&task=getResizeImage&id=')._(av.Id)._('">').result();
		}
		else if(fId != '0'){
			return sb.clear()._('<img height="')._(y)._('px" width="')._(x)._('px" src="http://graph.facebook.com/')._(fId)._('/picture">').result();
		}
		var defImgPath = sb.clear()._(self.imgPath)._('/components/com_manager/modules/profile/image/')._(defImg).result();
		return sb.clear()._('<img class="jmb-families-avatar" height="')._(y)._('px" width="')._(x)._('px" src="')._(defImgPath)._('">').result();
	},
	_getAvatar2:function(x, y, type){
		var self = this;
		var sb = host.stringBuffer();
		defImg =(type=="M")?'male.gif':'female.gif';
		defImgPath = sb._(self.imgPath)._("/components/com_manager/modules/profile/image/")._(defImg).result();
		return  sb.clear()._('<img class="jmb-families-avatar" height="')._(y)._('px" width="')._(x)._('px" src="')._(defImgPath)._('">').result();
	},
	_photos:function(p){
		var self = this;
		var sb = host.stringBuffer();
		var length = jQuery(p).length;
		sb._('<ul style="width:')._(64*length)._('px;">');
			jQuery(p).each(function(i,e){
				//sb._('<li><img height="65px" width="59" src="')._(e.FilePath)._('"></li>');
				sb._('<li><img height="65px" width="59" src="index.php?option=com_manager&task=getResizeImage&id=')._(e.Id)._('"></li>');
			});
		sb._('</ul>')
		return sb.result();
	},
	_selectDays:function(){
		var sb = host.stringBuffer();
		sb._('<option selected value="0">Day</option>');
		for(var i=1;i<=31;i++){
			sb._('<option value="')._(i)._('">')._(i)._('</option>');
		}
		return sb.result();
	},
	_selectMonths:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<option selected value="0">Month</option>');
		var months = self.months;
		for(var i=0;i<months.length;i++){
			sb._('<option value="')._(i+1)._('">')._(months[i])._('</option>');
		}
		return sb.result();
	},
	_getEventPart:function(t){
		var self = this;
		var name = (t=='b_')?'Birth':'Death';
		var sb = host.stringBuffer();
		sb._('<tr>');
			sb._('<td valign="top" style="width:100px;text-align:right;padding-top:5px;"><span>')._(name)._('day:</span></td>');
			sb._('<td style="text-align: left;"><select name="')._(t)._('day">')._(self._selectDays())._('</select><select name="')._(t)._('month">')._(self._selectMonths())._('</select><input name="')._(t)._('year" type="text" style="width:40px;" maxlength="4" placeholder="Year"><input name="')._(t)._('option" type="checkbox"> Unknown</td>');
		sb._('</tr>');
		sb._('<tr>');
			sb._('<td valign="top" style="width:100px;text-align:right;padding-top:5px;"><span>')._(name)._('place:</span></td>');
			sb._('<td style="text-align: left;"><input name="')._(t)._('town" type="text" placeholder="Town/City"><input name="')._(t)._('state" type="text" placeholder="Prov/State"><input name="')._('country" type="text" placeholder="Country"></td>')
		sb._('</tr>');
		return sb.result();
	},
	_formBasicFields:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<table id="basic_fields">');
			sb._('<tr>');
				sb._('<td style="width:100px;text-align:right;"><font color="#ff0000">*</font><span>First name:</span></td>');
				sb._('<td style="text-align: left;"><input name="first_name" type="text"></td>');
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td style="width:100px;text-align:right;"><span>Middle names:</span></td>');
				sb._('<td style="text-align: left;"><input name="middle_name" type="text"></td>');
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td style="width:100px;text-align:right;"><span>Last name:</span></td>');
				sb._('<td style="text-align: left;"><input name="last_name" type="text"></td>');
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td style="width:100px;text-align:right;padding-top:5px;"><span>Know as:</span></td>');
				sb._('<td style="text-align: left;"><input name="know_as" type="text"></td>');
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td style="width:100px;text-align:right;padding-top:5px;"><font color="#ff0000">*</font><span>Gender:</span></td>');
				sb._('<td class="jmb-dialog-form-gender" style="text-align: left;">&nbsp;<span type="M">Male</span>:<input name="gender" value="M" type="radio" style="position:relative; top:3px;">&nbsp;<span type="F">Female</span>:<input name="gender" value="F" type="radio" style="position:relative; top:3px;"></td>');
			sb._('</tr>');
			sb._(self._getEventPart('b_'));
			sb._('<tr>');
				sb._('<td style="width:100px;text-align:right;"><font color="#ff0000">*</font><span>Living:</span></td>');
				sb._('<td style="text-align: left;"><select name="living"><option selected value="true">Yes</option><option value="false">No</option></select></td>');
			sb._('</tr>');
		sb._('</table>');
		sb._('<div class="jmb-dialog-button-submit"><input type="submit" value="Save"><input type="button" value="Cancel"></div>');
		return sb.result();
	},
	_formUnionEventFields:function(){
		var self = this;
		var sb = host.stringBuffer();
		sb._('<table>');
			sb._('<tr>');
				sb._('<td><span>Type:</span></td>');
				sb._('<td style="text-align: left;"><select name="m_type"><option value="MARR">Marriage</option></select></td>');
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td><span>Date:</span></td>');
				sb._('<td style="text-align: left;"><select name="m_day">')._(self._selectDays())._('</select><select name="m_month">')._(self._selectMonths())._('</select><input placeholder="Year" name="m_year" type="text" maxlength="4" style="width:50px;"><input name="m_option" type="checkbox"> Unknown</td>')
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td><span>Place:</span></td>');
				sb._('<td style="text-align: left;"><input placeholder="Town/City" name="m_town" style="width:100px;" type="text"><input style="width:100px;" placeholder="Prov/State" name="m_state" type="text"><input style="width:100px;" placeholder="Country" name="m_country" type="text"></td>');
			sb._('</tr>');
			sb._('<tr>');
				sb._('<td></td>');
				sb._('<td style="text-align: left;"><input name="deceased" type="checkbox" style="position:relative; top:3px;">&nbsp;Divorced/Separated&nbsp;<input placeholder="Year" name="s_year" type="text" style="width:40px;" maxlength="4"></td></td>');
			sb._('</tr>');
		sb._('</table>');
		return sb.result();
	},
	_valid:function(obj, i, p){
		switch(i){
			case "date":
				if(jQuery(obj).find('select[name="'+p.prefix+'day"] ').length==0) return true;
				if(jQuery(obj).find('input[name="'+p.prefix+'option"]').attr('checked')) return true;
				var day = jQuery(obj).find('select[name="'+p.prefix+'day"] option:selected').val();
				var month = jQuery(obj).find('select[name="'+p.prefix+'month"] option:selected').val();
				var year = jQuery(obj).find('input[name="'+p.prefix+'year"]').val();
				var d = new Date(year, month-1, day);
				if(d.getDate()!=day){
					return false;
				}
				return true;
			break;
			
			case "firstName":
				var firstName = jQuery(obj).find('input[name="first_name"]').val();
				if(firstName==''){
					return false;
				}
				return true;
			break;
			
			case "photo":
				var photo = jQuery(obj).find('div.jmb-dialog-photo-button input#photo').val().split('.');
				if(photo[1]){
					if(photo[1]=='jpg'||photo[1]=='gif'||photo[1]=='jpeg'||photo[1]=='png'){}
					else{
						return false;
					}
				}	
				return true;
			break;
		}
	},
	_buttonCancel:function(obj){
		var self = this;
		jQuery(obj).find('div.jmb-dialog-button-submit input[value="Cancel"]').click(function(){
			if(!self.saved){
				if(confirm('You did not save your changes. Do you wish to cancel?')){
					jQuery(self.dWindow).dialog("close");
					self._modal(false);
				}
			}
			if(typeof(callback)!='undefined') callback();
		});
	},
	_buttonUploadPhoto:function(obj, callback){
		var self = this;
		jQuery(obj).find('div.jmb-dialog-photo-button input#photo').bind('change focus click', function(){
			var object = jQuery(this);
			var valArray = jQuery(object).val().split('\\');
			jQuery('div.jmb-dialog-photo-context').html(valArray[2]);
			if(typeof(callback)!='undefined') callback();
		});
	},
	_buttonLiving:function(obj, callback){
		var self = this;
		jQuery(obj).find('select[name="living"]').change(function(){
			var v = jQuery(this).val();
			var table = jQuery(obj).find('table#basic_fields');
			if(v=='true'){
				if(!self.living){
					self.living = true;
					jQuery(self.deathObject).remove();
					self.deathObject = null;
				}
			} else {
				self.living = false;
				self.deathObject = jQuery(self._getEventPart('d_'));
				jQuery(table[0]).append(self.deathObject);
			}
			if(typeof(callback)!='undefined') callback();
		});
	},
	_buttonsGender:function(obj, callback){
		var self = this;
		jQuery(obj).find('.jmb-dialog-form-gender input').click(function(){
			var gender = (jQuery(this).attr('value')=="M")?"M":"F";	
			jQuery(obj).find('.jmb-dialog-photo').html(self._getAvatar2(135, 150, gender));
			if(typeof(callback)!='undefined') callback();
		});
		jQuery(obj).find('.jmb-dialog-form-gender span').click(function(){
			var type = jQuery(this).attr('type');
			jQuery(obj).find('.jmb-dialog-form-gender input[value="'+type+'"]').attr('checked', true);
			jQuery(obj).find('.jmb-dialog-photo').html(self._getAvatar2(135, 150, type));
			if(typeof(callback)!='undefined') callback();
		});
	},
	_convertDateNumeric:function(d){
		return (d[0]=='0')?d[1]:d;
	},
	//NEED TO EDIT!!!!!!!
	_setData:function(target, object){
		var self = this;
		jQuery(target).find('input[name="first_name"]').val(object.indiv.FirstName);
		jQuery(target).find('input[name="middle_name"]').val(object.indiv.MiddleName);
		jQuery(target).find('input[name="last_name"]').val(object.indiv.LastName);
		jQuery(target).find('input[name="know_as"]').val(object.indiv.Nick);
		jQuery(target).find('.jmb-dialog-form-gender input[value="'+object.indiv.Gender+'"]').attr('checked', true);
		if(object.indiv.Birth){
			jQuery(target).find('select[name="b_day"] option[value="'+self._convertDateNumeric(object.indiv.Birth[0].From.Day)+'"]').attr('selected', 'selected');
			jQuery(target).find('select[name="b_month"] option[value="'+self._convertDateNumeric(object.indiv.Birth[0].From.Month)+'"]').attr('selected', 'selected');
			jQuery(target).find('input[name="b_year"]').val(object.indiv.Birth[0].From.Year);
			//var place = object.indiv.Birth.Place
			//if(place.Hierarchy[2]) jQuery(target).find('input[name="b_town"]').val(place.Hierarchy[2].Name);
			//if(place.Hierarchy[1]) jQuery(target).find('input[name="b_state"]').val(place.Hierarchy[1].Name);
			//if(place.Hierarchy[0]) jQuery(target).find('input[name="b_country"]').val(place.Hierarchy[0].Name);
		}
		if(object.Death){
			jQuery(target).find('select[name="living"] option[value="false"]').attr('selected', 'selected');
			jQuery(target).find('select[name="living"] option[value="false"]').change();
			jQuery(target).find('select[name="d_day"] option[value="'+self._convertDateNumeric(object.indiv.Death[0].From.Day)+'"]').attr('selected', 'selected');
			jQuery(target).find('select[name="d_month"] option[value="'+self._convertDateNumeric(object.indiv.Death[0].From.Month)+'"]').attr('selected', 'selected');
			jQuery(target).find('input[name="d_year"]').val(object.indiv.Death[0].From.Year);
			//var place = object.indiv.Death.Place;
			//if(place.Hierarchy[2]) jQuery(target).find('input[name="d_town"]').val(place.Hierarchy[2].Name);
			//if(place.Hierarchy[1]) jQuery(target).find('input[name="d_state"]').val(place.Hierarchy[1].Name);
			//if(place.Hierarchy[0]) jQuery(target).find('input[name="d_country"]').val(place.Hierarchy[0].Name);
		}
	},
	//NEED TO EDIT!!!!!!
	_setUnionData:function(target, object){
		var self = this;
		jQuery(object.event).each(function(i,event){
			if(!event.Type) return;
			if(event.Type == 'MARR'){
				jQuery(target).find('select[name="m_day"] option[value="'+self._convertDateNumeric(event.From.Day)+'"]').attr('selected', 'selected');
				jQuery(target).find('select[name="m_month"] option[value="'+self._convertDateNumeric(event.From.Month)+'"]').attr('selected', 'selected');
				jQuery(target).find('input[name="m_year"]').val(event.From.Year);
				//jQuery(target).find('input[name="m_town"]').val(event.Place.Hierarchy[2].Name);
				//jQuery(target).find('input[name="m_state"]').val(event.Place.Hierarchy[1].Name);
				//jQuery(target).find('input[name="m_country"]').val(event.Place.Hierarchy[0].Name);
			} else if(event.Type == 'DIV'){
				jQuery(target).find('input[name="deceased"]').attr('checked', 'checked');
				jQuery(target).find('input[name="s_year"]').val(event.From.Year);
			}
			
		});
	},
	_addPSC:function(p, type){
		var self = this;
		var sb = host.stringBuffer();
		var title;
		if(type=="parent") title = "Parent";
		else if(type=="bs") title = "Brother or Sister";
		else if(type=="child") title = "Child";
		self._dialog({
			title:'Add '+title,
			height: 360
		});		
		sb._('<div class="jmb-dialog-content"><form id="jmb:profile:addpsc" method="post" target="iframe-profile">');
			sb._('<table style="width:100%;"><tr>');
				sb._('<td valign="top">');
					sb._('<div class="jmb-dialog-photo">')._(self._getAvatar2(135, 150, "M"))._('</div>');
					sb._('<div class="jmb-dialog-photo-button">');
						sb._('<span class="jmb-dialog-photo-button-wrapper">');
							sb._('<input type="file" name="photo" id="photo" />');
							sb._('<span class="jmb-dialog-photo-button2">Upload Photo</span>');
							sb._('<div class="jmb-dialog-photo-context"></div>');
						sb._('</span>');
					sb._('</div>');
				sb._('</td>');
				sb._('<td valign="top">');
					sb._(self._formBasicFields());
				sb._('</td>');
			sb._('</tr></table>');
			sb._('<div class="jmb-dialog-button-switch">Switch to full profile</div>');
		sb._('</form></div>');
		var html = sb.result();
		self.dContent.object = jQuery(html);
		self.dContent.flag = true;
		jQuery('.jmb-dialog-container').css({
			background:"#9a7423",
			border:"1px solid #694c10"
		})
		//events
		self._buttonUploadPhoto(self.dContent.object);
		self._buttonCancel(self.dContent.object);
		self._buttonLiving(self.dContent.object);
		self._buttonsGender(self.dContent.object);
		
		//ajaxForm
		var args = type+';'+p.data.indiv.Id;
		self._ajaxForm(jQuery(self.dContent.object).find('form'), 'addPSC', args, 
		function(res){
 			if(!self._valid(self.dContent.object, 'date', {prefix:'b_'})){
 				alert('Incorrect Birth date.');
 				return false;
 			}
 			if(!self._valid(self.dContent.object, 'date', {prefix:'d_'})){
 				alert('Incorrect Death date.');
 				return false;
 			}
 			if(!self._valid(self.dContent.object, 'firstName', {})){
 				alert('Not set "First name".')
 				return false;
 			}
 			if(!self._valid(self.dContent.object, 'photo', {})){
 				alert('Incorrect image(try to use .jpg,.gif,.png).');
 				return false;
 			}
 			return true;
		}, function(json){
			if(json.photo) jQuery(self.dContent.object).find('.jmb-dialog-union-photo').html(self._getPhoto(json, 135, 150));
		});	
		//append
		jQuery(self.dContent.object).find('.jmb-dialog-form-gender input[value="M"]').attr('checked', true);
		jQuery(this.dWindow).append(this.dContent.object);
	},
	_addSpouse:function(p){
		var self = this;
		var sb = host.stringBuffer();
		self._dialog({
			title:'Add Spouse',
			height:640
		});
		sb._('<div class="jmb-dialog-union-content"><form id="jmb:profile:addspouse" method="post" target="iframe-profile">');
			sb._('<div>');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td valign="top">');
							sb._('<div class="jmb-dialog-union-spouse">');
								sb._('<div class="jmb-dialog-union-photo"><div>')._(self._getAvatar(p.data, 135, 150))._('</div></div>');
								sb._('<div class="jmb-dialog-union-photo-know">Know As ')._(self._getKnowAs(p.data.indiv))._('</div>');
								sb._('<div class="jmb-dialog-union-photo-year">Year ')._(self._getYear(p.data.indiv))._('</div>');
							sb._('</div>');
						sb._('</td>');
						sb._('<td valign="top">');
							sb._('<div class="jmb-dialog-union-profile">');
							sb._('<div class="jmb-dialog-union-profile">');
								sb._('<div class="jmb-dialog-union-profile-header">Profile Basics</div>');
								sb._('<div class="jmb-dialog-union-profile-content">');
									sb._('<table style="width:100%;"><tr>')
										sb._('<td valign="top">');
											sb._('<div class="jmb-dialog-union-photo"><div>')._(self._getSpouseAvatar(p.data, 135, 150))._('</div></div>');
											sb._('<div class="jmb-dialog-photo-button">');
												sb._('<span class="jmb-dialog-photo-button-wrapper">');
													sb._('<input type="file" name="photo" id="photo" />');
													sb._('<span class="jmb-dialog-photo-button2">Upload Photo</span>');
													sb._('<div class="jmb-dialog-photo-context"></div>');
												sb._('</span>');
											sb._('</div>');
										sb._('</td>');
										sb._('<td valign="top">');
											sb._(self._formBasicFields());
										sb._('</td>');
									sb._('</tr></table>');
								sb._('</div>');
							sb._('</div>')
						sb._('</td>');
					sb._('</tr>');
					sb._('<tr><td></td>');
						sb._('<td valign="top">');
							sb._('<div class="jmb-dialog-union-event">');
								sb._('<div class="jmb-dialog-union-event-header">Union</div>');
								sb._('<div class="jmb-dialog-union-event-content">');
									sb._(self._formUnionEventFields());
								sb._('</div>');
							sb._('</div>');
						sb._('</td>');
					sb._('</tr>');
				sb._('</table>');
			sb._('</div>');
		sb._('</form></div>');	
		var html = sb.result();
		self.dContent.object = jQuery(html);
		self.dContent.flag = true;
		jQuery('.jmb-dialog-container').css({
			background:"#7e7e7e",
			border:"1px solid #545454"
		})
		//hide gender fields
		jQuery(self.dContent.object).find('.jmb-dialog-form-gender').parent().remove();
		self._buttonCancel(self.dContent.object);
		self._buttonUploadPhoto(self.dContent.object);		
		self._buttonLiving(self.dContent.object);
		
		var args = p.data.indiv.Id+';'+p.data.indiv.Gender;
		self._ajaxForm(jQuery(self.dContent.object).find('form'), 'addSpouse', args, 
		function(res){
 			if(!self._valid(self.dContent.object, 'date', {prefix:'b_'})){
 				alert('Incorrect Birth date.');
 				return false;
 			}
 			if(!self._valid(self.dContent.object, 'date', {prefix:'d_'})){
 				alert('Incorrect Death date.');
 				return false;
 			}
 			if(!self._valid(self.dContent.object, 'date', {prefix:'m_'})){
 				alert('Incorrect Marrige date.');
 				return false;
 			}
 			if(!self._valid(self.dContent.object, 'firstName', {})){
 				alert('Not set "First name".')
 				return false;
 			}
 			if(!self._valid(self.dContent.object, 'photo', {})){
 				alert('Incorrect image(try to use .jpg,.gif,.png).');
 				return false;
 			}
 			return true;
		}, function(json){
			if(json.photo) jQuery(self.dContent.object).find('.jmb-dialog-photo').html(self._getPhoto(json, 135, 150));
		});	
		
		jQuery(this.dWindow).append(this.dContent.object);
	}
}
