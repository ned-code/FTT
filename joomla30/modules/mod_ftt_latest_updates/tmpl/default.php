<?php
defined('_JEXEC') or die;

$gedcom = GedcomHelper::getInstance();

$profile = $gedcom->individuals->getLastUpdatedProfile();
if($profile){
    $ind = $gedcom->individuals->get($profile->gedcom_id);
}

?>
<div id="latestUpdates" class="row-fluid">
    <div class="span12">
        <div class="well">
            <fieldset>
                <legend>Latest Updates</legend>
                <ul class="unstyled">
                    <?php if($ind): ?>
                    <li><span>Profile Changes</span>: <span data-familytreetop-color="<?=$ind->gender;?>"><?=$ind->name();?></span></li>
                    <?php endif; ?>
                </ul>
            </fieldset>
        </div>
    </div>
</div>
