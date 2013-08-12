<?php
/**
 * @version		$Id: default_status_edit.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @license		GNU/GPL, see LICENSE
 */

 // no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

JHTML::_('behavior.mootools');
$status_id = JRequest::getVar('status_id');
$option = array();
$i = 0;
$option[] = JHTML::_('select.option',"".'-1','Null');
foreach ($this->ParentStatus as $prStatus) {
	$i++;
	$option[] = JHTML::_('select.option',"".$prStatus->id,$prStatus->title);
}	
?>
<style>
#someoption {
	width: 150px;
}
</style>
<script>
	window.addEvent('domready', function() {
		$('someoption').addEvent('change', function () {
			var elm_select = document.getElementById('someoption');			 
			$('parent_id').value = elm_select.options[elm_select.selectedIndex].value;						
		});
		$('btnSave').addEvent('click', function () {
			$('adminForm').submit();
		});
	});
</script>
<form name="adminForm" id="adminForm" action="index.php?option=com_obsuggest&controller=idea&sign=status" method="POST">
<table class="admintable">
	<tr>
		<td class="key"><?php echo JText::_("Catelogy")?></td>
		<td><?php echo JHTML::_('select.genericlist',$option,'someoption',null,'value','text',0); ?></td>
	</tr>
	<tr>
		<td class="key"><?php echo JText::_("Title")?></td>
		<td><input type="text" name="status_title" value="<?php echo $this->getStatusById($status_id); ?>"size="40" /></td>
	</tr>
	<tr>
		<td colspan="2">
			<input id="btnSave" type="button" value="Save" /> 
		</td>
	</tr>
</table>
<input id="parent_id" type="hidden" name="parent_id" value="-1" />
<input type="hidden" name="status_id" value="<?php echo $status_id?>" />
<input type="hidden" name="task" value="updateStatus" />
</form>
