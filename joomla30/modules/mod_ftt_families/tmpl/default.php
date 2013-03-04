<?php
defined('_JEXEC') or die;
$user = FamilyTreeTopUserHelper::getInstance()->get();
?>
<div id="thisMonth" class="row">
    <div class="span12">
        <div id="hideBox" style="display:none">
            <div class="parent-box" style="max-width: 100px;">
                <div>
                    <img class="img-polaroid" data-src="template/familytreetop/js/holder.js/100x100">
                </div>
                <div class="text-center">name</div>
                <div class="text-center">date</div>
            </div>
            <div class="child-box" style="max-width: 60px;">
                <div>
                    <img class="img-polaroid" data-src="template/familytreetop/js/holder.js/60x60">
                </div>
                <div class="text-center name"></div>
                <div class="text-center date"></div>
            </div>
        </div>


    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';

        var $this = this, $start_id, $childrens, $family, $fn, $parentBox, $childBox;

        $fn = {

        }

        $start_id = '<?=$user->gedcom_id;?>';

        if($start_id == null){
            return false;
        }

        $childrens = $this.mod('usertree').getChildrens($start_id);
        if($childrens.length == 0){
            $family = $this.mod('usertree').getParents($start_id);
            $childrens = $this.mod('usertree').getChildrensByFamily($family.family_id);
        } else {
            $family = $this.mod('usertree').getFamilyIdByGedcomId($start_id);
        }

        $parentBox = $('#thisMonth #hideBox .parent-box');
        $childBox = $('#thisMonth #hideBox .child-box'); 

    });
</script>
