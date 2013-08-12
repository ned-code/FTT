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
  <th width="20" align="center"></th>
  <th><?php echo JHTML::_('grid.sort', 'COM_LOCALISE_HEADING_LANGUAGES_NAME', 'tag', $this->state->get('list.direction'), $this->state->get('list.ordering')); ?></th>
  <th><?php echo JHTML::_('grid.sort', 'COM_LOCALISE_HEADING_LANGUAGES_CLIENT', 'client', $this->state->get('list.direction'), $this->state->get('list.ordering')); ?></th>
  <th><?php echo JText::_('COM_LOCALISE_HEADING_LANGUAGES_DEFAULT'); ?></th>
  <th><?php echo JText::_('COM_LOCALISE_HEADING_LANGUAGES_FILES'); ?></th>
  <th><?php echo JText::_('COM_LOCALISE_HEADING_LANGUAGES_VERSION'); ?></th>
  <th><?php echo JText::_('COM_LOCALISE_HEADING_LANGUAGES_DATE'); ?></th>
  <th><?php echo JText::_('COM_LOCALISE_HEADING_LANGUAGES_AUTHOR'); ?></th>
</tr>
