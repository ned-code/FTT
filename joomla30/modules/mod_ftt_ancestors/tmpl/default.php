<?php
defined('_JEXEC') or die;
$user = FamilyTreeTopUserHelper::getInstance()->get();
?>
<div id="ancestors" class="row" style="position:relative;width:100%; height:500px;">
    <div data-familytreetop="home" style="position:absolute; top:0; right: -10px;"><i style="cursor: pointer;" class="icon-home"></i></div>
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

                node.id = "_" + key + '_' +  $nulls.length;
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
                    },
                    onAfterCompute: function(){
                    },
                    onCreateLabel: function(label, node){
                        var sb = $this.stringBuffer(), html, user, avatar, gedcom_id;
                        gedcom_id = node.id.split('_')[1];
                        user = $this.mod('usertree').user(gedcom_id);
                        avatar = user.avatar(["80","80"]);
                        if(!user) return false;
                        sb._('<div class="row-fluid">');
                            sb._('<div class="span12">');
                                sb._('<div data-familytreetop="avatar" style="float:left;"></div>');
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

                        $(html).find('[data-familytreetop="avatar"]').append(avatar);

                        $labels.push(html);

                        Holder.run({
                            images: avatar[0]
                        });

                        $(html).css('width', ($label.width) + "px");
                        $(html).css('height', ($label.height) + "px");

                        $(html).click(function(){
                            st.onClick(node.id);
                        });

                        $(label).append(html);
                    },
                    onPlaceLabel: function(label, node){
                    },
                    onBeforePlotNode:function(node){
                    },
                    onBeforePlotLine:function(adj){
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

                console.log( $('#ancestors [data-familytreetop="home"] i'));
                $('#ancestors [data-familytreetop="home"] i').click(function(){
                    console.log('123');
                    st.onClick(st.root);
                })

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