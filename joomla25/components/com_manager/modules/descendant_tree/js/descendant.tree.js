(function($, $ftt){
    $ftt.module.create("MOD_DESCENDANT_TREE", function(name, parent, ajax, renderType, popup){
        var	module = this,
            id = jQuery(parent).attr('id'),
            $fn;

        $(parent).attr('style', 'position:relative; height:400px;');

        $fn = {
            ajax:function(func, params, callback){
                ajax.call("descendant_tree", "JMBDescendantTree", func, params, function(status){
                    callback(status);
                });
            },
            clear:function(){
                module.members = null;
                module.select = null;
                module.first = null;
            },
            overlay:function(){
                var	modal_box;

                modal_box = $('<div class="jmb-dtp-modal"></div>');
                $(modal_box).width($(module.profile_container).parent().width()+'px');
                $(modal_box).height($(module.profile_container).parent().height()+'px');
                $(module.profile_container).parent().append(modal_box);
                $(modal_box).hide();

                return {
                    on:function(){
                        $(modal_box).width($(module.profile_container).parent().width()+'px');
                        $(modal_box).height($(module.profile_container).parent().height()+'px');
                        $(modal_box).show();
                    },
                    off:function(){
                        jQuery(modal_box).hide();
                    }
                }
            },
            check:function(id){
                var	object;
                object = $('#'+id);
                if(object.length!=0){
                    $fn.init(id);
                } else {
                    setTimeout(function(){
                        $fn.check(id);
                    }, 250);
                }
            },
            init:function(id){
                var	dhxLayout,
                    dhxTree,
                    select,
                    items,
                    user;

                // set main dhxmlx Layout
                dhxLayout = new dhtmlXLayoutObject(id, "2U");
                dhxLayout.cells("a").hideHeader();
                dhxLayout.cells("b").hideHeader();
                dhxLayout.cells("a").setWidth(380);
                dhxLayout.cells("a").fixSize(true);


                dhxLayout.cells("b").attachObject(module.profile_container);

                dhxTree = dhxLayout.cells("a").attachTree();
                dhxTree.setIconSize("16","16");
                dhxTree.setSkin('dhx_skyblue');
                dhxTree.setImagePath($FamilyTreeTop.global.base+module.imagePath);

                module.dhxLayout = dhxLayout;
                module.dhxTree = dhxTree;
                module.modal = $fn.overlay();

                $fn.loadTree(dhxTree, $fn.render);

                dhxTree.attachEvent("onXLE", function(tree,id){
                    var correct_style = function(item){
                        var	length = item.childsCount,
                            childs = item.childNodes,
                            offset = (item.span.childNodes[0].nodeName == 'DIV')?0:1;
                        if(length == 0) return false;
                        $(childs).each(function(i, child){
                            if(offset){
                                $(child.htmlNode).css('margin-left', '7px');
                            } else {
                                if(child.span.childNodes[0].nodeName == 'DIV'){
                                    $(child.span).css('padding-left', '10px');
                                }
                            }
                            correct_style(child);
                        });
                    }
                    correct_style(dhxTree._idpull[0].childNodes[0]);

                    $('div[name="descendant-node"]').each(function(index, element){
                        $(element).click(function(){
                            $fn.click(this);
                        });
                    });

                    if(module.selected!=null){
                        $('div#'+module.selected+'[name="descendant-node"]').click();
                    } else {
                        user = $(module.obj).find('div#'+module.owner+'[name="descendant-node"]');
                        $(user[0]).click();
                        var dtb = $('div.containerTableStyle');
                        if($(dtb).length > 0){
                            $(dtb).scrollTop(0).scrollTop((jQuery(user[0]).offset().top - 300));
                        }
                    }
                    module.buttons.init();
                });
            },
            loadTree:function(dhxTree, render){
                var	json;
                $fn.ajax('getTree', render, function(json){
                    if(!json) return false;
                    if(json.language){
                        module.message = json.language;
                    }
                    module.first = json.key;
                    module.members = storage.usertree.pull;
                    module.owner = storage.usertree.gedcom_id;
                    module.tree = json.tree;
                    dhxTree.deleteChildItems(0);
                    dhxTree.loadXMLString(json.xml);
                    dhxTree.openAllItems(0);
                    storage.core.modulesPullObject.unset('JMBDescendantTreeObject');
                });
            },
            loadTreeById:function(id){
                if(!id) return false;
                $fn.ajax('getTreeById', id, function(json){
                    module.select = null;
                    module.dhxTree.deleteChildItems(0);
                    module.dhxTree.loadXMLString(json.xml);
                    module.dhxTree.openAllItems(0);
                });
            },
            click:function(element){
                var id, find;

                id = $(element).attr('id');

                find = function(id, callback){
                    $('div[name="descendant-node"]').each(function(i,e){
                        if($(e).attr('id') == id){
                            callback(e);
                        }
                    });
                }

                if(module.select == id) return false;
                if(module.select != null){
                    find(module.select, function(e){ jQuery(e).css('background', 'none'); });
                }
                module.select = id;
                find(id, function(e){ jQuery(e).css('background', 'yellow'); });
                $fn.treeClick(id)


            },
            treeClick:function(id){
                module.profile.render(id);
            },
            board:function(){
                var	cont,
                    modal,
                    box,
                    st;
                st = module.fn.stringBuffer();
                st._('<div id="jmb_desc_buttons" class="jmb-desc-buttons">');
                st._('<div id="select" class="jmb-desc-button-select">&nbsp;</div>');
                st._('<div id="home" class="jmb-desc-button-home">&nbsp;</div>');
                st._('</div>');
                cont = $(st.result());
                return {
                    close:function(){
                        if(box!=null){
                            box.off();
                        }
                    },
                    overlay:function(){
                        var div = jQuery('<div style="background:gray;opacity:0.6;position:absolute;top:0;left:0;cursor:pointer;">&nbsp;</div>');
                        return {
                            on:function(){
                                var heigth, width;
                                width = $(module.dhxTree.allTree).width();
                                heigth = $(module.dhxTree.allTree).height();
                                $(div).css('height', heigth+'px').css('width', width+'px')
                                $(module.dhxTree.allTree).parent().append(div);
                                $(div).click(function(){
                                    box.off();
                                });
                            },
                            off:function(){
                                $(div).unbind();
                                $(div).remove();
                            }
                        }
                    },
                    win:function(){
                        var sb = module.fn.stringBuffer();
                        sb._('<div class="jmb-desc-select">');
                        sb._('<div class="jmb-desc-select-title"><span>')
                        sb._(module.message.FTT_MOD_DESCEDNATS_TREE_SHOW_DESCENDANTS_OF);
                        sb._(':</span></div>');
                        sb._('<div class="jmb-desc-select-content">');
                        sb._('<canvas id="canvas" height="200px" width="340px"></canvas>');
                        sb._('</div>');
                        sb._('<div class="jmb-desc-select-close">&nbsp;</div>');
                        sb._('</div>');
                        var div = jQuery(sb.result());
                        return {
                            cont:function(){
                                return div;
                            },
                            node:function(settings){
                                var node, sb = module.fn.stringBuffer(), data_style;
                                sb._('<div id ="')._(settings.id)._('" class="node');
                                sb._((settings.descendants)?' descendants':'');
                                sb._('">');
                                if(settings.descendants){
                                    sb._('<span style="position:relative;top:-5px;"><input ');
                                    sb._((settings.count==0)?'disabled="true"':'');
                                    sb._(' id="')._(settings.input_id)._('" type="checkbox">');
                                    sb._('</span>');
                                }
                                sb._('<span class="title">');
                                if(settings.descendants){
                                    sb._('<div class="text">')._(settings.title)._('</div>');
                                    sb._('<div class="count">');
                                    sb._(settings.count+' '+module.message.FTT_MOD_DESCEDNATS_TREE_DESCENDANTS);
                                    sb._('</div>');
                                } else {
                                    sb._(settings.title);
                                }
                                sb._('</span>');
                                sb._('</div>');
                                node = $(sb.result());
                                if(settings.style){
                                    data_style = settings.style;
                                    for(var key in data_style){
                                        if(data_style.hasOwnProperty(key)){
                                            $(node).css(key, data_style[key]);
                                        }
                                    }
                                }
                                $(div).find('div.jmb-desc-select-content').append(node);
                                if(settings.finish){
                                    settings.finish();
                                }
                            },
                            on:function(){
                                if(!module.tree) return false;
                                var canvas, ctx, line;
                                modal.on();
                                jQuery(div).find('div.jmb-desc-select-close').unbind().click(function(){
                                    box.off();
                                    module.checked = jQuery(div).find('input:checked').attr('id');
                                    $fn.loadTreeById(module.checked);

                                });
                                //draw line
                                canvas = jQuery(div).find('canvas').get(0);
                                if(!canvas.getContext){
                                    var c = document.createElement('canvas');
                                    c.id = "canvas";
                                    c.height="200";
                                    c.width="340";
                                    jQuery(canvas).after(c);
                                    jQuery(canvas).remove();
                                    canvas = c;
                                    window.G_vmlCanvasManager.initElement(canvas);
                                }
                                ctx = canvas.getContext("2d");

                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                ctx.strokeStyle = '#000000';
                                ctx.fillStyle = '#000000';
                                ctx.lineWidth = 1;

                                line = function(x, y, length, hor){
                                    ctx.save();
                                    ctx.beginPath();
                                    ctx.moveTo(x, y);
                                    if(hor){
                                        ctx.lineTo(x, y + length);
                                    } else {
                                        ctx.lineTo(x + length, y);
                                    }
                                    ctx.closePath();
                                    ctx.stroke();
                                    ctx.restore();
                                }


                                //create nodes
                                var parents = module.tree.parents;
                                if(parents.father != null || parents.mother != null){
                                    var parent = parents[module.render];
                                    if(parent){
                                        line(10, 100, 60);
                                        line(70, 50, 100, true);
                                        line(70, 50, 125);
                                        line(70, 150, 125);
                                        this.node({
                                            id:module.render,
                                            title:(function(){
                                                if(module.render=='mother'){
                                                    return module.message.FTT_MOD_DESCEDNATS_TREE_MOTHER;
                                                } else {
                                                    return module.message.FTT_MOD_DESCEDNATS_TREE_FATHER;
                                                }
                                            })(),
                                            count:parent.count,
                                            style:{
                                                top:'90px',
                                                left:'20px'
                                            }
                                        });
                                        var grandparents = parent.parents;
                                        var grandfather = grandparents['father'];
                                        var grandmother = grandparents['mother'];
                                        if(grandfather||grandmother){
                                            this.node({
                                                id:'grandparents',
                                                title:module.message.FTT_MOD_DESCEDNATS_TREE_GRANDPARENTS,
                                                descendants:true,
                                                count:(function(){
                                                    if(!grandmother&&!grandfather) return 0;
                                                    return (grandfather)?grandfather.count:grandmother.count;
                                                })(),
                                                input_id:(function(){
                                                    return (grandmother)?grandmother.id:grandfather.id;
                                                })(),
                                                style:{
                                                    top:'85px',
                                                    left:'80px'
                                                }
                                            });
                                            if(grandfather){
                                                line(195, 20, 60, true);
                                                line(195, 20, 25);
                                                line(195, 80, 25);
                                                this.node({
                                                    id:'grandfather',
                                                    title:module.message.FTT_MOD_DESCEDNATS_TREE_GRANDFATHER,
                                                    style:{
                                                        top:'140px',
                                                        left:'100px'
                                                    }
                                                });
                                                this.node({
                                                    id:'grandfatherparents',
                                                    title:module.message.FTT_MOD_DESCEDNATS_TREE_GREAT_GRANDPARENTS,
                                                    descendants:true,
                                                    count:(function(){
                                                        var parents = grandfather.parents;
                                                        if(!parents.father&&!parents.mother) return 0;
                                                        return (parents.mother)?parents.mother.count:parents.father.count;
                                                    })(),
                                                    input_id:(function(){
                                                        var parents = grandfather.parents;
                                                        if(!parents.father&&!parents.mother) return 0;
                                                        return (parents.mother)?parents.mother.id:parents.father.id;
                                                    })(),
                                                    style:{
                                                        top:'135px',
                                                        left:'200px'
                                                    }
                                                });

                                            }
                                            if(grandmother){
                                                line(195, 120, 60, true);
                                                line(195, 120, 25);
                                                line(195, 180, 25);

                                                this.node({
                                                    id:'grandmother',
                                                    title:module.message.FTT_MOD_DESCEDNATS_TREE_GRANDMOTHER,
                                                    style:{
                                                        top:'40px',
                                                        left:'100px'
                                                    }
                                                });

                                                this.node({
                                                    id:'grandmotherparents',
                                                    title:module.message.FTT_MOD_DESCEDNATS_TREE_GREAT_GRANDPARENTS,
                                                    descendants:true,
                                                    count:(function(){
                                                        var parents = grandmother.parents;
                                                        if(!parents.father&&!parents.mother) return 0;
                                                        return (parents.mother)?parents.mother.count:parents.father.count;
                                                    })(),
                                                    input_id:(function(){
                                                        var parents = grandmother.parents;
                                                        if(!parents.father&&!parents.mother) return 0;
                                                        return (parents.mother)?parents.mother.id:parents.father.id;
                                                    })(),
                                                    style:{
                                                        top:'35px',
                                                        left:'200px'
                                                    }
                                                });
                                            }
                                            $(module.dhxTree.allTree).parent().append(div);
                                            $(div).find('input').click(function(){
                                                module.first = jQuery(this).attr('id');
                                                jQuery(div).find('input').attr('checked', false);
                                                jQuery(this).attr('checked', true);
                                            });
                                            if(module.first!=null){
                                                $(div).find('input#'+module.first).attr('checked', true);
                                            }
                                        } else {
                                            $(module.dhxTree.allTree).parent().append(div);
                                            $(div).find('input').click(function(){
                                                module.first = jQuery(this).attr('id');
                                                jQuery(div).find('input').attr('checked', false);
                                                jQuery(this).attr('checked', true);
                                            });
                                            if(module.first!=null){
                                                $(div).find('input#'+module.first).attr('checked', true);
                                            }
                                        }
                                    } else {
                                        box.off();
                                    }
                                } else {
                                    box.off();
                                }
                            },
                            off:function(){
                                $(div).remove();
                                modal.off();
                            }
                        }
                    },
                    select:function(){
                        $(box.cont()).find('div.jmb-desc-select-close').click(function(){
                            box.off();
                        });
                        box.on();
                    },
                    home:function(){
                        var user = $('div#'+module.owner+'[name="descendant-node"]');
                        $(user[0]).click();
                        $('div.containerTableStyle').scrollTop(0);
                        $('div.containerTableStyle').scrollTop((jQuery(user[0]).offset().top - 300));
                    },
                    init:function(){
                        var board = this;
                        modal = board.overlay();
                        box = board.win();
                        $(cont).find('div').click(function(){
                            var id = $(this).attr('id');
                            board[id]();
                        });
                        $(module.dhxTree.allTree).parent().append(cont);
                        return box;
                    }
                }
            }
        }

        module.message = {
            FTT_MOD_DESCEDNATS_TREE_NAME:"Name",
            FTT_MOD_DESCEDNATS_TREE_BORN:"Born",
            FTT_MOD_DESCEDNATS_TREE_BIRTHPLACE:"Birthplace",
            FTT_MOD_DESCEDNATS_TREE_DEATH:"Death",
            FTT_MOD_DESCEDNATS_TREE_DEATHPLACE:"Deathplace",
            FTT_MOD_DESCEDNATS_TREE_RELATION:"Relation",
            FTT_MOD_DESCEDNATS_TREE_NOT_REGISTERD:"is not registred",
            FTT_MOD_DESCEDNATS_TREE_EMAIL_INVITATION:"Click here to send %% an email invitation",
            FTT_MOD_DESCEDNATS_TREE_SHOW_DESCENDANTS_OF:"Show descendants of",
            FTT_MOD_DESCEDNATS_TREE_MOTHER:"Mother",
            FTT_MOD_DESCEDNATS_TREE_FATHER:"Father",
            FTT_MOD_DESCEDNATS_TREE_GRANDFATHER:"Grandfather",
            FTT_MOD_DESCEDNATS_TREE_GRANDMOTHER:"Grandmother",
            FTT_MOD_DESCEDNATS_TREE_GRANDPARENTS:"Grandparents",
            FTT_MOD_DESCEDNATS_TREE_GREAT_GRANDPARENTS:"Great Grandparents",
            FTT_MOD_DESCEDNATS_TREE_DESCENDANTS:"Descendants",
            FTT_MOD_DESCEDNATS_TREE_SHOW_FULL_PROFILE:"Show full profile",
            FTT_MOD_DESCEDNATS_TREE_SEND_INVITE_TO:"Send invitation to"
        };
        module.obj = parent;
        module.imgPath = "components/com_manager/modules/descendant_tree/imgs/"
        module.imagePath = "components/com_manager/codebase/imgs/csh_bluebooks_custom/";
        module.profile_container = $('<div id="jmb_desc_profile_cont"></div>')[0];
        module.dhxLayout = null;
        module.dhxTree = null;
        module.modal = null;
        module.members = null;
        module.select = null;
        module.selected = null;
        module.first = null;
        module.tree = null;
        module.render = 'mother';
        module.checked = null;

        module.profile = new DescendantTreeProfile(module);
        module.buttons = $fn.board();

        $fn.check(id);

        $FamilyTreeTop.fn.mod("family_line").bind('JMBDescendantTreeObject', function(res){
            module.buttons.close();
            $fn.clear();
            module.dhxTree.deleteChildItems(0);
            module.render = res._line;
            $fn.loadTree(module.dhxTree, res._line);
            return true;
        });
        return this;
    });
})(jQuery, $FamilyTreeTop);

function JMBDescendantTreeObject(obj, popup){
    $FamilyTreeTop.module.init("MOD_DESCENDANT_TREE", obj, $FamilyTreeTop.fn.mod("ajax"), "desctop", popup);
}
