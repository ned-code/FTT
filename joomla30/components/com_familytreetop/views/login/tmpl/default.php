<?php
defined('_JEXEC') or die;
?>
<div id="loginCont">
    <div id="loginWrap">
        <div class="row" id="loginHeader">
            <div class="span4"></div>
            <div class="span4 text-center">
                <img src="<?=$this->baseurl;?>/templates/familytreetop/images/ftt_title.png" accesskey="">
            </div>
            <div class="span4"></div>
        </div>
        <div class="row" id="loginContent">
            <div class="span4"></div>
            <div class="span4">
                <div class="well text-center">
                    <a id="login" data-complete-text="Login" data-loading-text="Loading..."  href="#" onclick="return false;" class="btn btn-large">Login</a>
                </div>
                <div style="visibility: hidden;" class="progress progress-striped active">
                    <div class="bar" style="width: 0%;"></div>
                </div>
            </div>
            <div class="span4"></div>
        </div>
    </div>
    <div class="row" id="loginFooter">
        <div class="span12">
            <img src="<?=$this->baseurl;?>/templates/familytreetop/images/family_line.png" accesskey="">
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this, load, setPos,progressbarTimer, progressbarPercent, progressbarAnimateStart, progressbarAnimateStop;
        load = function(el, args){
            $this.ajax('user.activate', args, function(response){
                progressbarAnimateStop();
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
        progressbarPercent = 0;
        progressbarAnimateStart = function(){
            $('.progress').css('visibility', 'visible');
            var bar = $('.bar');
            progressbarTimer = setInterval(function(){
                progressbarPercent += 1;
                if(progressbarPercent==98){
                    progressbarPercent = 97;
                }
                $(bar).css('width', progressbarPercent+'%');
            }, 100);
        }
        progressbarAnimateStop = function(){
            clearInterval(progressbarTimer);
            $('.bar').css('width', '100%');
        }
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