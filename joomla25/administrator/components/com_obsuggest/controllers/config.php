<?php
/**
 * @version		$Id: config.php 343 2011-06-09 08:41:07Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');
require_once(JPATH_COMPONENT.DS."classes".DS."class.input.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."exportimport.php");

class ControllerConfig extends JController {
	private $output = null;	
	function __construct() {
		parent::__construct();
		$this->registerTask('apply','save');
	}
	
	function display() {
		$model = &$this->getModel('config');
		$model->display();
		$view = &$this->getView('config');		
		$view->setModel($model,true);
		$view->display();
	}
	
	public function save() {
		global $mainframe, $option;
		$input = new Input();
		$input->createInput($_POST);
		$input = $input->getInput();
		 
		$model = &$this->getModel('config');
		$model->save($input);
		$task = &JRequest::getVar('task');
		$message = ( $task == 'apply' || $task == 'save' ) ? JText::_('OBSG_CONFIG_DATA_SAVED') : '';
//		$mainframe = new JApplication();
		if($message)
			$mainframe->enqueueMessage($message);
		if($task != 'apply'){
			$mainframe->redirect ( 'index.php?option=' . $option . '&controller=default' );
		}
		$this->display();
	}
	public function unpublish() {
		$input = $_POST['cid'];
		
		$model = &$this->getModel('config');
		$model->unpublish($input);
		
		$this->display();
	}
	public function publish() {
		$input = $_POST['cid'];
		
		$model = &$this->getModel('config');
		$model->publish($input);
		
		$this->display();
	}
	public function deleteAccount() {
		$input = $_POST['cid'];
		
		$model = &$this->getModel('config');
		$model->deleteAccountUserVoice($input);
		
		$this->display();
	}
	function addUserVoiceSubdomain() {
		$input = $this->getInput();
		
		$model = $this->getModel('config');
		$model->addUserVoiceSubdomain($input);

		$this->display();
	}
	function getInput() {
		$input = new Input();
		$input->createInput($_POST);
		
		$input = $input->getInput();
		return $input;
	}
	
	/**
	* function addDatetime
	* created: Tu Nguyen
	* date: 2010 Jan 18
	*/
	function addDatetime(){
		$value = JRequest::getVar("value");
		$description = JRequest::getVar("description");
		$id = JRequest::getVar("id");
		echo $this->getModel("config")->addDatetime($value, $description, 0, $id);
		
		//$this->displayDatetimeHtml();
		die();
	}
	
	/**
	*/
	function displayDatetimeHtml(){
		$model = &$this->getModel('config');
		$model->display();
		$view = &$this->getView('config');		
		$view->setModel($model,true);
		$view->displayDatetimeList();
	}
	
	function getDatetimeInfo(){
		$ret = &$this->getModel('config')->getDatetimeInfo(JRequest::getVar("id"));
		echo "{value:'".$ret->value."',description:'".$ret->description."'}";
		die();
	}
	function setDefaultDatetime(){
		$ret = &$this->getModel('config')->setDefaultDatetime(JRequest::getVar("id"));		
		die();
	}
	function removeDatetime(){
		$ret = &$this->getModel('config')->removeDatetime(JRequest::getVar("id"));
		//echo "{value:'".$ret->value."',description:'".$ret->description."'}";
		die();
	}
}
?>

