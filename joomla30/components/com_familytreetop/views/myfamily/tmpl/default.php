<?php
defined('_JEXEC') or die;
jimport('joomla.application.module.helper');

$tpl_path = JPATH_BASE . DIRECTORY_SEPARATOR . 'components/com_familytreetop/tpl/';
?>
<?php include($tpl_path . "familytreetop-header-init.php"); ?>
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
            <div class="tab-pane active" familytreetop-tab="1" id="bulletin_board">
                <div class="row">
                    <div id="myfamily" data-familytreetop="span" class="span6">
                        <?php
                            $module = JModuleHelper::getModule('ftt_myfamily');
                            echo JModuleHelper::renderModule($module);
                        ?>
                    </div>
                    <div id="latest_changes" data-familytreetop="span" class="span6">
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
            <div class="tab-pane" familytreetop-tab="1" style="display:none;" id="calendar">
                <div class="row">
                    <div id="this_month" data-familytreetop="span" class="span6">
                        <?php
                            $module = JModuleHelper::getModule('ftt_thismonth');
                            echo JModuleHelper::renderModule($module);
                        ?>
                    </div>
                    <div id="latest_events" data-familytreetop="span" class="span6">
                        <?php
                            $module = JModuleHelper::getModule('ftt_latest_events');
                            echo JModuleHelper::renderModule($module);
                        ?>
                    </div>
                </div>
            </div>
            <div class="tab-pane" familytreetop-tab="1" style="display:none;" id="members">
                <?php
                    $module = JModuleHelper::getModule('ftt_members');
                    echo JModuleHelper::renderModule($module);
                ?>
            </div>
            <div class="tab-pane" familytreetop-tab="1" style="display:none;" id="family_tree">
                <?php
                    $module = JModuleHelper::getModule('ftt_families');
                    echo JModuleHelper::renderModule($module);
                ?>
            </div>
        </div>
    </div>
</div>
<?php include($tpl_path . "familytreetop-root.php"); ?>
<?php include($tpl_path . "familytreetop-scripts.php"); ?>
