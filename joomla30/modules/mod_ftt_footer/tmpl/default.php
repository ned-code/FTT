<?php
defined('_JEXEC') or die;
//About – Terms – Privacy – Help - Contact
$settings = FamilyTreeTopSettingsHelper::getInstance()->get();
$template = $settings->_template->value;
?>
<?php if($template == "familytreetop"): ?>
    <hr>
    <ul class="unstuled inline">
        <li><a href="<?=JRoute::_("index.php?option=com_familytreetop&view=myfamily", false);?>">Home</a></li>
        <li><a href="<?=JRoute::_("index.php?option=com_content&view=article&id=1", false);?>">About</a></li>
        <li><a href="<?=JRoute::_("index.php?option=com_content&view=article&id=2", false);?>">Terms</a></li>
        <li><a href="<?=JRoute::_("index.php?option=com_content&view=article&id=4", false);?>">Privacy</a></li>
        <li><a href="<?=JRoute::_("index.php?option=com_content&view=article&id=5", false);?>">Help</a></li>
        <li><a href="<?=JRoute::_("index.php?option=com_flexicontactplus&view=contact", false);?>">Contact</a></li>
    </ul>
<?php else: ?>
    <hr>
    <ul class="unstuled inline">
        <li><a href="<?=JRoute::_("index.php?option=com_familytreetop&view=myfamily", false);?>">Home</a></li>
        <li><a href="<?=JRoute::_("index.php?option=com_content&view=article&id=10", false);?>">About</a></li>
        <li><a href="<?=JRoute::_("index.php?option=com_content&view=article&id=11", false);?>">Terms</a></li>
        <li><a href="<?=JRoute::_("index.php?option=com_content&view=article&id=14", false);?>">Privacy</a></li>
        <li><a href="<?=JRoute::_("index.php?option=com_content&view=article&id=12", false);?>">Help</a></li>
        <li><a href="<?=JRoute::_("index.php?option=com_flexicontactplus&view=contact", false);?>">Contact</a></li>
    </ul>
<?php endif; ?>

