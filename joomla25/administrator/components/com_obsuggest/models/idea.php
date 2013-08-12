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

jimport('joomla.application.component.model');
require_once(JPATH_COMPONENT.DS."helpers".DS."dbase.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."handy.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."idea.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."forum.php");

require_once(JPATH_COMPONENT.DS."helpers".DS."comment.php");
require_once(JPATH_COMPONENT.DS."helpers".DS."class.output.php");
require_once(JPATH_COMPONENT.DS."classes".DS."class.schematableidea.php");



class ModelIdea extends JModel {

	
	private $idea_id;	
	private $forum_id = NULL;
	private $filter_key = NULL;
	//private $output = null;
	
	
	function __construct() {
		parent::__construct();
	}
	
	public function getAllIdea() {
		return Idea::getAllIdea();
	}
		///==================
	public function view() {
		$mainframe = &JFactory::getApplication();
		// Get the pagination request variables
		$option 	= JRequest::getVar( 'option', "com_obsuggest" );
		$limit 		= $mainframe->getUserStateFromRequest( 'global.list.limit' , 'limit', 5 );
		$limitstart = $mainframe->getUserStateFromRequest( $option . 'limitstart', 'limitstart', 0 );
		/*echo 'thanh1-'.$limit.'<br>';
		echo 'thanh2-'.$limitstart.'<br>';*/
		// set the state pagination variables
		$this->setState('limit', $limit);
		$this->setState('limitstart', $limitstart);		
		//getCommentByIdeaIdLimitgetCommentByIdeaIdLimit
		//$comments =comments::getAllIdeaByForumIdLimit($this->forum_id,$limitstart,$limit);
		$comments =comment::getCommentByIdeaIdLimit($this->forum_id,$limitstart,$limit);
		$this->output->set('comment', $comment);
		
		$tab = Forum::getTabForumById($this->forum_id);
		$this->output->set('status', $tab);
		
		$statistic = Forum::getStatisticForumById($this->forum_id);
		$this->output->set('statistic', $statistic);
	}
	/*public function getPagination1()
	{
		global $mainframe;
		if (empty($this->_pagination))
		{
		// import the pagination library
		jimport('joomla.html.pagination');		
		// prepare the pagination values		
		$limitstart = $this->getState('limitstart');
		$limit = $this->getState('limit');
		$total = Comment::countCommentByForumId($this->forum_id);		
		echo $total;
		// create the pagination object
		$this->_pagination = new JPagination($total, $limitstart,$limit);		
		}
		
		return $this->pagination;
	}*/
	
	///==================
	public function getIdeaLimit() {
		//exit('dlfkasfj');
		$mainframe = &JFactory::getApplication();
		// Get the pagination request variables
		$option		= JRequest::getVar('option',"com_foobla_uservoice");
		#$limit 			= $mainframe->getUserStateFromRequest($option.'limit_idea','limit',10);
		//$limit = JRequest::getVar("limit");
		//$limit = $_REQUEST['limit']; 
		$limit 			= $mainframe->getUserStateFromRequest('global.list.limit','limit', 5);
		//echo "<br/>LIMIT $limit";
		$limitstart 	= $mainframe->getUserStateFromRequest($option.'limitstart','limitstart',0);
		//echo "<br/>LIMITSTART $limitstart";
		// set the state pagination variables
		//if ($limit == null ) $limit = 10;
		$this->setState('limit', $limit);
		//echo "<h1>".$this->getState('limit')."</h1>";
		$this->setState('limitstart', $limitstart);
		//echo $limit;
		
		#if ($limitstart == null ) $limitstart = 0;
		
		return Idea::getIdeaLimit($limitstart, $limit, $this->filter_key, $this->forum_id);
		
	}
	
	public function deleteIdea($_input) {
		Idea::deleteIdeaById($_input['id']);
	}
	public function deleteListIdea($_input) {
		Idea::deleteListIdea($_input);
	}
	public function setIdeaId($_id) {
		$this->idea_id = $_id;
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
	public function getIdeaById($_id) {
		return Idea::getIdeaById($_id);
	}
	public function editStatus($_input) {
	}
	public function updateStatus($_input) {
		$query = "
			UPDATE `#__foobla_uv_status`
			SET `title` = \"".$_input['title']."\",
				`parent_id` = ".$_input['parent_id']."
			WHERE `id` = ".$_input['id']."
		;";					
		DBase::querySql($query);
	}
	public function addStatus($_input) {
		$query = "
			INSERT INTO #__foobla_uv_status(`title`,`parent_id`)
			VALUES (
				\"".$_input['title']."\",
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
		return Handy::countCommentByIdeaId($_idea_id); 
	}
	
	public function getOutput() {
		$this->output = new Output();					
		$temp = $this->output; 
		
		$temp = new Output();
		$status = $this->getAllStatus();
		//echo $status;
		if ($this->idea_id != null) {
			$idea = $this->getIdeaById($this->idea_id);			
			$temp->addProperty('idea', $idea);			
			$comments = Comment::getCommentByIdeaId($this->idea_id);
			//var_dump($comments);
			$temp->addProperty('comments', $comments);
			
			$mainframe = &JFactory::getApplication();
			
			// Get the pagination request variables
			$option		= JRequest::getVar('option',"com_foobla_uservoice");
			$limit 			= $mainframe->getUserStateFromRequest('global.list.limit','limit', 5);
			$limitstart 	= $mainframe->getUserStateFromRequest($option.'limitstart','limitstart',0);
			
			// set the state pagination variables
			$this->setState('limit', $limit);
			$this->setState('limitstart', $limitstart);
			//$ideas = Idea::getAllIdeaByForumIdLimit($this->forum_id,$limitstart,$limit);
			
			$comments =Comment::getCommentByIdeaIdLimit($this->forum_id,$limitstart,$limit);
			$this->output->set('comment', $comments);
			$total = Idea::countIdeaByForumId( $this->forum_id );

			// echo "<h1>$total</h1>";	
			// create the pagination object
			$this->_pagination = new JPagination($total, $limitstart,$limit);
			
		} else {
			$idea = new SchemaTableIdea();
			$temp->addProperty('idea', $idea);
			
		}		
		$forums = Forum::getAllForum();
		$temp->addProperty('status', $status);		
		$temp->addProperty('forums', $forums);
		return $temp->getOutput();
	}
	///////////////-------------------
	public function update($_input) {
		Idea::updateIdea($_input);
	}
	public function addIdea($_input = null) {
		$user = JFactory::getUser();
		$_input->idea->user_id = $user->id;
		$_input->idea->resource = '';
		$_input->idea->createdate = date("Y-m-d H:i:s");
		
		$_input->idea->title = Config::fixBadWord($_input->idea->title);
		$_input->idea->content = Config::fixBadWord($_input->idea->content);
		
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
	public function setPublished($_input) {
		foreach ($_input as $key => $value) {
			$curr_publish = Idea::getIdeaById($value);			
			
			$input = new stdClass();
			$input->idea = $curr_publish;
			$input->idea->published = 1; 				
			Idea::updateIdea($input);				
		}
	}
	public function setUnpublished($_input) {
		foreach ($_input as $key => $value) {
			$curr_publish = Idea::getIdeaById($value);			
			
			$input = new stdClass();
			$input->idea = $curr_publish;
			$input->idea->published = 0; 				
			Idea::updateIdea($input);				
		}
	}
	
	function getPagination()
	{				
		if (empty($this->_pagination))
		{
			//exit('dasfasf');
		// import the pagination library
		jimport('joomla.html.pagination');		
		// prepare the pagination values		
		$limitstart 	= $this->getState('limitstart');
		$limit 			= $this->getState('limit');
		
//		if ($limit == null ) $limit = 10;
//		if ($limitstart == null ) $limitstart = 0;
		
		if ($this->forum_id == NULL) {
			$total = Idea::countAllIdea();
		} else {
			//$total = Idea::countIdeaByForumId($this->forum_id);
			$total = Comment::countCommentByForumId($this->forum_id);	
		}
		$total = Idea::countIdea($this->filter_key, $this->forum_id);
		// create the pagination object
		$this->_pagination = new JPagination($total, $limitstart,$limit);		
		}
		return $this->_pagination;
	}
	///-----------------
	
	function getCPagination() {
		$db = &JFactory::getDBO();
		jimport('joomla.html.pagination');
		$limitstart 	= $this->getState('limitstart');
		$limit 			= $this->getState('limit');
		//echo "<hr>$limitstart</hr>";
		$forum_id 	= JRequest::getVar("id");
		//$total = Comment::countCommentByForumId($forum_id);	
		$query = "
			SELECT COUNT(`id`) as sum
			FROM `#__foobla_uv_comment`
			WHERE `idea_id` = $forum_id
		;";
				$db->setQuery($query);
				//echo $query;
				$total =  $db->loadResult();
		
		$query = "
			SELECT * 
			FROM `#__foobla_uv_comment`
			WHERE `idea_id` = $forum_id
		";
		
		$db->setQuery($query, $limitstart,$limit);
		
		$comments = $db->loadObjectList();

		#$comments = Comment::getCommentByIdeaId($forum_id);
		$this->_pagination = new JPagination($total, $limitstart,$limit);		
		$ret['pag'] 		= $this->_pagination;
		$ret['coms'] 	= $comments;
		return $ret;
	}
	

}
?>

