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

jimport('joomla.filesystem.file');
jimport('joomla.filesystem.folder');
class ModelThemes extends JModel {
	
	function __construct() {
		parent::__construct();
	}
	function getListThemes()
	{
		return Themes::getListThemes();
	}
	function getListSchemas($theme)
	{
		//$themehelper = new Themes();
		return Themes::getListSchemas($theme);
	}
	function getThemesActive()
	{
		//$themehelper = new Themes();
		return Themes::getThemesActive();
	}
	function saveConfig()
	{
		$theme = JRequest::getString('themes_list', 'default');
		$schema = JRequest::getString('schemas_list', 'default');
		
		$config = 'theme_name=' . $theme . "\n";
		$config .= 'schema_name=' . $schema;
		
		JFile::write(PATH_THEMES . DS . 'config.inf', $config);
	}
	function getHTML($theme, $schema){
		//$themehelper = new Themes();
		return Themes::getHTML($theme, $schema);
	}
	function saveSchema($theme, $schema, $pros)
	{
		//$themehelper = new Themes();
		return Themes::saveSchema($theme, $schema, $pros);
	}
	function loadSchema($theme, $schema)
	{
		//$themehelper = new Themes();
		return Themes::loadSchema($theme, $schema);
	}
	function getListStatus()
	{
		$db = &JFactory::getDBO();
		$query = "
			SELECT title, id 
			FROM #__foobla_uv_status
			WHERE parent_id<>-1
		";
		$db->setQuery($query);
		$result = $db->loadObjectList();
		return $result;
	}
	function saveTheme($theme, $theme_content, $theme_preview){
		//$themehelper = new Themes();
		return Themes::saveTheme($theme, $theme_content, $theme_preview);
	}
	function loadPreviewTheme($theme = 'default'){
		//$themehelper = new Themes();
		return Themes::loadPreviewTheme($theme);
		
	}
	function savePartSchema($theme, $schema, $part, $pros){
		//$themehelper = new Themes();
		return Themes::savePartSchema($theme, $schema, $part, $pros);
	}
	function saveSchemaFromParts($theme, $schema, $parts = 0){
		//$themehelper = new Themes();
		return Themes::saveSchemaFromParts($theme, $schema, $parts);
	}
}
?>
