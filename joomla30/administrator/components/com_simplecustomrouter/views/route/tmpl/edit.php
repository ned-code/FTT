<?php
/**
 * @copyright	Copyright (C) 2012 Daniel Calviño Sánchez
 * @license		GNU Affero General Public License version 3 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JHtml::_('behavior.tooltip');
JHtml::_('behavior.formvalidation');
?>

<form action="<?php echo JRoute::_('index.php?option=com_simplecustomrouter&layout=edit&id='.(int) $this->item->id); ?>" method="post" name="adminForm" id="adminForm" class="form-validate form-horizontal">
    <div>
        <fieldset class="adminform">
            <legend><?php echo JText::_( 'COM_SIMPLECUSTOMROUTER_ROUTE_DETAILS' ); ?></legend>
<?php $hiddenFields = ''; ?>
<?php foreach($this->form->getFieldset('details') as $field): ?>
<?php     if (!$field->hidden): ?>
            <div class="control-group">
                <div class="control-label"><?php echo $field->label; ?></div>
                <div class="controls"><?php echo $field->input; ?></div>
            </div>
<?php     else: ?>
<?php         $hidden_fields .= $field->input; ?>
<?php     endif; ?>
<?php endforeach; ?>
<?php echo $hidden_fields; ?>
        </fieldset>
    </div>
  
    <div>
        <input type="hidden" name="task" value="simplecustomrouter.edit" />
        <?php echo JHtml::_('form.token'); ?>
    </div>
</form>
