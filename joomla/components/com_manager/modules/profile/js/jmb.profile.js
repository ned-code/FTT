function JMBProfile(){
    var	module = this;
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
        FTT_MOD_PROFILE_EDITOR_DELETE_CONFIRM:"Are you sure you want to delete the information about that user?",
        FTT_MOD_PROFILE_EDITOR_DELETE_USER_CONFIRM:"You are about to remove yourself from this family tree. Once this is done, you will not be able to view this family tree unless an existing member invites you back.",
        FTT_MOD_PROFILE_EDITOR_DELETE_TREE_CONFIRM:"You are about to remove yourself from this family tree. Since you are the only registered person, all members in this family tree will be completely deleted.",
        FTT_MOD_PROFILE_EDITOR_DELETE_UNREGISTERED_MEMBER:"You are about to %% remove from your family tree.<br>Please select an option:",
        FTT_MOD_PROFILE_EDITOR_TITLE_UNLINK:'Leave my profile unchanged',
        FTT_MOD_PROFILE_EDITOR_DESCR_UNLINK:'This process will keep your profile details intact. All names, dates and other info will remain visible by existing family members',
        FTT_MOD_PROFILE_EDITOR_TITLE_DELETE_DATA:'Delete data',
        FTT_MOD_PROFILE_EDITOR_DESCR_DELETE_DATA:'This process will wipe your profile clean. All names, dates and other info will be removed and replaced with "unknown"',
        FTT_MOD_PROFILE_EDITOR_TITLE_DELETE_AND_REMOVE:'Delete data and remove member',
        FTT_MOD_PROFILE_EDITOR_DESCR_DELETE_AND_REMOVE:'This process will completely remove your branch from this family tree. Note that family members with descendants cannot  be removed.'
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
            module.functions.clearVariable();
        }
    };
    module.functions = {
        ajax:function(func, params, callback){
            //storage.progressbar.loading();
            host.callMethod("profile", "JMBProfile", func, params, function(res){
                callback(res);
                //storage.progressbar.off();
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
                        break;

                    case "death_date":
                        var daysOptions = module.functions.getOptionsDays();
                        var monthOptions = module.functions.getOptionsMonths();
                        jQuery(span).html(module.functions.getReplaceMessage(span, 'FTT_MOD_PROFILE_EDITOR_FORM_UNKNOW'));
                        jQuery(span).find('select[name="death_days"]').append(daysOptions);
                        jQuery(span).find('select[name="death_months"]').append(monthOptions);
                        break;

                    case "marr_date":
                        var daysOptions = module.functions.getOptionsDays();
                        var monthOptions = module.functions.getOptionsMonths();
                        jQuery(span).find('select[name="marr_days"]').append(daysOptions);
                        jQuery(span).find('select[name="marr_months"]').append(monthOptions);
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
                            jQuery(parents[0]).hide();
                        }
                    break;

                    case "know_as":
                        var know_as = user.nick;
                        if(know_as != ''){
                            jQuery(span).text(user.nick);
                        } else {
                            jQuery(parents[0]).hide();
                        }
                    break;

                    case "relation":
                        var relation = user.relation;
                        if(relation){
                            jQuery(span).text(relation);
                        } else {
                            jQuery(parents[0]).hide();
                        }
                    break;

                    case "spouse_birthday":
                        var spouse = module.functions.getParseUserInfo(module.spouse_id);
                        jQuery(span).text(spouse.date('birth'));
                    break;

                    case "birthday":
                        var birthday = user.date('birth')
                        if(birthday != ''){
                            jQuery(span).text(birthday);
                        } else {
                            jQuery(parents[0]).hide();
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
                            jQuery(parents[0]).hide();
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
                            if(parseInt(jQuery(el).val()) == is_alive){
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
        setObject:function(gedcom_id){
            if(typeof(storage.usertree.pull[gedcom_id]) != 'undefined'){
                module.object = storage.usertree.pull[gedcom_id];
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
        },
        getAvatar:function(gedcom_id, width, height){
            return storage.usertree.avatar.get({
                object:storage.usertree.pull[gedcom_id],
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
            var year = (date[2]==null)?date[2]:0;
            var month_days = [
                [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            ];
            if(month==null) return 31;
            if(month<1 || month > 12) return 0;
            return month_days[((year%4==0) && ((year%100!=0) || (year%400==0)))?1:0][month-1];
        },
        getOptionsSpouse:function(){
            var sb = host.stringBuffer();
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
            var sb = host.stringBuffer();
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
            var sb = host.stringBuffer();
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
                var stObject = storage.usertree.pull[gedcom_id];
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
                events[key]();
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

    //create iframe
    if(jQuery("#iframe-profile").length==0){
        var iframe = '<iframe id="iframe-profile" name="#iframe-profile" style="display:none;position:absolute;left:-1000px;width:1px;height:1px">';
        jQuery(document.body).append(iframe);
    }

    module.functions.clearVariable();
    module.functions.ajax('get', null, function(res){
        var json = jQuery.parseJSON(res.responseText);
        module.views = json.views;
        if(json.language){
            module.message = json.language;
        }
    });

}
JMBProfile.prototype = {
    update:function(objects){
        var module = this;
        storage.usertree.update(objects);
        module.object = storage.usertree.pull[module.gedcom_id];
        module.user = module.functions.getParseUserInfo();
    },
    render:function(id){
        var module = this,
            fn = module.functions,
            sb = host.stringBuffer(),
            form;
        switch(id){
            case "view_profile":
                form = fn.getViewObject('dialogViewProfile');
                fn.setTitleMessage(form);
                fn.setTextValue(form);
                fn.setAvatar(form, 135, 150)
            break;

            case "view_photos":
                var media = module.object.media;
                if(media!=null){
                    form = jQuery(storage.media.render(media.photos));
                    storage.media.init(form);
                }
            break;

            case "edit_basic":
                form = fn.getViewObject('dialogEditBasic');
                fn.setTitleMessage(form);
                fn.setTextValue(form);
                fn.setLiving(form, module.user.is_alive);
                fn.setAvatar(form, 135, 150);
                fn.initEventSelectLiving(form);
                fn.initEventSelectGender(form, 135, 150);
                fn.ajaxForm({
                    target:jQuery(form).find('form'),
                    method:'basic',
                    args:module.gedcom_id,
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
                        module.functions.setMessage(view,[
                            ["option[value='MARR']",'text'],
                            ["div#button input",'val'],
                            ["span#unknown",'text'],
                            ["span#divorce",'text'],
                            ["input[type='submit']",'val'],
                            ["input[type='button']",'val']
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
                        var args = '{"gedcom_id":"'+module.user.gedcom_id+'","method":"add"}';
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
                        var args = '{"gedcom_id":"'+module.gedcom_id+'","family_id":"'+module.family_id+'","method":"save"}';
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
                        if(key != 'length' && families[key].spouse != null){
                            _fn.createFamilyBox(families[key]);
                        }
                    }
                }
            break;

            case "edit_photos":
                var media = module.object.media;
                form = fn.getViewObject('dialogEditPhotos');
                module.functions.setMessage(form, [
                    ["input[type='submit']",'val'],
                    ["input[name='set']",'val']
                ]);
                var _fn = {
                    add:function(res){
                        var li;
                        if(res!=null&&res.image){
                            if(jQuery(form).find('.jmb-dialog-photos-content').length==0){
                                jQuery(form).append(storage.media.render([res.image], true));
                                li = jQuery(form).find('.jmb-dialog-photos-content li')[0];
                            } else {
                                li = jQuery(storage.media.getListItem(res.image, true));
                                jQuery(form).find('.jmb-dialog-photos-content div.list ul').append(li);
                            }
                            this.delete(li);
                            this.select(li);
                            if(media==null){
                                storage.usertree.pull[module.gedcom_id].media = {
                                    avatar:null,
                                    photos:[]
                                }
                                media = storage.usertree.pull[module.gedcom_id].media;
                            };
                            media.photos.push(res.image);
                        }
                    },
                    delete:function(li){
                        jQuery(li).find('div#delete').click(function(){
                            var clikItem = this;
                            var id = jQuery(clickItem).attr('id');
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
                    select:function(li){
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
                                media.avatar = media.photos[module.user.getPhotoIndex(media_id)];
                                module.user.avatar_id = media_id;
                                jQuery(input).hide();
                            });
                            jQuery(input).hide();
                            console.log(module);
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
                    _fn.select(li);
                    _fn.delete(li);
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
                    success:function(res){
                        _fn.add(res);
                        jQuery(form).find('form').resetForm();
                    }
                });
            break;

            case "more_options":
                form = fn.getViewObject('dialogMoreOptions');
                fn.setTitleMessage(form);
                var span = jQuery(form).find('div.option span');
                var text = jQuery(span).text();
                jQuery(span).html(text.replace('%%', module.user.full_name));
                jQuery(form).find('div.title span').click(function(){
                    var mes, method = 'deleteBranch';
                    if(module.gedcom_id != storage.usertree.gedcom_id){
                        mes = module.message.FTT_MOD_PROFILE_EDITOR_DELETE_CONFIRM;
                    } else if(storage.usertree.getUsersLength() == 1){
                        mes = module.message.FTT_MOD_PROFILE_EDITOR_DELETE_TREE_CONFIRM;
                        method = 'deleteTree';
                    } else {
                        mes = module.message.FTT_MOD_PROFILE_EDITOR_DELETE_USER_CONFIRM;
                    }
                    if(confirm(mes)){
                        var type = jQuery(this).parent().attr('id');
                        var args = type+','+module.gedcom_id+','+method;
                        module.functions.ajax('delete', args, function(res){
                            var json = jQuery.parseJSON(res.responseText);
                            if(!json.deleted){
                                module.update(json.objects);
                            } else {
                                if(method == 'deletTree' || json.deleted.user){
                                    window.location.reload()
                                } else {
                                    storage.usertree.deleted(json.deleted.objects);
                                    storage.usertree.update(json.objects);
                                    jQuery(module.box).dialog('close');
                                }
                            }
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
    mode:function(type){
        var module = this,
            fn = module.functions,
            menu = fn.getViewObject('dialogMenu'+fn.getUcFirst(type));

        jQuery(module.box).parent().removeClass('edit');
        jQuery(module.box).parent().removeClass('view');
        jQuery(module.box).parent().addClass(type);

        jQuery(module.box).find('.jmb-dialog-profile-menu-container').html('').append(menu);

        var lis = jQuery(menu).find('li');
        jQuery(lis).each(function(i,el){
            var text = jQuery(el).text();
            jQuery(el).text(module.message[text]);
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
        jQuery(menu).find('li').first().click();
    },
    editor:function(type, args){
        var module = this,
            fn = module.functions,
            dialogBox = fn.getViewObject('dialogCont'),
            dialogButton = fn.getViewObject('dialogButton');

        var gedcom_id = args.object.user.gedcom_id;
        fn.setGedcomId(/*args.gedcom_id*/gedcom_id);

        if(!module.gedcom_id) return false;

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
            jQuery(box).parent().find('.ui-dialog-titlebar').append(dialogButton);
            fn.initHeader(dialogButton, type);
        });

        module.mode(type);
    },
    add:function(data){
        var module = this;
        var args = {};
        var gedcom_id = data.object.user.gedcom_id;
        module.functions.setGedcomId(/*args.gedcom_id*/gedcom_id);
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
}