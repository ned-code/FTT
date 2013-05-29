<?php
defined('_JEXEC') or die;

?>
<div id="latest_events" class="row-fluid">
    <div class="span12">
        <div class="row-fluid">
            <div class="span12">
                <div class="well" familytreetop="module">
                    <fieldset>
                        <legend>Latest Births</legend>
                    </fieldset>
                    <table style="margin:0;" id="latestBriths" class="table table-striped familytreetop-table familytreetop-table-td">
                    </table>
                </div>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span12">
                <div class="well" familytreetop="module">
                    <fieldset>
                        <legend>Latest Marriages</legend>
                    </fieldset>
                    <table style="margin:0;" id="latestMarriages" class="table table-striped familytreetop-table familytreetop-table-td">
                    </table>
                </div>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span12">
                <div class="well" familytreetop="module">
                    <fieldset>
                        <legend>Latest Deaths</legend>
                    </fieldset>
                    <table style="margin:0;" id="latestDeaths" class="table table-striped familytreetop-table familytreetop-table-td">
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