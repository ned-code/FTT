<?php
defined('_JEXEC') or die;
?>
<div class="row-fluid">
    <div class="span6">
        <img src="<?=$this->baseurl;?>/components/com_familytreetop/images/index.logo.jpg">
    </div>
    <div class="span6">
        <div class="row-fluid">
            <div class="span12 text-center">
                <h3>Welcome to Family TreeTop</h3>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span12 text-center">
               <hr>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span12 text-center">
                <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=myfamily", false); ?>" class="btn btn-large btn-primary">My Family Tree</a>
                <a href="<?=JRoute::_("index.php?option=com_familytreetop&view=famous", false); ?>" class="btn btn-large btn-info">Famous Family</a>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span12 text-center">
                <hr>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span12 text-center">
                <img src="<?=$this->baseurl;?>/components/com_familytreetop/images/index.ipad.png">
            </div>
        </div>
    </div>
</div>
