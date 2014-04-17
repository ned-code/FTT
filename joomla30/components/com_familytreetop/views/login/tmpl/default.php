<?php
defined('_JEXEC') or die;
$session = JFactory::getSession();
$user = FamilyTreeTopUserHelper::getInstance()->get();
$tpl_path = JPATH_BASE . DIRECTORY_SEPARATOR . 'components/com_familytreetop/tpl/';

?>
<?php include($tpl_path . "familytreetop-header-init.php"); ?>
<?php include($tpl_path . "familytreetop-root.php"); ?>
<?php include($tpl_path . "familytreetop-scripts.php"); ?>
    <div id="wrap">
        <div id="main" class="clearfix">
            <?php
            $module = JModuleHelper::getModule('ftt_navbar');
            echo JModuleHelper::renderModule($module);
            ?>
            <div class="container">
                <div class="row">
                    <div class="span12">
                        <?php include($tpl_path . "familytreetop.view.login.php"); ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="footer">
        <div class="container" style="text-align: center;">
            <?php
            $module = JModuleHelper::getModule('ftt_footer');
            echo JModuleHelper::renderModule($module);
            ?>
        </div>
    </div>
<?php include($tpl_path . "familytreetop-init.php"); ?>