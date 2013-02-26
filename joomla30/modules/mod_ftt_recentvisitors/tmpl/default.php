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
                        <div data-toggle="tooltip" title="<?=$visitor->first_name . " " .$visitor->last_name ?>">
                            <img src="http://placehold.it/50x50" />
                        </div>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </fieldset>
        </div>
    </div>
</div>
