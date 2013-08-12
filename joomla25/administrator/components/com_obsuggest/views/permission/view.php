<?php
/**
 * @version		$Id: view.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.view');
jimport('joomla.html.pane');
jimport('joomla.html.html');
require_once(JPATH_COMPONENT.DS."helpers".DS."theme.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");

class ViewPermission extends JView {
	function __construct() {
		parent::__construct();
		Theme::dispSubMenu();
	}
	
	function display($tpl = null) {		
		$groups = $this->get('Groups');;		
		$this->assignRef('groups',$groups);
		parent::display($tpl);
	}	
	function editPermission($tmp = null) {
		$permission = $this->get('PermissionById');
		
		$this->assignRef('permission',$permission);
		parent::display($tmp);
	}
}
?>
