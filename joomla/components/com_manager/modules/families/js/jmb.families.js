function Families(obj){
	var self = this;
	obj = jQuery("#"+obj);

	this.parent = obj;
	this.storage = {};
	this.json = null;
	this.div = null;
	this.btActive = null;
	this.viewActive = null;
	this.viewFlag = false;
	this.profile = new JMBProfile();
	
	var params =  (jQuery(storage.header.activeButton).text()=='My Father')?'father':'mother';
	this._ajax('getFamilies', params, function(res){
		var json = jQuery.parseJSON(res.responseText);
		self.json = json;
		var obj = json.individs[json.firstParent];
		self.render(obj);
	});
	
	storage.addEvent(storage.tabs.clickPull, function(object){
		self.profile.cleaner();
	})
}
Families.prototype = {
	_ajax:function(func, params, callback){
		host.callMethod("families", "Families", func, params, function(res){
				callback(res);
		})
	},
	_createDiv:function(){
		var sb = host.stringBuffer();
		sb._('<div class="jmb-families-body">');
			sb._('<table>');
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
		defImg = (obj.indiv.Gender=="M")?'male.gif':'female.gif';
		if(type=="parent"){ x=Math.round(108*k);y=Math.round(120*k); } else if(type=="child"){ x=Math.round(72*k);y=Math.round(80*k); }
 		if(av != null && av.FilePath != null){
			//return sb.clear()._('<img height="')._(y)._('px" width="')._(x)._('px" src="')._(av.FilePath)._('">').result();
			//return sb.clear()._('<img class="jmb-families-avatar view" height="')._(y)._('px" width="')._(x)._('px" src="index.php?option=com_manager&task=getResizeImage&id=')._(av.Id)._('">').result();
			return sb.clear()._('<img class="jmb-families-avatar view" src="index.php?option=com_manager&task=getResizeImage&id=')._(av.Id)._('&w=')._(x)._('&h=')._(y)._('">').result();
		}
		else if(fId != '0'){
			//return sb.clear()._('<img class="jmb-families-avatar view" height="')._(y)._('px" width="')._(x)._('px" src="http://graph.facebook.com/')._(fId)._('/picture">').result();
			return sb.clear()._('<img class="jmb-families-avatar view" src="index.php?option=com_manager&task=getResizeImage&fid=')._(fId)._('&w=')._(x)._('&h=')._(y)._('">').result();
		}
		var defImgPath = sb.clear()._(this.json.path)._("/components/com_manager/modules/families/css/")._(defImg).result();
		return sb.clear()._('<img class="jmb-families-avatar view" height="')._(y)._('px" width="')._(x)._('px" src="')._(defImgPath)._('">').result()
	},
	_createDivParent:function(obj, arrow, k){
		var person = obj.indiv;
		var self = this;
		var name = self._getLongName(person);
		var date = self._getDate(person);
		var sb = host.stringBuffer();
		sb._('<div>');
			if(obj.parents != null && (obj.parents.fatherID != null || obj.parents.motherID != null)){
				sb._('<div  id="')._(person.Id)._('" class="jmb-families-button parent active">&nbsp;</div>');
			} else {
				sb._('<div  id="null" class="jmb-families-button parent">&nbsp;</div>');
			}
			sb._('<div id="')._(person.Id)._('-view" type="imgContainer" class="jmb-families-parent-img">')._(this._getAvatar(obj, 'parent', 1));
				sb._('<div id="')._(person.Id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
				if(obj.indiv.FacebookId != '0'){
					var imgPath = self.json.path+"/components/com_manager/modules/families/css/facebook.gif";
					sb._('<div class="jmb-families-fb-icon parent" id="')._(obj.indiv.FacebookId)._('"><img src="')._(imgPath)._('" width="18x" height="18px"></div>');
				}
			sb._('</div>');
			sb._('<div>');
				sb._('<div class="jmb-families-parent-name">')._(name)._('</div>');
				sb._('<div class="jmb-families-parent-date">')._(date)._('</div>');
			sb._('</div>');
			if(obj.spouses[0] != null || arrow == 'right') sb._('<div class="jmb-families-arrow-')._(arrow)._('">&nbsp</div>');
		sb._('</div>');
		return jQuery(sb.result());
	},
	_createSpouse:function(obj){
		var person = obj.indiv;
		var self = this;
		var sb = host.stringBuffer();
		var name = self._getLongName(person);
		var date = self._getDate(person);
		sb._('<div class="jmb-families-spouse-div">');
			sb._('<div id="')._(person.Id)._('-view" type="imgContainer" class="jmb-families-parent-img">')._(this._getAvatar(obj, 'parent', 1));
				sb._('<div id="')._(person.Id)._('-edit" class="jmb-families-edit-button parent">&nbsp;</div>');
				if(obj.indiv.FacebookId != '0'){
					var imgPath = self.json.path+"/components/com_manager/modules/families/css/facebook.gif";
					sb._('<div class="jmb-families-fb-icon parent" id="')._(obj.indiv.FacebookId)._('"><img src="')._(imgPath)._('" width="18px" height="18px"></div>');
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
		var person = obj.indiv
		var self = this;
		var sb = host.stringBuffer();
		sb._('<div childId="')._(person.Id)._('" class="jmb-families-child" style="height:')._(Math.round(170*k))._('px;">');
			sb._('<div id="')._(person.Id)._('-view" type="imgContainer" style="height:')._(Math.round(80*k))._('px;" class="jmb-families-child-img">')._(this._getAvatar(obj, 'child', k));	
				var editButtonClass = (k!=1)?'jmb-families-edit-button child small':'jmb-families-edit-button child';
				sb._('<div id="')._(person.Id)._('-edit" class="')._(editButtonClass)._('">&nbsp;</div>');
				if(obj.indiv.FacebookId != '0'){
					var imgPath = self.json.path+"/components/com_manager/modules/families/css/facebook.gif";
					sb._('<div class="jmb-families-fb-icon child" id="')._(obj.indiv.FacebookId)._('"><img src="')._(imgPath)._('" width="18px" height="18px"></div>');
				}
			sb._('</div>')
			sb._('<div>');
				sb._('<div class="jmb-families-child-name">')._(self._getName(person))._('</div>');
				var date = self._getDate(person);
				if(date.length!=0) sb._('<div class="jmb-families-child-date">')._(self._getDate(person))._('</div>');
			sb._('</div>');
			
			
			if(jQuery(obj.spouses).length != 0||jQuery(obj.children).length != 0){
				var buttonChild = (k!=1)?'jmb-families-button childs active small':'jmb-families-button childs active';
				sb._('<div id="')._(person.Id)._('" class="')._(buttonChild)._('">&nbsp;</div>');
			} else {
				var buttonChild = (k!=1)?'jmb-families-button childs small':'jmb-families-button childs';
				sb._('<div id="null" class="')._(buttonChild)._('">&nbsp;</div>');
			}
			var arrowClass = (k!=1)?'jmb-families-arrow-'+arrow+' small':'jmb-families-arrow-'+arrow;
			sb._('<div class="')._(arrowClass)._('">&nbsp</div>');
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
		var location = place.Locations[0];
		sb._('<div>');
			sb._('<div>')._(year)._('</div>');
			sb._('<div>')._(location.Country)._('</div>');
		sb._('</div>');
		return jQuery(sb.result());
	},
	render:function(obj){
		var self = this;
		if(self.div != null) jQuery(self.div).remove();

		var div = self._createDiv();
		self.div = div;
		
		jQuery(self.parent).append(div);
		
		jQuery(self.parent).find('div.home').click(function(){
			var obj = self.json.individs[self.json.firstParent];
			self.render(obj);
		})
		
		//sircar space
		var sircarDiv = self._createDivParent(obj, 'left', 1);
		jQuery(div).find('.jmb-families-sircar').append(sircarDiv);
		
		if(obj.spouses&&jQuery(obj.spouses).length!=0){
			//info space
			var infoDiv = self._createDivInfo(obj.spouses[0].event);
			jQuery(div).find('.jmb-families-event').append(infoDiv);
			
			//spouse space
			jQuery(obj.spouses).each(function(i,e){
				if(!e.id) return;
				if(i == 0) { 
					var spouseDiv = self._createDivParent(self.json.individs[e.id], 'right', 1); 
					jQuery(div).find('.jmb-families-spouse').append(spouseDiv);
				} else {
					var spouses = self._createSpouse(self.json.individs[e.id]);
					jQuery(div).find('.jmb-families-spouse-container').append(spouses);
				}
			});
		}

		//children array	
		var childLength = jQuery(obj.children).length;
		var childsTable = jQuery('<table align="center" width="100%"><tr><td></td></tr><tr><td></td></tr></table>');
		var count = (childLength >10 && childLength <20)? Math.round(childLength/2) :10;
		jQuery(div).find('.jmb-families-childs-container').append(childsTable);
		jQuery(obj.children).each(function(index, element){
			if(element.gid==null) return;
			var childDiv = self._createDivChild(self.json.individs[element.gid], 'up', (childLength<10||(childLength>10&&childLength<20))?1:0.9);
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
					self._ajax('getFamilies', 'mother', function(res){
						var json = jQuery.parseJSON(res.responseText);
						self.json = json;
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
	_getLink:function(id, type){
		var self = this;
		var father = self.json.individs[id].parents.fatherID;
		var mother = self.json.individs[id].parents.motherID;
		var pId = (father)?father:mother;
		var rId = (type)?pId:id;
		return self.json.individs[rId];
	},
	click:function(id, type){
		var self = this;
		var link = self._getLink(id, type);
		self.profile.tooltip.cleaner();
		self.render(link);		
	}
}
