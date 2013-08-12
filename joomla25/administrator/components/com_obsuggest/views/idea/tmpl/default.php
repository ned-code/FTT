<?php
/**
 * @version		$Id: default.php 87 2011-02-28 11:00:04Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @license		GNU/GPL, see LICENSE
 */

 // no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

JHTML::_( 'behavior.mootools' );
JHTML::_( 'behavior.tooltip' );

$mainframe 	= &JFactory::getApplication();
$task		= JRequest::getVar( 'task', 'default' );

switch ($task) {

	case 'add':
		echo $this->loadTemplate('idea_add');
		break;

	case 'edit':
		echo $this->loadTemplate('idea_edit');
		break;

	case 'view':
		echo $this->loadTemplate('idea_view');
		break;

	default:
		echo $this->loadTemplate('ideas');
		break;

}
?>

