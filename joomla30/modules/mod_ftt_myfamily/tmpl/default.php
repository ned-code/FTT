<?php
defined('_JEXEC') or die;
$fhelper = FacebookHelper::getInstance();
$user = FamilyTreeTopUserHelper::getInstance()->get();

$data = array();

if($user->facebook_id != 0){
   $data = $fhelper->getFacebookNewsFeed($user->tree_id, $user->facebook_id);
}
?>
<div id="myFamilyOnFacebook" class="row-fluid">
    <div class="span12">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend class="text-center"><?=JText::_('MOD_FTT_MYFAMILY_TITLE');?></legend>
                <?php if(!empty($data)): ?>
                    <div class="row-fluid">
                        <div class="span12">
                            <table style="margin:0;" class="table"></table>
                        </div>
                    </div>
                <?php else: ?>
                    <div style="text-align: center;padding: 10px;">
                        <div style="font-weight: bold;"><?=JText::_('MOD_FTT_MYFAMILY_NULL_TITLE');?></div>
                        <div><a href="https://facebook.com/<?=$user->username;?>" target="_blank" style="text-decoration: none;"><i class="icon-facebook-sign familytreetop-icon-muted" style="font-size:120px;"></i></a></div>
                        <div><?=JText::_('MOD_FTT_MYFAMILY_NULL_DESCRIPTION');?></div>
                    </div>
                <?php endif; ?>
            </fieldset>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        $FamilyTreeTop.fn.mod('myfamily').render(<?=json_encode($data);?>);
    });
</script>