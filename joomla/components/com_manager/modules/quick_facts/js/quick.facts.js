function QuickFacts(obj){
	if(!obj) obj = document.getElementById('quick_facts');
	
	this.tipsytooltip = new TipsyTooltip();
	
	var self = this;
	var table = document.createElement('table');
	host.callMethod("quick_facts", "QuickFacts", "GetStatistic", null, function(req){
		jQuery(obj).html(req.responseText);
		if(jQuery.browser.msie){
			jQuery(".qf-header").css("top", "0px");
			jQuery(".qf-header").css("left", "0px");
			jQuery(".qf-header").css("margin-left", "12px");
		}else{
			//jQuery(".qf-header").css("margin", "45px -28px 0 -30px");
		}
		
		jQuery('.qf-person').each(function(index, value){
			self._setEvenetHandler(this);
		});
		
        }); 
}

QuickFacts.prototype = {
	_setEvenetHandler:function(obj){
		this.tipsytooltip.setTooltip(obj);
	}
}



