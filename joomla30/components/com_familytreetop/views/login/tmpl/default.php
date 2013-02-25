<?php
defined('_JEXEC') or die;
?>
<div class="row">
    <div class="span12">
        <div class="well center">
            <a id="login" data-complete-text="finished!" data-loading-text="Loading..."  href="#" onclick="return false;" class="btn btn-large">Login</a>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this, load;
        load = function(el, args){
            $this.ajax('user.activate', args, function(){
                $(el).button('complete')
                console.log(arguments);
            });
        }

        $("#login").click(function(){
            var auth;
            $(this).button('loading');
            if( (auth = FB.getAuthResponse()) == null){
                FB.login(function(response){
                    if(response.status == "connected"){
                        load(this, response.authResponse);
                    }
                }, $this.getFacebookPermissions());
            } else {
                load(this, auth);
            }
        });
    });
</script>