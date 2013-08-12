<?php
/**
 * @version		$Id: default_tabs.php 272 2011-03-31 04:12:52Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<div id="tab">
	<script type="text/javascript">
	//default.js
	function getForumId(){
		return <?php echo $this->output->forum->id;?>;
	}
	</script>
<div>
<?php
global $mainframe, $option, $obIsJ15;
$script = "\n" . '<script language="javascript">
				window.addEvent("domready", function(){' . "\n";
if(!$obIsJ15){

	$script .= '$$("#myPanel .tab_TOP").getLast().onclick=function(){clickTab("TOP")};' . "\n";
	$script .= '$$("#myPanel .tab_HOT").getLast().onclick=function(){clickTab("HOT")};' . "\n";
	$script .= '$$("#myPanel .tab_NEW").getLast().onclick=function(){clickTab("NEW")};' . "\n";

} else {

	$script .= 'document.getElementById("tab_TOP").onclick=function(){clickTab("TOP")};' . "\n";
	$script .= 'document.getElementById("tab_HOT").onclick=function(){clickTab("HOT")};' . "\n";
	$script .= 'document.getElementById("tab_NEW").onclick=function(){clickTab("NEW")};' . "\n";
}
?>
<div>
<?php $tab = &JRequest::getVar('tab','top'); ?>
<div id="new_tabs">
	<span><?php echo ($tab!='top')?'<a href="'.JRoute::_('index.php?option=com_obsuggest&forumId='.$this->output->forum->id).'">':'<span>'; ?><?php echo JText::_('TOP'); ?><?php echo ($tab!='top')?'</a>':'</span>'; ?></span>
	<span><?php echo ($tab!='hot')?'<a href="'.JRoute::_('index.php?option=com_obsuggest&forumId='.$this->output->forum->id.'&tab=hot').'">':'<span>'; ?><?php echo JText::_('HOT'); ?><?php echo ($tab!='hot')?'</a>':'</span>'; ?></span>
	<span><?php echo ($tab!='new')?'<a href="'.JRoute::_('index.php?option=com_obsuggest&forumId='.$this->output->forum->id.'&tab=new').'">':'<span>'; ?><?php echo JText::_('NEW'); ?><?php echo ($tab!='new')?'</a>':'</span>'; ?></span>
</div>
<div class="clear_both"></div>
<div id="idea_container">
<?php
$ideas 		= $this->ideas;
$model 		= &$this->getModel('idea');
$listVote 	= Idea::getListVotes();

for ( $i = 0; $i<count( $ideas ); $i++ ) {
	$idea = $ideas[$i];
	$user = $model->getUser( $idea->user_id );
?>
	<div id="idea_info_<?php echo $idea->id;?>" class="box-idea">
		<div class="idea_col_left">
			<!-- IDEA BOXVOTE -->
			<?php 
			$votebox = isset($this->gconfig['votebox']->value) ? $this->gconfig['votebox']->value : 'default.php' ;
			require JPATH_COMPONENT_SITE.DS.'vote_boxs'.DS.$votebox;
			?>
			<!-- END: IDEA BOXVOTE -->
		</div>
		<div class="idea_col_right">
			<div class="idea_col_right_fe">
				<!-- title -->
				<div class="idea_title">
					<h3><a href="<?php echo JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id)); ?>" id="title<?php echo $idea->id; ?>"><?php echo $idea->title; ?></a></h3>
				</div>
				<!-- end: title -->
				
				<!-- change status -->
				
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
				<!-- end: change status -->
			</div>
			<!-- idea content -->
			<div class="idea_content">
				<?php 
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
				?>
			</div>
			<!-- end: idea content -->
			
			<div class="idea_readmore">
				<?php 
				$content = htmlspecialchars_decode($idea->content); // convert quote to html tag
				$content = strip_tags($content); // remove html tag
				$content = Idea::cutString($content, 100);
				if (isset($content['overflow']) && JRequest::getString('controller')!='comment') { ?>
					<a class="read-more" href="<?php echo JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id));?>">Read more</a>					
				<?php } ?>
			</div>
		</div> 
		<div class="clear_both"></div>
		<!-- <div style="clear: both;"> -->
			<!-- COMMENT -->
			<div class="idea_comment_count">
			<?php $idea_comment = Idea::getComments($idea->id); ?>
				<a class="comment_text" href="<?php echo JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=comment&idea_id='.$idea->id))?>"><span id='comment_count_<?php echo $idea->id; ?>'><?php echo $idea_comment?></span> <?php echo JText::_('comments'); ?></a>
			</div>
			<div class="idea_info_bar">
				<!-- created date -->
				<div class="idea_datecreated">
				<?php 
					echo JText::_("Created_on")." ".date($this->datetime_format, strtotime($idea->createdate));
				?>
				</div>
				<!-- end: created date -->
				<!-- author -->
				<div class="ideas_username createdby">&nbsp;<?php 
					echo JText::_("by").' ';
					if ($user->username != "anonymous") {
//						echo '<a href="'.JRoute::_(obSuggestHelperRouter::addItemId('index.php?option=com_obsuggest&controller=activity&user_id='.$idea->user_id)).'">'.$user->username.'</a>';
						echo '<a href="javascript:void(0)">'.$user->username.'</a>';
					} else { 
						echo '<a href="javascript:void(0)">'.JText::_("anonymous").' </a>';
					}
					
					echo '';
				?>
				</div>
				<!-- end: author -->
				<!-- actions -->
				<div class="idea_actions">
					<?php #=$this->displayBox("ACTIONS") ?>
					<a id="frm_Edit_<?php echo $idea->id?>" href="<?php echo JRoute::_('index.php?option=com_obsuggest&controller=idea&task=editIdea&id='.$idea->id.'&format=raw')?>" rel="{handler: 'iframe',size: {x: 418, y: 310}}"></a> 
					<?php 
						$edit = '';
						if (
							($this->output->permission->edit_idea_a == 1) || 
							(($this->output->permission->edit_idea_o == 1) && ($this->idea_output->user->id == $idea->user_id))) 
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
				</div>
				<!-- end: actions -->
				
			</div>
		<!-- </div> -->
		<div class="comments_n_idea_info_bar">
		
		</div>

		<div>
			<div class="idea_boxvote"></div>
			<div class="clear_both"></div>
		</div>

		<div>
			<div class="idea_response">
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
			</div>
			<div class="clear_both"> </div>
		</div>
		<div>
			
			<div class="clear_both"> </div>
		</div>
	</div>
<?php 
}
echo $this->pagination ;
?>
</div>
</div>
</div>
</div>