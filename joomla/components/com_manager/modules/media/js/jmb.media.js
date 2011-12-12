function JMBMediaManager(){
}
JMBMediaManager.prototype = {
	getImage:function(image){
		var sb = host.stringBuffer();
		return sb._('<a href="')._(image.path)._('" rel="prettyPhoto[pp_gal]" title=""><img src="index.php?option=com_manager&task=getResizeImage&id=')._(image.media_id)._('&w=100&h=100')._('" alt="" /></a>').result();
	},
	getImageEdit:function(image){
		var sb = host.stringBuffer();
		return sb._('<img src="index.php?option=com_manager&task=getResizeImage&id=')._(image.media_id)._('&w=100&h=100')._('" alt="" />').result();
	},
	render:function(photos, edit){
		var self = this,sb = host.stringBuffer();
		sb._('<div class="jmb-dialog-photos-content">');
			sb._('<div class="list">');
				sb._('<ul>');
					jQuery(photos).each(function(i, image){
						sb._('<li id="')._(image.media_id)._('">') 
							sb._('<div class="list-item">');
								if(edit){
									sb._('<div class="header"><span>')._((image.size!=null)?image.size:'')._('</span><div class="delete">&nbsp;</div></div>');
									sb._('<div class="item">')._(self.getImageEdit(image))._('</div>');
								} else {
									sb._('<div class="item">')._(self.getImage(image))._('</div>');
								}
							sb._('</div>');
						sb._('</li>');
					});
				sb._('</ul>');
			sb._('</div>');
		sb._('</div>');
		return sb.result();
	},
	init:function(object){
		jQuery(object).find('a[rel^="prettyPhoto"]').prettyPhoto({
			social_tools:''
		});
	}	
}

