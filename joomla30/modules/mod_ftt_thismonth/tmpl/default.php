<?php
defined('_JEXEC') or die;

?>
<div id="thisMonth" class="row">
    <div class="span6">
        <div class="well">
            <fieldset>
                <legend>
                    <div class="row">
                        <div class="span5">
                            <ul class="unstyled inline">
                                <li>This Month</li>
                                <li>
                                    <select familytreetop="months" class="span2" name="ThisMonth[month]">
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </li>
                            </ul>
                        </div>
                    </div>
                </legend>
            </fieldset>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';

        var $this = this,
            $parent,
            $fn;

        $fn = {
            setMonthSelectChange:function(select){
                $(select).change(function(){

                });
            },
            setMonthsSelect:function(p){
                var select = $(p).find('[familytreetop="months"]');
                //$(select).find('option[value="'+((new Date()).getMonth() + 1)+'"]').attr('selected', "selected");
                //console.log($(select).find('option[value="'+((new Date()).getMonth() + 1)+'"]'));
                $fn.setMonthSelectChange(select);
            }
        }

        $parent = $('#thisMonth');

        $fn.setMonthsSelect($parent);

    });
</script>

