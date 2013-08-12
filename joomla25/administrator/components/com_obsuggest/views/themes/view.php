<?php
/**
 * @version		$Id: view.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.html.pane');
jimport('joomla.application.component.view');
require_once(JPATH_COMPONENT.DS."helpers".DS."theme.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."themes.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."forum.php");
class ViewThemes extends JView
{
	function __construct()
	{
		parent::__construct();
		Theme::dispSubMenu();
	}
	function display($tpl = null)
	{
		$model = &$this->getModel('themes');
		
		
		$themes = $model->getListThemes();

		$themes_active = $model->getThemesActive()	;
		
		$schemas = $model->getListSchemas($themes_active['theme_name']);
		
		$temp = $model->getHTML($themes_active['theme_name'], $themes_active['schema_name']);
		
		$pre = $model->loadPreviewTheme();
		$this->assignRef("loadPreview", $pre);
		//$properties = $model->loadSchema($themes_active['theme_name'], $themes_active['schema_name']);
		
		$list_status = $model->getListStatus();
		
		$this->assignRef('list_status', $list_status);
		$this->assignRef('html', $temp);
		$this->assignRef('theme_active', $themes_active);
		//$this->assignRef('properties', $properties);
		$this->assignRef('schemas', $schemas);
		$this->assignRef('themes', $themes);
		
		
		
		parent::display($tpl);
	}
	function displayListSchemas()
	{
		$model = &$this->getModel('themes');
		
		
		$schemas = $model->getListSchemas(JRequest::getString('theme', 'default'));				
		
		$this->assignRef('schemas', $schemas);
		
		
		parent::display('schemas');
	}
	function listFontSize()
	{
		$ret = "";
		for($i=10;$i<=72;$i+=2)
		{
			$ret .= '<option value="' . $i .'px">' . $i . 'px</option>'."\n" ;
		}
		return $ret;
	}
	function displayTitle(){
		
	}
	function displayEditBlock($tmp = null){
		$forum = Forum::getDefaultForum();
		//print_r($forum);
		$this->assignRef("forum", $forum);
		parent::display($tmp);
	}
} // end class
?>
