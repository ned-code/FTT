<?php
defined('_JEXEC') or die;
?>
<div id="members" class="row-fluid">
    <div class="span8">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend>
                    <div class="row-fluid">
                        <div class="span12">
                            <div class="text-center">
                                <span>Family Members</span>
                                <div class="pull-right" style="position:relative">
                                    <input type="text" class="input-medium search-query"><i class="icon-search" style="position:absolute; right: 10px;top: 14px;"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </legend>
                <table id="membersTable" class="table table-striped">
                    <thead>
                        <tr>
                            <td><a familytreetop="sort">Relation</a></td>
                            <td><a familytreetop="sort">Name</a></td>
                            <td><a familytreetop="sort">Birth Year</a></td>
                            <td class="visible-desktop"><a familytreetop="sort">Birth Place</a></td>
                        </tr>
                    </thead>
                </table>
            </fieldset>
        </div>
    </div>
    <div id="filterMembers" class="span4 visible-desktop">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend class="text-center">Filter</legend>
                <div class="row-fluid">
                    <div class="span12">
                        <ul class-familytreetop="module-padding" class="unstyled">
                            <li familytreetop="immediate_family"><label class="checkbox"><input type="checkbox"><span familytreetop="count">0</span> <span>Immediate</span> Family</label></li>
                            <li familytreetop="grandparents"><label class="checkbox"><input type="checkbox"><span familytreetop="count">0</span> <span>Grandparents</span></label></li>
                            <li familytreetop="grandchildren"><label class="checkbox"><input type="checkbox"><span familytreetop="count">0</span> <span>Grandchildren</span></label></li>
                            <li familytreetop="cousins"><label class="checkbox"><input type="checkbox"><span familytreetop="count">0</span> <span>Cousins</span></label></li>
                            <li familytreetop="in_laws"><label class="checkbox"><input type="checkbox"><span familytreetop="count">0</span> <span>In-Laws</span></label></li>
                            <li familytreetop="unknown"><label class="checkbox"><input type="checkbox"><span familytreetop="count">0</span> <span>Unknown</span></label></li>

                        </ul>
                    </div>
                </div>
                <hr>
                <div class="row-fluid">
                    <div class="span12 text-center">
                        <div class="btn-group" style="padding: 5px;">
                            <button class="btn">Male</button>
                            <button class="btn">Female</button>
                            <button class="btn disabled">Both</button>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12 text-center">
                        <div class="btn-group" style="padding: 5px;">
                            <button class="btn">Living</button>
                            <button class="btn">Deceased</button>
                            <button class="btn disabled">Both</button>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12 text-center">
                        <div class="btn-group" >
                            <button class="btn">Ancestors</button>
                            <button class="btn">Descendants</button>
                            <button class="btn disabled">Both</button>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12 text-center">
                        <div class="btn-group">
                            <button class="btn">Registered</button>
                            <button class="btn">Unregistered</button>
                            <button class="btn disabled">Both</button>
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