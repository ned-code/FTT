<?php
/**
 * @version		$Id: view.php 270 2011-03-30 07:19:25Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.view');

class ViewComment extends JView {
	function __construct() {
		parent::__construct();
	}
	
	function display($tmp = null) {
		$ideas 		= $this->get( 'Idea' );
		$status 	= $this->get( 'Status' );
		$comments 	= $this->get( 'Comments' );
		$idea_id 	= $this->get( 'IdeaId' );
		$forum_id	= $this->get( 'ForumId' );
		$forum_info = $this->get( 'ForumInfo' );
		$gconfig 	= $this->get( 'gconfig' );
		$output 	= $this->get( 'Output' );
		
		$output->permission->delete_idea_a = 0;
		$output->permission->delete_idea_o = 0;
		
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
		
		$this->assignRef( 'ideas', 		$ideas );
		$this->assignRef( 'forum_info', $forum_info );
		$this->assignRef( 'forum_id', 	$forum_id );
		$this->assignRef( 'status', 	$status );
		$this->assignRef( 'comments', 	$comments );
		$this->assignRef( 'idea_id', 	$idea_id );
		$this->assignRef( 'output', 	$output );
		$this->assignRef( 'gconfig', 	$gconfig );
		
		$model = & $this->getModel('comment');
		$this->assign('datetime_format', $model->getDatetimeConfig());
		$count_comment = $model->getCountComments($idea_id);
		
		$this->assignRef('sumcomments', $count_comment);
		
		$search = 0;
		
		$page = JRequest::getInt("page", 1);
		if($count_comment>10)
		{
			$pageComment = new Paging($count_comment, $page,10, JRoute::_("index.php?option=com_obsuggest&controller=comment&format=raw&task=displayComments&idea_id=$idea_id"));
			$pageComment = $pageComment->getPagination();
		}else 
		{
			$pageComment = "";
		}
		$pagination = "";
		
		# set Remaining point
		$user = &JFactory::getUser();
		$user_id = $user->id;
		$remainingpoint = Forum::getRemainingPoint($forum_id, $user_id);

		$this->assignRef( 'remainingpoint', $remainingpoint );
		$this->assignRef("pagination", $pagination);
		$this->assignRef("pageComment", $pageComment);
		$this->assignRef('search',$search);
		parent::display($tmp);
	}
	function displayComments($tmp = null) {
		$idea_id = JRequest::getVar("idea_id");
		
		$model = &$this->getModel('comment');
		$model->setIdeaId($idea_id);
		$comments = $model->getComments();
		$output = $this->get('Output');
		$output->permission->delete_idea_a = 0;
		$output->permission->delete_idea_o = 0;
		$ideas = $this->get('Idea');		
		
		$this->assignRef('comments',$comments);
		$this->assignRef('output',$output);
		
		//print_r($comments);
		$count_comment = $model->getCountComments($idea_id);
		$page = JRequest::getInt("page", 1);
		
		if($count_comment>10)
		{
			$pageComment = new Paging($count_comment, $page,10, JRoute::_("index.php?option=com_obsuggest&controller=comment&format=raw&task=displayComments&idea_id=$idea_id"));
			$pageComment = $pageComment->getPagination();
		}
		else 
		{
			$pageComment = "";
		}
		$pagination = "";
		$this->assign('datetime_format', $model->getDatetimeConfig());
		$this->assignRef("pagination", $pagination);
		$this->assignRef("pageComment", $pageComment);
			
		parent::display("comment");
	}
	function displayList($tmp = null) {
		$model = &$this->getModel('comment');
		$comments = $model->getComments();
		$output = $this->get('Output');
		$output->permission->delete_idea_a = 0;
		$output->permission->delete_idea_o = 0;
		$ideas = $this->get('Idea');		
		
		$this->assignRef('comments',$comments);
		$this->assignRef('output',$output);
		$this->assignRef('ideas',$ideas);		
		parent::display($tmp);
	}
	
	function displayComment($tmp = null) {
		$model = &$this->getModel('comment');
		$model->delComment();
		$comments = $model->getListComment();
		$output = $this->get('Output');
		$ideas = $this->get('Idea');
		$pagination = "";
		$this->assignRef("pagination", $pagination);
		$this->assignRef('comments',$comments);
		$this->assignRef('output',$output);
		$this->assignRef('ideas',$ideas);
		parent::display($tmp);
	}
	function displayUComment($tmp = null) {
		$model = &$this->getModel('comment');
		$model->delComment();
		$comments = $model->ListCommentWithUserId();
		$this->assignRef('comments',$comments);
		$output = $this->get('Output');
		
		$count_comment = count($comments);
		$this->assignRef("count_comments", $count_comment);
		$this->assignRef('output',$output);
		parent::display('count_comments');
	}
	
	function dispeditComment($tmp = null) {
		$model = &$this->getModel('comment');
		
		$comments = $model->editComment();
		$this->assignRef('comments',$comments);
		parent::display($tmp);
	}
	
	function getUser($_user_id) {
		$model = $this->getModel('comment');
		return $model->getUser($_user_id);
	}
	public function getUserVoteIdea($_idea_id) {
		$model = $this->getModel('comment');
		$rs = $model->getUserVoteIdea($_idea_id);
		if ($rs != NULL)
			return $rs->vote;
		else return 0;
	}
	function canResponse(){
		return (($this->output->permission->response_idea_a == 1) || (($this->output->permission->response_idea_o == 1) && ($this->output->user->id == $idea->user_id)));	
	}
	function getIdeaId(){
		$idea = $this->ideas[$this->current_idea];
		return $idea->id;
	}
	function displayBox($box){
		$idea = $this->ideas[$this->current_idea];	
		$user = $this->getUser($idea->user_id); ;	
		switch ($box){
			case 'TITLE':
//				echo '<a href="'.JRoute::_('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id).'" id="title'.$idea->id.'">'.$idea->title.'</a>';
//				echo '<h2><a href="'.JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id)).'" id="title'.$idea->id.'">'.$idea->title.'</a></h2>';
?>
				<div class="idea_title">
					<h3><a href="<?php echo JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id)); ?>" id="title<?php echo $idea->id; ?>"><?php echo $idea->title; ?></a></h3>
				</div>
<?php 
				break;
			case 'CURRENTSTATUS':
				echo '
					<div id="status_title_' . $idea->id . '" class="' . 
						($idea->status ? str_replace(" ", "_",strtolower($idea->status)) : "none") .'">'.
						($idea->status ? $idea->status : "Status / Set Close").'</div>'.
					'';
				break;
			case 'CONTENT':
				echo '
					<div class="box-content" id="idea'.$idea->id.'">';
					$content = htmlspecialchars_decode($idea->content); 	// convert quote to html tag
					$content = strip_tags($content);						// remove html tag
					if( JRequest::getString("controller") == 'comment' ) {
						echo $content;
					} else {
						$content = Idea::cutString($content, 100);
						echo $content['string'];
					}
				echo '</div>';
				break;
			case 'USERNAME':
				echo JText::_("by").' ';
				if ($user->username != "anonymous") {
				echo '<a href="'.JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=activity&user_id='.$idea->user_id)).'">'.$user->username.'</a>';
					echo '<a href="javascript:void(0)">'.$user->username.'</a>';
				} else { 
					echo '<a href="javascript:void(0)">'.JText::_("anonymous").' </a>';
				}
				echo '';
				break;
			case 'DATECREATED':
				echo JText::_("Created_on")." ".date($this->datetime_format, strtotime($idea->createdate));
				break;	
			case 'BOXVOTE':
				$votebox = isset( $this->gconfig['votebox']->value ) ? $this->gconfig['votebox']->value : 'default.php' ;
				require JPATH_COMPONENT_SITE.DS.'vote_boxs'.DS.$votebox;

				break;
			case 'COMMENTCOUNT':
				$idea_comment = Idea::getComments($idea->id); ?>
				<a class="comment_text" href="<?php echo JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id))?>"><span id='comment_count_<?php echo $idea->id; ?>'><?php echo $idea_comment?></span> <?php echo JText::_('comments'); ?></a>
				<?php 
				break;
			case 'READMORE':

				$content = htmlspecialchars_decode($idea->content); // convert quote to html tag
				$content = strip_tags($content); // remove html tag
				$content = Idea::cutString($content, 100);
				if (isset($content['overflow']) && JRequest::getString('controller')!='comment') { ?>
					<a class="read-more" href="<?php echo JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id));?>">Read more</a>					
				<?php }
				break;			
			case 'ACTIONS':
				?>
				<a id="frm_Edit_<?php echo $idea->id?>" href="<?php echo JRoute::_('index.php?option=com_obsuggest&controller=idea&task=editIdea&id='.$idea->id.'&format=raw')?>" rel="{handler: 'iframe',size: {x: 418, y: 310}}"></a> 
				<?php 
					$edit = '';
					if (
						($this->output->permission->edit_idea_a == 1) || 
						(($this->output->permission->edit_idea_o == 1) && ($this->output->user->id == $idea->user_id))) 
					{
						//$edit = '<option value="onedit(\''.$idea->id.'\')">'.JText::_("Edit").'</option>';//  onclick="onedit(<?php echo $idea->id; 
						#$edit	= '<input type="button" value="'.JText::_("Edit").'" onclick="onedit(\''.$idea->id.'\')">';
						$edit	= '<img src="'.JURI::base().'/components/com_obsuggest/themes/default/images/edit.png" alt="Edit" width="16" height="16" onclick="onedit(\''.$idea->id.'\')" />';
					}
				?>
				<?php 
					$delete = '';
					if (
						($this->output->permission->delete_idea_a == 1) || 
						(($this->output->permission->delete_idea_o == 1) && ($this->output->user->id == $idea->user_id))
					) 
					{
						//delete = '<option value="ondel(\''.$idea->id.'\')">'.JText::_("Delete").'</option>';
						#$delete	= '<input type="button" value="'.JText::_("Delete").'" onclick="ondel(\''.$idea->id.'\')">';
						$delete	= '<img src="'.JURI::base().'/components/com_obsuggest/themes/default/images/remove.png" alt="Remove" width="16" height="16" onclick="ondel(\''.$idea->id.'\')" />';
					}
				?>
				<?php 
					if( $edit!='' || $delete != '')
					{
				?>	
					<!--<input type="button" value="Action" onclick="eval(document.getElementById('sl_<?php echo $idea->id?>').value)" />
					<select id="sl_<?php echo $idea->id; ?>">-->
						<?php echo $edit; ?>
						<?php echo $delete; ?>
					<!--</select>-->
				<?php 
					}
				?>
				<?php 
				break;
			case 'CHANGESTATUS'	: ?>
				<?php 
				if (($this->output->permission->change_status_a == 1) || (($this->output->permission->change_status_o == 1) && ($this->output->user->id == $idea->user_id))) { ?>
					<div class="idea_changestatus">
						<?php echo JText::_('CHANGE_STATUS'); ?>
						<select onchange="updateIdeaStatus(<?php echo $idea->id?>,this.value)" >
							<option selected="selected" value="0">Start / Set Close</option>
							<?php
							foreach ($this->status as $parent ) {
								if($parent->parent_id==-1)
								{
									echo '<optgroup label="'.$parent->title.'">';
									foreach($this->status as $child) {
										if($child->parent_id != $parent->id) continue;
										if ($child->id == $idea->status_id) {
											echo '<option value="'.$child->id.'"  selected="selected" class="status_"'.str_replace(" ", "_",strtolower($idea->status)).'">' . $child->title . '</option>';									
										}
										else {
											echo '<option value="'.$child->id.'">' . $child->title . '</option>';
										}
									}
									echo '</optgroup>';
								}
							}
							?>
						</select>
					</div>
				
				<?php 
				} else { ?>
					<!-- statuts -->
					<div class="idea_currentstatus">
					<?php 
						echo '
							<div id="status_title_' . $idea->id . '" class="' . 
								($idea->status ? str_replace(" ", "_",strtolower($idea->status)) : "none") .'">'.
								($idea->status ? $idea->status : "Status / Set Close").'</div>'.'';
					?>
					</div>
				<!-- end: statuts -->
				<?php 
				}
				?>
				<?php 
				break;
			case 'ADDRESPONSE':
				break;
			case 'EDITRESPONSE':
				break;	
			case 'RESPONSE':
				?>				
				<input type="hidden" name="_cache_rps_content<?php echo $idea->id; ?>" id="cache_rps_content<?php echo $idea->id; ?>" value="<?php echo $idea->response;?>" />
				<div class="border" id="rps<?php echo $idea->id; ?>">
				<?php
					$can_response = (($this->output->permission->response_idea_a == 1) || (($this->output->permission->response_idea_o == 1) && ($this->output->user->id == $idea->user_id)));			
					if ($idea->response != NULL ) 
					{ 
					?>
						<div id="rps-title<?php echo $idea->id; ?>" class="rs_title">
							<?php
							echo JText::_("ADMIN_RESPONSE");
							if ($can_response) {
							?>
							<a  class="rs_edit" href="javascript:void(0);" onclick="addRepose('rps<?php echo $idea->id; ?>')"><?php echo JText::_("edit")?></a>
							<?php
						}
						?>
						</div>
						<div id="rps-content<?php echo $idea->id; ?>" class="rs_content"><?php echo $idea->response;?></div>
					<?php 			
						
					} elseif ($can_response) { ?>
						<a href="javascript:addRepose('rps<?php echo $idea->id; ?>')" class="rs_add"><?php echo JText::_("add_Response")?></a> 
					<?php 
					} ?>
				</div>
				<?php 
				break;
			default:
				echo "No content";	
		}
	}
}
?>