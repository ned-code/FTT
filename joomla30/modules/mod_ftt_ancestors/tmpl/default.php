<?php
defined('_JEXEC') or die;
$user = FamilyTreeTopUserHelper::getInstance()->get();
?>
<div id="ancestors" class="row" style="width:100%; height:400px;">
</div>
<script>
    $FamilyTreeTop.bind(function($){
        'use strict';

        var $this = this, $start_id, $node, $tree, $fn, $init;

        $fn = {
            setNode: function(id){
                var data = $this.mod('usertree').user(id);
                var node = jQuery.extend({}, $node);
                var key = $this.generateKey();
                node.id = key + '_' + data.gedcom_id;
                node.name = data.name();
                node.data = [];
                node.children = [];

                console.log(node);
                return node;
            },
            getTree: function(gedcom_id){
                var usertree = $this.mod('usertree');
                var parents = usertree.getParents(gedcom_id);
                var node = $fn.setNode(gedcom_id);
                if(parents.father != null){
                    node.children.push($fn.setNode(parents.father));
                }
                if(parents.mother != null){
                    node.children.push($fn.setNode(parents.mother));
                }
                return node;
            },
            initTree: function(tree){
                var st = new $jit.ST({
                    injectInto: 'ancestors',
                    levelsToShow: 2,
                    levelDistance: 30,
                    offsetX:240,
                    offsetY:0,
                    duration: 800,
                    transition: $jit.Trans.Quint.easeOut,
                    Node: {
                        height: 84,
                        width: 214,
                        type: 'rectangle',
                        color:'#C3C3C3',
                        lineWidth: 2,
                        align:"center",
                        overridable: true
                    },
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
                        label.id = node.id;
                        label.innerHTML = node.name;
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
                        //code
                    }
                });
            }

        }

        $start_id = '<?=$user->gedcom_id;?>';
        $node = { id:null, name: null, data: null, children: null};
        $init = false;

        $tree = $fn.getTree($start_id);

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