function JMBFeedback() {
    var module = this,
        sb = storage.stringBuffer(),
        parent = jQuery('div#jmb_feedback_form'),
        path = "index.php/component/obsuggest/",
        message = {
            FTT_MOD_FEEDBACK_HEADER:"Have Your Say",
            FTT_MOD_FEEDBACK_WELCOM:"Welcome to the %% for Family TreeTop. We've still got some work to do, but we're almost there! Please let us know what you think",
            FTT_MOD_FEEDBACK_PUBLIC_BETA:"public beta",
            FTT_MOD_FEEDBACK_LIKE:"Like whay you see? Pass the word along to your friends:",
            FTT_MOD_FEEDBACK_REPORT_A_PROBLEB:"Report a Problem",
            FTT_MOD_FEEDBACK_SUBMIT_AN_IDEA:"Submit an Idea"
        },
        fn,
        likes;1

    fn = {
        parse:function (el) {
            var t = el.name.split(" ");
            var name = '';
            var id = el.id;
            for (var i = 0; i < t.length; i++) {
                if (t[i] != '-') {
                    name += " " + t[i];
                    id += "-" + t[i].toLowerCase();
                }
            }
            return { id:id, name:name };
        },
        iframe:function (id) {
            var st = storage.stringBuffer();
            st._("<iframe style='border:none;' src='")._(storage.baseurl + path + id)._("' width='660' height='440' align='center'></iframe>");
            return jQuery(st.result());
        },
        click:function (object, callback) {
            jQuery(object).click(function () {
                callback(this);
                return false;
            });
        },
        dialogOpen:function (callback) {
            var box = jQuery('<div class="jmb_feedback_dialog_box"></div>');
            jQuery(box).dialog({
                width:700,
                height:500,
                title:'Family TreeTop - Public Feedback',
                resizable:false,
                draggable:false,
                position:"top",
                closeOnEscape:false,
                modal:true,
                close:function () {

                }
            });
            jQuery(box).parent().addClass('jmb_feedback_dialog');
            jQuery(box).parent().css('top', '20px');
            callback(box);
        },
        button:function (id, name) {
            return jQuery("<div id='" + id + "'><span>" + name + "</span></div>");
        },
        buttonClick:function (button) {
            fn.click(button, function (ev) {
                var id = jQuery(ev).attr('id');
                window.location.href = storage.baseurl + 'index.php/feedback/' + id;
                /*
                 fn.dialogOpen(function(box){
                 var id = jQuery(ev).attr('id');
                 var iframe = fn.iframe(id);
                 jQuery(box).append(iframe);
                 });
                 */
            });
            return button;
        }
    };

    module.init = function () {
        jQuery.ajax({
            url:storage.baseurl + storage.url + 'php/ajax.php',
            type:"POST",
            data:'module=feedback&class=JMBFeedback&method=get&args=',
            dataType:"html",
            complete:function (req, err) {
                if (req.responseText.length != 0) {
                    //var json = jQuery.parseJSON(req.responseText);
                    var json = storage.getJSON(req.responseText);
                    if (json.language) {
                        message = json.language;
                    }
                    //sb._('<div class="header"><span>')._(message.FTT_MOD_FEEDBACK_HEADER)._('</span></div>');
                    sb._('<div class="body">');
                    sb._('<div class="text">');
                    sb._(message.FTT_MOD_FEEDBACK_WELCOM.replace("%%", message.FTT_MOD_FEEDBACK_PUBLIC_BETA));
                    sb._('</div>');
                    sb._('<div class="buttons">')
                    sb._('</div>');
                    sb._('</div>');
                    jQuery(parent).append(sb.result());

                    likes = jQuery(parent).find('.likes');
                    jQuery(likes).find('.message').text(message.FTT_MOD_FEEDBACK_LIKE);
                    jQuery(parent).find('.body').append(likes);
                    jQuery(likes).show();

                    var button1 = fn.buttonClick(fn.button("18-report-a-problem", message.FTT_MOD_FEEDBACK_REPORT_A_PROBLEB));
                    jQuery(parent).find("div.buttons").append(button1);
                    var button2 = fn.buttonClick(fn.button("16-submit-an-idea", message.FTT_MOD_FEEDBACK_SUBMIT_AN_IDEA));
                    jQuery(parent).find("div.buttons").append(button2);
                }
            }
        });
    }
}

JMBFeedback.prototype = {
    ajax:function (func, params, callback) {
        storage.callMethod("feedback", "JMBFeedback", func, params, function (req) {
            //var json = jQuery.parseJSON(text);
            var json = storage.getJSON(text);
            callback(json);
        })
    }
}




