<?php
?>
<div data-familytreetop-box="famous" class="row">
    <div class="span12">
        <?php foreach($famous as $family): ?>
            <?php $user = $gedcom->individuals->getFromDb($family->tree_id,$family->gedcom_id); ?>
            <div class="row-fluid">
                <div class="span12">
                    <div class="well">
                        <fieldset>
                            <legend>
                                <div class="row-fluid">
                                    <div class="span2"><img class="media-object" data-src="template/familytreetop/js/holder.js/50x50"></div>
                                    <div class="span6"><?=$user->name()?></div>
                                    <div class="span2">
                                        <a data-familytreetop-button
                                           href="<?=JRoute::_("index.php?option=com_familytreetop&task=famous.init"
                                               ."&tree_id=".$family->tree_id
                                               ."&gedcom_id=".$family->gedcom_id,
                                               false);?>"
                                           class="btn">Login</a>
                                    </div>
                                </div>
                            </legend>
                            <ul class="unstyled">
                                <li>Members: <?=$gedcom->getTreeMembersCount($family->tree_id);?></li>
                            </ul>
                        </fieldset>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>
