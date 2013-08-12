<?php
/**
 * @version		$Id: activity.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');

class ControllerActivity extends JController {
	function __construct() {
		parent::__construct();
	}
	
	function display() {
		$user_id = &JRequest::getVar('user_id');			
		
		redirectIfIsNotInt($user_id);
		
		$page = JRequest::getInt("page", 1);
		$model = &$this->getModel('activity');
		$model->setUserId($user_id);
		
		
		$model->limit =  JRequest::getVar('limit',10);
		$model->limitstart = ($page-1) * JRequest::getVar('limit', 10);// JRequest::getVar('limitstart',0,'default','int');
		
		
		//print_r($_GET);
		$view = &$this->getView('activity');		
		$view->setModel($model,true);
		$view->display();
	}
	function displayIdeas()
	{
		//echo "asdasda:";
		//return ;
		$user_id = &JRequest::getVar('user_id');			
		redirectIfIsNotInt($user_id);
		$model = &$this->getModel('activity');
		$model->setUserId($user_id);
		
		$page = JRequest::getInt("page", 1);
		
		$model->limit = JRequest::getVar('limit',10);
		$model->limitstart = ($page-1) * JRequest::getVar('limit',10);
		$view = &$this->getView('activity');		
		$view->setModel($model,true);
		$view->displayIdeas();
	}
	function displayComments()
	{
		$user_id = &JRequest::getVar('user_id');			
		redirectIfIsNotInt($user_id);
		$model = &$this->getModel('activity');
		$model->setUserId($user_id);
		
		$page = JRequest::getInt("page", 1);
		
		$model->limit = JRequest::getVar('limit',10);
		$model->limitstart = ($page-1) * JRequest::getVar('limit',10);
		
		$view = &$this->getView('activity');		
		$view->setModel($model,true);
		$view->displayComments();
	}
}
?>