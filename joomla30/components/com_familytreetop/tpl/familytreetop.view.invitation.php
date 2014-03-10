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
                    <a id="join" style="color: white;background: #0081c2;" href="<?=JRoute::_("index.php?option=com_familytreetop&view=invitation&state=1", false);?>" class="btn btn-large">
                        <span style="text-shadow: none;">Join this Family Tree</span>
                    </a>
                </div>
                <div style="text-align:right;margin-bottom:10px;">or <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=create&layout=form&state=1", false);?>">Create a New Family Tree</a></div>
            </div>
        </div>
        <div style="visibility: hidden; text-align: center; width: 100%; height: 140px;" familytreetop="progressbar" >
        </div>
    </div>
    <div class="span3"></div>
</div>
<div class="row" id="loginFooter" style="visibility:visible;">
    <div class="span12">
        <img src="<?=$this->baseurl;?>/templates/familytreetop/images/family_line.png" accesskey="">
    </div>
</div>
<script>
    (function($,w){
        'use strict';
        var progressbarAnimateStart = function(){
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
        $('#join').click(function(){
            progressbarAnimateStart();
            return true;
        });
    })(jQuery, window);
</script>
