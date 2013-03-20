<?php
defined('_JEXEC') or die;
$user = FamilyTreeTopUserHelper::getInstance()->get();
?>
<div class="navbar">
    <div class="navbar-inner">
        <?php if($user->famous): ?>
            <a class="btn pull-right" href="<?=JRoute::_("index.php?option=com_familytreetop&task=famous.ext", false);?>" >Exit<a>
        <?php endif;?>
    </div>
</div>