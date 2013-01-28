// footer
(function(w){
    if(window == window.top){
        if(jQuery.browser.msie && parseInt(jQuery.browser.version) <= 7){
            jQuery('div.footer').hide();
        } else {
            if('undefined' === typeof(storage)){
                var alias = jQuery(document.body).attr("_alias");
                if('feedback' === alias){
                    jQuery('form#adminForm').ready(function(){
                        jQuery('form#adminForm').find('h2').remove();
                        var select = jQuery('form#adminForm').find('.forum-select');
                        jQuery(select).css('text-align', 'center');
                        jQuery(select).css('margin', '10px');
                        jQuery(select).find('div').css('float', 'none');
                        jQuery.ajax({
                            url:"index.php?option=com_manager&task=getLanguage&module_name=feedback",
                            type:"GET",
                            dataType: "html",
                            complete : function (req, err) {
                                var json = jQuery.parseJSON(req.responseText);
                                var string  = json.FTT_MOD_FEEDBACK_WELCOM.replace('%%', json.FTT_MOD_FEEDBACK_PUBLIC_BETA);
                                jQuery(select).before('<div style="font-size: 16px;font-weight: bold;margin: 30px;">'+string+'</div>');
                            }
                        });
                    });
                }
                jQuery('div.footer').show();
            } else {
                storage.core.modulesPullObject.bind(function(object){
                    jQuery('div.footer').show();
                });
            }
        }
    }
    if(typeof(storage) == 'undefined'){
        var tmb = new JMBTopMenuBar();
        tmb.init();
    }

    jQuery('.scsocialbuttons').remove();
})(window);
// feedback slide-out
(function(w){
    var alias = jQuery(document.body).attr("_alias");
    if(window != window.top ){
        jQuery(".slide-out-div").remove();
    } else {
        if(alias == "myfamily"){
            jQuery(".slide-out-div").tabSlideOut({
                tabHandle: '.handle',
                pathToTabImage: '../components/com_manager/modules/feedback/images/feedback.gif',
                imageHeight: '279px',
                imageWidth: '40px',
                tabLocation: 'left',
                speed: 300,
                action: 'click',
                topPos: '50px',
                leftPos: '20px',
                fixedPosition: false
            });
        }
    }
})(window);

FB.Canvas.setSize();