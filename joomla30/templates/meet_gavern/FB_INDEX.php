<?php
defined('_JEXEC') or die;
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/settings.php';
// Getting params from template
$params = JFactory::getApplication()->getTemplate(true)->params;

$app = JFactory::getApplication();
$doc = JFactory::getDocument();

$settings = FamilyTreeTopSettingsHelper::getInstance()->get();
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.js"></script><body>
<script>
    $FamilyTreeTop.app.config.appId = '<?=$settings->facebook_app_id->value;?>';
    $FamilyTreeTop.app.config.channelUrl = '<?=JURI::base(); ?>templates/<?=$this->template; ?>/channel.html';
    $FamilyTreeTop.app.permissions = '<?=$settings->facebook_permission->value;?>';
</script>
<div id="fb-root"></div>
<div class="container">
    <div class="row">
        <div class="span12">
        </div>
    </div>
</div>
<script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/jquery-2.0.3.min.js"></script>
<script>
    if(!$FamilyTreeTop.app.config.appId){
        console.log('Facebook App Id doesn\'t exist');
    } else {
        jQuery(document).ready(function() {
            jQuery.ajaxSetup({ cache: true });
            jQuery.getScript('//connect.facebook.net/en_US/all.js#appId=' + $FamilyTreeTop.app.config.appId, function(){
                FB.init({
                    appId: '' + $FamilyTreeTop.app.config.appId + '',
                    channelUrl : '' + $FamilyTreeTop.app.config.channelUrl + '',
                    status: true,
                    xfmbl: true,
                    oauth: true
                });
                FB.getLoginStatus(function(response){
                     console.log(response);
                     if(response.status === "unknown"){
                         FB.login(function(response) {
                             console.log(response);
                             FB.getLoginStatus(function(response){console.log(response)});
                         }, {scope: $FamilyTreeTop.app.permissions});
                     }
                });
                setTimeout(function(){
                    FB.getLoginStatus(function(response){console.log(response)});
                }, 5000);
           });
       });
    }
</script>
</body>
</html>
