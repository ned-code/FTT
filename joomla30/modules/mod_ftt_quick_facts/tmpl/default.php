<?php
defined('_JEXEC') or die;

$gedcom = GedcomHelper::getInstance();
$youngest = $gedcom->individuals->getYoungest();
$oldest = $gedcom->individuals->getOldest();

?>
<div id="quickFacts" class="row">
    <div class="span6">
        <div class="well">
            <fieldset>
                <legend>Quick Facts</legend>
                <ul class="unstyled">
                    <?php if($youngest): ?>
                        <li><span>Youngest</span>: <span data-familytreetop-color="<?=$youngest->gender;?>"><?=$youngest->name();?></span></li>
                    <?php endif; ?>
                    <?php if($oldest): ?>
                        <li><span>Oldest</span>: <span data-familytreetop-color="<?=$oldest->gender;?>"><?=$oldest->name();?></span></li>
                    <?php endif; ?>
                </ul>
            </fieldset>
        </div>
    </div>
</div>
