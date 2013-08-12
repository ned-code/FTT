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

JHtml::_('behavior.tooltip');
JHtml::_('stylesheet','com_localise/localise.css', null, true);
?>

<form action="<?php echo JRoute::_('index.php?option=com_localise&view=languages');?>" method="post" name="adminForm" id="adminForm">
  <?php echo $this->loadTemplate('filter'); ?>
  <table class="adminlist">
    <thead>
      <?php echo $this->loadTemplate('head'); ?>
    </thead>
    <tfoot>
      <?php echo $this->loadTemplate('foot'); ?>
    </tfoot>
    <tbody>
      <?php echo $this->loadTemplate('body'); ?>
    </tbody>
  </table>
  <input type="hidden" name="boxchecked" value="0" />
  <input type="hidden" name="task" value="" />
  <input type="hidden" name="filter_order" value="" />
  <input type="hidden" name="filter_order_Dir" value="<?php echo $this->state->get('list.direction'); ?>" />
  <?php echo JHtml::_('form.token'); ?>
</form>
