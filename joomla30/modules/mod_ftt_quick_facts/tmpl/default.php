<?php
defined('_JEXEC') or die;

$gedcom = GedcomHelper::getInstance();
$youngest = $gedcom->individuals->getYoungest();
$oldest = $gedcom->individuals->getOldest();
?>
<div id="quickFacts" class="row-fluid">
    <div class="span12">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend>Quick Facts</legend>
                <ul class-familytreetop="module-padding" class="unstyled">
                    <?php if($youngest): ?>
                        <li><span>Youngest</span>: <span style="cursor:pointer;" gedcom_id="<?=$youngest->gedcom_id;?>" data-familytreetop-color="<?=$youngest->gender;?>"><?=$youngest->name();?></span></li>
                    <?php endif; ?>
                    <?php if($oldest): ?>
                        <li><span>Oldest</span>: <span style="cursor:pointer;" gedcom_id="<?=$oldest->gedcom_id;?>" data-familytreetop-color="<?=$oldest->gender;?>"><?=$oldest->name();?></span></li>
                    <?php endif; ?>
                </ul>
            </fieldset>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this, $box = $('#quickFacts');
        $($box).find('[data-familytreetop-color]').each(function(i, el){
            $this.mod('familyline').bind(el, $(el).attr('gedcom_id'));
            $this.mod('popovers').render({
                target: el,
                placement: "left"
            });
        });
    });
</script>