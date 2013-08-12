<?php
/**
 * @version		$Id: report.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');
class ControllerReport extends JController 
{
	public function __construct()
	{
		parent::__construct();
	}
	public function display()
	{
		$view = &$this->getView('report');
		$model = &$this->getModel('report');
		$view->setModel($model);
		$view->display();
	}
	function repairError()
	{
		$model = &$this->getModel('report');
		
		$table = JRequest::getString('t', '');
		
		$field = JRequest::getString('f', '');
		
		$error = JRequest::getInt('e', 0);
		
		$ret = $model->repair(array('table'=>$table, 'field'=>$field, 'error'=>$error));
		
		$s = "";
		for ($i=0; $i<1000000;$i++)
			$s .= "s";
		for ($i=0; $i<1000000;$i++)
			$s .= "s";
		//echo $s;
		echo $ret;
	}
	public function createDir()
	{		
		$model = &$this->getModel('report');
		echo $model->repairDir();
	}
}
?>
