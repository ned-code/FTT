jQuery(window).load(function(){
	FB.init({
		appId: storage.fb.appId, 
		status:storage.fb.status, 
		cookie:storage.fb.cookie, 
		xfbml:storage.fb.xfbml
	});
	FB.Canvas.setAutoResize(100);
	
	jQuery("#jmb_header_logout").click(function(){
		FB.logout(function(response){
			window.location.reload();
		});
	});
	
	var self = this;
	this.activeButton = null;
	
	jQuery('.jmb_header_fam_line').find('span').each(function(index,element){
		if(jQuery(element).hasClass('active')) self.activeButton = element;
		jQuery(element).bind('click', function(){
			if(!jQuery(this).hasClass('active')){
				jQuery(self.activeButton).removeClass('active');
				jQuery(this).addClass('active');
				self.activeButton = this;
			}	
		});
	});

});



