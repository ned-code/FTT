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

<tr>
  <th width="20">#</th>
  <th width="20" align="center"><input type="checkbox" name="toggle" value="" onclick="checkAll(this);" /></th>
  <th><?php echo JHTML::_('grid.sort', 'COM_LOCALISE_HEADING_PACKAGES_TITLE', 'title', $this->state->get('list.direction'), $this->state->get('list.ordering')); ?></th>
</tr>
