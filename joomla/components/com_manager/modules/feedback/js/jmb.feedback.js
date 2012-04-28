function JMBFeedback(){
    var module = this,
        sb = host.stringBuffer(),
        parent = jQuery('div#jmb_feedback_form'),
        path = "index.php/component/obsuggest/",
        message = {
            FTT_MOD_FEEDBACK_HEADER:"Have Your Say",
            FTT_MOD_FEEDBACK_WELCOM:"Welcome to the %% for Family TreeTop. We've still got some work to do, but we're almost there! Please let us know what you think",
            FTT_MOD_FEEDBACK_PUBLIC_BETA:"public beta",
            FTT_MOD_FEEDBACK_LIKE:"Like whay you see? Pass the word along to your friends:"
        },
        fn,
        likes;

    fn = {
        parse:function(el){
            var t = el.name.split(" ");
            var name = '';
            var id = el.id;
            for(var i = 0; i < t.length ; i++){
                if(t[i] != '-'){
                    name += " "+t[i];
                    id += "-"+t[i].toLowerCase();
                }
            }
            return { id:id, name:name };
        },
        iframe:function(id){
            var st = host.stringBuffer();
            st._("<iframe style='border:none;' src='")._(storage.baseurl + path + id)._("' width='660' height='440' align='center'></iframe>");
            return jQuery(st.result());
        },
        click:function(object, callback){
            jQuery(object).click(function(){
                callback(this);
                return false;
            });
        },
        dialogOpen:function(callback){
            var box = jQuery('<div class="jmb_feedback_dialog_box"></div>');
            jQuery(box).dialog({
                width:700,
                height:500,
                title: 'Family TreeTop - Public Feedback',
                resizable: false,
                draggable: false,
                position: "top",
                closeOnEscape: false,
                modal:true,
                close:function(){

                }
            });
            jQuery(box).parent().addClass('jmb_feedback_dialog');
            jQuery(box).parent().css('top', '20px');
            callback(box);
        }
    };

    module.ajax('get', null, function(json){
        if(json.language){
            message = json.language;
        }
        sb._('<div class="header"><span>')._(message.FTT_MOD_FEEDBACK_HEADER)._('</span></div>');
            sb._('<div class="body">');
                sb._('<div class="text">');
                    sb._(message.FTT_MOD_FEEDBACK_WELCOM.replace("%%",'<font color="#99d9ea"></a>'+message.FTT_MOD_FEEDBACK_PUBLIC_BETA+'</font>'));
                sb._('</div>');
            sb._('<div class="buttons">')
            sb._('</div>');
        sb._('</div>');
        jQuery(parent).append(sb.result());

        likes = jQuery(parent).find('.likes');
        jQuery(likes).find('.message').text(message.FTT_MOD_FEEDBACK_LIKE);
        jQuery(parent).find('.body').append(likes);
        jQuery(likes).show();

        jQuery(json.buttons).each(function(i,el){
            var e = fn.parse(el);
            var div = jQuery("<div id='"+e.id+"'><span>"+e.name+"</span></div>");
            jQuery(parent).find("div.buttons").append(div);
            fn.click(div, function(ev){
                fn.dialogOpen(function(box){
                    var id = jQuery(ev).attr('id');
                    var iframe = fn.iframe(id);
                    jQuery(box).append(iframe);
                });
            });
        });
    });
}

JMBFeedback.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("feedback", "JMBFeedback", func, params, function(req){
            var text = req.responseText;
            if(text.length > 0){
                var json = jQuery.parseJSON(text);
                callback(json);
            }
		})
	}	
}




