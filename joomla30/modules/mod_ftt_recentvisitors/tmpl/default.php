<?php
defined('_JEXEC') or die;
?>
<div id="recentVisitors" class="row">
    <div class="col-md-12">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend class="familytreetop-module-header"><?=JText::_('MOD_FTT_RECENTVISITORS');?></legend>
                <ul class-familytreetop="module-padding" class="list-unstyled list-inline">
                    <?php foreach($visitors as $visitor): ?>
                        <?php if($visitor['ind']): ?>
                            <li facebook_id="<?=$visitor['account']->facebook_id; ?>" gedcom_id="<?=$visitor['ind']->gedcom_id;?>" style="margin-top:5px;">
                                <div  data-toggle="tooltip"  title="<?=$visitor['ind']->name(); ?>">
                                </div>
                            </li>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </ul>
            </fieldset>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        var $this = this;
        $('#recentVisitors li').each(function(index, el){
            var gedcom_id = $(el).attr('gedcom_id');
            var facebook_id = $(el).attr('facebook_id');
            var user = $FamilyTreeTop.fn.mod('usertree').user(gedcom_id);
            $(el).first().append(user.avatar(['50','50']));
            $this.mod('familyline').bind(el, gedcom_id);
            $this.mod('popovers').render({
                target: el,
                placement: "left"
            });
        });
    });
</script>
