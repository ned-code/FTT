<?php
defined('_JEXEC') or die;

?>
<div id="descendants" class="row-fluid">
    <div class="span6">
        <div familytreetop="tree" class="well"></div>
    </div>
    <div class="span4">
        <div familytreetop="info" class="well">

        </div>
        <hr>
    </div>
</div>

<script>
    $FamilyTreeTop.bind(function(){
        'use strict';

        var $this = this,
            $usermap,
            $start_id,
            $tree,
            $html,
            $activeSpan,
            $fn;


        $fn = {
            getStartId:function(id){
                var parent_id, grandparent_id;
                parent_id = $this.mod('usertree').getExistParentById(id);
                if(parent_id){
                    grandparent_id = $this.mod('usertree').getExistParentById(parent_id);
                    if(grandparent_id){
                        return grandparent_id;
                    }
                    return parent_id;
                }
                return false;
            },
            getTree:function(id){
                var common_id = $fn.getStartId(id);
                if(!common_id){
                    return false;
                }
                return $fn.setNode(common_id);
            },
            setNode:function(gedcom_id){
                var node = { id: null, spouses: null };
                node.id = gedcom_id;
                node.spouses = $this.mod('usertree').getSpouses(gedcom_id);
                node.spouses = node.spouses.map(function(spouse_id){
                    var childrens = $this.mod('usertree').getChildrens(spouse_id);
                    childrens = childrens.map(function(child_id){
                        return $fn.setNode(child_id);
                    });
                    return {
                        id: spouse_id,
                        childrens: childrens
                    };
                });
                return node;
            },
            setUser:function(html){
                var user = $this.mod('usertree').usermap();
                $(html).find('span[familytreetop][gedcom_id="'+user.gedcom_id+'"]').click();
            },
            click:function(html){
                $(html).find('span[familytreetop]').click(function(){
                    if($(this).hasClass('active')) return false;
                    if("undefined" !== typeof($activeSpan) || $activeSpan){
                        $($activeSpan).removeClass('active');
                    }
                    $($activeSpan = this).addClass('active');
                    $fn.render($activeSpan);
                });
            },
            span:function(object){
                return '<span gedcom_id="'+object.gedcom_id+'" familytreetop="'+object.gender+'" id="'+object.gedcom_id+'">'+object.name()+'</span>';
            },
            string: function(ind1, ind2){
                return $fn.span(ind1) + '+' + $fn.span(ind2);
            },
            li:function(parent, object, prefix, index){
                var li = $('<li></li>'),
                    label = $('<label></label>'),
                    ind = $this.mod('usertree').user(object.id),
                    id = prefix + '-' + index;

                if(object.childrens.length != 0){
                    $(li).append('<input checked type="checkbox" id="'+id+'" />');
                    $(label).html($fn.string(parent, ind));
                    $(label).attr('familytreetop', parent.gender);
                    $(li).append(label);
                    object.childrens.forEach(function(child, index){
                        $(li).append($fn.ul(child, prefix + '-' + index));
                    });
                } else {
                    $(li).html($fn.string(li, parent, ind));
                }
                return li;
            },
            ul:function(object, prefix){
                var ul = $('<ul></ul>'),
                    ind = $this.mod('usertree').user(object.id);

                if(object.spouses.length == 0){
                    $(ul).append('<li><span familytreetop="child_'+ind.gender+'"></span><span gedcom_id="'+ind.gedcom_id+'" familytreetop="'+ind.gender+'">'+ ind.name() +'</span></li>');
                } else {
                    object.spouses.forEach(function(spouse, index){
                        $(ul).append($fn.li(ind, spouse, prefix, index));
                    });
                }
                return ul;
            },
            render:function(span){
                var div = $('#popover').clone(),
                    items = $(div).find('li'),
                    gedcom_id = $(span).attr('gedcom_id'),
                    ind = $this.mod('usertree').user(gedcom_id);

                $(items[0]).find('span').text(ind.first_name);
                $(items[1]).find('span').text(ind.middle_name);
                $(items[2]).find('span').text(ind.last_name);
                $(items[3]).find('span').text(ind.know_as);

                $('#descendants [familytreetop="info"]').html('').append(div);
            }
        }

        $usermap = $this.mod('usertree').usermap();
        $start_id = $usermap.gedcom_id;

        if($start_id == null){
            return false;
        }

        $tree = $fn.getTree($start_id);
        if(!$tree){
            return false;
        }

        $html = $('<div class="css-treeview"></div>');
        $($html).append($fn.ul($tree, 'index-0'));
        $('#descendants [familytreetop="tree"]').append($html);
        $fn.click($html);
        $fn.setUser($html);
    });
</script>