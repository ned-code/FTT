<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

//keep session alive while editing
JHtml::_('behavior.keepalive');
JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
?>
<script type="text/javascript">
Joomla.submitbutton = function(task)
{
	if (task == 'configuration.cancel') {
		return Joomla.submitform(task, document.getElementById('component-form'));
	}
	
	// validation is done manually, here:
	
	// backend password validation
	if (isChecked('backend_password_enabled') && getEl('backend_password').value.length > 0) {
		if (getEl('backend_password').value.length < 6) {
			return alert('<?php echo JText::_('COM_RSFIREWALL_BACKEND_PASSWORD_LENGTH_ERROR', true); ?>');
		} else if (getEl('backend_password').value != getEl('backend_password2').value) {
			return alert('<?php echo JText::_('COM_RSFIREWALL_BACKEND_PASSWORDS_DO_NOT_MATCH', true); ?>');
		}
	}
	
	Joomla.submitform(task, document.getElementById('component-form'));
}

var ctrl  = '<?php echo $this->form->getFormControl(); ?>';

function getEl(name, index) {
	var index = parseInt(index) > 0 ? index : 0;
	return document.getElementsByName(ctrl + '[' + name + ']')[index];
}

function isChecked(name, value) {
	if (typeof value == 'undefined') {
		// by default we search for 1
		value = 1;
	}
	
	for (var i=0; i<document.getElementsByName(ctrl + '[' + name + ']').length; i++) {
		var el = document.getElementsByName(ctrl + '[' + name + ']')[i];
		if (el.value == value && el.checked == true) {
			return true;
		}
	}
	
	return false;
}

function checkAllCountries(value) {
	var items = document.getElementsByName('jform[blocked_countries][]');
	for (var i=0; i<items.length; i++) {
		items[i].checked = value;
	}
}
</script>
<form action="<?php echo JRoute::_('index.php?option=com_rsfirewall&view=configuration'); ?>" method="post" name="adminForm" id="component-form" class="form-validate" enctype="multipart/form-data" autocomplete="off">
	<div class="span2">
		<?php echo $this->sidebar; ?>
	</div>
	<div class="span10">
	<?php
	foreach ($this->fieldsets as $name => $fieldset) {
		// add the tab title
		$this->tabs->addTitle($fieldset->label, $fieldset->name);
		
		// prepare the content
		$this->fieldset =& $fieldset;
		$this->fields 	= $this->form->getFieldset($fieldset->name);
		$content = $this->loadTemplate($fieldset->name);
		
		// add the tab content
		$this->tabs->addContent($content);
	}
	
	// render tabs
	$this->tabs->render();
	?>
		<div>
		<?php echo JHtml::_('form.token'); ?>
		<input type="hidden" name="option" value="com_rsfirewall" />
		<input type="hidden" name="task" value="" />
		<input type="hidden" name="controller" value="configuration" />
		</div>
	</div>
</form>