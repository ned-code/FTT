<?php
/**
 * @version		$Id: default_idea_edit.php 41 2011-02-17 09:09:28Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @license		GNU/GPL, see LICENSE
 */

 // no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<form name="adminForm" action="index.php?option=com_obsuggest&controller=idea&id=<?php echo $this->output->idea->id; ?>" method="POST">
<table width="100%">
	<tr>
		<td>
			<?php echo $this->loadTemplate('idea_info'); ?>
		</td>
	</tr>
</table>
<input type="hidden" name="idea_id" value="<?php echo $this->output->idea->id; ?>" />
<input type="hidden" name="task" value="update" />
</form>
