<?php
/**
 * @version		$Id: view.php 294 2011-04-02 08:47:19Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.view');

class ViewDefault extends JView {
	function __construct() {
		parent::__construct();
	}
	
	function display($tmp = null) {
		$status = $this->get('Status');
		$output = $this->get('Output');
//		echo '<pre>' . print_r( $output, true ) . '</pre>';
		$model 		= &$this->getModel('default');
		$forum_id 	= $model->getForumId();
		$gconfig 	= $this->get('gconfig');

		#TODO: load script và style cho vote box
		$document 		= &JFactory::getDocument();
		$votebox_layout = isset($gconfig['votebox']->value) ? $gconfig['votebox']->value : 'default.php';
		$cssfile = JPATH_COMPONENT_SITE.DS.'vote_boxs'.DS.substr($votebox_layout, 0, -4).'.css';
		$jsfile = JPATH_COMPONENT_SITE.DS.'vote_boxs'.DS.substr($votebox_layout, 0, -4).'.js';
		if(JFile::exists($cssfile)) {
			$document->addStyleSheet('components/com_obsuggest/vote_boxs/'.substr($votebox_layout, 0, -4).'.css');
		}
		if(JFile::exists($jsfile)) {
			$document->addScript('components/com_obsuggest/vote_boxs/'.substr($votebox_layout, 0, -4).'.js');
		}
		
		$this->assignRef('gconfig',$gconfig);
		
		$model_idea = &$this->getModel('idea');
		$top_ideas = $model_idea->getTopIdeas();
		$limit = &JRequest::getVar('limit', 5);
		$limitstart = &JRequest::getVar('start', 0);
		$model_idea->setLimitstart($limitstart);
		$model_idea->setLimit($limit);
		$tab = &JRequest::getVar( 'tab','top' );
		#echo '<h1>FORUM ID: '.$forum_id.'</h1>';

		switch ($tab) {
			case 'new':
//				$model 		= $model_idea->getIdea();
				$forum_id 		= $model_idea->getForumId();
				$idea_output 	= $model_idea->getOutput();
				$ideas 			= $model_idea->getNewIdeas();
				$status 		= $model_idea->getStatus();
				$total = $model_idea->getNewIdeasCount();
				$this -> assign( 'datetime_format', $model_idea->getDatetimeConfig() );
				$cur_page = JRequest::getInt("page", 1);

				if($total>10) {
					$pagin = new JPagination($total, $limitstart, $limit);
					$pagination = $pagin->getListFooter();
					$pagination = '<div class="pagination">'
							.'<p class="counter">'.$pagin->getPagesCounter().'</p>'
							.$pagin->getPagesLinks().'</div>';
				} else {
					$pagination = "";
				}
				$this->assignRef('ideas',$ideas);
				$this->assignRef('idea_output',$idea_output);
				$this->assignRef('forum_id',$forum_id);
				$this->assignRef('status',$status);
				$search = 0;
				$this->assignRef('search',$search);	
				$this->assignRef("pagination", $pagination);
				break;

			case 'hot':
				$forum_id 		= $model_idea->getForumId();
				$idea_output 	= $model_idea->getOutput();
				$status 		= $model_idea->getStatus();
				$ideas 			= $model_idea->getHotIdeas();
				$total 			= $model_idea->getHotIdeaCount();

				$cur_page 	= JRequest::getInt("page", 1);

				if($total) {
					$pagin = new JPagination($total, $limitstart, $limit);
					$pagination = $pagin->getListFooter();
					$pagination = '<div class="pagination">'
							.'<p class="counter">'.$pagin->getPagesCounter().'</p>'
							.$pagin->getPagesLinks().'</div>';
				}
				else 
				{
					$pagination = "";
				}
				$this->assignRef('ideas',$ideas);
				$this->assignRef('forum_id',$forum_id);
				$this->assignRef('status',$status);
				$this->assignRef('idea_output',$idea_output);
				$this->assign('datetime_format', $model_idea->getDatetimeConfig());
				$this->assignRef('pagination', $pagination);
				break;

			case 'top':
			default:
				$idea_output 	= $model_idea->getOutput();
//				echo '<pre>' . print_r( $idea_output, true ) . '</pre>';
				
				$forum_id 		= $model_idea->getForumId();
				$ideas 			= $model_idea->getTopIdeas();
//				echo '<pre>' . print_r( $ideas, true ) . '</pre>';
				$status 		= $model_idea->getStatus();
				$total 			= $model_idea->topIdeaCount();
				$cur_page 		= JRequest::getVar( "page", 1 );
				$this->assign( 'datetime_format', $model_idea->getDatetimeConfig() );

				if($total) {
					$pagin = new JPagination($total, $limitstart, $limit);
					$pagination = $pagin->getListFooter();
					$pagination = '<div class="pagination">'
							.'<p class="counter">'.$pagin->getPagesCounter().'</p>'
							.$pagin->getPagesLinks().'</div>';
				} else {
					$pagination = "";
				}

				$this->assignRef( 'total', $total);
				$this->assignRef( 'ideas',	$ideas);
				$this->assignRef( 'forum_id',	$forum_id);
				$this->assignRef( 'status',	$status);
				$this->assignRef( 'idea_output', $idea_output );	
				$search = 0;
				$this->assignRef('search',$search);	
				$this->assignRef('pagination', $pagination);
				break;

		}
		
		$user = &JFactory::getUser();
		$user_id = $user->id;
		$remainingpoint = Forum::getRemainingPoint($forum_id, $user_id);

		$this->assignRef( 'remainingpoint', $remainingpoint );
		$this->assignRef( 'top_ideas', $top_ideas );
		$this->assignRef( 'forum_id', $forum_id );
		$this->assignRef( 'status', $status );
		$this->assignRef( 'output', $output );
		parent::display( $tmp );
	}
	function dispComment($tmp = null) {
		$status = $this->get('Status');
		$idea = $this->get('Idea');
		$page = $this->get('Page');
		$comments = $this->get('Comment');
		
		$page = 1;
		$this->assign('SearchCount',100);
		$this->assignRef('status',$status);
		$this->assignRef('page',$page);
		$this->assignRef('idea',$idea);
		$this->assignRef('comment',$comments);
			
		parent::display($tmp);
	}
	
	function dispTabs($tmp = null) {	
		$model = &$this->getModel('default');
		$forum_id = $model->getForumId();
		$this->assignRef('forum_id',$forum_id);	
		parent::display($tmp);
	}
	function getKeySearch(){
		return $this->output->forum->example;	
	}
}
?>
