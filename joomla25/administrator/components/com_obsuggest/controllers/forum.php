<?php
/**
 * @version		$Id: forum.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");



class ControllerForum extends JController {
	function __construct() {
		parent::__construct();
	}
	
	function display() {
		$model = &$this->getModel('forum');
		$view = &$this->getView('forum');
		
		$view->setModel($model,true);
		$view->display();
	}
	public function edit() {
		//$cid = JRequest::getVar( 'id', array(0), '', 'array' );
		///$forum_id = intval($cid[0]);
		
		//echo "id :".$cid;
		//echo "thanhtd 123456";
		$input = $this->getInputForDeleteListForum($_POST);
		
		$forum_id = JRequest::getVar('id');
		if ($forum_id == NULL) $forum_id = $input[0];
		//echo "id :".$forum_id;
		
		$model = &$this->getModel('forum');
		$model->setForumId($forum_id);
		$model->edit();
		
		$view = &$this->getView('forum');		
		$view->setModel($model,true);
		$view->edit();
	}
	public function update() {
		$input = new stdClass();
		$forum_id = JRequest::getVar('id');
		$forum = Handy::getInput($_POST,'forum_');
		
		$input->forum = $forum;
		
		$model = $this->getModel('forum');
		$model->setForumId($forum_id);
		$model->update($input->forum);	

		if (isset($_POST['status_id'])) {	
			$model->updateTabs($_POST['status_id']);
//			echo '<pre>'.print_r( $_POST['status_id'], true ).'</pre>';
//			echo '<pre>'.print_r( $forum, true ).'</pre>';exit();
		} else {
			$model->updateTabs();
		}
		$this->display();
	}
	
	public function delete() {
		$forum_id = JRequest::getVar('id');
		$model = $this->getModel('forum');		
		$model->setForumId($forum_id);
		$model->delete();
		
		$this->display();
	}
	
	public function remove() {
		$input = $this->getInputForDeleteListForum($_POST);
		$model = $this->getModel('forum');				
		foreach ($input as $value) {
			$model->setForumId($value);
			$model->delete();
		}
		$this->display();
	}
	
	public function view() {
		$forum_id = JRequest::getVar('id');		
		$model = $this->getModel('forum');
		$model->setForumId($forum_id);
		$model->view();
		
		$view = $this->getView('forum');
		$view->setModel($model,true);
		$view->view();
	}
	public function editTab() {
		global $mainframe;
		$forum_id = JRequest::getVar('id');
		$status_id = JRequest::getVar('status_id');
		$value = JRequest::getVar('value');
		$input['status_id'] = $status_id;
		$input['value'] = $value;
		
		$model = $this->getModel('forum');
		$model->setForumId($forum_id);
		$model->updateTab($input);
				
		header( 'Location: ' . JURI::base()."index.php?option=com_foobla_suggestion&controller=forum&task=edit&id=$forum_id");		
	}
	public function add() {
		$model = $this->getModel('forum');
		$model->add();
		$view = $this->getView('forum');
		$view->setModel($model,true);
		$view->add();
	}
	public function addForum() {
		$input = Handy::getInput($_POST,'forum_');
		$model = $this->getModel('forum');
		$new_forum_id = $model->addForum($input);
		
		$view = $this->getView('forum');
		$view->setModel($model,true);
		
		$model->setForumId($new_forum_id);
		
		if (isset($_POST['status_id'])) {	
			$model->updateTabs($_POST['status_id']);
		
		} else {
			$model->updateTabs();
		}
		$this->display();
	}
	public function setDefault() {
		$input = Handy::getInput($_POST,'cb_forum_id_');
		$model = $this->getModel('forum');
		$model->setDefault($input);
		
		$view = $this->getView('forum');
		$view->setModel($model,true);
		$this->display();
	}
	public function published() {
		$input = Handy::getInput($_POST,'cb_forum_id_');
		$model = $this->getModel('forum');
		$model->setPublished($input);
		
		$view = $this->getView('forum');
		$view->setModel($model,true);
		$this->display();
	}
	public function unpublished() {
		$input = Handy::getInput($_POST,'cb_forum_id_');
		$model = $this->getModel('forum');
		$model->setUnPublished($input);
		
		$view = $this->getView('forum');
		$view->setModel($model,true);
		$this->display();
	}
	public function import() {
		$forum_id = JRequest::getVar('id');		
		
		$section_id = JRequest::getVar('section_id');
		$cat_id = JRequest::getVar('cat_id');
		$input['section_id'] = $section_id;
		$input['cat_id'] = $cat_id;
		
		$model = $this->getModel('forum');		
		$model->setForumId($forum_id);
		
		$model->importAddJoomlaCore($input);
		$model->importAddExportFile();
		$model->importAddImportFile();
		
		$view = $this->getView('forum');
		$view->setModel($model,true);
		$view->import();
	}
	
	public function importJoomlaCore() {
		$forum_id = JRequest::getVar('id');
		$section_id = JRequest::getVar('section_id');
		$cat_id = JRequest::getVar('cat_id','');
		
		$input['section_id'] = $section_id;		
		$input['cat_id'] = $cat_id;
		$input['forum_id'] = $forum_id;
				
		$model = $this->getModel('forum');
		$model->setForumId($forum_id);
		$model->importJoomlaCore($input);
		
		
		$view = $this->getView('forum');
		$view->setModel($model,true);
		$this->display();
	}
	public function importExport() {
		$forum_id = JRequest::getVar('id');
				
		$input['forum_id'] = $forum_id;
		$input['file_name'] = JRequest::getVar('file_name');
		$input['file_path'] = JPATH_COMPONENT.DS."data".DS."export".DS.$input['file_name'];
				
		$model = $this->getModel('forum');
		$model->setForumId($forum_id);
		$model->importExport($input);		
		
		$view = $this->getView('forum');
		$view->setModel($model,true);
		$this->display();
	}
	public function importImport() {
		$forum_id = JRequest::getVar('id');
				
		$input['forum_id'] = $forum_id;
		$input['file_name'] = JRequest::getVar('file_name');
		$input['file_path'] = JPATH_COMPONENT.DS."data".DS."import".DS.$input['file_name'];
				
		$model = $this->getModel('forum');
		$model->setForumId($forum_id);
		$model->importImport($input);		
		
		$view = $this->getView('forum');
		$view->setModel($model,true);
		$this->display();
	}
	
	private function getInputForDeleteListForum($_post) {
		$input = null;
		foreach($_post as $key => $value) {
			if (strpos($key,'cb_forum_id_') !== false) {
				$val = substr($key,12);
				$val = $val*1;
				$input[] = $val;
			}
		}
		return $input;
	}
} 
?>
