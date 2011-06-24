function DescendantTreeProfileEdit(parent){
	var self = this;
	this.parent = parent;
	this.activeTab = null;
	this.activeFieldset = null;
 	this.buttonEvent = false;
	this.person = {};
	this.mediaConteiner = null;
	this.activePhoto = null;

	var iframe = '<iframe id="jmb_media_iframe" name="jmb_media_iframe" style="display:none;position:absolute;left:-1000px;width:1px;height:1px"></iframe>';
	jQuery(document.body).append(iframe);
	jQuery('#jmb_media_iframe').load(function(){
		self.iframeLoad(this);
	});
}

DescendantTreeProfileEdit.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("descendant_tree", "DescendantTree", func, params, function(res){
				callback(res);
		})
	},
	setTabs:function(p){
		var self = this;
		jQuery(p).find('div.jmb-dtpe-tabs-item').each(function(index, element){
			if(jQuery(element).hasClass('active')) self.activeTab = element;
			jQuery(element).click(function(){
				if(jQuery(this).hasClass('active')) return false;
				jQuery(self.activeTab).removeClass('active');
				jQuery(element).addClass('active');
				self.activeTab = element;
				var type = jQuery(this).attr('type');
				jQuery(p).find('.jmb-dtpe-tabs-body div.jmb-dtpe-tabs-body-item').each(function(index, element){
					jQuery(element).hide();
				});
				jQuery(p).find('div[name="'+type+'"]').fadeIn('slow');
			})
		})
	},
	add:function(p){
		var self = this;
		var html = '<div>';
			html += '<fieldset>';
				html += '<legend>Add Relative</legend>';
				html += '<table>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-input-name"><span>First Name:</span></div></td>';
						html += '<td><input name="FirstName" class="jmb-dtpe-tabs-input-text" type="text"></td>';
					html += '</tr>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-input-name"><span>Last Name:</span></div></td>';
						html += '<td><input name="LastName" class="jmb-dtpe-tabs-input-text" type="text"></td>';
					html += '</tr>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-input-name"><span>Gender:</span></div></td>';
						html += '<td><span class="jmb-dtpe-tabs-input-radio">Male: <input name="Sex" type="radio" value="M"></span><span class="jmb-dtpe-tabs-input-radio">Female: <input name="Sex" type="radio" value="F"></span></td>';
					html += '</tr>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-input-name"><span>Type:</span></div></td>';
						html += '<td><select><option value="parent">Parent</option><option value="spouse">Spouse</option><option value="child">Child</option></select></td>';
					html += '</tr>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-button">Save</div></td>';
						html += '<td><div class="jmb-dtpe-tabs-button-info"></div></td>';
					html += '</tr>';
				html += '</table>';
			html += '</fieldset>';
		html += '</div>';
		var obj = jQuery(html);
		jQuery(obj).find('.jmb-dtpe-tabs-input-radio input[value="M"]').attr('checked', 'checked');
		jQuery(obj).find('.jmb-dtpe-tabs-input-radio').each(function(index, element){
			jQuery(element).click(function(){
				jQuery(this).find('input').attr('checked', 'checked');
			});
		});
		jQuery(obj).find('.jmb-dtpe-tabs-button').click(function(){
			if(!self.buttonEvent){
				self.buttonEvent = true;
				jQuery(obj).find('.jmb-dtpe-tabs-button-info').html('<span class="loading">information is transmitted...</span>');
				var firstName, lastName,gender,type, request;
				firstName = jQuery(obj).find('input[name="FirstName"]').val();
				lastName = jQuery(obj).find('input[name="LastName"]').val();
				gender = jQuery(obj).find('input:radio[name="Sex"]:checked').val();
				type = jQuery(obj).find('select').val();
				request = '{"ownerID":"'+self.person.ind.Id+'","FirstName":"'+firstName+'","LastName":"'+lastName+'","Gender":"'+gender+'","Type":"'+type+'"}';
				self._ajax('addRelative', request, function(res){
					self.treeReload();
					jQuery(obj).find('.jmb-dtpe-tabs-button-info').html('<span class="loaded">Information sent.</span>');
					jQuery(obj).find('.jmb-dtpe-tabs-button-info span').fadeOut(3000); 
					self.buttonEvent = false;
				});
			}
		})
		jQuery(p).find('div[name="add"]').append(obj);
	},
	treeReload:function(){
		var self = this;
		if(self.parent) return;
		var dhxTree = self.parent.dhxTree;
		var renderType = jQuery('#jmb_header_fam_line span.active').attr('type');
		dhxTree.deleteChildItems('0');
		dhxTree.deleteItem('0');
		self.parent.loadTree(dhxTree, renderType);	
	},
	getEditDiv:function(name){
		return '<div name="'+name+'" class="jmb-dtpe-tabs-edit"><div class="jmb-edit-text" style="display:block;"></div><div style="display:none;" class="jmb-edit-input"><input name="'+name+'" class="jmb-dtpe-tabs-input-text" type="text"></div></div>';
	},
	setTextInEditDiv:function(obj, name, val){
		jQuery(obj).find('div[name="'+name+'"]').find('.jmb-edit-text').text(val);
		jQuery(obj).find('div[name="'+name+'"]').find('input[name="'+name+'"]').val(val);
	},
	getEditEventDiv:function(name){
		return '<div name="'+name+'" class="jmb-dtpe-tabs-edit"><div class="jmb-edit-text" style="display:block;"></div><div style="display:none;" class="jmb-edit-input"><input name="Date" class="jmb-dtpe-tabs-input-text" type="text" style="width:80px;" readonly> in <input name="Place" class="jmb-dtpe-tabs-input-text" type="text" style="width:129px;"><input class="jmb-dtpe-tab-input-submit" type="submit" value="ok"></div></div>';
	},
	gedEditDescriptionDiv:function(){
		return '<div name="Description" class="jmb-dtpe-tabs-edit"><div class="jmb-edit-text" style="display:block;border: 1px solid #EFE4B0;"></div><div style="display:none;" class="jmb-edit-input"><textarea></textarea><input class="jmb-dtpe-tab-input-submit" type="submit" value="ok"></div></div>'
	},
	getBirth:function(ind){
		if(ind.Birth){
			var b = ind.Birth;
			var place = this.parent.profile.getPlace(b.Place.Hierarchy);
			var date = this.parent.profile.getDate(b);
			return date + ((place)?' in '+place.Name :'');	
		}
		else {
			return 'edit';
		}
	},
	getDeath:function(ind){
		if(ind.Death){
			var d = ind.Death;
			var place = this.parent.profile.getPlace(d.Place.Hierarchy);
			var date = this.parent.profile.getDate(d);
			return date + ((place)?' in '+place.Name :'');
		}
		else {
			return 'edit';
		}
	},
	getMarried:function(){
		var fam = this.parent.profile.json.fam;
		if(fam == null) return 'edit';
		if(fam.Marriage){
			var marr = fam.Marriage;
			var date = this.parent.profile.getDate(marr);
			var place = this.parent.profile.getPlace(marr.Place.Hierarchy);
			return date + ((place)?' in '+place.Name :'');
		}
		else{
			return 'edit';
		}
	},
	getDescription:function(){
		var notes = this.person.notes;
		if(notes.length > 0){
			return notes[0].Text;
		}
		else{
			return 'edit';
		}
	},
	addSourceRow:function(e){
		var html = '<tr><td>';
			html += '<div class="jmb-dtpe-source">';
				html += '<div class="jmb-dtpe-source-text" id="'+e.Id+'" author="'+e.Author+'" style="display:block;"><div class="jmb-dtpe-source-title">'+e.Title+'</div><div class="jmb-dtpe-source-publication">'+((e.Publication)?e.Publication:'edit')+'</div></div>';
				html += '<div class="jmb-dtpe-source-edit" style="display:none;"><input class="jmb-dtpe-source-input-text" type="text"><textarea></textarea><input class="jmb-dtpe-tab-input-submit" type="submit" value="ok"></div>';
			html += '</div>'
		html += '</td></tr>';
		return jQuery(html);
	}, 
	clickRowHandle:function(obj){
		var self = this;
		var title = jQuery(obj).find('div.jmb-dtpe-source-title').text();
		var publication = jQuery(obj).find('div.jmb-dtpe-source-publication').text();
		var edit = jQuery(obj).parent().find('div.jmb-dtpe-source-edit');
		var text = jQuery(obj)
		jQuery(edit).find('input.jmb-dtpe-source-input-text').val(title);
		jQuery(edit).find('textarea').val(publication);
		jQuery(text).hide();
		jQuery(edit).show();
	},
	clickRowHandleComplete:function(row){
		var self = this;
		var title = jQuery(row).find('input.jmb-dtpe-source-input-text').val();
		var publication = jQuery(row).find('textarea').val();
		var id = jQuery(row).find('div.jmb-dtpe-source-text').attr('id');
		var request = '{"ownerId":"'+self.person.ind.Id+'","request":{"Id":"'+id+'","Title":"'+title+'","Publication":"'+publication+'"}}';
		self._ajax('sources', request, function(res){
			var json = jQuery.parseJSON(res.responseText);
			var index = (json!=null)?json.Id:id;
			jQuery(row).find('div.jmb-dtpe-source-text').attr('id', index);
			jQuery(row).find('div.jmb-dtpe-source-title').text(title);
			jQuery(row).find('div.jmb-dtpe-source-publication').text(publication);
			jQuery(row).find('div.jmb-dtpe-source-text').show();
			jQuery(row).find('div.jmb-dtpe-source-edit').hide();
		})
	},
	getSources:function(){
		var self = this;
		var sources = this.person.sources;
		var table = jQuery('<table></table>');
		jQuery(sources).each(function(i,e){
			jQuery(table).append(self.addSourceRow(e));
		})
		jQuery(table).append('<tr><td align="left"><div class="jmb-dtpe-source-add">Add</div></td></tr>');
		return '<table>'+jQuery(table).html()+'</table>';
	},
	setData:function(obj){
		var self = this;
		self.setTextInEditDiv(obj, 'FirstName', self.person.ind.FirstName);
		self.setTextInEditDiv(obj, 'LastName', self.person.ind.LastName);
		jQuery(obj).find('.jmb-dtpe-tabs-input-radio input[name="Gender"][value="'+self.person.ind.Gender+'"]').attr('checked', 'checked');
		jQuery(obj).find('div.jmb-dtpe-tabs-edit[name="Birth"]').find('div.jmb-edit-text').text(self.getBirth(self.person.ind));
		jQuery(obj).find('div.jmb-dtpe-tabs-edit[name="Death"]').find('div.jmb-edit-text').text(self.getDeath(self.person.ind));
		jQuery(obj).find('div.jmb-dtpe-tabs-edit[name="Married"]').find('div.jmb-edit-text').text(self.getMarried(self.person.ind));
		jQuery(obj).find('div.jmb-dtpe-tabs-edit[name="Description"]').find('div.jmb-edit-text').text(self.getDescription());
		jQuery(obj).find('div.jmb-dtpe-tabs-edit[name="Sources"]').html(self.getSources());
	},
	details:function(p){
		var self = this;
		var html = '<div>';
			html += '<fieldset>';
				html += '<legend>Basic Info</legend>';
				html += '<div class="jmb-dtpe-tabs-fieldset-body"><table>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-input-name"><span>First Name:</span></div></td>';
						html += '<td>'+self.getEditDiv('FirstName')+'</td>';
					html += '</tr>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-input-name"><span>Last Name:</span></div></td>';
						html += '<td>'+self.getEditDiv('LastName')+'</td>';
					html += '</tr>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-input-name"><span>Gender:</span></div></td>';
						html += '<td><span class="jmb-dtpe-tabs-input-radio">Male: <input name="Gender" type="radio" value="M"></span><span class="jmb-dtpe-tabs-input-radio">Female: <input name="Gender" type="radio" value="F"></span></td>';
					html += '</tr>';
				html += '</table></div>';
				html += '<div type="basic" class="jmb-dtpe-hide-button" style="display:none;">+</div>';
			html += '</fieldset>';
			html += '<fieldset>';
				html += '<legend>Events</legend>';
				html += '<div class="jmb-dtpe-tabs-fieldset-body" style="display:none;"><table>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-input-name"><span>Birth:</span></div></td>';
						html += '<td>'+self.getEditEventDiv('Birth')+'</td>';
					html += '</tr>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-input-name"><span>Death:</span></div></td>';
						html += '<td>'+self.getEditEventDiv('Death')+'</td>';
					html += '</tr>';
					html += '<tr>';
						html += '<td><div class="jmb-dtpe-tabs-input-name"><span>Married:</span></div></td>';
						html += '<td>'+self.getEditEventDiv('Married')+'</td>';
					html += '</tr>';
				html += '</table></div>';
				html += '<div type="events" class="jmb-dtpe-hide-button" style="display:block;">+</div>';
			html += '</fieldset>';
			html += '<fieldset>';
				html += '<legend>Description</legend>';
				html += '<div class="jmb-dtpe-tabs-fieldset-body description" style="display:none;">'+self.gedEditDescriptionDiv()+'</div>';
				html += '<div type="description" class="jmb-dtpe-hide-button" style="display:block;">+</div>';
			html += '</fieldset>';
			html += '<fieldset>';
				html += '<legend>Sources</legend>';
				html += '<div class="jmb-dtpe-tabs-fieldset-body description" style="display:none;"><div name="Sources" class="jmb-dtpe-tabs-edit"></div></div>';
				html += '<div type="sources" class="jmb-dtpe-hide-button" style="display:block;">+</div>';
			html += '</fieldset>';
		html += '</div>';
		var obj = jQuery(html);
		//set values
		self.setData(obj);
		//edit events - basic info;events;description;sources
		jQuery(obj).find('div.jmb-edit-text').each(function(index, element){
			jQuery(element).click(function(){
				var type = jQuery(this).parent().attr('name');
				switch(type){
					case "FirstName":
					case "LastName":
						self.basic(this, type);
					break;
					
					case "Birth":
					case "Death":
					case "Married":
						self.events(this, type);
					break;
					
					case "Description":
						self.description(this, type);
					break;
				}
			})
		});
		jQuery(obj).find('div.jmb-dtpe-source-text').each(function(i,e){
			jQuery(e).click(function(){
				self.clickRowHandle(this);				
			});
		});
		jQuery(obj).find('div.jmb-dtpe-tabs-edit[name="Sources"] input.jmb-dtpe-tab-input-submit').each(function(i,e){
			jQuery(e).click(function(){
				var row = jQuery(this).parent().parent().parent().parent();
				self.clickRowHandleComplete(row);
			});
		});
		jQuery(obj).find('div.jmb-dtpe-source-add').click(function(){
			var row = self.addSourceRow({Title:'',Publication:'',Id:'null',Author:'null'});
			jQuery(this).parent().parent().before(row);
			jQuery(row).find('div.jmb-dtpe-source-text').hide();
			jQuery(row).find('div.jmb-dtpe-source-edit').show();
			jQuery(row).find('input.jmb-dtpe-tab-input-submit').click(function(){
				self.clickRowHandleComplete(row);
			});
			jQuery(row).find('div.jmb-dtpe-source-text').click(function(){
				self.clickRowHandle(this);
			})
		});
		//switch radio input
		jQuery(obj).find('.jmb-dtpe-tabs-input-radio').each(function(i,e){
			jQuery(e).click(function(){
				jQuery(this).find('input').attr('checked', 'checked');
				var val = jQuery(this).find('input').val();
				var request = '{"request":{"Gender":"'+val+'"},"ownerId":"'+self.person.ind.Id+'"}';
				self._ajax('change', request, function(res){});
			});
		});
		
		//hide\unhide fieldset data
		jQuery(obj).find('.jmb-dtpe-hide-button').each(function(i,e){
			if(jQuery(e).attr('type') == 'basic') self.activeFieldset = jQuery(e).parent().find('.jmb-dtpe-tabs-fieldset-body');
			jQuery(e).click(function(){
				jQuery(self.activeFieldset).hide().parent().find('.jmb-dtpe-hide-button').fadeIn('slow');
				self.activeFieldset =  jQuery(this).hide().parent().find('.jmb-dtpe-tabs-fieldset-body').fadeIn('slow');
			});
		});
		jQuery(p).find('div[name="details"]').append(obj);
	},
	basic:function(obj, type){
		var self = this;
		var inputDiv = jQuery(obj).parent().find('div.jmb-edit-input');
		var textDiv = obj;
		jQuery(textDiv).hide();
		jQuery(inputDiv).show().find('input').focus().focusout(function(){
			var val = jQuery(inputDiv).find('input').val();
			jQuery(textDiv).text(val);
			jQuery(inputDiv).hide();
			jQuery(textDiv).show();
		}).change(function(){
			var val = jQuery(inputDiv).find('input').val();	
			var request = '{"request":{"'+type+'":"'+val+'"},"ownerId":"'+self.person.ind.Id+'"}';
			self._ajax('change', request, function(res){});
		});
	},
	events:function(obj, type){
		var self = this;
		var inputDiv = jQuery(obj).parent().find('div.jmb-edit-input');
		var textDiv = obj;
		var value = jQuery(textDiv).html();
		var date = (value.split(' ')[0] != 'edit')? value.split(' ')[0] : '';
		var place = (value.split(' ')[2])? value.split(' ')[2] : '';
		jQuery(inputDiv).find('input[name="Date"]').val(date);
		jQuery(inputDiv).find('input[name="Date"]').datepick({
			dateFormat:"d-M-yyyy",
			changeYear:true,
			yearRange: 'any'
		});
		jQuery(inputDiv).find('input[name="Place"]').val(place);
		jQuery(inputDiv).find('input[type="submit"]').click(function(){
			var date = jQuery(inputDiv).find('input[name="Date"]').val();
			var place = jQuery(inputDiv).find('input[name="Place"]').val();
			var request = '{"request":{"date":"'+date+'","place":"'+place+'","type":"'+type+'"},"ownerId":"'+self.person.ind.Id+'"}';
			if(date != '' || place != ''){
				self._ajax('changeEvent', request, function(res){
					jQuery(textDiv).text(date+' in '+place);
					jQuery(inputDiv).hide();
					jQuery(textDiv).show();
				});
			}
			else {
				jQuery(inputDiv).hide();
				jQuery(textDiv).show();
			}
		});
		jQuery(textDiv).hide();
		jQuery(inputDiv).show();
	},
	description:function(obj, type){
		var self = this;
		var value = jQuery(obj).html();
		var textDiv = obj;
		var inputDiv = jQuery(obj).parent().find('div.jmb-edit-input');
		var textarea = jQuery(inputDiv).find('textarea');
		jQuery(textarea).val(value);
		jQuery(inputDiv).find('input[type="submit"]').click(function(){
			var text = jQuery(textarea).val();
			var request = '{"ownerId":"'+self.person.ind.Id+'","request":{"text":"'+text+'"}}';
			jQuery(textDiv).text(text);
			self._ajax('description', request,function(res){
				jQuery(inputDiv).hide();
				jQuery(textDiv).show();
			});
			
		});
		jQuery(obj).hide();
		jQuery(inputDiv).show();
	},
	sources:function(obj, type){
		var self = this;
	},
	getMediaButtonHTML:function(){
		var html = '<table>'
			html += '<tr><td><div class="jmb-dtpe-media-name"><span>Type</span></div></td></tr>';
			html += '<tr><td><div class="jmb-dtpe-media-text"><input name="self" type="checkbox"> Self <input name="family" type="checkbox"> Family <input name="other" type="checkbox"> Other</div></div></td></tr>';
		
			html += '<tr><td><div class="jmb-dtpe-media-name"><span>Date</span></div></td></tr>';
			html += '<tr><td><div class="jmb-dtpe-media-text"><input name="date" type="text" readonly><input name="circa" type="checkbox"> Circa</div></td></tr>';
		
			html += '<tr><td><div class="jmb-dtpe-media-name"><span>Photographer</span></div></td></tr>';
			html += '<tr><td><div class="jmb-dtpe-media-text"><input name="photographer" type="text"></div></td></tr>';
			/*
			html += '<tr><td><div class="jmb-dtpe-media-name"><span>Source</span></div></td></tr>';
			html += '<tr><td><div class="jmb-dtpe-media-text"><input name="source" type="text"></div></td></tr>';	
			
			html += '<tr><td><div class="jmb-dtpe-media-name"><span>Tags</span></div></td></tr>';
			html += '<tr><td><div class="jmb-dtpe-media-text"><input name="tags" type="text"></div></td></tr>';
			*/
			html += '<tr><td><div class="jmb-dtpe-media-name"><span>Description</span></div></td></tr>';
			html += '<tr><td><div class="jmb-dtpe-media-text"><textarea></textarea></div></td></tr>';
		html += '</table>';
		return html;
	},
	getForm:function(){
		var form = '<form style="display:inline;"  id="jmb_media_upload"';
		form += 'action="index.php?option=com_manager&task=callMethod&module=descendant_tree&class=DescendantTree&method=upload&args='+this.person.ind.Id+'"';
		form += 'target="jmb_media_iframe" enctype="multipart/form-data" method="post">';
		return form;
	},
	iframeLoad:function(){
		var self = this;
		if(self.person.ind == null) return;
		this._ajax('getMedia', this.person.ind.Id, function(res){
			var json = jQuery.parseJSON(res.responseText);
			self.person.photos = json.photos;
			self.getMedia();
		});	
	},
	check:function(objName, check){
		var checked = (check == '1')?'checked':'';
		jQuery(this.mediaConteiner).find(objName).attr('checked', checked);
	},
	changeSetAvatarButton:function(flag){
		var self = this;
		if(flag){
			jQuery(self.mediaConteiner).find('span[name="set_avatar"]').css('display','none');
			jQuery(self.mediaConteiner).find('span[name="unset_avatar"]').css('display','inline');
		}
		else{
			jQuery(self.mediaConteiner).find('span[name="set_avatar"]').css('display','inline');
			jQuery(self.mediaConteiner).find('span[name="unset_avatar"]').css('display','none');
		}		
	},
	setMediaInfo:function(obj){
		var self = this;
		var id = jQuery(obj).find('img').attr('id');
		jQuery(self.person.photos).each(function(i,e){
			if(e.Id == id){
				jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-buttons input[type="text"][name="date"]').val(e.Date);
				jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-buttons input[type="text"][name="photographer"]').val(e.Photographer);
				jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-text textarea').val(e.Description);
				self.check('input[name="circa"]', e.isCirca);
				self.check('input[name="self"]', e.Type.substr(0,1));
				self.check('input[name="family"]', e.Type.substr(1,1));
				self.check('input[name="other"]', e.Type.substr(2,1));
				//set photo
				var photoHtml = '<img id="'+e.Id+'" style="width:180px;height:180px" src="'+e.FilePath+'">';
				jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-avatar').html(photoHtml);
				//set event handle
				jQuery(self.mediaConteiner).find('span[name="set_avatar"]').unbind().click(function(){
					var request = '{"ownerId":"'+self.person.ind.Id+'","imgId":"'+e.Id+'"}'
					self._ajax('setAvatar', request, function(res){
						self.changeSetAvatarButton(true);
						self.person.avatar = e;
					});
				});
				jQuery(self.mediaConteiner).find('span[name="unset_avatar"]').unbind().click(function(){
					var request = '{"ownerId":"'+self.person.ind.Id+'","imgId":"'+e.Id+'"}'
					self._ajax('unsetAvatar', request, function(res){
						self.changeSetAvatarButton(false);
					});
				});
				if(self.person.avatar != null){
					if(self.person.avatar.Id == e.Id){
						self.changeSetAvatarButton(true);
					}
					else {
						self.changeSetAvatarButton(false);
					}
				} 
			}
		});
		var img = jQuery(obj).find('img');
		if(self.activePhoto) jQuery(self.activePhoto).css('border', '3px solid #EFE4B0');
		jQuery(img).css('border', '3px solid #444444');
		self.activePhoto = img;
	},
	getMedia:function(){
		var self = this;
		if(self.mediaConteiner == null) return false;
		var div = jQuery(self.mediaConteiner).find('.jmb-dtpe-media-conteiner');
		var ul = jQuery('<ul></ul>');
		jQuery(div).html('');
		jQuery(self.person.photos).each(function(index, element){
		var li = jQuery('<li><img id="'+element.Id+'" src="'+element.FilePath+'"></li>');
			jQuery(ul).append(li);
			jQuery(li).click(function(){
				self.setMediaInfo(this);
			});
		});
		jQuery(div).append(ul);
	},
	saveInfo:function(){
		var self = this;
		if(self.activePhoto == null) return;
		var id, date, photographer, description, circa, type, self, family, other;
		id = jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-avatar img').attr('id');
		date = jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-buttons input[type="text"][name="date"]').val()
		photographer = jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-buttons input[type="text"][name="photographer"]').val()
		description = jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-buttons textarea').val()
		circa = jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-buttons input[type="checkbox"][name="circa"]').attr('checked');
		circa = (circa)?'1':'0';
		self = jQuery(self.mediaConteiner).find('input[name="self"]').attr('checked');
		family = jQuery(self.mediaConteiner).find('input[name="family"]').attr('checked');
		other = jQuery(self.mediaConteiner).find('input[name="other"]').attr('checked');
		type = ((self)?'1':'0')+((family)?'1':'0')+((other)?'1':'0');
		var request = '{"id":"'+id+'","type":"'+type+'","date":"'+date+'","circa":"'+circa+'","photographer":"'+photographer+'","description":"'+description+'"}';
		this._ajax('updatePhoto', request, function(res){});
		
	},
	getActivePhotoId:function(){
		return jQuery(this.activePhoto).attr('id');
	},
	clearMediaInfoFields:function(){
		var self = this;
		jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-buttons input[type="text"][name="date"]').val('');
		jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-buttons input[type="text"][name="photographer"]').val('');
		jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-text textarea').val('');
		self.check('input[name="circa"]', '');
		self.check('input[name="self"]', '');
		self.check('input[name="family"]', '');
		self.check('input[name="other"]', '');
		jQuery(self.mediaConteiner).find('div.jmb-dtpe-media-avatar').html('&nbsp;');
	},
	media:function(p){
		var self = this;
		var html = '<table style="width:100%;">';
			html += '<tr>';
				html += '<td class="jmb-dtpe-media-avatar-box"><div class="jmb-dtpe-media-avatar"></div><span style="display:none;" name="set_avatar">Set Avatar</span><span style="display:none;" name="unset_avatar">Unset Avatar</span><span name="save">Save</span></td>';
				html += '<td valign="top"><div class="jmb-dtpe-media-buttons">'+this.getMediaButtonHTML()+'</div></td>';
			html += '</tr>';
			html += '<tr>';
				html += '<td colspan="2"><div class="jmb-dtpe-media-conteiner"></div></td>'
			html += '</tr>';
			html += '<tr>';
				html += '<td colspan="2"><div>'+this.getForm()+'<input name="upload" type="file"><input type="button" name="add" value="Add"></form><input type="button" name="delete" value="Delete"></div></td>'
			html += '</tr>';
		html += '</table>';
		var obj = jQuery(html);
		self.mediaConteiner = obj;
		//buttons
		jQuery(obj).find('input[type="button"][name="add"]').click(function(){
			if(jQuery(obj).find('input[type="file"][name="upload"]').val() != ''){
				jQuery(obj).find('#jmb_media_upload').submit();
			}
		});
		jQuery(obj).find('input[type="button"][name="delete"]').click(function(){
			if(self.activePhoto == null) return;
			var id = self.getActivePhotoId();
			var request = '{"Id":"'+id+'"}';
			self._ajax('deletePhoto',request,function(res){
				jQuery(self.activePhoto).remove();
				self.clearMediaInfoFields();
				jQuery(self.mediaConteiner).find('span[name="set_avatar"]').css('display','none');
				jQuery(self.mediaConteiner).find('span[name="unset_avatar"]').css('display','none');
				self.activePhoto = null;
			});
		});
		jQuery(obj).find('span[name="save"]').click(function(){
			self.saveInfo();
		});
		jQuery(obj).find('div.jmb-dtpe-media-buttons input[type="text"][name="date"]').datepick({
			dateFormat:"yyyy-mm-d",
			changeYear:true,
			yearRange: 'any'
		});
		jQuery(p).find('div[name="media"]').append(obj);
		//get photos
		self.getMedia();
	},	
	render:function(obj, container, person){
		var self = this;
		self.person = person;
		var tabs = '<div class="jmb-dtpe-tabs"><div type="add" class="jmb-dtpe-tabs-item">Add</div><div type="media" class="jmb-dtpe-tabs-item">Media</div><div type="details" class="jmb-dtpe-tabs-item active">Details</div></div>';
		var body = '<div class="jmb-dtpe-tabs-body"><div name="details" class="jmb-dtpe-tabs-body-item" style="display:block;"></div><div name="add" class="jmb-dtpe-tabs-body-item" style="display:none;"></div><div name="media" class="jmb-dtpe-tabs-body-item" style="display:none;"></div></div>';
		var html = '<div>'+tabs+body+'</div>'
		var p = jQuery(container).find('p').html(html);
		this.setTabs(p);
		this.details(p);
		this.media(p);
		this.add(p);
		
		
	}
}
