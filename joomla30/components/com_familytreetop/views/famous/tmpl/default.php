<?php
defined('_JEXEC') or die;
$famous = FamilyTreeTopFamous::find('all');
?>
<div class="row">
    <div class="span12">
        <?php foreach($famous as $family): ?>
            <?php $user = GedcomHelper::getInstance()->individuals->getFromDb($family->tree_id,$family->gedcom_id); ?>
            <div class="row-fluid">
                <div class="span12">
                     <div class="well">
                        <fieldset>
                            <legend><?=$user->name()?></legend>
                            <button id="<?=$family->tree_id;?>" class="btn">Login by</button>
                        </fieldset>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

