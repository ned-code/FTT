<?php
/**
 * @version		$Id: view.php 238 2011-03-25 12:17:30Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

jimport('joomla.application.component.view');

class ViewActivity extends JView {
	function __construct() {
		parent::__construct();
	}
	
	function display($tmp = null) {
		// status of idea
		$status = $this->get('Status');
		
		// list of ideas
		$ideas = $this->get('Ideas');
		
		// list of comments
		$comments = $this->get('Comments');		
		
		// num of ideas
		$sumideas = $this->get('NumIdeas');
		
		//  num of comments
		$sumcomments = $this->get('NumComments');
		
		// some infomation...
		$output = $this->get('Output');
		
		// is not search
		$search = 0;
		
		// get cuurent page
		$page = JRequest::getInt("page", 1);
		
		// model instance
		$model = &$this->getModel('activity');
		
		$user = $model->getUser($model->user_id);			
		if(!$user)
		{
			global $mainframe, $option;
			$mainframe->redirect(JRoute::_("index.php?option=$option"));
			
		}
		if($sumideas>10)
		{
			$pagination = new Paging($sumideas, $page, 10, ("index.php?option=com_obsuggest&controller=activity&task=displayIdeas&format=raw&user_id=" . $model->user_id));		
			$pagination = $pagination->getPagination();
		}
		else 
			$pagination = "";
		
		if($sumcomments>10)	
		{
			$pageComment = new Paging($sumcomments, $page, 10, "index.php?option=com_obsuggest&controller=activity&format=raw&task=displayComments&user_id=" . $model->user_id);		
			$pageComment =  $pageComment->getPagination();
		}
		else $pageComment = "";
		
		// assign some variable
		
		$this->assignRef("pagination", $pagination); // pagination ideas
				
		$this->assignRef("pageComment", $pageComment); // pagination comments
		$this->assign('datetime_format', $model->getDatetimeConfig());
		$this->assignRef('status',$status);	
		$this->assignRef('total', $sumideas)	;
		$this->assignRef('user',$user);
		$this->assignRef('ideas',$ideas);
	
		$this->assignRef('comments',$comments);
		$this->assignRef('search',$serch);
		$this->assignRef('sumideas',$sumideas);
		$this->assignRef('sumcomments',$sumcomments);
		
		$this->assignRef('output',$output);
		
		parent::display($tmp);
	}
	
	/**
	 * we use AJAX to call this function and get the content of idea and paging it!
	 *
	 */
	function displayIdeas()
	{
		// idea status
		$status = $this->get('Status');
		
		// list of ideas
		$ideas = $this->get('Ideas');
	
		// num of idea
		$sumideas = $this->get('NumIdeas');

		// some infomation
		$output = $this->get('Output');
		
		// is not search
		$search = 0;
		
		// get current page
		$page = JRequest::getInt("page", 1);
		
		// model instance
		$model = &$this->getModel('activity');
		
		$user = $model->getUser($model->user_id);
		if(!$user)
		{
			global $mainframe, $option;
			$mainframe->redirect(JRoute::_("index.php?option=$option"));
			
		}
		// add the path template to search
		$this->_addPath( 'template', JPATH_COMPONENT.DS.'views'.DS. 'idea'.DS.'tmpl' ); 		
		if($sumideas>10)
		{
			$pageIdea = new Paging($sumideas, $page, 10, "index.php?option=com_obsuggest&controller=activity&format=raw&task=displayIdeas&user_id=" . $model->user_id);		
			$pageIdea = $pageIdea->getPagination();
		}else
		{
			$pageIdea = "";
		}						
		// assign some variable
		$this->assignRef("pagination", $pageIdea);
		$this->assignRef('status',$status);	
		$this->assignRef('total', $sumideas)	;
		$this->assignRef('user',$user);
		$this->assignRef('ideas',$ideas);		
		$this->assignRef('search',$serch);
		$this->assignRef('sumideas',$sumideas);		
		$this->assignRef('output',$output);
		
		// only display content of the ideas
		parent::display("ideas");
	}
	
	/**
	 * we use AJAX to call this function and get the content of comment and paging it!
	 *
	 */
	function displayComments($tmp = null) {
		
		// list comments
		$comments = $this->get('Comments');		

		// sum of comments
		$sumcomments = $this->get('NumComments');
		
		// sum infomation
		$output = $this->get('Output');
		
		// not is search
		$search = 0;
		
		$model = &$this->getModel('activity');
		$user = $model->getUser($model->user_id);			
		if(!$user)
		{
			global $mainframe, $option;
			$mainframe->redirect(JRoute::_("index.php?option=$option"));
			
		}
		$page = JRequest::getVar("page", 1)	;
		if($sumcomments>10)
		{
			$pageComment = new Paging($sumcomments, $page, 10, "index.php?option=com_obsuggest&controller=activity&format=raw&task=displayComments&user_id=" . $model->user_id);		
			$pageComment =  $pageComment->getPagination();
		}
		else
		{
			$pageComment = "";
		}
		// assign some variables
		$this->assignRef('status',		$status);	
		$this->assignRef('user',		$user);
		$this->assignRef('comments',	$comments);
		$this->assignRef('search',		$serch);
		$this->assignRef('sumcomments',	$sumcomments);	
		$this->assignRef('output',		$output);
		$this->assignRef("pageComment", $pageComment);
		
		$this->_addPath( 'template', JPATH_COMPONENT.DS.'views'.DS. 'comment'.DS.'tmpl' ); 
		$this->loadTemplate("comment");

		// only need content of the comment
		parent::display("comment_activity");
	}
	function getUser($_user_id) {
		$model = $this->getModel('activity');
		return $model->getUser($_user_id);
	}
	public function getUserVoteIdea($_idea_id) {
		$model = $this->getModel('activity');
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
				echo '<a href="'.JRoute::_('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id).'" id="title'.$idea->id.'">'.$idea->title.'</a>';
                	
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
            		$content = htmlspecialchars_decode($idea->content); // convert quote to html tag
            		$content = strip_tags($content); // remove html tag
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
					echo '<a href="'.JRoute::_('index.php?option=com_obsuggest&controller=activity&user_id='.$idea->user_id).'">'.$user->username.'</a>';
	            } else { 
					echo '<a href="javascript:void(0)">'.JText::_("anonymous ").'</a>';
				}
				
                echo '';
				break;
			case 'DATECREATED':
				echo JText::_("Created on")." ".date($this->datetime_format, strtotime($idea->createdate));
				break;	
			case 'BOXVOTE':
				$listVote = Idea::getListVotes();
				$user_vote = $this->getUserVoteIdea($idea->id);
				$can_vote = (($this->output->permission->vote_idea_a == 1) || 
									(($this->output->permission->vote_idea_o == 1) && ($this->output->user->id == $idea->user_id))) ;
				?>
				<div class="box-vote">
                	<div class="sum" id="sum_vote_<?php echo $idea->id?>" style="text-align:center;">
						
						<?php 
                            echo Number::createNumber($idea->votes);
                        ?>                        	
				
                    </div>    
                    <div class="uservote" style="text-align:center;">
                    	<div style="width:55px;height:20px;margin:0 auto;">
						<?php 
						//$user_vote = $this->getUserVoteIdea($idea->id);
                        //$can_vote = (($this->output->permission->vote_idea_a == 1) || 
						//			(($this->output->permission->vote_idea_o == 1) && ($this->output->user->id == $idea->user_id))) ;
						?>                          
                            <div style="float:left;width:20px;height:20px;text-align:left;cursor:pointer;" <?php if($can_vote){?>onclick="Vote.up('<?php echo $idea->id?>')"<?php }?>>
                            <?php if($can_vote){?>
                            	<div id="left_number_<?php echo $idea->id?>" class="pre-number<?php if($user_vote==0) echo " is-min";?>"></div>
                            <?php }else{?> 
                            	<div class="pre-number disabled"></div>
                            <?php }?>    
                            </div>
                            <div id="user_vote_<?php echo $idea->id?>" class="number" style="width:15px;height:20px;overflow:hidden;float:left;">
                        	<?php 
                    		$str = "";
                        	?>
                            	
                            	<?php                            	
                   				
								$vote_value = 0;
								$i=0;
								$end_vote = 0;
								foreach ($listVote as $objVote) {
									if($objVote->vote_value!=$user_vote)
									{
										$i++;										
									}
									else 
										$vote_value = $i;
									$end_vote = $objVote->vote_value;	
									$str .= '<span class="num'.$objVote->vote_value.'" >';
									$str .= '<input id="vote_value_'.$idea->id."_".$objVote->vote_value.'" type="hidden" value="'.$objVote->vote_value.'">';
									$str .= '</span>';								
								}
								$str = '<div style="margin-top:-'.($vote_value*20).'px;">' . $str . '</div>';
								echo $str;
								?>                                    
                                
                            </div>
                            <div style="float:left;width:20px;height:20px;text-align:right;cursor:pointer;" <?php if($can_vote){ ?>onclick="Vote.down('<?php echo $idea->id?>')"<?php }?>>
                            <?php if($can_vote){?> 
                            	<div id="next_number_<?php echo $idea->id?>" class="next-number<?php if($user_vote==$end_vote) echo " is-max";?>"></div>
							<?php }else{?>
                            	<div class="next-number disabled"></div>
                            <?php }?>    
                            </div>
                        </div>
      
                    </div>
                </div>
				<?php 
				break;
			case 'COMMENTCOUNT':
            	$idea_comment = Idea::getComments($idea->id);
	            ?>             
	            	<?php echo $idea_comment?>
	            	<a class="comment_text" href="<?php echo JRoute::_('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id)?>"> comment(s)</a>	            	          
				<?php 
				break;
			case 'READMORE':
				$content = htmlspecialchars_decode($idea->content); // convert quote to html tag
        		$content = strip_tags($content); // remove html tag
        		$content = Idea::cutString($content, 100);
				if (isset($content['overflow']) && JRequest::getString('controller')!='comment') {
	            ?>
	            	<a class="read-more" href="index.php?option=com_obsuggest&controller=comment&idea_id=<?php echo $idea->id?>">Read more</a>	            	
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
