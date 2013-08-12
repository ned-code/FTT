<?php
/**
 * @version		$Id: default_writecomment.php 348 2011-06-09 10:28:44Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<div class="default_witecomment">
<?php if (($this->output->permission->new_comment_a == 1) || (($this->output->permission->new_comment_o == 1) && ($this->output->user->id == $ideas->user_id))) {?>
	<div style="margin-right:0px 3px;">
		<textarea rows="5" style="width:100%;border:1px dotted #999999;" name="comment" id="comment"></textarea>						
	</div>
	<div><br/><label><input id="anonymous" type="checkbox" name="anonymous" value="1" /> &nbsp; <?php echo JText::_('OBSG_COMMENT_AS_ANONYMOUS'); ?></label></div>
	<div style="margin:3px 0px;">
		<input type="button" value="<?php echo JText::_("Save")?>"  onclick="addComment();" />
			&nbsp;
		<input type="button" value="<?php echo JText::_("Reset")?>" onclick="resetComment();" />
	</div>
<?php }?>
</div>