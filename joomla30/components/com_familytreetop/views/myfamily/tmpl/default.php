<?php
defined('_JEXEC') or die;
jimport('joomla.application.module.helper');
?>
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
        <ul class="nav nav-tabs">
            <li class="active"><a href="#tab1" data-toggle="tab">Bulletin Board</a></li>
            <li><a href="#tab2" data-toggle="tab">Families</a></li>
            <li><a href="#tab3" data-toggle="tab">Descendants</a></li>
            <li><a href="#tab4" data-toggle="tab">Ancestors</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="tab1">
                <?php
                    $module = JModuleHelper::getModule('login');
                    echo JModuleHelper::renderModule($module);
                ?>
            </div>
            <div class="tab-pane" id="tab2">
                <?php
                    $module = JModuleHelper::getModule('ftt_footer');
                    echo JModuleHelper::renderModule($module);
                ?>
            </div>
            <div class="tab-pane" id="tab3">
                <?php
                    $module = JModuleHelper::getModule('login');
                    echo JModuleHelper::renderModule($module);
                ?>
            </div>
            <div class="tab-pane" id="tab4">
                <?php
                    $module = JModuleHelper::getModule('ftt_footer');
                    echo JModuleHelper::renderModule($module);
                ?>
            </div>
        </div>
    </div>
</div>

