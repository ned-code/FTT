function DescendantTreeProfile(parent){
	var	module = this;
	
	module.parent = parent;
	module.cont = parent.profile_container;
}

DescendantTreeProfile.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("descendant_tree", "JMBDescendantTree", func, params, function(res){
				callback(res);
		})
	},
	clear:function(){
		var	module = this;
		jQuery(module.cont).html('');	
		storage.tooltip.cleaner();
	},
	avatar:function(object){
		var	module = this,
			sb = host.stringBuffer(),
			user = object.user,
			facebook_id = user.facebook_id,
			media = object.media,
			image = (user.gender!='M')?'female.png':'male.png',
			src = module.parent.imgPath+image;
		//get avatar image
		if(media!=null&&media.avatar!=null){
			return sb._('<img src="index.php?option=com_manager&task=getResizeImage&id=')._(media.avatar.media_id)._('&w=72&h=80">').result(); 
		}
		//get facebook image
		if(facebook_id !== '0'){
			return sb._('<img src="index.php?option=com_manager&task=getResizeImage&fid=')._(facebook_id)._('&w=72&h=80">').result();
		}
		//get default image
		return sb._('<img height="80px" width="72px" src="')._(src)._('">').result();
	},
	image:function(img){
		var	module = this,
			sb = host.stringBuffer();
		return sb._('<a href="')._(img.path)._('" rel="prettyPhoto[pp_gal]" title=""><img src="index.php?option=com_manager&task=getResizeImage&id=')._(img.media_id)._('&w=50&h=50" alt="" /></a>').result();
	},
	create:function(ch){
		var	module = this,
			sb = host.stringBuffer(),
			language = module.parent.lang,
			user = ch.user,
			media = ch.media,
			parse = storage.usertree.parse(ch),
			html;
		sb._('<div id="jmb-dtp-container" class="jmb-dtp-container">');
			sb._('<div class="jmb-dtp-body">');
				sb._('<div class="jmb-dtp-body-info">');
					sb._('<table>');
						sb._('<tr>');
							sb._('<td><div class="jmb-dtp-body-info-avatar">');
								sb._(module.avatar(ch));
								sb._('<div id="edit-button" class="jmb-dtp-body-edit-button">&nbsp;</div>');
								if(parse.facebook_id != '0'){
									sb._('<div class="jmb-dtp-facebook-icon">&nbsp;</div>');
								}
								if(parse.is_death){
									sb._('<div class="jmb-dtp-death-marker">&nbsp;</div>');
								}
							sb._('</div></td>');
							sb._('<td>');
								sb._('<div class="jmb-dtp-body-info-name"><span class="title">')._(language['NAME'])._(':</span>&nbsp;<span class="text">')._(parse.full_name)._('</span></div>');
								sb._('<div class="jmb-dtp-body-info-born"><span class="title">')._(language['BORN'])._(':</span>&nbsp;<span class="text">')._(parse.date('birth'))._('</span></div>');
								sb._('<div class="jmb-dtp-body-info-birthplace"><span class="title">')._(language['BIRTHPLACE'])._(':</span>&nbsp;<span class="text">')._((parse.place('birth')!='')?parse.place('birth').place_name:'')._('</span></div>');
								if(parse.relation) sb._('<div class="jmb-dtp-body-info-relation"><span class="title">')._(language['RELATION'])._(':</span>&nbsp;<span class="text">')._(parse.relation)._('</span></div>');
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
					//sb._('<div class="jmb-dtp-body-info-switch">')._(language['SWITCH'])._('</div>');
				sb._('</div>');
				sb._('<div class="jmb-dtp-body-space">&nbsp;</div>');
				sb._('<div class="jmb-dtp-body-media">')
					if(media!=null){
						sb._('<ul class="media-list">');
							jQuery(media.photos).each(function(i, img){
								sb._('<li class="media-item">')._(module.image(img))._('</li>');
							});
						sb._('</ul>');
					}
				sb._('</div>');
			sb._('</div>');
			if(parse.facebook_id=='0'){
				sb._('<div class="jmb-dtp-footer">');
					sb._('<table>');			
						sb._('<tr>');
							sb._('<td><div class="email">&nbsp;</div></td>');
							sb._('<td>');
								sb._('<div><span>')._(parse.name)._(' ')._('is no registered')._('.</span></div>');
								sb._('<div><span class="send" style="color:blue;cursor:pointer" >Send invitation to ')._(parse.name)._('</span></div>');
							sb._('</td>');
						sb._('</tr>');
						
					sb._('</table>');
				sb._('</div>');
			}
		sb._('</div>');	
		
		html = jQuery(sb.result());
		jQuery(module.cont).append(html);
		storage.media.init(html);
		jQuery(html).find('div.jmb-dtp-footer .send').click(function(){
			storage.invitation.render(ch);
		}); 
		return html;
	},
	edit:function(html, object){
		var	module = this;		
		storage.tooltip.render('edit', {
			offsetParent:document.body,
			target:jQuery(html).find('div#edit-button'),
			object:object,
			afterEditorClose:function(object){
				module.render(object);	
			}
		});
	},
	photo:function(html){
		jQuery(html).find('.jmb-dtp-body-info-avatar').mouseenter(function(){
				jQuery(html).find('.jmb-dtp-body-edit-button').addClass('hover');
				jQuery(html).find('.jmb-dtp-facebook-icon').addClass('hover');
			}).mouseleave(function(){
				jQuery(html).find('.jmb-dtp-body-edit-button').removeClass('hover');
				jQuery(html).find('.jmb-dtp-facebook-icon').removeClass('hover');
			});
	},
	render:function(object){
		var	module = this, html;
		
		//module.parent.modal.on();
		
		module.clear();
		html = module.create(object);
			
		module.photo(html);
		module.edit(html, object);
		
		//module.parent.modal.off();
	}
}
