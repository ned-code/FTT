<?php
defined('_JEXEC') or die;

require_once JPATH_ADMINISTRATOR . DIRECTORY_SEPARATOR . 'components/com_familytreetop/helpers/activerecord.php';

$helper = new ActiverecrdHelper();
$helper->init();

$controller = JControllerLegacy::getInstance('Familytreetop');
$controller->execute(JFactory::getApplication()->input->get('task', 'display'));
$controller->redirect();
