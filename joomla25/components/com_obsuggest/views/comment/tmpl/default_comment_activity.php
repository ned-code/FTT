<?php
/**
 * @version		$Id: default_comment_activity.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<div id="list_comment" style="width:100%;border:0px dotted #999999;">
<?php
if ( count( $this->comments ) ) {
	foreach ( $this->comments as $comment ) { 
		$user = $this->getUser( $comment->user_id );
?>
<div class="comment-details" id="comment_<?php echo $comment->id;?>">
	<div class="username">
		<div class="_image">&nbsp;</div>
		<div class="_name" style="text-align:center;"><?php echo $user->username; ?></div>
	</div>
	<div class="comment" id="comment_content_<?php echo $comment->id?>">
		<div class="content"><?php echo $comment->comment; ?></div>
	</div>

<div style="padding-right:10px;">
	<span class="createdate">
		<div style="float:right;">
			<?php if (($this->output->permission->delete_comment_a == 1) || (($this->output->permission->delete_comment_o == 1) && ($this->output->user->id == $comment->user_id))) {?>
			<a href="javascript:delComment(<?php echo $comment->id;?>);"><?php echo JText::_("Delete")?></a>&nbsp;|&nbsp;
			<?php }?>
			<?php echo JText::_("Create on")?> <?php echo date($this->datetime_format, strtotime($comment->createdate));?></div>							
		<?php if (($this->output->permission->edit_comment_a == 1) || (($this->output->permission->edit_comment_o == 1) && ($this->output->user->id == $comment->user_id))) {?>
		<div class="active" id ="edt<?php echo $comment->id;?>" style="float:right;" onClick="onedit(<?php echo $comment->id;?>)" >
			<a href="javascript:void(0);"><?php echo JText::_("Edit")?></a>&nbsp;|&nbsp; 
			<a id="frm_Edit_<?php echo $comment->id;?>" href="index.php?option=com_obsuggest&controller=comment&task=editComment&id=<?php echo $comment->id;?>&format=raw" rel="{handler: 'iframe',size: {x: 430, y: 280}}"></a>
		</div>
		<?php }?>
	</span>
</div></div>
<div style="clear:both;border:0px solid red;border-top:1px dotted #CCCCCC;"></div>
<?php }
}?>
</div>
<div>
	<span class="pagination">
		<div id="Pagination3">
		<?php 
		if(count($this->comments)) 
			echo $this->pageComment;
		else 
		{
		?>
		<div style="margin:0px 1px 0px 1px;text-align:center;border:1px dotted #999999;background:#ffffcc;">
		<?php 
			echo JText::_("No comment for this idea.");
		?>			
		</div>
		<?php 
		}
		?>
		
		</div>
	</span>			
</div>