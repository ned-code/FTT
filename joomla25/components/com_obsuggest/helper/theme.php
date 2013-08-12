<?php
/**
 * @version		$Id: theme.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

final class Theme {
	function __construct() { 		
	}
	
	public static function dispSubMenu() {
		JToolBarHelper::title('Foobla User Voice');
		$default = 'index.php?option=com_foobla_uservoice&controller=default';						
		$idea = 'index.php?option=com_foobla_uservoice&controller=idea';		
		$permission = 'index.php?option=com_foobla_uservoice&controller=permission';
		JSubMenuHelper::addEntry(JText::_('Control Panel'), $default);		
		JSubMenuHelper::addEntry(JText::_('Manage Ideas'), $idea);				
		JSubMenuHelper::addEntry(JText::_('Permission'), $permission);
	}
}
?>
