function JMBComments(obj){
	obj = jQuery('#'+obj);
	var div = '<fb:comments href="thors.ru" num_posts="2" width="350"></fb:comments>';
	jQuery(obj).append(div);
	
	FB.init({
		appId: "184962764872486", 
		status:true, 
		cookie:true, 
		xfbml:true
	});
}

JMBComments.prototype = {
}




