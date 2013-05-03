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
        <div class="well" familytreetop="module">
            <fieldset>
                <legend>Latest Updates</legend>
                <ul class-familytreetop="module-padding" class="unstyled">
                    <?php if($ind): ?>
                    <li><span>Profile Changes</span>: <span style="cursor:pointer;" gedcom_id="<?=$ind->gedcom_id;?>" data-familytreetop-color="<?=$ind->gender;?>"><?=$ind->name();?></span></li>
                    <?php endif; ?>
                </ul>
            </fieldset>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this, $box = $('#latestUpdates');
        $($box).find('[data-familytreetop-color]').each(function(i, el){
            $this.mod('familyline').bind(el, $(el).attr('gedcom_id'));
            $this.mod('popovers').render({
                target: el
            });
        });
    });
</script>
