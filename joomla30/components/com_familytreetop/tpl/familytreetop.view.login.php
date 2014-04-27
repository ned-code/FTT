<?php
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();
$template = $settings->_template->value;
?>
<img src="<?=$this->baseurl;?>/templates/<?=$template?>/images/ftt_title.png" accesskey="">
<div class="well text-center" style="">
    <a id="login" href="#" onclick="return false;" class="btn btn-success btn-lg">Login</a>
</div>
<div style="visibility: hidden; text-align: center; width: 100%; height: 140px;" familytreetop="progressbar" ></div>

<script>
    $FamilyTreeTop.bind(function($){
        var $this = this, load, setPos, progressbarAnimateStart;
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

        $('#autoscroll').panorama();
        $('#autoscroll').closest('.row').css('visibility', 'visible');

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
