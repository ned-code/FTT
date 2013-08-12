<?php
/**
 * @version		$Id: pagination_comment.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

			if (count($this->comments)){
			foreach ($this->comments as $comment) { 
				$user = $this->getUser($comment->user_id);
		?>
		<table  id="comment_<?php echo $comment->id;?>" width="100%" cellpadding="0" cellspacing="3" style=" padding-left:15px; padding-right:10px;line-height:normal;">
			<tr>
				<td>
					<div style="font-size:14px;font-weight:bold;"><?php echo $user->username; ?></div>
					<div  style="background-color: #FFFFBB; padding:5px;text-align:justify; border:1px solid #ccc;">
						<?php echo $comment->comment; ?>
					</div>		
				</td>
			</tr>
			<tr>
				<td align="right">
					<span class="createdate">
						<div style="float:right;">
							<?php if (($this->output->permission->delete_comment_a == 1) || (($this->output->permission->delete_comment_o == 1) && ($this->output->user->id == $ideas->user_id))) {?>
							<a href="#" onclick="delComment(<?php echo $comment->id;?>);">Delete</a>&nbsp;|&nbsp;
							<?php }?>
							Created on <?php echo date($this->datetime_format, strtotime($comment->createdate));  ?></div>
						<?php if (($this->output->permission->edit_comment_a == 1) || (($this->output->permission->edit_comment_o == 1) && ($this->output->user->id == $ideas->user_id))) {?>
						<div class="active" id ="edt<?php echo $comment->id;?>" style="float:right;" onClick="onedit(<?php echo $comment->id;?>)" >
								<a href="javascript:void(0);">Edit</a>&nbsp;|&nbsp; 
								<a id="frm_Edit_<?php echo $comment->id;?>" href="index.php?option=com_obsuggest&controller=comment&task=editComment&id=<?php echo $comment->id;?>&format=raw" rel="{handler: 'iframe',size: {x: 418, y: 275}}"></a>
						</div>
						<?php }?>
					</span>					
					<!-- <a class="modal"  rel="{handler: 'iframe',size: {x: 418, y: 275}}" href="index.php?option=com_obsuggest&controller=comment&task=editComment&id=<?php echo $comment->id;?>&format=raw">Edit</a>-->
				</td>
			</tr>	
			<tr>
				<td>
				</td>
			</tr>
		</table>
		<?php }}?>