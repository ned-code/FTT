<?php
defined('_JEXEC') or die;

$gedcom = GedcomHelper::getInstance();

$profile = FamilyTreeTopIndividuals::find(array('order' => 'change_time desc'));
$ind = $gedcom->individuals->get($profile->gedcom_id);
?>
<div id="latestUpdates" class="row">
    <div class="span6">
        <div class="well">
            <fieldset>
                <legend>Latest Updates</legend>
                <ul class="unstyled">
                    <li><span>Profile Changes</span>: <span data-familytreetop-color="<?=$ind->gender;?>"><?=$ind->name();?></span></li>
                </ul>
            </fieldset>
        </div>
    </div>
</div>
