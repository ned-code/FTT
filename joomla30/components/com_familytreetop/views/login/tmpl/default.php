<?php
defined('_JEXEC') or die;
$session = JFactory::getSession();

$invite = false;
$request_ids = $session->get('invite.request_ids', false);
if($request_ids){
    $ids = explode(',', $request_ids);
    if(!empty($ids)){
        $invite = FamilyTreeTopInvitations::find_by_request_id($ids);
    }
}
?>
<? if(!empty($invite)): ?>
<div class="row" id="inviteMessage">
    <div class="span3"></div>
    <div class="span6 well">
        <div style="float: left;"><img src="https://graph.facebook.com/<?=$invite->inviter_id;?>/picture?width=90&height=90" /></div>
        <div style="float: left;width:75%;margin-left:19px;">
            <div><b><?=$invite->inviter_name?></b> send you a <b>FamilyTreeTop</b> request:</div>
            <div style="width:100%;">
                <div style="float: left;"><img src="<?=JUri::base();?>templates/familytreetop/images/ftt_invitation.png"></div>
                <div style="float: left; width: 75%; margin-left:12px;">
                    <p style="color:gray; font-family: 'lucida grande',tahoma,verdana,arial,sans-serif; font-size: 11px;">
                        <?=base64_decode($invite->message);?>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="span3"></div>
</div>
<? endif; ?>
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
            <a id="login" data-complete-text="Login" data-loading-text="Please wait..."  href="#" onclick="return false;" class="btn btn-large">Login</a>
        </div>
        <div style="visibility: hidden; text-align: center; width: 100%; height: 140px;" familytreetop="progressbar" >
             <!--<img src="<?=$this->baseurl;?>/templates/familytreetop/img/circle_progressbar_128_128.GIF" /> -->
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
            progressbarAnimateStart();
            $this.ajax('user.activate', args, function(response){
                var w = window != window.top ? window.top : window;
                if(true == response.auth){
                    w.location.href = response.url;
                } else {
                    if(null != FB.getAuthResponse()){
                        FB.logout(function(){
                            w.location.href = response.url;
                        });
                    } else {
                        w.location.href = response.url;
                    }
                }
            });
            }
        progressbarAnimateStart = function(){
            //$('#login').html('<span style="color:#00AEE3;">Please wait...</span>');
            var target = $('[familytreetop="progressbar"]');
            $(target).css('visibility', 'visible');
            var width = $(target).width();
            var spinner = new Spinner({
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 8, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1.4, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left:'auto' // Left position relative to parent in px
            }).spin();
            $(spinner.el).css('top', '70px').css('left', Math.ceil(width/2)+'px');
	        $(target).append(spinner.el);
        }
        setPos = function(){
            var offset = $('#footer').offset();
            $("#loginFooter").css('position', 'absolute').css('top',(offset.top - 100)+'px');
            var p = $("#loginHeader").parent().parent();
            var o = $(p).offset();
            var d = (<?=(empty($invite))?1:0;?>)?100:0;
            var h = offset.top - o.top - d;
            $(p).css('height', h + "px");
            $('#loginHeader').css('margin-top', Math.ceil((h - ((d)?200:h))/2)+'px');

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
                FB.login(function(response){
                    if(response.status == "connected"){
                        load(this, response.authResponse);
                    }
                }, {scope: $FamilyTreeTop.app.permissions});
            } else {
                load(this, auth);
            }
        });
    });
</script>