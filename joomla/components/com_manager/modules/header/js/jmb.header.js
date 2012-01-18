function JMBHeader(){
	var	module = this,
		fn,
		cont,
		parent, 
		alias,
		exists;

	cont = jQuery('<div class="jmb-header-container"><div class="jmb-header-logo" style="display:none;">&nbsp;</div><div style="display:none;" class="jmb-header-expand">&nbsp;</div></div>');
	parent = jQuery('div#.content div.header');	
	alias = jQuery('body').attr('_alias');

	exists = {
		"famous-family":true,
		"myfamily":true
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
					return alias;
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
						src = "http://www.familytreetop.com/index.php/myfamily";
					} else {
						src = "http://apps.facebook.com/fmybranches/";
					}
					window.top.location.href = src;
				});
			}
		},
		init:function(){
			if(exists[alias]){
				if(alias == 'myfamily'){
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
