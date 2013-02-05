(function($, $ftt){
    $ftt.module.create("MOD_SYS_FEEDBACK", function(){
        var module = this,
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
            likes;

        fn = {
            ajax:function(func, params, callback){
                module.fn.call("feedback", "JMBFeedback", func, params, function (json) {
                    callback(json);
                })
            },
            attachAddThis:function(){
                var head = document.getElementsByTagName("head");
                var script = document.createElement("script");
                script.src = "http://s7.addthis.com/js/250/addthis_widget.js#pubid=xa-4f97ad88304db623";
                script.type="text/javascript";
                head[0].appendChild(script);
            },
            create:function(){
                var sb = module.fn.stringBuffer();
                sb._('<div class="slide-out-div">');
                    sb._('<a class="handle" href="http://link-for-non-js-users.html">Content</a>');
                    sb._('<div id="jmb_feedback_form">');
                        sb._('<div style="display:none;" class="likes">');
                            sb._('<div class="addthis_toolbox addthis_default_style addthis_32x32_style">');
                                sb._('<div class="message"></div>');
                                sb._('<div class="facebook"><a class="addthis_button_facebook at300b"></a></div>');
                                sb._('<div class="twitter"><a class="addthis_button_twitter at300b"></a></div>');
                                sb._('<div class="email"><a class="addthis_button_email at300b"></a></div>');
                            sb._('</div>');
                        sb._('</div>');
                    sb._('</div>');
                sb._('</div>');
                return $(sb.result());
            },
            click:function (object, callback) {
                $(object).click(function () {
                    callback(this);
                    return false;
                });
            },
            button:function (id, name) {
                return $("<div id='" + id + "'><span>" + name + "</span></div>");
            },
            buttonClick:function (button) {
                fn.click(button, function (ev) {
                    var id = jQuery(ev).attr('id');
                    window.location.href = storage.baseurl + 'index.php/feedback/' + id;
                });
                return button;
            }
        };

        module.init = function (renderType) {
            module.fn.call("feedback", "JMBFeedback", "get", null, function (json) {
                if (json) {
                    if (json.language) {
                        message = json.language;
                    }
                    var cont = fn.create();
                    fn.attachAddThis();
                    var sb = module.fn.stringBuffer();
                    sb._('<div class="body">');
                        sb._('<div class="text">');
                            sb._(message.FTT_MOD_FEEDBACK_WELCOM.replace("%%", message.FTT_MOD_FEEDBACK_PUBLIC_BETA));
                        sb._('</div>');
                        sb._('<div class="buttons">')
                        sb._('</div>');
                    sb._('</div>');

                    $(document.body).append(cont);
                    $(cont).find("#jmb_feedback_form").append(sb.result());

                    likes = $(cont).find('.likes');
                    $(likes).find('.message').text(message.FTT_MOD_FEEDBACK_LIKE);
                    $(cont).find('.body').append(likes);
                    $(likes).show();

                    var button1 = fn.buttonClick(fn.button("18-report-a-problem", message.FTT_MOD_FEEDBACK_REPORT_A_PROBLEB));
                    $(cont).find("div.buttons").append(button1);
                    var button2 = fn.buttonClick(fn.button("16-submit-an-idea", message.FTT_MOD_FEEDBACK_SUBMIT_AN_IDEA));
                    $(cont).find("div.buttons").append(button2);

                    $(cont).tabSlideOut({
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
            }, true);
        }

        return {
            init: function(renderType){
                module.init(renderType);
            }
        };
    }, true);
})(jQuery, $FamilyTreeTop);





