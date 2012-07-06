function JMBTopMenuBar(){
	var module = this, fn, cont, alias, loggedByFamous, fb, message;

    loggedByFamous = parseInt(jQuery(document.body).attr('_type'));
	alias = jQuery(document.body).attr('_alias');
	fb = jQuery(document.body).attr('_fb');
    message = {
        FTT_MOD_TOPMENUBAR_MYFAMILY:"My Family",
        FTT_MOD_TOPMENUBAR_FAMOUS_FAMILIES:"Famous Families",
        FTT_MOD_TOPMENUBAR_HOME:"Home"
    }

	
	fn = {
        getLanguageString:function(callback){
            jQuery.ajax({
                url:"index.php?option=com_manager&task=getLanguage&module_name=topmenubar",
                type:"GET",
                dataType: "html",
                complete : function (req, err) {
                    var json = jQuery.parseJSON(req.responseText);
                    callback(json);
                }
            });
        },
		create:function(){
            var string = '';
            string += '<div  class="jmb-top-menu-bar">';
                string +='<div class="jmb-top-menu-bar-logo">&nbsp;</div>';
                string +='<div class="jmb-top-menu-bar-content">';
                    string +='<div id="myfamily" class="jmb-top-menu-bar-item"><span>'+message.FTT_MOD_TOPMENUBAR_MYFAMILY+'</span></div>';
                    string +='<div id="famous-family" class="jmb-top-menu-bar-item"><span>'+message.FTT_MOD_TOPMENUBAR_FAMOUS_FAMILIES+'</span></div>';
                    string +='<div id="home" class="jmb-top-menu-bar-item"><span>'+message.FTT_MOD_TOPMENUBAR_HOME+'</span></div>';
                string +='</div>';
            string +='</div>';
            return jQuery(string);
		},
		sw:function(object){
			jQuery(cont).find('div.jmb-top-menu-bar-item span').removeClass('active');
			jQuery(object).addClass('active');
			
		},
		click:function(){
			var id;
			jQuery(cont).find('div.jmb-top-menu-bar-item span').click(function(){
				id = jQuery(this).parent().attr('id');
				fn.sw(this);
				jQuery.ajax({
					url: 'index.php?option=com_manager&task=setLocation&alias='+id,
					type: "POST",
					dataType: "json",
					complete : function (req, err) {
                        var bUrl = jQuery(document.body).attr('_baseurl');
						window.location.href= bUrl+'index.php/'+id;
					}
				});
			});
		},
		activate:function(){
			switch(alias){
				case "home":
					fn.sw(jQuery(cont).find('div#home span'));
				break;
				
				case "famous-family":
					fn.sw(jQuery(cont).find('div#famous-family span'));
				break;
				
				case "login":
					fn.sw(jQuery(cont).find('div#myfamily span'));
				break;

                case "first-page":
				case "myfamily":
					if(loggedByFamous){
						fn.sw(jQuery(cont).find('div#famous-family span'));
					} else {
						fn.sw(jQuery(cont).find('div#myfamily span'));
					}
				break;

                default:
                break;
			}
			
		},
		init:function(){
			if(window != window.top) return false;
            fn.getLanguageString(function(lang){
                if(lang){
                    message = lang;
                }
                cont = fn.create();
                fn.click();
                fn.activate();

                jQuery(document.body).append(cont);
            });
		}
	}
	
	module.init = function(){
		fn.init();
	}


}

			
				
				
				
			
		
