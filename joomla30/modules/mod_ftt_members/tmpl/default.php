<?php
defined('_JEXEC') or die;

$filterButtonsWidth = 100;
?>
<div id="members" class="row-fluid">
    <div class="span8">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend>
                    <div class="row-fluid">
                        <div class="span12">
                            <div style="position:relative;" class="text-center">
                                <span><?=JText::_('MOD_FTT_MEMBERS_FAMILY_MEMBERS');?></span>
                                <div style="position:absolute;top: 0;right: 0;">
                                    <input type="text" class="input-medium search-query"><i class="icon-search" style="position:absolute; right: 10px;top: 14px;"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </legend>
                <table id="membersTable" class="table table-striped familytreetop-table">
                    <thead>
                        <tr>
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
    <div id="filterMembers" class="span4 visible-desktop">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend class="text-center"><?=JText::_('MOD_FTT_MEMBERS_FILTER');?></legend>
                <div class="row-fluid">
                    <div class="span12">
                        <ul class-familytreetop="module-padding" class="unstyled">
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
                <div class="row-fluid">
                    <div class="span12 text-center">
                        <div class="btn-group" style="padding: 5px;">
                            <button familytreetop="gender:male" class="btn" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_MALE');?></button>
                            <button familytreetop="gender:female" class="btn" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_FEMALE');?></button>
                            <button familytreetop="gender:both" class="btn disabled" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_BOTH');?></button>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12 text-center">
                        <div class="btn-group" style="padding: 5px;">
                            <button familytreetop="living:yes" class="btn" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_LIVING');?></button>
                            <button familytreetop="living:no" class="btn" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_DEACEASE');?></button>
                            <button familytreetop="living:both" class="btn disabled" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_BOTH');?></button>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12 text-center">
                        <div class="btn-group" >
                            <button familytreetop="members:ancestors" class="btn" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_ANCESTORS');?></button>
                            <button familytreetop="members:descendants" class="btn" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_DESCENDANTS');?></button>
                            <button familytreetop="members:both" class="btn disabled" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_BOTH');?></button>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12 text-center">
                        <div class="btn-group">
                            <button familytreetop="registered:yes" class="btn" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_REGISTERED');?></button>
                            <button familytreetop="registered:no" class="btn" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_UNREGISTRED');?></button>
                            <button familytreetop="registered:both" class="btn disabled" style="width:<?=$filterButtonsWidth?>px;"><?=JText::_('MOD_FTT_MEMBERS_BOTH');?></button>
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