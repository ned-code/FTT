<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

class RSFieldset {
	public function startFieldset($legend='', $class='adminform') {
		?>
		<fieldset class="<?php echo $class; ?>">
			<?php if ($legend) { ?>
			<legend><?php echo $legend; ?></legend>
			<?php } ?>
			<ul class="config-option-list">
		<?php
	}
	
	public function showField($label, $input) {
		?>
		<li>
			<?php echo $label; ?>
			<?php echo $input; ?>
		</li>
		<?php
	}
	
	public function endFieldset() {
		?>
			</ul>
		</fieldset>
		<div class="clr"></div>
		<?php
	}
}