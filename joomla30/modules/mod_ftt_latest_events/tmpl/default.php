<?php
defined('_JEXEC') or die;

?>
<div id="latest_events" class="row">
    <div class="col-md-12">
        <div class="row">
            <div class="col-md-12">
                <div class="well" familytreetop="module">
                    <fieldset>
                        <legend class="familytreetop-module-header"><?=JText::_('MOD_FTT_LATEST_EVENTS_BIRTHS');?></legend>
                    </fieldset>
                    <table style="margin:0;" id="latestBriths" class="table table-striped familytreetop-table familytreetop-table-td">
                    </table>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="well" familytreetop="module">
                    <fieldset>
                        <legend class="familytreetop-module-header"><?=JText::_('MOD_FTT_LATEST_EVENTS_MARRIAGES');?></legend>
                    </fieldset>
                    <table style="margin:0;" id="latestMarriages" class="table table-striped familytreetop-table familytreetop-table-td">
                    </table>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="well" familytreetop="module">
                    <fieldset>
                        <legend class="familytreetop-module-header"><?=JText::_('MOD_FTT_LATEST_EVENTS_DEATHS');?></legend>
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
        $FamilyTreeTop.fn.mod('latest_events').init(<?=GedcomHelper::getInstance()->events->getLatestEvents();?>, <?php
        echo json_encode(array('none' => JText::_('MOD_FTT_LATEST_EVENTS_NONE_TO_SHOW')))
 ?>);
    });
</script>