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
                                    <select class="span2" name="month">
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
                                <li>
                                    <select class="span1" name="month">
                                        <?php
                                            for($i = 1; $i <= 31 ; $i++){
                                                echo '<option value="'.$i.'">'. $i .'</option>';
                                            }
                                        ?>
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

