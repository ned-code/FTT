(function($, $ftt){
    $ftt.module.create("MOD_SYS_TOOLTIP", function(){
        var module = this, $fn;
        module.editSettings = {
            style:{
                fill: '#F7F7F7',
                strokeStyle: '#B7B7B7',
                spikeLength: 40,
                spikeGirth: 10,
                padding: 8,
                cornerRadius: 0,
                trigger: 'none',
                closeWhenOthersOpen: false,
                textzIndex:       999,
                boxzIndex:        998,
                wrapperzIndex:    997,
                cssStyles: {
                    fontFamily: '"lucida grande",tahoma,verdana,arial,sans-serif',
                    fontSize: '12px'
                }
            }
        };
        module.viewSettings = {
            button_facebook:true,
            button_edit:true,
            style:{
                fill: '#628638',
                strokeStyle: '#628638',
                spikeLength: 40,
                spikeGirth: 30,
                padding: 0,
                cornerRadius: 0,
                trigger: 'none',
                positions:['left','right','bottom'],
                closeWhenOthersOpen: false,
                textzIndex:       999,
                boxzIndex:        998,
                wrapperzIndex:    997,
                width:405,
                cssStyles: {
                    fontFamily: '"lucida grande",tahoma,verdana,arial,sans-serif',
                    fontSize: '12px'
                }
            }
        };
        module.message = {
            FTT_MOD_TOOLTIPS_NAME:"Name",
            FTT_MOD_TOOLTIPS_BORN:"Born",
            FTT_MOD_TOOLTIPS_DECEASED:"Deceased",
            FTT_MOD_TOOLTIPS_RELATION:"Relation",
            FTT_MOD_TOOLTIPS_SHOW_FULL_PROFILE:"Show full profile",
            FTT_MOD_TOOLTIPS_IS_NOT_REGISTERED:"is not registered.",
            FTT_MOD_TOOLTIPS_CLICK_TO_SEND_EMAIL_INVITATION:"Click here to send %% an invitation.",
            FTT_MOD_TOOLTIPS_EDIT:"Edit this Profile",
            FTT_MOD_TOOLTIPS_ADD:"Add",
            FTT_MOD_TOOLTIPS_ADD_PARENT:"Parent",
            FTT_MOD_TOOLTIPS_ADD_SPOUSE:"Spouse",
            FTT_MOD_TOOLTIPS_ADD_BROTHER_OR_SISTER:"Brother or Sister",
            FTT_MOD_TOOLTIPS_ADD_CHILD:"Child",
            FTT_MOD_TOOLTIPS_ADD_SENT_INVITATION:"Send %% an invitation.",
            FTT_MOD_TOOLTIPS_ADD_LINK:"Link with existing request.",
            FTT_MOD_TOOLTIPS_INVITE_TO_JOIN:"Invite to join"
        }
        module.lastBtActive = false;
        module.btActive = {};
        module.path = "/components/com_manager/modules/tooltip/image/";
        module.colors = {F:["#FFEAF1","#FF77A4"],M:["#ECECFF","#5C9ADE"]};

        $fn = {
            _ajax:function(func, params, callback){
                module.fn.mod("ajax").call("tooltip", "JMBTooltip", func, params, function(res){
                    callback(res);
                });
            },
            _view:function(settings){
                var	message = module.message,
                    sb = module.fn.stringBuffer(),
                    object = settings.object,
                    user = object.user,
                    media = object.media,
                    get = storage.usertree.parse(object),
                    name = get.full_name,
                    birthday = get.date('birth'),
                    death = get.date('death'),
                    relation = get.relation,
                    connection = get.connection(),
                    place;
                sb._('<div id="')._(user.gedcom_id)._('-tooltip-view" class="jmb-tooltip-view-container">');
                sb._('<div class="jmb-tooltip-view-content" style="background: ')._(module.colors[user.gender][0])._(';">');
                sb._('<div class="jmb-tooltip-view-info">');
                sb._('<table>');
                sb._('<tr>');
                sb._('<td class="jmb-tooltip-view-avatar">')
                sb._('<div class="image">')._($fn._avatar(settings));
                if(!parseInt($(document.body).attr('_type')) && settings.button_edit){
                    sb._('<div class="jmb-tooltip-view-edit">&nbsp;</div>');
                }
                if(user.facebook_id!=='0'&&settings.button_facebook){
                    sb._('<div id="')._(user.facebook_id)._('" class="jmb-tooltip-view-facebook">&nbsp;</div>');
                }
                if(get.is_death || get.turns >= 120){
                    sb._('<div class="jmb-tooltip-view-death-marker">&nbsp;</div>');
                }

                sb._('</div>');
                sb._('</td>');
                sb._('<td class="jmb-tooltip-view-info-data">');
                sb._('<table>');
                sb._('<tr>');
                sb._('<td><div class="name">&nbsp;</div></td>');
                sb._('<td><span class="text" style="color:')._(module.colors[user.gender][1])._('; font-weight: bold;">')._(name)._('</span></td>');
                sb._('</tr>');
                if(get.is_birth){
                    place = get.getPlaceString('birth');
                    sb._('<tr>');
                    sb._('<td><div class="born">&nbsp;</div></td>');
                    sb._('<td><span class="text">')._(birthday)._(place)._('</span></td>');
                    sb._('</tr>');
                }
                if(get.is_death){
                    place = get.getPlaceString('death');
                    sb._('<tr>');
                    sb._('<td><div class="deceased">&nbsp;</div></td>');
                    sb._('<td><span class="text">')._(death)._(place)._('</span></td>');
                    sb._('</tr>');
                }
                if(relation){
                    sb._('<tr>');
                    sb._('<td><div class="relation">&nbsp;</div></td>');
                    sb._('<td><span class="text"><font color="blue">')._(relation)._("</font>")._(get.family_line)._('</span></td>');
                    sb._('</tr>');
                }
                if(connection.length != 0){
                    sb._('<tr>');
                    sb._('<td><div class="connection">&nbsp;</div></td>');
                    sb._('<td><span class="text">')._(connection)._('</span></td>');
                    sb._('</tr>');
                }
                sb._('</table>');
                sb._('</td>');
                sb._('</tr>');
                sb._('</table>');
                sb._('<div id="')._(get.gedcom_id)._('" class="jmb-tooltip-view-switch">&nbsp;</div>');
                sb._('</div>');
                if(media!=null&&media.photos.length!=0){
                    sb._('<div class="jmb-tooltip-view-images" style="background: ')._(module.colors[user.gender][0])._(';">');
                    sb._($fn._images(settings));
                    sb._('</div>');
                }
                sb._('</div>');
                if(!parseInt(jQuery(document.body).attr('_type')) && user.facebook_id==='0' && get.turns < 100 && get.is_alive){
                    sb._('<div class="jmb-tooltip-view-send">');
                    sb._('<table style="width: 100%;">');
                    sb._('<tr>');
                    sb._('<td style="width: 70%; text-align: center;">');
                    sb._('<span>')._(get.nick)._(' ')._(message.FTT_MOD_TOOLTIPS_IS_NOT_REGISTERED)._('</span>');
                    sb._('</td>');
                    sb._('<td style="width: 30%;">');
                    sb._('<div class ="jmb-tooltip-view-send-invit-button"><div class="upper"><div class="text">')._(message.FTT_MOD_TOOLTIPS_INVITE_TO_JOIN)._('</div></div><div class="line">&nbsp;</div></div>');
                    sb._('</td>');
                    sb._('</tr>');
                    sb._('</table>');
                    sb._('</div>');
                }
                sb._('</div>');
                return $(sb.result());
            },
            isBothParentsExist:function(object){
                var family = getFamily(object.parents);

                return (family&&family.father&&family.mother)?true:false;

                function getFamily (parents){
                    if(parents == null) return false;
                    for(var first in parents) break;
                    return parents[first];
                }
            },
            _edit:function(settings){
                var	message = module.message,
                    sb = module.fn.stringBuffer(),
                    gedcom_id = settings.gedcom_id,
                    object = settings.object,
                    user = object.user,
                    get = storage.usertree.parse(object),
                    nick = get.nick;

                sb._("<div id='")._(gedcom_id)._("-tooltip-edit' class='jmb-profile-tooltip-container'>");
                sb._("<div class='jmb-profile-tooltip-button-edit'><span>")._(message.FTT_MOD_TOOLTIPS_EDIT)._("</span></div>");
                sb._("<div class='jmb-profile-tooltip-fieldset'><fieldset>");
                sb._("<legend>")._(message.FTT_MOD_TOOLTIPS_ADD)._(":</legend>");
                if(!$fn.isBothParentsExist(object)){
                    sb._("<div class='jmb-profile-tooltip-parent'><span>")._(message.FTT_MOD_TOOLTIPS_ADD_PARENT)._("</span></div>");
                }
                sb._("<div class='jmb-profile-tooltip-spouse'><span>")._(message.FTT_MOD_TOOLTIPS_ADD_SPOUSE)._("</span></div>");
                sb._("<div class='jmb-profile-tooltip-bs'><span>")._(message.FTT_MOD_TOOLTIPS_ADD_BROTHER_OR_SISTER)._("</span></div>");
                sb._("<div class='jmb-profile-tooltip-child'><span>")._(message.FTT_MOD_TOOLTIPS_ADD_CHILD)._("</span></div>");
                sb._('</fieldset></div>');
                if(user.facebook_id==='0' && get.turns < 100 && get.is_alive){
                    sb._("<div class='jmb-profile-tooltip-send'>");
                    sb._('<div class="info"><span>')._(nick)._(' ')._(message.FTT_MOD_TOOLTIPS_IS_NOT_REGISTERED)._('</span></div>');
                    sb._('<div class="invitions"><span class="click">')._(message.FTT_MOD_TOOLTIPS_ADD_SENT_INVITATION.replace("%%", nick))._('</span></div>');
                    sb._('</div>');
                }
                sb._("<div class='jmb-profile-tooltip-close'><a href='javascript:void($FamilyTreeTop.fn.mod(\"tooltip\").close());'><div>&nbsp;</div></a></div>");
                sb._('</div>');
                return jQuery(sb.result());
            },
            _create:function(settings){
                return (settings.type==='view')?$fn._view(settings):$fn._edit(settings);
            },
            _images:function(settings){
                var gedcom_id = settings.object.user.gedcom_id,
                    object = storage.usertree.pull[gedcom_id],
                    media = object.media,
                    photos = (media!=null)?media.photos:false,
                    cache = (media!=null)?media.cache:false,
                    sb = storage.stringBuffer();

                if(!photos) return '';
                sb._('<ul style="width:')._(55*photos.length)._('px;">');
                $(photos).each(function(i,e){
                    sb._('<li style="width:50px;height:50px;">');
                    sb._( storage.usertree.photos.get({
                        image:e,
                        cache:cache,
                        width:50,
                        height:50,
                        prettyPhoto:true
                    }) );
                    sb._('</li>');
                });
                sb._('</ul>')
                return sb.result();
            },
            _avatar:function(settings){
                return storage.usertree.avatar.get({
                    object:settings.object,
                    width:81,
                    height:90
                });
            },
            _get:function(settings){
                var 	user = settings.object.user;
                return {
                    _month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                    gedcom_id:user.gedcom_id,
                    relation:(user.relation!=null)?relation:false,
                    full_name:(function(){
                        var	first_name = user.first_name,
                            middle_name = user.middle_name,
                            last_name = user.last_name;

                        return [first_name, middle_name, last_name].join(' ');
                    })(),
                    date:function(event){
                        var 	event = user[event],
                            date = (event!=null)?event.date:null,
                            day, month, year;
                        if(date!=null){
                            day = date[0];
                            month = this._month[date[1]-1];
                            year = date[2];
                            return [day,month,year].join(' ');
                        }
                        return '';
                    }
                }
            },
            _button_view:function(cont, settings){
                var	st = settings,
                    object = settings.object,
                    offset;

                $(cont).find('div.image').mouseenter(function(){
                    $(this).find('div.jmb-tooltip-view-edit').addClass('active');
                    $(this).find('div.jmb-tooltip-view-facebook').addClass('active');
                }).mouseleave(function(){
                        $(this).find('div.jmb-tooltip-view-edit').removeClass('active');
                        $(this).find('div.jmb-tooltip-view-facebook').removeClass('active');
                    });
                $(cont).find('div.jmb-tooltip-view-facebook').click(function(){
                    var id = $(this).attr('id');
                    window.open('http://www.facebook.com/profile.php?id='+id,'new','width=320,height=240,toolbar=1');
                });
                $(cont).find('div.jmb-tooltip-view-switch').click(function(){
                    $FamilyTreeTop.fn.mod("PROFILE_EDITOR").editor({
                        gedcom_id: object.user.gedcom_id
                    });
                });
                if(module.loginType != 'famous_family'){
                    offset = $(cont).find('div.jmb-tooltip-view-edit').offset();
                    module.fn.mod("tooltip").render('edit', {
                        sub_item:true,
                        gedcom_id:settings.gedcom_id,
                        target:$(cont).find('div.jmb-tooltip-view-edit'),
                        preBuild:function(){
                            offset = $('div.bt-content').find('div.jmb-tooltip-view-edit').offset();
                        },
                        preShow:function(box){
                            if(offset!=null){
                                $(box).offset({top:offset.top + 20 , left:offset.left});
                            }
                        },
                        afterEditorClose:function(){
                            if(typeof(st.afterEditorClose)==='function'){
                                st.afterEditorClose();
                            }
                        }
                    });
                }
            },
            _button_edit:function(cont, settings){
                return false;
                var	st = settings,
                    object = settings.object,
                    divs,
                    add;

                divs = jQuery(cont).find('.jmb-profile-tooltip-fieldset div');
                add = storage.profile.add({
                    object:object,
                    events:{
                        afterEditorClose:function(){
                            $fn.close();
                            if(typeof(st.afterEditorClose)==='function'){
                                st.afterEditorClose();
                            }
                        }
                    }
                });
                $(divs).each(function(index, el){
                    $(el).click(function(){
                        var class_name = $(this).attr('class').split('-');
                        var method = class_name[class_name.length-1]
                        add[method]().init();
                    });
                });
                $(cont).find('.jmb-profile-tooltip-button-edit').click(function(){
                    return false;
                    storage.profile.editor('edit', {
                        object:object,
                        events:{
                            afterEditorClose:function(){
                                if(typeof(st.afterEditorClose)==='function'){
                                    st.afterEditorClose();
                                }
                            }
                        }
                    });
                });
            },
            _buttons:function(cont, settings){
                switch(settings.type){
                    case "edit":
                        $fn._button_edit(cont, settings);
                        break;

                    case "view":
                        $fn._button_view(cont, settings);
                        break;
                }
            },
            _invitation:function(cont, settings){
                var class_name;
                switch(settings.type){
                    case "view": class_name = '.jmb-tooltip-view-send .jmb-tooltip-view-send-invit-button'; break;
                    case "edit": class_name = '.jmb-profile-tooltip-send span.click'; break;
                    default: return;
                }
                $(cont).find(class_name).click(function(){
                    storage.invitation.render(settings.object);
                });
            },
            link_with_request:function(cont, settings){
                var class_name;
                switch(settings.type){
                    case "edit": class_name = '.jmb-profile-tooltip-send div.link span'; break;
                    default: return;
                }
                $(cont).find(class_name).unbind().click(function(){
                    storage.notifications.link(settings);
                });
            },
            _getId:function(settings){
                return [settings.type,settings.gedcom_id].join(':');
            },
            cleaner:function(callback){
                var btActive = module.btActive;
                $(module.lastBtActive.target).btOff();
                for(var key in btActive){
                    var el = btActive[key];
                    $(el.target).btOff();
                }
                module.lastBtActive = false;
                module.btActive = {};
                if(callback) callback();
            },
            closeOpenTooltip:function(settings){
                if(settings.sub_item){
                    return false;
                } else {
                    $fn.close();
                }
            },
            _addBtActive:function(settings){
                var id = $fn._getId(settings);
                module.btActive[id] = settings;
                module.lastBtActive = settings;
            },
            _click:function(target){
                $(target).click(function(){
                    var settings, cont;
                    settings = jQuery.data(target, 'settings');
                    settings.object = storage.usertree.pull[settings.gedcom_id];
                    $fn.closeOpenTooltip(settings);

                    cont = $fn._create(settings);
                    module.fn.mod("media").init(cont);
                    $(cont).hide();
                    $(document.body).append(cont);


                    $fn._addBtActive(settings);

                    settings.style.preHide = function(){
                        delete module.btActive[$fn._getId(settings)];
                        setTimeout(function(){
                            $(cont).remove();
                        }, 1)

                    }
                    $fn._invitation(cont, settings);
                    $fn._buttons(cont, settings);

                    $(settings.target).bt(settings.style);
                    setTimeout(function(){$(settings.target).btOn();}, 1);
                    return false;
                });
            },
            _checkType:function(type){
                if(type === 'view'){
                    return true;
                } else if(type === 'edit'){
                    return true;
                } else {
                    return false;
                }
            },
            _getDefaultSettings:function(type){
                return (type==='view')?module.viewSettings:module.editSettings;
            },
            _getSettings:function(type, args){
                var dSettings = $fn._getDefaultSettings(type),
                    argsSettings = $fn._getArgsSettings(args, type);
                argsSettings.type = type;
                argsSettings.style.contentSelector = ["jQuery('#", args.gedcom_id, "-tooltip-", type,"')"].join('');
                return $.extend(true, {}, dSettings, argsSettings);
            },
            _getArgsSettings:function(args, type){
                var argsSettings = args, usertree = storage.usertree, object = (usertree.pull!=null)?usertree.pull[args.gedcom_id]:false;
                if(!argsSettings.style){
                    argsSettings.style = {};
                }
                if(args.offsetParent){
                    argsSettings.style.offsetParent = args.offsetParent;
                }
                if(args.preBuild){
                    argsSettings.style.preBuild = args.preBuild;
                }
                if(args.preShow){
                    argsSettings.style.preShow = args.preShow;
                }
                if(typeof(args.button_edit) == 'undefined'){
                    if(usertree.pull != null){
                        argsSettings.button_edit = (object.user.facebook_id == '0' || usertree.gedcom_id == args.gedcom_id);
                    }
                }
                if(object && type == "view"){
                    argsSettings.style.fill = module.colors[object.user.gender][1];
                    argsSettings.style.strokeStyle = module.colors[object.user.gender][1];
                }
                return argsSettings;
            },
            close:function(){
                if(module.lastBtActive){
                    $(module.lastBtActive.target).btOff();
                    module.lastBtActive = false;
                }
            }
        }
        return {
            init: function(){
                module.fn.mod("ajax").call("tooltip", "JMBTooltip", "get", null, function(json){
                    if(json&&json.language){
                        module.message = json.language;
                    }
                }, true);

            },
            render:function(type, args){
                var	settings;
                if(!$fn._checkType(type)) return false;
                if(!args.gedcom_id) return false;
                settings = $fn._getSettings(type, args);
                $.data(settings.target, 'settings', settings);
                $fn._click(settings.target);
            },
            update:function(){
                return true;
            },
            cleaner:function(callback){
                var btActive = module.btActive;
                $(module.lastBtActive.target).btOff();
                for(var key in btActive){
                    var el = btActive[key];
                    $(el.target).btOff();
                }
                module.lastBtActive = false;
                module.btActive = {};
                if(callback) callback();
            },
            close:function(){
                $fn.close();
            }
        };
    }, true);
})(jQuery, $FamilyTreeTop);

