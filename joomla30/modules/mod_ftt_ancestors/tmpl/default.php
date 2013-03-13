<?php
defined('_JEXEC') or die;
$user = FamilyTreeTopUserHelper::getInstance()->get();
?>
<div id="ancestors" class="row" style="width:100%; height:500px;">
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';

        var $this = this, $start_id, $label, $labels, $node, $nulls, $tree, $fn, $init;

        $fn = {
            setNode: function(id){
                var node = jQuery.extend({}, $node),
                    user = $this.mod('usertree').user(id),
                    key = $this.generateKey();

                node.id = key + '_' + user.gedcom_id;
                node.name = user.username();
                node.data = [];
                node.children = [];
                return node;
            },
            setNullNode: function(){
                var node = jQuery.extend({}, $node),
                    key = $this.generateKey();

                node.id = key + '_' +  $nulls.length;
                node.name = node.id + '_name';
                node.data = [];
                node.children = [];

                $nulls.pull.push(node);
                $nulls.length++;

                return node;
            },
            setPopovers: function(){
                $labels.forEach(function(object){
                    var target = $(object).find('img');
                    $this.mod('popovers').render({
                        target: target
                    });
                });
            },
            getAncestors: function(gedcom_id){
                if("undefined" === typeof(gedcom_id) || null == gedcom_id) return $fn.setNullNode();
                var parents = $this.mod('usertree').getParents(gedcom_id);
                var node = $fn.setNode(gedcom_id);
                node.children.push($fn.getAncestors(parents.father));
                node.children.push($fn.getAncestors(parents.mother));
                return node;
            },
            getOffsetTreeX:function(){
                var width = $('#ancestors').width();
                return (width - (30 + 240 * 2) ) / 2;
            },
            getTree: function(gedcom_id){
                return $fn.getAncestors(gedcom_id);
            },
            initTree: function(tree){
                var st = new $jit.ST({
                    injectInto: 'ancestors',
                    levelsToShow: 2,
                    levelDistance: 30,
                    offsetX:$fn.getOffsetTreeX(),
                    offsetY:0,
                    duration: 500,
                    transition: $jit.Trans.Quint.easeOut,
                    Node: $label,
                    Edge: {
                        type: 'bezier',
                        lineWidth: 2,
                        color:'#999',
                        overridable: true
                    },
                    onBeforeCompute: function(node){
                        /*
                        var	width = $(module.parent).width(),
                                height  = $(module.parent).height();
                        jQuery(module.overlay).css('width', width+'px').css('height', height+'px');
                        jQuery(module.parent).append(module.overlay);
                        //set spouse
                        var parent = node.getParents();
                        if(parent.length!=0){
                            var ptree = $jit.json.getSubtree(module.tree, parent[0].id);
                            var id = (ptree.children[0].id != node.id)?ptree.children[0].id:ptree.children[1].id;
                            module.spouse = module.st.graph.getNode(id);
                        } else {
                            module.spouse = null;
                        }

                        //set active nodes
                        var subtree = $jit.json.getSubtree(module.tree, node.id);
                        var nodes = {};
                        var set_node = function(tr, level){
                            if(level == 3) return false;
                            nodes[tr.id] = tr.id;
                            if(tr.children!=0){
                                set_node(tr.children[0], level + 1);
                                set_node(tr.children[1], level + 1);
                            }
                        }
                        set_node(subtree, 0);
                        module.nodes = nodes;
                        */
                    },
                    onAfterCompute: function(){
                        //$(module.overlay).remove();
                    },
                    onCreateLabel: function(label, node){
                        var sb = $this.stringBuffer(), html, user, gedcom_id;
                        gedcom_id = node.id.split('_')[1];
                        user = $this.mod('usertree').user(gedcom_id);
                        sb._('<div class="row-fluid">');
                            sb._('<div class="span12">');
                                sb._('<div style="float:left;"><img gedcom_id="')._(gedcom_id)._('" class="img-polaroid" data-src="template/familytreetop/js/holder.js/80x80"></div>');
                                sb._('<div style="float:left;">');
                                    sb._('<div style="padding:3px;border: 1px solid rgba(0,0,0,0.2);width: 142px;height: 82px;background: white;">');
                                        sb._('<ul class="unstyled text-center">');
                                            sb._('<li>')._(user.shortname())._('</li>');
                                        sb._('</ul>')
                                    sb._('</div>');
                                sb._('</div>');
                            sb._('</div>');
                        sb._('</div>');

                        html = $(sb.ret());

                        $labels.push(html);

                        Holder.run({
                            images: $(html).find('img')[0]
                        });

                        $(html).css('width', ($label.width) + "px");
                        $(html).css('height', ($label.height) + "px");

                        $(label).append(html);
                    },
                    onPlaceLabel: function(label, node){
                        /*
                        var	left = jQuery(label).find('div.jit-node-arrow.left'),
                                right = jQuery(label).find('div.jit-node-arrow.right'),
                                data = node.data.ftt_storage,
                                active = module.st.clickedNode.id,
                                mod = node._depth%2;

                        jQuery(left).show();
                        jQuery(right).show();
                        if(!data.prew || mod!=0 || node.id != active){
                            jQuery(left).hide();
                        }
                        if(mod || node.id == active){
                            jQuery(right).hide();
                        }
                        if(data.object && data.object.parents == null){
                            jQuery(right).hide();
                        }

                        if(node.id in module.nodes){
                            jQuery(label).css('visibility', 'visible');
                        } else {
                            jQuery(label).css('visibility', 'hidden');
                        }
                        */
                    },
                    onBeforePlotNode:function(node){
                        /*
                        if(node.id in module.nodes){
                            node.data.$color = "#C3C3C3"
                        } else {
                            node.data.$color = module.nodeBackgound;
                        }
                        */
                    },
                    onBeforePlotLine:function(adj){
                        /*
                        adj.data.$color = "#EDF0F8";
                        if(adj.nodeTo.id in module.nodes && adj.nodeFrom.id in module.nodes){
                            adj.data.$color = "#999";
                        }
                        */
                    }
                });
                //load json data
                st.loadJSON(tree);
                //compute node positions and layout
                st.compute();
                //emulate a click on the root node.
                st.onClick(st.root, {
                    onComplete:function() {
                        $fn.setPopovers();
                    }
                });

            }

        }

        $start_id = '<?=$user->gedcom_id;?>';
        $node = { id:null, name: null, data: null, children: null};
        $nulls = { pull:[], length:0 };
        $labels = [];
        $init = false;
        $label =  {
                height: 90,
                width: 240,
                type: 'rectangle',
                color:'#C3C3C3',
                lineWidth: 2,
                align:"center",
                overridable: true
        },

        $tree = $fn.getTree($start_id);
        console.log($tree);

        $this.mod('tabs').bind('#tab4', function(e){
            if($init) return false;
            function init(){
                if($('#ancestors').is(':visible')){
                    $fn.initTree($tree);
                    $init = true;
                } else {
                    setTimeout(init, 250);
                }
            }
            init();
        });
    });
</script>