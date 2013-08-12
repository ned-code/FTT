<?php
/**
 * @version		$Id: import.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."forum.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."exportimport.php");
final class Import {
	function __construct() {		
	}
	
	public static function importJoomlaCore($_input) {				
		$contents = Import::getAllContentFromJoomla($_input);
		
		if ($contents == NULL) return 0;
		
		$input = null;
				
		foreach ($contents as $content) {
			$input->idea->title = $content->title;
			$input->idea->content = $content->introtext.$content->fulltext;
			$input->idea->user_id = $content->created_by;
			$input->idea->createdate = $content->created;
			$input->idea->forum_id = $_input['forum_id'];
			$input->idea->resource = 'Joomla Core';
			$input->idea->status_id = 0;
			$input->idea->published = 1;
			$input->idea->votes = 0;
			Idea::addIdea($input);
		}
	}
	
	public static function getAllContentFromJoomla($_input) {		
		if ($_input['cat_id'] != '') {
			$and = " AND `catid` = ".$_input['cat_id'];
		} else {
			$and = "";
		}
		
		if ($_input['section_id'] == NULL) {
			$sections = Import::getAllSectionFromJoomla();
			foreach ($sections as $section) {
				$_input['section_id'] = $section->id;
				break;
			}
		}
		
		$query = "
			SELECT * 
			FROM `#__content`
			WHERE `sectionid` = ".$_input['section_id'].
				$and."
		;";
		
		$contents = DBase::getObjectList($query);		
		return $contents;
	}
	public static function getAllSectionFromJoomla() {
		$query = "
			SELECT * 
			FROM `#__sections`
		;";
		return DBase::getObjectList($query);
	}
	public static function getAllCategoryFromJoomlaBySectionId($_section_id = null) {
		$query = "
			SELECT * 
			FROM `#__categories`
			WHERE `section` = $_section_id
		;";
		return DBase::getObjectList($query);
	}
	public static function getAllCategoryFromJoomla(){
		$sections = Import::getAllSectionFromJoomla();
		$rs = null;
				
		foreach ($sections as $section) {
			$temp = new stdClass();			
			$temp->title = $section->title;
			$temp->section_id = $section->id;
			$temp->id = 0;
			$rs[] = $temp;
			
			$cats = Import::getAllCategoryFromJoomlaBySectionId($section->id);
			foreach ($cats as $cat) {
				$temp = new stdClass();			
				$temp->title = $cat->title;
				$temp->section_id = $section->id;
				$temp->id = $cat->id;				
				$rs[] = $temp;
			}
		}
		return $rs;
	}
	
	public static function importFile($_input) {				
		$forum = ExportImport::getContentFile($_input['file_name'],$_input['file_path']);
		
		if ($forum == NULL) return 0;
		
		$input = null;
				
		foreach ($forum->idea as $idea) {
			$input = new stdClass();
			$input->idea = $idea;
			$input->idea->user_id = 0;			
			$input->idea->forum_id = $_input['forum_id'];
			$input->idea->resource = 'File';
			$input->idea->status_id = 0;			
			Idea::addIdea($input);
		}
	}
}

?>
