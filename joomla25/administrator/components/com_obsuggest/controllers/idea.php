<?php
/**
 * @version		$Id: idea.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');
require_once(JPATH_COMPONENT.DS."classes".DS."class.input.php");

class ControllerIdea extends JController {

	function __construct() {
		parent::__construct();
	}

	function display() {
		$forum_id = JRequest::getVar('filter_forum_id');
		$filter_key = JRequest::getVar('filter_key');
		
		$model = &$this->getModel('idea');
		
		$model->setForumId($forum_id);
		$model->setFilterKey($filter_key);
		$view = &$this->getView('idea');
		
		
		$view->setModel($model,true);
		$view->display();
	}

	public function delete() {
		$idea_id = JRequest::getVar('id');
		$input['id'] = $idea_id;
		
		$model = $this->getModel('idea');
		$model->deleteIdea($input);
		$this->display();
	}

	public function edit() {
		$idea_id 		= JRequest::getVar('id');
		$idea_id_temp 	= $this->getInputForDeleteListIdea($_POST);		
		if ( ( $idea_id == NULL ) && ( $idea_id_temp != NULL ) ) {
				$idea_id = $idea_id_temp[0];
		}
		$model = $this->getModel( 'idea' );
		$model->setIdeaId( $idea_id );
		$forum_id = &JRequest::getVar( 'forum_id' );
		$model->setForumId( $forum_id );
		$view = $this->getView( 'idea' );
		$view->setModel( $model, true );
		$view->edit();
	}
	public function view() {
		$idea_id 	= JRequest::getVar('id');
		$forum_id 	= JRequest::getVar('forum_id');

		$input['id'] = $idea_id;
		$model = $this->getModel('idea');
		$model->setIdeaId($idea_id);
		$model->setForumId($forum_id);

		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->view();
	}
	public function add() {
		$model = $this->getModel('idea');
		
		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->add();
	}
	public function addIdea() {
		$temp = new Input();
		$temp->createInput($_POST);
		$input = $temp->getInput();
						
		
		$model = $this->getModel('idea');		
		$model->addIdea($input);
		
		$this->display();
	}
	public function update() {
		$temp = new Input();
		$temp->createInput($_POST);
		$input = $temp->getInput();
		
		$model = $this->getModel('idea');
		$model->setIdeaId($input->idea->id);
		$model->update($input);
		
		$this->display();
	}
	public function published() {
		$input = $this->getInputForDeleteListIdea($_POST);
				
		$model = $this->getModel('idea');
		$model->setPublished($input);
		$this->display();
	}
	public function unPublished() {
		$input = $this->getInputForDeleteListIdea($_POST);
				
		$model = $this->getModel('idea');
		$model->setUnpublished($input);
		$this->display();
	}
	public function deleteListIdea() {		
		$input = $this->getInputForDeleteListIdea($_POST);
		$model = $this->getModel('idea');
		$model->deleteListIdea($input);
		$this->display();
	}
	public function editStatus() {
		$status_id = JRequest::getVar('status_id');
		$input['id'] = $status_id;
		
		$model = $this->getModel('idea');
		$model->editStatus($input);
		$view = $this->getView('idea');
		
		$view->setModel($model,true);
		$view->editStatus();
	}
	public function newStatus() {
		$model = $this->getModel('idea');
		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->newStatus();
	}
	public function updateStatus() {
		$status_id = JRequest::getVar('status_id');
		$parent_id = JRequest::getVar('parent_id');
		$status_title = JRequest::getVar('status_title');
		
		$input['id'] = $status_id;
		$input['title'] = $status_title;
		$input['parent_id'] = $parent_id;
		
		$model = $this->getModel('idea');
		$model->updateStatus($input);
		$view = $this->getView('idea');
		
		$view->setModel($model,true);
		$view->display();
	}
	public function addStatus() {		
		$parent_id = JRequest::getVar('parent_id');
		$status_title = JRequest::getVar('status_title');
				
		$input['title'] = $status_title;
		$input['parent_id'] = $parent_id;
		
		$model = $this->getModel('idea');
		$model->addStatus($input);
		$view = $this->getView('idea');
		
		$view->setModel($model,true);
		$view->display();
	}
	public function deleteStatus() {
		$status_id = JRequest::getVar('status_id');
		$input['id'] = $status_id;
		
		$model = $this->getModel('idea');
		$model->deleteStatus($input);
		$view = $this->getView('idea');
		
		$view->setModel($model,true);
		$view->display();
	}
	
	private function getInputForDeleteListIdea($_post) {
		$input = null;
		foreach($_post as $key => $value) {
			if (strpos($key,'cb_idea_id_') !== false) {
				$val = substr($key,11);
				$val = $val*1;
				$input[] = $val;
			}
		}
		return $input;
	}
}
?>
