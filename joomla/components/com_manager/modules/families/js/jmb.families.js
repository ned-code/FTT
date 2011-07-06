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
		var html = '<div class="jmb-families-body">';
			html += '<table>';
				html += '<tr>';
					html += '<td style="width:170px;"><div style="width:150px;" class="jmb-families-header">&nbsp;</div></td>';
					html += '<td style="width:150px;"><div class="jmb-families-sircar">&nbsp;</div></td>';
					html += '<td style="width:90px;"><div class="jmb-families-event">&nbsp;</div></td>';
					html += '<td style="width:150px;"><div class="jmb-families-spouse">&nbsp;</div></td>';
					html += '<td style="width:170px;"><div class="jmb-families-spouse-container">&nbsp;</div></td>';
				html += '</tr>';
				html += '<tr>';
					html += '<td colspan="5" align="center"><div class="jmb-families-childs-container">&nbsp;</div></td>';
				html += '</tr>';
			html += '</table>';
		html += '</div>';
		return jQuery(html);
	},
	_getYear:function(data){
		if(data){
			return data.Year;
		}
		return false;
	},
	_getDate:function(obj){
		var self = this;
		var birth = self._getYear(obj.Birth);
		birth = (birth)?birth:'';
		var death = self._getYear(obj.Death);
		death = (death)?'-'+death:'';
		return birth+death;		
	},
	_getLongName:function(obj){
		return (obj.Nick=='')?obj.FirstName+' '+obj.LastName:obj.Nick+' '+obj.LastName;
	},
	_getName:function(obj){
		return (obj.Nick!='')?obj.Nick:obj.FirstName;
	},
	_getAvatar:function(obj, type, k){
		var x,y,fId,av,defImg;
		fId = obj.indiv.FacebookId;
		av = obj.avatar;
		defImg = (obj.indiv.Gender=="M")?'male.gif':'female.gif';
		if(type=="parent"){ x=Math.round(108*k);y=Math.round(120*k); } else if(type=="child"){ x=Math.round(72*k);y=Math.round(80*k); }
 		if(av != null && av.FilePath != null){
			return '<img height="'+y+'px" width="'+x+'px" src="'+av.FilePath+'">';
		}
		else if(fId != '0'){
			return '<img height="'+y+'px" width="'+x+'px" src="http://graph.facebook.com/'+fId+'/picture">';
		}
		var defImgPath = this.json.path+"/components/com_manager/modules/families/css/"+defImg;
		return '<img class="jmb-families-avatar" height="'+y+'px" width="'+x+'px" src="'+defImgPath+'">';
	},
	_createDivParent:function(obj, arrow, k){
		var person = obj.indiv;
		var self = this;
		var name = self._getLongName(person);
		var date = self._getDate(person);
		var html = '<div>';
			if(obj.parents != null && (obj.parents.fatherID != null || obj.parents.motherID != null)){
				html += '<div  id="'+person.Id+'" class="jmb-families-button parent active">&nbsp;</div>';
			} else {
				html += '<div  id="null" class="jmb-families-button parent">&nbsp;</div>';
			}
			html += '<div id="'+person.Id+'-view" type="imgContainer" class="jmb-families-parent-img">'+this._getAvatar(obj, 'parent', 1);
				html += '<div class="jmb-families-img-view parent" style="display:none;">&nbsp;</div>';
				html += '<div id="'+person.Id+'-edit" class="jmb-families-edit-button parent">&nbsp;</div>';
				if(obj.indiv.FacebookId != '0'){
					var imgPath = self.json.path+"/components/com_manager/modules/families/css/facebook_icon.png";
					html += '<div class="jmb-families-fb-icon parent" id="'+obj.indiv.FacebookId+'"><img src="'+imgPath+'" width="14x" height="14px"></div>';
				}
			html += '</div>';
			html += '<div>';
				html += '<div class="jmb-families-parent-name">'+name+'</div>';
				html += '<div class="jmb-families-parent-date">'+date+'</div>';
			html += '</div>';
			if(obj.spouses[0] != null || arrow == 'right') html += '<div class="jmb-families-arrow-'+arrow+'">&nbsp</div>';
		html += '</div>';
		return jQuery(html);
	},
	_createSpouse:function(obj){
		var person = obj.indiv;
		var self = this;
		var name = self._getLongName(person);
		var date = self._getDate(person);
		var html = '<div class="jmb-families-spouse-div">';
			html += '<div id="'+person.Id+'-view" type="imgContainer" class="jmb-families-parent-img">'+this._getAvatar(obj, 'parent', 1);
				html += '<div class="jmb-families-img-view parent" style="display:none;">&nbsp;</div>';
				html += '<div id="'+person.Id+'-edit" class="jmb-families-edit-button parent">&nbsp;</div>';
				if(obj.indiv.FacebookId != '0'){
					var imgPath = self.json.path+"/components/com_manager/modules/families/css/facebook_icon.png"
					html += '<div class="jmb-families-fb-icon parent" id="'+obj.indiv.FacebookId+'"><img src="'+imgPath+'" width="14px" height="14px"></div>'
				}
			html += '</div>';
			html += '<div>';
				html += '<div class="jmb-families-parent-name">'+name+'</div>';
				html += '<div class="jmb-families-parent-date">'+date+'</div>';
			html += '</div>';
		html += '</div>';
		return jQuery(html);
	},
	_createDivChild:function(obj, arrow, k){
		var person = obj.indiv
		var self = this;
		var html = '<div childId="'+person.Id+'" class="jmb-families-child" style="height:'+Math.round(170*k)+'px;">';
			html += '<div id="'+person.Id+'-view" type="imgContainer" class="jmb-families-child-img">'+this._getAvatar(obj, 'child', k);
				html += '<div class="jmb-families-img-view child" style="display:none;">&nbsp;</div>';
				var editButtonClass = (k!=1)?'jmb-families-edit-button child small':'jmb-families-edit-button child';
				html += '<div id="'+person.Id+'-edit" class="'+editButtonClass+'">&nbsp;</div>';
				if(obj.indiv.FacebookId != '0'){
					var imgPath = self.json.path+"/components/com_manager/modules/families/css/facebook_icon.png";
					html += '<div class="jmb-families-fb-icon child" id="'+obj.indiv.FacebookId+'"><img src="'+imgPath+'" width="14px" height="14px"></div>';
				}
			html += '</div>';
			html += '<div><div class="jmb-families-child-name">'+self._getName(person)+'</div><div class="jmb-families-child-date">'+self._getDate(person)+'</div></div>';
			if(jQuery(obj.spouses).length != 0){
				var buttonChild = (k!=1)?'jmb-families-button childs active small':'jmb-families-button childs active';
				html += '<div id="'+person.Id+'" class="'+buttonChild+'">&nbsp;</div>'; 
			} else {
				var buttonChild = (k!=1)?'jmb-families-button childs small':'jmb-families-button childs';
				html += '<div id="null" class="'+buttonChild+'">&nbsp;</div>'; 
			}
			var arrowClass = (k!=1)?'jmb-families-arrow-'+arrow+' small':'jmb-families-arrow-'+arrow;
			html += '<div class="'+arrowClass+'">&nbsp</div>';
		return jQuery(html);
	},
	_createDivInfo:function(obj){
		if(!obj) return;
		var self = this;
		var year = (obj.Year)?obj.Year:'';
		var place = (obj.Place.Hierarchy != null)?obj.Place.Hierarchy[0].Name:'';
		var html = '<div>';
			html += '<div>'+year+'</div>';
			html += '<div>'+place+'</div>';
		html += '</div>';
		return jQuery(html);
	},
	render:function(obj){
		var self = this;
		if(self.div != null) jQuery(self.div).remove();

		var div = self._createDiv();
		self.div = div;
		
		jQuery(self.parent).append(div);
		
		//sircar space
		var sircarDiv = self._createDivParent(obj, 'left', 1);
		jQuery(div).find('.jmb-families-sircar').append(sircarDiv);
		
		if(obj.spouses){
			//info space
			var infoDiv = self._createDivInfo(obj.spouses[0].FamEvents);
			jQuery(div).find('.jmb-families-event').append(infoDiv);
			
			//spouse space
			jQuery(obj.spouses).each(function(i,e){
				if(!obj.spouses[i].id) return;
				if(i == 0) { 
					var spouseDiv = self._createDivParent(self.json.individs[obj.spouses[0].id], 'right', 1); 
					jQuery(div).find('.jmb-families-spouse').append(spouseDiv);
				} else {
					var spouses = self._createSpouse(self.json.individs[obj.spouses[i].id]);
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
			var childDiv = self._createDivChild(self.json.individs[element.id], 'up', (childLength<10||(childLength>10&&childLength<20))?1:0.9);
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
		//view profile
		jQuery(div).find('div[type="imgContainer"]').each(function(i,e){
			jQuery(e)
			.mouseenter(function(){
				jQuery(e).find('.jmb-families-img-view').show();
			})
			.mouseleave(function(){
				//jQuery(e).find('.jmb-families-img-view').css("top", "0px").css("left", "0px").hide();
				jQuery(e).find('.jmb-families-img-view').hide();
			});
		})
		//when we click to view button
		jQuery(div).find('div.jmb-families-img-view').each(function(i,e){
			self.profile.tooltip.render({
				target: jQuery(e),
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
