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
            getData: function(){
                return $this.mod('usertree').getEventsByType('BIRT', function(event){
                    console.log($this.mod('usertree').isDateInTheEvent(event.id, $month, "start_month"), event);
                    return $this.mod('usertree').isDateInTheEvent(event.id, $month, "start_month");
                });
            },
            setMonthSelectChange:function(p){
                $(p).find('[familytreetop="months"]').change(function(){
                    console.log(this);
                });
            }
        }

        $parent = $('#thisMonth');
        $fn.setMonthSelectChange($parent);

        $data = $fn.getData();
        console.log($data);


    });
</script>

