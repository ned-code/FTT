<?php
/**
* @version 1.4.0
* @package RSFirewall! 1.4.0
* @copyright (C) 2009-2013 www.rsjoomla.com
* @license GPL, http://www.gnu.org/licenses/gpl-2.0.html
*/

class RSFieldset {
	public function startFieldset($legend='', $class='adminform form-horizontal') {
		?>
		<fieldset class="<?php echo $class; ?>">
		<?php if ($legend) { ?>
		<legend><?php echo $legend; ?></legend>
		<?php }
	}
	
	public function showField($label, $input) {
		?>
		<div class="control-group">
			<?php if ($label) { ?>
			<div class="control-label">
				<?php echo $label; ?>
			</div>
			<?php } ?>
			<div<?php if ($label) { ?> class="controls"<?php } ?>>
				<?php echo $input; ?>
			</div>
		</div>
		<?php
	}
	
	public function endFieldset() {
		?>
		</fieldset>
		<?php
	}
}