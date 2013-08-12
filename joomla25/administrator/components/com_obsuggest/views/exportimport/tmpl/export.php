<?php
/**
 * @version		$Id: export.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

$task = JRequest::getVar('task');
switch ($task) {	
	case 'newExport':
		echo $this->loadTemplate('add');
		break;		
	case 'editExport':
		echo $this->loadTemplate('edit');
		break;
	case 'addExport':
		echo $this->loadTemplate('edit');
		break;
} 
?>
