function DescendantTreeProfile(parent){
	var	module = this;

    module.id = null;
	module.parent = parent;
	module.cont = parent.profile_container;
}

DescendantTreeProfile.prototype = {
	ajax:function(func, params, callback){
        storage.callMethod("descendant_tree", "JMBDescendantTree", func, params, function(res){
				callback(res);
		})
	},
	clear:function(){
		var	module = this;
        module.id = null;
		jQuery(module.cont).html('');	
		storage.tooltip.cleaner();
	},
	avatar:function(object){
        return storage.usertree.avatar.get({
            object:object,
            width:72,
            height:80
        });
	},
	image:function(img, media){
		var sb = host.stringBuffer();
        var cache = (media!=null)?media.cache:false;
        sb._('<a href="')._(img.path)._('" rel="prettyPhoto[pp_gal]" title="">');
            sb._(storage.usertree.photos.image({
                cache:cache,
                width:50,
                height:50,
                image:img
            }));
        sb._('</a>');
        return sb.result();
	},
	create:function(ch){
		var	module = this,
			sb = host.stringBuffer(),
			message = module.parent.message,
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
                                if(parse.is_editable && !parseInt(jQuery(document.body).attr('_type'))){
								    sb._('<div id="edit-button" class="jmb-dtp-body-edit-button">&nbsp;</div>');
                                }
								if(parse.facebook_id != '0'){
									sb._('<div class="jmb-dtp-facebook-icon">&nbsp;</div>');
								}
								if(parse.is_death){
									sb._('<div class="jmb-dtp-death-marker">&nbsp;</div>');
								}
							sb._('</div></td>');
							sb._('<td>');
								sb._('<div class="jmb-dtp-body-info-name">');
                                    sb._('<span class="title">');
                                        sb._(message.FTT_MOD_DESCEDNATS_TREE_NAME);
                                    sb._(':</span>');
                                    sb._('&nbsp;');
                                    sb._('<span class="text">')
                                        sb._(parse.full_name);
                                    sb._('</span>');
                                sb._('</div>');
								sb._('<div class="jmb-dtp-body-info-born">');
                                    sb._('<span class="title">');
                                        sb._(message.FTT_MOD_DESCEDNATS_TREE_BORN);
                                    sb._(':</span>');
                                    sb._('&nbsp;');
                                    sb._('<span class="text">');
                                        sb._(parse.date('birth'));
                                    sb._('</span>');
                                sb._('</div>');
								sb._('<div class="jmb-dtp-body-info-birthplace">');
                                    sb._('<span class="title">');
                                        sb._(message.FTT_MOD_DESCEDNATS_TREE_BIRTHPLACE);
                                    sb._(':</span>');
                                    sb._('&nbsp;');
                                    sb._('<span class="text">');
                                        sb._(parse.getPlaceName('birth'));
                                    sb._('</span>');
                                sb._('</div>');
                                if(parse.is_death){
                                    sb._('<div class="jmb-dtp-body-info-born">');
                                        sb._('<span class="title">');
                                            sb._(message.FTT_MOD_DESCEDNATS_TREE_DEATH);
                                        sb._(':</span>');
                                        sb._('&nbsp;');
                                        sb._('<span class="text">');
                                            sb._(parse.date('death'));
                                        sb._('</span>');
                                    sb._('</div>');
                                    sb._('<div class="jmb-dtp-body-info-birthplace">');
                                        sb._('<span class="title">');
                                            sb._(message.FTT_MOD_DESCEDNATS_TREE_DEATHPLACE);
                                        sb._(':</span>');
                                        sb._('&nbsp;');
                                        sb._('<span class="text">');
                                            sb._(parse.getPlaceName('death'));
                                        sb._('</span>');
                                    sb._('</div>');
                                }
                                if(parse.relation){
                                    sb._('<div class="jmb-dtp-body-info-relation">');
                                        sb._('<span class="title">');
                                            sb._(message.FTT_MOD_DESCEDNATS_TREE_RELATION);
                                        sb._(':</span>');
                                        sb._('&nbsp;');
                                        sb._('<span class="text">');
                                            sb._(parse.relation);
                                        sb._('</span>');
                                    sb._('</div>');
                                }
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
                    sb._('<div class="jmb-dtp-body-info-switch">');
                        sb._(message.FTT_MOD_DESCEDNATS_TREE_SHOW_FULL_PROFILE);
                    sb._('</div>');
				sb._('</div>');
				sb._('<div class="jmb-dtp-body-media">')
					if(media!=null){
                        jQuery(media.photos).each(function(i, img){
                            sb._('<div class="media-item">')._(module.image(img, media))._('</div>');
                        });
					}
				sb._('</div>');
			sb._('</div>');
			if(!parseInt(jQuery(document.body).attr('_type')) && parse.facebook_id=='0' && parse.is_alive && parse.turns < 120){
				sb._('<div class="jmb-dtp-footer">');
					sb._('<table>');			
						sb._('<tr>');
							sb._('<td><div class="email">&nbsp;</div></td>');
							sb._('<td>');
								sb._('<div>');
                                    sb._('<span>');
                                        sb._(parse.name);
                                        sb._(' ');
                                        sb._(message.FTT_MOD_DESCEDNATS_TREE_NOT_REGISTERD);
                                    sb._('.</span>');
                                sb._('</div>');
								sb._('<div>');
                                    sb._('<span class="send" style="color:blue;cursor:pointer" >');
                                        sb._(message.FTT_MOD_DESCEDNATS_TREE_SEND_INVITE_TO);
                                        sb._(' ');
                                        sb._(parse.name);
                                    sb._('</span>');
                                sb._('</div>');
							sb._('</td>');
						sb._('</tr>');
					sb._('</table>');
				sb._('</div>');
			}
		sb._('</div>');	
		
		html = jQuery(sb.result());
		jQuery(module.cont).append(html);
        if(media!=null){
            storage.media.init(html);
            if(media.photos.length > 24){
                var parentHeight = jQuery(module.cont).parent().height();
                var bodyHeight = jQuery(html).find("div.jmb-dtp-body-info").height();
                var sendHeight = jQuery(html).find("div.jmb-dtp-footer").height();
                var rHeight = parentHeight - bodyHeight - sendHeight - 25;
                jQuery(html).find("div.jmb-dtp-body-media").css('height', rHeight+'px');
                jQuery(html).find("div.jmb-dtp-body-media").scrollbar();
            }
        }
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
			gedcom_id:object.user.gedcom_id,
			afterEditorClose:function(){
                storage.tooltip.cleaner(function(){
                    var p = module.parent;
                    p.selected = module.id;
                    p.loadTreeById((p.checked!=null)?p.checked:p.first);
                });
			}
		});
	},
	editor:function(html, object){
        var module = this;
		jQuery(html).find('.jmb-dtp-body-info-switch').click(function(){
			storage.profile.editor('view', {
				object:object,
				events:{
					afterEditorClose:function(obj){
                        storage.tooltip.cleaner(function(){
                            var p = module.parent;
                            p.selected = module.id;
                            p.loadTreeById((p.checked!=null)?p.checked:p.first);
                        });
					}
				}
			});
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
    facebook:function(html, object){
         jQuery(html).find('.jmb-dtp-facebook-icon').click(function(){
             window.open('http://www.facebook.com/profile.php?id='+object.user.facebook_id,'new','width=320,height=240,toolbar=1')
             return false;
         });
    },
	render:function(id){
		var	module = this,
            object = storage.usertree.pull[id],
            html;


		module.clear();
		html = module.create(object);
		module.id = id;

		module.photo(html);
        module.facebook(html, object);
		module.edit(html, object);
		module.editor(html, object);
	}
}
