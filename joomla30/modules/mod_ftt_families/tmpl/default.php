<?php
defined('_JEXEC') or die;
$user = FamilyTreeTopUserHelper::getInstance()->get();
?>
<div id="thisMonth" class="row">
    <div class="span12">

    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        this.mod('families').render({
            parent: $('#thisMonth .span12')
        });
    });
</script>
