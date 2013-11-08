<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

defined('_JEXEC') or die('Restricted access');

// current name we're looking for
$name = $this->name ? '&name='.$this->name : '';
// settings
$allowfolders 	= $this->allowFolders ? '&allowfolders=1' : '';
$allowfiles 	= $this->allowFiles ? '&allowfiles=1' : '';
?>

<script type="text/javascript">
function addFile() {
	<?php if ($this->name) { ?>
	if (window.opener) {
		var textbox = window.opener.document.getElementsByName('jform[<?php echo addslashes($this->escape($this->name)); ?>]')[0];
		
		for (var i=0 ;i<document.getElementsByName('cid[]').length; i++) {
			if (document.getElementsByName('cid[]')[i].checked) {
				var file = document.getElementsByName('cid[]')[i].value;
				
				if (textbox.value.length > 0) {
					textbox.value += '\n' + file;
				} else  {
					textbox.value = file;
				}
			}
		}
	}
	<?php } ?>
}
</script>

<div id="com-rsfirewall-explorer">
	<p>
		<button onclick="addFile();" class="btn btn-primary"><?php echo JText::_('COM_RSFIREWALL_ADD_SELECTED_ITEMS'); ?></button>
		<button onclick="window.close();" class="btn btn-secondary"><?php echo JText::_('COM_RSFIREWALL_CLOSE_FILE_MANAGER'); ?></button>
	</p>
	<div id="com-rsfirewall-explorer-header">
		<strong><?php echo JText::_('COM_RSFIREWALL_CURRENT_LOCATION'); ?></strong>
		<?php foreach ($this->elements as $element) { ?>
			<a href="<?php echo JRoute::_('index.php?option=com_rsfirewall&view=folders&tmpl=component'.$name.$allowfolders.$allowfiles.'&folder='.urlencode($element->fullpath)); ?>"><?php echo $this->escape($element->name); ?></a> <?php echo $this->DS; ?>
		<?php } ?>
	</div>
	<ul>
		<?php if ($this->previous) { ?>
		<li>
			<?php if ($this->allowFolders) { ?>
				<input type="checkbox" disabled="disabled" />
			<?php } ?>
			<span class="com-rsfirewall-icon-16-folder"></span>
			<a href="<?php echo JRoute::_('index.php?option=com_rsfirewall&view=folders&tmpl=component'.$name.$allowfolders.$allowfiles.'&folder='.urlencode($this->previous)); ?>">..</a>
		</li>
		<?php } ?>
	<?php foreach ($this->folders as $folder) { ?>
		<?php $fullpath = $this->path.$this->DS.$folder; ?>
		<li>
			<?php if ($this->allowFolders) { ?>
				<input type="checkbox" name="cid[]" value="<?php echo $this->escape($fullpath); ?>" />
			<?php } ?>
			<span class="com-rsfirewall-icon-16-folder"></span>
			<a href="<?php echo JRoute::_('index.php?option=com_rsfirewall&view=folders&tmpl=component'.$allowfolders.$allowfiles.$name.'&folder='.urlencode($fullpath)); ?>"><?php echo $this->escape($folder); ?></a>
		</li>
	<?php } ?>
	<?php foreach ($this->files as $i => $file) { ?>
		<?php $fullpath = $this->path.$this->DS.$file; ?>
		<li>
			<?php if ($this->allowFiles) { ?>
				<input type="checkbox" id="file<?php echo $i; ?>" name="cid[]" value="<?php echo $this->escape($fullpath); ?>" />
			<?php } ?>
			<span class="com-rsfirewall-icon-16-file"></span>
			<label for="file<?php echo $i; ?>"><?php echo $this->escape($file); ?></label>
		</li>
	<?php } ?>
	</ul>
	<p><button onclick="addFile();" class="btn btn-primary"><?php echo JText::_('COM_RSFIREWALL_ADD_SELECTED_ITEMS'); ?></button></p>
</div>