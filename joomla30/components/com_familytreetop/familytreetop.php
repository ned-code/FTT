<?php
defined('_JEXEC') or die;

require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/activerecord.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/facebook.php';
require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/gedcom.php';
require __DIR__ . "/helpers/user.php";

ActiverecrdHelper::getInstance();
FacebookHelper::getInstance();

$gedcom = GedcomHelper::getInstance();

var_dump($gedcom->events->getList());
exit;
$controller = JControllerLegacy::getInstance('Familytreetop');
$controller->execute(JFactory::getApplication()->input->get('task', 'display'));
$controller->redirect();
