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
        FTT_MOD_PROFILE_EDITOR_FORM_SHOW_CURRENT_PARTNER:"Show as current or latest partner",
        FTT_MOD_PROFILE_EDITOR_FORM_ADD_ANOTHER_UNION:"Add another union",
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
        setEvents:function(events){
            if(typeof(events)!='undefined'){
                module.events = events;
            }
        },
        setActiveDialogButton:function(buttons, mode){
            jQuery(buttons).find('div[value="'+mode+'"]').addClass('active');
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
                    storage.usertree.parse(stObject);
                } else {
                    return false;
                }
            } else {
                return storage.usertree.parse(module.object);
            }
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
            module.events = false;
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
    });

}
JMBProfile.prototype = {
    render:function(id){
        //console.log(id);
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

        fn.setEvents(args.evets);
        fn.setObject(gedcom_id);

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
    }
}