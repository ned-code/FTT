<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

foreach ($this->feeds as $feed) { ?>
	<h3><?php echo JText::sprintf('COM_RSFIREWALL_FEED', $this->escape($feed->get_title())); ?></h3>
	<table class="adminlist table table-striped">
	<thead>
	<tr>
		<th width="10%" nowrap="nowrap"><?php echo JText::_('COM_RSFIREWALL_FEED_DATE'); ?></th>
		<th class="title"><?php echo JText::_('COM_RSFIREWALL_FEED_TITLE'); ?></th>
	</tr>
	</thead>
	<tbody>
	<?php foreach ($feed->get_items() as $i => $item) { ?>
	<tr class="row<?php echo $i % 2; ?>">
		<td width="1%" nowrap="nowrap"><?php echo $this->escape($item->get_date()); ?></td>
		<td><a href="<?php echo $item->get_link(); ?>" target="_blank"><?php echo $this->escape($item->get_title()); ?></a></td>
	</tr>
	<?php } ?>
	</tbody>
	</table>
<?php } ?>