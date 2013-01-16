(function($ftt){
    $ftt.module.create("MOD_SYS_PROFILE_EDITOR", function(){
        var $module = this;
        $module.data.arguments = arguments;
        $module.data.msg = {
            "FTT_MOD_SYS_PROFILE_EDITOR_SLIDE_HEADER_BUTTON_BACK":"Back"
        }

        $module.data.slide = false;

        $module.fn.ajax = function(f, p, c){
            storage.callMethod("myfamily", "FTTProfileEditor", f, p, function(res){
                c(storage.getJSON(res.responseText));
            })
        }

        $module.fn.extend = function(def, set){
            return jQuery.extend({}, def, set);
        }

        $module.fn.getMsg = function(n){
            var t = 'FTT_MOD_SYS_PROFILE_EDITOR_'+n.toUpperCase();
            if(typeof($module.data.msg[t]) != 'undefined'){
                return $module.data.msg[t];
            }
            return '';
        }

        $module.fn.setMsg = function(msg){
            for(var key in $module.data.msg){
                if(typeof(msg[key]) != 'undefined'){
                    $module.data.msg[key] = msg[key];
                }
            }
            return true;
        }

        $module.fn.slide = function(){
            var slide = this,
                fn = false,
                settings = false,
                div = false,
                parent = false;

            fn = {
                createSlide:function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div class="ftt-profile-editor-slide">');
                        sb._('<div class="ftt-profile-editor-slide-header"></div>');
                        sb._('<div class="ftt-profile-editor-slide-content"></div>');
                    sb._('</div>');
                    return sb.result();
                },
                createHeaderButton:function(text){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div class="ftt-profile-editor-slide-header-button">');
                        sb._('<a href="javascript:void(0);">')._(text)._('</span>');
                    sb._('</div>');
                    return jQuery(sb.result());
                },
                initHeaderButtons:function(div){
                    var back = fn.createHeaderButton($module.fn.getMsg("SLIDE_HEADER_BUTTON_BACK"));
                    jQuery(div).find('.ftt-profile-editor-slide-header').append(back);
                    jQuery(back).click(function(){
                        $module.data.slide.close();
                    });
                }
            }

            settings = { width: 700, height: 500 };
            div = jQuery(fn.createSlide());
            jQuery(div).width(settings.width).height(settings.height).css("left", -1*(settings.width + 10));
            fn.initHeaderButtons(div);

            return {
                object: div,
                close: function(){
                    if(!$module.data.slide) return false;
                    jQuery(div).animate({"left":"-="+(settings.width + 10)+"px"}, "slow", function(){
                        jQuery(div).remove();
                    });
                    jQuery("#_content").css("overflow", "none");
                    jQuery(".header").animate({"left":"0px"}, "slow");
                    jQuery(".main").animate({"left":"0px"}, "slow");
                    working = false;
                    $module.data.slide = false;
                },
                init: function(){
                    jQuery(document.body).append(div);
                    jQuery(div).animate({"left":"0px"}, "slow");
                    jQuery("#_content").css("overflow", "hidden");
                    jQuery(".header").animate({"left":settings.width}, "slow");
                    jQuery(".main").animate({"left":settings.width}, "slow");
                },
                append: function(object){
                    jQuery(div).find(".ftt-profile-editor-slide-content").append(object);
                }
            }
        }

        $module.fn.box = function(){
            var box = this, fn;
            fn = {
                create: function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div class="ftt-profile-editor-box">');
                        sb._('<div class="ftt-profile-editor-box-header">');
                            sb._('<div class="ftt-profile-editor-box-header-title"><span>Basic Info</span></div>');
                            sb._('<div class="ftt-profile-editor-box-header-buttons">');
                                sb._('<div class="edit"><a href="javascript:void(0)">Edit</a></div>')
                            sb._('</div>');
                        sb._('</div>');
                        sb._('<div class="ftt-profile-editor-box-content"></div>');
                    sb._('</div>');
                    return jQuery(sb.result());
                }
            }
            return fn.create();
        }

        return {
            editor:function(settings){
                $module.data.slide = $module.fn.slide();
                $module.data.slide.init();

                var box = $module.fn.box("test", 0);
                $module.data.slide.append(box);
            },
            close:function(){
                if(!$module.data.slide) return;
                $module.data.slide.close();
            }
        }
    }, true);
})($FamilyTreeTop);


