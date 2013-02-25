(function($, $ftt){
    $ftt.module.create("MOD_SYS_TOPMENUBAR", function(){
        var $module = this,
            fn = {
               getMsg:function(n){
                   var t = 'FTT_MOD_TOPMENUBAR_'+n.toUpperCase();
                   if(typeof($module.data.msg[t]) != 'undefined'){
                       return $module.data.msg[t];
                   }
                   return '';
               },
               getAliasUcFirst:function (a) {
                   if (typeof(a) == 'undefined') return '';
                   var firstKey = a[0].toUpperCase();
                   var string = a.slice(1);
                   return [firstKey, string].join('');
               },
               getLanguageString:function (callback) {
                   jQuery.ajax({
                       url:"index.php?option=com_manager&task=getLanguage&module_name=topmenubar",
                       type:"GET",
                       dataType:"html",
                       complete:function (req, err) {
                           var json = jQuery.parseJSON(req.responseText);
                           callback(json);
                       }
                   });
               },
               setMsg:function(msg){
                   for(var key in $module.data.msg){
                       if(typeof(msg[key]) != 'undefined'){
                           $module.data.msg[key] = msg[key];
                       }
                   }
                   return true;
               },
               setActiveElement:function(cont){
                   switch ($FamilyTreeTop.global.alias) {
                       case "home":
                           fn.onSwitch(cont, $(cont).find('div#home span'));
                           break;

                       case "famous-family":
                           fn.onSwitch(cont, $(cont).find('div#famous-family span'));
                           break;

                       case "login":
                           fn.onSwitch(cont, $(cont).find('div#myfamily span'));
                           break;

                       case "first-page":
                       case "myfamily":
                           if ($module.data.loggedByFamous) {
                               fn.onSwitch(cont, $(cont).find('div#famous-family span'));
                           } else {
                               fn.onSwitch(cont, $(cont).find('div#myfamily span'));
                           }
                           break;

                       default:
                           break;
                   }
               },
               isFooterLink:function () {
                    switch ($FamilyTreeTop.global.alias) {
                        case "about":
                        case "conditions":
                        case "privacy":
                        case "feedback":
                        case "help":
                        case "contact":
                            return true;
                        default:
                            return false;
                    }
               },
               createFooterMenu:function(isFooterLink){
                   if(!isFooterLink) return "";
                   var sb = $module.fn.stringBuffer();
                   sb._('<div style="max-width:760px; margin: 0 auto; position: relative;">');
                   sb._('<div class="jmb-top-menu-bar-title">Family TreeTop: <span>')._(fn.getAliasUcFirst($FamilyTreeTop.global.alias))._('</span></div>');
                   sb._('<div class="jmb-top-menu-bar-return"><span>')._(fn.getMsg("return"))._('</span></div>');
                   sb._('</div>');
                   return sb.result();
               },
               createContentMenu:function(isFooterLink){
                   if($module.data.type != "desctop" || isFooterLink) return "";
                   var sb = $module.fn.stringBuffer();
                   sb._('<div class="jmb-top-menu-bar-content">');
                        sb._('<div id="myfamily" class="jmb-top-menu-bar-item"><span>')._(fn.getMsg('myfamily'))._('</span></div>');
                        sb._('<div id="famous-family" class="jmb-top-menu-bar-item"><span>')._(fn.getMsg('famous_families'))._('</span></div>');
                        sb._('<div id="home" class="jmb-top-menu-bar-item"><span>')._(fn.getMsg('home'))._('</span></div>');
                   sb._('</div>');
                   return sb.result();
               },
               create:function(){
                   var sb = $module.fn.stringBuffer(),
                        isFooterLink = fn.isFooterLink();
                   sb._('<div  class="jmb-top-menu-bar">');
                        sb._('<div class="jmb-top-menu-bar-logo">&nbsp;</div>');
                        sb._(fn.createContentMenu(isFooterLink));
                        sb._(fn.createFooterMenu(isFooterLink));
                        sb._('<div id="_profile"></div>');
                   sb._('</div>');
                   return $(sb.result());
               },
               append:function(o){
                   $("#_header").append(o);
               },
               onSwitch:function(cont, object){
                   jQuery(cont).find('div.jmb-top-menu-bar-item span').removeClass('active');
                   jQuery(object).addClass('active');
               },
               onClick:function(cont){
                   var id;
                   jQuery(cont).find('div.jmb-top-menu-bar-item span').click(function () {
                       id = jQuery(this).parent().attr('id');
                       fn.onSwitch(cont, this);
                       jQuery.ajax({
                           url:'index.php?option=com_manager&task=setLocation&alias=' + id,
                           type:"POST",
                           dataType:"json",
                           complete:function (req, err) {
                               var bUrl = $FamilyTreeTop.global.base;
                               window.location.href = bUrl + 'index.php/' + id;
                           }
                       });
                   });
                   jQuery(cont).find('div.jmb-top-menu-bar-return').click(function () {
                       var id = 'myfamily';
                       jQuery.ajax({
                           url:'index.php?option=com_manager&task=setLocation&alias=' + id,
                           type:"POST",
                           dataType:"json",
                           complete:function (req, err) {
                               var bUrl = $FamilyTreeTop.global.base;
                               window.location.href = bUrl + 'index.php/' + id;
                           }
                       });
                   });
               }
            };

        $module.data.settings = {};
        $module.data.msg = {
            FTT_MOD_TOPMENUBAR_MYFAMILY:"My Family",
            FTT_MOD_TOPMENUBAR_FAMOUS_FAMILIES:"Famous Families",
            FTT_MOD_TOPMENUBAR_HOME:"Home",
            FTT_MOD_TOPMENUBAR_RETURN:"Return to Family TreeTop"
        }
        $module.data.loggetByFamous = parseInt($(document.body).attr('_type'));
        $module.data.type = "desctop";
        $module.data.content = [];

        return {
            init:function(type){
               if(type == "facebook") return false;
               fn.getLanguageString(function(msg){
                   $module.data.type = type;
                   $module.data.content = fn.create();
                   fn.setMsg(msg);
                   fn.append($module.data.content);
                   fn.onClick($module.data.content);
                   fn.setActiveElement($module.data.content);
               });
            }
        };
    }, true);
})(jQuery, $FamilyTreeTop);

		

