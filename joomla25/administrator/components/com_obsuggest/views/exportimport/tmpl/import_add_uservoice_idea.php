<?php
/**
 * @version		$Id: import_add_uservoice_idea.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<script>
function submitbutton(task) {
	if (task == 'cancel') {
		document.adminForm.task.value = task;
		document.adminForm.submit();
		return; 
	}
	var name_file = document.adminForm.import_filename.value;
	name_file = name_file.trim();
	if (name_file == "") {
		alert("<?php echo JText::_('FILE_NAME')?>");
		document.adminForm.import_filename.focus();
		return;
	}
	document.adminForm.task.value = task;
	document.adminForm.submit();
}
</script>
<form name="adminForm" action="index.php?option=com_obsuggest&controller=exportimport&sign=import" method="POST">
<table cellpadding="0" cellspacing="0" width="100%">
	<tr>
		<td width="50%" valign="top">
			<table class="admintable" width="100%">
				<tr>
					<td class="key"><?php echo JText::_('FILE_NAME')?></td>
					<td><input type="text" name="import_filename" value=""/></td>
				</tr>				
				<tr>
					<td class="key"><?php echo JText::_('FORUM_NAME')?></td>
					<td><input type="text" style="width: 100%" name="forum_name" value=""/></td>
				</tr>
				<tr>
					<td class="key" valign="top"><?php echo JText::_('Description')?></td>
					<td><textarea style="width: 100%" name="forum_description"></textarea></td>
				</tr>
				<tr>
					<td class="key" valign="top"><?php echo JText::_('WELLCOME_MESSAGE')?></td>
					<td><textarea style="width: 100%" name="forum_wellcome_message"></textarea></td>
				</tr>
				<tr>
					<td class="key"><?php echo JText::_('Prompt')?></td>
					<td><input type="text" style="width: 100%" name="forum_prompt" value=""/></td>
				</tr>
				<tr>
					<td class="key"><?php echo JText::_('EXAMPLE_TEXT')?></td>
					<td><input type="text" style="width: 100%" name="forum_example" value=""/></td>
				</tr>				
			</table>
		</td>
		<td valign="top">
			<table class="adminlist">
				<thead>
					<tr>
						<th width="3%">#</th>
						<th width="3%"></th>
						<th width="60%"><?php echo JText::_('Title')?></th>
						
						<th><?php echo JText::_('Votes')?></th>
						<th><?php echo JText::_('CREATED_DATE')?></th>
					</tr>
				</thead>				
				<tbody>
				<?php		
					$i = 0;		
					if ($this->output->uservoice != NULL) {
						foreach ($this->output->uservoice as $ideas) {
							if ($ideas->ideas != NULL) {
								foreach ($ideas->ideas as $idea) {
				?>
					<tr>
						<td valign="top" align="center"><?php echo ++$i; ?></td>
						<td valign="top" align="center">
							<input type="checkbox" name="idea[]" checked="checked" value="<?php echo $ideas->subdomain."_".$ideas->forum_id."_".$idea->id; ?>"/>
						</td>
						<td valign="top"><b><?php echo $idea->title; ?></b></td>	
						
						<td align="center"><?php echo $idea->vote; ?></td>
						<td><?php echo $idea->created_at; ?></td>
					</tr>
				<?php
								}
							}
						}
					} 
				?>
				</tbody>
			</table>
		</td>		
	</tr>	
</table>
<input type="hidden" name="task" value="" />
<input type="hidden" name="boxchecked" value="1" /> 
</form>
