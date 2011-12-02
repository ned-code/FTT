function JMBHomeObject(obj){
	var module = this;
	
	var ajax = function(id){
		jQuery.ajax({
			url: 'index.php?option=com_manager&task=setLocation&alias='+id,
			type: "POST",
			dataType: "json",
			complete : function (req, err) {
				window.location.reload();
			}
		});
	}
	
	var createBody = function(obj){
		var st = host.stringBuffer();
		st._('<table width="100%">');
			st._('<tr>');
				st._('<td><div class="jmb-home-logo">&nbsp;</div></td>');
				st._('<td valign="top">');
					st._('<div class="jmb-home-body">');
						st._('<div class="title"><span>Welcome to Family TreeTop</span></div>');
						st._('<div id="connect" class="button"><span>Connect to your Family Tree</span></div>');
						st._('<div id="view" class="button"><span>View Famous Families</span></div>');
					st._('</div>');
				st._('</td>');
			st._('</tr>');
		st._('</table>');
		var html = st.result();
		var htmlObject = jQuery(html);
		return htmlObject;
	}
	
	var initButton = function(body){
		jQuery(body).find('div.button').click(function(){
			var id = jQuery(this).attr('id');
			switch(id){
				case 'connect':
					//ajax('myfamily');
					module.ajax('page', 'myfamily', function(){
						window.location.reload();	
					});
				break;
				
				case 'view':
					//ajax('famous-family');
					module.ajax('page', 'famous-family', function(){
						window.location.reload();
					});
				break;
			}
		});
	}
	
	var body = createBody(obj);
	initButton(body);

	jQuery(obj).append(body);
}

JMBHomeObject.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("home", "JMBHome", func, params, function(res){
				callback(res);
		})
	}
}



