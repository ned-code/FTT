<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
 
// Access check.
if (!JFactory::getUser()->authorise('core.manage', 'com_simplecustomrouter')) {
    return JError::raiseWarning(404, JText::_('JERROR_ALERTNOAUTHOR'));
}

JLoader::register('SimpleCustomRouterHelper', dirname(__FILE__) . '/helpers/simplecustomrouter.php');

$controller = JControllerLegacy::getInstance('SimpleCustomRouter');
$controller->execute(JRequest::getCmd('task'));
$controller->redirect();
