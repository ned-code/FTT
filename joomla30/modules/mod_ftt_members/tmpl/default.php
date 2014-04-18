<?php
defined('_JEXEC') or die;
$filterButtonsWidth = 100;
?>
<div id="members" class="row">
    <div class="col-md-8">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend class="familytreetop-module-header">
                    <div class="row">
                        <div class="col-md-12">
                            <div style="position:relative;" class="text-center">
                                <span><?=JText::_('MOD_FTT_MEMBERS_FAMILY_MEMBERS');?></span>
                                <div style="position:absolute;top: 4px;right: 4px;">
                                    <input type="text" class="form-control" placeholder="Search"><i class="fa fa-search" style="position:absolute; right: 7px;top: 7px;"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </legend>
                <table id="membersTable" style="margin:0;" class="table table-striped table-bordered familytreetop-table familytreetop-table-td">
                    <thead>
                        <tr style="background: #efe4b0;">
                            <td><a style="cursor:pointer;" familytreetop="sort" familytreetop-type="Relation"><?=JText::_('MOD_FTT_MEMBERS_THEAD_RELATION');?></a></td>
                            <td><a style="cursor:pointer;" familytreetop="sort" familytreetop-type="Name"><?=JText::_('MOD_FTT_MEMBERS_THEAD_NAME');?></a></td>
                            <td><a style="cursor:pointer;" familytreetop="sort" familytreetop-type="Year"><?=JText::_('MOD_FTT_MEMBERS_THEAD_BIRTH_YEAR');?></a></td>
                            <td><a style="cursor:pointer;" familytreetop="sort" familytreetop-type="Place"><?=JText::_('MOD_FTT_MEMBERS_THEAD_BRITH_PLACE');?></a></td>
                        </tr>
                    </thead>
                </table>
            </fieldset>
        </div>
    </div>
    <div id="filterMembers" class="col-md-4">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend class="text-center familytreetop-module-header"><?=JText::_('MOD_FTT_MEMBERS_FILTER');?></legend>
                <div class="row">
                    <div class="col-md-12">
                        <ul style="margin: 0 auto;width: 260px;" class-familytreetop="module-padding" class="list-unstyled list-familytreetop">
                            <li familytreetop="immediate_family"><label class="checkbox"><input type="checkbox" checked><span familytreetop="count">0</span> <span><?=JText::_('MOD_FTT_MEMBERS_IMMEDIATE_FAMILY');?></span></label></li>
                            <li familytreetop="grandparents"><label class="checkbox"><input type="checkbox" checked><span familytreetop="count">0</span> <span><?=JText::_('MOD_FTT_MEMBERS_GRANDPARENTS');?></span></label></li>
                            <li familytreetop="grandchildren"><label class="checkbox"><input type="checkbox" checked><span familytreetop="count">0</span> <span><?=JText::_('MOD_FTT_MEMBERS_GRANDCHILDREN');?></span></label></li>
                            <li familytreetop="cousins"><label class="checkbox"><input type="checkbox" checked><span familytreetop="count">0</span> <span><?=JText::_('MOD_FTT_MEMBERS_COUSIN');?></span></label></li>
                            <li familytreetop="in_laws"><label class="checkbox"><input type="checkbox" checked><span familytreetop="count">0</span> <span><?=JText::_('MOD_FTT_MEMBERS_IN_LAWS');?></span></label></li>
                            <li familytreetop="unknown"><label class="checkbox"><input type="checkbox" checked><span familytreetop="count">0</span> <span><?=JText::_('MOD_FTT_MEMBERS_UNKNOWN');?></span></label></li>
                        </ul>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="btn-group" style="padding: 5px;">
                            <button type="button" familytreetop-button="members" familytreetop="gender:male" class="btn btn-default" ><?=JText::_('MOD_FTT_MEMBERS_MALE');?></button>
                            <button type="button" familytreetop-button="members" familytreetop="gender:female" class="btn btn-default" ><?=JText::_('MOD_FTT_MEMBERS_FEMALE');?></button>
                            <button type="button" familytreetop-button="members" familytreetop="gender:both" class="btn btn-success"  ><?=JText::_('MOD_FTT_MEMBERS_BOTH');?></button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="btn-group" style="padding: 5px;">
                            <button type="button" familytreetop-button="members" familytreetop="living:yes" class="btn btn-default" ><?=JText::_('MOD_FTT_MEMBERS_LIVING');?></button>
                            <button type="button" familytreetop-button="members" familytreetop="living:no" class="btn btn-default" ><?=JText::_('MOD_FTT_MEMBERS_DEACEASE');?></button>
                            <button type="button" familytreetop-button="members" familytreetop="living:both" class="btn btn-success"  ><?=JText::_('MOD_FTT_MEMBERS_BOTH');?></button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="btn-group" style="padding: 5px;">
                            <button type="button" familytreetop-button="members" familytreetop="members:ancestors" class="btn btn-default" ><?=JText::_('MOD_FTT_MEMBERS_ANCESTORS');?></button>
                            <button type="button" familytreetop-button="members" familytreetop="members:descendants" class="btn btn-default" ><?=JText::_('MOD_FTT_MEMBERS_DESCENDANTS');?></button>
                            <button type="button" familytreetop-button="members" familytreetop="members:both" class="btn btn-success"  ><?=JText::_('MOD_FTT_MEMBERS_BOTH');?></button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 text-center">
                        <div class="btn-group" style="padding: 5px;">
                            <button type="button" familytreetop-button="members" familytreetop="registered:yes" class="btn btn-default"><?=JText::_('MOD_FTT_MEMBERS_REGISTERED');?></button>
                            <button type="button" familytreetop-button="members" familytreetop="registered:no" class="btn btn-default" ><?=JText::_('MOD_FTT_MEMBERS_UNREGISTRED');?></button>
                            <button type="button" familytreetop-button="members" familytreetop="registered:both" class="btn btn-success" ><?=JText::_('MOD_FTT_MEMBERS_BOTH');?></button>
                        </div>
                    </div>
                </div>
                <hr>
            </fieldset>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        $FamilyTreeTop.fn.mod('members').init();
    });
</script>