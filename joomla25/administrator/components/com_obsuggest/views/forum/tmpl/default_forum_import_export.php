<?php
/**
 * @version		$Id: default_forum_import_export.php 152 2011-03-12 06:19:57Z thongta $
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
function btnImportExport_click(file_name) {				
	document.exportForum.file_name.value = file_name;
	document.exportForum.submit();
}
</script>
<form name="exportForum" id="exportForm" action="index.php?option=com_obsuggest&controller=forum&id=<?php echo $this->output->id; ?>&sign=export" method="POST">
<table class="adminlist">
	<thead>
		<tr>
			<th width="3%">#</th>
			<th><?php echo JText::_("Name")?></th>			
			<th width="15%"><?php echo JText::_("CREATED_DATE")?></th>
			<th width="5%"><?php echo JText::_("Size")?></th>
			<th width="5%"><?php echo JText::_("Import")?></th>
		</tr>	
	</thead>	
	<tbody>
	<?php
		$i = 0;
		if (($this->output != NULL) && (isset($this->output->file_export)) && ($this->output->file_export != NULL)) {
			foreach ($this->output->file_export as $file) {
	?>
		<tr>
			<td align="center"><?php echo ++$i; ?></td>
			<td><b><?php echo $file->name; ?></b></td>			
			<td align="center"><?php echo date ("F d Y H:i:s.",filemtime(JPATH_COMPONENT.DS."data".DS."export".DS.$file->name));?></td>
			<td align="center"><?php echo round((filesize(JPATH_COMPONENT.DS."data".DS."export".DS.$file->name) / 1024), 2)." Kb"; ?></td>
			<td align="center"><input type="button" value="<?php echo JText::_("Import")?>" onclick="btnImportExport_click('<?php echo $file->name; ?>')" /></td>
		</tr>
	<?php 
			}
		}
	?>
	</tbody>
</table>
<input type="hidden" name="file_name" id="file_name" value="" />
<input type="hidden" name='task' value="importExport" /> 
</form>
