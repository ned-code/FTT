function JMBFamiliesObject(obj){
	var self = this;
	obj = jQuery("#"+obj);

	this.parent = obj;
	this.storage = {};
	this.div = null;
	this.btActive = null;
	this.viewActive = null;
	this.viewFlag = false;
	this.profile = new JMBProfile();
	
	this.json = null;
	this.individs = null;
	this.objects = null;
	this.ownerId = null;
	
	this._ajax('getFamilies', null, function(res){
		var json = jQuery.parseJSON(res.responseText);
		self.json = json;
		self.individs = json.individs;
		self.objects = json.objects;
		for(var key in json.objects){
			self.ownerId = key;
			break;
		}
		var obj = json.objects[self.ownerId]; 
		if(obj.childrens.length==0&&obj.spouses&&obj.spouses[0]==null&&json.individs[obj.indKey].parents!=null){
			self.click(self.ownerId, true);
			return;
		} else {
			self.render(json.objects[self.ownerId]);
		}
	});
	
	storage.addEvent(storage.tabs.clickPull, function(object){
		self.profile.cleaner();
	})

	storage.header.famLine.hide();
}
JMBFamiliesObject.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("families", "JMBFamilies", func, params, function(res){
				callback(res);
		})
	},
	_createDiv:function(){
		var sb = host.stringBuffer();
		sb._('<div class="jmb-families-body">');
			sb._('<table width="100%">');
				sb._('<tr>');
					sb._('<td style="width:170px;"><div style="width:150px;" class="jmb-families-header">&nbsp;</div></td>');
					sb._('<td style="width:150px;"><div class="jmb-families-sircar">&nbsp;</div></td>');
					sb._('<td style="width:90px;"><div class="jmb-families-event">&nbsp;</div></td>');
					sb._('<td style="width:150px;"><div class="jmb-families-spouse">&nbsp;</div></td>');
					sb._('<td style="width:170px;"><div class="jmb-families-spouse-container">&nbsp;</div></td>');
				sb._('</tr>');
				sb._('<tr>');
					sb._('<td colspan="5" align="center"><div class="jmb-families-childs-container">&nbsp;</div></td>');
				sb._('</tr>');
			sb._('</table>');
			sb._('<div class="home">&nbsp;</div>');
		sb._('</div>');
		return jQuery(sb.result());
	},
	_isEmpty:function(v){
		return (v==null||v.length==0)?true:false;
	},
	_getYear:function(data){
		if(data){
			return data.From.Year;
		}
		return false;
	},
	_getDate:function(obj){
		var self = this;
		var birth = self._getYear(obj.Birth[0]);
		birth = (birth)?birth:'';
		var death = self._getYear(obj.Death[0]);
		death = (death)?'-'+death:'';
		return birth+death;		
	},
	_getLongName:function(obj){
		if(!obj) return '';
		return (this._isEmpty(obj.Nick))?obj.FirstName+' '+obj.LastName:obj.Nick+' '+obj.LastName;
	},
	_getName:function(obj){
		return (this._isEmpty(obj.Nick))?obj.FirstName:obj.Nick;
	},
	_getAvatar:function(obj, type, k){
		var sb = host.stringBuffer();
		var x,y,fId,av,defImg;
		fId = obj.indiv.FacebookId;
		av = obj.avatar;
		defImg = (obj.indiv.Gender=="M")?'male.png':'female.png';
		if(type=="parent"){ x=Math.round(108*k);y=Math.round(120*k); } else if(type=="child"){ x=Math.round(72*k);y=Math.round(80*k); }
 		if(av != null && av.FilePath != null){
			return sb.clear()._('<img class="jmb-families-avatar view" src="index.php?option=com_manager&task=getResizeImage&id=')._(av.Id)._('&w=')._(x)._('&h=')._(y)._('">').result();
		}
		else if(fId != '0'){
			return sb.clear()._('<img class="jmb-families-avatar view" src="index.php?option=com_manager&task=getResizeImage&fid=')._(fId)._('&w=')._(x)._('&h=')._(y)._('">').result();
		}
		var defImgPath = sb.clear()._(this.json.path)._("/components/com_manager/modules/families/css/")._(defImg).result();
		return sb.clear()._('<img class="jmb-families-avatar view" height="')._(y)._('px" width="')._(x)._('px" src="')._(defImgPath)._('">').result()
	},
	_createDivParent:function(obj, arrow, k){
		var self,data, person, name, date, sb, imgPath, indKey;
		self = this;
		indKey = obj.indKey;
		data = self.individs[indKey];
		person = self.individs[indKey].indiv;
		if(!person) return;
		name = self._getLongName(person);
		date = self._getDate(person);
		sb = host.stringBuffer();
		sb._('<div>');
			if(obj.parents != null && (obj.parents.father||obj.parents.mother)){
				sb._('<div  id="')._(person.Id)._('" class="jmb-families-button parent active">&nbsp;</div>');
			} else {
				sb._('<div  id="null" class="jmb-families-button parent">&nbsp;</div>');
			}
			sb._('<div id="')._(person.Id)._('-view" type="imgContainer" class="jmb-families-parent-img">')._(this._getAvatar(data, 'parent', 1));
				sb._('<div id="')._(person.Id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
				if(person.FacebookId != '0'){
					imgPath = self.json.path+"/components/com_manager/modules/families/css/facebook.gif";
					sb._('<div class="jmb-families-fb-icon parent" id="')._(person.FacebookId)._('"><img src="')._(imgPath)._('" width="18x" height="18px"></div>');
				}
			sb._('</div>');
			sb._('<div>');
				sb._('<div class="jmb-families-parent-name">')._(name)._('</div>');
				sb._('<div class="jmb-families-parent-date">')._(date)._('</div>');
			sb._('</div>');
			if(data.spouses[0] != null || arrow == 'right') sb._('<div class="jmb-families-arrow-')._(arrow)._('">&nbsp</div>');
		sb._('</div>');
		return jQuery(sb.result());
	},
	_createSpouse:function(obj){
		var self,data, person, name, date, sb, imgPath, indKey;
		self = this;
		indKey = obj.indKey;
		data = self.individs[indKey];
		person = self.individs[indKey].indiv;
		if(!person) return;
		name = self._getLongName(person);
		date = self._getDate(person);
		sb = host.stringBuffer();
		sb._('<div class="jmb-families-spouse-div">');
			sb._('<div id="')._(person.Id)._('-view" type="imgContainer" class="jmb-families-parent-img">')._(this._getAvatar(data, 'parent', 1));
				sb._('<div id="')._(person.Id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
				if(person.FacebookId != '0'){
					var imgPath = self.json.path+"/components/com_manager/modules/families/css/facebook.gif";
					sb._('<div class="jmb-families-fb-icon parent" id="')._(person.FacebookId)._('"><img src="')._(imgPath)._('" width="18px" height="18px"></div>');
				}
			sb._('</div>');
			sb._('<div>');
				sb._('<div class="jmb-families-parent-name">')._(name)._('</div>');
				sb._('<div class="jmb-families-parent-date">')._(date)._('</div>');
			sb._('</div>');
		sb._('</div>');
		return jQuery(sb.result());
	},
	_createDivChild:function(obj, arrow, k){
		var self, data, person, sb, editButtonClass, imgPath, date, buttonChild, arrowClass;
		self = this;
		data = self.individs[obj.indKey];
		person = self.individs[obj.indKey].indiv;
		sb = host.stringBuffer();
		sb._('<div childId="')._(person.Id)._('" class="jmb-families-child" style="height:')._(Math.round(170*k))._('px;">');
		sb._('<div id="')._(person.Id)._('-view" type="imgContainer" style="height:')._(Math.round(80*k))._('px;width:')._(Math.round(72*k))._('px;" class="jmb-families-child-img">')._(this._getAvatar(data, 'child', k));	
				editButtonClass = (k!=1)?'jmb-families-edit-button child small':'jmb-families-edit-button child';
				sb._('<div id="')._(person.Id)._('-edit" class="')._(editButtonClass)._('">&nbsp;</div>');
				if(person.FacebookId != '0'){
					imgPath = self.json.path+"/components/com_manager/modules/families/css/facebook.gif";
					sb._('<div class="jmb-families-fb-icon child" id="')._(person.FacebookId)._('"><img src="')._(imgPath)._('" width="18px" height="18px"></div>');
				}
			sb._('</div>')
			sb._('<div>');
				sb._('<div class="jmb-families-child-name">')._(self._getName(person))._('</div>');
				date = self._getDate(person);
				if(date.length!=0) sb._('<div class="jmb-families-child-date">')._(self._getDate(person))._('</div>');
			sb._('</div>');
			if((jQuery(obj.spouses).length != 0&&obj.spouses[0]!=null)||jQuery(obj.children).length != 0){
				buttonChild = (k!=1)?'jmb-families-button childs active small':'jmb-families-button childs active';
				sb._('<div id="')._(person.Id)._('" class="')._(buttonChild)._('">&nbsp;</div>');
			} else {
				buttonChild = (k!=1)?'jmb-families-button childs small':'jmb-families-button childs';
				sb._('<div id="null" class="')._(buttonChild)._('">&nbsp;</div>');
			}
			arrowClass = (k!=1)?'jmb-families-arrow-'+arrow+' small':'jmb-families-arrow-'+arrow;
			sb._('<div class="')._(arrowClass)._('">&nbsp</div>');
			if(date.length==0) sb._('<div>&nbsp;</div>');
		return jQuery(sb.result());
	},
	_createDivInfo:function(obj){
		if(!obj) return;
		var self = this;
		var sb = host.stringBuffer();
		var event = false;
		jQuery(obj).each(function(i,e){
			if(e.Type == 'MARR') event = e;
		});
		if(!event) return '';
		var year = (event.From.Year)?event.From.Year:'';
		var place = event.Place;
		var location = (place)?place.Locations[0]:{ Country:'' };
		sb._('<div>');
			sb._('<div>')._(year)._('</div>');
			sb._('<div>')._(location.Country)._('</div>');
		sb._('</div>');
		return jQuery(sb.result());
	},
	sortChildrens:function(childrens){
		var self = this;
		var get_year = function(object){
			var indiv = (object&&object.indiv!=null)?object.indiv:false;
			var event = (indiv&&indiv.Birth.length!=0&&indiv.Birth[0]!=null)?indiv.Birth[0]:false;
			return (event&&event.From!=null&&event.From.Year!=null)?event.From.Year:false; 
		}
		childrens.sort(function(a,b){		
			var a_year = get_year(self.individs[a.indKey]);
			var b_year = get_year(self.individs[b.indKey]);
			return (a_year&&b_year)?a_year-b_year:0;
		})
		return childrens;
	},
	render:function(obj){
		var self = this;
		if(self.div != null) jQuery(self.div).remove();

		var div = self._createDiv();
		self.div = div;
		
		jQuery(self.parent).append(div);
		
		jQuery(self.parent).find('div.home').click(function(){
			var obj = self.objects[self.ownerId];
			self.render(obj);
		})
		
		storage.header.famLine.show();
		var famLine =  self.individs[obj.indKey].indiv.FamLine;
		if(famLine.length == 2){
			famLine = 'all';
		} else {
			famLine = (famLine[0].type=='m')?['mother']:['father'];
		}	
		storage.header.famLine.mode({
			enabled:false,
			click:false,
			active:famLine
		});
		
		//sircar space
		var sircarDiv = self._createDivParent(obj, 'left', 1);
		jQuery(div).find('.jmb-families-sircar').append(sircarDiv);

		if(obj.spouses&&jQuery(obj.spouses).length!=0){
			var data = self.individs[obj.indKey];
			//info space
			if(data.spouses.length>0){
				var infoDiv = self._createDivInfo(data.spouses[0].event);
				jQuery(div).find('.jmb-families-event').append(infoDiv);
				
				//spouse space
				jQuery(obj.spouses).each(function(i,e){
					if(!e) return;
					if(i == 0) { 
						var spouseDiv = self._createDivParent(e, 'right', 1); 
						jQuery(div).find('.jmb-families-spouse').append(spouseDiv);
					} else {
						var spouses = self._createSpouse(e);
						jQuery(div).find('.jmb-families-spouse-container').append(spouses);
					}
				});
			}
		}

		
		
		//children array	
		var childLength = jQuery(obj.childrens).length;
		var childsTable = jQuery('<table align="center" width="100%"><tr><td></td></tr><tr><td></td></tr></table>');
		var count = (childLength >10 && childLength <20)? Math.round(childLength/2) :10;
		jQuery(div).find('.jmb-families-childs-container').append(childsTable);
		jQuery(this.sortChildrens(obj.childrens)).each(function(index, element){
			if(element.indKey==null) return;
			var childDiv = self._createDivChild(element, 'up', (childLength<10||(childLength>10&&childLength<20))?1:0.9);
			jQuery(childsTable[0].rows[(index<count)?0:1].cells[0]).append(childDiv);
			//self.effectChild(childDiv, index+1);			
		});
				
		//up or down in tree
		jQuery(div).find('.jmb-families-button').each(function(index, element){
			jQuery(element).click(function(){
				var id = jQuery(this).attr('id');
				if(id == 'null') return false;
				var type = jQuery(this).hasClass('parent');
				self.click(id, type);
			});
		});
		//when we click in avatar
		jQuery(div).find('.jmb-families-avatar.view').each(function(i,e){
			self.profile.tooltip.render({
				target: e,
				id: jQuery(e).parent().attr('id'),
				type: 'mini',
				data: self.json.individs[jQuery(e).parent().attr('id').split('-')[0]],
				imgPath:self.json.path,
				fmbUser:self.json.fmbUser,
				eventType:'click',
				parent:document.body
			});	
		})
		//when we click to edit button
		jQuery(div).find('.jmb-families-edit-button').each(function(i,e){
			self.profile.tooltip.render({
				target: e,
				id:jQuery(e).attr('id'),
				type: 'tooltip',
				data: self.json.individs[jQuery(e).attr('id').split('-')[0]],
				imgPath:self.json.path,
				fmbUser:self.json.fmbUser,
				eventType:'click',
				parent:document.body,
				beforeClose:function(){
					return;
					self._ajax('getFamiliesObject', jQuery(e).attr('id').split('-')[0], function(res){
						var json = jQuery.parseJSON(res.responseText);
						self.profile.tooltip.cleaner();
						self.render(obj);
					});
				}
			});
		});
		//when we click in facebook icon
		jQuery(div).find('.jmb-families-fb-icon').each(function(i,e){
			jQuery(e).click(function(){
				var id = jQuery(e).attr('id');
				window.open('http://www.facebook.com/profile.php?id='+id,'new','width=320,height=240,toolbar=1')
			});
		});
	},
	getParentId:function(id){
		var params =(jQuery(storage.header.activeButton).text()=='My Father')?'fatherID':'motherID';	
		var sub = (params=='father')?'motherID':'fatherID';
		return (this.individs[id].parents[params]!=null)?this.individs[id].parents[params]:this.individs[id].parents[sub];
	},
	click:function(id, type){
		var indKey = (type)?this.getParentId(id):id;
		if(this.objects[indKey]){
			this.profile.tooltip.cleaner();
			this.render(this.objects[indKey]);	
		} else {
			var self = this;
			this._ajax('getFamiliesObject', indKey, function(res){
				var json = jQuery.parseJSON(res.responseText);
				self.individs = jQuery.extend(self.individs, json.individs);
				self.objects = jQuery.extend(self.objects, json.objects);
				self.render(json.objects[indKey]);
			});	
		}		
	}
}
