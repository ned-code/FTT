<?php
defined('_JEXEC') or die;

$controller	= JControllerLegacy::getInstance('Familytreetop');
$controller->execute(JFactory::getApplication()->input->get('task'));
$controller->redirect();
