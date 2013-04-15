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
            <div class="tab-pane active" id="tab1">
                <div class="row">
                    <div class="span6">
                        <?php
                        if($user->famous){

                        } else {
                            $module = JModuleHelper::getModule('ftt_myfamily');
                            echo JModuleHelper::renderModule($module);
                        }
                        ?>
                    </div>
                    <div class="span6">
                        <?php
                            if(!$user->famous){
                                $module = JModuleHelper::getModule('ftt_recentvisitors');
                                echo JModuleHelper::renderModule($module);
                            }
                            $module = JModuleHelper::getModule('ftt_thismonth');
                            echo JModuleHelper::renderModule($module);

                            $module = JModuleHelper::getModule('ftt_quick_facts');
                            echo JModuleHelper::renderModule($module);

                            $module = JModuleHelper::getModule('ftt_latest_updates');
                            echo JModuleHelper::renderModule($module);
                        ?>
                    </div>
                </div>
            </div>
            <div class="tab-pane" id="tab2">
                <?php
                    $module = JModuleHelper::getModule('ftt_families');
                    echo JModuleHelper::renderModule($module);
                ?>
            </div>
            <div class="tab-pane" id="tab3">
                <?php
                    $module = JModuleHelper::getModule('ftt_descendants');
                    echo JModuleHelper::renderModule($module);
                ?>
            </div>
            <div class="tab-pane" id="tab4">
                <?php
                    $module = JModuleHelper::getModule('ftt_ancestors');
                    echo JModuleHelper::renderModule($module);
                ?>
            </div>
        </div>
    </div>
</div>

