<?php
/**
 * @version		$Id: forum.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');
require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."forum.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."import.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."config.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."exportimport.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."outputforum.php");


class ModelForum extends JModel {
	private $forum_id = null;	
	public $output = null;
	function __construct() {
		
		parent::__construct();
				
	}
	public function setForumId($_id) {
		$this->forum_id = $_id;
		$this->output = new OutputForum($this->forum_id);
	}
	public function getAllForum() {
		
		return Forum::getAllForum();
	}
	public function getForum() {
		return Forum::getForumById($this->forum_id);
	}
	public function getAllIdea() {
		return Idea::getAllIdeaByForumId($this->forum_id);
	}
	public function getAllStatus() {
		return Handy::getStatus();
	}
	
	public function getOutput() {
		if ($this->output == null) {
			$this->output = new OutputForum($this->forum_id);
			return $this->output;
		} else {
			return $this->output;
		}
	}
	public function update($_input = null) {
		$set = null; 
		
		foreach ($_input as $key => $value) {			
			$set .= " `".$key."` = \"".Config::removeBadChar($value)."\" ,";
		}
		 				
		$set = substr($set, 0, strlen($set)-1);
		$set = $set;
		$query = " 			
			UPDATE `#__foobla_uv_forum` ".
			"SET ".$set.
			"WHERE `id` = ".$this->forum_id."
		;";
		//exit()				;
		DBase::querySQL($query);
	}
	public function add() {
		$this->output = new stdClass();
		//$this->output = new OutputForum($this->forum_id);
		$this->output->forum = Config::getForumTemp();
		$tab = Forum::getTabForumById($this->forum_id);
		$this->output->status =  $tab;
	}
	public function addForum($_input) {
		$key = null; 
		$value = null;
		
		foreach ($_input as $i_key => $i_value) {			
			$key .= "`".$i_key."`,";
			$value .= "\"" . Config::removeBadChar($i_value) . "\",";
		}
		 				
		$key = substr($key, 0, strlen($key)-1);
		$value = substr($value, 0, strlen($value)-1);
		
		$query = " 			
			INSERT INTO `#__foobla_uv_forum`($key)
			VALUES ($value)
		;";		
		DBase::querySQL($query);
		
		$query = "
			SELECT max(id) as new_forum_id
			FROM `#__foobla_uv_forum`
		";
		$rs = DBase::getObject($query);
		
		return $rs->new_forum_id;
	}	
	public function view() {
		global $mainframe;
		// Get the pagination request variables
		$option= JRequest::getVar('option',"com_foobla_suggestion");
		$limit = $mainframe->getUserStateFromRequest('global.list.limit','limit', 5);
		$limitstart = $mainframe->getUserStateFromRequest($option.'limitstart','limitstart',0);
		// set the state pagination variables
		$this->setState('limit', $limit);
		$this->setState('limitstart', $limitstart);		
		/*echo $option;
		echo 'thanh1-'.$limit.'<br>';
		echo 'thanh2-'.$limitstart.'<br>';*/
		$ideas = Idea::getAllIdeaByForumIdLimit($this->forum_id,$limitstart,$limit);
		$this->output->set('ideas', $ideas);
		
		$tab = Forum::getTabForumById($this->forum_id);
		$this->output->set('status', $tab);
		
		$statistic = Forum::getStatisticForumById($this->forum_id);
		$this->output->set('statistic', $statistic);
	}
	public function edit() {
		$tab = Forum::getTabForumById($this->forum_id);
		//echo "thanh_tab: ".$tab;
		$this->output->set('status', $tab);
	}
	public function delete() {
		Forum::delete($this->forum_id);
	}
	
	public function setDefault($_input) {
		$query = "
			UPDATE `#__foobla_uv_forum`
			SET `default` = 0
			WHERE `default` = 1;
		;";
		
		DBase::querySQL($query);
		
		foreach($_input as $key => $value) {
			$query = "
				UPDATE `#__foobla_uv_forum`
				SET `default` = 1,
					`published` = 1
				WHERE `id` = $value;
			;";
			DBase::querySQL($query);
			break;
		}
	}
	public function setPublished($_input) {
		foreach($_input as $key => $value) {
			$query = "
				UPDATE `#__foobla_uv_forum`
				SET `published` = 1
				WHERE `id` = $value;
			;";
			DBase::querySQL($query);			
		}
	}
	public function setUnPublished($_input) {
		foreach($_input as $key => $value) {
			$query = "
				UPDATE `#__foobla_uv_forum`
				SET `published` = 0
				WHERE `id` = $value
				AND `default` = 0;
			;";
			DBase::querySQL($query);			
		}
	}
	public function importJoomlaCore($_input = null) {			
		Import::importJoomlaCore($_input);
	}
	public function importExport($_input = null) {
		Import::importFile($_input);
	}
	public function importImport($_input = null) {
		Import::importFile($_input);
	}
	
	public function importAddJoomlaCore($_input = null) {
		$sections = Import::getAllSectionFromJoomla();
		$this->output->addValue('sections',$sections);
		
		//$categorys = Import::getAllCategoryFromJoomlaBySectionId($_input['section_id']);
		$categorys = Import::getAllCategoryFromJoomla();
		$this->output->addValue('categorys',$categorys);
		
		$contents = Import::getAllContentFromJoomla($_input);
		$this->output->addValue('contents',$contents);
	}
	public function importAddExportFile() {
		ExportImport::$pathToFile = JPATH_COMPONENT.DS."data".DS."export";
		$file_export = ExportImport::getFile();
		$this->output->file_export = $file_export; 
	}
	public function importAddImportFile() {
		ExportImport::$pathToFile = JPATH_COMPONENT.DS."data".DS."import";
		$file_import = ExportImport::getFile();
		$this->output->file_import = $file_import;
	}
	public function updateTab($_input) {
		switch ( $_input['value'] ) {
			case 0 :
				$query = "
					DELETE FROM `#__foobla_uv_tab`
					WHERE `status_id` = ".$_input['status_id']."
						AND `forum_id` = ".$this->forum_id."
				;";
				DBase::querySQL($query);
				break;
			case 1 :
				$query = "
					INSERT INTO `#__foobla_uv_tab`
					VALUES (".$_input['status_id'].",".$this->forum_id.")
				;";
				DBase::querySQL($query);
				break;
		}
	}
	public function updateTabs($_input = null) {
		$query ="
			DELETE FROM `#__foobla_uv_tab`
			WHERE `forum_id` = ".$this->forum_id.";";
		DBase::querySQL($query);
		if ($_input == NULL) return;
		foreach ($_input as $key => $value) {
			$query = "
					INSERT INTO `#__foobla_uv_tab`
					VALUES ($value,".$this->forum_id.")
				;";
			DBase::querySQL($query);
		}
	}
	
	function getPagination()
	{
		global $mainframe;
		if (empty($this->_pagination))
		{
		// import the pagination library
		jimport('joomla.html.pagination');		
		// prepare the pagination values		
		$limitstart = $this->getState('limitstart');
		$limit = $this->getState('limit');
		$total = Idea::countIdeaByForumId($this->forum_id);		
		// create the pagination object
		$this->_pagination = new JPagination($total, $limitstart,$limit);		
		}
		
		return $this->_pagination;
	}
	
	//start thanhtd
	function getFPagination() {
		global $mainframe,$option;
		$db = &JFactory::getDBO();
		jimport('joomla.html.pagination');
//		$limitstart 	= $this->getState('limitstart');
//		$limit 			= $this->getState('limit');
		$limit = $mainframe->getUserStateFromRequest('global.list.limit','limit', 5);
		$limitstart = $mainframe->getUserStateFromRequest($option.'limitstart','limitstart',0);
//		
//		$this->setState('limit', $limit);
//		$this->setState('limitstart', $limitstart);	
		
		//echo "<hr>limit :$limit <br> limitstart: $limitstart <br></hr>";
		$filter_order_pro			= $mainframe->getUserStateFromRequest( $option."filter_order_pro",		'filter_order',		'p.id',	'cmd' );
		$filter_order_Dir_pro		= $mainframe->getUserStateFromRequest( $option."filter_order_Dir_pro",	'filter_order_Dir',	'desc','word' );
		if($filter_order_pro)			
			$orderby 	= ' ORDER BY '. $filter_order_pro .' '. $filter_order_Dir_pro;
		else 	{
			$orderby = '';

		}		
		$forum_id 	= JRequest::getVar("id");
		//$total = Comment::countCommentByForumId($forum_id);	
		$query = "
			SELECT COUNT(`id`) as sum
			FROM `#__foobla_uv_forum`
		;";
		$db->setQuery($query);
		//echo $query;
		$total =  $db->loadResult();
		$query = "
			SELECT p.* 
			FROM `#__foobla_uv_forum` as p $orderby
		";
		
		//echo $query;
		//WHERE `idea_id` = $forum_id
		$db->setQuery($query, $limitstart,$limit);
		///$db->setQuery($query);
		$forum = $db->loadObjectList();
		$lists['order_Dir']	= $filter_order_Dir_pro;
		$lists['order']		= $filter_order_pro;
		//print_r($forum);
		#$comments = Comment::getCommentByIdeaId($forum_id);
		$this->_pagination = new JPagination($total, $limitstart,$limit);		
		$ret['pag'] 		= $this->_pagination;
		$ret['forum'] 	= $forum;
		$ret['lists']	 = $lists;	
		return $ret;
	}
	//end thanhtd
}
?>
