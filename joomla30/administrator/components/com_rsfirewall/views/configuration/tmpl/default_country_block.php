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
	<div class="com-rsfirewall-tooltip"><?php echo JText::_($this->fieldset->description); ?><br />
	<a href="http://www.rsjoomla.com/support/documentation/view-article/738-how-do-i-use-country-blocking-and-where-do-i-get-geoipdat-.html" target="_blank"><?php echo JText::_('COM_RSFIREWALL_GEOIP_DOCUMENTATION_LINK'); ?></a></div>
	<?php if (!$this->geoip->native) { ?>
		<?php if (!$this->geoip->uploaded) { ?>
		<div class="com-rsfirewall-not-ok"><p><?php echo JText::sprintf('COM_RSFIREWALL_GEOIP_DB_NOT_FOUND', $this->geoip->path); ?></p></div>
		<?php } else { ?>
		<div class="com-rsfirewall-ok"><p><?php echo JText::sprintf('COM_RSFIREWALL_GEOIP_DB_FOUND', $this->geoip->path); ?></p></div>
		<?php } ?>
	<?php } ?>
<?php } ?>
<?php
$this->field->startFieldset();
foreach ($this->fields as $field) {
	if ($field->fieldname == 'geoip_upload' && $this->geoip->native) {
		continue;
	}
	
	$this->field->showField($field->hidden ? '' : $field->label, $field->input);
}
$this->field->endFieldset();