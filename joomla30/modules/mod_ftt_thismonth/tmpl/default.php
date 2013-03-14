<?php
defined('_JEXEC') or die;
$months = array('January','February','March','April','May','June','July','August','September','October','November','December');
$date = date('n', strtotime('-1 month'));
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
                                    <?php
                                        echo '<select familytreetop="months" class="span2" name="ThisMonth[month]">';
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

                   </div>
               </div>
            </fieldset>
        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';

        var $this = this,
            $month,
            $parent,
            $data,
            $fn;

        $month = '<?=($date + 1);?>';

        $fn = {
            getEventByType: function(type){
                return $this.mod('usertree').getEventsByType(type, function(event){
                    return $this.mod('usertree').isDateInTheEvent(event.id, $month, "start_month");
                });
            },
            getData: function(){
                return {
                    birt:$fn.getEventByType('BIRT'),
                    deat:$fn.getEventByType('DEAT'),
                    marr:$fn.getEventByType('MARR')
                }
            },
            setMonthSelectChange:function(p){
                $(p).find('[familytreetop="months"]').change(function(){
                });
            }
        }

        $parent = $('#thisMonth');
        $fn.setMonthSelectChange($parent);

        $data = $fn.getData();


    });
</script>

