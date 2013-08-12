<?php
/**
 * @version		$Id: default_pagination.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<table width="100%" style="margin-top: 0px;border:0px solid red;" cellpadding="0" cellspacing="0">	
	<?php if ($this->search == 1) {?>
	<tr>
		<td colspan="2" >
			<?php echo $this->loadTemplate('search'); ?>			
		</td>
	</tr>
	<?php } ?>	
	<?php  
	if($this->ideas)	 
	{
		foreach($this->ideas as $idea) {
			$user = $this->getUser($idea->user_id); 
	?>
	<tr class="contentpaneopen" style="width: 100%;">
		<td class="left-collum" style="width: 50px;" valign="top">
			<div class="points" style="border-top: 1px solid #BBB;border-left: 1px solid #BBB;border-right: 1px solid #BBB;text-align: center; text-transform: lowercase;padding-top: 5px; width: 100% ">
				<div id="vote<?php echo $idea->id;?>" style="font-weight: bolder; font-size: 18px;text-align: center;color: #FF7800;"><?php echo $idea->votes;?></div>
				<span style="font-size: 10px; font-weight: nomanl"><?php echo JText::_("votes")?></span>
			</div>
			<div <?php if (($this->output->permission->vote_idea_a == 1) || (($this->output->permission->vote_idea_o == 1) && ($this->output->user->id == $idea->user_id))) {?>  
							onclick="clickVotes(<?php echo $idea->id;?>);clickVote();"
				<?php  } ?> 
				style="border: 1px solid #BBB; text-align: center;width: 100%; background-color: #CCCCCC;">
				<span id="voteB<?php echo $idea->id;?>" style="font-weight: bolder; font-size: 14px;"><?php echo $this->getUserVoteIdea($idea->id);?></span>
			</div>
		</td>
		<td style="padding-left: 10px;padding-bottom: 15px;">
			<div class="contentheading" style="float: none; text-align: left;font-weight: bolder;width: 100%;">
				<div style="float: none;">
					<div class="title" style="font-size: 16px;">
						<span id="title<?php echo $idea->id; ?>"><?php echo $idea->title; ?></span>						
						<?php 
								$status_text = "Status / Set Close";
								if ($idea->status_id != 0) {  									
									$dem=1;
									$status_text = '';
									foreach ($this->status as $status ) {
										if ($status->id == $idea->status_id) {
											$status_text .= $status->title; 	
											break;
										}		
										$dem++;								
									}
								}
							?>
							<?php if (($this->output->permission->change_status_a == 1) || (($this->output->permission->change_status_o == 1) && ($this->output->user->id == $idea->user_id))) {?>
							<a id="status<?php echo $idea->id; ?>" onclick="clickVote();clickStatus(<?php echo $idea->id; ?>); " onmouseout="outVote();"
							<?php ?> 
							style="font-weight: bolder;font-style:italic; margin-left: 10px; font-size: 12px;cursor:pointer;">
							<?php 								
								echo $status_text;
							?>
							</a>
							<?php	
							} else {
								echo '<font style="font-weight: bolder;font-style:italic; margin-left: 10px; font-size: 12px;">' . $status_text . '</font>';
							}	
							?>						
					</div>
				</div>
			</div>		
			<div class="description" style="">
				<p id="idea<?php echo $idea->id; ?>" style="text-align: left;margin-left: 5px;">
					<?php echo $idea->content; ?>
				</p>
			</div>
			<div id="rps<?php echo $idea->id; ?>" class="response" style="text-align: left; width: 100%;">
				<?php if ($idea->response != NULL ) { ?>				
				<div style="padding-left: 5px;padding-top: 5px; text-align: left;margin-left: 5px; margin-right: 5px;  border-top: 1px solid #BBB; background-color: #EEE">
					<div id="rps-title<?php echo $idea->id; ?>" style="font-weight: bolder;margin-bottom: 3px;"><?php echo JText::_("admin response")?></div>
					<div id="rps-content<?php echo $idea->id; ?>"><?php echo $idea->response;?></div>
					<?php if (($this->output->permission->response_idea_a == 1) || (($this->output->permission->response_idea_o == 1) && ($this->output->user->id == $idea->user_id))) {?> 
					<div class="small"><a href="javascript:void(0);" onclick="addRepose('rps<?php echo $idea->id; ?>')">- <?php echo JText::_("edit")?></a></div>
					<?php }?>
				</div>
				<?php } else {?>
				<div style="text-align: left;" >
					<?php if (($this->output->permission->response_idea_a == 1) || (($this->output->permission->response_idea_o == 1) && ($this->output->user->id == $idea->user_id))) {?>
					<a href="javascript:addRepose('rps<?php echo $idea->id; ?>')" style="font-weight: bolder;font-style:italic"><?php echo JText::_("add Response")?></a> <?php }
					else{
					?>
					<?}?>
				</div>
				<?php } ?>				
			</div>
			<input type="hidden" name="cache_rps_content<?php echo $idea->id; ?>" id="cache_rps_content<?php echo $idea->id; ?>" value="<?php echo $idea->response;?>" />
			<div class="contentfooter" style="text-align: left;margin-left: 5px;">
				<div style="text-align: left;">
					<div class="small" style="float: left; margin-right: 5px;" id="cm<?php echo $idea->id; ?>">
						
					<!--<a href="index.php?option=com_obsuggest&controller=comment&idea_id=<?php //echo $idea->id;?>">comment</a> |-->
					<!--  -->
					<?php $db=&JFactory::getDBO();
							$query = "SELECT COUNT(*) FROM #__foobla_uv_comment WHERE idea_id='".$idea->id."'";
							$db->setQuery($query);
							$rs = $db->loadResult();
							//echo $rs;
						if($rs=='0'){
							echo "<font style='color:#135CAE;' id='comment_count'>".$rs."</font>";
					?>
					<a href="index.php?option=com_obsuggest&controller=comment&idea_id=<?php echo $idea->id;?>"><?php echo JText::_("comment")?></a> |
					<?php }
					else if($rs!='0'){
						echo "<font style='color:#135CAE;font-weight:bold' id='comment_count'>".$rs."</font>";
					?>
					<a href="index.php?option=com_obsuggest&controller=comment&idea_id=<?php echo $idea->id;?>" style="font-weight:bold;"><?php echo JText::_("comment")?></a> |
					<?php }?>
					
					<!-- I'm repaire it here -->
						
					</div>
					<div class="small" style="float: left; margin-right: 5px;"> 
						<?php echo JText::_("by")?>
						<?php if ($user->username != "anonymous") {?>
							<a href="index.php?option=com_obsuggest&controller=activity&user_id=<?php echo $idea->user_id?>"><?php echo $user->username;?></a>
						<?php } else {?>
								<?php echo JText::_("anonymous")?>
						<?php }?> 
						|
					</div> 
					<?php if (($this->output->permission->edit_idea_a == 1) || (($this->output->permission->edit_idea_o == 1) && ($this->output->user->id == $idea->user_id))) {?>
					<div class="small" style="float: left; margin-right: 5px;" id ="edt<?php echo $idea->id; ?>" onClick="onedit(<?php echo $idea->id; ?>)"> 
						<a href="javascript:void(0);"><?php echo JText::_("Edit")?></a> 
						<a id="frm_Edit_<?php echo $idea->id?>" href="index.php?option=com_obsuggest&controller=idea&task=editIdea&id=<?php echo $idea->id;?>&format=raw" rel="{handler: 'iframe',size: {x: 540, y: 400}}"></a> 
					</div>						
					<?php }?>
					<?php if (($this->output->permission->delete_idea_a == 1) || (($this->output->permission->delete_idea_o == 1) && ($this->output->user->id == $idea->user_id))) {?>
					<div class="small" style="float: left; margin-right: 5px;" id ="del<?php echo $idea->id; ?>" onClick="ondel(<?php echo $idea->id; ?>);">
						 <a href="javascript:void(0);"><?php echo JText::_("Delete")?></a> |
					</div>
					<?php }?>
					<div class="createdate" style="float: left; margin-right: 5px;"> <?php echo JText::_("Create on")?> <b><?php echo $idea->createdate; ?></b></div>
				</div>
			</div>
		</td>
	</tr>
	<?php } 
	}else{
	?>
	<tr>
		<td><?php echo JText::_("No found")?></td>
	</tr>
	<?}?>
</table>
