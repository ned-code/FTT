<?php
defined('_JEXEC') or die;
jimport('joomla.application.module.helper');
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
        <ul id="familyTreeTopTabs" class="nav nav-tabs">
            <li class="active"><a href="#tab1" data-toggle="tab">Bulletin Board</a></li>
            <li><a href="#tab2" data-toggle="tab">Families</a></li>
            <li><a href="#tab3" data-toggle="tab">Descendants</a></li>
            <li><a href="#tab4" data-toggle="tab">Ancestors</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="tab1">
                <div class="row">
                    <div class="span6">

                        <?php
                        $module = JModuleHelper::getModule('ftt_myfamily');
                        echo JModuleHelper::renderModule($module);
                        ?>
                    </div>
                    <div class="span6">
                        <?php
                            $module = JModuleHelper::getModule('ftt_recentvisitors');
                            echo JModuleHelper::renderModule($module);
                        ?>
                        <?php
                        $module = JModuleHelper::getModule('ftt_thismonth');
                        echo JModuleHelper::renderModule($module);
                        ?>
                        <?php
                        $module = JModuleHelper::getModule('ftt_quick_facts');
                        echo JModuleHelper::renderModule($module);
                        ?>
                        <?php
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

