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
FacebookHelper::getInstance();
FamilyTreeTopSettingsHelper::getInstance();
FamilyTreeTopUserHelper::getInstance();
FamilyTreeTopLanguagesHelper::init();

$doc = JFactory::getDocument();
$app = & JFactory::getApplication();
$template = $app->getTemplate();

$doc->addStyleSheet('templates/'.$template.'/css/bootstrap.min.css');
$doc->addStyleSheet('templates/'.$template.'/css/bootstrap-responsive.min.css');
$doc->addStyleSheet('templates/'.$template.'/css/bootstrap-combined.no-icons.min.css');
$doc->addStyleSheet('templates/'.$template.'/css/font-awesome.css');
//$doc->addStyleSheet('templates/'.$template.'/css/bootstrap.icon-large.min.css');
$doc->addStyleSheet('templates/'.$template.'/css/bootstrap-scroll-modal.css');
$doc->addStyleSheet('templates/'.$template.'/css/bootstrap.fix.css');
$doc->addStyleSheet('templates/'.$template.'/css/jquery.fileupload-ui.css');
$doc->addStyleSheet('templates/'.$template.'/css/csstreeview.css');
$doc->addStyleSheet('templates/'.$template.'/css/csstreeview.fix.css');
$doc->addStyleSheet('templates/'.$template.'/css/tdfriendselector.css');
$doc->addStyleSheet('templates/'.$template.'/css/familytreetop.css');
$doc->addStyleSheet('templates/'.$template.'/css/flexicontactplus.fix.css');

$doc->addScript(JURI::base()."/components/com_familytreetop/js/holder.js");
$doc->addScript(JURI::base()."/components/com_familytreetop/js/excanvas.js");
$doc->addScript(JURI::base()."/components/com_familytreetop/js/familytreetop.js");

$language =& JFactory::getLanguage();
$language->load('tpl_familytreetop', JPATH_SITE, $language->getTag(), true);

$controller = JControllerLegacy::getInstance('Familytreetop');
$controller->execute(JFactory::getApplication()->input->get('task', 'display'));
$controller->redirect();
