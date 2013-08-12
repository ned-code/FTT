<?php
/**
 * @version		$Id: default_forum_import_ideas.php 152 2011-03-12 06:19:57Z thongta $
 * @package		obSuggest - Suggestion extension for Joomla.
 * @copyright	(C) 2007-2011 foobla.com. All rights reserved.
 * @author		foobla.com
 * @license		GNU/GPL, see LICENSE
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );

?>
<table class="adminlist">
	<thead>
		<tr>
			<th width="5%">#</th>			
			<th><?php echo JText::_("Title")?></th>
		</tr>
	</thead>
	<tbody>
	<?php
		$k = 0;
		$i = 1;
		if (isset($this->output->output['contents'])) {
			foreach ($this->output->output['contents'] as $content) { 
	?>
		<tr class="row<?php echo $k;?>">
			<td align="center"><?php echo $i;?></td>			
			<td><?php echo $content->title ?></td>
		</tr>
	<?php
			$k = 1-$k;
			$i++;
			}
		} 
	?>		
	</tbody>
	<tfoot>
		<tr>
			<td colspan="3"></td>
		</tr>
	</tfoot>
</table>
