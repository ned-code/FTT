(function($, $ftt){
    $ftt.module.create("MOD_SYS_PROFILE", function(){
        var	module = this,
            fn,
            settings = {},
            path = "/components/com_manager/modules/login/imgs/",
            notifications,
            msg;

        msg = {
            FTT_MOD_LOGIN_PROFILE:"Profile",
            FTT_MOD_LOGIN_LANGUAGE:"Language",
            FTT_MOD_LOGIN_LOGOUT:"Log Out",
            FTT_MOD_LOGIN_CONNECT_WITH_FACEBOOK:"Connect With Facebook",
            FTT_MOD_LOGIN_LANGUAGE_DIALOG:"Language",
            FTT_MOD_LOGIN_FF_LOGGED: "You logged in as",
            FTT_MOD_LOGIN_FF_EXIT: "Exit this Family Trees"

        }

        module.menu = null;
        module.renderType = null;

        //init functions
        fn = {
            ajax:function(func, params, callback){
                module.fn.call("profile", "JMBProfile", func, params, function(res){
                    callback(res);
                }, true);
            },
            langList:function(){
                var st = module.fn.stringBuffer();
                st._('<ul>');
                $(settings.languages).each(function(i,el){
                    if(parseInt(el.published)){
                        var def = (settings.default_language != null)?settings.default_language:$module.fn.usertree().getLocale();
                        if(el.lang_code == def){
                            st._('<li>');
                            st._('<div class="flag ')._(el.lang_code)._('">&nbsp;</div>');
                            st._('<div><input name="country" type="radio" checked="checked" value="')._(el.lang_code)._('"></div>');
                            st._('<div class="title">')._(el.title)._('</div>');
                            st._('</li>');
                        } else {
                            st._('<li>');
                            st._('<div class="flag ')._(el.lang_code)._('">&nbsp;</div>');
                            st._('<div><input name="country" type="radio" value="')._(el.lang_code)._('"></div>');
                            st._('<div class="title">')._(el.title)._('</div>');
                            st._('</li>');
                        }
                    }
                });
                st._('</ul>');
                st._('<div class="ftt-button-ok"><input type="button" value="OK"></div>');;
                return $(st.result());
            },
            getDefaultLang:function(){
                var lang = settings.languages;
                for(var key in lang){
                    var l = lang[key];
                    if(settings.default_language!=null){
                        if(l.lang_code == settings.default_language){
                            return l.title;
                        }
                    } else {
                        if(parseInt(l.def)){
                            return l.title;
                        }
                    }
                }
            },
            menu:function(){
                var menu, list, sb = module.fn.stringBuffer(), contEl;
                sb._('<div class="menu">');
                if(settings.user_data && settings.user_data.pull.length != 0){
                    sb._('<div id="profile"><span>')._(msg.FTT_MOD_LOGIN_PROFILE)._('</span></div>');
                }
                sb._('<div id="language"><span>')._(msg.FTT_MOD_LOGIN_LANGUAGE)._(': ')._(this.getDefaultLang())._('</span></div>');
                sb._('<div id="to_facebook"><span>')._('Return to Facebook')._('</span></div>');
                sb._('<div id="logout"><span>')._(msg.FTT_MOD_LOGIN_LOGOUT)._('</span></div>');
                sb._('</div>');
                menu = $(sb.result());
                return {
                    viewLanguage:function(object ,c){
                        this.click.language(object, c);
                    },
                    on:function(object, callback){
                        var m = this;
                        $(object).parent().append(menu);
                        m.init();
                        $(document.body).click(function(ev){
                            m.off();
                            callback();
                        });
                        return this;
                    },
                    off:function(){
                        $(menu).remove();
                        $(menu).find('div').unbind();
                        $(document.body).unbind();
                        return this;
                    },
                    click:{
                        profile:function(obj, callback){
                            if(settings.user_data){
                                var data = settings.user_data,
                                    gedcom_id = data.gedcom_id,
                                    tree_id = data.tree_id,
                                    users = data.users,
                                    pull = data.pull;
                            }
                            callback();
                        },
                        language:function(object, callback){
                            var sb = module.fn.stringBuffer(), modal, selectRadioButton;
                            selectRadioButton = function(){
                                var input = $(this).parent().find('input').attr('checked', 'checked');
                            }
                            modal = $('<div class="ftt-profile-language-list"></div>');
                            $(modal).append(fn.langList(object));
                            $(modal).dialog({
                                width:320,
                                height:240,
                                title: msg.FTT_MOD_LOGIN_LANGUAGE_DIALOG,
                                resizable: false,
                                draggable: false,
                                position: "top",
                                closeOnEscape: false,
                                modal:true,
                                close:function(){
                                    callback();
                                }
                            });
                            $(modal).parent().addClass('language');
                            $(modal).parent().css('top', '20px');
                            $(modal).find('div.flag').click(selectRadioButton);
                            $(modal).find('div.title').click(selectRadioButton);
                            $(modal).find('div.ftt-button-ok input').click(function(){
                                var id = $(modal).find('input:checked').val();
                                var prgb = $('<div class="ftt-language-progressbar"><div><span>Loading...</span></div></div>');
                                $(modal).append(prgb);
                                fn.ajax('language', id, function(json){
                                    callback(id);
                                    setTimeout(function(){
                                        window.location.reload();
                                    }, 1000)
                                });
                                return false;
                            });
                        },
                        to_facebook:function(object, callback){
                            window.top.location.href = storage.app.link;
                            callback();
                        },
                        logout:function(object, callback){
                            jfbcLogoutFacebook = true;
                            jfbc.login.logout_button_click();
                            callback();
                        }
                    },
                    init:function(){
                        var _menu = this;
                        $(menu).find('div').click(function(){
                            var div = this;
                            if($(div).hasClass('active')) return false;
                            $(menu).find('div').removeClass('active');
                            $(div).addClass('active');
                            var revert = function(){
                                $(div).removeClass('active');
                            }
                            _menu.click[$(this).attr('id')](this, revert);
                            return false;
                        });
                        return this;
                    }
                }

            },
            click:function(cont){
                var menu = this.menu();
                module.menu = menu;
                $(cont).click(function(){
                    var button = $(this).find('div.ftt-profile-button');
                    if($(button).hasClass('active')){
                        $(button).removeClass('active');
                        menu.off();
                        $(document.body).unbind();
                    } else {
                        $(button).addClass('active');
                        menu.on(button, function(){
                            $(button).removeClass('active');
                            menu.off();
                        });
                    }
                    return false;
                });
            },
            append:function(parent, cont, c){
                if($(parent).length != 0){
                    $(parent).append(cont);
                    if("function" === typeof(c)){
                        c.call(cont);
                    }
                } else {
                    setTimeout(function(){
                        fn.append(parent, cont, c);
                    }, 250);
                }
            },
            renderFamous: function(renderType){
                var user, cont, sb = module.fn.stringBuffer();
                if( !(user = module.fn.user()) ) return false;
                sb._('<div class="jmb-profile-famous-cont">');
                    sb._('<table>');
                        sb._('<tr>');
                            sb._('<td>');
                                sb._('<div class="text"><span>')._(msg.FTT_MOD_LOGIN_FF_LOGGED)._(':</span></div>');
                            sb._('</td>');
                            sb._('<td rowspan="3">');
                                sb._('<div class="avatar">')._(module.fn.avatar().get(user.gedcom_id, 50, 50))._('</div>');
                            sb._('</td>');
                        sb._('</tr>');
                        sb._('<tr><td><div class="name"><span>')._(user.name)._('</span></div></td></tr>');
                        sb._('<tr><td><div class="logout"><span>')._(msg.FTT_MOD_LOGIN_FF_EXIT)._('</span></div></td></tr>');
                    sb._('</table>');
                sb._('</div>');
                cont = $(sb.result());
                module.fn.photos().fixSize({
                    object: cont,
                    width: 50,
                    height: 50
                });
                $(cont).find('div.logout span').click(function(){
                    fn.ajax('famous', 'logout', function(res){
                        window.location.href = $FamilyTreeTop.global.base + 'index.php/famous-family'
                    });
                });
                fn.append('div.jmb-header-container', cont);
            },
            renderFacebook: function(renderType){
                var sb = module.fn.stringBuffer(), user = module.fn.user(), cont;
                //create container
                if(renderType == "desctop"){
                    sb._('<div class="jmb-profile-cont">');
                        sb._('<table>');
                            sb._('<tr>');
                                sb._('<td><div class="avatar"></div></td>');
                                sb._('<td><div class="login"><span></span></div></td>');
                                sb._('<td><div class="settings"><div class="ftt-profile-button"></div></div></td>');
                            sb._('</tr>');
                        sb._('</table>');
                    sb._('</div>');
                    cont = $(sb.result());
                    //set user param
                    $(cont).find('.login span').html(user.name);
                    $(cont).find('.avatar').html(module.fn.avatar().get(user.gedcom_id, 22, 22));
                    module.fn.photos().fixSize({
                        object: cont,
                        width: 22,
                        height: 22
                    });
                    fn.click(cont);
                } else if(renderType =="mobile"){
                    sb._('<div class="ftt-profile-cont-mobile"></div>');
                    cont = $(sb.result());
                }
                fn.append("#_profile", cont);
            },
            renderConnect: function(renderType){
                var sb = module.fn.stringBuffer(), cont, click, connect;
                click = function(){
                    var facebook;
                    if(facebook = module.fn.facebook()){
                        facebook.login(connect);
                    }
                }
                connect = function(){
                    var facebook;
                    if(facebook = module.fn.facebook()){
                        facebook.login(function(response){
                            if(response.authResponse){
                                window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=loginFacebookUser&return=myfamily';
                            } else {
                                alert('Login failed.')
                            }
                        });
                    }
                }
                if(renderType == "desctop"){
                    sb._('<div class="jmb-profile-cont">');
                    sb._('<div class="facebook"><span>')._(msg.FTT_MOD_LOGIN_CONNECT_WITH_FACEBOOK)._('</span></div>');
                    sb._('</div>');
                    cont = $(sb.result());
                    $(cont).find(".facebook span").click(click);
                } else if(renderType == "mobile"){
                    sb._('<div class="ftt-profile-cont-mobile-connect"></div>');
                    cont = $(sb.result());
                    $(cont).click(click);
                }
                fn.append("#_profile", cont);
            },
            createBox:function(){
                var renderType = module.renderType;
                if($FamilyTreeTop.global.loginType){
                    fn.renderFamous(renderType);
                } else if(module.fn.usertree() && module.fn.usertree().isGuest()){
                    fn.renderConnect(renderType);
                } else if(module.fn.usertree() && module.fn.usertree().isUser()){
                    fn.renderFacebook(renderType);
                }
            },
            user:function(callback){
                var json;
                fn.ajax('user', null, function(json){
                    if(!json) callback(false);
                    settings.languages = json.languages;
                    settings.default_language = json.default_language;
                    msg = json.msg;
                    callback();
                });
            },
            init:function(){
                fn.user(function(){
                    fn.createBox()
                });
            }
        }

        /*
        if(window!=window.top){
            module.init = function(callback){
                function _ajax_ (url, callback){
                    $.ajax({
                        url: url,
                        type: "POST",
                        dataType: "json",
                        complete : callback
                    });
                }
                function _redirect_ (){
                    var bUrl = $FamilyTreeTop.global.base;
                    window.location.href= bUrl+'index.php/myfamily';
                }
                if($FamilyTreeTop.global.alias == 'home' || $FamilyTreeTop.global.alias == 'famous-family') {
                    _ajax_("index.php?option=com_manager&task=setLocation&alias=myfamily" ,function(){
                        _redirect_();
                    });
                } else if($FamilyTreeTop.global.loginType){
                    _ajax_("index.php?option=com_manager&task=clearFamousData" ,function(){
                        _redirect_();
                    });
                } else {
                    setTimeout(function(){
                        callback();
                    }, 1);
                }
            }
            return false;
        } else {
            module.init = fn.init;
        }
        return this;
        */
        return {
            init: function(renderType){
                module.renderType = renderType;
                fn.init();
            }
        }
    }, true);
})(jQuery, $FamilyTreeTop);
/*
(function($, $ftt){
    $ftt.module.create("MOD_SYS_PROFILE", function(){
        var	module = this;
        module._generateBorders=function(n){
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

        module.imageSize = {
            parent:{
                width:108,
                height:120
            },
            child:{
                width:72,
                height:80
            }
        }
        module.borders = module._generateBorders(100);
        module.border_iter = 0;
        module.spouse_border = {};
        module.childsPos = {};

        module.views = {};
        module.message = {
            FTT_MOD_PROFILE_EDITOR_VIEW:"View",
            FTT_MOD_PROFILE_EDITOR_VIEW_PROFILE:"Profile",
            FTT_MOD_PROFILE_EDITOR_VIEW_PROFILE_FULL_NAME:"Full Name",
            FTT_MOD_PROFILE_EDITOR_VIEW_PROFILE_KWON_AS:"Know As",
            FTT_MOD_PROFILE_EDITOR_VIEW_PROFILE_BIRTHDAY:"Birthday",
            FTT_MOD_PROFILE_EDITOR_VIEW_PROFILE_BIRTHPLACE:"Birthplace",
            FTT_MOD_PROFILE_EDITOR_VIEW_PROFILE_DEATHDAY:"Deathday",
            FTT_MOD_PROFILE_EDITOR_VIEW_PROFILE_DEATHPLACE:"Deathplace",
            FTT_MOD_PROFILE_EDITOR_VIEW_PROFILE_RELATION:"Relation",
            FTT_MOD_PROFILE_EDITOR_VIEW_PHOTOS:"Photos",
            FTT_MOD_PROFILE_EDITOR_VIEW_FAMILY:"Family",
            FTT_MOD_PROFILE_EDITOR_VIEW_RELATION_MAPPER:"Relation Mapper",
            FTT_MOD_PROFILE_EDITOR_EDIT:"Edit",
            FTT_MOD_PROFILE_EDITOR_EDIT_BASIC:"Basic Details",
            FTT_MOD_PROFILE_EDITOR_EDIT_UNIONS:"Unions",
            FTT_MOD_PROFILE_EDITOR_EDIT_PHOTOS:"Photos",
            FTT_MOD_PROFILE_EDITOR_EDIT_MORE_OPTIONS:"More Options",
            FTT_MOD_PROFILE_EDITOR_SAVE:"Save",
            FTT_MOD_PROFILE_EDITOR_SAVE_AND_CLOSE:"Save",
            FTT_MOD_PROFILE_EDITOR_CANCEL:"Cancel",
            FTT_MOD_PROFILE_EDITOR_FORM_SPOUSE:"Spouse",
            FTT_MOD_PROFILE_EDITOR_FORM_GENDER:"Gender",
            FTT_MOD_PROFILE_EDITOR_FORM_GENDER_FEMALE:"Female",
            FTT_MOD_PROFILE_EDITOR_FORM_GENDER_MALE:"Male",
            FTT_MOD_PROFILE_EDITOR_FORM_LIVING:"Living",
            FTT_MOD_PROFILE_EDITOR_FORM_LIVING_YES:"Yes",
            FTT_MOD_PROFILE_EDITOR_FORM_LIVING_NO:"No",
            FTT_MOD_PROFILE_EDITOR_FORM_FIRST_NAME:"First Name",
            FTT_MOD_PROFILE_EDITOR_FORM_MIDDLE_NAME:"Middle Name",
            FTT_MOD_PROFILE_EDITOR_FORM_LAST_NAME:"Last Name",
            FTT_MOD_PROFILE_EDITOR_FORM_KNOW_AS:"Know As",
            FTT_MOD_PROFILE_EDITOR_FORM_BORN:"Born",
            FTT_MOD_PROFILE_EDITOR_FORM_BORNPLACE:"Birtplace",
            FTT_MOD_PROFILE_EDITOR_FORM_DEATH:"Death",
            FTT_MOD_PROFILE_EDITOR_FORM_DEATHPLACE:"Deathplace",
            FTT_MOD_PROFILE_EDITOR_FORM_TYPE:"Type",
            FTT_MOD_PROFILE_EDITOR_FORM_TYPE_MARRIAGE:"Marriage",
            FTT_MOD_PROFILE_EDITOR_FORM_DATE:"Date",
            FTT_MOD_PROFILE_EDITOR_FORM_DAY:"Day",
            FTT_MOD_PROFILE_EDITOR_FORM_MONTH:"Month",
            FTT_MOD_PROFILE_EDITOR_FORM_JAN:"January",
            FTT_MOD_PROFILE_EDITOR_FORM_FEB:"February",
            FTT_MOD_PROFILE_EDITOR_FORM_MAR:"March",
            FTT_MOD_PROFILE_EDITOR_FORM_APR:"April",
            FTT_MOD_PROFILE_EDITOR_FORM_MAY:"May",
            FTT_MOD_PROFILE_EDITOR_FORM_JUN:"June",
            FTT_MOD_PROFILE_EDITOR_FORM_JUL:"July",
            FTT_MOD_PROFILE_EDITOR_FORM_AUG:"August",
            FTT_MOD_PROFILE_EDITOR_FORM_SEP:"September",
            FTT_MOD_PROFILE_EDITOR_FORM_OCT:"October",
            FTT_MOD_PROFILE_EDITOR_FORM_NOV:"November",
            FTT_MOD_PROFILE_EDITOR_FORM_DEC:"December",
            FTT_MOD_PROFILE_EDITOR_FORM_UNKNOW:"Unknown",
            FTT_MOD_PROFILE_EDITOR_FORM_DIVORCE:"Divorced/Separated",
            FTT_MOD_PROFILE_EDITOR_FORM_LOCATION:"Location",
            FTT_MOD_PROFILE_EDITOR_FORM_UNION:"Union",
            FTT_MOD_PROFILE_EDITOR_FORM_SHOW_CURRENT_PARTNER:"Show as current or latest partner",
            FTT_MOD_PROFILE_EDITOR_FORM_ADD_ANOTHER_UNION:"Add another union",
            FTT_MOD_PROFILE_EDITOR_FORM_ADD_UNION:"Add union",
            FTT_MOD_PROFILE_EDITOR_FORM_ADD_UNION_BASIC_INFO:"Basic Info",
            FTT_MOD_PROFILE_EDITOR_FORM_ADD_UNION_UNION_EVENT:"Union Event",
            FTT_MOD_PROFILE_EDITOR_FORM_UPLOAD:"Upload",
            FTT_MOD_PROFILE_EDITOR_FORM_SET_AVATAR:"Set Avatar",
            FTT_MOD_PROFILE_EDITOR_FORM_ADDS_PARENT:"Add parent",
            FTT_MOD_PROFILE_EDITOR_FORM_ADDS_SPOUSE:"Add spouse",
            FTT_MOD_PROFILE_EDITOR_FORM_ADDS_BROTHER_OR_SISTER:"Add brother or sister",
            FTT_MOD_PROFILE_EDITOR_FORM_ADDS_CHILD:"Add child",
            FTT_MOD_PROFILE_EDITOR_DELETE_BUTTON:"Delete my Profile",
            FTT_MOD_PROFILE_EDITOR_ADVANCED_BUTTON: "Advanced Options",
            FTT_MOD_PROFILE_EDITOR_DELETE_CONFIRM:"Are you sure you want to delete the information about that user?",
            FTT_MOD_PROFILE_EDITOR_DELETE_USER_CONFIRM:"You are about to remove yourself from this family tree. Once this is done, you will not be able to view this family tree unless an existing member invites you back.",
            FTT_MOD_PROFILE_EDITOR_DELETE_TREE_CONFIRM:"You are about to remove yourself from this family tree. Since you are the only registered person, all members in this family tree will be completely deleted.",
            FTT_MOD_PROFILE_EDITOR_DELETE_UNREGISTERED_MEMBER:"You are about to remove %% from your family tree.<br>Please select an option:",
            FTT_MOD_PROFILE_EDITOR_TITLE_UNLINK:'Leave my profile unchanged',
            FTT_MOD_PROFILE_EDITOR_DESCR_UNLINK:'This process will keep your profile details intact. All names, dates and other info will remain visible by existing family members',
            FTT_MOD_PROFILE_EDITOR_TITLE_DELETE_DATA:'Delete data',
            FTT_MOD_PROFILE_EDITOR_DESCR_DELETE_DATA:'This process will wipe your profile clean. All names, dates and other info will be removed and replaced with "unknown"',
            FTT_MOD_PROFILE_EDITOR_TITLE_DELETE_AND_REMOVE:'Delete data and remove member',
            FTT_MOD_PROFILE_EDITOR_DESCR_DELETE_AND_REMOVE:'This process will completely remove your branch from this family tree. Note that family members with descendants cannot  be removed.',
            FTT_MOD_PROFILE_EDITOR_DELETE_FIRST_CONFIRM:"Since this family tree does not contain any other registered members, this action will completly delete this family tree. Do you want to delete your family tree?"
        };
        module.dialog_settings = {
            width:700,
            height:500,
            resizable: false,
            draggable: false,
            position: "top",
            closeOnEscape: false,
            modal:true,
            close:function(){
                jQuery(this).dialog("destroy");
                jQuery(this).remove();
                module.functions.callEvents();
                //module.functions.clearVariable();
            }
        };
        module.functions = {
            ajax:function(func, params, callback){
                $FamilyTreeTop.fn.mod("ajax").call("profile", "JMBProfile", func, params, function(res){
                    callback(res);
                });
            },
            ajaxForm:function(settings){
                var validate_options = (settings.validate)?settings.validate:{};
                jQuery(settings.target).validate(validate_options);
                jQuery(settings.target).ajaxForm({
                    url:[storage.baseurl,'components/com_manager/php/ajax.php'].join(''),
                    type:"POST",
                    data: { "module":"profile","class":"JMBProfile", "method":settings.method, "args": settings.args },
                    dataType:"json",
                    target:jQuery(storage.iframe).attr('name'),
                    beforeSubmit:function(){
                        storage.progressbar.loading();
                        if(typeof(settings.beforeSubmit) == "function"){
                            settings.beforeSubmit();
                        }
                        return true;
                    },
                    success:function(data){
                        storage.progressbar.off();
                        if(typeof(settings.success) == 'function'){
                            settings.success(data);
                        }
                    }
                });
            },
            isOwner:function(){
                return (module.gedcom_id == module.owner_id);
            },
            setTitleMessage:function(form){
                jQuery(form).find('div.title span').each(function(i, el){
                    var titleText = jQuery(el).text();
                    var valueText = module.message[titleText];
                    jQuery(el).text(valueText);
                });
            },
            setTextObject:function(form){
                jQuery(form).find('div.text').each(function(i,el){
                    var classList = jQuery(el).attr('class').split(" ");
                    var span = jQuery(el).find('span');
                    switch(classList[0]){
                        case "gender":
                            var options = jQuery(span).find('option');
                            jQuery(options).each(function(i, el){
                                var text = jQuery(el).text();
                                jQuery(el).text(module.message[text]);
                            });
                            break;

                        case "living":
                            var options = jQuery(span).find('option');
                            jQuery(options).each(function(i, el){
                                var text = jQuery(el).text();
                                jQuery(el).text(module.message[text]);
                            });
                            break;

                        case "spouse":
                            var spouseOptions = module.functions.getOptionsSpouse();
                            jQuery(span).find('select[name="spouse"]').append(spouseOptions);
                            break;

                        case "birth_date":
                            var daysOptions = module.functions.getOptionsDays();
                            var monthOptions = module.functions.getOptionsMonths();
                            jQuery(span).html(module.functions.getReplaceMessage(span, 'FTT_MOD_PROFILE_EDITOR_FORM_UNKNOW'));
                            jQuery(span).find('select[name="birth_days"]').append(daysOptions);
                            jQuery(span).find('select[name="birth_months"]').append(monthOptions);
                            module.functions.setChangeDate(span, 'birth');
                            break;

                        case "death_date":
                            var daysOptions = module.functions.getOptionsDays();
                            var monthOptions = module.functions.getOptionsMonths();
                            jQuery(span).html(module.functions.getReplaceMessage(span, 'FTT_MOD_PROFILE_EDITOR_FORM_UNKNOW'));
                            jQuery(span).find('select[name="death_days"]').append(daysOptions);
                            jQuery(span).find('select[name="death_months"]').append(monthOptions);
                            module.functions.setChangeDate(span, 'daeth');
                            break;

                        case "marr_date":
                            var daysOptions = module.functions.getOptionsDays();
                            var monthOptions = module.functions.getOptionsMonths();
                            jQuery(span).find('select[name="marr_days"]').append(daysOptions);
                            jQuery(span).find('select[name="marr_months"]').append(monthOptions);
                            module.functions.setChangeDate(span, 'marr');
                            break;
                    }
                });
            },
            setTextValue:function(form){
                jQuery(form).find('div.text').each(function(i, el){
                    var classList = jQuery(el).attr('class').split(" ");
                    var user = module.user;
                    var span = jQuery(el).find('span');
                    var parents = jQuery(span).parents('tr');
                    switch(classList[0]){
                        case "avatar":
                            var div =  jQuery(span).find('div.jmb-dialog-avatar');
                            var width = jQuery(div).attr('width');
                            var height = jQuery(div).attr('height');
                            jQuery(div).css('width', width+'px').css('height', height+'px');
                            var avatar = module.functions.getAvatar(module.gedcom_id, width, height);
                            jQuery(div).html(avatar);
                            break;

                        case "spouse_avatar":
                            var div =  jQuery(span).find('div.jmb-dialog-avatar');
                            var width = jQuery(div).attr('width');
                            var height = jQuery(div).attr('height');
                            jQuery(div).css('width', width+'px').css('height', height+'px');
                            var avatar = module.functions.getAvatar(module.spouse_id, width, height);
                            jQuery(div).html(avatar);
                            break;

                        case "spouse_full_name":
                            var spouse = module.functions.getParseUserInfo(module.spouse_id);
                            jQuery(span).text(spouse.full_name);
                            break;

                        case "full_name":
                            var full_name = user.full_name;
                            if(full_name != ''){
                                jQuery(span).text(user.full_name);
                            } else {
                                //jQuery(parents[0]).hide();
                            }
                            break;

                        case "know_as":
                            var know_as = user.nick;
                            if(know_as != ''){
                                jQuery(span).text(user.nick);
                            } else {
                                //jQuery(parents[0]).hide();
                            }
                            break;

                        case "relation":
                            var relation = user.relation;
                            if(relation){
                                jQuery(span).text(relation);
                            } else {
                                //jQuery(parents[0]).hide();
                            }
                            break;

                        case "spouse_birthday":
                            if(!spouse) return;
                            var spouse = module.functions.getParseUserInfo(module.spouse_id);
                            jQuery(span).text(spouse.date('birth'));
                            break;

                        case "birthday":
                            var birthday = user.date('birth')
                            if(birthday != ''){
                                jQuery(span).text(birthday);
                            } else {
                                //jQuery(parents[0]).hide();
                            }
                            break;

                        case "spouse_birthplace":
                            var spouse = module.functions.getParseUserInfo(module.spouse_id);
                            var place = spouse.place('birth');
                            var placeName = (place!='')?place.place_name:'';
                            jQuery(span).text(placeName);
                            break;

                        case "birthplace":
                            var place = user.place('birth');
                            var placeName = (place!='')?place.place_name:'';
                            if(placeName != ''){
                                jQuery(span).text(placeName);
                            } else {
                                //jQuery(parents[0]).hide();
                            }
                            break;

                        case "deathday":
                            var deathday = user.date('death');
                            if(deathday != ''){
                                jQuery(span).text(deathday);
                            } else {
                                jQuery(parents[0]).hide();
                            }
                            break;

                        case "deathplace":
                            var place = user.place('death');
                            var placeName = (place!='')?place.place_name:'';
                            if(placeName != ''){
                                jQuery(span).text(placeName);
                            } else {
                                jQuery(parents[0]).hide();
                            }
                            break;

                        case "gender":
                            var gender = user.gender;
                            var options = jQuery(span).find('option');
                            jQuery(options).each(function(i, el){
                                if(jQuery(el).val() == gender){
                                    jQuery(el).attr("selected", "selected");
                                }
                                var text = jQuery(el).text();
                                jQuery(el).text(module.message[text]);
                            });
                            break;

                        case "living":
                            var is_alive = user.is_alive;
                            var options = jQuery(span).find('option');
                            jQuery(options).each(function(i, el){
                                if(parseInt(jQuery(el).val()) == is_alive || user.turns > 120){
                                    jQuery(el).attr("selected", "selected");
                                }
                                var text = jQuery(el).text();
                                jQuery(el).text(module.message[text]);
                            });
                            break;

                        case "first_name":
                            var first_name = user.first_name;
                            var input = jQuery(span).find('input');
                            jQuery(input).val(first_name);
                            break;

                        case "middle_name":
                            var middle_name = user.middle_name;
                            var input = jQuery(span).find('input');
                            jQuery(input).val(middle_name);
                            break;

                        case "last_name":
                            var last_name = user.last_name;
                            var input = jQuery(span).find('input');
                            jQuery(input).val(last_name);
                            break;

                        case "nick":
                            var nick = user.nick;
                            var input = jQuery(span).find('input');
                            jQuery(input).val(nick);
                            break;

                        case "birth_date":
                            var date = user.birth();
                            var daysOptions = module.functions.getOptionsDays({
                                date:date
                            });
                            var monthOptions = module.functions.getOptionsMonths({
                                date:date
                            });
                            jQuery(span).html(module.functions.getReplaceMessage(span, 'FTT_MOD_PROFILE_EDITOR_FORM_UNKNOW'));
                            jQuery(span).find('select[name="birth_days"]').append(daysOptions);
                            jQuery(span).find('select[name="birth_months"]').append(monthOptions);
                            jQuery(span).find('input[name="birth_year"]').val(user.birth('year'));
                            if(module.functions.isNullDate(date)){
                                jQuery(span).find('input[name="birth_option"]').attr('checked', true);
                            }
                            module.functions.setChangeDate(span, 'birth');
                            break;

                        case "death_date":
                            var date = user.death();
                            var daysOptions = module.functions.getOptionsDays({
                                date:date
                            });
                            var monthOptions = module.functions.getOptionsMonths({
                                date:date
                            });
                            jQuery(span).html(module.functions.getReplaceMessage(span, 'FTT_MOD_PROFILE_EDITOR_FORM_UNKNOW'));
                            jQuery(span).find('select[name="death_days"]').append(daysOptions);
                            jQuery(span).find('select[name="death_months"]').append(monthOptions);
                            jQuery(span).find('input[name="death_year"]').val(user.death('year'));
                            if(module.functions.isNullDate(date)){
                                jQuery(span).find('input[name="death_option"]').attr('checked', true);
                            }
                            module.functions.setChangeDate(span, 'death');
                            break;

                        case "marr_date":
                            var date = user.marr(module.family_id, 'date');
                            var daysOptions = module.functions.getOptionsDays({
                                date:date
                            });
                            var monthOptions = module.functions.getOptionsMonths({
                                date:date
                            });
                            jQuery(span).find('select[name="marr_days"]').append(daysOptions);
                            jQuery(span).find('select[name="marr_months"]').append(monthOptions);
                            jQuery(span).find('input[name="marr_year"]').val(user.marr(module.family_id, 'date', 2));
                            if(module.functions.isNullDate(date)){
                                jQuery(span).find('input[name="marr_option"]').attr('checked', true);
                            }
                            module.functions.setChangeDate(span, 'marr');
                            break;

                        case "deceased":
                            var date = user.divorce(module.family_id, 'date', 2);
                            if(date!=''){
                                jQuery(span).find('input[name="marr_divorce_year"]').val(date);
                                jQuery(span).find('input[name="deceased"]').attr('checked', true);
                            }
                            break;

                        case "birth_place":
                            jQuery(span).find('input[name="birth_city"]').val(user.place('birth', 'city'));
                            jQuery(span).find('input[name="birth_state"]').val(user.place('birth', 'state'));
                            jQuery(span).find('input[name="birth_country"]').val(user.place('birth', 'country'));
                            break;

                        case "death_place":
                            jQuery(span).find('input[name="death_city"]').val(user.place('death', 'city'));
                            jQuery(span).find('input[name="death_state"]').val(user.place('death', 'state'));
                            jQuery(span).find('input[name="death_country"]').val(user.place('death', 'country'));
                            break;

                        case "marr_place":
                            jQuery(span).find('input[name="marr_city"]').val(user.marr(module.family_id, 'place', 'city'));
                            jQuery(span).find('input[name="marr_state"]').val(user.marr(module.family_id, 'place', 'state'));
                            jQuery(span).find('input[name="marr_country"]').val(user.marr(module.family_id, 'place', 'country'));
                            break;

                        default:
                            //empty
                            break;
                    }
                });
            },
            setChangeDate:function(span, prefix){
                var event, objects = {};
                setEvent(function(){
                    var args = {
                        date : [0, getMonth(), getYear()]
                    }
                    var days = module.functions.getDaysInMonth(args);
                    var select = jQuery(span).find('select[name="'+prefix+'_days"]');
                    var value = parseInt(jQuery(select).val());
                    var options = jQuery(select).find('options');
                    jQuery(select).find('option').remove();
                    jQuery(select).append(module.functions.getOptionsDays(args));
                    if(days != options.length - 1 && value > days){
                        jQuery(select).find('option[value="0"]').attr("selected", "selected");
                    } else {
                        jQuery(select).find('option[value="'+value+'"]').attr("selected", "selected");
                    }
                });
                onChange(['months',"year"]);
                return true;
                function onChange(names){
                    for(var key in names){
                        if(names.hasOwnProperty(key)){
                            var name = names[key];
                            var type = (name=="months")?"select":"input";
                            var object = getObject(span, type, prefix, name);
                            objects[type] = object;
                            jQuery(object).change(event);
                        }
                    }
                }
                function setEvent(callback){
                    event = callback;
                }
                function getYear(){
                    var year = parseInt(jQuery(objects['input']).val());
                    return ("NaN" !== year)?year:null;
                }
                function getMonth(){
                    var month = parseInt(jQuery(objects['select']).val());
                    return ("NaN" !== month)?month:null;
                }
                function getSelector(type, prefix, name){
                    return [type,'[name="', [prefix, name].join('_'),'"]'].join('');
                }
                function getObject(span, type, prefix, name){
                    return jQuery(span).find(getSelector(type, prefix, name));
                }

            },
            setLiving:function(form, living){
                var divs = jQuery(form).find('div.death_date,div.death_place');
                jQuery(divs).each(function(i, el){
                    var parents = jQuery(el).parents('tr');
                    if(living){
                        jQuery(parents[0]).hide();
                    } else {
                        jQuery(parents[0]).show();
                    }
                });
            },
            setContent:function(form){
                var contentBox = jQuery(module.box).find('div.jmb-dialog-profile-content');
                jQuery(contentBox).html('');
                jQuery(contentBox).append(form);
            },
            setAvatar:function(form, width, height, avatar){
                if(typeof(avatar) == 'undefined'){
                    avatar = module.functions.getAvatar(module.gedcom_id, width, height);
                }
                jQuery(form).find('div.jmb-dialog-avatar').html(avatar);
            },
            setGedcomId:function(gedcom_id){
                if(typeof(gedcom_id) != 'undefined'){
                    module.gedcom_id = gedcom_id;
                }
            },
            setPull:function(pull){
                if(pull){
                    module.pull = pull;
                } else {
                    module.pull = storage.usertree.pull;
                }
            },
            setTreeId:function(tree_id){
                if(tree_id){
                    module.tree_id = tree_id;
                } else {
                    module.tree_id = storage.usertree.tree_id;
                }
            },
            setOwnerId:function(owner_id){
                if(owner_id){
                    module.owner_id = owner_id;
                } else {
                    module.owner_id = storage.usertree.gedcom_id;
                }
            },
            setUsers:function(users){
                if(users){
                    module.users = users;
                } else {
                    module.users = storage.usertree.users;
                }
            },
            setObject:function(gedcom_id){
                if(typeof(module.pull[gedcom_id]) != 'undefined'){
                    module.object = module.pull[gedcom_id];
                }
            },
            setFamily:function(family){
                module.spouse_id = family.spouse;
                module.family_id = family.id;
            },
            setUserInfo:function(){
                module.user = module.functions.getParseUserInfo();
            },
            setEvents:function(events){
                if(typeof(events)!='undefined'){
                    module.events = events;
                }
            },
            setActiveDialogButton:function(buttons, mode){
                jQuery(buttons).find('div[value="'+mode+'"]').addClass('active');
            },
            setDefaultFamily:function(view){
                jQuery(view).find('input[name="current_partner"]').attr('checked', true);
            },
            setMessage:function(view, args){
                for(var key in args){
                    var el = args[key];
                    var object = jQuery(view).find(el[0]);
                    var text = jQuery(object)[el[1]]();
                    jQuery(object)[el[1]](module.message[text]);
                }
                return view;
            },
            getUsersLength:function(){
                var users = module.users;
                var count = 0;
                for(var key in users){
                    count++;
                }
                return count;
            },
            getAvatar:function(gedcom_id, width, height){
                return storage.usertree.avatar.get({
                    object:module.pull[gedcom_id],
                    width:width,
                    height:height
                });
            },
            getDefAvatar:function(width, height, gender){
                return storage.usertree.avatar.def({
                    object: module.object,
                    width:width,
                    height: height
                }, gender);
            },
            getReplaceMessage:function(span , text){
                return jQuery(span).html().replace(text, module.message[text]);
            },
            getDaysInMonth:function(args){
                if(typeof(args) == 'undefined' || typeof(args.date) == 'undefined'){
                    return 31;
                }
                var date = args.date;
                var month = date[1];
                var year = (date[2]!=null)?date[2]:0;
                var month_days = [
                    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                ];
                if(month==null) return 31;
                if(month<1 || month > 12) return 0;
                return month_days[((year%4==0) && ((year%100!=0) || (year%400==0)))?1:0][month-1];
            },
            getOptionsSpouse:function(){
                var sb = storage.stringBuffer();
                var families = module.object.families;
                if(families != null){
                    for(var key in families){
                        var family = families[key];
                        if(family.spouse!=null){
                            var spouseInfo = module.functions.getParseUserInfo(family.spouse);
                            sb._('<option value="')._(family.spouse)._('">')._(spouseInfo.name)._('</option>');
                        }
                    }
                }
                return jQuery(sb.result());
            },
            getOptionsDays:function(args){
                var days = module.functions.getDaysInMonth(args);
                var sb = storage.stringBuffer();
                sb._('<option value="0">')._(module.message.FTT_MOD_PROFILE_EDITOR_FORM_DAY)._('</option>');
                for(var i = 1 ; i <= days ; i++ ){
                    if(typeof(args) != 'undefined' && typeof(args.date) != 'undefined' && args.date != ''){
                        var date = args.date;
                        if(date[0]!=null&&date[0]==i){
                            sb._('<option SELECTED value="')._(i)._('">')._(i)._('</option>');
                        } else {
                            sb._('<option value="')._(i)._('">')._(i)._('</option>');
                        }
                    } else {
                        sb._('<option value="')._(i)._('">')._(i)._('</option>');
                    }
                }
                return jQuery(sb.result());
            },
            getOptionsMonths:function(args){
                var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                var sb = storage.stringBuffer();
                sb._('<option value="0">')._(module.message.FTT_MOD_PROFILE_EDITOR_FORM_MONTH)._('</option>');
                for(var i=1 ; i <= months.length ; i++ ){
                    var monthName = module.message['FTT_MOD_PROFILE_EDITOR_FORM_'+(months[i-1].toUpperCase())];
                    if(typeof(args) != 'undefined' && typeof(args.date) != 'undefined' && args.date != ''){
                        var date = args.date;
                        if(date[1]!=null&&date[1]==i){
                            sb._('<option SELECTED value="')._(i)._('">')._(monthName)._('</option>');
                        } else {
                            sb._('<option value="')._(i)._('">')._(monthName)._('</option>');
                        }
                    } else {
                        sb._('<option value="')._(i)._('">')._(monthName)._('</option>');
                    }
                }
                return jQuery(sb.result());
            },
            getUcFirst:function(str){
                var f = str.charAt(0).toUpperCase();
                return f + str.substr(1, str.length-1);
            },
            getView:function(name){
                var views = module.views;
                if(typeof(views[name]) != 'undefined'){
                    return views[name];
                } else{
                    return false;
                }
            },
            getViewObject:function(name){
                var view = this.getView(name);
                if(view){
                    return jQuery(view);
                } else {
                    return false;
                }
            },
            getParseUserInfo:function(gedcom_id){
                if(typeof(gedcom_id)!='undefined'){
                    var stObject = module.pull[gedcom_id];
                    if(typeof(stObject)!='undefined'){
                        return storage.usertree.parse(stObject);
                    } else {
                        return false;
                    }
                } else {
                    return storage.usertree.parse(module.object);
                }
            },
            getUnionsButtonText:function(){
                var object = module.object;
                var families = object.families;
                if(families!=null&&families.length>0){
                    return module.message.FTT_MOD_PROFILE_EDITOR_FORM_ADD_ANOTHER_UNION;
                } else {
                    return module.message.FTT_MOD_PROFILE_EDITOR_FORM_ADD_UNION;
                }
            },
            initEventSelectLiving:function(form){
                jQuery(form).find('select[name="living"]').change(function(){
                    var value = parseInt(jQuery(this).val());
                    module.functions.setLiving(form, value);
                });
            },
            initEventSelectGender:function(form, width, height){
                jQuery(form).find('select[name="gender"]').change(function(){
                    var value = jQuery(this).val();
                    var avatar = module.functions.getDefAvatar(width, height, value);
                    module.functions.setAvatar(form, width, height, avatar);
                });
            },
            initHeader:function(cont, mode){
                this.setActiveDialogButton(cont, mode);
                var buttons = jQuery(cont).find('div[type="button"]');
                jQuery(buttons).click(function(){
                    if(jQuery(this).hasClass('active')) return false;
                    var value = jQuery(this).attr('value');
                    jQuery(buttons).removeClass('active');
                    jQuery(this).addClass('active');
                    module.mode(value);
                    return false;
                });
                jQuery(buttons).each(function(i,el){
                    var span = jQuery(el).find('span');
                    var text = jQuery(span).text();
                    jQuery(span).text(module.message[text]);
                });
            },
            isNullDate:function(date){
                if(date!=''){
                    if(date[0]==null&&date[1]==null&&date[2]==null){
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            },
            callEvents:function(){
                var events = module.events;
                for(var key in events){
                    events[key](module.pull);
                }
            },
            createDialog:function(box, args, callback){
                var result = jQuery.extend({}, module.dialog_settings, args);
                jQuery(box).dialog(result);
                if(typeof(callback)!='undefined'){
                    callback(box);
                }
            },
            clearVariable:function(){
                module.pull = false;
                module.tree_id = false;
                module.owner_id = false;
                module.gedcom_id = false;
                module.object = false;
                module.user = false;
                module.events = false;
                module.spouse_id = false;
                module.family_id = false;
                module.select_photo = false;
                jQuery(module.box).html('');
            }
        }
        module.box = jQuery('<div id="jmb:dialog" class="jmb-dialog-container"></div>');
        module.fnPull = {};

        //create iframe
        if(jQuery("#iframe-profile").length==0){
            var iframe = '<iframe id="iframe-profile" name="#iframe-profile" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">';
            jQuery(document.body).append(iframe);
        }

        module.functions.clearVariable();

        module.init = function(){
            $FamilyTreeTop.fn.mod("ajax").call("profile", "JMBProfile", func, params, function(json){
                if(!json) return false;
                if(json.views){
                    module.views = json.views;
                }
                if(json.language){
                    module.message = json.language;
                }
            }, true);
        }

        module.doCall = function(){
            var module = this, key, pull;
            pull = module.fnPull;
            for(key in pull){
                if(!pull.hasOwnProperty(key)) continue;
                pull[key]();
            }
        }

        return {
            update:function(objects){
                module.pull = storage.usertree.update(objects, (module.tree_id == storage.usertree.tree_id) );
                module.object = module.pull[module.gedcom_id];
                module.user = module.functions.getParseUserInfo();
                module.doCall();
            },
            bind:function(n, c){
                module.fnPull[n] = c;
            },
            cleaner:function(){
                module.fnPull = {};
            },
            render:function(id){
                var fn = module.functions,
                    sb = storage.stringBuffer(),
                    form;

                switch(id){
                    case "edit_basic":
                        form = fn.getViewObject('dialogEditBasic');
                        fn.setTitleMessage(form);
                        fn.setTextValue(form);
                        fn.setLiving(form, (module.user.is_alive && module.user.turns < 120));
                        fn.setAvatar(form, 135, 150);
                        fn.initEventSelectLiving(form);
                        fn.initEventSelectGender(form, 135, 150);
                        fn.ajaxForm({
                            target:jQuery(form).find('form'),
                            method:'basic',
                            args:[module.tree_id,module.owner_id,module.gedcom_id].join(','),
                            validate:{
                                rules:{
                                    first_name:{
                                        required: true
                                    }
                                },
                                messages:{
                                    first_name:""
                                }
                            },
                            success:function(res){
                                module.update(res.objects);
                            }
                        });
                        break;

                    case "edit_unions":
                        sb._('<div class="jmb-dialog-profile-content-unions">');
                        sb._('<div class="jmb-dialog-profile-content-unions-add">');
                        sb._('<input type="button" value="')._(fn.getUnionsButtonText())._('">');
                        sb._('</div>');
                        sb._('</div>');
                        form = jQuery(sb.result());
                        var _fn = {
                            setUnionEventMessage:function(view){
                                return module.functions.setMessage(view,[
                                    ["option[value='MARR']",'text'],
                                    ["div#button input#save",'val'],
                                    ["span#unknown",'text'],
                                    ["span#divorce",'text'],
                                    ["input#a_save",'val'],
                                    ["input#a_cancel",'val']
                                ]);
                            },
                            createAddFamilyBox:function(callback){
                                sb.clear();
                                var view = fn.getViewObject('dialogAddSpouse');
                                jQuery(view).find('.jmb-profile-add-union-buttons input[type="button"]').click(function(){
                                    jQuery(view).remove();
                                    callback();
                                });
                                _fn.setUnionEventMessage(view);
                                fn.setTitleMessage(view);
                                fn.setTextObject(view);
                                fn.setLiving(view, true);
                                fn.initEventSelectLiving(view);
                                jQuery(form).append(view);
                                var args = '{"tree_id":"'+module.tree_id+'","owner_id":"'+module.owner_id+'","gedcom_id":"'+module.user.gedcom_id+'","method":"add"}';
                                module.functions.ajaxForm({
                                    target:jQuery(view).find('form'),
                                    method:'union',
                                    args:args,
                                    success:function(res){
                                        module.update(res.objects);
                                        var family_id = res.data.family_id;
                                        var families = module.object.families;
                                        for(var key in families){
                                            var family = families[key];
                                            if(family.id == family_id){
                                                _fn.createFamilyBox(family);
                                            }
                                        }
                                        jQuery(view).remove();
                                        callback();
                                    }
                                });
                            },
                            createFamilyBox:function(family){
                                var view = fn.getViewObject('dialogEditUnions');
                                fn.setFamily(family);
                                fn.setTitleMessage(view);
                                fn.setTextValue(view);
                                if(module.user.default_family == family.id){
                                    fn.setDefaultFamily(view);
                                }
                                _fn.setUnionEventMessage(view);
                                jQuery(form).append(view);
                                var args = '{"tree_id":"'+module.tree_id+'","owner_id":"'+module.owner_id+'","gedcom_id":"'+module.gedcom_id+'","family_id":"'+module.family_id+'","method":"save"}';
                                fn.ajaxForm({
                                    target:jQuery(view).find('form'),
                                    method:'union',
                                    args:args,
                                    success:function(res){
                                        module.update(res.objects);
                                    }
                                });
                            }
                        }

                        var activeAddFamilyBox = false;
                        jQuery(form).find('input[type="button"]').click(function(){
                            if(activeAddFamilyBox) return false;
                            activeAddFamilyBox = true;
                            _fn.createAddFamilyBox(function(v){
                                activeAddFamilyBox = false;
                            });
                            return false;
                        });

                        //set family
                        var families = module.object.families;
                        if(families!=null){
                            for(key in families){
                                if (!families.hasOwnProperty(key)) continue;
                                if(key != 'length' && families[key].spouse != null && storage.usertree.pull[families[key].spouse]){
                                    _fn.createFamilyBox(families[key]);
                                }
                            }
                        }
                        break;

                    case "edit_photos":
                        var media = module.object.media;
                        var preloader = jQuery("<div class='jmb-dialog-photos-preloader'><div>&nbsp;</div></div>");
                        form = fn.getViewObject('dialogEditPhotos');
                        module.functions.setMessage(form, [
                            ["input[type='submit']",'val'],
                            ["input[name='set']",'val']
                        ]);
                        var _fn = {
                            setMedia:function(){
                                media = {
                                    avatar:null,
                                    photos:[],
                                    cache:[]
                                }
                                if(storage.usertree.tree_id == module.tree_id){
                                    storage.usertree.pull[module.gedcom_id].media = media;
                                }
                                module.pull[module.gedcom_id].media = media;
                            },
                            add:function(res){
                                var self = this;
                                var li = null;
                                if(res!=null&&res.image){
                                    if(jQuery(form).find('.jmb-dialog-photos-content').length==0){
                                        jQuery(form).append(storage.media.render([res.image], true));
                                        li = jQuery(form).find('.jmb-dialog-photos-content li')[0];
                                    } else {
                                        li = jQuery(storage.media.getListItem(res.image, true));
                                        jQuery(form).find('.jmb-dialog-photos-content div.list ul').append(li);
                                    }

                                    self.onDelete(li);
                                    self.onSelect(li);

                                    if(media==null){
                                        self.setMedia();
                                    }

                                    media.photos.push(res.image);
                                }
                            },
                            onDelete:function(li){
                                jQuery(li).find('div.delete').click(function(){
                                    var clikItem = this;
                                    var id = jQuery(clikItem).attr('id');
                                    var json = '{"method":"delete","media_id":"'+id+'"}';
                                    module.functions.ajax('photo', json, function(res){
                                        jQuery(li).remove();
                                        jQuery(form).find('div.switch-avatar input').hide();
                                        jQuery(media.photos).each(function(i, el){
                                            if(el.media_id == id){
                                                media.photos.splice(i,1);
                                            }
                                        });
                                        if(media.avatar!=null&&media.avatar.media_id == id){
                                            media.avatar = null;
                                        }
                                    });
                                    return false;
                                });
                            },
                            onSelect:function(li){
                                jQuery(li).click(function(){
                                    jQuery(form).find('div.jmb-dialog-photos-content li').removeClass('active');
                                    jQuery(this).addClass('active');
                                    module.select_photo = this;
                                    jQuery(form).find('div.switch-avatar input').hide();
                                    if(jQuery(this).attr('id') != module.user.avatar_id){
                                        jQuery(form).find('div.switch-avatar input[name="set"]').show();
                                    }
                                });
                            },
                            initButton:function(){
                                var input = jQuery(form).find('.switch-avatar input');
                                jQuery(input).click(function(){
                                    var media_id = jQuery(module.select_photo).attr('id');
                                    var args = '{"method":"set_avatar","media_id":"'+media_id+'","gedcom_id":"'+module.gedcom_id+'"}';
                                    module.functions.ajax('photo', args, function(res){
                                        media.avatar = media.photos[fn.getParseUserInfo(module.gedcom_id).getPhotoIndex(media_id)];
                                        module.user.avatar_id = media_id;
                                        jQuery(input).hide();
                                    });
                                    jQuery(input).hide();
                                });
                                jQuery(input).hide();
                            }
                        }
                        if(media!=null&&media.photos!=null){
                            var photos = storage.media.render(media.photos, true);
                            jQuery(form).find('.photos-storage').append(photos);
                        }
                        _fn.initButton();
                        jQuery(form).find('li').each(function(i, li){
                            _fn.onSelect(li);
                            _fn.onDelete(li);
                        });
                        module.functions.ajaxForm({
                            target:jQuery(form).find('form'),
                            method:'photo',
                            args:'{"gedcom_id":"'+module.gedcom_id+'","method":"add"}',
                            validate:{
                                rules:{
                                    upload:{
                                        accept: "jpg|gif|png",
                                        required: true
                                    }
                                },
                                messages:{
                                    upload:"",
                                    required: ""
                                }
                            },
                            beforeSubmit:function(){
                                jQuery(form).append(preloader);
                            },
                            success:function(res){
                                jQuery(preloader).remove();
                                if(res.error){
                                    storage.alert(res.message, function(){
                                    });
                                } else {
                                    _fn.add(res);
                                    jQuery(form).find('form').resetForm();
                                }
                            }
                        });
                        break;

                    case "more_options":
                        form = jQuery('<div class="delete-button-container"><div class="delete-button">'+module.message.FTT_MOD_PROFILE_EDITOR_DELETE_BUTTON+'</div><div class="advanced-button">'+module.message.FTT_MOD_PROFILE_EDITOR_ADVANCED_BUTTON+'</div></div>');
                        var deleteFunc = function(args){
                            return (function(args){
                                module.functions.ajax('delete', args, function(res){
                                    var json = storage.getJSON(res.responseText);
                                    if(fn.isOwner()){
                                        FB.api({
                                            method: 'Auth.revokeAuthorization'
                                        }, function(response){
                                            window.location = storage.baseurl + 'index.php?option=com_jfbconnect&task=logout&return=home';
                                        });
                                        return false;
                                    }
                                    if(!json.deleted){
                                        module.update(json.objects);
                                    } else {
                                        storage.usertree.deleted(json.deleted.objects);
                                        storage.usertree.update(json.objects, true);
                                        jQuery(module.box).dialog('close');
                                    }
                                    return false;
                                });
                            })(args);
                        }
                        jQuery(form).find('.delete-button').click(function(){
                            if(confirm(module.message.FTT_MOD_PROFILE_EDITOR_DELETE_CONFIRM)){
                                var args = [module.tree_id, module.owner_id, module.gedcom_id, 'delete_data', 'deleteBranch'].join(',');
                                deleteFunc(args);
                            }
                        });
                        jQuery(form).find('.advanced-button').click(function(){
                            if(fn.getUsersLength() == 1 && fn.isOwner()){
                                if(confirm(module.message.FTT_MOD_PROFILE_EDITOR_DELETE_FIRST_CONFIRM)){
                                    var args = [module.tree_id, module.owner_id, module.gedcom_id, 'delete', 'deleteTree'].join(',');
                                    module.functions.ajax('delete', args, function(res){
                                        FB.api({
                                            method: 'Auth.revokeAuthorization'
                                        }, function(response){
                                            window.location = storage.baseurl + 'index.php?option=com_jfbconnect&task=logout&return=home';
                                        });
                                        return false;
                                    });
                                    return false;
                                }{
                                    return false;
                                }
                            } else {
                                var deleteOptions = fn.getViewObject('dialogMoreOptions');
                                var tr = jQuery(deleteOptions).find('tr');
                                fn.setTitleMessage(deleteOptions);
                                var span = jQuery(deleteOptions).find('div.option span');
                                var text = jQuery(span).text();
                                jQuery(span).html(text.replace('%%', module.user.full_name));
                                if(!fn.isOwner()){
                                    jQuery(tr[0]).remove();
                                }
                                jQuery(form).after(deleteOptions);
                                jQuery(form).hide();
                                jQuery(deleteOptions).find('div.title span').click(function(){
                                    var mes, method = 'deleteBranch';
                                    if(module.gedcom_id != module.owner_id){
                                        mes = module.message.FTT_MOD_PROFILE_EDITOR_DELETE_CONFIRM;
                                    } else {
                                        mes = module.message.FTT_MOD_PROFILE_EDITOR_DELETE_USER_CONFIRM;
                                    }
                                    if(confirm(mes)){
                                        var type = jQuery(this).parent().attr('id');
                                        var args = [module.tree_id, module.owner_id, module.gedcom_id, type, method].join(',');
                                        deleteFunc(args);
                                    }
                                    return false;
                                });
                            }
                        });
                        break;

                    default:
                        //empty
                        break;
                }
                fn.setContent(form);
            },
            mode:function(type, start){
                var fn = module.functions,
                    menu = fn.getViewObject('dialogMenu'+fn.getUcFirst(type));

                jQuery(module.box).parent().removeClass('edit');
                jQuery(module.box).parent().removeClass('view');
                jQuery(module.box).parent().addClass(type);

                jQuery(module.box).find('.jmb-dialog-profile-menu-container').html('').append(menu);

                var lis = jQuery(menu).find('li');
                jQuery(lis).each(function(i,el){
                    var text = jQuery(el).text();
                    if(text == "FTT_MOD_PROFILE_EDITOR_VIEW_RELATION_MAPPER" && module.gedcom_id == storage.usertree.gedcom_id){
                        jQuery(el).remove();
                    } else {
                        jQuery(el).text(module.message[text]);
                    }
                });
                //click events
                var activeMenuItem = null;
                jQuery(lis).click(function(){
                    if(jQuery(this).hasClass('active')) return false;
                    jQuery(activeMenuItem).removeClass('active');
                    jQuery(this).addClass('active');
                    activeMenuItem = this;
                    module.render(jQuery(this).attr('id'));
                    return false;
                });
                if("undefined" !== typeof(start) && "string" === typeof(start)){
                    jQuery(menu).find('li#'+start).click();
                } else {
                    jQuery(menu).find('li').first().click();
                }
            },
            editor:function(type, args){
                var fn = module.functions,
                    dialogBox = fn.getViewObject('dialogCont'),
                    dialogButton = fn.getViewObject('dialogButton');

                $FamilyTreeTop.fn.mod("tooltip").cleaner();

                var gedcom_id = (typeof(args.gedcom_id)=='undefined')?args.object.user.gedcom_id:args.gedcom_id;
                var owner_id = (typeof(args.owner_id) != 'undefined' )? args.owner_id : false;
                var tree_id = (typeof(args.tree_id) != 'undefined')?args.tree_id:false;
                var pull = (typeof(args.pull) != 'undefined')?args.pull:false;
                var users = (typeof(args.users) != 'undefined')?args.users:false;

                fn.clearVariable();
                fn.setGedcomId(gedcom_id);
                fn.setPull(pull);
                fn.setTreeId(tree_id);
                fn.setOwnerId(owner_id);
                fn.setUsers(users);

                if(!module.gedcom_id || !module.tree_id || !module.pull) return false;

                fn.setEvents(args.events);
                fn.setObject(gedcom_id);
                fn.setUserInfo();

                fn.createDialog(module.box, {
                    title:fn.getParseUserInfo().full_name,
                    height: 450
                }, function(box){
                    jQuery(box).css({ background:"white", border:"none" });
                    jQuery(box).parent().css('top', '40px');
                    jQuery(box).html('');
                    jQuery(box).append(dialogBox);
                });

                this.mode(type, args.start);
            },
            add:function(data){
                var args = {};
                var gedcom_id = data.object.user.gedcom_id;
                module.functions.setGedcomId(gedcom_id);
                module.functions.setPull(false);
                module.functions.setTreeId(false);
                module.functions.setOwnerId(false);
                module.functions.setUsers(false);
                module.functions.setEvents(data.events);
                module.functions.setObject(gedcom_id);
                module.functions.setUserInfo();
                return {
                    init:function(){
                        module.functions.setTitleMessage(args.form);
                        module.functions.setTextObject(args.form);
                        module.functions.setLiving(args.form, true);
                        module.functions.initEventSelectLiving(args.form);
                        jQuery(args.form).find('input[type="button"]').click(function(){
                            jQuery(module.box).dialog('close');
                        });
                        module.functions.createDialog(module.box, args.options, function(box){
                            jQuery(module.box).parent().removeClass('edit');
                            jQuery(module.box).parent().removeClass('view');
                            jQuery(module.box).parent().addClass('add');
                            jQuery(box).css({ background:"white", border:"none",height:"auto", overflow:"visible" });
                            jQuery(box).parent().css('top', '40px');
                            jQuery(box).parent().css('height', 'auto');
                            jQuery(box).html('');
                            jQuery(box).append(args.form);
                            module.functions.ajaxForm({
                                target:jQuery(args.form).find('form'),
                                method:'add',
                                validate:{
                                    rules:{
                                        birth_year:{
                                            date:true
                                        },
                                        first_name:{
                                            required: true
                                        }
                                    },
                                    messages:{
                                        birth_year:"",
                                        first_name:""
                                    }
                                },
                                args:args.query,
                                success:function(res){
                                    var objects = res.objects;
                                    jQuery(objects).each(function(i, el){
                                        if(el.user != null && el.user.gedcom_id != null){
                                            storage.usertree.pull[el.user.gedcom_id] = el;
                                        }
                                    });
                                    jQuery(module.box).dialog("close");
                                }
                            });
                        });
                    },
                    parent:function(){
                        var form = module.functions.getViewObject('dialogAddParent');
                        module.functions.setMessage(form,[
                            ["input[type='submit']",'val'],
                            ["input[type='button']",'val']
                        ]);
                        args = {
                            form:form,
                            validate:false,
                            query:'{"method":"parent","owner_id":"'+module.gedcom_id+'"}',
                            options:{
                                title:module.message.FTT_MOD_PROFILE_EDITOR_FORM_ADDS_PARENT,
                                width:475
                            }
                        }
                        return this;
                    },
                    spouse:function(){
                        var form = module.functions.getViewObject('dialogAddSpouse');
                        jQuery(form).find('.jmb-profile-add-union-buttons').css({
                            position: "absolute",
                            right: "0px",
                            top: "-35px"
                        });
                        module.functions.setMessage(form,[
                            ["option[value='MARR']",'text'],
                            ["span#unknown",'text'],
                            ["span#divorce",'text'],
                            ["input[type='submit']",'val'],
                            ["input[type='button']",'val']
                        ]);
                        args = {
                            form:form,
                            validate:false,
                            query:'{"method":"spouse","owner_id":"'+module.gedcom_id+'"}',
                            options:{
                                title:module.message.FTT_MOD_PROFILE_EDITOR_FORM_ADDS_SPOUSE,
                                width:506
                            }
                        }
                        return this;
                    },
                    bs:function(){
                        var form = module.functions.getViewObject('dialogAddParent');
                        module.functions.setMessage(form,[
                            ["input[type='submit']",'val'],
                            ["input[type='button']",'val']
                        ]);
                        args = {
                            form:form,
                            validate:false,
                            query:'{"method":"sibling","owner_id":"'+module.gedcom_id+'"}',
                            options:{
                                title:module.message.FTT_MOD_PROFILE_EDITOR_FORM_ADDS_BROTHER_OR_SISTER,
                                width:475
                            }
                        }
                        return this;
                    },
                    child:function(){
                        var form = module.functions.getViewObject('dialogAddChild');
                        module.functions.setMessage(form,[
                            ["input[type='submit']",'val'],
                            ["input[type='button']",'val']
                        ]);
                        args = {
                            form:form,
                            validate:false,
                            query:'{"method":"child","owner_id":"'+module.gedcom_id+'"}',
                            options:{
                                title:module.message.FTT_MOD_PROFILE_EDITOR_FORM_ADDS_CHILD,
                                height:450,
                                width:506
                            }
                        }
                        return this;
                    }
                }
            }
        };
    }, true);
})(jQuery, $FamilyTreeTop);
*/
