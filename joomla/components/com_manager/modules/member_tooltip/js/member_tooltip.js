function TipsyTooltip(obj){
	this.container = obj;
	this.tipsyObj = false;
	this.profileEdit = new MemberProfileEdit(false);
}

TipsyTooltip.prototype = {
	setTooltip:function(obj){
		var self = this;
		jQuery(obj).mouseover(function(e){
				if(self.tipsyObj) self.hide();
				jQuery(obj).tipsy({
					opacity: 1,
					trigger: 'manual',
					html: true,
					gravity: jQuery.fn.tipsy.autoWE,
					title: function(){
						//return self._getTitle(req.responseXML);
						return self._getTitle(obj);
					}					
				});
				jQuery(obj).tipsy('show');
				jQuery(jQuery(obj).tipsy('getTipsyObj').jQuerytip).find('.tipsy-inner').mouseleave(function(e){
					self.hide();
				});
				jQuery('.jmbtabs a').each(function(index, value){
					jQuery(this).click(function(){
						self.hide();
					});
				})
				
				jQuery(jQuery(obj).tipsy('getTipsyObj').jQuerytip).find('.tipsy-inner-body-expand').click(function(e){
					self.hide();
					if(self.profile == undefined||self.profile == null){
                                            jQuery('body').append('<div id="jquery-overlay2"></div>');

                                            jQuery('#jquery-overlay2').css({
                                                zIndex:1000,
                                                    backgroundColor:	'rgb(0,0,0)',
                                                    opacity:			'0.8',
                                                    width:				window.clientWidth,
                                                    height:				'100%'//arrPageSizes[1]
                                            }).fadeIn();
                                            var overlay = document.getElementById('jquery-overlay2');
                                            overlay.setAttribute('level','1');

                                            var dialog = document.createElement('div');
                                            dialog.id = 'dialog';
                                            dialog.style.display = 'none';
                                            document.body.appendChild(dialog);

                                            dialog.appendChild(self._createPersonsInfoContainer());

                                            jQuery("#dialog").css({paddingLeft:'0px',
                                                                overflow:'hidden'
                                                                });
                                            jQuery("#dialog").dialog();
                                            jQuery("#dialog").dialog({height: 545});
                                            jQuery("#dialog").dialog({width: 700});
                                            jQuery("#dialog").dialog({closeText: 'Close'});
                                            jQuery("#dialog").dialog( "option", "closeText", 'show' );
                                            jQuery("#dialog").dialog({ closeOnEscape: false });

                                            jQuery( "#dialog" ).dialog({
                                               beforeClose: function(event, ui) {
                                                    if(profile_object.editor.confirmOpened) return false
                                                    else return true;
                                                },
                                               close: function(event, ui) {
                                                   jQuery( "#dialog" ).dialog( "destroy" );
                                                   self.profile = null;

                                                   var overlay = document.getElementById('jquery-overlay2');
                                                   document.body.removeChild(overlay);
                                                   profile_object.editor.drop();
                                                   profile_object = null;
                                                   document.body.removeChild(document.getElementById('dialog'));
                                               }
                                            });
                                            self.profile = new Profile(dialog.childNodes[0].id);
                                        }

					self.profile.personId = jQuery(obj).attr('id');
                                        self.profile.personFam = jQuery(obj).attr('fam_id');
					self.profile.refresh(function(){
                                            var name = '';
                                            if(document.getElementById('profile_name'))
                                                name = document.getElementById('profile_name').innerHTML + "'s ";
                                            jQuery("#dialog").dialog({title: name + "Profile info"});
                                        });
				});
				
				var button = jQuery(jQuery(obj).tipsy('getTipsyObj').jQuerytip).find('.tipsy-inner-body-expand');
				/*
				self.profileEdit.load({
					button:button,
					json:jQuery(obj).attr('id'),
					comparisonObj: self.container,
					hideObject: self,
					xOffset: 25
				}, function(){});
				*/
				self.tipsyObj = obj;	
		});
	},
	hide:function(){
		if (this.tipsyObj)
			jQuery(this.tipsyObj).tipsy('hide');
		else
			this.tipsyObj = false;
	},
	_createPersonsInfoContainer:function(){
		var div = document.createElement('div');
		jQuery(div).attr('id', 'person_info');
		jQuery(div).width('700px');
		jQuery(div).height('550px');
            
		return div;
	},
	_getTitle:function(obj){
		var p = this._parseParams(obj);
		var s = this._createObjectString(p);
		var div = jQuery(s);
		return jQuery(div).html();
	},
	_parseParams:function(obj){
		var diedFlag;
		if(jQuery(obj).attr('died').split(';')[0] == '' && jQuery(obj).attr('age') <= 120)
			diedFlag = false;
		else 
			diedFlag = true;
		var p = {
			id:jQuery(obj).attr('id'),
			name:jQuery(obj).text(),
			age:jQuery(obj).attr('age'),
			born:{
				date:jQuery(obj).attr('born').split(';')[0],
				city:jQuery(obj).attr('born').split(';')[1],
				country:jQuery(obj).attr('born').split(';')[2],
				flag:true
			},
			died:{
				date:jQuery(obj).attr('died').split(';')[0],
				city:jQuery(obj).attr('died').split(';')[1],
				country:jQuery(obj).attr('died').split(';')[2],
				flag:diedFlag
			},
			img_path:jQuery(obj).attr('img_path')
		};
		return p;
	},
	_setImage:function(p){
		return 	p.img_path;
	},
	_createObjectString:function(p){
		var objString = '<div>';
			objString += '<div class="tipsy-inner-header">'+p.name+'</div>';
			objString += '<div class="tipsy-inner-body">';
				objString += '<table>';
					objString += '<tr>';
					objString += '<td class="tipsy-inner-body-img" rowspan="2"><img height="100px" width="100px" active="0" src="'+this._setImage(p)+'"></td>';
						objString += '<td class="tipsy-inner-body-data">';
							if(!p.died.flag) objString += '<div>Age: '+p.age+' years old</div>';
							if(p.born.flag){
								objString += '<div>Born:';
								if(p.born.date != '')
									objString += ' '+p.born.date;
								else
									objString += ' unknown'
								if(p.born.city != '') objString += ' in '+p.born.city;
								if(p.born.country != '') objString += ' ('+p.born.country+')';
								objString += '</div>';
							}
							if(p.died.flag){
								objString += '<div>Died:';
								if(p.died.date != '') 
									objString += ' '+p.died.date;
								else
									objString += ' unknown';
								if(p.died.city != '') objString += ' in '+p.died.city;
								if(p.died.country != '') objString += ' ('+p.died.country+')';
								objString += '</div>';
							}
						objString += '</td>';
					objString += '</tr>';
					objString += '<tr>';
						objString += '<td><div id="'+p.id+'" class="tipsy-inner-body-expand"><b>EXPAND</b></div></td>';
					objString += '</tr>';
				objString += '</table>';
			objString += '</div>';
		objString += '</div>';
		return objString;
	}

}
