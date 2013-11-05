<?php
defined('_JEXEC') or die;
$months = array(
    'TPL_FAMILYTREETOP_JANUARY',
    'TPL_FAMILYTREETOP_FEBRUARY',
    'TPL_FAMILYTREETOP_MARCH',
    'TPL_FAMILYTREETOP_APRIL',
    'TPL_FAMILYTREETOP_MAY',
    'TPL_FAMILYTREETOP_JUNE',
    'TPL_FAMILYTREETOP_JULY',
    'TPL_FAMILYTREETOP_AUGUST',
    'TPL_FAMILYTREETOP_SEPTEMBER',
    'TPL_FAMILYTREETOP_OCTOBER',
    'TPL_FAMILYTREETOP_NOVEMBER',
    'TPL_FAMILYTREETOP_DECEMBER'
);
$date = date('n', strtotime('-1 month'));
?>
<div id="thisMonth" class="row-fluid">
    <div class="span12">
        <div class="well" familytreetop="module">
            <fieldset>
                <legend>
                    <div class="row-fluid">
                        <div class="span12">
                            <?php
                            echo '<select familytreetop="months" style="margin:0;  width: 130px;" name="ThisMonth[month]">';
                            echo '<option value="0">'.JText::_("TPL_FAMILYTREETOP_ALL_MONTH").'</option>';
                            foreach($months as $key => $month){
                                $option = '<option ';
                                if($key == $date){
                                    $option .= ' selected="selected"';
                                }
                                $option .= ' value="' . ($key + 1);
                                $option .= '">' ;
                                $option .= JText::_($month);;
                                $option .= '</option>';
                                echo $option;
                            }
                            echo '</select>';
                            ?>
                        </div>
                    </div>
                </legend>
            <div class="row-fluid">
                <div class="span12">
                    <div familytreetop="none" class="row-fluid" style="display:none; padding: 20px;">
                        <div style="font-weight: bold; text-align: center; font-size: 18px;"><?=JText::_('MOD_FTT_THISMONTH_NONE_TITLE');?></div>
                        <div style="text-align: center; margin: 20px;"><i class="icon-calendar-empty" style="font-size: 120px;"></i></div>
                        <div style="font-weight: bold; text-align: center; font-size: 18px;"><?=JText::_('MOD_FTT_THISMONTH_NONE_DESCRIPTION');?></div>
                    </div>
                    <div familytreetop="all" class="row-fluid" style="display:none;">
                        <div class="span12">
                            <div familytreetop="subbox">
                                <table style="margin:0;" class="table table-striped table-bordered familytreetop-table familytreetop-table-td">
                                    <thead>
                                        <tr style="background: #efe4b0;">
                                            <td><?=JText::_('MOD_FTT_THISMONTH_DAY');?></td>
                                            <td><?=JText::_('MOD_FTT_THISMONTH_EVENT');?></td>
                                            <td><?=JText::_('MOD_FTT_THISMONTH_NAME');?></td>
                                            <td><?=JText::_('MOD_FTT_THISMONTH_NOTE');?></td>
                                            <td><?=JText::_('MOD_FTT_THISMONTH_RELATION');?></td>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div familytreetop="BIRT" class="row-fluid">
                        <div class="span12">
                            <!--<div style="font-weight:bold; #c3c3c3; padding: 3px; padding-left: 20px;"><i class="icon-large icon-gift"></i>Birthdays</div> -->
                            <table style="margin:0;" class="table table-striped familytreetop-table familytreetop-table-td">
                            </table>
                        </div>
                    </div>
                    <div familytreetop="MARR" class="row-fluid">
                        <div class="span12">
                            <!--<div style="font-weight:bold; background: #c3c3c3; padding: 3px; padding-left: 20px;"><i class="icon-large icon-heart"></i>Anniversary</div>-->
                            <table style="margin:0;" class="table table-striped familytreetop-table familytreetop-table-td"></table>
                        </div>
                    </div>
                    <div familytreetop="DEAT" class="row-fluid">
                        <div class="span12">
                            <!--<div style="font-weight:bold; background: #c3c3c3; padding: 3px; padding-left: 20px;"><i class="icon-large icon-bookmark"></i>We remember</div>-->
                            <table style="margin:0;" class="table table-striped familytreetop-table familytreetop-table-td"></table>
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

