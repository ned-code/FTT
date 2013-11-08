<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

$listOrder = $this->escape($this->state->get('list.ordering'));
$listDirn  = $this->escape($this->state->get('list.direction'));
?>
<form action="<?php echo JRoute::_('index.php?option=com_rsfirewall&view=logs'); ?>" method="post" name="adminForm" id="adminForm">	
	<div class="span2">
		<?php echo $this->sidebar; ?>
	</div>
	<div class="span10">
	<?php $this->filterbar->show(); ?>
	
	<table class="adminlist table table-striped">
		<thead>
		<tr>
			<th width="1%" nowrap="nowrap" class="hidden-phone"><?php echo JText::_( '#' ); ?></th>
			<th width="1%" nowrap="nowrap"><input type="checkbox" name="checkall-toggle" value="" title="<?php echo JText::_('JGLOBAL_CHECK_ALL'); ?>" onclick="Joomla.checkAll(this)" /></th>
			<th width="1%" nowrap="nowrap" class="hidden-phone"><?php echo JHtml::_('grid.sort', 'COM_RSFIREWALL_ALERT_LEVEL', 'level', $listDirn, $listOrder); ?></th>
			<th width="1%" nowrap="nowrap" class="hidden-phone"><?php echo JHtml::_('grid.sort', 'COM_RSFIREWALL_LOG_DATE_EVENT', 'date', $listDirn, $listOrder); ?></th>
			<th width="1%" nowrap="nowrap"><?php echo JHtml::_('grid.sort', 'COM_RSFIREWALL_LOG_IP_ADDRESS', 'ip', $listDirn, $listOrder); ?></th>
			<th width="1%" nowrap="nowrap" class="hidden-phone"><?php echo JHtml::_('grid.sort', 'COM_RSFIREWALL_LOG_USER_ID', 'user_id', $listDirn, $listOrder); ?></th>
			<th width="1%" nowrap="nowrap" class="hidden-phone"><?php echo JHtml::_('grid.sort', 'COM_RSFIREWALL_LOG_USERNAME', 'username', $listDirn, $listOrder); ?></th>
			<th><?php echo JHtml::_('grid.sort', 'COM_RSFIREWALL_LOG_PAGE', 'page', $listDirn, $listOrder); ?></th>
			<th class="hidden-phone"><?php echo JHtml::_('grid.sort', 'COM_RSFIREWALL_LOG_REFERER', 'referer', $listDirn, $listOrder); ?></th>
			<th><?php echo JText::_('COM_RSFIREWALL_LOG_DESCRIPTION'); ?></th>
		</tr>
		</thead>
	<?php foreach ($this->items as $i => $item) { ?>
		<tr class="row<?php echo $i % 2; ?>">
			<td width="1%" nowrap="nowrap" class="hidden-phone"><?php echo $this->pagination->getRowOffset($i); ?></td>
			<td width="1%" nowrap="nowrap"><?php echo JHtml::_('grid.id', $i, $item->id); ?></td>
			<td width="1%" nowrap="nowrap" class="hidden-phone com-rsfirewall-level-<?php echo $item->level; ?>"><?php echo JText::_('COM_RSFIREWALL_LEVEL_'.$item->level); ?></td>
			<td width="1%" nowrap="nowrap" class="hidden-phone"><?php echo $this->showDate($item->date); ?></td>
			<td width="1%" nowrap="nowrap"><a target="_blank" href="http://whois.domaintools.com/<?php echo $this->escape($item->ip); ?>"><?php echo $this->escape($item->ip); ?></a></td>
			<td width="1%" nowrap="nowrap" class="hidden-phone"><?php echo (int) $item->user_id; ?></td>
			<td width="1%" nowrap="nowrap" class="hidden-phone"><?php echo $this->escape($item->username); ?></td>
			<td><?php echo $this->escape($item->page); ?></td>
			<td class="hidden-phone"><?php echo $item->referer ? $this->escape($item->referer) : '<em>'.JText::_('COM_RSFIREWALL_NO_REFERER').'</em>'; ?></td>
			<td>
				<?php echo JText::_('COM_RSFIREWALL_EVENT_'.$item->code); ?>
				<?php if (!empty($item->debug_variables)) { ?>
				<br /><b><?php echo JText::_('COM_RSFIREWALL_LOG_DEBUG_VARIABLES'); ?></b><br />
				<?php echo nl2br($this->escape($item->debug_variables)); ?>
				<?php } ?>
			</td>
		</tr>
	<?php } ?>
	<tfoot>
		<tr>
			<td colspan="10"><?php echo $this->pagination->getListFooter(); ?></td>
		</tr>
	</tfoot>
	</table>
	
	<div>
		<?php echo JHtml::_( 'form.token' ); ?>
		<input type="hidden" name="boxchecked" value="0" />
		<input type="hidden" name="task" value="" />
		<?php if (!$this->isJ30) { ?>
		<input type="hidden" name="filter_order" value="<?php echo $listOrder; ?>" />
		<input type="hidden" name="filter_order_Dir" value="<?php echo $listDirn; ?>" />
		<?php } ?>
	</div>
	</div>
</form>