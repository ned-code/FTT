<?php
/**
 * @version		$Id: default_forum_idea.php 229 2011-03-25 10:56:21Z phonglq $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

$mainframe = &JFactory::getApplication();
global $option;
?>
<fieldset>
<legend>Ideas in Forum</legend>
<table class="adminlist">
	<thead>
		<tr>
			<th width="7%"><?php echo JText::_("ID")?></th>
			<th><?php echo JText::_("Title")?></th>
		</tr>
	</thead>		
	<tbody>
		<?php
			
			$k = 0;			
			$i = $mainframe->getUserStateFromRequest($option.'limitstart','limitstart',0);
			/*echo "<pre>";
		print_r($this->output->ideas);
		echo "</pre>";*/
		if ($this->output->ideas != NULL) {
			foreach ($this->output->ideas as $idea) {
		?>
		<tr class="row<?php echo $k; ?>">	
			<td align="center"><?php echo ++$i; ?></td>
			<td><b><?php echo $idea->title; ?></b></td>
		</tr>
		<?php 
			$k = 1 - $k; 
			}
		}
		?>
	</tbody>
	<tfoot>
		<tr>
			<td colspan="2">
				<?php					
					echo $this->pagination->getListFooter();
				?>
			</td>
		</tr>
	</tfoot>
</table>
</fieldset>
