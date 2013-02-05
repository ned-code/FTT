(function($, $ftt){
    $ftt.module.create("MOD_SYS_HEADER", function(){
        var	module = this,
            fn,
            cont,
            parent,
            exists,
            message;

        exists = {
            "famous-family":true,
            "first-page":true,
            "myfamily":true,
            "invitation":true
        };

        message = {
            FTT_COMPONENT_HEADER_MY_FAMILY_PART1: "My",
            FTT_COMPONENT_HEADER_MY_FAMILY_PART2: "Family",
            FTT_COMPONENT_HEADER_FAMOUS_FAMILY_PART1: "Famous",
            FTT_COMPONENT_HEADER_FAMOUS_FAMILY_PART2: "Family"
        };

        fn = {
            set:{
                class_name:{
                    cont:function(class_name){
                        jQuery(cont).addClass(class_name);
                    },
                    expand:function(class_name){
                        jQuery(cont).find('div.jmb-header-expand').addClass(class_name);
                    }
                },
                value:{
                    logo:function(class_name){
                        var value = fn.get.value.logo(class_name);
                        if('object' === typeof(value)){
                            jQuery(cont).find('div.jmb-header-logo').append(value);
                        }
                    }
                },
                msg:function(msg){
                    if('undefined' === typeof(msg)) return false;
                    for(var key in message){
                        if(typeof(msg[key]) != 'undefined'){
                            message[key] = msg[key];
                        }
                    }
                    return true;
                }
            },
            get:{
                is_iframe:function(){
                    return window != window.top;
                },
                msg:function(n){
                    var t = 'FTT_COMPONENT_HEADER_'+n.toUpperCase();
                    if(typeof(message[t]) != 'undefined'){
                        return message[t];
                    }
                    return '';
                },
                class_name:{
                    expand:function(){
                        if(fn.get.is_iframe()){
                            return 'facebook';
                        } else {
                            return 'familytreetop';
                        }
                    },
                    logo:function(){
                        if(fn.get.is_iframe()){
                            return ($FamilyTreeTop.global.alias!='login')?'familytreetop':$FamilyTreeTop.global.alias;
                        }
                        if($FamilyTreeTop.global.alias == 'myfamily' && parseInt(storage.usertree.usermap.loginType)){
                            return 'famous-family';
                        }
                        if($FamilyTreeTop.global.alias == 'famous-family'){
                            return 'famous-family';
                        }
                        if($FamilyTreeTop.global.alias == 'myfamily'){
                            return 'myfamily'
                        }
                    }
                },
                value:{
                    logo:function(class_name){
                        switch(class_name){
                            case "myfamily": return jQuery("<span>"+fn.get.msg('MY_FAMILY_PART1')+"</span><span>"+fn.get.msg('MY_FAMILY_PART2')+"</span>");
                            case "famous-family": return jQuery("<span>"+fn.get.msg('FAMOUS_FAMILY_PART1')+"</span><span>"+fn.get.msg('FAMOUS_FAMILY_PART2')+"</span>");
                            default: return "&nbsp;";
                        }
                    }
                }
            },
            show:{
                expand:function(){
                    jQuery(cont).find('div.jmb-header-expand').show();
                },
                logo:function(){
                    jQuery(cont).find('div.jmb-header-logo').show();
                }
            },
            click:{
                expand:function(){
                    jQuery(cont).find('div.jmb-header-expand').click(function(){
                        var src;
                        if(fn.get.is_iframe()){
                            src = storage.baseurl+"index.php/myfamily";
                        } else {
                            src = storage.app.link;
                        }
                        window.top.location.href = src;
                    });
                }
            },
            init:function(){
                fn.set.msg(storage.langString);
                if(exists[$FamilyTreeTop.global.alias]){
                    if($FamilyTreeTop.global.alias == 'myfamily' && !parseInt(storage.usertree.usermap.loginType) && fn.get.is_iframe()){
                        fn.show.expand();
                        fn.click.expand();
                    }
                    fn.show.logo();
                }
                fn.set.class_name.cont(fn.get.class_name.logo());
                fn.set.value.logo(fn.get.class_name.logo());
                fn.set.class_name.expand(fn.get.class_name.expand());
                jQuery(parent).append(cont);
            }
        };


        return {
            init:function(renderType){
                cont = $('<div class="jmb-header-container"><div class="jmb-header-logo" style="display:none;">&nbsp;</div><div style="display:none;" class="jmb-header-family-line">&nbsp;</div><div style="display:none;" class="jmb-header-expand">&nbsp;</div></div>');
                parent = $('div.content div.header');
                fn.init();
            }
        };
    }, true);
})(jQuery, $FamilyTreeTop);

