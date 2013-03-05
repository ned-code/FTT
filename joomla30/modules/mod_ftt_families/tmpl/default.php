<?php
defined('_JEXEC') or die;
$user = FamilyTreeTopUserHelper::getInstance()->get();
?>
<div id="thisMonth" class="row">
    <div class="span12">
        <div style="position:absolute; top:0; right: 0; cursor: pointer;"><i class="icon-home"></i></div>
        <div id="hideBox" style="display:none">
            <div class="parent-box" style="max-width: 160px;">
                <div style="position:relative;">
                    <img class="img-polaroid" data-src="template/familytreetop/js/holder.js/150x150">
                </div>
                <div class="text-center"></div>
                <div class="text-center"></div>
            </div>
            <div class="child-box" style="max-width: 110px;">
                <div>
                    <img class="img-polaroid" data-src="template/familytreetop/js/holder.js/100x100">
                </div>
                <div class="text-center"></div>
                <div class="text-center"></div>
            </div>

        </div>
    </div>
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';

        var $this = this, $start_id, $childrens, $family, $fn, $parentBox, $childBox, $boxs;

        $parentBox = $('#thisMonth #hideBox .parent-box');
        $childBox = $('#thisMonth #hideBox .child-box');
        $boxs = [];

        $fn = {
            createArrow: function(type){
                var left = Math.ceil(((type  == 'up')?160:110)/2) - 7;
                return $('<div style="position:absolute;left:'+left+'px;top: -20px; cursor:pointer;"><i class="icon-circle-arrow-'+type+'"></i></div>');

            },
            createEdit: function(object, gedcom_id){
                $this.mod('editmenu').render(object, gedcom_id);
            },
            createBox: function(ind, cl, type){
                if(!ind) return [];
                var divs = $(cl).find('div');
                $(cl).attr('gedcom_id', ind.gedcom_id);
                $(divs[0]).append($fn.createArrow(type));
                $(divs[0]).find('img').attr('gedcom_id', ind.gedcom_id);
                $(divs[1]).text(ind.name());
                $(divs[2]).text('...');
                $fn.createEdit(divs[0], ind.gedcom_id);
                return cl;
            },
            createParent: function(id){
                var ind = $this.mod('usertree').user(id);
                var cl = $($parentBox).clone();
                return $fn.createBox(ind, cl, 'up');
            },
            createChild: function(id){
                var ind = $this.mod('usertree').user(id);
                var cl = $($childBox).clone();
                return $fn.createBox(ind, cl, 'down');
            },
            createEvent: function(){
                return $('<div>...</div>');
            },
            append: function(box){
                $boxs.push(box);
                $('#thisMonth .span12').append(box);
            },
            setPosition: function(boxs){
                boxs.forEach(function(object, index){
                    $(object).css('position', 'absolute');
                    switch(index){
                        case 0:
                        case 1:
                            $(object).css('top', getTop(index)).css((index)?"left":"right", '25%');
                            break;

                        case 2:
                            $(object).css('top', getEventTop()).css((index)?"left":"right", '50%');
                            break;

                        default:
                            $(object).css('top', getTop(index)).css("left", getLeft(index));
                            break;
                    }
                });
                $('#thisMonth .span12').css('position', 'relative').css('min-height', getMinHeight());
                return true;
                function getRows(){
                    var length = boxs.length - 3;
                    var width = $('.tab-content').width();
                    var limit = Math.ceil(width / (120 * length));
                    var rows = Math.ceil(length/limit);
                    return [Math.round(length/rows), limit, width];
                }
                function getMinHeight(){
                    var height = (getRows()[0] * 200);
                    return height * 0.1 + 250 + height;
                }
                function getEventTop(){
                    var height = getMinHeight();
                    return height * 0.1 + 70;
                }
                function getTop(index){
                    var height = getMinHeight();
                    if(index < 3){
                        return height * 0.1;
                    } else {
                        var objectHeight = $(boxs[0]).height();
                        var rows = getRows();
                        var row = Math.ceil((index - 2)/rows[0]);
                        return height * 0.1 + 250 + 110*(row - 1);
                    }

                }
                function getLeft(index){
                    var length = boxs.length - 3,
                        len = index - 2,
                        rows = getRows(),
                        row = Math.ceil(len / rows[0]),
                        indent = 0,
                        position;
                    if(row == rows[0] && length != rows[1]){
                        indent = Math.round((rows[2] - length * 110) / 2);
                    }
                    if(row == 1){
                        position = len;
                    } else {
                        position = rows[1]*row - len;
                    }
                    return 5 + (position - 1) * 110 + indent;
                }
            },
            setPopovers:function(boxs){
                boxs.forEach(function(object, index){
                    var target = $(object).find('img');
                    $this.mod('popovers').render({
                        target: target
                    });
                });
            }
        }

        $start_id = '<?=$user->gedcom_id;?>';

        if($start_id == null){
            return false;
        }

        $childrens = $this.mod('usertree').getChildrens($start_id);
        if($childrens.length == 0){
            $family = $this.mod('usertree').getParents($start_id);
            $childrens = $this.mod('usertree').getChildrensByFamily($family.family_id);
        } else {
            $family = $this.mod('usertree').getFamilyIdByGedcomId($start_id);
        }

        $fn.append($fn.createParent($family.father));
        $fn.append($fn.createParent($family.mother));
        $fn.append($fn.createEvent());

        $childrens.forEach(function(gedcom_id){
            $fn.append($fn.createChild(gedcom_id));
        });

        $fn.setPosition($boxs);
        $fn.setPopovers($boxs);

    });
</script>
