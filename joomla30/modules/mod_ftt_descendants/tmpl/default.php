<?php
defined('_JEXEC') or die;

?>
<div id="descendants" class="row-fluid">
    <div class="span6">
        <div familytreetop="tree" class="well"></div>
    </div>
    <div class="span6">
        <div familytreetop="info" class="well">
            <fieldset>
                <legend></legend>
                <img class="img-polaroid" data-src="template/familytreetop/js/holder.js/100x100">
            </fieldset>
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
                $(html).find('span[familytreetop="0"],span[familytreetop="1"]').click(function(){
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
            after:function(user, spouse, prefix){
                var ul = $('<ul></ul>'),
                    li = $('<li><input checked type="checkbox" id="'+prefix+'" /><label></label></li>'),
                    sp = $this.mod('usertree').user(spouse.id);
                $(li).find('label').html($fn.string(user, sp));
                $(li).find('label').attr('familytreetop', user.gender);
                if(spouse.childrens.length != 0){
                    $(li).append(ul);
                    spouse.childrens.forEach(function(child, index){
                        $fn.create(ul, child, prefix + '-' + index);
                    });
                }
                return li;
            },
            create:function(parent, object, prefix){
                var ul = $('<ul></ul>'),
                    user = $this.mod('usertree').user(object.id),
                    spouses = object.spouses,
                    prnt;

                if(spouses.length != 0){
                    if(prefix == 'index-0') {
                        $(parent).append(ul);
                        prnt = ul;
                    } else {
                        prnt = parent;
                    }
                    spouses.forEach(function(spouse, index){
                        $(prnt).append($fn.after(user, spouse, prefix + '-' + index));
                    });
                } else {
                    $(parent).append('<li><span familytreetop="child_'
                            +user.gender+'"></span><span gedcom_id="'
                            +user.gedcom_id+'" familytreetop="'
                            +user.gender+'">'
                            + user.name()
                        +'</span></li>');
                }
            },
            render:function(span){
                var parent =  $('#descendants [familytreetop="info"]'),
                    gedcom_id = $(span).attr('gedcom_id'),
                    ind = $this.mod('usertree').user(gedcom_id);

                $(parent).find('legend').text(ind.shortname());
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
        $fn.create($html, $tree, 'index-0')
        $('#descendants [familytreetop="tree"]').append($html);
        $fn.click($html);
        $fn.setUser($html);
    });
</script>