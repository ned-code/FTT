<?php
/**
 * @version		$Id: default.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

$task = JRequest::getVar('task');
switch ($task) {
	case 'import':
		echo $this->loadTemplate('forum_import');
		break;
	case 'add':
		echo $this->loadTemplate('forum_add');
		break;	
	case 'edit':
		echo $this->loadTemplate('forum_edit');
		break;	
	case 'view':
		echo $this->loadTemplate('forum_view');
		break;	
	default:
		echo $this->loadTemplate('forum');
		break;
} 
?>
