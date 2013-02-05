(function($, $ftt){
    $ftt.module.create("MOD_", function(name, parent, ajax, renderType, popup){
        var	module = this,
            sb = module.fn.stringBuffer(),
            cont = null;

        var div = $("<div class='ftt-preloader-alert'><div>You are now being logged in using your Facebook credentials</div></div>");
        $(div).hide();
        $(document.body).append(div);

        sb._('<div class="jmb-login-button-container">');
        sb._('<div class="jmb-login-button-title"><span>You must be logged in to access your Family Tree</span></div>');
        sb._('<div class="jmb-login-button">');
        sb._('<div class="jmb-login-button-f">f</div>');
        sb._('<div class="jmb-login-button-body">');
        sb._('<div class="jmb-login-button-u"><span>facebook</span></div>');
        sb._('<div class="jmb-login-button-d"><span>login through facebook</span></div>');
        sb._('</div>')
        sb._('</div>');
        sb._('</div>');
        cont = $(sb.result());
        $(parent).append(cont);
        $(cont).find('.jmb-login-button').click(function(){
            FB.login(function(response){
                if(response.authResponse){
                    module.fn.alert(div, function(){});
                    $(div).show();
                    window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=loginFacebookUser&return=myfamily';
                } else {
                    alert('Login failed.')
                }
            }, {scope: jfbcRequiredPermissions});
        });

        var setButtonPosition = function(){
            var height = $(window).height();
            var size = (height / 2 - 150)  + 'px';
            $(cont).css('margin', size+" auto");
        }

        $(window).resize(function(){
            setButtonPosition();
        });
        setButtonPosition();

        return this;
    });
})(jQuery, $FamilyTreeTop);




