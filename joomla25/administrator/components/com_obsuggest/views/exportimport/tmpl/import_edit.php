<?php
/**
 * @version		$Id: import_edit.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

JHTML::_('behavior.mootools'); 
?>
<script>
function btnImport_click() {
	$('task').value = "";
	$('adminForm').submit();
}
</script>
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=exportimport&sign=import" method="POST"/>
<table cellpadding="0" cellspacing="0" width="100%">
	<tr>
		<td width="50%" valign="top">
			<table class="admintable" width="100%">
				<tr>
					<td class="key"><?php echo JText::_('FILE_NAME')?></td>
					<td><input type="text" name="export_filename" value="<?php echo $this->output->file_name;?>"/></td>
				</tr>				
				<tr>
					<td class="key"><?php echo JText::_('FORUM_NAME')?></td>
					<td><input type="text" style="width: 100%" name="forum_name" value="<?php echo $this->output->name;?>"/></td>
				</tr>
				<tr>
					<td class="key" valign="top"><?php echo JText::_('Description')?></td>
					<td><textarea style="width: 100%" name="forum_description"><?php echo $this->output->description;?></textarea></td>
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
						<th width="7%">#</th>
						<th width="7%"><input type="checkbox" /></th>
						<th><?php echo JText::_('Title')?></th>
					</tr>
				</thead>	
				<tfoot>
					<tr>
						<td colspan="5">							
						</td>
					</tr>
				</tfoot>	
				<tbody>
				<?php
				if ($this->output->idea != NULL) {
					$i=0;
					foreach($this->output->idea as $idea) { 
				?>
					<tr>
						<td align="center"><?php echo ++$i;?></td>
						<td align="center"><input type="checkbox" name="idea_id[]" checked="checked"  value="<?php echo $idea->id; ?>"/></td>
						<td><b><?php echo $idea->title;?></b></td>
						<input type="hidden" name="idea_title[]" value="<?php echo $idea->title; ?>" />
						<input type="hidden" name="idea_content[]" value="<?php echo $idea->content; ?>" />
					</tr>
				<?php
					}
				} 
				?>
				</tbody>	
			</table>
		</td>		
	</tr>	
</table>
<input type="hidden" name="task" id="task" value="" />
</form>