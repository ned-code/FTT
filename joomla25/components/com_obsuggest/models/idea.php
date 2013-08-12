<?php
/**
 * @version		$Id: idea.php 274 2011-03-31 08:33:15Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.model');
jimport('joomla.html.pagination');
require_once(JPATH_COMPONENT.DS."helper".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helper".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helper".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helper".DS."permission.php");
require_once(JPATH_COMPONENT.DS."helper".DS."config.php");

class Modelidea extends JModel {
	private $user;
	private $id = 1;
	private $key = NULL;
	private $idea_id = NULL;
	private $forum_id;
	private $status_id ;
	private $limitstart = 0;
	private $limit =0;
	public $pageNav = NULl;
	public $total = 0;
	public $gconfigs = null;
	
	function __construct() {
		parent::__construct();
		$this->setUser();		
	}
	public function setUser() {
		$this->user = JFactory::getUser();
		//return Handy::getUser($_user_id);		
		//if (strpos($this->user->usertype,"Guest") !== false) $this->user->id = 0;
	}
	
	public function setLimitstart($limitStart){
		$this->limitstart = $limitStart;
	}
	
	public function setLimit($limit) {
		$this->limit = $limit;
	}
	
	public function setIdeaId($idea_id) {
		$this->idea_id = $idea_id;
	}
	
	public function setId($_id) {
		$this->id = $_id;
	}
	public function setKeySearch($_key) {
		$this->key = $_key;
	}
	public function setForumId($_forum_id = null) {
		$this->forum_id = $_forum_id;
	}
	
	public function setStatusId($_status_id = null){
		$this->status_id = $_status_id;
	}
	
	public function getForumId(){
		return $this->forum_id;
	}
	
	public function getIdeaById() {
		$query = "SELECT * FROM `#__foobla_uv_idea` WHERE `id` = ".$this->idea_id." AND `published` = 1";
		return DBase::getObjectList($query);
	}
	
	public function getAutoComplete() {
		$where = "";
		if ($this->key != NULL) {
			$where = "
				WHERE `title` LIKE '$this->key%'
					AND `forum_id` = $this->forum_id
			";
		} else {
			$where = "
				WHERE `forum_id` = $this->forum_id 
			";
		}
			
		$query = "
			SELECT *
			FROM `#__foobla_uv_idea` "
			.$where.			
			" ORDER BY `createdate` DESC
		;";						
		$data 	=  DBase::getObjectList($query);
		$tdata 	= new stdClass();
		$tdata->data = $data;
		echo json_encode($tdata);
		exit();
	}
	
	
	public function getIdeas() {
		
		$where = ""; 
		if ($this->key != NULL) {
			$where = "
				WHERE i.title LIKE '%$this->key%'
					 AND `published` =1 AND `forum_id` = $this->forum_id
			";
		} else {
			$where = "
				WHERE `published` =1 AND `forum_id` = $this->forum_id 
			";
		}
		$limit = '';
		if($this->limit>0 && $this->limitstart>=0)
		{
			$limit = " LIMIT " . $this->limitstart . "," . $this->limit;
		}
		$query = "
			SELECT COUNT(id)
			FROM `#__foobla_uv_idea` i "
			.$where.
			" ORDER BY `createdate` DESC
		;";
		$this->total = DBase::getObjectResult($query);
		
		$query = "
			SELECT i.*,s.title as status
			FROM `#__foobla_uv_idea` i
			LEFT JOIN `#__foobla_uv_status` s ON(i.status_id = s.id)
			".$where.			
			" 
			ORDER BY `createdate` DESC "
			.$limit."
		;";
		//return DBase::getObjectListPageNav($query, $this->limitstart, $this->limit);
		return DBase::getObjectList($query);
	}

	public function getCountSearch()
	{
		
	}

	public function getUser($_user_id) {
		return Handy::getUser($_user_id);
	}

	public function getIdeaWithUserid(){
		$user =  &JFactory::getUser();
		$userid = $user->get('id');
		$query = "
			SELECT *
			FROM `#__foobla_uv_idea`			
			WHERE `user_id` = $userid
		;";		
		return DBase::getObjectList($query);
	}

	public function getIdea() {
		$query = "
			SELECT *
			FROM `#__foobla_uv_idea`			
			WHERE `id` = $this->id
		;";		
		return DBase::getObject($query);
	}
	public function getStatus() {
		return Handy::getStatus();
	}
	
	public  function getUserVote() {
		$query = "
			SELECT *
			FROM `#__foobla_uv_vote`			
			WHERE `ideaid` = $this->id
		;";		
		return DBase::getObject($query);
	}
	
	public function getUserVoteIdea($_idea_id){
		return Idea::getUserVoteIdeaById($_idea_id,$this->user->id);
	}
	
	public function getOutput() {
		global $obIsJ15;
		$user = &JFactory::getUser();
		if( !$obIsJ15 ) {
			$permission = Permission::getPermissionById($user->groups); 
		} else {
			$permission = Permission::getPermissionById($user->gid);
		}
		$temp = new Output();		
		$temp->addProperty('permission',$permission);
				
		$temp->addProperty('user',$user);
		
		return $temp->getOutput();
	}
	public function addIdea($_input) {
		$_input['title'] =Config::fixBadWord($_input['title']);
		$_input['content'] = Config::fixBadWord($_input['content']);
		
		$query = "
			INSERT INTO #__foobla_uv_idea(`title`,`content`,`user_id`,`createdate`,`forum_id`)
			VALUES (\"".$_input['title']."\",
					\"".$_input['content']."\",
					".$_input['user_id'].",
					\"".$_input['createdate']."\",
					".$_input['forum_id'].")
		;";
		DBase::querySQL($query);
	}
	
	public function updateidea($_input) {
		$_input['title'] = Config::fixBadWord($_input['title']);
		$_input['content'] = Config::fixBadWord($_input['content']);
		$query = "
			UPDATE `#__foobla_uv_idea`
			SET `title` = \"".$_input['title']."\",
				`content` = \"".$_input['content']."\"
			WHERE `id` = ".$_input['id']."
		;";	
		//echo $query;		
		DBase::querySQL($query);
	}
	public function addResponse($_input) {
		$_input['response'] = Config::fixBadWord($_input['response']);
		$query = "
			UPDATE `#__foobla_uv_idea`
			SET `response` = \"".$_input['response']."\"
			WHERE `id` = ".$_input['id']."
		;";		

		DBase::querySQL($query);
	}
	public function delIdea($_input) {
		
		$query = "
			DELETE FROM #__foobla_uv_comment
			WHERE idea_id = ". $_input['id'] ." 
		";
		DBase::querySQL($query);
		$query = "
			DELETE FROM `#__foobla_uv_idea`
			WHERE `id` = ".$_input['id']."
		;";		
		DBase::querySQL($query);
	}
	
	/*function getNewIdeas() {
		$date	= getdate();
		$mon	= $date['mon']<10?'0'.$date['mon']:$date['mon']; 
		$date	= $date['year'].'-'.$mon.'-'.$date['mday'];
		$qry = "
			SELECT *  FROM #__foobla_uv_idea
			WHERE `createdate` LIKE '".$date."%'
		";
		//echo $qry;
		DBase::querySQL($qry);
	}*/
	
	function getNewIdeas() { 
		
		$date	= getdate();
		$mon	= $date['mon']<10?'0'.$date['mon']:$date['mon']; 
		$date	= $date['year'].'-'.$mon.'-'.$date['mday'];
		/*$qry = "
			SELECT *  FROM #__foobla_uv_idea
			WHERE `createdate` LIKE '".$date."%'"." ORDER BY `id` DESC";*/
		$qry = "
			SELECT COUNT(i.id)  
			FROM #__foobla_uv_idea i
			LEFT JOIN #__foobla_uv_status s ON(i.status_id=s.id)
			WHERE `published` = 1
			AND `forum_id` = ".$this->forum_id."  ORDER BY `i`.`id` DESC";
		$this->total = DBase::getObjectResult($qry);

		$qry = " SELECT i.*, s.title as status
			FROM #__foobla_uv_idea i
			LEFT JOIN #__foobla_uv_status s ON(i.status_id=s.id)
			WHERE `published` = 1
			AND `forum_id` = ".$this->forum_id."  ORDER BY `id` DESC
		";
		
		return DBase::getObjectListPageNav($qry, $this->limitstart, $this->limit);
	}
	
	function  getNewIdeasCount() {
		$qry = " SELECT COUNT(id)  FROM #__foobla_uv_idea WHERE `published` = 1".
				" AND `forum_id` = ".$this->forum_id."  ORDER BY `id` DESC";
		return DBase::getObjectResult($qry);
	}
	
	
	function  getTopIdeas(){ 			
		//echo $this->limit;
		$query = "SELECT COUNT(id) FROM #__foobla_uv_idea ". 
				 " WHERE  `forum_id` = ".$this->forum_id." AND `published` =1";
		$query = "
			SELECT count(i.id)
			FROM `#__foobla_uv_idea` i
			LEFT JOIN `#__foobla_uv_status` s  on (i.status_id = s.id)
			WHERE `forum_id` = '".$this->forum_id."' 
			AND `published` = 1  
		";		 
		$total = DBase::getObjectResult($query);
		$this->total = $total;
		/*$query = "SELECT * FROM #__foobla_uv_idea ". 
				 " WHERE  `forum_id` = ".$this->forum_id." AND `published` =1".
				 " ORDER BY `votes` DESC";
				 */
		
		$query = "
			SELECT i.*, s.title as status
			FROM `#__foobla_uv_idea` i
			LEFT JOIN `#__foobla_uv_status` s  on (i.status_id = s.id)
			WHERE `forum_id` = '".$this->forum_id."' 
			AND `published` = 1  
			ORDER BY `votes` DESC
		";
		return DBase::getObjectListPageNav($query, $this->limitstart, $this->limit);
	}
	
	function topIdeaCount() {
		$query = "SELECT COUNT(id) FROM #__foobla_uv_idea ". 
				 " WHERE  `forum_id` = ".$this->forum_id." AND `published` =1";
		return DBase::getObjectResult($query);
	}
	
	
	function getHotIdeas(){
		$date_current = strtotime("now");
		$arr	= array();
		$query  = "
			SELECT COUNT(i.id) 
			FROM #__foobla_uv_idea i
			LEFT JOIN #__foobla_uv_status s ON (i.status_id = s.id)
			WHERE `forum_id` = ".$this->forum_id." AND `published` =1 
		";
		$this->total = DBase::getObjectResult($query);
		$query  = "
			SELECT i.*, s.title as status
			FROM #__foobla_uv_idea i
			LEFT JOIN #__foobla_uv_status s ON (i.status_id = s.id)
			WHERE `forum_id` = ".$this->forum_id." AND `published` =1 
		";	
		
		$result = DBase::getObjectListPageNav($query, $this->limitstart, $this->limit);
		for($i = 0; $i < count($result); $i++) {
			if ($date_current < strtotime($result[$i]->createdate))	
			$timei = $date_current;
			else 		
				$timei = $date_current - strtotime($result[$i]->createdate);
			$votei = $result[$i]->votes;
			for($j = $i+1; $j < count($result); $j++) {
				if ($date_current < strtotime($result[$j]->createdate))	
				$timej = $date_current;
				else 		
					$timej = $date_current - strtotime($result[$j]->createdate);
					$votej = $result[$j]->votes;
					if($votei == 0) $timei = 1;
					if($votej == 0) $timej = 1;
					if (($votei*$timej) <= ($votej*$timei)){
						$arr = $result[$i];
						$result[$i] = $result[$j];
						$result[$j] = $arr;
 					}
			}
		}
		return $result ;
	}
	
	function getHotIdeaCount() {
		$query  = "SELECT COUNT(id) FROM #__foobla_uv_idea".
				  " WHERE `forum_id` = ".$this->forum_id." AND `published` =1 ";
		return  DBase::getObjectResult($query);
	}
	
	function getListIdea(){
		$query = "SELECT COUNT(id) FROM #__foobla_uv_idea ".
				 " WHERE `published`  = 1 AND `forum_id` = ".$this->forum_id." AND `status_id` = ".$this->status_id;
		$this->total = DBase::getObjectResult($query);
		$query = "
			SELECT i.*, s.title as status 
			FROM #__foobla_uv_idea i
			LEFT JOIN #__foobla_uv_status s ON (i.status_id=s.id)
			WHERE `published`  = 1 AND `forum_id` = ".$this->forum_id." AND `status_id` = ".$this->status_id;
		return DBase::getObjectListPageNav($query, $this->limitstart, $this->limit);
	}
	
	function getListIdeaCount() {
		$query = "SELECT COUNT(id) FROM #__foobla_uv_idea ".
				 " WHERE `published`  = 1 AND `forum_id` = ".$this->forum_id." AND `status_id` = ".$this->status_id;
		return  DBase::getObjectResult($query);
	}
	
	function updateideaStatus($_input) {
		
		$query = "
			UPDATE `#__foobla_uv_idea`
			SET `status_id` = ".$_input['status_id']."
			WHERE `id` = ".$_input['id']."
		;";		
		DBase::querySQL($query);
		
		$query = "
			SELECT title FROM `#__foobla_uv_status`			
			WHERE `id` = ".$_input['status_id']."
		;";	
		$ret = DBase::getObject($query)	;
		$ret = $ret->title? $ret->title : "";
		return $ret;
	}
	
	public function updateVote($_input) {
		$listVote = Idea::getListVotes();
		$str = "";
		foreach ($listVote as $objVote) {
			$str .= $objVote->vote_value.",";
		}
		$arr_vote = explode(",", $str);
		if (!in_array($_input['vote'], $arr_vote))
		$_input['vote'] = $arr_vote[0];
		
		$vote = $this->findVoteIdea($_input);
		$sumvotes = 0;
		if ($vote == -10000) {
			$vote = 0;
			$sumvotes = $this->updateVotes($_input,$vote);
			
			$query = "
				INSERT INTO #__foobla_uv_vote(`idea_id`,`user_id`,`vote`) 
				VALUES (".
					$_input['id'].",".
					$this->user->id.",".
					$_input['vote'].")
				;";		
			
			DBase::querySQL($query);			
		} else {
			$sumvotes = $this->updateVotes($_input,$vote);
			
			$query = "
				UPDATE  `#__foobla_uv_vote`
				SET `vote` = ".$_input['vote']." 
				WHERE `idea_id` = ".$_input['id']."
					AND `user_id` = ".$this->user->id."
				;";		
			DBase::querySQL($query);			
		}
		return $sumvotes;
	}
	public function updateVotes($_input,$_vote) {
		$vote = $_input['vote'] - $_vote;
		
		$query = "
			SELECT SUM(`votes`) as vote
			FROM `#__foobla_uv_idea`
			WHERE `id` = ".$_input['id']."
		;";
		$rs = DBase::getObject($query);		
		$votes = $rs->vote;		
		if ($votes == NULL) $votes = 0;
		$votes += $vote;
		
		$query = "
			UPDATE  `#__foobla_uv_idea`
			SET `votes` = ".$votes." 
			WHERE `id` = ".$_input['id']."
		;";		
		DBase::querySQL($query);
		return $votes;
	}	
	private function findVoteIdea($_input) {
		$query ="
			SELECT SUM(`vote`) as vote
			FROM `#__foobla_uv_vote`
			WHERE `idea_id` = ".$_input['id']."
				AND `user_id` = ".$this->user->id."
		;";
		$vote = DBase::getObject($query); 
		if ($vote->vote == NULL) {
			return -10000 ;
		} else return $vote->vote;
		return $vote->vote;
	}
	public function countIdeas($_user_id=null) {
		
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
	function countComments($user_id)		
	{
		$query ="
			SELECT COUNT(`id`) as count_comment
			FROM `#__foobla_uv_comment`
			WHERE user_id = $user_id
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
	
	public function getGConfig() {
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
