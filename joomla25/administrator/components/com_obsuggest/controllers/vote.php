<?php
/**
 * @version		$Id: vote.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');
require_once(JPATH_COMPONENT.DS."classes".DS."class.input.php");

class ControllerVote extends JController {
	function __construct() {
		parent::__construct();
	}
	
	function display() {
		$view = &$this->getView('vote');
		$model= &$this->getModel('vote');
		$view = $this->getView('vote');
		$view->setModel($model,true);
		$view->display();
	}
	public function delete() {
		$idea_id = JRequest::getVar('id');
		$input['id'] = $idea_id;
		
		$model = $this->getModel('idea');
		$model->deletevote($input);
		$this->display();
	}
	public function edit() {
		$vote_id = JRequest::getVar('id');
		$model = $this->getModel('vote');
		$model->setConfigId($vote_id);
		
		$view = $this->getView('vote');
		$view->setModel($model, true);
		$view->edit();
	}
	public function view() {
		$idea_id = JRequest::getVar('id');
		$input['id'] = $idea_id;
		
		$model = $this->getModel('idea');
		$model->setConfigId($idea_id);
		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->view();
	}
	public function save() {
		$input = &JRequest::get('post');
		$model = $this->getModel('vote');
		$model->save($input);
		$view = $this->getView('vote');
		$view->setModel($model,true);
		$this->display();
	}
	public function addConfig() {
		$temp = new Input();
		$temp->createInput($_POST);
		$input = $temp->getInput();
						
		$model = $this->getModel('idea');		
		$model->addConfig($input);
		
		$this->display();
	}
	public function update() {
		$temp = new Input();
		$temp->createInput($_POST);
		$input = $temp->getInput();
		
		$model = $this->getModel('idea');
		$model->setConfigId($input->idea->id);
		$model->update($input);
		
		$this->display();
	}
	public function published() {
		global $mainframe;
			$cid 	= JRequest::getVar('cid', array(), '', 'array');		
			JArrayHelper::toInteger($cid);
			JRequest::checkToken() or jexit( 'Invalid Token' );
			$db 	= &JFactory::getDBO();
			if (count( $cid ) < 1) {
				$action = $state ? 'publish' : 'unpublish';
				JError::raiseError(500, JText::_( 'Select an item to' .$action, true ) );
			}
			$cids = implode( ',', $cid );
		
			$query = 'UPDATE `#__foobla_uv_votes_value`'
			. ' SET `published` = 1'
			. ' WHERE `id` IN ( '. $cids .' )';
			$db->setQuery( $query );
			$db->query();
		
			$mainframe->redirect( 'index.php?option=com_obsuggest&controller=vote','Published:'.count($cid) );
	}
	public function unPublished() {
		global $mainframe;
			$cid 	= JRequest::getVar('cid', array(), '', 'array');		
			JArrayHelper::toInteger($cid);
			JRequest::checkToken() or jexit( 'Invalid Token' );
			$db 	= &JFactory::getDBO();
			if (count( $cid ) < 1) {
				$action = $state ? 'publish' : 'unpublish';
				JError::raiseError(500, JText::_( 'Select an item to' .$action, true ) );
			}
			$cids = implode( ',', $cid );
		
			$query = 'UPDATE `#__foobla_uv_votes_value`'
			. ' SET `published` = 0	'
			. ' WHERE `id` IN ( '. $cids .' )';
			$db->setQuery( $query );
			$db->query();
		
			$mainframe->redirect( 'index.php?option=com_obsuggest&controller=vote','Published:'.count($cid) );
	}
	public function remove(){
		global $mainframe;
			$cid 	= JRequest::getVar('cid', array(), '', 'array');		
			JArrayHelper::toInteger($cid);
			JRequest::checkToken() or jexit( 'Invalid Token' );
			$db 	= &JFactory::getDBO();
			$cids = implode( ',', $cid );
		
			$query = 'DELETE FROM `#__foobla_uv_votes_value`'
			. ' WHERE `id` IN ( '. $cids .' )';
			$db->setQuery( $query );
			$db->query();
			$mainframe->redirect( 'index.php?option=com_obsuggest&controller=vote','Delete:'.count($cid) );
	}
	public function deleteListConfig() {		
		$input = $this->getInputForDeleteListConfig($_POST);
		$model = $this->getModel('idea');
		$model->deleteListConfig($input);
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
}
?>
