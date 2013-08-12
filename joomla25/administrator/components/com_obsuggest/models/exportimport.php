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

jimport('joomla.application.component.model');
jimport('joomla.filesystem.file');
jimport('joomla.filesystem.folder');
require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."forum.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."exportimport.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.uservoice.php");

class ModelExportImport extends JModel {
	public $output = null; 	
	function __construct() {
		parent::__construct();
	}
	
	public  function display() {		
		ExportImport::$pathToFile = JPATH_COMPONENT.DS."data".DS."export";
		$this->output->file_export = ExportImport::getFile();		
		ExportImport::$pathToFile = JPATH_COMPONENT.DS."data".DS."import";
		$this->output->file_import = ExportImport::getFile();		
	}
	
	public function getOutput() {
		return $this->output;
	}
	
	public function deleteExport($_filename) {		
		JFile::delete(JPATH_COMPONENT.DS."data".DS."export".DS.$_filename);
	}
	
	public function newExport() {
		$this->output = new stdClass();
		$this->output->forums =  Forum::getAllForum();		
	}
	
	public function addExport($_forum_id = null) {
		$this->output = new stdClass();
		$this->output->idea = ExportImport::getAllIdeaByForumId($_forum_id);
		$this->output->name = "";
		$this->output->file_name = "";
		$this->output->description = "";
	}
	public function editExport($_filename) {
		$this->output = ExportImport::getContentFile($_filename);		
	}
	
	public function createFileExport($_input) {
		ExportImport::createFileExport($_input);		
	}
	
	
	//Import Method follow here.
	public function newImport() {
		$this->output = new stdClass();		
		$this->output->account = ExportImport::getAllAccountUserVoice();	
		$this->output->forums =  ExportImport::getAllForumsUserVoice($this->output->account);
	}
	public function editImport($_filename){
		$this->output = ExportImport::getContentFile($_filename, JPATH_COMPONENT.DS."data".DS."import".DS.$_filename);
	}
	public function deleteImport($_filename) {		
		JFile::delete(JPATH_COMPONENT.DS."data".DS."import".DS.$_filename);
	}
	public function addImportFile() {
		$userfile = JRequest::getVar('file_import', null, 'files', 'array' );		
		$tmp_dest 	= JPATH_COMPONENT.DS."data".DS."import".DS.$userfile['name'];
		$tmp_src	= $userfile['tmp_name'];
						
		// Move uploaded file
		jimport('joomla.filesystem.file');
		$error = null;
		$config 	=& JFactory::getConfig();		
		$error = ExportImport::getContentFile($userfile['tmp_name'],$userfile['tmp_name']);
		if ($error != null) {
			$uploaded 	= JFile::upload($tmp_src, $tmp_dest);
		}		
	}
	
	public function addUserVoiceSubdomain($_input) {
		
		$subdomain = $_input->account->subdomain;
		$pass = $_input->account->pass;
		$pos = strpos($subdomain, ".");
		if($pos > 0)
		{
			$_input->account->subdomain = substr($subdomain, 0, $pos);
		}
		$_input->account->password = $pass;
		
		$uservoice = new UserVoice($_input->account->subdomain, $pass);
		
		$topic = $uservoice->getTopics();
		
		
			
		$uv = new stdClass();
		$uv->topics = $topic;
		$uv->subdomain = $_input->account->subdomain;
		$uv->password = $pass;
		$uservoice->getIdea($uv);
		//print_r($topic);die();
		
		if ($topic != NULL) {			
			ExportImport::addUserVoiceAccount($_input);
		}
		
	}
	
	public function showUserVoiceIdea($_input) {
		$uservoice = new UserVoice($_input->subdomain);
		
		$ideas = null;
		if($_input->uservoice)
		foreach ($_input->uservoice as $uv) {			
			$ideas[] = $uservoice->getAllIdeaByForumId($uv);
		}		
		$this->output->uservoice = $ideas; 
	}
	public function addImportUserVoice($_input) {
		$temp = null;
		$uservoice = new UserVoice();
		foreach ($_input->uservoice as $uv) {
			$temp[] = $uservoice->getIdeaById($uv);						
		}	

		$_input->uv_idea = $temp;
		ExportImport::createFileImportUserVoice($_input);
	}
	public function deleteAccountUserVoice($_input) {
		foreach ($_input as $id) {
			ExportImport::deleteAccount($id);
			
		}
	}
	public function publish($ispublish = true) {
		$id = JRequest::getVar('cid', 0, 'default', 'string');
		echo $id;
		exit();
		$ispublish == true ?	ExportImport::setPublishedAccount($id) : ExportImport::setUnpublishedAccount($id);
	}
}
?>
