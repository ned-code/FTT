<?php
defined('_JEXEC') or die;

?>
<div class="row-fluid">
    <div class="span12">
        <div class="row-fluid">
            <div class="span12">
                <div class="well">
                    <fieldset>
                        <legend>Latest Births</legend>
                    </fieldset>
                    <table id="latestBriths" class="table table-striped">
                    </table>
                </div>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span12">
                <div class="well">
                    <fieldset>
                        <legend>Latest Marriages</legend>
                    </fieldset>
                    <table id="latestMarriages" class="table table-striped">
                    </table>
                </div>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span12">
                <div class="well">
                    <fieldset>
                        <legend>Latest Deaths</legend>
                    </fieldset>
                    <table id="latestDeaths" class="table table-striped">
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        $FamilyTreeTop.fn.mod('latest_events').init(<?=GedcomHelper::getInstance()->events->getLatestEvents();?>);
    });
</script>