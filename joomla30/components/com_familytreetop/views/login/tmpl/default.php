<?php
defined('_JEXEC') or die;
$session = JFactory::getSession();
$user = FamilyTreeTopUserHelper::getInstance()->get();
$tpl_path = JPATH_BASE . DIRECTORY_SEPARATOR . 'components/com_familytreetop/tpl/';

?>
<?php include($tpl_path . "familytreetop-header-init.php"); ?>
<?php include($tpl_path . "familytreetop-root.php"); ?>
<div id="wrap">
    <div id="main" class="clearfix" style="padding-bottom:300px;">
        <?php
        $module = JModuleHelper::getModule('ftt_navbar');
        echo JModuleHelper::renderModule($module);
        ?>
        <div class="container">
            <div class="row">
                <div class="col-md-12 text-center">
                    <img src="<?=$this->baseurl;?>/templates/<?=$template?>/images/ftt_title.png" accesskey="">
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="well col-md-offset-4 col-md-4 col-xs-12 text-center">
                        <a id="login" href="#" onclick="return false;" class="btn btn-success btn-lg">Login</a>
                    </div>
                    <div style="visibility: visible;text-align: center;width: 0;height: 0;margin: 0px auto;margin-top: 80px;" familytreetop="progressbar" ></div>
                </div>
            </div>
        </div>
    </div>
</div>
<div>
<div class="hidden-xs" style="display: table;position: relative;margin-top: -18px;">
    <div class="panorama-box" style="visibility: hidden;position: relative;height: 124px;margin-top: -184px;clear: both; overflow: hidden;">
        <img id="autoscroll" src="<?=$this->baseurl;?>/templates/<?=$template?>/images/family_line.png" width="1588" height="124" class="panorama" accesskey="">
    </div>
    </div>
    </div>
<div id="footer">
    <div class="container" style="text-align: center;">
        <?php
        $module = JModuleHelper::getModule('ftt_footer');
        echo JModuleHelper::renderModule($module);
        ?>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this;
        $('.panorama-box').width($('#wrap').width());
        $('#autoscroll').panorama();
        $('#autoscroll').closest('.panorama-box').css('visibility', 'visible');

        $('#login').click(function(){
            FB.login(function(response){
                if(response.status == "connected"){
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

                    $this.ajax('user.activate', response.authResponse, function(res){
                        var w = window != window.top ? window.top : window;
                        if(true == res.auth){
                            w.location.href = res.url;
                        } else {
                            if(null != FB.getAuthResponse()){
                                FB.logout(function(){
                                    w.location.href = res.url;
                                });
                            } else {
                                w.location.href = res.url;
                            }
                        }
                    });
                }
            }, {scope: $FamilyTreeTop.app.permissions});
        });
    });
</script>
<?php include($tpl_path . "familytreetop-scripts.php"); ?>
<?php include($tpl_path . "familytreetop-init.php"); ?>

