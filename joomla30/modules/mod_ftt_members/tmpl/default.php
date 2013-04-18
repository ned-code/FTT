<?php
defined('_JEXEC') or die;
?>
<div class="row-fluid">
    <div class="span8">
        <div class="well">
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
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <td>Relation</td>
                            <td>Name</td>
                            <td>Birth Year</td>
                            <td>Birth Place</td>
                        </tr>
                    </thead>
                    <tr><td>Cousin</td><td>FirstName LastName</td><td></td><td></td></tr>
                    <tr><td>Cousin</td><td>FirstName LastName</td><td></td><td></td></tr>
                    <tr><td>Cousin</td><td>FirstName LastName</td><td></td><td></td></tr>
                    <tr><td>Cousin</td><td>FirstName LastName</td><td></td><td></td></tr>
                    <tr><td>Cousin</td><td>FirstName LastName</td><td></td><td></td></tr>
                    <tr><td>Cousin</td><td>FirstName LastName</td><td></td><td></td></tr>
                    <tr><td>Cousin</td><td>FirstName LastName</td><td></td><td></td></tr>
                    <tr><td>Cousin</td><td>FirstName LastName</td><td></td><td></td></tr>
                </table>
            </fieldset>
        </div>
    </div>
    <div class="span4">
        <div class="well">
            <fieldset>
                <legend class="text-center">Filter</legend>
                <div class="row-fluid">
                    <div class="span12">
                        <ul class="unstyled">
                            <li>
                                <label class="checkbox">
                                    <input type="checkbox"> 2 Siblings
                                </label>
                            </li>
                            <li>
                                <label class="checkbox">
                                    <input type="checkbox"> 3 Incles
                                </label>
                            </li>
                            <li>
                                <label class="checkbox">
                                    <input type="checkbox"> 2 Aunts
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr>
                <div class="row-fluid">
                    <div class="span12">
                        <div class="btn-group">
                            <button class="btn">Male</button>
                            <button class="btn">Female</button>
                            <button class="btn disabled">Both</button>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12">
                        <div class="btn-group">
                            <button class="btn">Living</button>
                            <button class="btn">Deceased</button>
                            <button class="btn disabled">Both</button>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12">
                        <div class="btn-group">
                            <button class="btn">Ancestors</button>
                            <button class="btn">Descendants</button>
                            <button class="btn disabled">Both</button>
                        </div>
                    </div>
                </div>
                <div class="row-fluid">
                    <div class="span12">
                        <div class="btn-group">
                            <button class="btn">Registered</button>
                            <button class="btn">Unregistered</button>
                            <button class="btn disabled">Both</button>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    </div>
</div>