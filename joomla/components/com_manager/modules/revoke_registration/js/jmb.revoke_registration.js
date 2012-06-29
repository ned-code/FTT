function JMBRevokeRegistration(){
    var module = this,
        parent = jQuery('.jmb-revoke-registration-container'),
        sb = host.stringBuffer(),
        html;
    sb._('<div class="ui-widget">');
        sb._('<label for="tags">Enter the user name: </label>');
        sb._('<input style="width:230px;" id="tags">');
        sb._('<input id="delete" type="button" value="delete" >');
    sb._('</div>');
    
    html = jQuery(sb.result());
    jQuery(parent).append(html);

    module.ajax('get', null, function(json){
        var input = jQuery(parent).find('input#tags');
        var del = jQuery(parent).find('input#delete');
        jQuery(input).autocomplete(json.users);
        jQuery(del).click(function(){
            var value = jQuery(input).val();
            var link = json.link[value];
            if(typeof(link) == 'undefined') return false;
            if(confirm('Are you sure you want to unlink this user?')){
                module.ajax('unlink', link, function(json){
                    jQuery(input).unautocomplete();
                    jQuery(input).autocomplete(json.users);
                });
            }
        });
    });
}

JMBRevokeRegistration.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("revoke_registration", "JMBRevokeRegistration", func, params, function(req){
                //var json = jQuery.parseJSON(req.responseText);
                var json = storage.getJSON(req.responseText);
				callback(json);
		})
	}	
}




