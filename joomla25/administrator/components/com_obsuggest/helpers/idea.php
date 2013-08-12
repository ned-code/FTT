<?php
/**
 * @version		$Id: idea.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."comment.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."config.php");
final class Idea {
	function __construct() {		
	}
	
	public static function getAllIdea() {
		$query = "
			SELECT *
			FROM `#__foobla_uv_idea`
			ORDER BY `id` DESC
		;";
		return DBase::getObjectList($query);
	}
	public function getIdeaLimit($_limitstart, $_limit,$key = null, $_forum_id = null) {
		global $mainframe,$option;
		$filter_order_pro			= $mainframe->getUserStateFromRequest( $option."filter_order_pro_2",		'filter_order',		'p.id',	'cmd' );
		$filter_order_Dir_pro		= $mainframe->getUserStateFromRequest( $option."filter_order_Dir_pro_2",	'filter_order_Dir',	'desc','word' );
		
		//echo $filter_order_pro;
		/*
		if ($filter_order_pro=='p.name'){
			echo $filter_order_pro;
			$filter_order_pro = 'p.title';			
		}*/
		if($filter_order_pro)			
			$orderby 	= ' ORDER BY '. $filter_order_pro .' '. $filter_order_Dir_pro;
		else 		
			$orderby = '';
		
		$where = 'WHERE 1=1 ';
		if ($_forum_id != NULL) {
			$where .= 'AND `forum_id` =  '.$_forum_id;
		}
		if ($key != NULL) {
			$where .= " AND `title` LIKE  '%$key%' ";
			
		}
		if(!$_limit || $_limit==0)
			$str_limit = '';
		else 
			$str_limit = 'LIMIT ' .$_limitstart . ',' . $_limit ;	
		$query = "
			SELECT p.*
			FROM `#__foobla_uv_idea` as p
			".$where." 
			$orderby 
			$str_limit		
		;";	
		$lists['order_Dir']	= $filter_order_Dir_pro;
		$lists['order']		= $filter_order_pro;
		$std = new stdClass();
		$std->result = DBase::getObjectList($query);
		$std->lists	 = $lists;
		return $std;
	}
	public static function getIdeaById($_id = 0) {
		$query ="
			SELECT *
			FROM `#__foobla_uv_idea`
			WHERE `id` = $_id
		;";
		return DBase::getObject($query);
	}
	public static function getAllIdeaByForumId($_forum_id = null) {
		$query ="
			SELECT *
			FROM `#__foobla_uv_idea`
			WHERE `forum_id` = $_forum_id
		;";
		return DBase::getObjectList($query);
	}
	public static function getAllIdeaByForumIdLimit($_id = null,$limitstart = 0, $limit = 1000){
		$query = "
			SELECT * 
			FROM `#__foobla_uv_idea`
			WHERE `forum_id` = $_id
			ORDER BY `id` DESC
			LIMIT $limitstart, $limit 			
		;";		
		return DBase::getObjectList($query);
	}
	public function countIdea($_key = null, $_forum_id = null) {
		$where = 'WHERE 1=1 ';
		if ($_forum_id != NULL) {
			$where .= 'AND `forum_id` =  '.$_forum_id;
		}
		if ($_key != NULL) {
			$where .= " AND `title` LIKE  '%$_key%' ";
		}
		$query = "
			SELECT COUNT(`id`) as sum
			FROM `#__foobla_uv_idea`
			".$where." 
			ORDER BY `id` DESC;";
		
		$temp = DBase::getObject($query);
		return $temp->sum;
	}
	public function countIdeaByForumId($_forum_id = null) {
		#$_forum_id = JRequest::getVar('forum_id');
		$query = "
			SELECT COUNT(`id`) as sum
			FROM `#__foobla_uv_idea`
			WHERE `forum_id` = $_forum_id
		;";

		$rs = DBase::getObject($query);
		if ($rs == NULL) return 0;
		return $rs->sum;
	}
	public function countAllIdea() {
		$query = "
			SELECT COUNT(`id`) as sum
			FROM `#__foobla_uv_idea`			
		;";
		$rs = DBase::getObject($query);
		
		if ($rs == NULL) return 0;
		return $rs->sum;
	}
	public static function deleteIdeaById($_id = null) {
		if ($_id == null) return;
		$query = "
			DELETE FROM `#__foobla_uv_idea`
			WHERE `id` = $_id
		;";
		DBase::querySQL($query);
		Comment::deleteByIdeaId($_id);
	}	
	public static function deleteIdeaByForumId($_forum_id = null) {
		if ($_forum_id == null) return;
		$query = "
			SELECT * 
			FROM `#__foobla_uv_idea`
			WHERE `forum_id` = $_forum_id
		;";		
		
		$ideas = DBase::getObjectList($query);
		foreach ($ideas as $idea) {
			Idea::deleteIdeaById($idea->id);
		}
	}
	public static function deleteListIdea($_input = null) {
		if ($_input == null) return;
		foreach ($_input as $key => $value) {			
			Idea::deleteIdeaById($value);
		}		
	}
	/*
	public static function addIdea($_input) {
		$query = "
			INSERT INTO #__foobla_uv_idea(`title`,`content`,`resource`,`user_id`,`forum_id`,`createdate`)
			VALUES ('".$_input['title']."',
					'".$_input['content']."',
					'".$_input['resource']."',
					".$_input['user_id'].",
					".$_input['forum_id'].",
					'".$_input['createdate']."')
		;";		
		DBase::querySQL($query);
	}
	*/
	public function addIdea($_input = null) {
		$user = JFactory::getUser();
		if (!isset($_input->idea->user_id)) {
			$_input->idea->user_id = $user->id;
		}
		if (!isset($_input->idea->resource)) {
			$_input->idea->resource = '';
		}
		if (!isset($_input->idea->createdate)) {
			$_input->idea->createdate = date("Y-m-d H:i:s");
		}
		
		$_input->idea->title = Config::fixBadWord($_input->idea->title);
		$_input->idea->content = Config::fixBadWord($_input->idea->content);
		$_input->idea->title = Config::fixKeyWord($_input->idea->title);
		$_input->idea->content = Config::fixKeyWord($_input->idea->content);
		
		$query = "
			INSERT INTO #__foobla_uv_idea(`title`,`content`,`resource`,`user_id`,`forum_id`,`createdate`,`status_id`,`published`,`votes`)
			VALUES (\"".$_input->idea->title."\",
					\"".$_input->idea->content."\",
					\"".$_input->idea->resource."\",
					".$_input->idea->user_id.",
					".$_input->idea->forum_id.",
					\"".$_input->idea->createdate."\",
					".$_input->idea->status_id.",
					".$_input->idea->published.",
					".$_input->idea->votes.")
		;";		
		
		DBase::querySQL($query);
	}
	public static function updateIdea($_input) {
		$_input->idea->title = Config::fixBadWord($_input->idea->title);
		$_input->idea->content = Config::fixBadWord($_input->idea->content);

		$query = "
			UPDATE  `#__foobla_uv_idea`
			SET `title` = '".$_input->idea->title."',
				 `content` = \"".$_input->idea->content."\",
				 `status_id` = ".$_input->idea->status_id.",
				 `forum_id` = ".$_input->idea->forum_id.",
				 `response` = \"".$_input->idea->response."\",
				 `published` = ".$_input->idea->published.",
				 `votes` = ".$_input->idea->votes."
			WHERE `id` = ".$_input->idea->id."
		;";
				
		DBase::querySQL($query);
	}
}
?>

