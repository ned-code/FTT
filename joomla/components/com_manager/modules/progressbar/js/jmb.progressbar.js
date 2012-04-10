function JMBProgressbarObject(){
    var module = this,
        sb = host.stringBuffer(),
        divObject;

    sb._('<div class="jmb-progressbar-container"><span></span></div>');
    divObject = jQuery(sb.result());
    jQuery(document.body).append(divObject);
    jQuery(divObject).hide();

    module.cont = divObject;
}

JMBProgressbarObject.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("progressbar", "JMBProgressbarClass", func, params, function(res){
			callback(res);
		})
	},
    setMessage:function(message){
        var module = this;
        jQuery(module.cont).find('span').text(message);
    },
    show:function(){
        var module = this;
        jQuery(module.cont).show();
    },
    hide:function(){
        var module = this;
        module.setMessage('');
        jQuery(module.cont).hide();
    },
    on:function(message){
        var module = this;
        module.setMessage(message);
        module.show();
    },
    off:function(){
        var module = this;
        module.hide();
    },
    loading:function(){
        var module = this;
        module.on('Loading...');
    }
}




