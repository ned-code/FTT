function JMBProfile(){
	var	module = this;
		
	module.editor_header_active_button = null;
	module.editor_menu_active_button = null;
	module.menu_item_pull = [];
	module.object = null;
    module.target_id = null;
    module.afterEditorClose = null;
	module.container = null;

	module.path = storage.baseurl+"/components/com_manager/modules/profile/";
	module.imagePath = module.path+'image/';
	module.box = jQuery('<div id="jmb:dialog" class="jmb-dialog-container"></div>');
	module.addBox = jQuery('<div id="jmb:dialog_add" class="jmb-dialog-container"></div>');
	module.view_menu = {"view_profile":"Profile","view_photos":"Photos"};
	module.edit_menu = {"edit_basic":"Basic Details","edit_unions":"Unions","edit_photos":"Photos","more_options":"More Options"};
	module.editor_buttons = jQuery('<div class="jmb-dialog-interface-button"><div type="button" value="edit"><span>Edit</span></div><div value="view" type="button" class="active"><span>View</span></div></div>');
	module.dialog_settings = {
		width:700,
		height:500,
		resizable: false,
		draggable: false,
		position: "top",
		closeOnEscape: false,
		modal:true,
		close:function(){
			jQuery(this).dialog("destroy");
			jQuery(this).remove();
            if(typeof(module.afterEditorClose) == 'function'){
                module.afterEditorClose();
            }
            module._clear();
		}	
	}
	
	module._iframe();
}

