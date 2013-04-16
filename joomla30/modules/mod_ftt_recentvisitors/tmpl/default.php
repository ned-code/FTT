<?php
defined('_JEXEC') or die;

?>
<div id="recentVisitors" class="row-fluid">
    <div class="span12">
        <div class="well">
            <fieldset>
                <legend>Recent Visitors</legend>
                <ul class="unstyled inline">
                    <?php foreach($visitors as $visitor): ?>
                    <li gedcom_id="<?=$visitor['ind']->gedcom_id;?>" style="margin-top:5px;">
                        <div  data-toggle="tooltip"  title="<?=$visitor['ind']->name(); ?>">
                            <img style="cursor:pointer;" class="img-rounded" src="https://graph.facebook.com/<?=$visitor['account']->facebook_id; ?>/picture"/>
                        </div>
                    </li>
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
            $this.mod('popovers').render({
                target: el
            });
        });
    });
</script>
