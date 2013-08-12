<?php
/**
 * @version		$Id: vote.php 152 2011-03-12 06:19:57Z thongta $
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
require_once(JPATH_COMPONENT.DS."helpers".DS."comment.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."class.output.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.schematableidea.php");


class ModelVote extends JModel {
	private $vote_id;	
	private $forum_id = NULL;
	private $filter_key = NULL;
	private $filter_state = NULL;
	
	function __construct() {
		parent::__construct();
	}
	public function getListVotes(){
		if ($this->filter_state){
			if($this->filter_state == 'P') $val = 1;
			else $val = 0;
			$where = " WHERE `published` = ".$val;
		}else $where = "";
		$query = "SELECT * FROM #__foobla_uv_votes_value ".$where;
		return DBase::getObjectList($query);
	}
	
	public function setFilterState($filter_state = NULL){
		$this->filter_state  = $filter_state;
	}
	
	public function save($input){
		global $mainframe;
		if ($input['tmp'] == 'add'){
			$query = "INSERT INTO #__foobla_uv_votes_value(`vote_value`,`title`,`published`)".
					"VALUES (".
						$input['vote_value'].",'".
						Config::removeBadChar($input['title'])."',".
						$input['published'].")";
					
			DBase::querySql($query);
		}else if ($input['tmp'] == 'update'){
			$query = "UPDATE #__foobla_uv_votes_value".
					" SET `vote_value` = ".$input['vote_value'].",".
					" `title` = '".Config::removeBadChar($input['title'])."',".
					" `published` =".$input['published'].
					"  WHERE `id` =".$input['vote_id'];
			DBase::querySql($query);
		}
	}
	
	public function getAllConfig() {
		return Config::getAllConfig();
	}
	public function getConfigLimit() {
		global $mainframe;
		// Get the pagination request variables
		$option= JRequest::getVar('option',"com_foobla_uservoice");
		$limit = $mainframe->getUserStateFromRequest('global.list.limit','limit', 10);
		$limitstart = $mainframe->getUserStateFromRequest($option.'limitstart','limitstart',0);
		// set the state pagination variables
		$this->setState('limit', $limit);
		$this->setState('limitstart', $limitstart);
		
		return Config::getConfigLimit($limitstart, $limit, $this->filter_key, $this->forum_id);
		
	}
	public function deleteConfig($_input) {
		Config::deleteConfigById($_input['id']);
	}
	public function deleteListConfig($_input) {
		Config::deleteListConfig($_input);
	}
	public function setConfigId($_id) {
		$this->vote_id = $_id;
	}
	public function setFilterKey($_key) {
		if ($_key == "") {
			$this->filter_key = NULL;
		} else {
			$this->filter_key = $_key;
		}
	}
	public function setForumId($_forum_id) {
		$this->forum_id = $_forum_id;
	}
	public function getAllStatus() {
		return Handy::getStatus();
	}
	public function getParentStatus() {
		return Handy::getParentStatus();
	}
	public function getConfigById($_id) {
		return Config::getConfigById($_id);
	}
	public function editStatus($_input) {
	}
	public function updateStatus($_input) {
		$query = "
			UPDATE `#__foobla_uv_status`
			SET `title` = '".$_input['title']."',
				`parent_id` = ".$_input['parent_id']."
			WHERE `id` = ".$_input['id']."
		;";					
		DBase::querySql($query);
	}
	public function addStatus($_input) {
		$query = "
			INSERT INTO #__foobla_uv_status(`title`,`parent_id`)
			VALUES (
				'".$_input['title']."',
				".$_input['parent_id']."
			);";
		DBase::querySql($query);
	}
	public function deleteStatus($_input) {
		$query = "
			DELETE FROM `#__foobla_uv_status`			
			WHERE `id` = ".$_input['id']."
		;";					
		DBase::querySql($query);
	}
	public function countCommentById($_idea_id) {
		return Handy::countCommentByConfigId($_idea_id); 
	}
	
	public function getOutput() {
	}
	
	public function editVotes(){
		$query  = "SELECT * FROM #__foobla_uv_votes_value".
					" WHERE `id` =".$this->vote_id;
		return DBase::getObject($query);
	}
	
	public function update($_input) {
		Config::updateConfig($_input);
	}
	public function addConfig($_input = null) {
		$user = JFactory::getUser();
		$_input->idea->user_id = $user->id;
		$_input->idea->resource = '';
		$_input->idea->createdate = date("Y-m-d H:i:s");
		
		$query = "
			INSERT INTO #__foobla_uv_idea(`title`,`content`,`resource`,`user_id`,`forum_id`,`createdate`,`status_id`,`published`,`votes`)
			VALUES ('".$_input->idea->title."',
					'".$_input->idea->content."',
					'".$_input->idea->resource."',
					".$_input->idea->user_id.",
					".$_input->idea->forum_id.",
					'".$_input->idea->createdate."',
					".$_input->idea->status_id.",
					".$_input->idea->published.",
					".$_input->idea->votes.")
		;";		
		DBase::querySQL($query);
	}
	public function setPublished($_input) {
		foreach ($_input as $key => $value) {
			$curr_publish = Config::getConfigById($value);			
			
			$input = new stdClass();
			$input->idea = $curr_publish;
			$input->idea->published = 1; 				
			Config::updateConfig($input);				
		}
	}
	public function setUnpublished($_input) {
		foreach ($_input as $key => $value) {
			$curr_publish = Config::getConfigById($value);			
			
			$input = new stdClass();
			$input->idea = $curr_publish;
			$input->idea->published = 0; 				
			Config::updateConfig($input);				
		}
	}
}
?>

