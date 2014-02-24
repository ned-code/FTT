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
<!-- The template to display files available for upload -->
<script id="template-upload" type="text/x-tmpl">
    {% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload fade">
        <td class="preview"><span class="fade"></span></td>
        <td class="name"><span>{%=file.name%}</span></td>
        <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
        {% if (file.error) { %}
        <td class="error" colspan="2"><span class="label label-important">Error</span> {%=file.error%}</td>
        {% } else if (o.files.valid && !i) { %}
        <td>
            <div class="progress progress-success progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="bar" style="width:0%;"></div></div>
        </td>
        <td>{% if (!o.options.autoUpload) { %}
            <button class="btn btn-primary start">
                <i class="icon-upload icon-white"></i>
                <span>Start</span>
            </button>
            {% } %}</td>
        {% } else { %}
        <td colspan="2"></td>
        {% } %}
        <td>{% if (!i) { %}
            <button class="btn btn-warning cancel">
                <i class="icon-ban-circle icon-white"></i>
                <span>Cancel</span>
            </button>
            {% } %}</td>
    </tr>
    {% } %}
</script>
<!-- The template to display files available for download -->
<script id="template-download" type="text/x-tmpl">
    {% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-download fade">
        {% if (file.error) { %}
        <td></td>
        <td class="name"><span>{%=file.name%}</span></td>
        <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
        <td class="error" colspan="2"><span class="label label-important">Error</span> {%=file.error%}</td>
        {% } else { %}

        <td class="preview">{% if (file.thumbnail_url) { %}
            <a href="#{%=file.url%}" title="{%=file.name%}" data-gallery="gallery" download="{%=file.name%}"><img src="#{%=file.thumbnail_url%}"></a>
            {% } %}</td>
        <td class="name">
            <a href="#{%=file.url%}" title="{%=file.name%}" data-gallery="{%=file.thumbnail_url&&'gallery'%}" download="{%=file.name%}">{%=file.original_name%}</a>
        </td>
        <td class="size"><span>{%=o.formatFileSize(file.size)%}</span></td>
        <td colspan="2"></td>
        {% } %}
        <td>
            <button class="btn btn-danger delete" data-type="{%=file.delete_type%}" data-url="{%=file.delete_url%}"{% if (file.delete_with_credentials) { %} data-xhr-fields='{"withCredentials":true}'{% } %}>
            <i class="icon-trash icon-white"></i>
            <span>Delete</span>
            </button>
            <input type="checkbox" name="delete" value="1" class="toggle">
        </td>
    </tr>
    {% } %}
</script>
</body>
</html>
