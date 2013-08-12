<?php
/**
 * @version		$Id: default_forum_view.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<form name="adminForm" action="index.php?option=com_obsuggest&controller=forum&id=<?php echo $this->output->id; ?>&task=view" method="POST">
<table width="100%" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td width="50%" valign="top">
			<table width="100%">
				<tr>
					<td width="100%" valign="top">
						<?php echo $this->loadTemplate('forum_info'); ?>
					</td>
				</tr>
				<tr>
					<td width="100%" valign="top">
						<?php echo $this->loadTemplate('forum_status'); ?>
					</td>
				</tr>
			</table>
		</td>
		<td width="50%" valign="top">
			<table width="100%">
				<tr>
					<td width="100%">
						<?php echo $this->loadTemplate('forum_stasitic'); ?>
					</td>
				</tr>
				<tr>					
					<td width="100%">
						<?php echo $this->loadTemplate('forum_idea'); ?>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
<input type="hidden" name="id" value="<?php echo $this->output->id; ?>" />
</form>
