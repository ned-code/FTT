<?php
?>
<div class="row" id="loginHeader" style="visibility: visible; margin-top: 20px; margin-bottom:20px;">
    <div class="span4"></div>
    <div class="span4 text-center">
        <img src="<?=$this->baseurl;?>/templates/familytreetop/images/ftt_title.png" accesskey="">
    </div>
    <div class="span4"></div>
</div>
<div class="row" id="loginContent" style="visibility:visible; margin-top: 20px; margin-bottom:20px;">
    <div class="span3">
    </div>
    <div class="span6">
        <div class="well" style="height:130px;">
            <div style="float: left;"><img src="https://graph.facebook.com/<?=$invite->inviter_id;?>/picture?width=90&height=90" /></div>
            <div style="float: left;width:75%;margin-left:19px;">
                <div><?=base64_decode($invite->message);?></div>
                <div style="text-align: center;margin: 15px;">
                    <a style="color: white;background: #0081c2;" href="<?=JRoute::_("index.php?option=com_familytreetop&view=invitation&state=1", false);?>" class="btn btn-large">
                        <span style="text-shadow: none;">Join this Family Tree</span>
                    </a>
                </div>
                <div style="text-align:right;margin-bottom:10px;">or <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=create&layout=form&state=1", false);?>">Create a New Family Tree</a></div>
            </div>
        </div>
    </div>
    <div class="span3"></div>
</div>
<div class="row" id="loginFooter" style="visibility:visible;">
    <div class="span12">
        <img src="<?=$this->baseurl;?>/templates/familytreetop/images/family_line.png" accesskey="">
    </div>
</div>
