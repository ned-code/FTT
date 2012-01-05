function JMBTopMenuBar(){
	var module = this, fn, cont, alias, type, fb;
	
	type = jQuery(document.body).attr('_type');
	alias = jQuery(document.body).attr('_alias');
	fb = jQuery(document.body).attr('_fb');
	
	fn = {
		create:function(){
			var sb = host.stringBuffer();
			sb._('<div  class="jmb-top-menu-bar">');
				sb._('<div class="jmb-top-menu-bar-content">');
					sb._('<div id="myfamily" class="jmb-top-menu-bar-item"><span>My Family</span></div>');
					sb._('<div id="famous-family" class="jmb-top-menu-bar-item"><span>Famous Families</span></div>');
					sb._('<div id="home" class="jmb-top-menu-bar-item"><span>FTT Home</span></div>');
				sb._('</div>');
			sb._('</div>');
			return jQuery(sb.result());
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
						window.location.reload();
					}
				});
			});
		},
		activate:function(){
			switch(alias){
				case "home":
					fn.sw(jQuery(cont).find('div#home span'));
				break;
				
				case "famous_family":
					fn.sw(jQuery(cont).find('div#famous_family span'));
				break;
				
				case "myfamily":
					if(type == 'famous_family'){
						fn.sw(jQuery(cont).find('div#famous_family span'));
					} else {
						fn.sw(jQuery(cont).find('div#myfamily span'));
					}
				break;
			}
			
		},
		init:function(){
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

			
				
				
				
			
		
