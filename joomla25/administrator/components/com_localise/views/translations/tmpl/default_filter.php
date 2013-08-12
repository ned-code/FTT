<?php
/*------------------------------------------------------------------------
# com_localise - Localise
# ------------------------------------------------------------------------
# author    Mohammad Hasani Eghtedar <m.h.eghtedar@gmail.com>
# copyright Copyright (C) 2010 http://joomlacode.org/gf/project/com_localise/. All Rights Reserved.
# @license - http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
# Websites: http://joomlacode.org/gf/project/com_localise/
# Technical Support:  Forum - http://joomlacode.org/gf/project/com_localise/forum/
-------------------------------------------------------------------------*/
// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' );
?>

<fieldset id="filter-bar" style="height: auto;">
  <div class="filter-search fltlft">
    <?php foreach($this->form->getFieldset('search') as $field): ?>
    <?php echo $field->label; ?> <?php echo $field->input; ?>
    <?php endforeach; ?>
  </div>
  <br />
  <div class="filter-select fltrt">
    <?php foreach($this->form->getFieldset('select') as $field): ?>
    <?php echo $field->label; ?> <?php echo $field->input; ?>
    <?php endforeach; ?>
  </div>
</fieldset>
<div class="clr"></div>
