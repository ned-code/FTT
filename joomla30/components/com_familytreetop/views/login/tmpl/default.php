<?php
defined('_JEXEC') or die;
?>
<div class="row">
    <div class="span4"></div>
    <div class="span4 text-center">
        <img src="<?=$this->baseurl;?>/templates/familytreetop/images/ftt_title.png" accesskey="">
    </div>
    <div class="span4"></div>
</div>
<div class="row">
    <div class="span4"></div>
    <div class="span4">
        <div class="well text-center">
            <a id="login" data-complete-text="Login" data-loading-text="Loading..."  href="#" onclick="return false;" class="btn btn-large">Login</a>
        </div>
    </div>
    <div class="span4"></div>
</div>
<div class="row">
    <div class="span12">
        <img src="<?=$this->baseurl;?>/templates/familytreetop/images/family_line.png" accesskey="">
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this, load;
        load = function(el, args){
            $this.ajax('user.activate', args, function(response){
                $(el).button('complete');
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

        $("#login").click(function(){
            var auth;
            $(this).button('loading');
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