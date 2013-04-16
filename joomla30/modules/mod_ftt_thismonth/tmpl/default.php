<?php
defined('_JEXEC') or die;
$months = array('January','February','March','April','May','June','July','August','September','October','November','December');
$date = date('n', strtotime('-1 month'));
?>
<div id="thisMonth" class="row-fluid">
    <div class="span12">
        <div class="well">
            <fieldset>
                <legend>
                    <div class="row-fluid">
                        <div class="span12">
                            <ul class="unstyled inline">
                                <li>This Month</li>
                                <li>
                                    <?php
                                        echo '<select familytreetop="months" class="span12" name="ThisMonth[month]">';
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
                    <div familytreetop="birthdays" class="row-fluid">
                        <div class="offset1 span11">
                            <h5>Birthdays</h5>
                            <hr />
                            <ul class="offset1 unstyled">
                            </ul>
                        </div>
                    </div>
                    <div familytreetop="anniversary" class="row-fluid">
                        <div class="offset1 span11">
                            <h5>Anniversary</h5>
                            <hr />
                            <ul class="offset1 unstyled">
                            </ul>
                        </div>
                    </div>
                    <div familytreetop="weremember" class="row-fluid">
                        <div class="offset1 span11">
                            <h5>We remember</h5>
                            <hr />
                            <ul class="offset1 unstyled">
                            </ul>
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

        var $this = this,
            $month,
            $parent,
            $data,
            $fn;

        $month = '<?=($date + 1);?>';

        $fn = {
            getEventByType: function(type, month){
                return $this.mod('usertree').getEventsByType(type, function(event){
                    if(type == "BIRT"){
                        var events = $this.mod('usertree').getUserEvents(event.gedcom_id);
                        if($this.isExist(events, '$.event.type', 'DEAT')){
                            return false;
                        }
                    }
                    return $this.mod('usertree').isDateInTheEvent(event.id, month, "start_month");
                });
            },
            getData: function(month){
                return {
                    birthdays:$fn.getEventByType('BIRT', month),
                    anniversary:$fn.getEventByType('MARR', month),
                    weremember:$fn.getEventByType('DEAT', month)
                }
            },
            render: function(month){
                $data = $fn.getData(month);
                $fn.setEvents($data, 'birthdays');
                $fn.setEvents($data, 'weremember');
                $fn.setEvents($data, 'anniversary');
                $fn.setPopovers();
            },
            setEvents: function(data, type){
                var parent =  $($parent).find('[familytreetop="'+type+'"]'), ul = $(parent).find('ul');
                if(!data[type] || data[type].length == 0){
                    $(parent).hide();
                    return false;
                } else {
                    $(parent.show());
                }
                $(parent).find('li span[gedcom_id]').unbind();
                $(parent).find('li').remove();
                switch(type){
                    case "birthdays":
                    case "weremember":
                            data[type].forEach(function(e){
                                var li = $('<li style="cursor:pointer;"></li>'),
                                    event = $this.mod('usertree').getEvent(e.id),
                                    user = $this.mod('usertree').user(e.gedcom_id),
                                    sb = $this.stringBuffer(),
                                    html;

                                sb._('<span">')._(event.date.start_day || "")._('</span>');
                                sb._(' ');
                                sb._('<span data-familytreetop-color="')._(user.gender)._('"');
                                    sb._(' gedcom_id="')._(user.gedcom_id)._('">')._(user.shortname());
                                sb._('</span>');

                                html = $(sb.ret());

                                $(li).append(html);
                                $(ul).append(li);
                            });
                        break;

                    case "anniversary":
                            data[type].forEach(function(e){
                                var li = $('<li style="cursor:pointer;"></li>'),
                                    event = $this.mod('usertree').getEvent(e.id),
                                    family = $this.mod('usertree').family(e.family_id),
                                    husb = $this.mod('usertree').user(family.husb),
                                    wife = $this.mod('usertree').user(family.wife),
                                    sb = $this.stringBuffer(),
                                    html;

                                if(!husb || !wife) return false;

                                sb._('<span>')._(event.date.start_day || "")._('</span>');
                                sb._(' ');
                                sb._('<span data-familytreetop-color="')._(husb.gender)._('"');
                                    sb._('" gedcom_id="')._(husb.gedcom_id)._('">')._(husb.shortname());
                                sb._('</span>');
                                sb._(' + ');
                                sb._('<span data-familytreetop-color="')._(wife.gender)._('"');
                                    sb._(' gedcom_id="')._(wife.gedcom_id)._('">')._(wife.shortname());
                                sb._('</span>');

                                html = $(sb.ret());

                                $(li).append(html);
                                $(ul).append(li);

                            });
                        break;

                }
            },
            setPopovers:function(){
                $($parent).find('span[gedcom_id]').each(function(i,el){
                    $this.mod('popovers').render({
                        target: el
                    });
                });
            },
            setMonthSelectChange:function(p){
                $(p).find('[familytreetop="months"]').change(function(){
                    var month = $(this).find('option:selected').val();
                    $fn.render(month);
                });
            }
        }

        $parent = $('#thisMonth');
        $fn.setMonthSelectChange($parent);
        $fn.render($month);
    });
</script>

