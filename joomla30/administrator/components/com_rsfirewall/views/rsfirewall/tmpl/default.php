<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');
?>
<form action="<?php echo JRoute::_('index.php?option=com_rsfirewall');?>" method="post" name="adminForm" id="adminForm">
	<div class="span2">
		<?php echo $this->sidebar; ?>
	</div>
	<div class="span10">
		<div id="dashboard-left">
			<?php if (!$this->isJ30) { ?>
				<?php echo $this->loadTemplate('buttons'); ?>
			<?php } ?>
			<?php if ($this->files) { ?>
			<h2><?php echo JText::_('COM_RSFIREWALL_FILES_MODIFIED'); ?></h2>
			<?php echo $this->loadTemplate('files'); ?>
			<?php } ?>
			<?php if ($this->canViewLogs) { ?>
				<?php echo $this->loadTemplate('charts'); ?>
				<h2><?php echo JText::sprintf('COM_RSFIREWALL_LAST_MESSAGES_FROM_SYSTEM_LOG', $this->logNum); ?></h2>
				<?php echo $this->loadTemplate('logs'); ?>
			<?php } ?>
			<h2><?php echo JText::_('COM_RSFIREWALL_FEEDS'); ?></h2>
			<?php echo $this->loadTemplate('feeds'); ?>
		</div>
		<div id="dashboard-right" class="hidden-phone hidden-tablet">
			<?php echo $this->loadTemplate('version'); ?>
		</div>
		
		<div>
			<input type="hidden" name="boxchecked" value="0" />
			<input type="hidden" name="task" value="" />
			<?php echo JHtml::_( 'form.token' ); ?>
		</div>
	</div>
</form>