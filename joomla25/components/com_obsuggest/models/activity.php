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

jimport('joomla.application.component.model');
require_once(JPATH_COMPONENT.DS."helper".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helper".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helper".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helper".DS."permission.php");

class ModelActivity extends JModel {
	private $user;
	private $idea_id = null;
	private $key = NULL;
	public $user_id;
	public $limitstart = 0;
	public $limit = 10;
	function __construct() {
		parent::__construct();
		$this->setUser();		
	}
	function setUserId($_user_id) {
		$this->user_id = $_user_id;
	}
	
	public function setUser() {
		$this->user = &JFactory::getUser();
	}
	public function getUser($_user_id) {
		return Handy::getUser($_user_id);
	}
	public function getStatus() {
		return Handy::getStatus();
	}
	public function getIdeas() {
		
		$limit = '';
		$limit = ' LIMIT ' . $this->limitstart . ',' . $this->limit;
		$query ="
			SELECT i.*, s.title as status
			FROM `#__foobla_uv_idea` i
			LEFT JOIN #__foobla_uv_status s ON(i.status_id=s.id)
			WHERE `user_id` = $this->user_id
			$limit
		;";
		
		return DBase::getObjectList($query);		
	}
	public function getTotal()
	{
		return 23;
	}
	public function getComments() {
		$limit = '';
		$limit = ' LIMIT ' . $this->limitstart . ',' . $this->limit;
		$query ="
			SELECT *
			FROM `#__foobla_uv_comment`
			WHERE `user_id` = $this->user_id
			ORDER BY `createdate` DESC"
			.$limit."
		;";
		return DBase::getObjectList($query);
	}
	public function getUserVoteIdea($_idea_id){
		return Idea::getUserVoteIdeaById($_idea_id,$this->user->id);
	}
	public function getNumIdeas() {
		return $this->countIdeas($this->user_id);
	}
	public function getNumComments() {
		return $this->countComments($this->user_id);
	}
	private function countIdeas($_user_id=null) {
		
		$where = null;
		if($_user_id)
			$where = "WHERE `user_id` = $_user_id";
		$query ="
			SELECT COUNT(`id`) as count_idea
			FROM `#__foobla_uv_idea`
			$where
		;";
		$rs = DBase::getObject($query);
		return $rs->count_idea;
	}
	public function getOutput() {
		$user = &JFactory::getUser();
		$permission = Permission::getPermissionById($user->gid);				

		$temp = new Output();		
		$temp->addProperty('permission',$permission);
		$temp->addProperty('user',$user);
		
		return $temp->getOutput();
	}
	private function countComments($_user_id) {
		$where = null;
		if($_user_id)
			$where = "WHERE `user_id` = $_user_id";
		$query ="
			SELECT COUNT(`id`) as count_comment
			FROM `#__foobla_uv_comment`
			$where
		;";
		$rs = DBase::getObject($query);
		return $rs->count_comment;
	}
	function getDatetimeConfig(){
		$db = JFactory::getDBO();
		
		$sql = "
			SELECT `value` FROM #__foobla_uv_datetime_config
			WHERE `default` = 1
		";
		
		return DBase::getObject($sql)->value;
	}
}
?>
