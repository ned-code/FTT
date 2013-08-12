<?php
/**
 * @version		$Id: default_idea_filter.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @license		GNU/GPL, see LICENSE
 */

 // no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<?php
	$forum_id = JRequest::getVar('filter_forum_id');
	$filter_key = JRequest::getVar('filter_key');
	if ($forum_id == "") $forum = NULL; 
?>
<script>
function btnReset_click() {
	document.adminForm.filter_key.value = "";
	var sel = document.adminForm.filter_forum_id;
	sel.options[sel.selectedIndex].value = '';
	document.adminForm.submit();
}
</script>
<table width="100%" calss="admintable" style="border: 1px solid #BBB;">
	<tr>
		<td>
			<?php echo JText::_("Filter")?>: 
			<input type="text" name="filter_key" value="<?php echo $filter_key; ?>">
			<input type="button" value="<?php echo JText::_("Go")?>" onclick="document.adminForm.submit()" />
			<input type="button" value="<?php echo JText::_("Reset")?>" onclick="btnReset_click();"/>				
		</td>
		<td align="right">
			<select onchange="document.adminForm.submit()" name="filter_forum_id">
				<option value="">- <?php echo JText::_("SELECT_FORUM")?> -</option>
				<?php
				foreach ($this->output->forums as $forum) {
					$selected = "";
					if ($forum->id == $forum_id) {
						$selected = "selected";
					}
				?>
				<option <?php echo $selected;?> value="<?php echo $forum->id; ?>"><?php echo $forum->name; ?></option>
				<?php					  
				}
				?> 
			</select>
		</td>
	<tr>
</table>


