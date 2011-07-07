jQuery(window).load(function(){
	var self = this;
	jQuery('.jmb_header_fam_line span').each(function(i,e){
		if(jQuery(e).hasClass('active')) storage.header.activeButton = e;
		jQuery(e).click(function(){
			if(jQuery(this).hasClass('active')) return;
			jQuery(storage.header.activeButton).removeClass('active');
			jQuery(this).addClass('active');
			storage.header.activeButton = this;
			storage.header.click(this);
		});
	});
});



