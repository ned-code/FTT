function JMBTopMenuBar(){
	var module = this, fn, cont, alias, loggedByFamous, fb, message;

    loggedByFamous = parseInt(jQuery(document.body).attr('_type'));
	alias = jQuery(document.body).attr('_alias');
	fb = jQuery(document.body).attr('_fb');
    message = {
        FTT_MOD_TOPMENUBAR_MYFAMILY:"My Family",
        FTT_MOD_TOPMENUBAR_FAMOUS_FAMILIES:"Famous Families",
        FTT_MOD_TOPMENUBAR_HOME:"Home",
        FTT_MOD_TOPMENUBAR_RETURN: "Return to Family TreeTop"
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
        getAliasUcFirst:function(a){
            if(typeof(a) == 'undefined') return '';
            var firstKey = a[0].toUpperCase();
            var string = a.slice(1);
            return [firstKey, string].join('');
        },
        footerView:function(){
            var string = '';
            string += '<div  class="jmb-top-menu-bar">';
                string +='<div class="jmb-top-menu-bar-title">Family TreeTop: <span>'+fn.getAliasUcFirst(alias)+'</span></div>';
                string +='<div class="jmb-top-menu-bar-return">'+message.FTT_MOD_TOPMENUBAR_RETURN+'</div>';
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
            jQuery(cont).find('div.jmb-top-menu-bar-return').click(function(){
                var id = 'myfamily';
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
        setMessage:function(m){
            if(typeof(m) == 'undefined') return false;
            for (var key in message){
                if(message.hasOwnProperty(key) && typeof(m[key]) != 'undefined'){
                    message[key] = m[key];
                }
            }
        },
        isFooterLink:function(){
            switch(alias){
                case "about":
                case "conditions":
                case "privacy":
                case "feedback":
                case "help":
                case "contact":
                    return true;
                default: return false;
            }
        },
        setPosition:function(cont){
            set(cont);
            jQuery(window).resize(function(){
                set(cont);
            });
            return false;
            function set(c){
                var position = jQuery('div.content').position();
                var width = jQuery('div.content').width();
                var diff = position.left + width - jQuery('.jmb-top-menu-bar-return').width();
                jQuery(c).find('.jmb-top-menu-bar-title').css('left', position.left+'px');
                jQuery(c).find('.jmb-top-menu-bar-return').css('left', diff+'px');
            }

        },
		init:function(){
			if(window != window.top) return false;
            fn.getLanguageString(function(lang){
                fn.setMessage(lang);
                if(fn.isFooterLink()){
                    cont = fn.footerView();
                    jQuery(document.body).append(cont);
                    fn.setPosition(cont);
                    fn.click();
                    return true;
                } else {
                    cont = fn.create();
                    fn.activate();
                }
                fn.click();
                jQuery(document.body).append(cont);
            });
		}
	}
	
	module.init = function(){
		fn.init();
	}


}

			
				
				
				
			
		