JMBProfile.prototype = {
	_ajax:function(func, params, callback){
        storage.progressbar.loading();
		host.callMethod("profile", "JMBProfile", func, params, function(res){
			callback(res);
            storage.progressbar.off();
		});
	},
	_ajaxForm:function(settings){
        var validate_options = (settings.validate)?settings.validate:{};
        jQuery(settings.target).validate(validate_options);
        jQuery(settings.target).ajaxForm({
            url:[storage.baseurl,'components/com_manager/php/ajax.php'].join(''),
            type:"POST",
            data: { "module":"profile","class":"JMBProfile", "method":settings.method, "args": settings.args },
            dataType:"json",
            target:jQuery(storage.iframe).attr('name'),
            beforeSubmit:function(){
                storage.progressbar.loading();
                return true;
            },
            success:function(data){
                storage.progressbar.off();
                if(typeof(settings.success) == 'function'){
                    settings.success(data);
                }
            }
        });


	},
	_iframe:function(){
		if(jQuery("#iframe-profile").length==0){
			var iframe = '<iframe id="iframe-profile" name="#iframe-profile" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">';
			jQuery(document.body).append(iframe);
		}
	},
	_dialog:function(box, options){
		var	module = this, result;
		result = jQuery.extend({}, module.dialog_settings, options);
		jQuery(box).dialog(result);
		jQuery(box).parent().css('top', '40px');
	},
	_container:function(){
		var	module = this,
			sb = host.stringBuffer();
		sb._('<div class="jmb-editor-container">');
			sb._('<table>');
				sb._('<tr><td valign="top" style="width:150px;"><div class="jmb-dialog-profile-menu-container"></div></td><td valign="top"><div class="jmb-dialog-profile-content"></div></td></tr>');
			sb._('</table>');
		sb._('</div>');
		return jQuery(sb.result());
	},
	_initEditorHeaderButtons:function(cont, mode){
		var	module = this,
			divs = jQuery(module.editor_buttons).find('div[type="button"]'),
			active = function(object){
				var val = jQuery(object).attr('value');
				module._clearMenu();
				jQuery(cont).parent().parent().removeClass('edit');
				jQuery(cont).parent().parent().removeClass('view');
				jQuery(cont).parent().parent().addClass(val);
				jQuery(divs).removeClass('active');
				jQuery(object).addClass('active');
				module.editor_header_active_button = object;
				module['_'+val](cont);
			};
		
		jQuery(divs).click(function(){
			active(this);
		});	
		active((mode=='edit')?divs[0]:divs[1]);
		jQuery(module.box).parent().find('.ui-dialog-titlebar').append(module.editor_buttons);	
	},
	_initMenuButtons:function(){
		var	module = this,
			class_name = ".jmb-dialog-profile-menu-container",
			ul = jQuery(module.container).find(class_name+" ul"),
			items = jQuery(ul).find('li'),
			click = module._click();	
		jQuery(items).click(function(){
			jQuery(items).removeClass('active');
			jQuery(this).addClass('active');
			module.editor_menu_active_button = this;
			module._clearContent();
			click[jQuery(this).attr('id')]();
		});
	},
	_avatar:function(object, width, height){
        return storage.usertree.avatar.get({
            object:object,
            width:width,
            height:height
        });
	},
	_gen:function(){
		var	module = this,
			sb = host.stringBuffer(),
			value,
			i,
			days,
			months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
			month_days = [
				[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
				[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
			],
			days_in_month = function(month, year){
				if(month==null || year ==null) return 31;
				if(month<1 || month > 12) return 0;
				return month_days[((year%4==0) && ((year%100!=0) || (year%400==0)))?1:0][month-1];
			};
		return {
			select:{
				spouse:function(name, families){
					var family, spouse, parse, count = 0;
					sb.clear();
					sb._('<select style="width:120px;" name="')._(name)._('">');
						for(var key in families){
							if(key!='length'){
								family = families[key];
								if(family.spouse!=null){
									spouse = storage.usertree.pull[family.spouse];
									parse = storage.usertree.parse(spouse);
									sb._('<option value="')._(parse.gedcom_id)._('">')._(parse.name)._('</option>');
									count++;
								}
							}
						}
					sb._('</select>');
					return (count!=0)?sb.result():false;
				},
				gender:function(name, selected){
					if(selected){
						if(selected == 'F'){
							value = ['selected value="F"','value="M"']
						} else  {
							value = ['value="F"','selected value="M"'];
						}
					} else {
						value = ['value="F"','value="M"'];
					}
					sb.clear();
					sb._('<select name="')._(name)._('">');
						sb._('<option ')._(value[0])._('>Female</option>');
						sb._('<option ')._(value[1])._('>Male</option>');
					sb._('</select>');
					return sb.result();
				},
				living:function(name, is_alive){
					value = (is_alive)?['selected value="1"','value="0"']:['value="1"','selected value="0"'];
					sb.clear();
					sb._('<select name="')._(name)._('">');
						sb._('<option ')._(value[0])._('>Yes</option>');
						sb._('<option ')._(value[1])._('>No</option>');
					sb._('</select>');
					return sb.result();
				},
				days:function(name, date){
					sb.clear();
					days = (date)?days_in_month(date[1], date[2]):31;
					sb._('<select name="')._(name)._('">');
						sb._('<option value="0">Day</option>')
						for(i = 1 ; i <= days ; i++){
							if(date!=null&&date[0]!=null&&date[0] == i){
								sb._('<option SELECTED value="')._(i)._('">')._(i)._('</option>');
							} else {
								sb._('<option value="')._(i)._('">')._(i)._('</option>');
							}
						}
					sb._('</select>');
					return sb.result();
				},
				months:function(name, selected){
					sb.clear();
					sb._('<select name="')._(name)._('">');
						for(i=1 ; i <= months.length ; i++ ){
							if(selected&&selected == i){
								sb._('<option SELECTED value="')._(i)._('">')._(months[i-1])._('</option>');
							} else {
								sb._('<option value="')._(i)._('">')._(months[i-1])._('</option>');
							}
						}
					sb._('</select>');
					return sb.result();
				}
			}
		}	
	},
	_form:function(o){
		var	module = this,
			sb = host.stringBuffer(),
			gen = module._gen(),
            object = storage.usertree.pull[o.user.gedcom_id],
			user = storage.usertree.parse(object),
			spouse,
            parse_spouse,
			place,
            place_name;
		return {
			basic:function(){
				sb.clear();
				sb._('<table id="basic_fields">');
					sb._('<tr>');
						sb._('<td><div><span>Gender:</span></div></td>');
						sb._('<td>')._(gen.select.gender('gender', user.gender))._('</td>');
						sb._('<td><div><span>Living:</span></div></td>');
						sb._('<td>')._(gen.select.living('living', user.is_alive))._('</td>');
					sb._('</tr>');
					sb._('<tr>');
						sb._('<td><div><span>First Name:</span></div></td>');
						sb._('<td colspan="3"><input name="first_name" type="text" value="')._(user.first_name)._('"></td>');
					sb._('</tr>');
					sb._('<tr>');
						sb._('<td><div><span>Middle Name:</span></div></td>');
						sb._('<td colspan="3"><input name="middle_name" type="text" value="')._(user.middle_name)._('"></td>');
					sb._('</tr>');
					sb._('<tr>');
						sb._('<td><div><span>Last Name:</span></div></td>');
						sb._('<td colspan="3"><input name="last_name" type="text" value="')._(user.last_name)._('"></td>');
					sb._('</tr>');
					sb._('<tr>');
						sb._('<td><div><span>Know as:</span></div></td>');
						sb._('<td colspan="3"><input name="nick" type="text" value="')._(user.nick)._('"></td>');
					sb._('</tr>');
				sb._('</table>');
				return sb.result();
			},
			eventdate:function(){
				sb.clear();
				sb._('<table id="date_fields">');
					sb._('<tr id="birthdate">');
						sb._('<td><div><span>Born</span></div></td>');
						sb._('<td>');
							sb._(gen.select.days('birth_days', user.birth()));
							sb._(gen.select.months('birth_months', user.birth('month')));
							sb._('<input name="birth_year" type="text" style="width:40px;" maxlength="4" placeholder="Year" value="')._(user.birth('year'))._('">');
							sb._('<input name="birth_option" ')._(!user.is_birth?'checked':'')._(' type="checkbox"> Unknown');
						sb._('</td>');
					sb._('</tr>');
					sb._('<tr id="birthplace">');
						sb._('<td><div><span>Birthplace</span></div></td>');
						sb._('<td>');
							sb._('<input name="birth_city"  type="text" placeholder="Town/City" value="')._(user.place('birth', 'city'))._('">');
							sb._('<input name="birth_state" type="text" placeholder="Prov/State" value="')._(user.place('birth', 'state'))._('">')
							sb._('<input name="birth_country" type="text" placeholder="Country" value="')._(user.place('birth', 'country'))._('">')
						sb._('</td>');
					sb._('</tr>');
					sb._('<tr id="deathdate" style="')._((user.is_alive)?'display:none':'')._('">');
						sb._('<td><div><span>Death</span></div></td>');
						sb._('<td>');
							sb._(gen.select.days('death_days', user.death()));
							sb._(gen.select.months('death_months', user.death('month')));
							sb._('<input name="death_year" type="text" style="width:40px;" maxlength="4" placeholder="Year" value="')._(user.death('year'))._('">');
							sb._('<input name="death_option" ')._(!user.is_death?'checked':'')._(' type="checkbox"> Unknown');
						sb._('</td>');
					sb._('</tr>');
					sb._('<tr id="deathplace" style="')._((user.is_alive)?'display:none':'')._('">');
						sb._('<td><div><span>Deathplace</span></div></td>');
						sb._('<td>');
							sb._('<input name="death_city"  type="text" placeholder="Town/City" value="')._(user.place('death', 'city'))._('">');
							sb._('<input name="death_state" type="text" placeholder="Prov/State" value="')._(user.place('death', 'state'))._('">')
							sb._('<input name="death_country" type="text" placeholder="Country" value="')._(user.place('death', 'country'))._('">')
						sb._('</td>');
					sb._('</tr>');
				sb._('</table>');
				return sb.result();
			},
			avatar:function(width, height){
				sb.clear();
				sb._('<div class="jmb-dialog-photo">');
					sb._(module._avatar(object, width, height));
					if(user.is_death){
						sb._('<div class="jmb-dialog-profile-death-marker">&nbsp;</div>');
					}
				sb._('</div>');
				return sb.result();
			},
			spouse:function(family, count, cp){
				sb.clear();
				spouse = storage.usertree.pull[family.spouse];
				parse_spouse = storage.usertree.parse(spouse);
				sb._('<div id="jmb-union-')._(count)._('" class="jmb-dialog-profile-content-union" family_id="')._(family.id)._('" spouse_id="')._(family.spouse)._('">');
					sb._('<form id="jmb-profile-addpsc-')._(count)._('" method="post" family_id="')._(family.id)._('" target="iframe-profile">');
						sb._('<div class="jmb-dialog-profile-content-unions-header">');
							sb._('<div id="title">Union ')._(count+1)._('</div>');
							if(cp) sb._('<div id="current_partner"><input name="current_partner" type="radio"> Show as current or latest partner</div>');
							sb._('<div id="button"><input type="submit" value="Save"></div>');
						sb._('</div>');
						sb._('<div class="jmb-dialog-profile-content-unions-body">');
							sb._('<table>');
								sb._('<tr>');
									sb._('<td>');
										sb._('<div>');
											sb._('<div class="jmb-dialog-profile-content-unions-person"><table><tr>');
												sb._('<td><div style="border-right:none;" class="info">')
													sb._('<div class="name">')._(user.name)._('</div>');
													sb._('<div class="date">')._(user.date('birth'))._('</div>');
													place = user.place('birth');
													place_name = (place!='')?place.place_name:'';
													sb._('<div class="location">')._(place_name)._('</div>');
												sb._('</div></td>');
												sb._('<td><div class="avatar">')._(module._avatar(object, 72, 80))._('</div></td>');
											sb._('</tr></table></div>');
											sb._('<div style="margin-left: 10px;" class="jmb-dialog-profile-content-unions-person"><table><tr>');
											sb._('<td><div class="avatar">')._(module._avatar(spouse, 72, 80))._('</td></div>');
												sb._('<td><div style="border-left:none;" class="info">')
													sb._('<div class="name">')._(parse_spouse.name)._('</div>');
													sb._('<div class="date">')._(parse_spouse.date('birth'))._('</div>');
													place = parse_spouse.place('birth');
													place_name = (place!='')?place.place_name:'';
													sb._('<div class="location">')._(place_name)._('</div>');
												sb._('</div></td>');
											sb._('</tr></table></div>');
										sb._('</div>');
									sb._('</td>');
								sb._('</tr>');
								sb._('<tr>');
									sb._('<td valign="top"><div class="jmb-dialog-profile-content-unions-part">');
										sb._('<table id="union_event">');
											sb._('<tr>');
												sb._('<td><span>Type:</span></td>');
												sb._('<td><select name="marr_type"><option value="MARR">Marriage</option></select></td>');
											sb._('</tr>');
											sb._('<tr id="marrdate">');
												sb._('<td><div><span>Date</span></div></td>');
												sb._('<td>');
													sb._(gen.select.days('marr_days', user.marr(family.id, 'date')));
													sb._(gen.select.months('marr_months', user.marr(family.id,'date', 1)));
													sb._('<input name="marr_year" type="text" style="width:40px;" maxlength="4" placeholder="Year" value="')._(user.marr(family.id,'date', 2))._('">');
													sb._('<input name="marr_option" ')._(!user.is_married_date_exist(family.id)?'checked':'')._(' type="checkbox"> Unknown');
												sb._('</td>');
											sb._('</tr>');
											sb._('<tr id="marrplace">');
												sb._('<td><div><span>Location</span></div></td>');
												sb._('<td>');
													sb._('<input name="marr_city"  type="text" placeholder="Town/City" value="')._(user.marr(family.id, 'place', 'city'))._('">');
													sb._('<input name="marr_state" type="text" placeholder="Prov/State" value="')._(user.marr(family.id, 'place', 'state'))._('">')
													sb._('<input name="marr_country" type="text" placeholder="Country" value="')._(user.marr(family.id, 'place', 'country'))._('">')
												sb._('</td>');
											sb._('</tr>');
											sb._('<tr><td></td><td><input name="deceased" ')._(user.is_divorce_event(family.id)?'checked':'')._(' type="checkbox" style="position:relative; top:3px;">&nbsp;Divorced/Separated&nbsp;<input placeholder="Year" name="marr_divorce_year" type="text" style="width:40px;" value="')._(user.divorce(family.id, 'date', 2))._('" maxlength="4"></td></tr>');
										sb._('</table>');
									sb._('</div></td>');
								sb._('</tr>');
							sb._('</table>');
						sb._('</div>');
					sb._('</form>');
				sb._('</div>');
				return sb.result();
			},
			add_spouse:function(){
				sb.clear();
				sb._('<form id="jmb:fullprofile:add_union" method="post" target="iframe-profile">');
					sb._('<div class="jmb-profile-add-union-buttons"><input type="Submit" value="Save"><input type="button" value="Cancel"></div>');
					sb._('<div class="title"><span>Basic Info:</span></div>');
					sb._('<div id="basic_fields"><table>');
						sb._('<tr>');
							sb._('<td><div><span>Gender:</span></div></td>');
							sb._('<td>')._(gen.select.gender('gender'))._('</td>');
							sb._('<td><div><span>Living:</span></div></td>');
							sb._('<td>')._(gen.select.living('living', true))._('</td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td><div><span>First Name:</span></div></td>');
							sb._('<td colspan="3"><input name="first_name" type="text" value=""></td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td><div><span>Middle Name:</span></div></td>');
							sb._('<td colspan="3"><input name="middle_name" type="text" value=""></td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td><div><span>Last Name:</span></div></td>');
							sb._('<td colspan="3"><input name="last_name" type="text" value=""></td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td><div><span>Know as:</span></div></td>');
							sb._('<td colspan="3"><input name="nick" type="text" value=""></td>');
						sb._('</tr>');
					sb._('</table></div>');
					sb._('<div id="date_fields"><table>');
						sb._('<tr id="birthdate">');
							sb._('<td><div><span>Born</span></div></td>');
							sb._('<td>');
								sb._(gen.select.days('birth_days'));
								sb._(gen.select.months('birth_months'));
								sb._('<input name="birth_year" type="text" style="width:40px;" maxlength="4" placeholder="Year" value="">');
								sb._('<input name="birth_option" checked type="checkbox"> Unknown');
							sb._('</td>');
						sb._('</tr>');
						sb._('<tr id="birthplace">');
							sb._('<td><div><span>Birthplace</span></div></td>');
							sb._('<td>');
								sb._('<input name="birth_city"  type="text" placeholder="Town/City" value="">');
								sb._('<input name="birth_state" type="text" placeholder="Prov/State" value="">')
								sb._('<input name="birth_country" type="text" placeholder="Country" value="">')
							sb._('</td>');
						sb._('</tr>');
						sb._('<tr id="deathdate" style="display:none;">');
							sb._('<td><div><span>Death</span></div></td>');
							sb._('<td>');
								sb._(gen.select.days('death_days'));
								sb._(gen.select.months('death_months'));
								sb._('<input name="death_year" type="text" style="width:40px;" maxlength="4" placeholder="Year" value="">');
								sb._('<input name="death_option" checked type="checkbox"> Unknown');
							sb._('</td>');
						sb._('</tr>');
						sb._('<tr id="deathplace" style="display:none;">');
							sb._('<td><div><span>Deathplace</span></div></td>');
							sb._('<td>');
								sb._('<input name="death_city"  type="text" placeholder="Town/City" value="">');
								sb._('<input name="death_state" type="text" placeholder="Prov/State" value="">')
								sb._('<input name="death_country" type="text" placeholder="Country" value="">')
							sb._('</td>');
						sb._('</tr>');
					sb._('</table></div>');
					sb._('<div class="title"><span>Union Event:</span></div>');
					sb._('<div id="union_event"><table>');
						sb._('<tr>');
							sb._('<td><span>Type:</span></td>');
							sb._('<td><select name="marr_type"><option value="MARR">Marriage</option></select></td>');
						sb._('</tr>');
						sb._('<tr id="marrdate">');
							sb._('<td><div><span>Date</span></div></td>');
							sb._('<td>');
								sb._(gen.select.days('marr_days'));
								sb._(gen.select.months('marr_months'));
								sb._('<input name="marr_year" type="text" style="width:40px;" maxlength="4" placeholder="Year" value="">');
								sb._('<input name="marr_option" checked type="checkbox"> Unknown');
							sb._('</td>');
						sb._('</tr>');
						sb._('<tr id="birthplace">');
							sb._('<td><div><span>Location</span></div></td>');
							sb._('<td>');
								sb._('<input name="marr_city"  type="text" placeholder="Town/City" value="">');
								sb._('<input name="marr_state" type="text" placeholder="Prov/State" value="">')
								sb._('<input name="marr_country" type="text" placeholder="Country" value="">')
							sb._('</td>');
						sb._('</tr>');
						sb._('<tr><td></td><td><input name="deceased" type="checkbox" style="position:relative; top:3px;">&nbsp;Divorced/Separated&nbsp;<input placeholder="Year" name="marr_divorce_year" type="text" style="width:40px;" value="" maxlength="4"></td></tr>');
					sb._('</table></div>');
				sb._('</form>');
				return sb.result();
			},
			add_parent:function(){
				sb.clear();
				sb._('<form id="jmb:profile:addpsc" method="post" target="iframe-profile">');
					sb._('<div class="buttons"><input type="submit" value="Save and Close"><input id="cancel" type="button" value="Cancel"></div>');
					sb._('<table style="width:100%;">');
						sb._('<tr>');
							sb._('<td>');
								sb._('<div id="basic_fields"><table>');
									sb._('<tr>');
										sb._('<td><div><span>Gender:</span></div></td>');
										sb._('<td>')._(gen.select.gender('gender'))._('</td>');
										sb._('<td><div><span>Living:</span></div></td>');
										sb._('<td>')._(gen.select.living('living', true))._('</td>');
									sb._('</tr>');
									sb._('<tr>');
										sb._('<td><div><span>First Name:</span></div></td>');
										sb._('<td colspan="3"><input name="first_name" type="text" value=""></td>');
									sb._('</tr>');
									sb._('<tr>');
										sb._('<td><div><span>Middle Name:</span></div></td>');
										sb._('<td colspan="3"><input name="middle_name" type="text" value=""></td>');
									sb._('</tr>');
									sb._('<tr>');
										sb._('<td><div><span>Last Name:</span></div></td>');
										sb._('<td colspan="3"><input name="last_name" type="text" value=""></td>');
									sb._('</tr>');
									sb._('<tr>');
										sb._('<td><div><span>Know as:</span></div></td>');
										sb._('<td colspan="3"><input name="nick" type="text" value=""></td>');
									sb._('</tr>');
								sb._('</table></div>');
							sb._('</td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td>');	
								sb._('<div id="date_fields"><table>');
									sb._('<tr id="birthdate">');
										sb._('<td><div><span>Born</span></div></td>');
										sb._('<td>');
											sb._(gen.select.days('birth_days'));
											sb._(gen.select.months('birth_months'));
											sb._('<input name="birth_year" type="text" style="width:40px;" maxlength="4" placeholder="Year" value="">');
											sb._('<input name="birth_option" checked type="checkbox"> Unknown');
										sb._('</td>');
									sb._('</tr>');
									sb._('<tr id="birthplace">');
										sb._('<td><div><span>Birthplace</span></div></td>');
										sb._('<td>');
											sb._('<input name="birth_city"  type="text" placeholder="Town/City" value="">');
											sb._('<input name="birth_state" type="text" placeholder="Prov/State" value="">')
											sb._('<input name="birth_country" type="text" placeholder="Country" value="">')
										sb._('</td>');
									sb._('</tr>');
									sb._('<tr id="deathdate" style="display:none;">');
										sb._('<td><div><span>Death</span></div></td>');
										sb._('<td>');
											sb._(gen.select.days('death_days'));
											sb._(gen.select.months('death_months'));
											sb._('<input name="death_year" type="text" style="width:40px;" maxlength="4" placeholder="Year" value="">');
											sb._('<input name="death_option" checked type="checkbox"> Unknown');
										sb._('</td>');
									sb._('</tr>');
									sb._('<tr id="deathplace" style="display:none;">');
										sb._('<td><div><span>Deathplace</span></div></td>');
										sb._('<td>');
											sb._('<input name="death_city"  type="text" placeholder="Town/City" value="">');
											sb._('<input name="death_state" type="text" placeholder="Prov/State" value="">')
											sb._('<input name="death_country" type="text" placeholder="Country" value="">')
										sb._('</td>');
									sb._('</tr>');
								sb._('</table></div>');
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
				sb._('</form>');
				return sb.result();	
			},
			add_bs:function(){
				return this.add_parent();
			},
			add_child:function(){
				var spouse_select;
				sb.clear();
				sb._('<form id="jmb:profile:addpsc" method="post" target="iframe-profile">');
					sb._('<div class="buttons"><input type="submit" value="Save and Close"><input id="cancel" type="button" value="Cancel"></div>');
					sb._('<table style="width:100%;">');
						sb._('<tr>');
							sb._('<td>');
								sb._('<div id="basic_fields"><table>');
									sb._('<tr>');
										sb._('<td><div><span>Gender:</span></div></td>');
										sb._('<td>')._(gen.select.gender('gender'))._('</td>');
										sb._('<td><div><span>Living:</span></div></td>');
										sb._('<td>')._(gen.select.living('living', true))._('</td>');
									sb._('</tr>');
									if(spouse_select = gen.select.spouse('spouse', object.families)){
										sb._('<tr>');
											sb._('<td><div><span>Spouse:</span></div></td>');
											sb._('<td colspan="3">')._(spouse_select)._('</td>');
										sb._('</tr>');
									}
									sb._('<tr>');
										sb._('<td><div><span>First Name:</span></div></td>');
										sb._('<td colspan="3"><input name="first_name" type="text" value=""></td>');
									sb._('</tr>');
									sb._('<tr>');
										sb._('<td><div><span>Middle Name:</span></div></td>');
										sb._('<td colspan="3"><input name="middle_name" type="text" value=""></td>');
									sb._('</tr>');
									sb._('<tr>');
										sb._('<td><div><span>Last Name:</span></div></td>');
										sb._('<td colspan="3"><input name="last_name" type="text" value=""></td>');
									sb._('</tr>');
									sb._('<tr>');
										sb._('<td><div><span>Know as:</span></div></td>');
										sb._('<td colspan="3"><input name="nick" type="text" value=""></td>');
									sb._('</tr>');
								sb._('</table></div>');
							sb._('</td>');
						sb._('</tr>');
						sb._('<tr>');
							sb._('<td>');	
								sb._('<div id="date_fields"><table>');
									sb._('<tr id="birthdate">');
										sb._('<td><div><span>Born</span></div></td>');
										sb._('<td>');
											sb._(gen.select.days('birth_days'));
											sb._(gen.select.months('birth_months'));
											sb._('<input name="birth_year" type="text" style="width:40px;" maxlength="4" placeholder="Year" value="">');
											sb._('<input name="birth_option" checked type="checkbox"> Unknown');
										sb._('</td>');
									sb._('</tr>');
									sb._('<tr id="birthplace">');
										sb._('<td><div><span>Birthplace</span></div></td>');
										sb._('<td>');
											sb._('<input name="birth_city"  type="text" placeholder="Town/City" value="">');
											sb._('<input name="birth_state" type="text" placeholder="Prov/State" value="">')
											sb._('<input name="birth_country" type="text" placeholder="Country" value="">')
										sb._('</td>');
									sb._('</tr>');
									sb._('<tr id="deathdate" style="display:none;">');
										sb._('<td><div><span>Death</span></div></td>');
										sb._('<td>');
											sb._(gen.select.days('death_days'));
											sb._(gen.select.months('death_months'));
											sb._('<input name="death_year" type="text" style="width:40px;" maxlength="4" placeholder="Year" value="">');
											sb._('<input name="death_option" checked type="checkbox"> Unknown');
										sb._('</td>');
									sb._('</tr>');
									sb._('<tr id="deathplace" style="display:none;">');
										sb._('<td><div><span>Deathplace</span></div></td>');
										sb._('<td>');
											sb._('<input name="death_city"  type="text" placeholder="Town/City" value="">');
											sb._('<input name="death_state" type="text" placeholder="Prov/State" value="">')
											sb._('<input name="death_country" type="text" placeholder="Country" value="">')
										sb._('</td>');
									sb._('</tr>');
								sb._('</table></div>');
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
				sb._('</form>');
				return sb.result();
			}
		}
	},
	_events:function(html){
		var	module = this;
		return {
			cancel:function(callback){
				var input = jQuery(html).find('input[value="Cancel"]');
				jQuery(input).click(function(){
					jQuery(html).remove();
					callback();
				});
			},
			living:function(){
				var select = jQuery(html).find('select[name="living"]'), death;
				jQuery(select).change(function(){
					death = jQuery(html).find('#deathdate,#deathplace');
					if(parseInt(jQuery(this).val())){
						jQuery(death).hide();
					} else {
						jQuery(death).show();
					}
				});
			},
            gender:function(object, width, height){
                var select = jQuery(html).find('select[name="gender"]');
                jQuery(select).change(function(){
                    var avatar = storage.usertree.avatar.def({
                            object:object,
                            width:width,
                            height:height
                        }, jQuery(this).val());
                    jQuery(html).find('div.jmb-dialog-photo').html(avatar);
                });
            }
		}
	},
	_click:function(){
		var	module = this,
			sb = host.stringBuffer(),
			object = storage.usertree.pull[module.target_id],
			parse = storage.usertree.parse(object),
			media = object.media,
			families = object.families,
			user = object.user,
			form = module._form(object),
			html,
			select_photo,
			update_data;
		
		update_data = function(res){
			storage.usertree.update(res.objects);
            object = storage.usertree.pull[module.target_id];
            parse = storage.usertree.parse(object);
            media = object.media,
            families = object.families;
            user = object.user;
            form = module._form(object);
		}

		return {
			view_profile:function(){
				var place, place_name;
				sb.clear();
				sb._('<div class="jmb-dialog-view-profile">');
					sb._('<div class="jmb-dialog-view-profile-content">')
						sb._('<table>');
							sb._('<tr>');
								sb._('<td><div class="jmb-dialog-photo">');
									sb._(module._avatar(object, 135, 150));
									if(parse.is_death){
										sb._('<div class="jmb-dialog-profile-death-marker">&nbsp;</div>');
									}
								sb._('</div></td>');
								sb._('<td valign="top">');
									sb._('<table style="margin-top: 10px;">');
										sb._('<tr>');
											sb._('<td><div class="title"><span>Full Name:</span></div></td>');
											sb._('<td><div id="full_name" class="text"><span>')._(parse.full_name)._('</span></div></td>');
										sb._('</tr>');
										sb._('<tr>');
											sb._('<td><div class="title"><span>Know As:</span></div></td>');
											sb._('<td><div id="know_as" class="text"><span>')._(parse.nick)._('</span></div></td>');
										sb._('</tr>');
										sb._('<tr>');
											sb._('<td><div class="title"><span>Birthday:</span></div></td>');
											sb._('<td><div id="birthday" class="text"><span>')._(parse.date('birth'))._('</span></div></td>');
										sb._('</tr>');
										place = parse.place('birth');
										place_name = (place!='')?place.place_name:'';
										if(place_name!=''){
											sb._('<tr>');
												sb._('<td><div class="title"><span>Birthplace:</span></div></td>');	
												
												sb._('<td><div id="birthplace" class="text"><span>')._(place_name)._('</span></div></td>');
											sb._('</tr>');
										}
										if(parse.relation){
											sb._('<tr>');
												sb._('<td><div class="title"><span>Relation:</span></div></td>');
												sb._('<td><div id="relation" class="text"><span>')._(parse.relation)._('</span></div></td>');
											sb._('</tr>');
										}
									sb._('</table>');
								sb._('</td>');
							sb._('</tr>');
						sb._('</table>');
					sb._('</div>');
				sb._('</div>');
				html = jQuery(sb.result());
				jQuery(module.box).find('div.jmb-dialog-profile-content').append(html);
			},
			view_photos:function(){
				if(media!=null){
					sb.clear();
					sb._(storage.media.render(media.photos));
					html = jQuery(sb.result());
					storage.media.init(html);				
					jQuery(module.box).find('div.jmb-dialog-profile-content').append(html);
				}
			},
			edit_basic:function(){
				var events;
				sb.clear();
				sb._('<div class="jmb-dialog-profile-content-basic"><form id="jmb:fullprofile:basic" method="post" target="iframe-profile">');
					sb._('<div class="jmb-dialog-button-submit"><input type="submit" value="Save"></div>');
					sb._('<div class="jmb-dialog-profile-content-basic-body">');
						sb._('<table style="width:100%;">');
							sb._('<tr>');
								sb._('<td>')._(form.avatar(135, 150))._('</td>');
								sb._('<td valing="top">');
									sb._(form.basic());
								sb._('</td>');
							sb._('</tr>');
							sb._('<tr>');
								sb._('<td colspan="4">');
									sb._(form.eventdate());
								sb._('</td>');
							sb._('</tr>');
						sb._('</table>');
					sb._('</div>');
				sb._('</form></div>');
				html = jQuery(sb.result());
				//init events
				events = module._events(html);
				events.living();
                events.gender(object, 135, 150);
				//ajax form
                module._ajaxForm({
                    target:jQuery(html).find('form'),
                    method:'basic',
                    args:user.gedcom_id,
                    validate:{
                        rules:{
                            birth_year:{
                                date:true
                            }
                        },
                        messages:{
                            birth_year:""
                        }
                    },
                    success:function(res){
                        update_data(res);
                    }
                });
				jQuery(module.box).find('div.jmb-dialog-profile-content').append(html);
			},
			edit_unions:function(){
				var	subm = this,
                    key,
					count = 0,
					add_active = false,
					save_union,
					add_union;
					
				save_union = function(form){
					var args = '{"gedcom_id":"'+parse.gedcom_id+'","family_id":"'+jQuery(form).attr('family_id')+'","method":"save"}';
                    module._ajaxForm({
                        target:form,
                        method:'union',
                        args:args,
                        success:function(res){
                            update_data(res);
                        }
                    });
				}
				
				add_union = function(div){
                    var args = '{"gedcom_id":"'+parse.gedcom_id+'","method":"add"}';
                    module._ajaxForm({
                        target:jQuery(div).find('form'),
                        method:'union',
                        args:args,
                        success:function(res){
                            update_data(res);
                            module._clearContent();
                            subm.edit_unions();
                        }
                    });
				}
				var cp = (families!=null&&families.length>0);
				sb.clear();
				sb._('<div class="jmb-dialog-profile-content-unions">');
				sb._('<div class="jmb-dialog-profile-content-unions-add"><input type="button" value="')._((cp)?"Add another union":"Add union")._('"></div>');
				for(key in families){
					if (!families.hasOwnProperty(key)) continue;
					if(key != 'length' && families[key].spouse != null){
						sb._(form.spouse(families[key],count,cp));	
						count++
					}
				}
				sb._('</div>');
				html = jQuery(sb.result());
				jQuery(html).find('form').each(function(i, form){
					save_union(form);
				});
				jQuery(html).find('.jmb-dialog-profile-content-unions-add input').click(function(){
					if(add_active) return false;
					var div = jQuery('<div class="jmb-profile-add-union"></div>').append(form.add_spouse());
					var events = module._events(div);
					events.living();
					events.cancel(function(){ add_active = false; });
					add_union(div);
					jQuery(html).append(div);
					add_active = true;
					return false;
				});
				jQuery(html).find('input[name="current_partner"]').click(function(){
					var flag = jQuery(this).is(':checked');
					jQuery(html).find('input[name="current_partner"]').attr('checked', false);
					if(flag){
						jQuery(this).attr('checked', true);
					} else {
						jQuery(this).attr('checked', false);
					}
				});
				if(parse.default_family){
					jQuery(html).find('div.jmb-dialog-profile-content-union[family_id="'+parse.default_family+'"]').find('input[name="current_partner"]').attr('checked', true);
				}
				jQuery(html).find()
				jQuery(module.box).find('div.jmb-dialog-profile-content').append(html);
			},
			edit_photos:function(){
                var photoDelete, photoSelect,initSetAvatar;
				photoDelete = function(li){
					jQuery(li).find('div.delete').click(function(){
						var	click = this,
                            id = jQuery(click).attr('id'),
							json = '{"method":"delete","media_id":"'+id+'"}';
						module._ajax('photo', json, function(res){
							jQuery(click).parent().parent().parent().remove();
							jQuery(html).find('div.switch-avatar input').hide();
                            jQuery(media.photos).each(function(i, el){
                                if(el.media_id == id){
                                    media.photos.splice(i,1);
                                }
                            });
                            if(media.avatar!=null&&media.avatar.media_id == id){
                                media.avatar = null;
                            }
						});
						return false;
					});	
				}
				photoSelect = function(li){
					jQuery(li).click(function(){
						var input, json;
						jQuery(html).find('div.jmb-dialog-photos-content li').removeClass('active');
						jQuery(li).addClass('active');
						select_photo = li;
						jQuery(html).find('div.switch-avatar input').hide();
						if(jQuery(li).attr('id') != parse.avatar_id){
							jQuery(html).find('div.switch-avatar input#set').show();
						}
					});
				}
				initSetAvatar = function(html){
					var input = jQuery(html).find('div.switch-avatar input'), id;
					jQuery(input).click(function(){
						json = '{"method":"set_avatar","media_id":"'+jQuery(select_photo).attr('id')+'","gedcom_id":"'+parse.gedcom_id+'"}';
						module._ajax('photo', json, function(res){
							id = jQuery(select_photo).attr('id');
							media.avatar = media.photos[parse.getPhotoIndex(id)];
							parse.avatar_id = id;
							jQuery(input).hide();
						});
						return false;
					});
				}

				sb.clear();
				sb._('<div class="jmb-dialog-photos-content">');
					sb._('<div class="buttons">');
						sb._('<form id="jmb:profile:photos" method="post" target="iframe-profile">');
							sb._('<input name="upload" type="file"><input type="submit" value="Upload">');
						sb._('</form>');
						sb._('<div class="switch-avatar">');
							sb._('<input id="set" type="button" value="Set Avatar" style="display:none;" >');
						sb._('</div>');					
					sb._('</div>');
					if(media!=null&&media.photos!=null){
						sb._(storage.media.render(media.photos, true));
					}
				sb._('</div>');
				html = jQuery(sb.result());
				initSetAvatar(html);
				jQuery(html).find('div.jmb-dialog-photos-content li').each(function(i, li){
					photoDelete(li);
					photoSelect(li);
				});
                module._ajaxForm({
                    target:jQuery(html).find('form'),
                    method:'photo',
                    args:'{"gedcom_id":"'+parse.gedcom_id+'","method":"add"}',
                    validate:{
                        rules:{
                            upload:{
                                accept: "jpg|gif|png",
                                required: true
                            }
                        },
                        messages:{
                            upload:"",
                            required: ""
                        }
                    },
                    success:function(res){
                        var li;
                        if(res!=null&&res.image){
                            if(jQuery(html).find('.jmb-dialog-photos-content').length==0){
                                jQuery(html).append(storage.media.render([res.image], true));
                                li = jQuery(html).find('.jmb-dialog-photos-content li')[0];
                            } else {
                                li = jQuery(storage.media.getListItem(res.image, true));
                                jQuery(html).find('.jmb-dialog-photos-content div.list ul').append(li);
                            }
                            photoDelete(li);
                            photoSelect(li);
                            if(media==null){
                                storage.usertree.pull[parse.gedcom_id].media = {
                                    avatar:null,
                                    photos:[]
                                }
                                media = storage.usertree.pull[parse.gedcom_id].media;
                            };
                            media.photos.push(res.image);
                        }
                        jQuery(html).find('form').resetForm();
                    }
                });
				jQuery(module.box).find('div.jmb-dialog-profile-content').append(html);
			},
			more_options:function(){
				sb.clear();
                var functions ={
                    getCellImage:function(){
                        return ''
                    },
                    getCellText:function(title, description){
                        var s = host.stringBuffer();
                        s._('<div id="')._(title.id)._('" class="title"><span>')._(title.value)._('</span></div>');
                        s._('<div class="description">')._(description)._('</div>');
                        return s.result();
                    },
                    getRow:function(args){
                        if(!args.visibility()) return '';
                        var s = host.stringBuffer();
                        s._('<tr>');
                            s._('<td>');
                                s._(this.getCellImage());
                            s._('</td>');
                            s._('<td>');
                                s._(this.getCellText(args.title, args.description));
                            s._('</td>');
                        s._('</tr>');
                        return s.result();
                    },
                    getDeleteUnregisteredMemberText:function(string){
                        return string.replace('%%', parse.name);
                    }
                },
                    deleteUnregisteredMember = functions.getDeleteUnregisteredMemberText('You are about to %% remove from your family tree.<br>Please select an option:'),
                    titleUnlink = 'Leave my profile unchanged',
                    descrUnlink = 'This process will keep your profile details intact. All names, dates and other info will remain visible by existing family members',
                    titleDeleteData = 'Delete data',
                    descrDeleteData = 'This process will wipe your profile clean. All names, dates and other info will be removed and replaced with "unknown"',
                    titleDeleteAndRemove = 'Delete data and remove member',
                    descrDeleteAndRemove = 'This process will completely remove your branch from this family tree. Note that family members with descendants cannot  be removed.';


                sb._('<div class="jmb-dialog-options-content">');
                    sb._('<div class="option">')._(deleteUnregisteredMember)._('</div>');
                    sb._('<div>');
                        sb._('<table>');
                            sb._(functions.getRow({
                                title:{
                                    id:'unlink',
                                    value:titleUnlink
                                },
                                description:descrUnlink,
                                visibility:function(){
                                    return (storage.usertree.gedcom_id == parse.gedcom_id);
                                }
                            }));
                            sb._(functions.getRow({
                                title:{
                                    id:'delete_data',
                                    value:titleDeleteData
                                },
                                description:descrDeleteData,
                                visibility:function(){
                                    return true;
                                }
                            }));
                            sb._(functions.getRow({
                                title:{
                                    id:'delete',
                                    value:titleDeleteAndRemove
                                },
                                description:descrDeleteAndRemove,
                                visibility:function(){
                                    return true;
                                }
                            }));
                        sb._('</table>');
                    sb._('</div>');
                sb._('</div>');

				html = jQuery(sb.result());
				jQuery(module.box).find('div.jmb-dialog-profile-content').append(html);
                /*
                 sb._('<div class="jmb-dialog-options-content" style="margin: 10px;">');
                 sb._('<ul style="list-style: none outside none;">');
                 if(parse.is_deletable){
                 sb._('<li id="delete">');
                 sb._('<div id="text"><div class="button"><span>Delete this person from your family tree.</span></div></div>');
                 sb._('<div id="description"></div>');
                 sb._('</li>');
                 }
                 sb._('</ul>');
                 sb._('</div>');

                jQuery(html).find('li#delete').click(function(){
                    var args = 'unlink,85,11541'
                    module._ajax('delete', args, function(res){
                        console.log(res.responseText);
                    })
                });
                */
			}
		}
	},
	_menu:function(cont, items){
		var	module = this,
			class_name = ".jmb-dialog-profile-menu-container",
			ul = jQuery("<ul></ul>"),
			key,
			li;
		for(key in items){
			li = jQuery('<li id="'+key+'"><span>'+items[key]+'</span></li>');
			module.menu_item_pull.push(li);
			jQuery(ul).append(li);
		}
		jQuery(cont).find(class_name).append(ul);
		module._initMenuButtons();
		jQuery(ul).find('li').first().click();
	},
	_view:function(cont){
		var 	module = this,
			items = module.view_menu;
		module._menu(cont, items);
	},
	_edit:function(cont){
		var 	module = this,
			items = module.edit_menu;
		module._menu(cont, items);
	},
	_clearMenu:function(){
		var	module = this,
			items = module.menu_item_pull, 
			i;
		for(i = items.length-1 ; i >= 0 ; i--){
			jQuery(items.pop()).remove();	
		}
		module.menu_item_pull = [];
		
	},
	_clearContent:function(){
		var module = this;
		jQuery(module.container).find('.jmb-dialog-profile-content').html('');
	},
	_clear:function(){
		var module = this;
        storage.tooltip.cleaner();
		jQuery(module.container).remove();
		module.editor_header_active_button = null;
		module.editor_menu_active_button = null;
		module.menu_item_pull = [];
		module.object = null;
		module.container = null;
        module.afterEditorClose = null;
        module.target_id = null;
	},
	editor:function(mode, data){
		var	module = this,
			cont = module._container(),
			object = storage.usertree.pull[data.object.user.gedcom_id],
			get = storage.usertree.parse(object),
			name = get.full_name;
			
		module._clear();

		module.container = cont;
		module.object = object;
        module.target_id = object.user.gedcom_id;
        module.afterEditorClose = data.events.afterEditorClose;

		module._dialog(module.box, { title: name, height: 450 });
		jQuery(module.box).css({ background:"white", border:"none" });
		jQuery(module.box).append(cont);
		module._initEditorHeaderButtons(cont, mode);
	},
	add:function(data){
		var	module = this,
			sb = host.stringBuffer(),
			object = data.object,
			parse = storage.usertree.parse(object),
			form = module._form(object),
			container = '',
			cont = '',
			title = '',
			w = 700,
			h = 'auto',//500
			query = '',
			success = function(res){
				var objects = res.objects;
				jQuery(objects).each(function(i, el){
					if(el.user != null && el.user.gedcom_id != null){
						storage.usertree.pull[el.user.gedcom_id] = el;
                        if(typeof(data.events.afterEditorClose) == 'function'){
                            data.events.afterEditorClose();
                        }
					}
				});
				jQuery(module.addBox).dialog("close");
			};

		return {
			clear:function(){
				jQuery(container).html('');
				jQuery(container).remove();
				jQuery(cont).remove();
				jQuery(module.addBox).html('');
				container = null;
			},
			cancel:function(cont){
				jQuery(cont).find('input#cancel').click(function(){
					jQuery(module.addBox).dialog("close");
					return false;
				});
				return this;
			},
			living:function(){
				jQuery(cont).find('select[name="living"]').change(function(){
					var	val = parseInt(jQuery(this).val()),
						d_date = jQuery(cont).find('tr#deathdate'),
						d_place = jQuery(cont).find('tr#deathplace');
					if(val){
						jQuery(d_date).hide();
						jQuery(d_place).hide();
					} else {
						jQuery(d_date).show();
						jQuery(d_place).show();
					}
				});
			},
			init:function(){
				this.living();
				module._dialog(module.addBox, {title:title, width:w, height:h});
				jQuery(module.addBox).css({ background:"none", border:"none"});
				jQuery(module.addBox).css('overflow', 'visible');
				jQuery(module.addBox).append(container);
				jQuery(container).append(cont);
                module._ajaxForm({
                    target:cont,
                    method:'add',
                    args:query,
                    success:success
                });
				return this;
			},
			parent:function(){
				this.clear();
				container = jQuery('<div class="jmb-dialog-profile-add-parent"></div>');
				cont = jQuery(form.add_parent());
				w = 455;
				//h = 'auto';
				title = 'Add Parent';
				query = '{"method":"parent","owner_id":"'+parse.gedcom_id+'"}';
				this.cancel(cont);
				return this;
			},
			spouse:function(){
				var buttons =  jQuery('<div class="buttons"><input type="submit" value="Save and Close"><input id="cancel" type="button" value="Cancel"></div>');
				this.clear();
				container = jQuery('<div class="jmb-profile-add-union"></div>');
				jQuery(container).css({
					border:'none',
					margin: '0',
					padding: '0',
					width: 'auto'
				});
				cont = jQuery(form.add_spouse());
				jQuery(cont).append(buttons);
				jQuery(cont).find('.jmb-profile-add-union-buttons').remove();
				
				w = 455;
				//h = 517;
				title = 'Add Spouse';
				query = '{"method":"spouse","owner_id":"'+parse.gedcom_id+'"}';
				this.cancel(buttons);
				return this;
			},
			bs:function(){
				this.clear();
				container = jQuery('<div class="jmb-dialog-profile-add-parent"></div>');
				cont = jQuery(form.add_bs());
				w = 455;
				//h = 315;
				title = 'Add Brother or Sister';
				query = '{"method":"sibling","owner_id":"'+parse.gedcom_id+'"}';
				this.cancel(cont);
				return this;
			},
			child:function(){
				this.clear();
				container = jQuery('<div class="jmb-dialog-profile-add-parent"></div>');
				cont = jQuery(form.add_child());
				w = 455;
				//h = 315;
				title = 'Add Child';
				query = '{"method":"child","owner_id":"'+parse.gedcom_id+'"}';
				this.cancel(cont);
				return this;
			}
		}
	}
}

