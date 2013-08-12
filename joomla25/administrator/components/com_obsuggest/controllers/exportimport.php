<?php
/**
 * @version		$Id: exportimport.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');

require_once(JPATH_COMPONENT.DS."classes".DS."class.input.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.download.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.uservoice.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."exportimport.php");
class ControllerExportImport extends JController {
	function __construct() {
		parent::__construct();
	}
	function publish()
	{
		global $mainframe;
		
		$id = JRequest::getVar('cid');
		
		ExportImport::setPublishedAccount($id[0]);		
		
		header( 'Location: ' . JURI::base()."index.php?option=com_obsuggest&controller=exportimport&task=newImport");
	}
	function unpublish()
	{
		global $mainframe;
		
		$id = JRequest::getVar('cid');
		
		ExportImport::setUnpublishedAccount($id[0]);		
		
		header( 'Location: ' . JURI::base()."index.php?option=com_obsuggest&controller=exportimport&task=newImport");
	}
	function display() {
		$model = &$this->getModel('exportimport');
		$model->display();
		
		$view = &$this->getView('exportimport');		
		$view->setModel($model,true);
		$view->display();
	}
	
	function deleteExport() {
		$filename= JRequest::getVar('filename');
		
		$model = $this->getModel('exportimport');
		$model->deleteExport($filename);
		
		$this->display();
	}
	public function newExport() {
		
		$model = &$this->getModel('exportimport');
		$model->newExport();
		
		$view = &$this->getView('exportimport');		
		$view->setModel($model,true);
		$view->setLayout('export');
		$view->newExport();
	}
	public function addExport() {
		$forum_id = JRequest::getVar('cb_forum_id');			
		$model = $this->getModel('exportimport');
		$model->addExport($forum_id);
		
		$view = &$this->getView('exportimport');		
		$view->setModel($model,true);
		$view->setLayout('export');
		$view->addExport();
	}
	public function createFileExport() {
		$input = new Input();
		$input->createInput($_POST);
		
		$input = $input->getInput();
		
		$model = $this->getModel('exportimport');
		$model->createFileExport($input);
		
		$this->display();
	}
	function editExport() {
		$filename= JRequest::getVar('filename');
		$model = $this->getModel('exportimport');
		$model->editExport($filename);
		
		$view = &$this->getView('exportimport');		
		$view->setModel($model,true);
		$view->setLayout('export');
		$view->editExport();
	}
	
	//Import method follow here.
	function newImport() {		
		$model = &$this->getModel('exportimport');
		$model->newImport();
		
		$view = &$this->getView('exportimport');		
		$view->setModel($model,true);
		$view->setLayout('import');
		$view->newImport();
	}
	public function deleteAccount() {
		
		global $mainframe;
		$input = $_POST['cid'];
		
		$view = &$this->getView('exportimport');	
		
		$model = &$this->getModel('exportimport');
		$model->newImport();
		$view->setModel($model,true);
		$model->deleteAccountUserVoice($input);

		header( 'Location: ' . JURI::base()."index.php?option=com_obsuggest&controller=exportimport&task=newImport");
	
	}
	function addImportFile() {
		$model = &$this->getModel('exportimport');
		$model->addImportFile();
		
		$this->display();
	}
	function addImportUserVoice() {
		$post = $_POST;
		
		$input = new Input();
		$input->createInput($_POST);		
		$input = $input->getInput();
		
		$rs = null;
		
		foreach ($post['idea'] as $value) {
			$i=1;
			$arr = str_split($value);
			$val = "";
			$temp = new stdClass();
			for($j=0; $j<strlen($value); $j++) {
				if ($arr[$j] == "_") {
					switch ($i) {
						case 1: $temp->subdomain = $val; break;
						case 2: $temp->forum_id = $val; break;
						case 3: $temp->idea_id = $val; break;
					}
					$i++;
					$val="";
				} else {
					$val .= $arr[$j];
				}
			}
			$temp->idea_id = $val;
			$rs[] = $temp;
		}
		
		$input->uservoice = $rs;
		
		$model = $this->getModel('exportimport');
		$model->addImportUserVoice($input);
		
		$this->display();
	}
	function editImport() {
		$filename= JRequest::getVar('filename');
		$model = $this->getModel('exportimport');
		$model->editImport($filename);
		
		$view = &$this->getView('exportimport');		
		$view->setModel($model,true);
		$view->setLayout('import');
		$view->editImport();
	}
	function deleteImport() {
		$filename= JRequest::getVar('filename');
		
		$model = $this->getModel('exportimport');
		$model->deleteImport($filename);
		
		$this->display();
	}
	function download() {
		$file_name = JRequest::getVar('filename');
		$dir = JRequest::getVar('dir');
		$dFile = new Download(JPATH_COMPONENT.DS."data".DS.$dir , $file_name);
		$this->display();
	}
	function addUserVoiceSubdomain() {
		
		global $mainframe;
		$input = $this->getInput();
		
		$model = $this->getModel('exportimport');
		$model->addUserVoiceSubdomain($input);
		
		//var_dump($mainframe);
		header( 'Location: ' . JURI::base()."index.php?option=com_obsuggest&controller=exportimport&task=newImport");
		//$this->newImport();
		
	}
	
	function getInput() {
		$input = new Input();
		$input->createInput($_POST);
		
		$input = $input->getInput();
		return $input;
	}
	function showUserVoiceIdea() {				
		$subdomain = JRequest::getVar('account_subdomain');
		$topic_id = JRequest::getVar('topic_id');
		
		$input = new stdClass();
		$input->subdomain = $subdomain;
		$input->forum_id = $topic_id;
	
				
		$uservoice = null;
		if (isset($_POST['account_topic'])) {
			foreach ($_POST['account_topic'] as $key) {
				$div = strpos($key,'_');	
				$subdomain = substr($key,0,$div);
		 		$topic_id = substr($key,$div+2);
		 		
		 		$temp = new stdClass();
		 		$temp->subdomain = $subdomain;
		 		$temp->forum_id = $topic_id;
		 		
		 		$uservoice[] = $temp;
			}
			$input->uservoice = $uservoice;
		}
		$model = $this->getModel('exportimport');
		$model->showUserVoiceIdea($input);
		
		
		
		$view = $this->getView('exportimport');
		$view->setModel($model, true);	
		$view->setLayout('import');	
		$view->showUserVoiceIdea();
	}
	/*
	function addUserVoiceSubdomain() {
		$input = $this->getInput();
		
		$model = $this->getModel('config');
		$model->addUserVoiceSubdomain($input);

		$this->display();
	}*/
}
?>

