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
jimport('joomla.html.pane');
jimport('joomla.html.html');
jimport('joomla.html.pagination');

require_once(JPATH_COMPONENT.DS."helpers".DS."theme.php");

class ViewConfig extends JView {
	function __construct() {
		parent::__construct();
		Theme::dispSubMenu();
	}

	function display($tmp = null) {

		$output 		= $this->get( 'Output' );
		$listDatetime 	= $this->getModel('config')->getDatetimeList();
		$gconfig 		= $this->get( 'GConfig' );

		$this->assignRef( 'gconfig', $gconfig );
		$this->assignRef( 'output', $output );
		$this->assignRef( 'listDatetime', $listDatetime );
		parent::display( $tmp );
	}

	function displayDatetimeList(){
		$this->display("datetime_list");
	}

}
?>
