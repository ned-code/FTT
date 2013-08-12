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
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");

class ViewVote extends JView {
	function __construct() {
		parent::__construct();
		Theme::dispSubMenu();
	}
	
	function display($tpl = null) {
		$model = &$this->getModel('vote');
		$filter_state = &JRequest::getVar('filter_state');
		$model->setFilterState($filter_state);
		$listVotes = $model->getListVotes();
		$lists['state']	= JHTML::_('grid.state',  $filter_state);
		
		$this->assignRef('listVotes', $listVotes);
		$this->assignRef('lists', $lists);
		parent::display($tpl);
	}	
	public function view() {
		$output = $this->get('Output');
		$this->assignRef('output', $output);
		parent::display();
	}
	public function edit() {
		$model  = &$this->getModel('vote');
		$output = $model->editVotes();
		$this->assignRef('output', $output);
		parent::display();
	}
	public function add() {
		$output = $this->get('Output');
		
		$this->assignRef('output', $output);
		parent::display();
	}
	
	function editStatus($tpl = null) {
		$ideas = $this->get('AllVote');
		$status = $this->get('AllStatus');
		$ParentStatus = $this->get('ParentStatus');
		
		
		$this->assignRef('ideas', $ideas);
		$this->assignRef('status', $status);
		$this->assignRef('ParentStatus', $ParentStatus);
		parent::display($tpl);
	}	
	function newStatus($tpl = null) {
		$ideas = $this->get('AllVote');
		$status = $this->get('AllStatus');
		$ParentStatus = $this->get('ParentStatus');
		
		
		$this->assignRef('ideas', $ideas);
		$this->assignRef('status', $status);
		$this->assignRef('ParentStatus', $ParentStatus);
		parent::display($tpl);
	}
	
	function getStatusById($_id = 0) {
		if ($_id == 0) return JText::_("Not Status");
		$rs = Handy::getStatusById($_id);
		return $rs->title;
	}
	function getUser($_id = 0) {
		if ($_id == 0) return JText::_("anonymous");
		$rs = Handy::getUserById($_id);
		return $rs->username;
	}
	function countComment($_idea_id) {
		$model = $this->getModel('idea');
		return $model->countCommentById($_idea_id);
	}
}
?>
