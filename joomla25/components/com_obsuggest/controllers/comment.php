<?php
/**
 * @version		$Id: comment.php 347 2011-06-09 10:28:23Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

require_once(JPATH_COMPONENT.DS."helper".DS."handy.php");
jimport('joomla.application.component.controller');

class ControllerComment extends JController {
	private $user;
	function __construct() {
		parent::__construct();
		$this->setUser();
	}
	function pagingComment()
	{
		
		$model = &$this->getModel('comment');
		//$model->setIdeaId($idea_id);
		$view = $this->getView('comment');
		$view->setModel($model,true);
		$view->setLayout('default_pagination');
		$view->displayPagination();
	}
	function display() {
		$idea_id = &JRequest::getString('idea_id', null);
		
		redirectIfIsNotInt($idea_id);
		
		$input['idea_id'] = $idea_id;
		$model = $this->getModel('comment');
		$model->setIdeaId($idea_id);
		
		$view = $this->getView('comment');		
		$view->setModel($model,true);
		$view->display();
	}
	
	function getList() {
		$idea_id = &JRequest::getVar('idea_id');
		redirectIfIsNotInt($idea_id);
		$model = &$this->getModel('comment');
		$model->setIdeaId($idea_id);
		$view = $this->getView('comment');
		$view->setModel($model,true);
		$view->setLayout('default_comment');
		$view->displayList();
	}
	
	function delComment(){
		$idea_id = &JRequest::getVar('idea_id');
		
		redirectIfIsNotInt($idea_id);
		$comment_id = &JRequest::getVar('id');
		redirectIfIsNotInt($comment_id);
		$model = &$this->getModel('comment');
		$model->setIdeaId($idea_id);
		$model->setCommentId($comment_id);
		$model->delComment();
		$view = $this->getView('comment');
		$view->setModel($model,true);
		$view->setLayout('default');
		$view->displayComments();
	}
	function getCountComments()
	{
		$idea_id = & JRequest::getVar('idea_id');
		redirectIfIsNotInt($idea_id);
		$model = &$this->getModel('comment');
		echo $model->getCountComments($idea_id);
	}
	function UdelComment(){
		$comment_id = &JRequest::getVar('id');
		redirectIfIsNotInt($comment_id);
		$model = &$this->getModel('comment');
		$model->setCommentId($comment_id);
		$view = $this->getView('comment');
		$view->setModel($model,true);
		//$view->setLayout('default_comment');
		$view->setLayout('default');
		$view->displayUComment();
	}
	
	function editComment() {
		$comment_id = &JRequest::getVar('id');
		redirectIfIsNotInt($comment_id);
		$model 	= &$this->getModel('comment');
		$model->setCommentId($comment_id);
		$view	= $this->getView('comment');
		$view->setModel($model,true);
		$view->setLayout('default_edit');
		$view->dispeditComment();
	}
	
	function updateComment() {
		$comment_id 		= &JRequest::getVar('id');
		
		$comment_content 	= &JRequest::getVar('content');
		$input['comment_id'] 		= $comment_id;
		$input['comment_content'] 	= $comment_content;
		
		$model 	= &$this->getModel('comment');
		echo $model->updateComment($input);
		
	}
	
	public function setUser() {
		$this->user = &JFactory::getUser();
		if ($this->user->usertype == "Guest") $this->user->id = 0;
	}
	
	public function addComment() {
		$idea_id = &JRequest::getVar('idea_id');
		$comment = &JRequest::getVar('comment');
		$comment = str_replace( "[br/]", "<br/>", $comment);
		$forum_id  = &JRequest::getVar('forum_id');
		if ( !$comment || !$idea_id || !$forum_id ) {
			$res = new stdClass();
			$res -> error 	= 1;
			$res -> msg 	= JText::_("ERROR_ON_ADD_COMMENT");
			echo json_encode( $res );
			return;
		}
		
		$anonymous 	= &JRequest::getVar('anonymous',0);
//		echo $anonymous;
//		
//		echo '<pre>'.print_r( $_REQUEST, true ).'</pre>';
		$input['idea_id'] 		= $idea_id;
		$input['user_id'] 		= (!$anonymous)? $this->user->id : 0 ;
		$input['forum_id'] 		= $forum_id;
		$input['comment'] 		= $comment;
		$input['createdate'] 	= Handy::getDateTime();
//		echo '<pre>'.print_r($input, true).'</pre>';exit();
		$model = $this->getModel('comment');
		$model->setIdeaId($idea_id);
		$model->addComment($input);
		
		
		$view = $this->getView('comment');	
		$view->setModel($model,true);
		$view->displayComments();
	}
	public function displayComments()
	{
		$view = $this->getView('comment');	
		$model = &$this->getModel("comment")	;
		$view->setModel($model,true);
		$view->displayComments();
	}
}

?>
