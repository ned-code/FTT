<?php
/**
 * @version		$Id: default_export.php 152 2011-03-12 06:19:57Z thongta $
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
function btnNewExport_click() {			
	document.exportForum.task.value = "newExport";
	document.exportForum.submit();
}
</script>

<table class="adminlist">
	<thead>
		<tr>
			<th width="3%">#</th>
			<th width="55%"><?php echo JText::_('Name')?></th>
			<th width="7%"><?php echo JText::_('Download')?></th>
			<th><?php echo JText::_('CREATED_DATE')?></th>
			<th><?php echo JText::_('Size')?></th>
			<th><?php echo JText::_('Delete')?></th>
		</tr>	
	</thead>
	<tfoot>
		<tr>
			<td colspan="10">				
			</td>
		</tr>
	</tfoot>
	<tbody>
	<?php
		$i = 0;
		$k = 0;		
		if (($this->output != NULL) && ($this->output->file_export != NULL)) {
			foreach ($this->output->file_export as $file) {
			
	?>
		<tr class="row<?php echo $k; $k = 1 - $k;?>">
			<td align="center"><?php echo ++$i; ?></td>
			<td><a href="index.php?option=com_obsuggest&controller=exportimport&task=editExport&filename=<?php echo $file->name;?>"><b><?php echo $file->name; ?></b></a></td>
			<td align="center"><a href="index.php?option=com_obsuggest&controller=exportimport&task=download&dir=export&filename=<?php echo $file->name;?>"><?php echo JHTML::_('image.administrator','download_f2.png',NULL,'/images/download_f2.png',NULL,'Dowload file','width=25px')?></a></td>
			<td align="center"><?php echo date ("F d Y H:i:s.",filemtime(JPATH_COMPONENT.DS."data".DS."export".DS.$file->name));?></td>
			<td align="center"><?php echo round((filesize(JPATH_COMPONENT.DS."data".DS."export".DS.$file->name) / 1024), 2)." Kb"; ?></td>
			<td align="center"><a href="index.php?option=com_obsuggest&controller=exportimport&task=deleteExport&filename=<?php echo $file->name;?>"><?php echo JHTML::_('image.administrator','delete_f2.png',NULL,'/images/delete_f2.png',NULL,'Delete file','width=25px')?></a></td>
		</tr>
	<?php 
			}
		}
	?>

	</tbody>
</table>
 

