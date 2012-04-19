function JMBFeedback(){
    var module = this,
        sb = host.stringBuffer(),
        parent = jQuery('div#jmb_feedback_form'),
        path = "index.php/component/obsuggest/",
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

    sb._('<div class="header"><span>Have Your Say</span></div>');
    sb._('<div class="body">');
        sb._('<div class="text">');
            sb._("Welcome to the <font color='#99d9ea'><b>public");
            sb._(" beta</b></font> for Family TreeTop");
            sb._(" We've still got some work");
            sb._(" to do, but we're almost");
            sb._(" there! Please let us know");
            sb._(" what you think");
        sb._('</div>');
        sb._('<div class="buttons">')
        sb._('</div>');
    sb._('</div>');
    jQuery(parent).append(sb.result());

    likes = jQuery(parent).find('.likes');
    jQuery(parent).find('.body').append(likes);
    jQuery(likes).show();

    module.ajax('get', null, function(r){
        jQuery(r).each(function(i,el){
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




