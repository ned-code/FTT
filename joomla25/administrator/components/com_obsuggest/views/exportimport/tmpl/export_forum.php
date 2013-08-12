<?php
/**
 * @version		$Id: export_forum.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<script>
function btnExport_click() {
	$('task').value = "addExport";
	$('adminForm').submit();
}
</script>
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=exportimport" method="POST">
<table width="100%" class="adminlist" cellpadding="0" cellspacing="0">
	<thead>
	<tr>		
		<th width="2%">#</th>
		<th width="30%"><?php echo JText::_('Forum Name')?></th>		
		<th><?php echo JText::_('Description')?></th>
		<th width="3"><?php echo JText::_('Published')?></th>							
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
		$i = 0;
		$k=0;
		foreach($this->output->forums as $forum) {
			$id = JHTML::_('grid.id', ++$i, $forum->id, null, 'cb_forum_id_');			
			$published = JHTML::_('grid.published', $forum, $i);
	?>
		<tr class="row<?php echo $k;?>">			
			<td><input type="checkbox" name="cb_forum_id[]" onClick="isChecked(this.checked);" value="<?php echo $forum->id; ?>" /></td>
			<td> 
				<div style="font-weight: bolder;"><a href="index.php?option=com_obsuggest&controller=forum&task=view&id=<?php echo $forum->id; ?>"><?php echo $forum->name; ?></a></div>
				<div style="float: left; padding-right: 3px"><b><?php //echo $this->countIdea($forum->id); ?></b> <?php echo JText::_("Ideas")?></div>				
			</td>			
			<td><?php echo $forum->description; ?></td>
			<td align="center"><?php echo $published; ?></td>
		</tr>
	<?php 
			$k = 1-$k;
		}
	?>
	</tbody>	
</table>
<input type="hidden" name="task" id="task" value="" />
<input type="hidden" name="boxchecked" value="" />
</form>
