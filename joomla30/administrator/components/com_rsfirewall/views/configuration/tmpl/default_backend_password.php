<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

// set description if required
if (isset($this->fieldset->description) && !empty($this->fieldset->description)) { ?>
	<div class="com-rsfirewall-tooltip"><?php echo JText::_($this->fieldset->description); ?></div>
<?php } ?>
<?php if (!$this->config->get('backend_password')) { ?>
	<div class="com-rsfirewall-not-ok"><p><?php echo JText::_('COM_RSFIREWALL_BACKEND_PASSWORD_IS_NOT_SET'); ?></p></div>
<?php } else { ?>
	<div class="com-rsfirewall-ok"><p><?php echo JText::_('COM_RSFIREWALL_BACKEND_PASSWORD_IS_SET'); ?></p></div>
<?php } ?>
<?php
$this->field->startFieldset();
foreach ($this->fields as $field) {
	$this->field->showField($field->hidden ? '' : $field->label, $field->input);
}
$this->field->endFieldset();