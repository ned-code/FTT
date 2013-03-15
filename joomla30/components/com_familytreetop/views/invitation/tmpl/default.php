<?php
defined('_JEXEC') or die;
$invite = FamilyTreeTopUserHelper::getInstance()->isUserInInvitationsList();
if(!empty($invite)){
    $names = FamilyTreeTopNames::find_by_gedcom_id($invite->gedcom_id);
    $name = $names->first_name . " ".$names->last_name;
}
?>
<div class="row">
    <div class="span12">
        <div class="well text-center">
            <fieldset>
                <legend><?=$name;?></legend>
                <img class="media-object" data-src="template/familytreetop/js/holder.js/100x100">
            </fieldset>

        </div>
    </div>
    <div class="span12">
        <div class="well text-center">
            <a id="add" data-complete-text="Login" data-loading-text="Loading..."  href="#" onclick="return false;" class="btn btn-large">Add to Tree</a>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';

        var $this = this;

        $("#add").click(function(){
            $this.ajax('invite.addToTree', null, function(response){
                if("undefined" !== typeof(response) && response.success){
                    window.location.href = response.redirect;
                } else {
                    $this.error();
                }
            });
        });
    });
</script>