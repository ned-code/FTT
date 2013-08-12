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
jimport('joomla.html.pagination');
require_once(JPATH_COMPONENT.DS."helpers".DS."theme.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."exportimport.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.output.php");

class ViewExportImport extends JView {
	function __construct() {
		parent::__construct();
		Theme::dispSubMenu();
	}
	
	function display($tmp = null) {
		$output = $this->get('Output');
				
		$this->assignRef('output', $output);
		parent::display($tmp);
	}	
	public function newExport($tmp = null) {
		$output = $this->get('Output');
				
		$this->assignRef('output', $output);
		parent::display($tmp);
	}
	public function addExport($tmp = null) {
		$output = $this->get('Output');
				
		$this->assignRef('output', $output);
		parent::display($tmp);
	}
	public function editExport($tmp = null) {
		$output = $this->get('Output');
		
		$this->assignRef('output', $output);
		parent::display($tmp);
	}
	
	public function editImport($tmp = null) {
		$output = $this->get('Output');
				
		$this->assignRef('output', $output);
		parent::display($tmp);
	}
	public function newImport($tmp = null) {
		$output = $this->get('Output');
				
		$this->assignRef('output', $output);
		parent::display($tmp);
	}
	public function showUserVoiceIdea($tmp = null) {
		$output = $this->get('Output');
		
		$this->assignRef('output', $output);
		parent::display($tmp);
	}
}
?>
