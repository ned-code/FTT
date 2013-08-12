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

JHTML::_('behavior.mootools');
JHTML::_('behavior.tooltip');
global $mainframe;
$task = JRequest::getVar('task','default');
switch ($task) {
	case 'addNew':
		echo $this->loadTemplate('vote_add');
		break;
	case 'edit':
		echo $this->loadTemplate('vote_edit');
		break;
	case 'view':
		echo $this->loadTemplate('vote_view');
		break;
	default: 
		echo $this->loadTemplate('vote');
		break;
}
?>

