function JMBHomeObject(offsetParent){	
	var	module = this,
		fn;
		
	fn = {
		ajax:function(func, params, callback){
			host.callMethod("home", "JMBHome", func, params, function(res){
					callback(res);
			})
		},
		create:function(){
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
			return jQuery(st.result());
		},
		initButton:function(cont){
			var id;
			jQuery(cont).find('div.button').click(function(){
				id = jQuery(this).attr('id');
				switch(id){
					case 'connect':
						//ajax('myfamily');
						fn.ajax('page', 'myfamily', function(res){
							window.location.reload();	
						});
					break;
					
					case 'view':
						//ajax('famous-family');
						fn.ajax('page', 'famous-family', function(res){
							window.location.reload();
						});
					break;
				}
			});
		},
		init:function(parent){
			var cont;
			cont = fn.create();
			fn.initButton(cont);
			jQuery(parent).append(cont);
		}
	}
	fn.init(offsetParent);
}




