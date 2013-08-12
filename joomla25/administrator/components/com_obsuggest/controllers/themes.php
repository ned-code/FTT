<?php
/**
 * @version		$Id: themes.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');

class ControllerThemes extends JController
{
	public function __construct()
	{
		parent::__construct();
	}
	public function display()
	{
		$view = &$this->getView('themes');
		$model = &$this->getModel('themes');
		
		$view->setModel($model);
		$view->display();
	}
	function getListSchemas()
	{
		$view = &$this->getView('themes');
		$model = &$this->getModel('themes');
		
		$view->setModel($model);
		$view->displayListSchemas();
	}
	function save()
	{
		$view = &$this->getView('themes');
		$model = &$this->getModel('themes');
		
		$model->saveConfig();
		
		$view->setModel($model);
		$view->display();
	}
	function saveSchema()
	{
		//$view = &$this->getView('themes');
		$model = &$this->getModel('themes');
		$theme = JRequest::getString('theme', 'default');
		$schema = JRequest::getString('schema', 'default');
		$pros = JRequest::getString('pros','');
		
		$pros = str_replace('_sharp_', "#",$pros);
		
		$model->saveSchema($theme, $schema, $pros);
	}
	function saveTheme(){
		$model = &$this->getModel('themes');
		$theme = JRequest::getString('theme', 'default');
		$theme_content = $_GET['theme_content'];// JRequest::getString('theme_content', 'no content');
		$theme_preview = $_GET['theme_preview'];
		$model->saveTheme($theme, $theme_content, $theme_preview);
	}
	function savePartSchema(){
		$model = &$this->getModel('themes');
		$theme = JRequest::getString('theme', 'default');
		$schema = JRequest::getString('schema', 'default');
		$part	= JRequest::getString('part', '1');
		$pros = JRequest::getString('pros','');
		
		$pros = str_replace('_sharp_', "#",$pros);
		
		$model->savePartSchema($theme, $schema, $part, $pros);
	}
	function saveSchemaFromParts(){
		$model = &$this->getModel('themes');
		$theme = JRequest::getString('theme', 'default');
		$schema = JRequest::getString('schema', 'default');
		$parts = JRequest::getInt('parts',0);
		$model->saveSchemaFromParts($theme, $schema, $parts);
	}
	function saveLayout(){
		$theme = JRequest::getString('theme', 'default');
		$name = JRequest::getString('name', 'default');
		$layouts = JRequest::getString('layouts', '');
		Themes::saveLayout($theme, $name, $layouts);
	}
	function editBlock(){
		$view = &$this->getView('themes');
		$model = &$this->getModel('themes');
		
		$view->setModel($model);
		$view->displayEditBlock(JRequest::getString("block"));
	}
} // end class
?>
