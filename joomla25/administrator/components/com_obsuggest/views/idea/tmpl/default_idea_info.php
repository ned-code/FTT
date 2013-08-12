<?php
/**
 * @version		$Id: default_idea_info.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @license		GNU/GPL, see LICENSE
 */

 // no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<?php
	foreach($this->output->status as $status) {
		if ($status->parent_id == -1) {
			$option_status[] = JHTML::_('select.option','0','Not Status');
			$option_status[] = JHTML::_('select.Optgroup',$status->title) ;
			foreach($this->output->status as $stt) {
				if ($stt->parent_id == $status->id) {
					$option_status[] = JHTML::_('select.option',$stt->id,$stt->title) ;
				}
			}
		}
	}
	
	foreach($this->output->forums as $forum) {		
		$option_forum[] = JHTML::_('select.option',$forum->id, $forum->name);
	}
	
?>
<table class="admintable" width="100%">
	<tr>
		<td>
			<fieldset>
				<legend><?php echo JText::_("Details")?></legend>
				<table class="admintable" width="100%">
					<tr>
						<td class="key"><?php echo JText::_("Title")?></td>
						<td>
							<input type="text" name="idea_title" value="<?php echo $this->output->idea->title; ?>"style="width: 200px"/>
						</td>
					</tr>
					<tr>
						<td class="key"><?php echo JText::_("Published")?></td>
						<td>
							<input type="radio" name="idea_published" <?php if ($this->output->idea->published == 0) echo "checked='checked'"; ?>value="0" /><?php echo JText::_("No")?>
							<input type="radio" name="idea_published" <?php if ($this->output->idea->published == 1) echo "checked='checked'"; ?>value="1" /><?php echo JText::_("Yes")?>
						</td>
					</tr>
					<tr>
						<td class="key"><?php echo JText::_("Status")?></td>
						<td>
							<?php echo JHTML::_('select.genericlist', $option_status, 'idea_status_id','style="width: 200px"', 'value', 'text', $this->output->idea->status_id);?>
						</td>
					</tr>
					<tr>
						<td class="key"><?php echo JText::_("Forum")?></td>
						<td>							
							<?php echo JHTML::_('select.genericlist', $option_forum, 'idea_forum_id','style="width: 200px"', 'value', 'text', $this->output->idea->forum_id);?>			
						</td>
					</tr>
					<tr>
						<td class="key"><?php echo JText::_("Vote")?></td>
						<td><input type="text" name="idea_votes" value="<?php echo $this->output->idea->votes; ?>" /></td>						
					</tr>
				</table>
			</fieldset>
		</td>
	</tr>
	<tr>
		<td>
			<fieldset>
				<legend><?php echo JText::_("Content")?></legend>
				<table width="100%">
					<tr>						
						<td colspan="2">
							<textarea name="idea_content" rows="10" cols="" style="width: 100%"><?php echo $this->output->idea->content; ?></textarea>
						</td>
					</tr>	
					<input type="hidden" name="idea_response" value="<?php echo $this->output->idea->response; ?>" />					
				</table>
			</fieldset>
		</td>
	</tr>
</table>

	
