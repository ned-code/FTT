<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
?>

<tr>
    <th width="1%" class="nowrap">
        <?php echo JHtml::_('grid.sort', 'COM_SIMPLECUSTOMROUTER_ROUTES_HEADING_ID', 'id', $this->listDirection, $this->listOrder); ?>
    </th>
    <th width="1%">
        <input type="checkbox" name="toggle" value="" onclick="checkAll(<?php echo count($this->items); ?>);" />
    </th>
    <th width="38%">
        <?php echo JHtml::_('grid.sort', 'COM_SIMPLECUSTOMROUTER_ROUTES_HEADING_PATH', 'path', $this->listDirection, $this->listOrder); ?>
    </th>
    <th width="38%">
        <?php echo JHtml::_('grid.sort', 'COM_SIMPLECUSTOMROUTER_ROUTES_HEADING_QUERY', 'query', $this->listDirection, $this->listOrder); ?>
    </th>
    <th width="22%">
        <?php echo JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_HEADING_ITEMID'); ?>
    </th>
</tr>
