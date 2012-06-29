function JMBHomeObject(offsetParent){	
	var	module = this,
		fn,
        msg;

    msg = {
        FTT_MOD_HOME_WELCOME: "Welcome to Family TreeTop",
        FTT_MOD_HOME_CONNECT_TO_FAMILY_TREE: "Connect to your Family Tree",
        FTT_MOD_HOME_VIEW_FAMOUS_FAMILY: "View Famous Families"
    }

	fn = {
		ajax:function(func, params, callback){
            storage.callMethod("home", "JMBHome", func, params, function(res){
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
							st._('<div class="title"><span>')._(msg.FTT_MOD_HOME_WELCOME)._('</span></div>');
							st._('<div id="connect" class="button"><span>')._(msg.FTT_MOD_HOME_CONNECT_TO_FAMILY_TREE)._('</span></div>');
							st._('<div id="view" class="button"><span>')._(msg.FTT_MOD_HOME_VIEW_FAMOUS_FAMILY)._('</span></div>');
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
            fn.ajax('get', null, function(res){
                var cont;
                //msg = jQuery.parseJSON(res.responseText);
                msg = storage.getJSON(res.responseText);
                cont = fn.create();
                fn.initButton(cont);
                jQuery(parent).append(cont);
            });

		}
	}
	fn.init(offsetParent);
}




