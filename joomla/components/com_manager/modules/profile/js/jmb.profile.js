function JMBProfile(){
	var self = this;
	//form flags
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
	
	//sub objects
	this.tooltip = new JMBProfileTooltip(this);
	this.profile = new JMBProfileFull(this);
	this.media =  new JMBMediaManager(this);
	this.invitation =  new JMBEmailInvitation(this);

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
			modal:true,
			//open: function(event, ui) { jQuery(".ui-dialog-titlebar-close").hide(); },
			beforeClose: function(event, ui){
				self.profile.menuActiveItem = null;
				if(typeof(self.json.beforeClose) == 'function') self.json.beforeClose();
			},
			close:function(){
				jQuery(this).dialog("destroy");
				jQuery(this).remove();
			}
		}
		jQuery.extend(pDefault, params);
		if(self.dContent.flag){ 
			jQuery(self.dContent.object).remove();
			self.dContent.object = null;
			self.dContent.flag = false;
		}
		jQuery(self.dWindow).dialog("destroy");
		jQuery(self.dWindow).dialog(pDefault);
		jQuery(self.dWindow).parent().css('top', '10px');
	},
	_getPassedAwayAge:function(year){
		return (new Date()).getFullYear() - year;
	},
	_getSpouseNameByEventId:function(data, event){
		var self = this, spouses = data.spouses, id = event.Id;
		for(var i=0;i<spouses.length;i++){
			if(id == spouses[i].event[0].Id){
				return self._getName(spouses[i].indiv);
			}
		}
	},
	_getEventLine:function(data, event){		
		var self = this, sb = host.stringBuffer();
		var from = (event.From&&event.From.Year!=null)?event.From.Year:false;
		var to = (event.To&&event.To.Year!=null)?event.To.Year:false;
		var place = self._getFullPlace(event.Place);
		switch(event.Type){
			case "CHRI":			
				return sb._((from)?from:'')._((from)?': ':'')._('Christening')._((place)?' in ':'')._((place)?place:'').result();
			break;
			case "BIRT":			
				return sb._((from)?from:'')._((from)?': ':'')._('Born')._((place)?' in ':'')._((place)?place:'').result();
			break;
			case "DEAT":
				return sb._((from)?from:'')._((from)?': ':'')._('Passed away')._((from)?' as age ':'')._((from)?self._getPassedAwayAge(from):'').result();
			break;
			case "MARR":
				var name = (event.Name.length!=0)?event.Name.toLowerCase():'marriage';
				return sb._((from)?from:'')._((from)?': ':'')._('Entered into ')._(name)._(' with ')._(self._getSpouseNameByEventId(data, event)).result();
			break;
			default:
				return sb._((from)?from:'')._((from)?'-':'')._((to)?to:'')._((to)?': ':'')._(event.Name)._((place)?' from ':'')._((place)?place:'').result();
			break;
		}		
	},
	_getYear:function(indiv){
		if(indiv.Birth&&indiv.Birth[0]){ return indiv.Birth[0].From.Year; }
		return '';
	},
	_getKnowAs:function(indiv){
		return (indiv.Nick!=null)?indiv.Nick:indiv.FirstName;
	},
	_getName:function(ind){
		return [(ind.Nick!=null)?ind.Nick:ind.FirstName,(ind.LastName)?ind.LastName:''].join(' ');
	},
	_getFullName:function(ind){
		var f = ind.FirstName,
			m = ind.MiddleName;
			l = ind.LastName;
		if(f!=''&&m!=''&&l!=''){
			return [f,m,l].join(' ');
		}
		else if(f!=''&&m==''&&l!=''){
			return [f,l].join(' ');
		}
		else if(f==''&&m==''&&l!=''){
			return l;
		}
		else if(f==''&&m!=''&&l==''){
			return f;
		}
	},
	_getFullPlace:function(place){
		if(!place) return false;
		return place.Name.split(',').join(', ');	
	},
	_getEventDate:function(event){
		if(!event) return;
		var d = event.From.Day,
			m = (event.From.Month!=null)?this.month3[event.From.Month]:'',
			y = event.From.Year;
		if(d!=''&&m!=''&&y!=''){
			return [d,m,y].join(' ');
		}
		else if(d!=''&&m==''&&y!=''){
			return y;
		}
		else if(d==''&&m==''&&y!=''){
			return y;
		}
		else if(d==''&&m!=''&&y!=''){
			return [m,y].join(' ');
		}
		else if(d!=''&&m!=''&&y==''){
			return [d,m].join(' ');
		}
		else {
			return 'unknown';
		}
	},
	_getRelation:function(obj){
		var rel = obj.data.indiv.Relation;
		return (rel!=null)?rel:'';
	},
	_getSpouseAvatar:function(obj, x, y){
		var self = this,
			fId = obj.indiv.FacebookId,
			av = obj.avatar,
			defImg = (obj.indiv.Gender=="F")?'male.png':'female.png';
		var defImgPath = [self.imgPath,'/components/com_manager/modules/profile/image/',defImg].join('');
		return ['<img height="',y,'px" width="',x,'px" src="',defImgPath,'">'].join('');
	},
	_getImage:function(obj,x,y){
		return ['<img src="index.php?option=com_manager&task=getResizeImage&id=',obj.Id,'&w=',x,'&h=',y,'">'].join('');
	},
	_getPhoto:function(obj, x,y){
		return ['<img src="index.php?option=com_manager&task=getResizeImage&id=',obj.photo,'&w=',x,'&h=',y,'">'].join('');
	},
	_getAvatar:function(obj, x, y){
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
		var defImgPath = [self.imgPath,'/components/com_manager/modules/profile/image/',defImg].join('');
		return ['<img height="',y,'px" width="',x,'px" src="',defImgPath,'">'].join('');
	},
	_getAvatar2:function(x, y, type){
		var self = this,
			defImg =(type=="M")?'male.png':'female.png',
			defImgPath = [self.imgPath,"/components/com_manager/modules/profile/image/",defImg].join('');
		return ['<img height="',y,'px" width="',x,'px" src="',defImgPath,'">'].join('');
	},
	_photos:function(p){
		var self = this;
		var sb = host.stringBuffer();
		var length = jQuery(p).length;
		sb._('<ul style="width:')._(55*length)._('px;">');
			jQuery(p).each(function(i,e){
				sb._('<li><img src="index.php?option=com_manager&task=getResizeImage&id=')._(e.Id)._('&w=50&h=50"></li>');
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
	_form:function(sb){
		var parent = this;
		return {
			firstName:{
				title:'<font color="#ff0000">*</font><span>First name:</span>',
				text:'<input name="first_name" type="text">'
			},
			middleName:{
				title:'<span>Middle names:</span>',
				text:'<input name="middle_name" type="text">'
			},
			lastName:{
				title:'<span>Last name:</span>',
				text:'<input name="last_name" type="text">'
			},
			knowAs:{
				title:'<span>Know as:</span>',
				text:'<input name="know_as" type="text">'
			},
			gender:{
				title:'<font color="#ff0000">*</font><span>Gender:</span>',
				text:'<select name="gender"><option selected value="M">Male</option><option value="F">Female</option></select>'
			},
			living:{
				title:'<font color="#ff0000">*</font><span>Living:</span>',
				text:'<select name="living"><option selected value="true">Yes</option><option value="false">No</option></select>'
			},
			adopted:{
				title:'<span>Adopted:</span>',
				text:'<select name="adopted"><option value="true">Yes</option><option selected  value="false">No</option></select>'
			},
			union:{
				title:'<span>Type:</span>',
				text:'<select name="m_type"><option value="MARR">Marriage</option></select>'
			},
			divorce:{
				title:'',
				text:'<input name="deceased" type="checkbox" style="position:relative; top:3px;">&nbsp;Divorced/Separated&nbsp;<input placeholder="Year" name="fs_year" type="text" style="width:40px;" maxlength="4">'
			},
			facebookId:{
				title:'<span>Facebook ID:</span>',
				text:'<input name="facebook_id" type="text">',
			},
			email:{
				title:'<span>Email:</span>',
				text:'<input name="email" type="text">'
			},
			date:{
				title:function(args){
					sb._('<span>')._(args.name)._('</span>');
				},
				text:function(args){
					sb._('<select name="')._(args.type)._(args.prefix)._('day">')._(parent._selectDays())._('</select>');
					sb._('<select name="')._(args.type)._(args.prefix)._('month">')._(parent._selectMonths())._('</select>');
					sb._('<input name="')._(args.type)._(args.prefix)._('year" type="text" style="width:40px;" maxlength="4" placeholder="Year">');
					sb._('<input name="')._(args.type)._(args.prefix)._('option" type="checkbox"> Unknown');
				}
			},
			location:{
				title:function(args){
					sb._('<span>')._(args.name)._('</span>');
				},
				text:function(args){
					if(!args.style) args.style = '';
					sb._('<input name="')._(args.prefix)._('town" style="')._(args.style)._('" type="text" placeholder="Town/City">');
					sb._('<input name="')._(args.prefix)._('state" style="')._(args.style)._('" type="text" placeholder="Prov/State">')
					sb._('<input name="')._(args.prefix)._('country" style="')._(args.style)._('" type="text" placeholder="Country">')
				}
			},
			tr:function(style,attr){
				sb._('<tr ')._(attr||'')._('style="')._(style||'')._('">');
				return this;
			},
			td:function(name,type, settings){
				var def = {style:'',attr:'',func:false,args:null};
				jQuery.extend(def, settings);
				sb._('<td ')._(def.attr)._('style="')._(def.style)._('">');
				if(def.func==true)
					this[name][type](def.args);
				else
					sb._(this[name][type]);
				sb._('</td>');
				return this;
			},
			end:function(){
				sb._('</tr>');
			}
		}
	},
	_formAvatar:function(sb, object, width, height){
		var self = this;
		sb._('<div class="jmb-dialog-photo">')._(self._getAvatar(object, width, height))._('</div>');
		sb._('<div class="jmb-dialog-photo-button">');
			sb._('<span class="jmb-dialog-photo-button-wrapper">');
				sb._('<input type="file" name="photo" id="photo">');
				sb._('<span class="jmb-dialog-photo-button2">Upload Photo</span>');
				sb._('<div class="jmb-dialog-photo-context"></div>');
			sb._('</span>');
		sb._('</div>');
	},
	_formBasicFields:function(){
		var self = this;
		var sb = host.stringBuffer();
		var field = self._form(sb);
		sb._('<table id="basic_fields">');
			field.tr()
				field.td('firstName', 'title', {style:'width:100px;text-align:right;'});
				field.td('firstName', 'text', {style:'text-align:left;'});
			field.end();
			field.tr()
				field.td('middleName', 'title', {style:'width:100px;text-align:right;'});
				field.td('middleName', 'text', {style:'text-align:left;'});
			field.end();
			field.tr()
				field.td('lastName', 'title', {style:'width:100px;text-align:right;'});
				field.td('lastName', 'text', {style:'text-align:left;'});
			field.end();
			field.tr()
				field.td('knowAs', 'title', {style:'width:100px;text-align:right;'});
				field.td('knowAs', 'text', {style:'text-align:left;'});
			field.end();
			field.tr()
				field.td('gender', 'title', {style:'width:100px;text-align:right;'});
				field.td('gender', 'text', {style:'text-align:left;'});
			field.end();
			field.tr();
				field.td('date', 'title', {style:'width:100px;text-align:right;', func:true, args:{name:'Born:'}});
				field.td('date', 'text', {func:true, args:{type:'f', prefix:'b_'}});
			field.end();
			field.tr();
				field.td('location', 'title', {style:'width:100px;text-align:right;', func:true, args:{name:'In:'}});
				field.td('location', 'text', {func:true, args:{prefix:'b_', style:'width:100px;'}});
			field.end();
			field.tr()
				field.td('living', 'title', {style:'width:100px;text-align:right;'});
				field.td('living', 'text', {style:'text-align:left;'});
			field.end();
			field.tr('display:none;', 'id="date-died"');
				field.td('date', 'title', {style:'width:100px;text-align:right;', func:true, args:{name:'Died:'}});
				field.td('date', 'text', {func:true, args:{type:'f', prefix:'d_'}});
			field.end();
			field.tr('display:none;', 'id="location-died"');
				field.td('location', 'title', {style:'width:100px;text-align:right;', func:true, args:{name:'In:'}});
				field.td('location', 'text', {func:true, args:{prefix:'d_', style:'width:100px;'}});
			field.end();
		sb._('</table>');
		sb._('<div class="jmb-dialog-button-submit"><input type="submit" value="Save"><input type="button" value="Cancel"></div>');
		return sb.result();
	},
	_formBasicFieldsInfo:function(){
		var self = this;
		var sb = host.stringBuffer();
		var field = self._form(sb);
		sb._('<table id="basic_fields">');
			field.tr()
				field.td('gender', 'title', {style:'width:100px;text-align:right;'});
				field.td('gender', 'text');
				field.td('living', 'title');
				field.td('living', 'text');
			field.end();
			field.tr()
				field.td('firstName', 'title', {style:'width:100px;text-align:right;'});
				field.td('firstName', 'text', {attr:'colspan="3"'});
			field.end();
			field.tr()
				field.td('middleName', 'title', {style:'width:100px;text-align:right;'});
				field.td('middleName', 'text', {attr:'colspan="3"'});
			field.end();
			field.tr()
				field.td('lastName', 'title', {style:'width:100px;text-align:right;'});
				field.td('lastName', 'text', {attr:'colspan="3"'});
			field.end();
			field.tr()
				field.td('knowAs', 'title', {style:'width:100px;text-align:right;'});
				field.td('knowAs', 'text', {attr:'colspan="3"'});
			field.end();
			field.tr()
				field.td('adopted', 'title', {style:'width:100px;text-align:right;'});
				field.td('adopted', 'text', {attr:'colspan="3"'});
			field.end();
		sb._('</table>');
		return sb.result();
	},
	_formBasicFieldsEventDate:function(){
		var self = this;
		var sb = host.stringBuffer();
		var field = self._form(sb);
		sb._('<table id="date_fields">');
			field.tr();
				field.td('date', 'title', {style:'width:100px;text-align:right;', func:true, args:{name:'Born:'}});
				field.td('date', 'text', {func:true, args:{type:'f', prefix:'b_'}});
			field.end();
			field.tr();
				field.td('location', 'title', {style:'width:100px;text-align:right;', func:true, args:{name:'In:'}});
				field.td('location', 'text', {func:true, args:{prefix:'b_', style:'width:100px;'}});
			field.end();
			field.tr('display:none;', 'id="date-died"');
				field.td('date', 'title', {style:'width:100px;text-align:right;', func:true, args:{name:'Died:'}});
				field.td('date', 'text', {func:true, args:{type:'f', prefix:'d_'}});
			field.end();
			field.tr('display:none;', 'id="location-died"');
				field.td('location', 'title', {style:'width:100px;text-align:right;', func:true, args:{name:'In:'}});
				field.td('location', 'text', {func:true, args:{prefix:'d_', style:'width:100px;'}});
			field.end();
		sb._('</table>');
		return sb.result();
	},
	_formUnionEventFields:function(){
		var self = this;
		var sb = host.stringBuffer();
		var field = self._form(sb);
		sb._('<table>');		
			field.tr();
				field.td('union', 'title');
				field.td('union', 'text');
			field.end();
			field.tr();
				field.td('date', 'title', {func:true, args:{name:'Date:'}});
				field.td('date', 'text', {func:true, args:{type:'f', prefix:'m_'}});
			field.end();
			field.tr();
				field.td('location', 'title', {func:true, args:{name:'Place:'}});
				field.td('location', 'text', {style:'text-align: left;', func:true, args:{prefix:'m_', style:'width:100px;'}});
			field.end();
			field.tr();
				field.td('divorce', 'title');
				field.td('divorce', 'text');
			field.end();
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
			var placeTr = jQuery(obj).find('tr#location-died');
			var dateTr = jQuery(obj).find('tr#date-died');
			jQuery(dateTr).hide();
			jQuery(placeTr).hide();
			if(v=='false'){
				jQuery(dateTr).show();
				jQuery(placeTr).show();
			}
			if(typeof(callback)!='undefined') callback();
		});
	},
	_buttonsGender:function(obj, callback){
		var self = this;
		jQuery(obj).find('select[name="gender"]').change(function(){
			var value = jQuery(this).val();
			jQuery(obj).find('.jmb-dialog-photo').html(self._getAvatar2(135, 150, value));
			if(typeof(callback)!='undefined') callback();
		});
	},
	_setData:function(target, object){
		var self = this;
		jQuery(target).find('input[name="first_name"]').val(object.indiv.FirstName);
		jQuery(target).find('input[name="middle_name"]').val(object.indiv.MiddleName);
		jQuery(target).find('input[name="last_name"]').val(object.indiv.LastName);
		jQuery(target).find('input[name="know_as"]').val(object.indiv.Nick);
		jQuery(target).find('.jmb-dialog-form-gender input[value="'+object.indiv.Gender+'"]').attr('checked', true);
		if(jQuery(object.indiv.Birth).length!=0){
			jQuery(target).find('select[name="fb_day"] option[value="'+object.indiv.Birth[0].From.Day+'"]').attr('selected', 'selected');
			jQuery(target).find('select[name="fb_month"] option[value="'+object.indiv.Birth[0].From.Month+'"]').attr('selected', 'selected');
			jQuery(target).find('input[name="fb_year"]').val(object.indiv.Birth[0].From.Year);
			var place = object.indiv.Birth[0].Place
			if(place&&place.Locations[0]){
				jQuery(target).find('input[name="b_town"]').val(place.Locations[0].City);
				jQuery(target).find('input[name="b_state"]').val(place.Locations[0].State);
				jQuery(target).find('input[name="b_country"]').val(place.Locations[0].Country);
			}
		}
		if(jQuery(object.indiv.Death).length!=0){
			jQuery(target).find('select[name="living"] option[value="false"]').attr('selected', 'selected');
			jQuery(target).find('select[name="living"] option[value="false"]').change();
			jQuery(target).find('select[name="fd_day"] option[value="'+object.indiv.Death[0].From.Day+'"]').attr('selected', 'selected');
			jQuery(target).find('select[name="fd_month"] option[value="'+object.indiv.Death[0].From.Month+'"]').attr('selected', 'selected');
			jQuery(target).find('input[name="fd_year"]').val(object.indiv.Death[0].From.Year);
			var place = object.indiv.Birth[0].Place
			if(place&&place.Locations[0]){
				jQuery(target).find('input[name="d_town"]').val(place.Locations[0].City);
				jQuery(target).find('input[name="d_state"]').val(place.Locations[0].State);
				jQuery(target).find('input[name="d_country"]').val(place.Locations[0].Country);
			}
		}
	},
	_setUnionData:function(target, object){
		var self = this;
		jQuery(object.event).each(function(i,event){
			if(!event.Type) return;
			if(event.Type == 'MARR'){
				jQuery(target).find('select[name="fm_day"] option[value="'+event.From.Day+'"]').attr('selected', 'selected');
				jQuery(target).find('select[name="fm_month"] option[value="'+event.From.Month+'"]').attr('selected', 'selected');
				jQuery(target).find('input[name="fm_year"]').val(event.From.Year);
				if(event.Place&&jQuery(event.Place.Locations).length!=0){
					jQuery(target).find('input[name="m_town"]').val(event.Place.Locations[0].City);
					jQuery(target).find('input[name="m_state"]').val(event.Place.Locations[0].State);
					jQuery(target).find('input[name="m_country"]').val(event.Place.Locations[0].Country);
				}
			} else if(event.Type == 'DIV'){
				jQuery(target).find('input[name="deceased"]').attr('checked', 'checked');
				jQuery(target).find('input[name="fs_year"]').val(event.From.Year);
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
 			return true;
		}, function(json){
			if(json.photo) jQuery(self.dContent.object).find('.jmb-dialog-photo').html(self._getPhoto(json, 135, 150));
		});	
		jQuery(this.dWindow).append(this.dContent.object);
	}
}

function JMBMediaManager(object){
	this.parent = object;
}
JMBMediaManager.prototype = {
	getImage:function(image){
		var sb = host.stringBuffer();
		return sb._('<a href="')._(image.FilePath)._('" rel="prettyPhoto[pp_gal]" title=""><img src="index.php?option=com_manager&task=getResizeImage&id=')._(image.Id)._('&w=100&h=100')._('" alt="" /></a>').result();
	},
	render:function(photos){
		var self = this,sb = host.stringBuffer();
		sb._('<div class="jmb-dialog-photos-content">');
			sb._('<div class="list">');
				sb._('<ul>');
					jQuery(photos).each(function(i, image){
						sb._('<li id="')._(image.Id)._('">') 
							sb._('<div class="list-item">');
								sb._('<div class="item">')._(self.getImage(image))._('</div>');
							sb._('</div>');
						sb._('</li>');
					});
				sb._('</ul>');
			sb._('</div>');
		sb._('</div>');
		return sb.result();
	},
	init:function(object){
		jQuery(object).find('a[rel^="prettyPhoto"]').prettyPhoto({
			social_tools:''
		});
	}	
}
function JMBEmailInvitation(object){
	this.parent = object;
	this.overlay = new JMBOverlay();
}

JMBEmailInvitation.prototype = {
	createDiv:function(json){
		var self = this, sb = host.stringBuffer(), data = json.data;
		sb._('<div class="jmb-dialog-invition"><form id="jmb:send-invitation" method="post" target="iframe-profile">');
			sb._('<div class="jmb-dialog-invition-header">Send Invitation</div>');
			sb._('<div class="jmb-profile-mini-info">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td class="jmb-profile-mini-photo"><div>')._(self.parent._getAvatar(data,81,90))._('</div></td>');
						sb._('<td class="jmb-profile-mini-info-body">');
							sb._('<div><span>Name:</span> ')._(self.parent._getFullName(data.indiv))._('</div>');
							sb._('<div><span>Born:</span> ')._(self.parent._getEventDate(data.indiv.Birth[0]))._('</div>');
							var relation = self.parent._getRelation(json);
							if(relation != 0) sb._('<div><span>Relation:</span> ')._(relation)._('</div>');
						sb._('</td>');
					sb._('</tr>');
				sb._('</table>');
			sb._('</div>');
			sb._('<div class="jmb-dialog-invition-fields">');
				sb._('<table>');
					sb._('<tr><td><span class="title">Selec from Facebook friends:</span></td><td><input name="facebook_name" DISABLED placeholder="Temporarily unavailable"></td></tr>');
					sb._('<tr><td></td><td><div style="text-align:center;">or</div></td></tr>');
					sb._('<tr><td><span class="title">Send Email:</span></td><td><input name="email" placeholder="Enter Email address"></td></tr>');
				sb._('</table>');
			sb._('</div>');
			sb._('<div class="jmb-dialog-invition-send"><input type="submit" value="send"></div>');
		sb._('</form></div>');
		return jQuery(sb.result());
	},
	render:function(json){
		var self = this;
		var div = this.createDiv(json);
		var form = jQuery(div).find('form');
		this.send(form, json);
		this.overlay.render({object:div, width:450, height:255});
		this.overlay.show();
	},
	send:function(form, p){
		var self = this;
		var args = [p.fmbUser.indiv.Id,p.data.indiv.Id].join(';');
		self.parent._ajaxForm(form, 'sendInvitation', args, function(){
			var email = jQuery(form).find('input[name="email"]').val();
			var re = /^([a-zA-Z0-9])(([a-zA-Z0-9])*([\._\+-])*([a-zA-Z0-9]))*@(([a-zA-Z0-9\-])+(\.))+([a-zA-Z]{2,4})+$/;
			var result = re.test(email);
			if(!result) alert('email not valid.')
			return result;
		}, function(json){
			alert(json.message);
			self.overlay.hide();
		});	
	}
}

