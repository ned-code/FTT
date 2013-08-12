<?php
/**
 * @version		$Id: default_idea_add.php 152 2011-03-12 06:19:57Z thongta $
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
<input type="submit" value="<?php echo JText::_("Add_idea")?>" />
<input type="hidden" name="task" value="addIdea" /> 
<input type="hidden" name="idea_id" value="<?php echo $this->output->idea->id; ?>" />
</form>
