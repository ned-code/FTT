<?php
defined('_JEXEC') or die;
$invites = FamilyTreeTopUserHelper::getInstance()->isUserInInvitationsList();
if(!empty($invites)){
    $invite = $invites[0];
}
?>
<div class="row" id="loginHeader" style="visibility: hidden;">
    <div class="span4"></div>
    <div class="span4 text-center">
        <img src="<?=$this->baseurl;?>/templates/familytreetop/images/ftt_title.png" accesskey="">
    </div>
    <div class="span4"></div>
</div>
<div class="row" id="loginContent" style="visibility:hidden;">
    <div class="span3">
    </div>
    <div class="span6">
        <div class="well" style="height:130px;">
            <div style="float: left;"><img src="https://graph.facebook.com/<?=$invite->inviter_id;?>/picture?width=90&height=90" /></div>
            <div style="float: left;width:75%;margin-left:19px;">
                <div><?=base64_decode($invite->message);?></div>
                <div style="text-align: center;margin: 15px;"><a style="color:black;background: #0081c2;" href="<?=JRoute::_("index.php?option=com_familytreetop&view=invitation&state=1", false);?>" class="btn btn-large"><span><b>Join this Family Tree</b></span></a></div>
                <div style="text-align:right;">or <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=create&layout=form&state=1", false);?>">Create a New Family Tree</a></div>
            </div>
        </div>
    </div>
    <div class="span3"></div>
</div>
<div class="row" id="loginFooter" style="visibility:hidden;">
    <div class="span12">
        <img src="<?=$this->baseurl;?>/templates/familytreetop/images/family_line.png" accesskey="">
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var setPos = function(){
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
    });
</script>
