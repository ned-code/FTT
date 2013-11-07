<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

$app = JFactory::getApplication();

require_once JPATH_ADMINISTRATOR.'/components/com_rsfirewall/helpers/adapter.php';
require_once JPATH_ADMINISTRATOR.'/components/com_rsfirewall/helpers/config.php';
require_once JPATH_COMPONENT.'/controller.php';
	
$controller	= JControllerLegacy::getInstance('RSFirewall');

$task = $app->input->get('task');

$controller->execute($task);
$controller->redirect();