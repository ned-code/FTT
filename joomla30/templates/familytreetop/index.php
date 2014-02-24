<?php
defined('_JEXEC') or die;
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/settings.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/activerecord.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/facebook.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/gedcom.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/user.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/upload.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/languages.php';

ActiverecrdHelper::getInstance();
FamilyTreeTopSettingsHelper::getInstance();
$facebook = FacebookHelper::getInstance()->facebook;

// Getting params from template
$params = JFactory::getApplication()->getTemplate(true)->params;

// Add current user information
$user = JFactory::getUser();
$fttUser = FamilyTreeTopUserHelper::getInstance()->get();
$app = JFactory::getApplication();
$doc = JFactory::getDocument();

$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap-responsive.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap-combined.no-icons.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/font-awesome.css');
//$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.icon-large.min.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap-scroll-modal.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/bootstrap.fix.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/jquery.fileupload-ui.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/csstreeview.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/csstreeview.fix.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/tdfriendselector.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/familytreetop.css');
$doc->addStyleSheet('templates/'.$this->template.'/css/flexicontactplus.fix.css');

// Add familytreetop settings
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();

$data = GedcomHelper::getInstance()->getData();
$json_data = json_encode($data);
$treeUsers = GedcomHelper::getInstance()->getTreeUsers('gedcom_id');
$treeViewUsers = GedcomHelper::getInstance()->sortUsersByView($treeUsers, $data);
//$script = time();
$script = "";
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/css/style.css">
    <noscript><link rel="stylesheet" href="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/css/jquery.fileupload-ui-noscript.css"></noscript>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/holder.js"></script>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/excanvas.js"></script>
    <script src="<?php echo $this->baseurl ?>/templates/<?=$this->template; ?>/js/familytreetop.js?<?=$script;?>"></script>
	<jdoc:include type="head" />
	<!--[if lt IE 9]>
		<script src="<?php echo $this->baseurl ?>/media/jui/js/html5.js"></script>
	<![endif]-->
</head>
<body>
<script>
    $FamilyTreeTop.app.config.appId = '<?=$settings->facebook_app_id->value;?>';
    $FamilyTreeTop.app.config.channelUrl = '<?=JURI::base(); ?>templates/<?=$this->template; ?>/channel.html';

    $FamilyTreeTop.app.permissions = '<?=$settings->facebook_permission->value;?>';
    $FamilyTreeTop.app.data = '<?=json_encode(FacebookHelper::getInstance()->data); ?>';

    $FamilyTreeTop.facebookAccessToken = '<?=$facebook->getAccessToken();?>';

    $FamilyTreeTop.users = '<?=$treeViewUsers?>';

    $FamilyTreeTop.userString = '<?=json_encode(FamilyTreeTopUserHelper::getInstance()->get()); ?>';

    $FamilyTreeTop.template = '<?=$this->template?>';

    $FamilyTreeTop.currenturl = '<?=JUri::current();?>';
    $FamilyTreeTop.rooturl = '<?=substr(JUri::base(), 0, strlen(JUri::base()) - 1);?>';
    $FamilyTreeTop.baseurl = '<?=$this->baseurl;?>';
    $FamilyTreeTop.templateurl = '<?=$this->baseurl;?>/templates/<?=$this->template;?>';

    $FamilyTreeTop.languagesString = '<?=FamilyTreeTopLanguagesHelper::get()?>';

    $FamilyTreeTop.dataString = <?=$json_data?>;
</script>
<div id="fb-root"></div>
<div id="wrap">
    <div id="main" class="clearfix">
        <jdoc:include type="modules" name="navbar" style="none" />
        <div class="container">
            <div class="row">
                <div class="span12">
                    <jdoc:include type="message" />
                    <jdoc:include type="component" />
                </div>
            </div>
        </div>
    </div>
</div>
<div id="footer">
    <div class="container" style="text-align: center;">
        <jdoc:include type="modules" name="footer" style="" />
    </div>
</div>
</body>
</html>
