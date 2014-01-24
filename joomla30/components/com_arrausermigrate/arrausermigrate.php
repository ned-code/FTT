<?php

/**
 * ARRA User Export Import component for Joomla! 1.6
 * @version 1.6.0
 * @author ARRA (joomlarra@gmail.com)
 * @link http://www.joomlarra.com
 * @Copyright (C) 2010 - 2011 joomlarra.com. All Rights Reserved.
 * @license GNU General Public License version 2, see LICENSE.txt or http://www.gnu.org/licenses/gpl-2.0.html
 * PHP code files are distributed under the GPL license. All icons, images, and JavaScript code are NOT GPL (unless specified), and are released under the joomlarra Proprietary License, http://www.joomlarra.com/licenses.html
 */

defined( '_JEXEC' ) or die( 'Restricted access' );
jimport('joomla.application.component.controller');

// Require the base controller
require_once(JPATH_COMPONENT.DS.'controller.php');
// Require specific controller if requested
$pattern = '/^[A-Za-z]*$/';
$controller = JRequest::getVar("controller", "");
if(trim($controller) != ""){
	$path = JPATH_COMPONENT.DS.'controllers'.DS.$controller.'.php';	
	if (file_exists($path)) {
		require_once $path;
	}
	else{
		$controller = '';
	}
}
else{
	$controller = "arra_eximp_cron";
}

// Create the controller
$classname	= 'ArrausermigrateController'.$controller;
$controller	= new $classname();
$controller->execute(JRequest::getVar('task', ""));
$controller->redirect();

?>
