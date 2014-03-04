<?php
$app = & JFactory::getApplication();
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();
$template = $settings->_template->value;

$settings = FamilyTreeTopSettingsHelper::getInstance()->get();
$facebook = FacebookHelper::getInstance()->facebook;

$data = GedcomHelper::getInstance()->getData();
$json_data = json_encode($data);
$treeUsers = GedcomHelper::getInstance()->getTreeUsers('gedcom_id');
$treeViewUsers = GedcomHelper::getInstance()->sortUsersByView($treeUsers, $data);

?>
<script>
    $FamilyTreeTop.app.config.appId = '<?=$settings->{$settings->SERVER_NAME.'.facebook_app_id'}->value;?>';
    $FamilyTreeTop.app.config.channelUrl = '<?=JURI::base(); ?>templates/<?=$template; ?>/channel.html';

    $FamilyTreeTop.app.permissions = '<?=$settings->facebook_permission->value;?>';
    $FamilyTreeTop.app.data = '<?=json_encode(FacebookHelper::getInstance()->data); ?>';

    $FamilyTreeTop.facebookAccessToken = '<?=$facebook->getAccessToken();?>';

    $FamilyTreeTop.users = '<?=$treeViewUsers?>';

    $FamilyTreeTop.userString = '<?=json_encode(FamilyTreeTopUserHelper::getInstance()->get()); ?>';

    $FamilyTreeTop.template = '<?=$template?>';

    $FamilyTreeTop.currenturl = '<?=JUri::current();?>';
    $FamilyTreeTop.rooturl = '<?=substr(JUri::base(), 0, strlen(JUri::base()) - 1);?>';
    $FamilyTreeTop.baseurl = '<?=$this->baseurl;?>';
    $FamilyTreeTop.templateurl = '<?=$this->baseurl;?>/templates/<?=$template;?>';

    $FamilyTreeTop.languagesString = '<?=FamilyTreeTopLanguagesHelper::get()?>';

    $FamilyTreeTop.dataString = <?=$json_data?>;
</script>