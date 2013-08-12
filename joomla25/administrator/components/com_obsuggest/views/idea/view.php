<?php
/**
 * @version		$Id: view.php 87 2011-02-28 11:00:04Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
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
require_once(JPATH_COMPONENT.DS."helpers".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."forum.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.uservoice.php");

class ViewIdea extends JView {
	function __construct() {
		parent::__construct();
		Theme::dispSubMenu();
	}
	
	function display($tpl = null) {
		$ideas = $this->get('IdeaLimit'); # return limit and limitstart
		$status = $this->get('AllStatus');
		$output = $this->get('Output');
		$pagination = $this->get('Pagination');
		//var_dump($output);
		
		$this->assignRef('ideas', $ideas);
		$this->assignRef('status', $status);
		$this->assignRef('output', $output);
		$this->assignRef('pagination', $pagination);
		
		$forums = $this->get('AllForum');
		//echo "<h1>i'm here</h1>";
		
		$this->assignRef('forums', $forums);
		parent::display($tpl);
	}
	//-----thanhtd
	public function view() {
		
		$output = $this->get('Output');
		#$pagination = $this->get('Pagination');
		 $ret = $this->get('CPagination');
		 $pagination = $ret['pag'];
		$output->comments = $ret['coms'];
		$this->assignRef('pagination', $pagination);
		$this->assignRef('output', $output);
		parent::display();
	}

	public function edit() {
		$output = $this->get('Output');
		$this->assignRef('output', $output);
		parent::display();
	}
	public function add() {
		$output = $this->get('Output');
		
		$this->assignRef('output', $output);
		parent::display();
	}
	
	function editStatus($tpl = null) {
		$ideas = $this->get('AllIdea');
		$status = $this->get('AllStatus');
		$ParentStatus = $this->get('ParentStatus');
		
		
		$this->assignRef('ideas', $ideas);
		$this->assignRef('status', $status);
		$this->assignRef('ParentStatus', $ParentStatus);
		parent::display($tpl);
	}	
	function newStatus($tpl = null) {
		$ideas = $this->get('AllIdea');
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
