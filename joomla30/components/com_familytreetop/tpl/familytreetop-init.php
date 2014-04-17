<?php
?>
<script>
    if(!$FamilyTreeTop.app.config.appId){
        console.log('Facebook App Id doesn\'t exist');
    } else {
        jQuery(document).ready(function() {
            jQuery.ajaxSetup({ cache: true });
            jQuery.getScript('//connect.facebook.net/en_US/all.js', function(){
                FB.init($FamilyTreeTop.app.config);
                FB.getLoginStatus(function(response){
                    TDFriendSelector.init({debug: false});
                    <?php if($fttUser->joyride): ?>
                    $FamilyTreeTop.joyride = true;
                    <?php endif; ?>
                    $FamilyTreeTop.init();
                }, true);
            });
        });
    }
</script>