<?php
/**
 * @version		$Id: view.php 328 2011-05-25 02:50:56Z thongta $
 * @package		oblangs - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.view');
require_once(JPATH_COMPONENT.DS."helpers".DS."theme.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.output.php");


class ViewDefault extends JView {
	function __construct() {
		parent::__construct();
		Theme::dispSubMenu();
	}
	
	function display($tmp = null) {						
		parent::display($tmp);
	}	
}
?>
