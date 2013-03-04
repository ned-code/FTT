<?php
defined('_JEXEC') or die;
?>
<div id="recentVisitors" class="row">
    <div class="span6">
        <div class="well">
            <fieldset>
                <legend>Recent Visitors</legend>
                <ul class="unstyled inline">
                    <?php foreach($visitors as $visitor): ?>
                    <li style="display:inline-table;">
                        <div  data-toggle="tooltip"  title="<?=$visitor['ind']->name(); ?>">
                            <img class="img-rounded" src="https://graph.facebook.com/<?=$visitor['account']->facebook_id; ?>/picture"/>
                        </div>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </fieldset>
        </div>
    </div>
</div>
