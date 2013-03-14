<?php
defined('_JEXEC') or die;
$user = FamilyTreeTopUserHelper::getInstance()->get();
?>
<div id="families" class="row">
    <div class="span12">

    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        this.mod('families').render({
            parent: $('#families .span12')
        });
    });
</script>
