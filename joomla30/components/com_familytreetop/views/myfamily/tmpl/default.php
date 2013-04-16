<?php
defined('_JEXEC') or die;
jimport('joomla.application.module.helper');

$user = FamilyTreeTopUserHelper::getInstance()->get();
?>
<script>
    $FamilyTreeTop.dataString = '<?=json_encode(GedcomHelper::getInstance()->getData());?>';
</script>
<div class="row">
    <div class="span12">
        <?php
            $module = JModuleHelper::getModule('ftt_header');
            echo JModuleHelper::renderModule($module);
        ?>
    </div>
</div>
<div class="row">
    <div class="span12">
        <div class="tab-content">
            <div class="tab-pane active" id="bulletin_board">
                <div class="row">
                    <div id="myfamily" class="span6">
                        <?php
                            $module = JModuleHelper::getModule('ftt_myfamily');
                            echo JModuleHelper::renderModule($module);
                        ?>
                    </div>
                    <div id="latest_changes" class="span6">
                        <?php
                            $module = JModuleHelper::getModule('ftt_recentvisitors');
                            echo JModuleHelper::renderModule($module);

                            $module = JModuleHelper::getModule('ftt_quick_facts');
                            echo JModuleHelper::renderModule($module);

                            $module = JModuleHelper::getModule('ftt_latest_updates');
                            echo JModuleHelper::renderModule($module);
                        ?>
                    </div>
                </div>
            </div>
            <div class="tab-pane" style="display:none;" id="calendar">
                <div class="row">
                    <div id="this_month" class="span6">
                        <?php
                            $module = JModuleHelper::getModule('ftt_thismonth');
                            echo JModuleHelper::renderModule($module);
                        ?>
                    </div>
                    <div id="latest_events" class="span6">
                        <?php

                        ?>
                    </div>
                </div>
            </div>
            <div class="tab-pane" style="display:none;" id="members">
                <?php

                ?>
            </div>
            <div class="tab-pane" style="display:none;" id="family_tree">
                <?php
                    $module = JModuleHelper::getModule('ftt_families');
                    echo JModuleHelper::renderModule($module);
                ?>
            </div>
        </div>
    </div>
</div>