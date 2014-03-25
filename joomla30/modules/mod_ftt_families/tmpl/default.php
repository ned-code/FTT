<?php
defined('_JEXEC') or die;
?>
<div id="families" class="row">
    <div class="col-md-12">
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        this.mod('families').render({
            parent: $('#families .col-md-12')
        });
    });
</script>
