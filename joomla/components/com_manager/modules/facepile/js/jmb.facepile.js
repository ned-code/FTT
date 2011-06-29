function JMBFacepile(obj){
	obj = jQuery('#'+obj);
	//var iframe = '<iframe src="http://www.facebook.com/plugins/facepile.php?href&amp;app_id=184962764872486&amp;size=small&amp;width=350&amp;max_rows=1&amp;locale=en_US" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:350px;" allowTransparency="true"></iframe>';
	var iframe = '<fb:facepile width="350" max_rows="1"></fb:facepile>';
	jQuery(obj).append(iframe);
	
	FB.init({
		appId: "184962764872486", 
		status:true, 
		cookie:true, 
		xfbml:true
	});
}

JMBFacepile.prototype = {
}




