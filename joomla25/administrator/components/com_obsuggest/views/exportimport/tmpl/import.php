<?php
/**
 * @version		$Id: import.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

$task = JRequest::getVar('task');
switch ($task) {	
	case 'addUserVoiceSubdomain':
	case 'newImport':
		echo $this->loadTemplate('add');
		break;	
	case 'showUserVoiceIdea':
		echo $this->loadTemplate('add_uservoice_idea');
		break;
	case 'editImport':
		echo $this->loadTemplate('edit');
		break;
	case 'addImport':
		echo $this->loadTemplate('edit');
		break;
} 
?>
