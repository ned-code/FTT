<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

JHtml::_('behavior.keepalive');
JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
?>
<script type="text/javascript">
Joomla.submitbutton = function(task)
{
	if (task == 'list.cancel' || document.formvalidator.isValid(document.id('adminForm'))) {
		if (document.getElementById('adminForm')['jform[ips]'].value.indexOf('*.*.*.*') > -1) {
			alert('<?php echo JText::_('COM_RSFIREWALL_IP_MASK_ERROR', true); ?>');
		} else {
			Joomla.submitform(task, document.getElementById('adminForm'));
		}
	} else {
		alert('<?php echo $this->escape(JText::_('COM_RSFIREWALL_PLEASE_COMPLETE_ALL_FIELDS'));?>');
	}
}
</script>

<div class="com-rsfirewall-tooltip"><?php echo JText::sprintf('COM_RSFIREWALL_YOUR_IP_ADDRESS_IS', $this->escape($this->ip)); ?></div>
<form action="<?php echo JRoute::_('index.php?option=com_rsfirewall&view=list&layout=bulk'); ?>" method="post" name="adminForm" id="adminForm" class="form-validate" enctype="multipart/form-data">
	<?php
	$legend = JText::_('COM_RSFIREWALL_ADDING_NEW_IP_BULK');
	$this->field->startFieldset($legend);
	foreach ($this->form->getFieldset() as $field) {
		$this->field->showField($field->hidden ? '' : $field->label, $field->input);
	}
	$this->field->endFieldset();
	?>
	
	<div>
		<input type="hidden" name="task" value="" />
		<?php echo JHtml::_('form.token'); ?>
	</div>
</form>