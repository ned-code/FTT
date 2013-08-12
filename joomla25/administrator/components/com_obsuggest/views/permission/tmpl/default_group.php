<?php
/**
 * @version		$Id: default_group.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<table width="100%" class="adminlist" cellpadding="0" cellspacing="0">
	<thead>
		<tr>
			<th><?php echo JText::_('ID')?></th>
			<th><?php echo JText::_('TITLE')?></th>
			<th><?php echo JText::_('DESCRIPTION')?></th>
			<th><?php echo JText::_('MEMBER')?></th>
		</tr>
	</thead>
	<tbody>
		<tr style="height: 10px;" class="row0">
			<td>0</td>
			<td>
				<div style="font-weight: bolder;color: #0B55C4;"><a href="index.php?option=com_obsuggest&controller=permission&task=edit&gid=0"><?php echo JText::_('VISITOR'); ?></a></div>				
			</td>
			<td><?php echo JText::_('All Joomla authors are automatically in this group. This group cannot be removed!')?></td>
			<td align="center"><?php echo JText::_('ANYONE')?></td>			
		</tr>
	<?php
		$k = 1; 
		foreach($this->groups as $group) { 
	?>
		<tr style="height: 10px;" class="row<?php echo $k?>">
			<td><?php echo $group->id; ?></td>
			<td>
				<div style="font-weight: bolder;color: #0B55C4;"><a href="index.php?option=com_obsuggest&controller=permission&task=edit&gid=<?php echo $group->id; ?>"><?php echo $group->name; ?></a></div>
			</td>
			<td><?php echo JText::sprintf('All Joomla %s are automatically in this group. This group cannot be removed!',$group->name)?></td>
			<td align="center"><?php echo JText::_('AUTOMATIC')?></td>
		</tr>
	<?php
		$k = 1-$k; 
		}
	?>
	</tbody>
</table>

