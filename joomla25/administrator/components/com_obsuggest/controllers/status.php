<?php
/**
 * @version		$Id: status.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');

class ControllerStatus extends JController {
	function __construct() {
		parent::__construct();
	}
	
	function display() {
		$model = &$this->getModel('status');
		$view = &$this->getView('idea');
		
		$view->setModel($model,true);
		$view->display();
	}
}
?>
