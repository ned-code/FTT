<?php
/**
 * @version		$Id: permission.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');

class ControllerPermission extends JController {
	function __construct() {
		parent::__construct();
	}
	
	function display() {
		$model = &$this->getModel('Permission');
		$view = &$this->getView('Permission');
		
		$view->setModel($model,true);
		$view->display();
	}
	function edit() {
		$gid = &JRequest::getVar('gid');		
		$model = $this->getModel('Permission');
		$model->setGroupId($gid);
				
		$view = &$this->getView('Permission');
		$view->setModel($model,true);		
		$view->editPermission();
	}
	public function update() {
		$post = $_POST;
		$input = $this->getInput($post);
		//var_dump($input);
		$model = $this->getModel('Permission');
		$model->updatePermission($input);
		$this->display();
	}
	
	private function getInput($_post) {
		$input = null;
		$gid= JRequest::getVar('gid');
		
		$model = $this->getModel('Permission');
		$model->setGroupId($gid);
		
		$permission = $model->getPermissionById();
		
		foreach ($permission as $key => $value) {
			$input[$key] = 0;
			foreach ($_post as $p_key => $p_value) {							
				if ($key == $p_key) {
					$input[$key] = $p_value;
				}
			}
		}
		$input['group_id'] = $gid;
		return $input;
	}
}
?>
