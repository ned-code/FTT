function JMBHeader(){
	var	module = this,
		fn,
		cont,
		parent, 
		alias,
        loggedByFamous,
		exists;

	cont = jQuery('<div class="jmb-header-container"><div class="jmb-header-logo" style="display:none;">&nbsp;</div><div style="display:none;" class="jmb-header-expand">&nbsp;</div></div>');
	parent = jQuery('div#.content div.header');	
	alias = jQuery(document.body).attr('_alias');
    loggedByFamous = parseInt(jQuery(document.body).attr('_type'));

	exists = {
		"famous-family":true,
        "first-page":true,
		"myfamily":true,
        "invitation":true
	}
	
	fn = {
		set:{
			class_name:{
				cont:function(class_name){
					jQuery(cont).addClass(class_name);
				},
				expand:function(class_name){
					jQuery(cont).find('div.jmb-header-expand').addClass(class_name);
				}
			}
		},
		get:{
			is_iframe:function(){
				return window != window.top;
			},
			class_name:{
				expand:function(){
					if(fn.get.is_iframe()){
						return 'facebook';
					} else {
						return 'familytreetop';
					}
				}, 
				logo:function(){
					if(fn.get.is_iframe()){
						return (alias!='login')?'familytreetop':alias;
					}
					if(alias == 'myfamily' && loggedByFamous){
						return 'famous-family';
					}
                    if(alias == 'famous-family'){
                        return 'famous-family';
                    }
                    if(alias == 'myfamily'){
                        return 'myfamily'
                    }
				}
			}
		},
		show:{
			expand:function(){
				jQuery(cont).find('div.jmb-header-expand').show();
			},
			logo:function(){
				jQuery(cont).find('div.jmb-header-logo').show();
			}
		},
		click:{
			expand:function(){
				jQuery(cont).find('div.jmb-header-expand').click(function(){
					var src;
					if(fn.get.is_iframe()){
						src = storage.baseurl+"index.php/myfamily";
					} else {
						src = "http://apps.facebook.com/familytreetop/";
					}
					window.top.location.href = src;
				});
			}
		},
		init:function(){
			if(exists[alias]){
				if(alias == 'myfamily' && !loggedByFamous){
					this.show.expand();
					this.click.expand();
				}
				this.show.logo();
			}
			this.set.class_name.cont(fn.get.class_name.logo());
			this.set.class_name.expand(fn.get.class_name.expand());
			jQuery(parent).append(cont);
		}
	}

	fn.init();
}
