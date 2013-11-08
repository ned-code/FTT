<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

// App
$app = JFactory::getApplication();

// ACL Check
$user = JFactory::getUser();
if (!$user->authorise('core.manage', 'com_rsfirewall')) {
	return JError::raiseWarning(404, JText::_('JERROR_ALERTNOAUTHOR'));
}

require_once JPATH_COMPONENT.'/helpers/adapter.php';
require_once JPATH_COMPONENT.'/helpers/version.php';
require_once JPATH_COMPONENT.'/helpers/config.php';
require_once JPATH_COMPONENT.'/controller.php';
	
$controller	= JControllerLegacy::getInstance('RSFirewall');

$task = $app->input->get('task');

$controller->execute($task);
$controller->redirect();