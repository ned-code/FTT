<?php
defined('_JEXEC') or die;
$famous = FamilyTreeTopFamous::find('all');
$gedcom = GedcomHelper::getInstance();
$tpl_path = JPATH_BASE . DIRECTORY_SEPARATOR . 'components/com_familytreetop/tpl/';
?>
<?php include($tpl_path . "familytreetop-header-init.php"); ?>
<div id="wrap">
    <div id="main" class="clearfix">
        <?php
        $module = JModuleHelper::getModule('ftt_navbar');
        echo JModuleHelper::renderModule($module);
        ?>
        <div class="container">
            <div class="row">
                <div class="span12">
                    <?php include($tpl_path . "familytreetop.view.famous.php"); ?>
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
<?php include($tpl_path . "familytreetop-root.php"); ?>
<?php include($tpl_path . "familytreetop-scripts.php"); ?>
