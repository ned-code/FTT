(function($, $ftt){
    $ftt.module.create("MOD_SYS_PROFILE_EDITOR", function(){
        var $module = this;
        /*
        * DATA
         */
        $module.data.arguments = arguments;
        $module.data.msg = {}
        $module.data.callbacks = {};
        $module.data.renderType = 'desctop';
        $module.data.slide = false;
        $module.data.gedcom_id = false;
        $module.data.object = false;
        $module.data.parse = false;


        /*
        * FUNCTIONS
         */
        $module.fn.ajax = function(f, p, c){
            $module.fn.call("myfamily", "FTTProfileEditor", f, p, function(res){
                c(res);
            });
        }

        $module.fn.extend = function(def, set){
            return $.extend({}, def, set);
        }

        $module.fn.getMsg = function(n){
            var t = 'FTT_MOD_SYS_PROFILE_EDITOR_'+n.toUpperCase();
            if(typeof($module.data.msg[t]) != 'undefined'){
                return $module.data.msg[t];
            }
            return '';
        }

        $module.fn.setMsg = function(msg){
            for(var key in $module.data.msg){
                if(typeof(msg[key]) != 'undefined'){
                    $module.data.msg[key] = msg[key];
                }
            }
            return true;
        }

        $module.fn.echo = function(){
            var cbs = $module.data.callbacks;
            for(var key in cbs){
                if(!cbs.hasOwnProperty(key)) continue;
                cbs[key]();
            }
            $module.data.callbacks = {};
        }

        $module.fn.parse = function(o){
            if(!o&&!$module.data.object) return false;
            return storage.usertree.parse(o || $module.data.object);
        }

        $module.fn.getObject = function(gedcom_id){
            if(!gedcom_id&&!$module.data.gedcom_id) return false;
            return storage.usertree.pull[gedcom_id || $module.data.gedcom_id];
        }
        /*
        * EDIT
         */
        $module.fn.edit = function(){
            var cont, $fn = {
                getSelectMonth:function(name){
                    var sb = $module.fn.stringBuffer();
                    sb._('<select name="')._(name)._('">');
                        sb._('<option value="0">Month</option>');
                        sb._('<option value="1">January</option>');
                        sb._('<option value="2">February</option>');
                        sb._('<option value="3">March</option>');
                        sb._('<option value="4">April</option>');
                        sb._('<option value="5">May</option>');
                        sb._('<option value="6">June</option>');
                        sb._('<option value="7">July</option>');
                        sb._('<option value="8">August</option>');
                        sb._('<option value="9">September</option>');
                        sb._('<option value="10">October</option>');
                        sb._('<option value="11">November</option>');
                        sb._('<option value="12">December</option>');
                    sb._('</select>');
                    return sb.result();
                },
                getSelect:function(name, options, label){
                    var sb = $module.fn.stringBuffer(), key, option;
                    if("undefined" != typeof(label) && label){
                        sb._('<label>')._(label)._(':</label>');
                    }
                    sb._('<select name="">');
                        for(key in options){
                            if(!options.hasOwnProperty(key)) continue;
                            option = options[key];
                            sb._('<option value="')._(key)._('">')._(option)._('</option>');
                        }
                    sb._('</select>');
                    return sb.result();
                },
                getInput:function(name, label, placeholder, type){
                    var sb = $module.fn.stringBuffer();
                    if("undefined" != typeof(label) && label){
                        sb._('<label>')._(label)._(':</label>');
                    }
                    sb._('<input ');
                        sb._('name="')._(name)._('" ');
                        sb._('type="')._(("undefined"!==typeof(type))?type:"text")._('"');
                        sb._(' placeholder="')._(("undefined"!==typeof(placeholder))?placeholder:"")._('" ');
                    sb._('/>');
                    return sb.result();
                },
                getLivingEventContent:function(legend, prefix){
                    var sb = $module.fn.stringBuffer();
                    sb._('<fieldset>');
                        sb._('<legend>')._(legend)._('</legend>');
                        sb._('<div class="row">');
                            sb._('<div class="twelve columns">');
                                sb._('<div class="row">');
                                    sb._('<div class="two columns">');
                                        sb._($fn.getInput(prefix+'day', false, "Day"));
                                    sb._('</div>');
                                    sb._('<div class="three columns">');
                                        sb._($fn.getSelectMonth(prefix+'month'));
                                    sb._('</div>');
                                    sb._('<div class="six columns">');
                                        sb._($fn.getInput(prefix+'year', false, "Year"));
                                    sb._('</div>');
                                sb._('</div>');
                                sb._('<div class="row">');
                                    sb._('<div class="twelve columns">');
                                        sb._($fn.getInput(prefix+'city', "City/Town"));
                                    sb._('</div>');
                                sb._('</div>');
                                sb._('<div class="row">');
                                    sb._('<div class="twelve columns">');
                                        sb._($fn.getInput(prefix+'state', "State/Province"));
                                    sb._('</div>');
                                sb._('</div>');
                                sb._('<div class="row">');
                                    sb._('<div class="twelve columns">');
                                        sb._($fn.getInput(prefix+'country', "Country"));
                                    sb._('</div>');
                                sb._('</div>');
                            sb._('</div>');
                        sb._('</div>');
                    sb._('</fieldset>');
                    return sb.result();
                },
                crPhoto: function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<fieldset>');
                        sb._('<legend>Photo</legend>');

                        sb._('<div class="row">');
                            sb._('<div class="three columns">');
                                sb._('<img id="thumb" width="102px" height="120px" src="')._($FamilyTreeTop.global.base)._('components/com_manager/modules/profile_editor/imgs/default-avatar.png">');
                            sb._('</div>');
                            sb._('<div class="nine columns">');
                                sb._('<label>Upload a Picture of Yourself</label>');
                                sb._('<input id="imageUpload" name="avatar" type="file" />');
                                sb._('<button style="margin-left: 5px;" type="button" class="small secondary radius button">Save</button>');
                            sb._('</div>');
                        sb._('</div>');



                    sb._('</fieldset>');
                    return sb.result();
                },
                crBasicDetails: function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<fieldset>');
                        sb._('<legend>Basic Details</legend>');
                        sb._('<div class="row">');
                            sb._('<div class="six columns">');
                                sb._($fn.getSelect("gender", {"f":"Female","m":"Male"}, "Gender"));
                            sb._('</div>');
                            sb._('<div class="six columns">');
                                sb._($fn.getSelect("live", {"1":"Yes","0":"No"}, "Live"));
                            sb._('</div>');
                        sb._('</div>');
                        sb._('<div class="row">');
                            sb._('<div class="twelve columns">');
                                sb._($fn.getInput('first_name', 'First Name'));
                                sb._($fn.getInput('middle_name', 'Middle Name'));
                                sb._($fn.getInput('last_name', 'Last Name'));
                                sb._($fn.getInput('know_as', 'Know As'));
                            sb._('</div>');
                        sb._('</div>')
                    sb._('</fieldset>');
                    return sb.result();
                },
                crBirth: function(){
                    var sb = $module.fn.stringBuffer();
                    sb._($fn.getLivingEventContent("Birth", "b_"));
                    return sb.result();
                },
                crDeath: function(){
                    var sb = $module.fn.stringBuffer();
                    sb._($fn.getLivingEventContent("Death", "d_"));
                    return sb.result();
                },
                crNotes: function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<fieldset>');
                    sb._('<legend>Notes</legend>');
                        sb._('<div class="row">');
                            sb._('<div class="twelve columns">');
                                sb._('<textarea name="notes" placeholder=""></textarea>');
                                sb._('<div style="display:none;">^</div>')
                            sb._('</div>');
                        sb._('</div>');
                    sb._('</fieldset>');
                    return sb.result();
                },
                element: function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div class="row ftt-profile-edit-content">');
                        sb._('<div class="twelve columns">');
                            sb._('<form class="custom">');
                                sb._('<div class="row">');
                                    sb._('<div class="six columns">');
                                        sb._($fn.crPhoto());
                                        sb._($fn.crBasicDetails());
                                        if($module.data.parse.is_death){
                                            sb._($fn.crNotes());
                                        }
                                    sb._('</div>');
                                    sb._('<div class="six columns">');
                                        sb._($fn.crBirth());
                                        if($module.data.parse.is_alive){
                                            sb._($fn.crNotes());
                                        } else {
                                            sb._($fn.crDeath());
                                        }
                                    sb._('</div>');
                                sb._('</div>');
                            sb._('</form>');
                        sb._('</div>');
                    sb._('</div>');
                    return $(sb.result());
                }
            }
            cont = $fn.element();
            $module.data.slide.hide();
            $module.data.slide.append(cont);
            $(cont).foundationCustomForms();

        }



        /*
        * SLIDE
         */
        $module.fn.slide = function(){
            var slide = this,
                fn = false,
                settings = false,
                div = false,
                headerBtns = [],
                edit = false,
                offsetParent = false;

            fn = {
                createListItems: function(bxs){
                    var items = []
                    for(var key in bxs){
                        if(!bxs.hasOwnProperty(key)) continue;
                        var prms = bxs[key];
                        var box = $module.fn.box(prms);
                        items.push({prms:prms, object:box});
                    }
                    return items.sort(function(a, b){
                        return a.prms.level - b.prms.level;
                    });
                },
                createSlide:function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div class="ftt-profile-editor-slide">');
                        sb._('<div class="ftt-profile-editor-slide-header"></div>');
                        sb._('<div class="ftt-profile-editor-slide-content"></div>');
                    sb._('</div>');
                    return sb.result();
                },
                appendListItems:function(ul, bxs){
                    var levels = {}, index = 0;
                    for(var key in bxs){
                        if(!bxs.hasOwnProperty(key)) continue;
                        var el = bxs[key];
                        if(!(el.prms.level in levels)){
                            levels[el.prms.level] = index;
                            $(ul).append('<li id="'+index+'"></li>');
                            index++;
                        }
                        $(ul).find('li[id="'+levels[el.prms.level]+'"]').append(el.object);
                    }
                },
                appendHeaderButtons:function(cont){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div style="margin-left: 4px;margin-top: 4px;float:left;"><a class="tiny secondary radius button" href="#">Back</a></div>');
                    sb._('<div style="margin-right: 4px;margin-top: 4px;float:right;"><a class="tiny secondary radius button" href="#">Edit</a></div>');
                    headerBtns = $(sb.result());
                    $(cont).find(".ftt-profile-editor-slide-header").append(headerBtns);
                    $(headerBtns[0]).click(function(){
                        $module.data.slide.back();
                    });
                    $(headerBtns[1]).click(function(){
                        edit = true;
                        $module.fn.edit();
                    });
                }
            }

            settings = {
                width: $("#_content").width()
            };

            div = $(fn.createSlide());
            offsetParent = $("#_content").offset();
            $(div).width(settings.width).css("left", -1*(settings.width));
            fn.appendHeaderButtons(div);
            return {
                object: div,
                close: function(){
                    if(!$module.data.slide) return false;
                    $(div).animate({"left":"-="+(settings.width)+"px"}, "slow", function(){
                        $(div).remove();
                    });
                    $module.data.slide = false;
                    $module.fn.echo();
                },
                back: function(){
                    if(edit){
                        $module.data.slide.visible();
                    } else {
                        $module.data.slide.close();
                    }
                },
                append: function(cont){
                    $(div).find(".ftt-profile-editor-slide-content").append(cont);
                },
                hide: function(){
                    $(div).find(".ftt-profile-editor-slide-content ul").hide();
                    $(headerBtns[1]).hide();
                },
                visible: function(){
                    $(div).find(".ftt-profile-editor-slide-content .ftt-profile-edit-content").remove();
                    $(div).find(".ftt-profile-editor-slide-content ul").show();
                    $(headerBtns[1]).show();
                    edit = false;
                },
                content: function(boxes){
                    var ul = $("<ul></ul>");
                    $(div).find(".ftt-profile-editor-slide-content").append(ul);
                    fn.appendListItems(ul, fn.createListItems(boxes));
                },
                init: function(){
                    $("#_content").append(div);
                    $(div).animate({"left":"0px"}, "slow");
                }
            }
        }
        /*
        * BOX
         */
        $module.fn.box = function(settings){
            var box = this, fn;
            fn = {
                createBox: function(st){
                    var cont, sb = $module.fn.stringBuffer();
                    sb._('<div id="')._(st.id || '')._('" class="ftt-profile-editor-box">');
                        sb._('<div class="ftt-profile-editor-box-header">');
                            sb._('<div class="ftt-profile-editor-box-header-title"><span>')._(st.name || '')._('</span></div>');
                        sb._('</div>');
                        sb._('<div class="ftt-profile-editor-box-content"></div>');
                    sb._('</div>');
                    cont = $(sb.result());
                    return (fn.appendContent(cont, st))?cont:"";
                },
                appendContent: function(cont, st){
                    if("undefined"===typeof(st.content)) return false;
                    if("function" === typeof(st.content)){
                        st.content(function(content){
                            if(content){
                                $(cont).find(".ftt-profile-editor-box-content").append(content);
                            } else {
                                $(cont).remove();
                            }
                        });
                    } else if("object" === typeof(st.content) && st.content.length != 0){
                        $(cont).find(".ftt-profile-editor-box-content").append(st.content);
                    } else {
                        return false;
                    }
                    return true;
                }
            }
            return fn.createBox(settings);
        }
        /**
         * BASIC INFO
         */
        $module.fn.basic = function(gedcom_id){
            var fn;

            fn = {
                event: function(type){
                    var p = $module.data.parse;
                    return [p.date('birth'), " ", p.getPlaceString('birth')].join("");
                },
                line: function(id, title, text, check){
                    if("undefined" !== typeof(check) && !check) return "";
                    var sb = $module.fn.stringBuffer();
                    sb._('<tr id="')._(id)._('">');
                        sb._('<td><div class="ftt-profile-editor-box-content-element-title"><span>')._(title)._('</span></div></td>');
                        sb._('<td><div class="ftt-profile-editor-box-content-element-text"><span>')._(text)._('</span></div></td>');
                    sb._('</tr>');
                    return sb.result();
                },
                avatar: function(){
                    return storage.usertree.avatar.get({
                        object: $module.data.object,
                        width:108,
                        height:120
                    });
                },
                update: function(){},
                create: function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div>');
                        sb._('<div style="display: inline-block; vertical-align: top; margin:5px;">')._(fn.avatar())._('</div>');
                        sb._(fn.createInfoElement());
                    sb._('</div>');
                    return $(sb.result());
                },
                createInfoElement: function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div style="display: inline-block; vertical-align: top; margin: 5px;">');
                        sb._('<table>');
                            sb._(fn.line('name', "Full Name:", $module.data.parse.full_name));
                            sb._(fn.line('know_as', "Know As:", $module.data.parse.nick));
                            sb._(fn.line('born', "Born:", fn.event("birth"), $module.data.parse.is_birth));
                            sb._(fn.line('death', "Death:", fn.event("death"), $module.data.parse.is_death));
                            sb._(fn.line('relation', "Relation:", $module.data.parse.relation));
                        sb._('</table>');
                    sb._('</div>');
                    return sb.result();
                }
            }
            return {
                onClick:function(){
                    storage.profile.editor('edit', {
                        object:$module.data.object
                    });
                },
                render:fn.create
            };
        }

        /*
        * FAMILY
         */
        $module.fn.family = function(){
            var object = $('<div style="position: relative; width: 500px; margin: 0 auto;"></div>');
            (function(){
                var cont = _create(),
                    borders = _generateBorders(100),
                    border_iter = 0,
                    spouse_border = {},
                    childPos = {},
                    imageSize = {
                        parent:{
                            width:108,
                            height:120
                        },
                        child:{
                            width:72,
                            height:80
                        }
                    },
                    family = storage.usertree.pull,
                    famId,
                    target = _getTarget(),
                    sircar,
                    info,
                    spouse,
                    spouses = _getSpouses(target),
                    childrens = _getChildrens(target.families),
                    childs = [],
                    startTop,
                    rowLength,
                    leftDel,
                    index,
                    startLeft,
                    i;

                sircar = _sircar(target);
                if(sircar){
                    $(cont[0]).css({top:"21px",left:"25px"}).attr('id', target.user.gedcom_id).append(sircar);
                }

                if(spouses.length != 0){
                    info = _info(target, spouses[0]);
                    $(cont[1]).css({top:"113px", left:"180px"}).append(info);

                    spouse = _spouse(spouses[0], _getBorderColor(spouses.length>1?spouses[0]:false));
                    if(spouse){
                        $(cont[2]).attr('id', spouses[0][1]).css({top:"21px",left:"300px"}).append(spouse);
                    }
                }

                startTop = _getStartTop(spouses.length) + 50;
                if(childrens.length!=0){
                    rowLength = _getLength(childrens.length);
                    leftDel = 100;
                    index = 0;
                    startLeft = 250 - 100*(rowLength/2);
                    for(i = 0 ; i < childrens.length ; i++){
                        if(index == rowLength){
                            startTop += 185;
                            index = 0;
                            if((childrens.length-i)<rowLength){
                                startLeft = 250 - 100*((childrens.length-i)/2);
                            }
                        }
                        var pos = {top:startTop, left:startLeft+(index*leftDel)};
                        childPos[childrens[i].gedcom_id] = pos;
                        childs[i] = _child(childrens[i], spouses.length, pos);
                        $(object).append(childs[i]);
                        index++;
                    }
                }

                $(object).height(startTop + 200);
                $(object).append(cont);
                $(object).find('div#'+$module.data.gedcom_id).find('div[type="imgContainer"]').animatedBorder({size : 6, color : '#FFCC66'});

                return true;
                function _generateBorders(n){
                    var retBorders = [],
                        isBorders = {},
                        each,
                        getColor,
                        setColor;

                    getColor = function(){ return '#'+Math.floor(Math.random()*16777215).toString(16); }
                    setColor = function(color){
                        if(!color){
                            color = getColor();
                        }
                        if(!isBorders[color]){
                            isBorders[color] = true;
                            retBorders.push(color);
                            return true;
                        } else {
                            return false;
                        }
                    }
                    each = function(start, end, callback){
                        var i, length;
                        if('object' === typeof(end)){
                            length = end.length;
                        } else if('string' === typeof(end)){
                            length = "0" + end;
                        } else if('number' === typeof(end)){
                            length = end;
                        }
                        for(i = start ; i < length ; i++){
                            if(!callback(i, end)){
                                i--;
                            }
                        }
                    }
                    each(0, ["#3f48cc","#1d9441","#b97a57","#934293","#eab600","#00a2e8","#ed1c24","#7092be"], function(i, colors){
                        return setColor(colors[i]);
                    });
                    each(8, 100, function(i, length){
                        return setColor(false);
                    });

                    return retBorders;
                }
                function _getTarget(){
                    var object = storage.usertree.pull[$module.data.gedcom_id];
                    var parentKey = _getParentKey_(object);
                    if(parentKey && object.families == null){
                        return storage.usertree.pull[parentKey];
                    }
                    return object;
                    function _getParentKey_(o){
                        if(!o || o==null) return false;
                        var fn,
                            parents,
                            key,
                            family,
                            fatherId,
                            motherId,
                            fatherFamilyCount,
                            motherFamilyCount;

                        fn = {
                            getFamilyCount:function(family, id){
                                if(!id) return 0;
                                var families = object.families;
                                if(families != null){
                                    return families.length;
                                }
                                return 0;
                            }
                        }

                        parents = o.parents;
                        if(parents != null){
                            for(key in parents){
                                if(parents.hasOwnProperty(key)){
                                    if(key != 'length'){
                                        famId = key;
                                        family = parents[key];
                                        fatherId = (family.father!= null && storage.usertree.pull[family.father.gedcom_id])?family.father.gedcom_id:false;
                                        motherId = (family.mother!= null && storage.usertree.pull[family.mother.gedcom_id])?family.mother.gedcom_id:false;
                                        fatherFamilyCount = fn.getFamilyCount(family, fatherId);
                                        motherFamilyCount = fn.getFamilyCount(family, motherId);
                                        if(fatherId && motherId){
                                            if(fatherFamilyCount == motherFamilyCount){
                                                return fatherId;
                                            } else if(fatherFamilyCount > motherFamilyCount){
                                                return fatherId;
                                            } else {
                                                motherId;
                                            }
                                        } else {
                                            return (fatherId)?fatherId:motherId;
                                        }
                                    }
                                }
                            }
                        }
                        return false;
                    }
                }
                function _getBorderColor(sp){
                    return (function(sp){
                        if(!sp) return "#000000";
                        var _color = borders[border_iter];
                        border_iter++;
                        spouse_border[sp[0]] = _color;
                        return _color;
                    })(sp);
                }
                function _getLength(len){
                    return (function(len){
                        var _limit = 7;
                        var _rows = Math.ceil(len/_limit);
                        return Math.round(len/_rows);
                    })(len);
                }
                function _getStartTop(length){
                    return 190;
                    return (function(length){
                        if(length>=3){
                            return 450;
                        }
                        return 315;
                    })(length);
                }
                function _getName(info){
                    return (function(info){
                        if(!info) return '';
                        if(info.nick.length > 12){
                            return info.nick.substr(0,6)+'...';
                        } else {
                            return info.nick;
                        }
                    })(info);
                }
                function _getDate(info){
                    return (function(info){
                        if(!info) return '....';
                        var _b, _d;
                        _b = info.date('birth', 2);
                        _d = info.date('death', 2);
                        if(_b != 0 && _d != 0){
                            return _b + " - " + _d;
                        } else if(_b != 0 && _d == 0){
                            return _b;
                        } else if(_b == 0 && _d != 0){
                            return ".... - " + _d;
                        } else {
                            return "....";
                        }
                    })(info);
                }
                function _getAvatar(object, type, k){
                    return (function(object, type, k){
                        var _size = _getImageSize_(type, k);
                        return storage.usertree.avatar.get({
                            object:object,
                            cssClass:"jmb-families-avatar view",
                            width:_size.width,
                            height:_size.height
                        });
                        function _getImageSize_(){
                            var	_imageSize = imageSize,
                                _size_ = _imageSize[type],
                                _width = Math.round(_size_.width*k),
                                _height = Math.round(_size_.height*k);
                            return {
                                width: _width,
                                height: _height
                            };
                        }
                    })(object, type, k);
                }
                function _getSpouses(target){
                    return (function(t){
                        if(!t) return [];
                        var key,
                            key2,
                            key3,
                            family,
                            families,
                            spouse,
                            spouses,
                            $spouses,
                            child,
                            childs,
                            $childs,
                            defFamily,
                            object,
                            parents;
                        families = t.families;
                        spouses = [];
                        $spouses = [];
                        childs = [];
                        for(key in families){
                            if(!families.hasOwnProperty(key)) continue;
                            if("length" !== key){
                                family = families[key];
                                if(null !== family.spouse && storage.usertree.pull[family.spouse]){
                                    if(!spouses[family.spouse]){
                                        spouses[family.spouse] = family.spouse;
                                        spouse = [family.id, family.spouse];
                                        $spouses.push(spouse);
                                    }
                                }
                                $childs = family.childrens;
                                for(key2 in $childs){
                                    if($childs.hasOwnProperty(key2)){
                                        child = $childs[key2];
                                        if(!childs[child.gedcom_id] && "undefined" !== storage.usertree.pull[child.gedcom_id]){
                                            childs[child.gedcom_id] = child.gedcom_id;
                                        }
                                    }
                                }
                            }
                        }

                        defFamily = t.user.default_family;
                        if($module.data.gedcom_id in childs){
                            object = storage.usertree.pull[$module.data.gedcom_id];
                            parents = object.parents;
                            for(key3 in parents){
                                if(!parents.hasOwnProperty(key)) continue;
                                if(key3 != 'length'){
                                    defFamily = key3;
                                    break;
                                }
                            }
                        }
                        return $spouses.sort(function(){
                            if(arguments[0][1] == defFamily || arguments[0][0] == defFamily){
                                return -1;
                            } else {
                                return 1;
                            }
                        });
                    })(target);
                }
                function _getChildrens(families){
                    return (function(families){
                        var _childrens = [], _family, _child;
                        for(var _key in families){
                            if (!families.hasOwnProperty(_key)) continue;
                            if(_key!='length'){
                                _family = families[_key];
                                if(_family.childrens!=null){
                                    for(var _i = 0 ; _i < _family.childrens.length ; _i ++){
                                        _child = _family.childrens[_i];
                                        _childrens.push(_child);
                                    }
                                }
                            }
                        }
                        return _childrens;
                    })(families);
                }
                function _create(){
                    return (function(){
                        var _sb = storage.stringBuffer();
                        _sb._('<div class="ftt-profile-view-sircar">&nbsp;</div>');
                        _sb._('<div class="ftt-profile-view-event">&nbsp;</div>');
                        _sb._('<div class="ftt-profile-view-spouse">&nbsp;</div>');
                        return $(_sb.result());
                    })();
                }
                function _sircar(object){
                    return (function(object){
                        var _sb = storage.stringBuffer();
                        var _gedcomId = object.user.gedcom_id;
                        var _info = storage.usertree.parse(object);
                        _sb._('<div>');
                        _sb._('<div id="')._(_gedcomId)._('-view" type="imgContainer" class="ftt-profile-view-parent-img">');
                        _sb._(_getAvatar(object, 'parent', 1));
                        _sb._('</div>');
                        _sb._('</div>');
                        _sb._('<div>');
                        _sb._('<div class="ftt-profile-view-parent-name">')._(_getName(_info))._('</div>');
                        _sb._('<div class="ftt-profile-view-parent-date">')._(_getDate(_info))._('</div>');
                        _sb._('</div>');
                        if(object.families!=null){
                            _sb._('<div class="ftt-profile-view-arrow-left">&nbsp</div>');
                        }
                        return $(_sb.result());
                    })(object);
                }
                function _info(object, spouse){
                    return (function(object, spouse){
                        if(!spouse) return '';
                        var _sb = storage.stringBuffer(),
                            _event = object.families[spouse[0]].marriage,
                            _date,
                            _place,
                            _location = '';

                        if(_event!=null){
                            _date = _event.date;
                            _place = _event.place;
                            if(_place != null && _place[0].country != null){
                                _location = _place[0].country;
                            } else {
                                _location = '';
                            }
                            _sb._('<div>');
                            _sb._('<div>')._((_date!=null&&_date[2]!=null)?_date[2]:'')._('</div>');
                            _sb._('<div>')._(_location)._('</div>');
                            _sb._('</div>');
                            return $(_sb.result());
                        }
                        return '';
                    })(object, spouse);
                }
                function _spouse(spouse, bcolor){
                    return (function(spouse, bcolor){
                        var _sb = storage.stringBuffer(),
                            _gedcomId = spouse[1],
                            _object = family[_gedcomId],
                            _info = (object)?storage.usertree.parse(_object):false;

                        if(!_object) return ''

                        _sb._('<div>');
                        _sb._('<div id="')._(_gedcomId)._('-view" type="imgContainer" class="ftt-profile-view-parent-img" style="border:2px solid #')._(bcolor)._(';">');
                        _sb._(_getAvatar(_object, 'parent', 1));
                        _sb._('</div>');
                        _sb._('</div>');
                        _sb._('<div>');
                        _sb._('<div class="ftt-profile-view-parent-name">')._(_getName(_info))._('</div>');
                        _sb._('<div class="ftt-profile-view-parent-date">')._(_getDate(_info))._('</div>');
                        _sb._('</div>');
                        if(_object.families!=null){
                            _sb._('<div class="ftt-profile-view-arrow-right" style="background:#')._(bcolor)._(';">&nbsp</div>');
                        }
                        return $(_sb.result());
                    })(spouse, bcolor);
                }
                function _former_spouse(spouse, bcolor, position){
                    return (function(spouse, bcolor, position){
                        var _sb = storage.stringBuffer(),
                            _gedcomId = spouse[1],
                            _object = family[_gedcomId],
                            _info = storage.usertree.parse(_object);
                        _sb._('<div id="')._(_gedcomId)._('" class="ftt-profile-view-spouse-div ')._(position)._('">');
                        _sb._('<div id="')._(_gedcomId)._('-view" type="imgContainer" class="ftt-profile-view-former-img" style="border:2px solid #')._(bcolor)._(';">');
                        _sb._(_getAvatar(_object, 'parent', 0.5));
                        _sb._('</div>');
                        _sb._('<div>');
                        _sb._('<div class="ftt-profile-view-parent-name former">')._(_getName(_info))._('</div>');
                        _sb._('<div class="ftt-profile-view-parent-date former">')._(_getDate(_info))._('</div>');
                        _sb._('</div>');
                        _sb._('<div class="ftt-profile-view-former-arrow-')._(position)._('" style="background:')._(bcolor)._(';">&nbsp</div>');
                        _sb._('<div class="ftt-profile-view-former-arrow-')._(position)._(' text" style="color:')._(bcolor)._(';">')._(_info.marr(spouse[0], 'date', 2))._('</div>');
                        _sb._('</div>');
                        _sb._('</div>');
                        return $(_sb.result());
                    })(spouse, bcolor, position);
                }
                function _child(child, len, position){
                    return (function(child, len, position){
                        var _sb = storage.stringBuffer(),
                            _gedcomId = child.gedcom_id,
                            _object = family[_gedcomId],
                            _bcolor = (len>1)?spouse_border[child.family_id]:"000000",
                            _info = storage.usertree.parse(_object);

                        _sb._('<div id="');
                        _sb._(_gedcomId);
                        _sb._('" class="ftt-profile-view-child" style="height:170px;top:');
                        _sb._(position.top);
                        _sb._('px;left:');
                        _sb._(position.left);
                        _sb._('px;">');
                        _sb._('<div id="')._(_gedcomId)._('-view" type="imgContainer" style="height:80px;width:72px;border:2px solid #');
                        _sb._(_bcolor);
                        _sb._('" class="ftt-profile-view-child-img">');
                        _sb._(_getAvatar(_object, 'child', 1));
                        _sb._('</div>');
                        _sb._('<div>');
                        _sb._('<div class="ftt-profile-view-child-name">')._(_getName(_info))._('</div>');
                        _sb._('<div class="ftt-profile-view-child-date">')._(_getDate(_info))._('</div>');
                        _sb._('</div>');
                        _sb._('<div class="ftt-profile-view-arrow-up" style="background:#')._(_bcolor)._(';">&nbsp</div>');
                        _sb._('</div>');
                        return $(_sb.result());
                    })(child, len, position);
                }
            })()
            return object;
        }

        /*
        * PHOTOS
         */
        $module.fn.photos = function(){
            var fn;

            fn = {
                create: function(callback){
                    FB.api('/'+$module.data.parse.facebook_id+'/photos', function(resp){
                        callback($FamilyTreeTop.fn.mod("PHOTOS").render({
                            facebook: resp.data,
                            gedcom: $module.data.object.media
                        }));
                    });
                }
            }

            return fn.create;
        }

        /*
        * RELATION
         */
        $module.fn.relation = function(){
            var $fn = {
                    createNode:function(id, data){
                        return {
                            id:"FTTRelationMapperNodeId_"+id,
                            name:"FTTRelationMapperNodeName_"+id,
                            data:data,
                            children:[]
                        }
                    },
                    createTree:function(conn, vertex){
                        var setNodes =function(el, prev, conn, pos, iter){
                            var p = parseInt(pos) + parseInt(iter);
                            if("undefined" !== conn[p] && conn.length == p + 1){
                                var target = conn[p];
                                var object = storage.usertree.pull[target.id];
                                if(parseInt(object.user.in_law)){
                                    var node = $fn.createNode(target.id,{conn:conn, id:target.id, in_law:true});
                                    prev.children.push(node);
                                    return true;
                                }
                            }
                            if("undefined" !== typeof(conn[p])){
                                var o = conn[p];
                                var node = $fn.createNode(o.id,{conn:conn, id:o.id, in_law:false});
                                el.children.push(node);
                                setNodes(node, el, conn, p, iter);
                            }
                        }
                        var start = $fn.createNode(vertex[0], {conn:conn, id:vertex[0], in_law:false});
                        setNodes(start, start, conn, vertex[1], -1);
                        setNodes(start, start, conn, vertex[1], 1);
                        return start;
                    },
                    createLabel:function(node){
                        var sb = storage.stringBuffer();
                        var id = node.id.split("_")[1];
                        var object = storage.usertree.pull[id];
                        var parse = storage.usertree.parse(object);
                        sb._('<div class="ftt-relation-mapper-node">');
                        if(node.data.in_law){
                            sb._('<div class="ftt-relation-mapper-node-plus">&nbsp;</div>');
                        }
                        sb._('<div class="ftt-relation-mapper-node-name">')._(parse.name)._('</div>');
                        sb._('<div class="ftt-relation-mapper-node-relation">')._(parse.relation)._('</div>');
                        sb._('</div>');
                        return sb.result();
                    },
                    getVertex:function(conn){
                        var vertex = [conn[0].id, 0];
                        for(var key in conn){
                            if(!conn.hasOwnProperty(key)) continue;
                            var stream = conn[key].stream;
                            if(stream == 3){
                                var index = parseInt(key) + 1;
                                var el = conn[index];
                                vertex = [el.id, index]
                            }
                        }
                        return vertex;
                    },
                    getTree:function(object){
                        var conn = object.user.connection;
                        var vertex = $fn.getVertex(conn);
                        return [conn, vertex, $fn.createTree(conn, vertex)];
                    },
                    getLevelToShow:function(tree){
                        return tree[0].length;
                    },
                    setTree:function(tree){
                        var st = new $jit.ST({
                            injectInto: 'ftt_relation_mapper_viz',
                            transition: $jit.Trans.Quart.easeInOut,
                            levelDistance: 30,
                            //offsetX:240,
                            offsetY:70,
                            levelsToShow: $fn.getLevelToShow(tree),
                            constrained: false,
                            Node: {
                                height: 28,
                                width: 120,
                                align:"center",
                                type: 'rectangle',
                                color: '#aaa',
                                overridable: true
                            },
                            Edge: {
                                type: 'bezier',
                                overridable: true
                            },
                            onCreateLabel: function(label, node){
                                label.id = node.id;
                                label.innerHTML = $fn.createLabel(node);
                            },
                            onBeforePlotNode: function(node){
                                var last = node.data.conn.pop();
                                if("undefined" !== typeof(last) && parseInt(node.data.id) === parseInt(last.id)){
                                    node.data.$color = "#FFC90E";
                                } else {
                                    node.data.$color = "#EFE4B0";
                                }
                            },
                            onBeforePlotLine:function(adj){
                                if(adj.nodeTo.data.in_law){
                                    adj.data.$color = "#FFFFFF";
                                }
                            }
                        });
                        st.loadJSON(tree[2]);
                        st.compute();
                        st.onClick(st.root);
                        st.switchPosition("top", "replot", {
                            onComplete: function(){
                            }
                        });
                    }
                },
                $tree = $fn.getTree($module.data.object);

            if($module.data.gedcom_id == storage.usertree.gedcom_id) return false;
            setTimeout(function(){
                $fn.setTree($tree);
            }, 1);
            var height = (function(t){
                var items = t[0];
                var level = 0;
                for(var key in items){
                    if(!items.hasOwnProperty(key)) continue;
                    var item = items[key];
                    if(item.level > level){
                        level = item.level;
                    }
                }
                return 58*level;
            })($tree);
            var width = 600;
            return $('<div id="ftt_relation_mapper_viz" style="width:'+width+'px; height:'+height+'px; margin: 0 auto;"></div>');
        }

        /*
        * EDITOR
         */
        return {
            editor:function(settings){
                if($module.data.slide) return false;

                $module.fn.mod("tooltip").cleaner();

                //data
                $module.data.gedcom_id = settings.gedcom_id;
                $module.data.object = $module.fn.getObject($module.data.gedcom_id);
                $module.data.parse = $module.fn.parse($module.data.object);

                if(!$module.data.object) return false;
                $module.data.basic = $module.fn.basic();

                // create slide with info module structure
                $module.data.slide = $module.fn.slide();
                $module.data.slide.content([
                    {
                        id: "basic_info",
                        name: "Basic Info",
                        level: 0,
                        content: $module.data.basic.render($module.data.gedcom_id)
                    },
                    {
                        id: "family",
                        name: "Family",
                        level: 1,
                        content: $module.fn.family()
                    },
                    {
                        id: "photos",
                        name: "Photos",
                        level: 2,
                        content: $module.fn.photos()
                    },
                    {
                        id: "relation",
                        name: "Relation on you: "+ $module.data.parse.relation,
                        level: 3,
                        content: $module.fn.relation()
                    }
                ]);
                $module.data.slide.init();
            },
            bind:function(n, c){
                if(!(n in $module.data.callbacks)){
                    $module.data.callbacks[n] = c;
                }
            },
            close:function(){
                if(!$module.data.slide) return;
                $module.data.slide.close();
            },
            init:function(renderType){
                $module.data.renderType = renderType;
            }
        }
    }, true);
})(jQuery, $FamilyTreeTop);


