<?php
defined('_JEXEC') or die;
$months = array('January','February','March','April','May','June','July','August','September','October','November','December');
$date = date('n', strtotime('-1 month'));
?>
<div id="thisMonth" class="row-fluid">
    <div class="span12">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend>
                    <div class="row-fluid">
                        <div class="span12">
                            <ul class="unstyled inline">
                                <li>This Month</li>
                                <li>
                                    <?php
                                        echo '<select familytreetop="months" class="span12" name="ThisMonth[month]">';
                                        echo '<option value="0">All Months</option>';
                                        foreach($months as $key => $month){
                                            $option = '<option ';
                                            if($key == $date){
                                                $option .= ' selected="selected"';
                                            }
                                            $option .= ' value="' . ($key + 1);
                                            $option .= '">' ;
                                            $option .= $month;
                                            $option .= '</option>';
                                            echo $option;
                                        }
                                        echo '</select>';
                                    ?>

                                </li>
                            </ul>
                        </div>
                    </div>
                </legend>
            <div class="row-fluid">
                <div class="span12">
                    <div familytreetop="all" class="row-fluid">

                    </div>
                    <div familytreetop="birthdays" class="row-fluid">
                        <div class="span12">
                            <div style="background: #c3c3c3; padding: 3px; padding-left: 20px;"><i class="icon-gift"></i>Birthdays</div>
                            <table style="margin:0;" class="table table-striped familytreetop-table"></table>
                        </div>
                    </div>
                    <div familytreetop="anniversary" class="row-fluid">
                        <div class="span12">
                            <div style="background: #c3c3c3; padding: 3px; padding-left: 20px;"><i class="icon-gift"></i>Anniversary</div>
                            <table style="margin:0;" class="table table-striped familytreetop-table"></table>
                        </div>
                    </div>
                    <div familytreetop="weremember" class="row-fluid">
                        <div class="span12">
                            <div style="background: #c3c3c3; padding: 3px; padding-left: 20px;"><i class="icon-gift"></i>We remember</div>
                            <table style="margin:0;" class="table table-striped familytreetop-table"></table>
                        </div>
                    </div>
                </div>
            </div>
            </fieldset>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';
        $FamilyTreeTop.fn.mod('this_month').init('<?=($date + 1);?>');
    });
</script>

