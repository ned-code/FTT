<?php
/**
 * @version		$Id: default_idea_view.php 41 2011-02-17 09:09:28Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @license		GNU/GPL, see LICENSE
 */

 // no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<!--<form name="adminForm" action="#" method="POST" >-->
<script>
	function submitform(){
			document.adminForm.task.value="view";
			document.adminForm.submit();
	}
</script>
<form name="adminForm" action="index.php?option=com_obsuggest&controller=idea&task=view"  method="POST">
<table width="100%">
	<tr>
		<td width="50%" valign="top">
			<?php echo $this->loadTemplate('idea_info'); ?>
		</td>
		<td valign="top">
			<?php echo $this->loadTemplate('idea_comments'); ?>
		</td>
	</tr>
</table>
</form>
