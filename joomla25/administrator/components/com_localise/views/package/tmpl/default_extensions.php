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

echo $this->pane->startPanel($this->panel_title, $this->panel . "-page");
?>

<table class="adminlist">
  <thead>
    <?php echo $this->loadTemplate('header'); ?>
  </thead>
  <tfoot>
    <?php echo $this->loadTemplate('footer'); ?>
  </tfoot>
  <tbody>
    <?php echo $this->loadTemplate('body'); ?>
  </tbody>
</table>
<?php echo $this->pane->endPanel();
