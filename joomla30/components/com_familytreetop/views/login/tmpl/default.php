<?php
defined('_JEXEC') or die;
?>
<div class="row" id="loginHeader" style="visibility: hidden;">
    <div class="span4"></div>
    <div class="span4 text-center">
        <img src="<?=$this->baseurl;?>/templates/familytreetop/images/ftt_title.png" accesskey="">
    </div>
    <div class="span4"></div>
</div>
<div class="row" id="loginContent" style="visibility:hidden;">
    <div class="span4">
    </div>
    <div class="span4">
        <div class="well text-center">
            <a id="login" data-complete-text="Login" data-loading-text="Loading..."  href="#" onclick="return false;" class="btn btn-large">Login</a>
        </div>
        <div style="visibility: hidden; text-align: center;" familytreetop="progressbar">
             <img src="<?=$this->baseurl;?>/templates/familytreetop/img/circle_progressbar_128_128.GIF" />
        </div>
    </div>
    <div class="span4"></div>
</div>
<div class="row" id="loginFooter" style="visibility:hidden;">
    <div class="span12">
        <img src="<?=$this->baseurl;?>/templates/familytreetop/images/family_line.png" accesskey="">
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this, load, setPos,progressbarAnimateStart;
        load = function(el, args){
            $this.ajax('user.activate', args, function(response){
                if(response.auth == true){
                    window.location.href = "<?=JRoute::_("index.php?option=com_familytreetop&view=myfamily", false);?>";
                } else if("undefined" !== response.url){
                    if(args.userID != 0){
                        window.location.href = response.url;
                    } else {
                        console.log(response.url);
                    }

                }
            });
            }
        progressbarAnimateStart = function(){
            $('[familytreetop="progressbar"]').css('visibility', 'visible');
        }
        setPos = function(){
            var offset = $('#footer').offset();
            $("#loginFooter").css('position', 'absolute').css('top',(offset.top - 100)+'px');
            var p = $("#loginHeader").parent().parent();
            var o = $(p).offset();
            var h = offset.top - o.top - 100;
            $(p).css('height', h + "px");
            $('#loginHeader').css('margin-top', Math.ceil((h - 200)/2)+'px');

            $("#loginHeader").css("visibility", "visible");
            $("#loginContent").css("visibility", "visible");
            $("#loginFooter").css("visibility", "visible");
        }

        setPos();
        $(window).resize(function(){
            setPos();
        });
        $("#login").click(function(){
            var auth;
            if( (auth = FB.getAuthResponse()) == null){
                FB.login(function(response){}, {scope: $FamilyTreeTop.app.permissions});
                FB.Event.subscribe('auth.login', function(response) {
                    progressbarAnimateStart();
                    if(response.status == "connected"){
                        load(this, response.authResponse);
                    }
                });
            } else {
                load(this, auth);
            }
        });
    });
</script>