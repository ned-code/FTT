<?php
/**
 * @version		$Id: comment.php 192 2011-03-22 07:47:44Z phonglq $
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
require_once(JPATH_COMPONENT.DS."helper".DS."config.php");

class ModelComment extends JModel {
	private $user;
	private $idea_id = null;
	private $key = NULL;
	private $comment_id ;
	private $gconfigs = null;
	
	function __construct() {
		parent::__construct();
		$this->setUser();		
	}
	
	public function getCountComments($idea_id=null)
	{
		$where = '';
		if($idea_id)
			$where = " WHERE idea_id = $idea_id";
		
		$query = "
			SELECT count(id) as count
			FROM `#__foobla_uv_comment`
			$where
		";
		$rs = DBase::getObject( $query );
		//print_r($rs);
		return $rs->count;
	}
	function getIdeaByComment($comment_id)
	{
		
	}
	public function getCountCommentsWithUser($comment_id)
	{
		$user = JFactory::getUser();
		$user_id = $user->get('id');
		$where = '';
		
		$db = JFactory::getDBO();
		
		$query = "
			SELECT i.id as id FROM #__foobla_uv_idea, #__foobla_uv_comment c
			WHERE i.id = c.idea_id
			AND c.id = $comment_id
		";
		$rs = DBase::getObject( $query );
		$this->idea_id = $rs->id;
				
		
		$where = " WHERE idea_id = $this->idea_id AND user_id = $user_id";
		
		$query = "
			SELECT count(id) as count
			FROM `#__foobla_uv_comment`
			$where
		";
		$rs = DBase::getObject( $query );
		//print_r($rs);
		return $rs->count;
	}
	public function setIdeaId($_idea_id) {
		$this->idea_id = $_idea_id;
	}
	
	public function setCommentId($comment_id){
		$this->comment_id = $comment_id;
	}
	
	public function delComment() {
		$query = "DELETE FROM `#__foobla_uv_comment` WHERE `id` =".$this->comment_id;
		DBase::querySQL($query);		
	}
	
	public function ListCommentWithUserId() {
		$user = JFactory::getUser();
		$user_id = $user->get('id');
		$query = "
			SELECT *
			FROM `#__foobla_uv_comment`
			WHERE `user_id` = $user_id
			ORDER BY `createdate` DESC
		;";		
		return DBase::getObjectList($query);
	}
	
	public function getListComment() {
		$query = "
			SELECT *
			FROM `#__foobla_uv_comment`
			WHERE `idea_id` = $this->idea_id
			ORDER BY `createdate` DESC
		;";		
		return DBase::getObjectList($query);
	}

	public function editComment() {
		$query = "SELECT * FROM `#__foobla_uv_comment` WHERE `id` = ".$this->comment_id;
		return DBase::getObjectList($query);
	}

	public function updateComment($input) {
		$input['comment_content'] = Config::fixBadWord($input['comment_content']);
		$query = "UPDATE `#__foobla_uv_comment` ".
					" SET `comment` = \"".$input['comment_content'].
					"\" WHERE `id` = ".$input['comment_id'];
		DBase::querySQl($query);
		return $input['comment_content'];
	}

	public function setUser() {
		$this->user = &JFactory::getUser();
	}

	public function getComments() { 
		
		$page = JRequest::getInt("page", 1);
		$limit = 10;
		$limitStart = ($page-1) * $limit;
		$query = "
			SELECT *
			FROM `#__foobla_uv_comment`
			WHERE `idea_id` = $this->idea_id
			ORDER BY `createdate` DESC
			LIMIT $limitStart, $limit
		;";		
		return DBase::getObjectList($query);
	}

	public function getUserVoteIdea($_idea_id){
		return Idea::getUserVoteIdeaById($_idea_id,$this->user->id);
	}

	public function getUser($_user_id) {
		return Handy::getUser($_user_id);
	}

	public function getIdeaId() {
		return $this->idea_id;
	}

	public function getForumId(){
		$query = "SELECT `forum_id` FROM #__foobla_uv_idea WHERE `id` = ".$this->idea_id;
		return  DBase::getObjectResult($query);
	}

	public function getForumInfo() {
		$query = "SELECT uf.* FROM #__foobla_uv_forum uf inner join `#__foobla_uv_idea` ui ON ui.`forum_id` = uf.`id`
		WHERE ui.`id` = ".$this->idea_id;
		return  DBase::getObject($query);
	}

	public function getIdea() {
		$query = "
			SELECT i.*, s.title as status
			FROM `#__foobla_uv_idea` i
			LEFT JOIN #__foobla_uv_status s ON(i.status_id=s.id)			
			WHERE i.id = $this->idea_id
		;";		
		return DBase::getObjectList($query);
	}

	public function getStatus() {
		return Handy::getStatus();
	}

	public function getOutput() {
		global $obIsJ15;
		$version 	= new JVersion();
		$sversion 	= substr($version->getShortVersion(), 0, 3);
		$user 		= &JFactory::getUser();
		if( !$obIsJ15 ) {
			$permission = Permission::getPermissionById( $user -> groups );
		} else {
			$permission = Permission::getPermissionById($user->gid);
		}
		
		$temp = new Output();		
		$temp->addProperty('permission',$permission);
		$temp->addProperty('user',$user);
		
		return $temp->getOutput();
	}

	public function addComment($_input) {
		$_input['comment'] = Config::fixBadWord($_input['comment']);		
		$query = "
			INSERT INTO #__foobla_uv_comment(`idea_id`,`forum_id`,`comment`,`createdate`,`user_id`)				
			VALUES (".
				$_input['idea_id'].",".
				$_input['forum_id'].",\"".
				nl2br($_input['comment']).""."\",\"".
				$_input['createdate']."\",".
				$_input['user_id'].")
		;";
		DBase::querySQl($query);
	}

	function getDatetimeConfig(){
		$db = JFactory::getDBO();
		
		$sql = "
			SELECT `value` FROM #__foobla_uv_datetime_config
			WHERE `default` = 1
		";
		
		return DBase::getObject($sql)->value;
	}

	function getGConfig() {
		if( !$this->gconfigs ) {
			$db 	= &JFactory::getDbo();
			$query 	= "SELECT * FROM `#__foobla_uv_gconfig`";
			$db->setQuery( $query );
			$this->gconfigs = $db -> loadObjectList('key');
		}
		return $this->gconfigs;
	}
}
?>
