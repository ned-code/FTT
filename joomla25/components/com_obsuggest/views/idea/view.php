<?php
/**
 * @version		$Id: view.php 241 2011-03-26 03:20:03Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.view');

class ViewIdea extends JView {
	private $title = "";
	function __construct() {
		parent::__construct();
	}
	
	function display($tmp = null) {
		$ideas = $this->get('Ideas');
		$model = &$this->getModel('idea');
		$forum_id = $model->getForumId();
		$status = $this->get('Status');
		$output = $this->get('Output');
		$idea_title = JRequest::getString("idea_title");
		
		$datetime_format = $model->getDatetimeConfig();
		$this->assignRef("idea_title", $idea_title);
		$this->assignRef('ideas',$ideas);
		$this->assignRef('forum_id',$forum_id);
		$this->assignRef('status',$status);
		$this->assignRef('output',$output);
		
		$search = 0;
		$this->assignRef('search',$search);
		parent::display($tmp);
	}
	
	function dispIdeaWithUserid($tmp = null){ 
		$model = &$this->getModel('idea');
		$ideas = $model->getIdeaWithUserid();
		$output = $this->get('Output');
		$status = $this->get('Status');
		
		$this->assignRef('output',$output);	
		$search = 0;
		$this->assignRef('search',$search);
		$this->assignRef('status',$status);
		$this->assignRef('ideas',$ideas);		
		parent::display($tmp);
	}
	
	function dispIdea($tmp = null) {
		$idea = $this->get('Idea');
		$idea->content = str_replace("\"",'\\"',$idea->content);
		$idea->content = str_replace(chr(13),'\n',$idea->content);
		$idea->title = str_replace("\"",'\\"',$idea->title);
		$status = $this->get('Status');
		
		$this->assignRef('status',$status);
		$this->assignRef('idea',$idea);		
		parent::display($tmp);
	}
	
	
	function dispIdeaWithStatus($tmp = null) {
		$model = &$this->getModel('idea');
		$output = $this->get('Output');
		$forum_id = $model->getForumId();
		$ideas = $model->getListIdea();
		$status = $this->get('Status');
		
		$this->assignRef('ideas',$ideas);
		$this->assignRef('forum_id',$forum_id);
		$this->assignRef('status',$status);
		$this->assignRef('output',$output);	
		$this->assign('datetime_format', $model->getDatetimeConfig());
		$search = 0;
		$this->assignRef('search',$search);	
		parent::display($tmp);
	}
	
	function dispTopIdea($tmp = null)
	{		
		$model = &$this->getModel( 'idea' );
		$output = $this->get( 'Output' );
		$forum_id = $model->getForumId();
		$ideas = $model->getTopIdeas();
		$status = $this->get( 'Status' );
		$total = $model -> topIdeaCount();
		$cur_page = JRequest::getVar( "page", 1 );
		$this->assign( 'datetime_format', $model->getDatetimeConfig() );
		if($total>10)
		{
			$pagination = new Paging($total, $cur_page, 10, "index.php?option=com_obsuggest&controller=idea&task=topIdea&forum=".$forum_id."&format=raw");
			$pagination = $pagination->getPagination();
		}
		else 	
			$pagination = "";
		$this->assignRef('total',$total);
		$this->assignRef('ideas',$ideas);
		$this->assignRef('forum_id',$forum_id);
		$this->assignRef('status',$status);
		$this->assignRef('output',$output);	
		$search = 0;
		$this->assignRef('search',$search);	
		$this->assignRef('pagination', $pagination);
		parent::display($tmp);
	}
	
	function dispHotIdea($tmp = null){
		$model = &$this->getModel('idea');
		$output = $this->get('Output');
		$forum_id = $model->getForumId();
		$ideas = $model->getHotIdeas();
		$status = $this->get('Status');
		
		$total = $model->getHotIdeaCount();
		
		$cur_page = JRequest::getInt("page", 1);
		
		if($total>10)
		{
			$pagination = new Paging($total, $cur_page, 10, "index.php?option=com_obsuggest&controller=idea&task=hotIdea&forum=".$forum_id."&format=raw");
			$pagination = $pagination->getPagination();
		}
		else 
		{
			$pagination = "";
		}
		$this->assignRef('ideas',$ideas);
		$this->assignRef('forum_id',$forum_id);
		$this->assignRef('status',$status);
		$this->assignRef('output',$output);	
		$this->assign('datetime_format', $model->getDatetimeConfig());
		$search = 0;
		$this->assignRef('search',$search);	
		$this->assignRef("pagination", $pagination);
		parent::display($tmp);
	}
	
	function dispIdeaById($tmp = null){
		$model = &$this->getModel('idea');
		$output = $this->get('Output');
		$forum_id = $model->getForumId();
		$ideas = $model->getIdeaById();
		$status = $this->get('Status');
		
		$this->assignRef('ideas',$ideas);
		$this->assignRef('forum_id',$forum_id);
		$this->assignRef('status',$status);
		$this->assignRef('output',$output);	
		$search = 0;
		$this->assignRef('search',$search);	
		parent::display($tmp);
	}
	
	function dispNewIdea($tmp = null){
		$model = &$this->getModel('idea');
		$output = $this->get('Output');
		$forum_id = $model->getForumId();
		$ideas = $model->getNewIdeas();
		$status = $this->get('Status');
		
		$total = $model->getNewIdeasCount();
		$this->assign('datetime_format', $model->getDatetimeConfig());
		$cur_page = JRequest::getInt("page", 1);
		
		if($total>10)
		{
			$pagination = new Paging($total, $cur_page, 10, "index.php?option=com_obsuggest&controller=idea&task=newIdea&forum=".$forum_id."&format=raw");
			$pagination = $pagination->getPagination();
		}else $pagination = "";
		$this->assignRef('ideas',$ideas);
		$this->assignRef('forum_id',$forum_id);
		$this->assignRef('status',$status);
		$this->assignRef('output',$output);	
		$search = 0;
		$this->assignRef('search',$search);	
		$this->assignRef("pagination", $pagination);
		parent::display($tmp);
	}
	
	function dispSearch($tmp = null) {	
		$model = &$this->getModel('idea');
		$forum_id = $model->getForumId();
		
		$ideas = $this->get('Ideas');
		$status = $this->get('Status');
		$output = $this->get('Output');

		$gconfig 	= $this->get('gconfig');
		$this->assignRef('gconfig', $gconfig);
		$this->assignRef('total', $model->total);
		$this->assignRef('ideas',$ideas);
		$this->assignRef('status',$status);
		$this->assignRef('forum_id',$forum_id);
		$this->assignRef('output',$output);
		$search = 1;
		$page = JRequest::getInt("page", 1);
		
		if($model->total>10)
		{
			$pageIdea = new Paging($model->total, $page, 10, "index.php?option=com_obsuggest&controller=idea&task=search&forum=".$forum_id."&key=" .JRequest::getVar("key")."&format=raw");
			$pageIdea = $pageIdea->getPagination();
		}
		else $pageIdea = "";
		$this->assignRef("pagination", $pageIdea);
		
		$this->assignRef("keyword", JRequest::getString("key"));
		$this->assignRef('search',$search);
		parent::display($tmp);
	}	
	function getUser($_user_id) {
		$model = &$this->getModel('idea');
		return $model->getUser($_user_id);
	}
	public function getUserVoteIdea($_idea_id) {
		$model = $this->getModel('idea');
		$rs = $model->getUserVoteIdea($_idea_id);
		if ($rs != NULL)
			return $rs->vote;
		else return 0;
	}
	
	function dispAllIdeas($tmp = null) {	
		$model = &$this->getModel('idea');
		
		$ideas = $this->get('AllIdeas');
		$status = $this->get('Status');
		$output = $this->get('Output');
		
		//$this->assignRef('total', $model->total);
		$this->assignRef('ideas',$ideas);
		$this->assignRef('status',$status);
		$this->assignRef('forum_id',$forum_id);
		$this->assignRef('output',$output);
		$search = 0;
		
		$this->assignRef('search',$search);
		parent::display($tmp);
	}	
	function displayCountIdeas()
	{
		$model = &$this->getModel("idea");
		$count_ideas = $model->countIdeas(JRequest::getVar("user_id"));
		$count_comments = $model->countComments(JRequest::getVar("user_id"));
		
		$this->assignRef("count_ideas", $count_ideas);
		$this->assignRef("count_comments", $count_comments);
		parent::display("count_ideas");
	}
	
	function canResponse(){
		return (($this->output->permission->response_idea_a == 1) || (($this->output->permission->response_idea_o == 1) && ($this->output->user->id == $idea->user_id)));	
	}
	function getIdeaId(){
		$idea = $this->ideas[$this->current_idea];
		return $idea->id;
	}
	function displayBox($box){
		$model = &$this->getModel('idea');
		$idea = $this->ideas[$this->current_idea];	
		$user = $this->getUser($idea->user_id); ;	
		switch ($box){
			case 'TITLE':
				echo '<h2><a href="'.JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id)).'" id="title'.$idea->id.'">'.$idea->title.'</a></h2>';
//				echo '<a href="'.JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id)).'" id="title'.$idea->id.'">'.$idea->title.'</a>';

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
					if(JRequest::getString("controller")=='comment')
					{
						echo $content;
					}
					else {
						$content = Idea::cutString($content, 100);
						echo $content['string'];
					}
				echo '</div>';
				break;
			case 'USERNAME':
				echo '
					
				   	'.JText::_("by ");					
				if ($user->username != "anonymous") {
					echo '<a href="'.JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=activity&user_id='.$idea->user_id)).'">'.$user->username.'</a>';
				} else { 
					echo '<a href="javascript:void(0)">'.JText::_("anonymous ").'</a>';
				}
				
				echo '';
				break;
			case 'DATECREATED':
				echo JText::_("Created on")." ".date($model->getDatetimeConfig(), strtotime($idea->createdate));
				break;	
			case 'BOXVOTE':
				#new vote box
				$votebox = isset($this->gconfig['votebox']->value) ? $this->gconfig['votebox']->value : 'default.php' ;
				require JPATH_COMPONENT_SITE.DS.'vote_boxs'.DS.$votebox;
				break;
			case 'COMMENTCOUNT':
				$idea_comment = Idea::getComments($idea->id);
				?>			 
					<font class='comment_number' id='comment_count'><?php echo $idea_comment?></font>
					<a class="comment_text" href="<?php echo JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id))?>"> comment(s)</a>							  
				<?php 
				break;
			case 'READMORE':
				$content = htmlspecialchars_decode($idea->content); // convert quote to html tag
				$content = strip_tags($content); // remove html tag
				$content = Idea::cutString($content, 100);
				if (isset($content['overflow']) && JRequest::getString('controller')!='comment') {
				?>
					<a class="read-more" href="<?php echo JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id));?>">Read more</a>					
				<?php 
				}
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
						//$edit = '<option value="onedit(\''.$idea->id.'\')">'.JText::_("Edit").'</option>';//  onClick="onedit(<?php echo $idea->id; 
						$edit='<input type="button" value="'.JText::_("Edit").'" onclick="onedit(\''.$idea->id.'\')">';
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
						$delete='<input type="button" value="'.JText::_("Delete").'" onclick="ondel(\''.$idea->id.'\')">';
					}
				?>
				<?php 
					if( $edit!='' || $delete != '')
					{
				?>	
					<!--<input type="button" value="Action" onClick="eval(document.getElementById('sl_<?php echo $idea->id?>').value)" />
					<select id="sl_<?php echo $idea->id?>">-->
						<?php echo $edit?>
						<?php echo $delete?>
					<!--</select>-->
				<?php 
					}
				?> 
				<?php 
				break;
			case 'CHANGESTATUS'	:
				?>
				<?php 
				if (
					($this->output->permission->change_status_a == 1) || 
					(($this->output->permission->change_status_o == 1) && ($this->output->user->id == $idea->user_id))
				) 
				{
				?>
					Change status
					<select onchange="updateIdeaStatus(<?php echo $idea->id?>,this.value)" >
						<option selected="selected" value="0">Start / Set Close</option>
						<?php 
						foreach ($this->status as $parent ) {
							if($parent->parent_id==-1)
							{
								echo '<optgroup label="'.$parent->title.'">';
								foreach($this->status as $child)
								{		
									if($child->parent_id != $parent->id) continue;																										
									if ($child->id == $idea->status_id) {
										echo '<option value="'.$child->id.'"  selected="selected" class="status_"'.str_replace(" ", "_",strtolower($idea->status)).'">' . $child->title . '</option>';									
									}		
									else
									{
										echo '<option value="'.$child->id.'">' . $child->title . '</option>';
									}		
								}						
								echo '</optgroup>';
							}													
						}
						?>
					</select>
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
					<div id="rps-title<?php echo $idea->id; ?>" class="rs_title"><?php echo JText::_("admin response")?></div>
					<div id="rps-content<?php echo $idea->id; ?>" class="rs_content"><?php echo $idea->response;?></div>
				<?php 			
					if ($can_response) 
					{
					?> 
						<a  class="rs_edit" href="javascript:void(0);" onClick="addRepose('rps<?php echo $idea->id; ?>')">- <?php echo JText::_("edit")?></a>
					<?php 
					}
					?>
					
				<?php
				} else {
				?>
					
				<?php 
				if ($can_response) {?>
					<a href="javascript:addRepose('rps<?php echo $idea->id; ?>')" class="rs_add"><?php echo JText::_("add Response")?></a> 
				<?php }?>
				
					
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