function JMBTopMenuBar(){
	var module = this, fn, cont, alias, type, fb;
	
	type = jQuery(document.body).attr('_type');
	alias = jQuery(document.body).attr('_alias');
	fb = jQuery(document.body).attr('_fb');
	
	fn = {
		create:function(){
            var string = '';
            string += '<div  class="jmb-top-menu-bar">';
                string +='<div class="jmb-top-menu-bar-logo">&nbsp;</div>';
                string +='<div class="jmb-top-menu-bar-content">';
                    string +='<div id="myfamily" class="jmb-top-menu-bar-item"><span>My Family</span></div>';
                    string +='<div id="famous-family" class="jmb-top-menu-bar-item"><span>Famous Families</span></div>';
                    string +='<div id="home" class="jmb-top-menu-bar-item"><span>Home</span></div>';
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
					if(type == 'famous_family'){
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
			
			cont = fn.create();			
			fn.click();
			fn.activate();
			
			jQuery(document.body).append(cont);
		}
	}
	
	module.init = function(){
		fn.init();
	}


}

			
				
				
				
			
		
