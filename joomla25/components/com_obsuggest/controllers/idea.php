<?php
/**
 * @version		$Id: idea.php 276 2011-03-31 08:43:05Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');
require_once (JPATH_COMPONENT.DS.'helper'.DS.'forum.php');

class ControllerIdea extends JController {
	private $user;
	function __construct() {
		parent::__construct();
		$this->setUser();
	}
	
	function display() {
		$forum_id = &JRequest::getVar('forum');
		redirectIfIsNotInt($forum_id);
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$user_id = &JRequest::getVar('user_id');
		redirectIfIsNotInt($user_id);
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		$view = &$this->getview('idea');
		$view->setModel($model,true);
		$view->setLayout('default');
		
		$view->display();
	}
	function dispNewForm() {
		$model 		= &$this->getModel('idea');
		$forum_id 	= &JRequest::getVar('forum_id');
		$model->setForumId($forum_id);
		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->setLayout('default_new');
		$view->display();
	}
	
	
	
	function addIdea() {
		$title = &JRequest::getVar('title');
		$content = &JRequest::getVar('content');
		$forum_id = &JRequest::getVar('forum_id');
		redirectIfIsNotInt($forum_id);
		if (!$forum_id){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}

		if ( !$content || !$title || !$forum_id ) {
			$res = new stdClass();
			$res -> error 	= 1;
			$res -> msg 	= JText::_("ERROR_ON_ADD_NEW_IDEA");
			echo json_encode( $res );
			exit();
			return;
		}

		$input['title'] = $title;
		$input['forum_id'] = $forum_id;
		$input['content'] = $content;
		$input['user_id'] = $this->user->id;
		$input['createdate'] = $this->getDateTime();
		
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		$model->addIdea($input);
	}
	
	public function setUser() {
		$this->user = JFactory::getUser();	
		/*		
		if (strpos($this->user->usertype,"Guest") !== false) {		
			$this->user->id = 0;
		}	
		*/
	}
	function getDateTime() {
		return date("Y-m-d H:i:s");
	}
	function getIdea() {
		$id = &JRequest::getVar('id');
		
		$model = &$this->getModel('idea');
		$model->setId($id);

		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->setLayout('idea');
		$view->dispIdea();
	}
	
	function ideaWithUserid(){
		$model = &$this->getModel('idea');
		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->setLayout('default_ideas');
		$view->dispIdeaWithUserid();
	}
	
	function IdeaWithStatus(){
		$limitstart	= JRequest::getVar('limitstart',0,'','int');
		$limit = JRequest::getVar('limit',10,'','int');
		$forum_id = &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$status_id = &JRequest::getVar('status_id');
		$model = &$this->getModel('idea');
		$model->setLimit($limit);
		$model->setLimitstart($limitstart);
		$model->setStatusId($status_id);
		$model->setForumId($forum_id);
		$model->getListIdea();
		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->setLayout('default');
		$view->dispIdeaWithStatus();
	}

	
	function IdeaById() {
		$idea_id  = &JRequest::getVar('id');
		redirectIfIsNotInt($idea_id);
		$forum_id = &JRequest::getVar('forum');
		redirectIfIsNotInt($forum_id);
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		$model->setIdeaId($idea_id);
		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->setLayout('default_ideas');
		$view->dispIdeaById();
	}
	
	function IdeaWithStatusCount() {
		$forum_id = &JRequest::getVar('forum');
		redirectIfIsNotInt($forum_id);
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$status_id = &JRequest::getVar('status_id');
		
		$model = &$this->getModel('idea');
		$model->setStatusId($status_id);
		$model->setForumId($forum_id);
		echo $model->getListIdeaCount();
	}
	
	
	function topIdeaCount() {
		$forum_id = &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		echo $model->topIdeaCount();
	}
	
	function topIdea(){
		
		$page = JRequest::getVar('page',1,'','int');
		redirectIfIsNotInt($page);
		$limitstart = 10 * ($page-1);				
		$limit = JRequest::getVar('limit',10,'','int');
		
		$forum_id = &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		
		$model = &$this->getModel('idea');
		$model->setLimit($limit);
		$model->setLimitstart($limitstart);
		$model->setForumId($forum_id);
		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->setLayout('default');
		$view->dispTopIdea();
	}
	
	function hotIdeaCount() {
		$forum_id = &JRequest::getVar('forum');
		redirectIfIsNotInt($forum_id);
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		
		
		echo $model->getHotIdeaCount();
	}
	/*function getHotIdeasCount() {
		$forum_id = &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		
		
		echo $model->getHotIdeaCount();
	}
	*/
	function hotIdea(){
		$page = JRequest::getInt("page", 1);
		
		
		$limit = JRequest::getVar('limit',10,'','int');
		
		$limitstart	= ($page-1)*$limit;
		$forum_id = &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		$model->setLimit($limit);
		$model->setLimitstart($limitstart);
		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->setLayout('default');
		$view->dispHotIdea();
	}

	function newIdea(){
		$page 	= JRequest::getInt("page", 1);
		$limit 	= JRequest::getVar('limit',10,'','int');
		$limitstart = ($page-1)*$limit;
		$forum_id 	= &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		$model->setLimit($limit);
		$model->setLimitstart($limitstart);
	
		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->setLayout('default');
		$view->dispNewIdea();
	}

	function newIdeaCount() {
		$forum_id = &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		echo $model->getNewIdeasCount();
	}
	
	function editIdea() {
		$id = &JRequest::getVar('id');
		
		$model = &$this->getModel('idea');
		$model->setId($id);

		$view = $this->getView('idea');
		$view->setModel($model,true);
		$view->setLayout('default_edit');
		$view->dispIdea();
	}
	function updateIdea() {
		$id = &JRequest::getVar('id');
		$title = &JRequest::getVar('title');
		$content = &JRequest::getVar('content');
	
		if ( !$content || !$title || !$id ) {
			$res = new stdClass();
			$res -> error 	= 1;
			$res -> msg 	= JText::_("ERROR_ON_UPDATE_IDEA");
			echo json_encode( $res );
			exit();
			return;
		}
		
		$input['id'] = $id;
		$input['title'] = $title;
		$input['content'] = $content;
		
		$model = &$this->getModel('idea');
		print_r($model->updateIdea($input));
		
	}
	
	function addResponse() {
		$id = &JRequest::getVar('id');
		$response = &JRequest::getVar('response');
		
		$input['id'] = $id;
		$input['response'] = $response;
		
		$model = &$this->getModel('idea');
		$model->addResponse($input);
	}
	function delIdea() {
		$id = &JRequest::getVar('id');
		
		$input['id'] = $id;
		
		$model = &$this->getModel('idea');
		
		
		$model->delIdea($input);
		
		$model->setIdeaId($id);
		//$comments = $model->countComments($id);
		
		$view = &$this->getView("idea");
		
		$view->setModel($model);
		
		$view->displayCountIdeas();
	}
	function updateIdeaStatus() {
		$id = &JRequest::getVar('id');
		$status_id = &JRequest::getVar('status_id');
		
		$input['id'] = $id;
		$input['status_id'] = $status_id;
		
		$model = &$this->getModel('idea');
		echo $model->updateIdeaStatus($input);
	}
	function search() { 
		$forum_id = &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$key = &JRequest::getVar('key');
		$input['key'] = $key;
		
		$page = JRequest::getInt("page", 1);
		
		
		$limit = JRequest::getVar('limit',10,'','int');
		
		$limitstart	= ($page-1)*$limit;
		
		
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		$model->setKeySearch($key);
		
		$model->setLimit($limit);
		$model->setLimitstart($limitstart);
		
		$view = &$this->getView('idea');
		
		$view->setModel($model,true);
		$view->setLayout('default');
		$view->dispSearch();
	}

	function falconSearch()
	{
		$forum_id = &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}

		$key = &JRequest::getVar('key');
		$input['key'] = $key;
		$session =&JFactory::getSession();
 		$session->set('key_search', $key);
		$page = JRequest::getInt("page", 1);

		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		$model->setKeySearch($key);

		$model->setLimit(0);
		$view = &$this->getView('idea');

		$view->setModel($model,true);
		$view->setLayout('default');
		$view->dispSearch('search_result');
	}

	function getCountSearch()
	{
		$forum_id = &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}
		$key = &JRequest::getVar('key');
		$input['key'] = $key;
		
		$limitstart	= JRequest::getVar('limitstart',0,'','int');
		$limit = JRequest::getVar('limit',10,'','int');
		
		
		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		$model->setKeySearch($key);
		
		$model->setLimit($limit);
		$model->setLimitstart($limitstart);
		
		$ideas = $model->getIdeas();
		//print_r($ideas);
		echo $model->total;
	}

	function autoComplete() {
		$forum_id = &JRequest::getVar('forum');
		if (!$forum_id or $forum_id ==0){
			$forum_default = Forum::getForumDefault();
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}

		$key = &JRequest::getVar('key');
		$input['key'] = $key;

		$model = &$this->getModel('idea');
		$model->setForumId($forum_id);
		$model->setKeySearch($key);
		$model->getAutoComplete();
		exit();
	}
	
	function updateVote() {
		$id = JRequest::getVar('id');
		$vote = JRequest::getVar('vote');
		$user = &JFactory::getUser();
		$user_id = $user->id;
		$model_cm = $this->getModel( 'comment' );
		$model_cm->setIdeaId( $id );
		$output = $model_cm->getOutput();
		
		$idea = Idea::getIdeaById($id);
		$can_vote 	= ( ($output->permission->vote_idea_a == 1) || 
						(($output->permission->vote_idea_o == 1) &&
						 ($output->user->id == $idea->user_id)) );
		if( !$can_vote ) return;
		$input['id'] = $id;
		$input['vote'] = $vote;
		#TODO: lay limitpoint
		$model_forum 	= $this->getModel('forum');

		$forum_id = $idea->forum_id;
		$sql = "SELECT * FROM `#__foobla_uv_forum` j 
				WHERE j.`id` = '$forum_id' LIMIT 1";
		$db 	= &JFactory::getDbo();
		$db->setQuery( $sql );
		$forum_obj = $db->loadObject();
		
		$limitpoint = $forum_obj->limitpoint;
		if( !$limitpoint ) {
			$sql 		= "SELECT `value` FROM `#__foobla_uv_gconfig` WHERE `key`='limitpoint'";
			$db->setQuery( $sql );
			$limitpoint = $db->loadResult();
		}
		#TOTO: tinh tong so diem se dc vote
//		$slq = "SELECT j.id, j.name, ji.id, ji.title, jv.user_id, jv.vote, SUM(jv.vote) `votedpoint`
		$sql = "SELECT SUM(jv.vote) `votedpoint` 
				FROM #__foobla_uv_forum j 
					LEFT OUTER JOIN #__foobla_uv_idea ji ON ji.forum_id=j.id 
					LEFT OUTER JOIN #__foobla_uv_vote jv ON jv.idea_id=ji.id 
				WHERE jv.user_id = $user_id AND j.id=$forum_id AND ji.id !=$id  LIMIT 1";
		$db->setQuery( $sql );
		$votedpoint 	= $db->loadResult();
		$newvotedpoint 	= $votedpoint + $vote;
//		echo "\nLimitpoint: ".$limitpoint;
//		echo "\nNewvotedpoint: ".$newvotedpoint;
//		echo "\nVotedpoint: ".$votedpoint;
//		echo "\nLimitpoint: ".$limitpoint;
		
		$model = &$this->getModel('idea');
		if( $newvotedpoint > $limitpoint ) {
			$respon = new stdClass();
			$respon->error 		= 1;
			$respon->error_msg 	= JText::_("OBSG_OUT_OF_RANG_VOTED_POINT_ALLOW").'!';
			echo json_encode ( $respon );
		} else {
			$respon = new stdClass();
			$respon->totalpoint 		= Number::getShortNumber($model -> updateVote ( $input ));
			$respon->totalpoint_html 	= Number::createNumber( $respon->totalpoint );
			$respon->remainpoint 		= $limitpoint - $newvotedpoint;
			$respon->usevote 			= $vote;
			$respon->limitpoint 		= $limitpoint;
			$respon->error 				= '0';
			$respon->error_msg 			= '';
			echo json_encode ( $respon );
		}
//		echo '<br/>'.print_r($respon, true).'</pre>';
//		echo '<pre>'.print_r($idea, true).'</pre>';
//		echo Number::createNumber($model->updateVote($input));	//???
	}
	
	/***************/	
	function getSuggest() {
		$key = &JRequest::getVar('key');
		$input['key'] = $key;
		
		$model = &$this->getModel('idea');
		$model->setKeySearch($key);
		$view = &$this->getView('idea');
		
		$view->setModel($model,true);
		$view->setLayout('default');
		$view->dispSearch();
	}
	/**************/
	
	public function getAllIdeas()
	{
		$limitstart	= JRequest::getVar('limitstart',0,'','int');
		$limit = JRequest::getVar('limit',10,'','int');
		
		
		$model = &$this->getModel('idea');
		
		$model->setLimit($limit);
		$model->setLimitstart($limitstart);
		
		$view = &$this->getView('idea');
		
		$view->setModel($model,true);
		$view->setLayout('default');
		$view->dispSearch();
	}
}

?>