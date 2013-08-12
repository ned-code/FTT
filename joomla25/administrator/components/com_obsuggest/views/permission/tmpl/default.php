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

?>
<?php
	$task = &JRequest::getVar('task','default');
	switch ($task) {
		case 'edit':
			echo $this->loadTemplate('edit') ;
			break;
		default:
			echo $this->loadTemplate('group') ;
			break;	 
	}	
?>
