<?php
/**
 * @version		$Id: default.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.controller');
require_once (JPATH_COMPONENT.DS.'classes'.DS.'class.output.php');
require_once (JPATH_COMPONENT.DS.'helper'.DS.'forum.php');

class ControllerDefault extends JController {

	function __construct() {
		parent::__construct();
	}
	
	function display() {
		$forum_id	= &JRequest::getVar('forumId');

		redirectIfIsNotInt($forum_id);
		
		if ($forum_id == 0 or !$forum_id){
			$forum_default = Forum::getForumDefault(); 
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		}

		$model = &$this->getModel('default');
		$model->setForumId($forum_id);

#TODO: lay danh sach cac idea khong su dung ajax
		$model_idea = &$this->getModel('idea');
		$model_idea->setForumId($forum_id);
		$tab = &JRequest::getVar( 'tab','top' );
		switch ( $tab ) {
			case 'hot':
				$page 		= JRequest::getVar('page',1,'','int');
				$limitstart = 10 * ($page-1);
				$limit 		= JRequest::getVar('limit',10,'','int');
				$model_idea -> setLimit( $limit );
				$model_idea -> setLimitstart( $limitstart );
				$model_idea -> setForumId( $forum_id );
				
				break;
			case 'top':
			default:
				$page 		= JRequest::getVar('page',1,'','int');
				$limitstart = 10 * ($page-1);
				$limit 		= JRequest::getVar('limit',10,'','int');
				$model_idea -> setLimit( $limit );
				$model_idea -> setLimitstart( $limitstart );
				$model_idea -> setForumId( $forum_id );
				
				break;
		}
#END lay cac ideas
		$view = &$this->getView('default');
		$view->setModel($model,true);
		$view->setModel($model_idea,false);
		$view->display();
	}
	
	function getTabs() {
		$forum_id	= &JRequest::getVar('forumId');
		redirectIfIsNotInt($forum_id);
		if ($forum_id == 0 or !$forum_id){
			$forum_default = Forum::getForumDefault(); 
			$forum_id = &JRequest::getVar('id',$forum_default->id);
		} 
		$model = &$this->getModel('default');
		$model->setForumId($forum_id);
		
		$view = &$this->getView('default');
		
		$view->setModel($model,true);
		$view->setLayout('default_tabs');
		$view->dispTabs();
	}
	function autoComplete(){
		$key_word	= &JRequest::getVar('key_search'); 
		$input['key_search']	= $key_word;
		$model = $this->getModel('default');
		$model->getAutoComplete($input);
		exit();
	}
	
	function getComment() {
		$idea_id = &JRequest::getVar('idea_id');
		redirectIfIsNotInt($idea_id);
		$input['idea_id'] = $idea_id;
		
		$model = $this->getModel('comment');
		$model->setIdeaId($idea_id);
		
		$view = $this->getView('default');		
		$view->setModel($model,true);
		$view->dispComment();
	}
	function changePage() {
		global $mainframe;		
		//$mainframe->redirect("index.php?option=com_obsuggest&forumId=".$_POST['forumId']);
		$mainframe->redirect(JRoute::_("index.php?option=com_obsuggest&forumId=".JRequest::getVar('forumId')));
	}
		
}

?>