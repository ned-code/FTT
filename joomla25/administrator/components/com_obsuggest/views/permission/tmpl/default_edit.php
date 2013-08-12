<?php
/**
 * @version		$Id: default_edit.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<style type="text/css">
fieldset label {clear: none}
</style>
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=permission&gid=<?php echo $this->permission->group_id?>" method="POST">
<table width="100%">
	<tr>
		<td width="48%">
			<fieldset>
				<legend><?php echo JText::_('Idea_Permission')?></legend>
				<table class="admintable">
					<tr>
						<td class="key"><?php echo JText::_('New_Idea')?></td>
						<td>
							<input type="checkbox" name="new_idea_a" id="new_idea_a" value="1"<?php if ($this->permission->new_idea_a == 1) echo "checked='checked'"?>/>
							<label for="new_idea_a"><?php echo JText::_('Anyone')?></label>
							<input type="checkbox" name="new_idea_o" id="new_idea_o" value="1"<?php if ($this->permission->new_idea_o == 1) echo "checked='checked'"?>/>
							<label for="new_idea_o"><?php echo JText::_('Own')?></label>
						</td>
					</tr>
					<tr>
						<td class="key"><?php echo JText::_('Edit_Idea')?></td>
						<td>
							<input type="checkbox" name="edit_idea_a" id="edit_idea_a" value="1"<?php if ($this->permission->edit_idea_a == 1) echo "checked='checked'"?>/>
							<label for="edit_idea_a"><?php echo JText::_('Anyone')?></label>
							<input type="checkbox" name="edit_idea_o" id="edit_idea_o" value="1"<?php if ($this->permission->edit_idea_o == 1) echo "checked='checked'"?>/>
							<label for="edit_idea_o"><?php echo JText::_('Own')?></label>
						</td>
					</tr>
					<tr>
						<td class="key"><?php echo JText::_('Delete_Idea')?></td>
						<td>
							<input type="checkbox" name="delete_idea_a" id="delete_idea_a" value="1"<?php if ($this->permission->delete_idea_a == 1) echo "checked='checked'"?>/>
							<label for="delete_idea_a"><?php echo JText::_('Anyone')?></label>
							<input type="checkbox" name="edit_idea_o" id="delete_idea_o" value="1"<?php if ($this->permission->delete_idea_o == 1) echo "checked='checked'"?>/>
							<label for="delete_idea_o"><?php echo JText::_('Own')?></label>
						</td>
					</tr>
					<tr>
						<td class="key"><?php echo JText::_('Change_Status')?></td>
						<td>
							<input type="checkbox" name="change_status_a" id="change_status_a" value="1"<?php if ($this->permission->change_status_a == 1) echo "checked='checked'"?>/>
							<label for="change_status_a"><?php echo JText::_('Anyone')?></label>
							<input type="checkbox" name="change_status_o" id="change_status_o" value="1"<?php if ($this->permission->change_status_o == 1) echo "checked='checked'"?>/>
							<label for="change_status_o"><?php echo JText::_('Own')?></label>
						</td>
					</tr>
					<tr>
						<td class="key"><?php echo JText::_('Vote_Idea')?></td>
						<td>
							<input type="checkbox" name="vote_idea_a" id="vote_idea_a" value="1"<?php if ($this->permission->vote_idea_a == 1) echo "checked='checked'"?>/>
							<label for="vote_idea_a"><?php echo JText::_('Anyone')?></label>
							<input type="checkbox" name="vote_idea_o" id="vote_idea_o" value="1"<?php if ($this->permission->vote_idea_o == 1) echo "checked='checked'"?>/>
							<label for="vote_idea_o"><?php echo JText::_('Own')?></label>
						</td>
					</tr>										
					<tr>
						<td class="key"><?php echo JText::_('Response_Idea')?></td>
						<td>
							<input type="checkbox" name="response_idea_a" id="response_idea_a" value="1"<?php if ($this->permission->response_idea_a == 1) echo "checked='checked'"?>/>
							<label for="response_idea_a"><?php echo JText::_('Anyone')?></label>
							<input type="checkbox" name="response_idea_o" id="response_idea_o" value="1"<?php if ($this->permission->response_idea_o == 1) echo "checked='checked'"?>/>
							<label for="response_idea_o"><?php echo JText::_('Own')?></label>
						</td>
					</tr>
				</table>
			</fieldset>
		</td>
		<td valign="top">
			<fieldset>
				<legend><?php echo JText::_('Comment_Permission')?></legend>
				<table class="admintable">
					<tr>
						<td class="key"><?php echo JText::_('New_Comment')?></td>
						<td>
							<input type="checkbox" name="new_comment_a" id="new_comment_a" value="1"<?php if ($this->permission->new_comment_a == 1) echo "checked='checked'"?>/>
							<label for="new_comment_a"><?php echo JText::_('Anyone')?></label>
							<input type="checkbox" name="new_comment_o" id="new_comment_o" value="1"<?php if ($this->permission->new_comment_o == 1) echo "checked='checked'"?>/>
							<label for="new_comment_o"><?php echo JText::_('Own')?></label>
						</td>
					</tr>
					<tr>
						<td class="key"><?php echo JText::_('Edit_Comment')?></td>
						<td>
							<input type="checkbox" name="edit_comment_a" id="edit_comment_a" value="1"<?php if ($this->permission->edit_comment_a == 1) echo "checked='checked'"?>/>
							<label for="edit_comment_a"><?php echo JText::_('Anyone')?></label>
							<input type="checkbox" name="edit_comment_o" id="edit_comment_o" value="1"<?php if ($this->permission->edit_comment_o == 1) echo "checked='checked'"?>/>
							<label for="edit_comment_o"><?php echo JText::_('Own')?></label>
						</td>
					</tr>
					<tr>
						<td class="key"><?php echo JText::_('Delete_Comment')?></td>
						<td>
							<input type="checkbox" name="delete_comment_a" id="delete_comment_a" value="1"<?php if ($this->permission->delete_comment_a == 1) echo "checked='checked'"?>/>
							<label for="delete_comment_a"><?php echo JText::_('Anyone')?></label>							
							<input type="checkbox" name="delete_comment_o" id="delete_comment_o" value="1"<?php if ($this->permission->delete_comment_o == 1) echo "checked='checked'"?>/>
							<label for="delete_comment_o"><?php echo JText::_('Own')?></label>
						</td>
					</tr>
				</table>
			</fieldset>
		</td>
	</tr>
</table>
<input type="hidden" name="task" value="update">
</form>