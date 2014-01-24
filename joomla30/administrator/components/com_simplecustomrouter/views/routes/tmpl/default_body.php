<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$canDo = SimpleCustomRouterHelper::getActions();
?>

<?php foreach($this->items as $i => $item): 
    $canEdit = $canDo->get('core.edit');
?>
    <tr class="row<?php echo $i % 2; ?>">
        <td>
            <?php echo $item->id; ?>
        </td>
        <td>
            <?php echo JHtml::_('grid.id', $i, $item->id); ?>
        </td>
        <td>
            <?php if ($canEdit) : ?>
            <a href="<?php echo JRoute::_('index.php?option=com_simplecustomrouter&task=route.edit&id='.(int) $item->id); ?>" title="<?php echo JText::_('COM_SIMPLECUSTOMROUTER_ROUTES_EDIT_TITLE'); ?>">
                <?php echo $this->escape($item->path); ?>
            </a>
            <?php else : ?>
                <?php echo $this->escape($item->path); ?>
            <?php endif; ?>
        </td>
        <td>
            <?php echo $item->query; ?>
        </td>
        <td>
            <?php echo JFactory::getApplication()->getMenu('site')->getItem($item->itemId)->title; ?>
        </td>
    </tr>
<?php endforeach; ?>
