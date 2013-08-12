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
JHtml::_('stylesheet','com_localise/localise.css', null, true);
$parts = explode('-', $this->state->get('translation.reference'));
$src = $parts[0];
$parts = explode('-', $this->state->get('translation.tag'));
$dest = $parts[0];
$document = JFactory::getDocument();
$document->addScript('http://www.google.com/jsapi');
$document->addScriptDeclaration("
if (typeof(Localise) === 'undefined') {
  Localise = {};
}
Localise.language_src = '".$src."';
Localise.language_dest = '".$dest."';
");
$fieldSets = $this->form->getFieldsets();
$sections = $this->form->getFieldsets('strings');
$ftpSets = $this->formftp->getFieldsets();
JText::script('COM_LOCALISE_BINGTRANSLATING_NOW');
?>
<script type="text/javascript">
  var bingTranslateComplete = false, translator;
  var Localise = {};
  Localise.language_src = '<?php echo $src;?>';
  Localise.language_dest = '<?php echo $dest;?>';

  function AzureTranslator(obj, targets, i, token, transUrl){
    if(translator && !translator.status){
      alert(Joomla.JText._('COM_LOCALISE_BINGTRANSLATING_NOW'));
      return false;
    }

    var idname = obj.getProperty('rel');
    var d = {
      'option':'com_localise',
      'view':'translator',
      'format':'json',
      'id':'<?php echo $this->form->getValue('id');?>',
      'from':'<?php echo $src;?>',
      'to':'<?php echo $dest;?>',
      'text':document.id(idname+'text').value
    };
    d[token] = 1;
    translator = new Request({
      method:'post',
      url:'index.php',
      data:d,
      onSuccess:function(res){
        res = JSON.decode(res);
        if(res.success){
          document.id(idname).value = res.text;
        }

        if(targets && targets.length > (i+1)){
          AzureTranslator(targets[i+1], targets, i+1, token);
          document.id(document.body).scrollTo(0, document.id(targets[i+1]).getCoordinates().top-150);
        } else {
          bingTranslateComplete = false;
          if(targets.length > 1)
            document.id(document.body).scrollTo();
        }
      }
    }).post();
  }

  function returnAll()
  {
    $$('img.return').each(function(e){
      if(e.click)
        e.click();
      else
        e.onclick();
    });
  }

  function translateAll()
  {
    if(bingTranslateComplete){
      alert(Joomla.JText._('COM_LOCALISE_BINGTRANSLATING_NOW'));
      return false;
    }

    bingTranslateComplete = true;
    var targets = $$('img.translate');
    AzureTranslator(targets[0], targets, 0, '<?php echo JSession::getFormToken();?>');
  }

  if (typeof(google) !== 'undefined')
  {
    google.load('language', '1');
    google.setOnLoadCallback(null);
  }
  Joomla.submitbutton = function(task) {
    if (task == 'translation.cancel' || document.formvalidator.isValid(document.id('localise-translation-form'))) {
      Joomla.submitform(task, document.getElementById('localise-translation-form'));
    } else {
      alert('<?php echo $this->escape(JText::_('JGLOBAL_VALIDATION_FORM_FAILED'));?>');
    }
  }
</script>

<form action="<?php JRoute::_('index.php?option=com_localise'); ?>" method="post" name="adminForm" id="localise-translation-form" class="form-validate">
  <?php if ($this->ftp) : ?>
  <fieldset class="panelform">
    <legend><?php echo JText::_($ftpSets['ftp']->label); ?></legend>
    <?php if (!empty($ftpSets['ftp']->description)):?>
    <p class="tip"><?php echo JText::_($ftpSets['ftp']->description); ?></p>
    <?php endif;?>
    <?php if (JError::isError($this->ftp)): ?>
    <p class="error"><?php echo JText::_($this->ftp->message); ?></p>
    <?php endif; ?>
    <ul class="adminformlist">
      <?php foreach($this->formftp->getFieldset('ftp',false) as $field): ?>
      <li> <?php echo $field->label; ?> <?php echo $field->input; ?> </li>
      <?php endforeach; ?>
    </ul>
  </fieldset>
  <?php endif; ?>
  <fieldset class="panelform">
    <?php echo JHtml::_('tabs.start', 'com_localise_legend_tabs', array('useCookie'=>true));?> <?php echo JHtml::_('tabs.panel', JText::_($fieldSets['default']->label), 'default');?>
    <?php if (!empty($fieldSets['default']->description)):?>
    <p class="tip"><?php echo JText::_($fieldSets['default']->description); ?></p>
    <?php endif;?>
    <ul class="adminformlist">
      <?php foreach($this->form->getFieldset('default') as $field): ?>
      <li> <?php echo $field->label; ?> <?php echo $field->input; ?> </li>
      <?php endforeach; ?>
    </ul>
    <div class="clr"></div>
    <?php echo JHtml::_('tabs.panel', JText::_('COM_LOCALISE_FIELDSET_TRANSLATION_STRINGS'), 'strings');?>
    <div class="key"> <?php echo JHtml::_('sliders.start', 'com_localise_legend_translation', array('allowAllClose'=>true, 'startOffset'=>-1, 'useCookie'=>true));?> <?php echo JHtml::_('sliders.panel', JText::_($fieldSets['legend']->label), 'legend');?>
      <?php if (!empty($fieldSets['legend']->description)):?>
      <p class="tip"><?php echo JText::_($fieldSets['legend']->description); ?></p>
      <?php endif;?>
      <ul class="adminformlist">
        <?php foreach($this->form->getFieldset('legend') as $field): ?>
        <li> <?php echo $field->label; ?> <?php echo $field->input; ?> </li>
        <?php endforeach; ?>
      </ul>
      <?php echo JHtml::_('sliders.end');?>
      <div id="translationbar"> <a href="javascript:void(0);" onclick="translateAll();" class="Button"><span><?php echo JText::_('COM_LOCALISE_BUTTON_TRANSLATE_ALL');?></span></a> <a href="javascript:void(0);" onclick="returnAll();" class="retbtn"><span><?php echo JText::_('COM_LOCALISE_BUTTON_RESET_ALL');?></span></a>
        <div class="clr"></div>
      </div>
      <?php if(count($sections)>1):?>
      <?php echo JHtml::_('sliders.start','localise-translation-sliders', array('useCookie'=>1)); ?>
      <?php foreach ($sections as $name => $fieldSet) :?>
      <?php echo JHtml::_('sliders.panel',$fieldSet->label, $name.'-options');?>
      <ul class="adminformlist">
        <?php foreach ($this->form->getFieldset($name) as $field) :?>
        <li> <?php echo $field->label; ?> <?php echo $field->input; ?> </li>
        <?php endforeach;?>
      </ul>
      <?php endforeach;?>
      <?php echo JHtml::_('sliders.end'); ?>
      <?php else:?>
      <ul class="adminformlist">
        <?php $sections = array_keys($sections);?>
        <?php foreach ($this->form->getFieldset($sections[0]) as $field) :?>
        <li> <?php echo $field->label; ?> <?php echo $field->input; ?> </li>
        <?php endforeach;?>
      </ul>
      <?php endif;?>
    </div>
    <div class="clr"></div>
    <?php echo JHtml::_('tabs.panel', JText::_($fieldSets['permissions']->label), 'permissions');?>
    <?php if (!empty($fieldSets['permissions']->description)):?>
    <p class="tip"><?php echo JText::_($fieldSets['permissions']->description); ?></p>
    <?php endif;?>
    <ul class="adminformlist">
      <?php foreach($this->form->getFieldset('permissions') as $field): ?>
      <li> <?php echo $field->label; ?> <?php echo $field->input; ?> </li>
      <?php endforeach; ?>
    </ul>
    <div class="clr"></div>
    <?php echo JHtml::_('tabs.end');?>
  </fieldset>
  <div>
    <input type="hidden" name="task" value="" />
    <?php echo JHtml::_('form.token'); ?> </div>
</form>
