<?php
defined('_JEXEC') or die;

?>
<div id="descendants" class="row-fluid">
    <div class="span6">
        <div familytreetop="tree" class="well">
            <!--
            <div class="css-treeview">
                <ul>
                    <li>
                        <input checked type="checkbox" id="item-0" />
                        <label for="item-0">
                            <?php
                            $parents = $tree['parents'];
                            echo $parents['father']->name() . " + " . $parents['mother']->name();
                            ?>
                        </label>
                        <ul>
                            <li>
                                <?php
                                echo $tree['childrens'][0]->name();
                                ?>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        -->
    </div>
    <div class="span6">
        <div class="well">

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
            $fn;


        $fn = {
            getStartId:function(id){
                var parent_id;
                parent_id = $this.mod('usertree').getExistParentById(id);
                if(parent_id){
                    return $this.mod('usertree').getExistParentById(parent_id);
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
            span:function(object){
                return '<span id="'+object.gedcom_id+'">'+object.name()+'</span>';
            },
            string: function(ind1, ind2){
                return $fn.span(ind1) + ' + ' + $fn.span(ind2);
            },
            li:function(parent, object, prefix, index){
                var li = $('<li></li>'),
                    label = $('<label></label>'),
                    ind = $this.mod('usertree').user(object.id),
                    id = prefix + '-' + index;

                if(object.childrens.length != 0){
                    $(li).append('<input checked type="checkbox" id="'+id+'" />');
                    $(label).html($fn.string(parent, ind));
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
                    $(ul).append('<li>'+ ind.name() +'</li>');
                } else {
                    object.spouses.forEach(function(spouse, index){
                        $(ul).append($fn.li(ind, spouse, prefix, index));
                    });
                }
                return ul;
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
        console.log($tree);

        $html = $('<div class="css-treeview"></div>');
        $($html).append($fn.ul($tree, 'index-0'));
        $('#descendants [familytreetop="tree"]').append($html);
    });
</script>