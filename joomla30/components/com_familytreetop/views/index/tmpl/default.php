<?php
defined('_JEXEC') or die;
$tpl_path = JPATH_BASE . DIRECTORY_SEPARATOR . 'components/com_familytreetop/tpl/';
?>
<div class="row-fluid">
    <div class="span6 hidden-phone text-center">
        <img src="<?=$this->baseurl;?>/components/com_familytreetop/images/index.logo.jpg">
    </div>
    <div class="span6">
        <div class="row-fluid hidden-phone">
            <div class="span12 text-center">
                <h3>Welcome to Family TreeTop</h3>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span12 text-center">
                <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=myfamily", false); ?>" class="btn btn-large btn-primary">My Family Tree</a>
                <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=famous", false); ?>" class="btn btn-large btn-info">Famous Family</a>
            </div>
        </div>
    </div>
    <div class="span6 visible-phone text-center">
        <img src="<?=$this->baseurl;?>/components/com_familytreetop/images/index.logo.jpg">
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';


    });
</script>
<?php include($tpl_path . "familytreetop-root.php"); ?>
<?php include($tpl_path . "familytreetop-scripts.php"); ?>