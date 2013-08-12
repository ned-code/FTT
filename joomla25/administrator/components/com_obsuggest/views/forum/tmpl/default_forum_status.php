<?php
/**
 * @version		$Id: default_forum_status.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<fieldset>
<legend><?php echo JText::_("OBSG_TABS_PANEL")?></legend>
<table class="adminlist" width="97%">
	<thead>
		<tr>
			<th width="5%">#</th>
			<th width="5%"></th>
			<th><?php echo JText::_("OBSG_TAB_NAME")?></th>
			<th width="10%"><?php echo JText::_("ENABLE")?></th>
		</tr>		
	</thead>	
	<tfoot>
		<tr>
			<td colspan="4"></td>
		</tr>
	</tfoot>
	<tbody>
		
		<?php
		$k = 1;
		$i = 0;
		foreach ($this->output->status as $status) {				
			$i++;					 					
			$published = JHTML::_('grid.published', $status, $i);	
								
		?>
		<tr class="row<?php echo $k;?>">
			<td align="center"><?php echo $i;?></td>
			<td align="center"><input type="checkbox" name="status_id[]" value="<?php echo $status->id;?>"<?php if ($status->published == 1) echo "checked='checked'"; ?>/>
			<td><?php echo $status->title;?></td>
			<a href="index.php?option=com_obsuggest&controller=forum&task=editTab&id=<?php echo $this->output->id?>&status_id=<?php echo $status->id;?>&value=<?php echo (1-$status->published);?>">
			<td align="center">				
				<?php echo $published; ?>				
			</td>
			</a>
		</tr>
		<?php 		
			$k = 1-$k;
		}
		?>
	</tbody>
</table>
</fieldset>
