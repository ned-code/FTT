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
JHtml::_('behavior.formvalidation');
$fieldSets = $this->form->getFieldsets();
$ftpSets = $this->formftp->getFieldsets();
?>
<script type="text/javascript">
<!--
  function submitbutton(task)
  {
    if (task == 'package.cancel' || document.formvalidator.isValid(document.id('localise-package-form'))) {
      submitform(task);
    }
    else {
      alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED'));?>');
    }
  }
// -->
</script>

<form action="<?php JRoute::_('index.php?option=com_localise'); ?>" method="post" name="adminForm" id="localise-package-form" class="form-validate">
  <?php if ($this->ftp) : ?>
  <fieldset class="adminform">
    <legend><?php echo JText::_($ftpSets['ftp']->label); ?></legend>
    <?php if (!empty($ftpSets['ftp']->description)):?>
    <p class="tip"><?php echo JText::_($ftpSets['ftp']->description); ?></p>
    <?php endif;?>
    <?php if (JError::isError($this->ftp)): ?>
    <p class="error"><?php echo JText::_($this->ftp->message); ?></p>
    <?php endif; ?>
    <ul class="adminformlist">
      <?php foreach($this->formftp->getFieldset('ftp',false) as $field): ?>
      <?php if ($field->hidden): ?>
      <?php echo $field->input; ?>
      <?php else:?>
      <li> <?php echo $field->label; ?> <?php echo $field->input; ?> </li>
      <?php endif; ?>
      <?php endforeach; ?>
    </ul>
  </fieldset>
  <?php endif; ?>
  <div class="width-50 fltlft">
    <fieldset class="adminform">
      <legend><?php echo JText::_($fieldSets['default']->label); ?></legend>
      <?php if (!empty($fieldSets['default']->description)):?>
      <p class="tip"><?php echo JText::_($fieldSets['default']->description); ?></p>
      <?php endif;?>
      <ul class="adminformlist">
        <?php foreach($this->form->getFieldset('default') as $field): ?>
        <?php if ($field->hidden): ?>
        <?php echo $field->input; ?>
        <?php else:?>
        <li> <?php echo $field->label; ?> <?php echo $field->input; ?> </li>
        <?php endif; ?>
        <?php endforeach; ?>
      </ul>
    </fieldset>
    <fieldset class="adminform">
      <legend><?php echo JText::_($fieldSets['permissions']->label); ?></legend>
      <?php if (!empty($fieldSets['permissions']->description)):?>
      <p class="tip"><?php echo JText::_($fieldSets['permissions']->description); ?></p>
      <?php endif;?>
      <ul class="adminformlist">
        <?php foreach($this->form->getFieldset('permissions') as $field): ?>
        <?php if ($field->hidden): ?>
        <?php echo $field->input; ?>
        <?php else:?>
        <li> <?php echo $field->label; ?> <?php echo $field->input; ?> </li>
        <?php endif; ?>
        <?php endforeach; ?>
      </ul>
    </fieldset>
  </div>
  <div class="width-50 fltrt">
    <fieldset class="adminform">
      <legend><?php echo JText::_($fieldSets['translations']->label); ?></legend>
      <?php if (!empty($fieldSets['translations']->description)):?>
      <p class="tip"><?php echo JText::_($fieldSets['translations']->description); ?></p>
      <?php endif;?>
      <ul class="adminformlist">
        <?php foreach($this->form->getFieldset('translations') as $field): ?>
        <?php if ($field->hidden): ?>
        <?php echo $field->input; ?>
        <?php else:?>
        <li> <?php echo $field->label; ?> <?php echo $field->input; ?> </li>
        <?php endif; ?>
        <?php endforeach; ?>
      </ul>
    </fieldset>
  </div>
  <input type="hidden" name="task" value="" />
  <?php echo JHtml::_('form.token'); ?>
</form>
