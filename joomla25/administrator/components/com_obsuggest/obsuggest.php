<?php
/**
 * @version		$Id: obsuggest.php 127 2011-03-08 03:00:29Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

global $mainframe, $option, $obIsJ15, $obIsJ16, $obIsJ17;
$version = new JVersion();
$obIsJ15 = ($version->RELEASE=='1.5');
$obIsJ16 = ($version->RELEASE=='1.6');
$obIsJ17 = ($version->RELEASE=='1.7');

if ( !$obIsJ15) {
	$option = 'com_obsuggest';
	$mainframe = &JFactory::getApplication();
	jimport( 'joomla.html.parameter' );
}

// load base controller
require_once(JPATH_COMPONENT.DS.'controllers'.DS.'default.php');

// load specify controller
if($controller = JRequest::getVar('controller','default')) {
	$path = JPATH_COMPONENT.DS.'controllers'.DS.$controller.'.php';
	if (file_exists($path)) {
		require_once($path);
	} else {
		$controller = 'default.php';
	}
}

require_once(JPATH_ADMINISTRATOR.DS."components".DS.$option.DS."helpers".DS."themes.php");
$theme = new Themes();
$theme->setTheme();

// create the controller
$jLordCoreController = 'Controller'.ucfirst($controller);
$controller = new $jLordCoreController();

// perform the request task
$controller->execute(JRequest::getVar('task'),'display');
// redirect if set by controller
$controller->redirect();
?>