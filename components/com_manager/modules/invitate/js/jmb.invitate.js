function JMBInvitateObject(obj){
    var module = this,
        user = storage.usertree.usermap,
        fn = {};

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

    module.borders = ['61c77f','a64751','5c63d3','d3c15c','705cd3'];
    module.spouse_border = {};
    module.childsPos = {};

    module.msg = {
        FTT_MOD_INVITATE_MESSAGE_YOU_LOGGED_INTO: "You are currently logged into Facebook as %%. This person is already registered in Family Tree Top.",
        FTT_MOD_INVITATE_MESSAGE_CLICK_TO_LOG_INTO_FACEBOOK: "Click <a id='logout' href='#'>here</a> to log into Facebook with a different account.",
        FTT_MOD_INVITATE_HELLO: "Hello",
        FTT_MOD_INVITATE_HAS_INVITED_YOU: "has invited you to join this family tree.",
        FTT_MOD_INVITATE_ACCEPT: "Accept Invitation",
        FTT_MOD_INVITATE_DENY: "Deny Invitation",
        FTT_MOD_ALERT_INVITATION_LINK_NO_LONGER_VALID: "This invitation link is no longer valid."
    }

    fn.getObjectFirst = function(obj){
        for (var key in obj){
            if(obj.hasOwnProperty(key)){
                return obj[key];
            }
        }
    }

    fn.getExistParent = function(obj){
        return obj.father || obj.mother;
    }


    fn.checkUser = function(c){
        module.ajax('checkUser', null, function(res){
            var json = storage.getJSON(res.responseText);
            module.setMsg(json.msg);
            c(json);
        });
    }

    fn.boxIfUserExist = function(json){
        var sb = storage.stringBuffer();
        sb._('<div class="exist">');
            sb._(module.getMsg('MESSAGE_YOU_LOGGED_INTO').replace('%%', user.name));
            sb._(module.getMsg('MESSAGE_CLICK_TO_LOG_INTO_FACEBOOK'));
        sb._('</div>');
        return sb.result();
    }

    fn.getObjectbyId = function(data, id){
        for(var key in data){
            if(data.hasOwnProperty(key)){
                if(data[key].user.gedcom_id == id){
                    return data[key];
                }
            }
        }
    }

    fn.getTarget = function(json){
        var start_id = json.data.to;
        var startObject =  fn.getObjectbyId(json.family, start_id);
        if(startObject.families != null){
            return startObject;
        } else {
            if(startObject.parents != null){
                var family = fn.getObjectFirst(startObject.parents);
                var existParent = fn.getExistParent(family);
                return fn.getObjectbyId(json.family, existParent.gedcom_id);
            } else {
                return startObject;
            }
        }
    }

    fn.getSender = function(json){
        var target_id = json.data.from;
        return fn.getObjectbyId(json.family, target_id);
    }

    fn.getRelation = function(json){
        return json.data.relation;
    }

    fn.getName = function(object){
        return [object.user.first_name, object.user.last_name].join(' ');
    }

    fn.getFirstName = function(object){
        return object.user.first_name;
    }

    fn.getFacebookName = function(){
        return storage.usertree.usermap.facebookFields.first_name;
    }

    fn.getFacebookProfileLink = function(object, text){
        var sb = storage.stringBuffer();
        sb._('<a href="http://facebook.com/')._(object.user.facebook_id)._('">');
            sb._(text);
        sb._('</a>');
        return sb.result();
    }

    fn.getSenderEmail = function(json){
        var data = json.data;
        if(data.sender_data.length != 0){
            var s_data = data.sender_data[0];
            return s_data.email;
        }
    }

    fn.boxInvitation = function(json){
        var sb = storage.stringBuffer();
        var target = fn.getTarget(json);
        var sender = fn.getSender(json);

        sb._('<div class="ftt-invitate-header">');
            sb._('<div class="ftt-invitate-header-body">');
                sb._('<div class="ftt-invitate-hello">Hello <span style="font-weight: bold;">')._(fn.getFirstName(target))._('</span>!</div>');
                sb._('<div class="ftt-invitate-message">');
                    sb._('Your ')._(fn.getRelation(json))._(', ')._(fn.getName(sender))._(', has invited you to join your family tree on <span style="font-weight: bold;">Family TreeTop</span>. This is a private space that can only be seen by members of your family.');
                sb._('</div>');
                sb._('<div class="ftt-invitate-buttons">');
                    sb._('<div class="ftt-invitate-button accept">Accept Invitation</div>');
                    sb._('<div class="ftt-invitate-button deny">No, thanks</div>');
                sb._('</div>');
            sb._('</div>');
        sb._('</div>');
        sb._('<div class="ftt-invitate-content"></div>');
        sb._('<div class="ftt-invitate-footer">');
            sb._('<div class="ftt-invitate-footer-body">Not sure? Click ');
                sb._(fn.getFacebookProfileLink(sender, 'here'));
                sb._(' to view the Facebook profile for ');
                sb._(fn.getFirstName(sender));
                sb._('. If you wish to contact ');
                sb._(fn.getFirstName(sender));
                sb._(', you may email him at ');
                sb._(fn.getSenderEmail(json));
                sb._('</div>');
        sb._('</div>');
        return sb.result();
    }

    fn.boxFamily = function(json, object){
        if(json.family&&json.family.length==0) return false;
        var cont = _create(),
            family = _sort(json.family),
            target = fn.getTarget(json),
            spouses = _getSpouses(target.families, target.user.default_family),
            childrens = _getChildrens(target.families),
            spouse = [],
            childs = [],
            startTop,
            rowLength,
            leftDel,
            index,
            startLeft,
            i;

        jQuery(cont[0]).css({top:"50px",left:"120px"}).attr('id', target.user.gedcom_id).append(_sircar(target));

        if(spouses.length != 0){
            module.spouse_border[spouses[0][0]] = module.borders[0];
            spouse[0] = _spouse(spouses[0], (spouses.length>1)?module.borders[0]:"000000");
            jQuery(cont[2]).attr('id', spouses[0][1]).css({top:"50px",left:"395px"}).append(spouse[0]);
            if(spouses.length > 1){
                jQuery(cont[3]).css({top:(spouses.length>=3)?"30px":"75px",left:"555px"});
                for(i = 1 ; i < spouses.length ; i ++){
                    module.spouse_border[spouses[i][0]] = module.borders[i];
                    spouse[i] = _former_spouse(spouses[i], module.borders[i]);
                    jQuery(cont[3]).append(spouse[i]);
                    jQuery(cont[3]).addClass('active');
                    setTimeout(function(){
                        jQuery(cont[3]).scrollbar();
                    }, 1);
                }
            } else {
                jQuery(cont[3]).removeClass('active');
            }
        } else {
            jQuery(cont[3]).removeClass('active');
        }

        startTop = _getStartTop(spouses.length);
        if(childrens.length!=0){
            rowLength = _getLength(childrens.length);
            leftDel = 100;
            index = 0;
            startLeft = 350 - 100*(rowLength/2);
            for(i = 0 ; i < childrens.length ; i++){
                if(index == rowLength){
                    startTop += 185;
                    index = 0;
                    if((childrens.length-i)<rowLength){
                        startLeft = 350 - 100*((childrens.length-i)/2);
                    }
                }
                var pos = {top:startTop, left:startLeft+(index*leftDel)};
                module.childsPos[childrens[i].gedcom_id] = pos;
                childs[i] = _child(childrens[i], spouses.length, pos);
                jQuery(object[1]).append(childs[i]);
                index++;
            }
        }

        jQuery(object[1]).height(startTop + 200);
        jQuery(object[1]).append(cont);
        jQuery(object[1]).find('div#'+json.data.to).find('div[type="imgContainer"]').animatedBorder({size : 6, color : '#FFCC66'});

        return true;
        function _getLength(len){
            var limit = 7;
            var rows = Math.ceil(len/limit);
            return Math.round(len/rows);
        }
        function _getStartTop(length){
            if(length>=3){
                return 450;
            }
            return 315;
        }
        function _getName(info){
            if(info.nick.length > 12){
                return info.nick.substr(0,6)+'...';
            } else {
                return info.nick;
            }
        }
        function _getDate(info){
            var b = info.birth('year');
            if(b){
                return b;
            } else {
                return '....';
            }
        }
        function _getAvatar(object, type, k){
            var size = _getImageSize_(type, k);
            return storage.usertree.avatar.get({
                object:object,
                cssClass:"jmb-families-avatar view",
                width:size.width,
                height:size.height
            });
            function _getImageSize_(){
                var	imageSize = module.imageSize,
                    size = imageSize[type],
                    width = Math.round(size.width*k),
                    height = Math.round(size.height*k);
                return {
                    width: width,
                    height: height
                };
            }
        }
        function _getSpouses(families, def){
            if(families==null) return [];
            var spouses = [], family, spouse;
            for(var key in families){
                if (!families.hasOwnProperty(key)) continue;
                if(key!='length'){
                    family = families[key];
                    if(family.spouse!=null){
                        spouse = [family.id, family.spouse];
                        spouses.push(spouse);
                    }
                }
            }
            return spouses.sort(function(){
                if(arguments[0][0] == def){
                    return false;
                } else {
                    return true;
                }
            });
        }
        function _getChildrens(families){
            var childrens = [], family, child;
            for(var key in families){
                if (!families.hasOwnProperty(key)) continue;
                if(key!='length'){
                    family = families[key];
                    if(family.childrens!=null){
                        for(var i = 0 ; i < family.childrens.length ; i ++){
                            child = family.childrens[i];
                            childrens.push(child);
                        }
                    }
                }
            }
            return childrens;
        }
        function _sort(family){
            if(family&&family.length == 0) return [];
            var ar = {};
            for(var k = 0 ; k <= family.length; k++){
                var o = family[k];
                if(o){
                    var id = o.user.gedcom_id;
                    ar[id] = o;
                }
            }
            return ar;
        }
        function _create(){
            var sb = storage.stringBuffer();
            sb._('<div class="ftt-invite-sircar">&nbsp;</div>');
            sb._('<div class="ftt-invite-event">&nbsp;</div>');
            sb._('<div class="ftt-invite-spouse">&nbsp;</div>');
            sb._('<div class="ftt-invite-spouse-container">&nbsp;</div>');
            return jQuery(sb.result());
        }
        function _sircar(object){
            var sb = storage.stringBuffer();
            var gedcomId = object.user.gedcom_id;
            var info = storage.usertree.parse(object);
            sb._('<div>');
                sb._('<div id="')._(gedcomId)._('-view" type="imgContainer" class="ftt-invite-parent-img">');
                    sb._(_getAvatar(object, 'parent', 1));
                sb._('</div>');
            sb._('</div>');
            sb._('<div>');
                sb._('<div class="ftt-invite-parent-name">')._(_getName(info))._('</div>');
                sb._('<div class="ftt-invite-parent-date">')._(_getDate(info))._('</div>');
            sb._('</div>');
            if(object.families!=null){
                sb._('<div class="ftt-invite-arrow-left">&nbsp</div>');
            }
            return jQuery(sb.result());
        }
        function _spouse(spouse, bcolor){
            var sb = storage.stringBuffer(),
                gedcomId = spouse[1],
                object = family[gedcomId],
                info = storage.usertree.parse(object);
            sb._('<div>');
                sb._('<div id="')._(gedcomId)._('-view" type="imgContainer" class="ftt-invite-parent-img" style="border:2px solid #')._(bcolor)._(';">');
                    sb._(_getAvatar(object, 'parent', 1));
                sb._('</div>');
            sb._('</div>');
            sb._('<div>');
                sb._('<div class="ftt-invite-parent-name">')._(_getName(info))._('</div>');
                sb._('<div class="ftt-invite-parent-date">')._(_getDate(info))._('</div>');
            sb._('</div>');
            if(object.families!=null){
                sb._('<div class="ftt-invite-arrow-right" style="background:#')._(bcolor)._(';">&nbsp</div>');
            }
            return jQuery(sb.result());
        }
        function _former_spouse(spouse, bcolor){
            var sb = storage.stringBuffer(),
                gedcomId = spouse[1],
                object = family[gedcomId],
                info = storage.usertree.parse(object);

            sb._('<div id="')._(gedcomId)._('" class="ftt-invite-spouse-div">');
                sb._('<div id="')._(gedcomId)._('-view" type="imgContainer" class="ftt-invite-parent-img" style="border:2px solid #')._(bcolor)._(';">');
                    sb._(_getAvatar(object, 'parent', 1));
                sb._('</div>');
            sb._('</div>');
            sb._('<div>');
                sb._('<div class="ftt-invite-parent-name">')._(_getName(info))._('</div>');
                sb._('<div class="ftt-invite-parent-date">')._(_getDate(info))._('</div>');
            sb._('</div>');
        }
        function _child(child, len, position){
            var sb = storage.stringBuffer(),
                gedcomId = child.gedcom_id,
                object = family[gedcomId],
                bcolor = (len>1)?module.spouse_border[child.family_id]:"000000",
                info = storage.usertree.parse(object);

            sb._('<div id="');
                sb._(gedcomId);
                sb._('" class="ftt-invite-child" style="height:170px;top:');
                    sb._(position.top);
                sb._('px;left:');
                    sb._(position.left);
            sb._('px;">');
                sb._('<div id="')._(gedcomId)._('-view" type="imgContainer" style="height:80px;width:72px;border:2px solid #');
                    sb._(bcolor);
                    sb._('" class="ftt-invite-child-img">');
                    sb._(_getAvatar(object, 'child', 1));
                sb._('</div>');
                sb._('<div>');
                    sb._('<div class="ftt-invite-child-name">')._(_getName(info))._('</div>');
                    sb._('<div class="ftt-invite-child-date">')._(_getDate(info))._('</div>');
                sb._('</div>');
                sb._('<div class="ftt-invite-arrow-up" style="background:#')._(bcolor)._(';">&nbsp</div>');
            sb._('</div>');
            return jQuery(sb.result());
        }
    }

    fn.handlerButtonClick = function(object){
        jQuery(object).find('.ftt-invitate-button.accept').click(function(){
            module.ajax('accept', null, function(acceptResponse){
                var parseAcceptResponse = storage.getJSON(acceptResponse.responseText);
                if(parseAcceptResponse){
                    window.location = storage.baseurl+'index.php/myfamily';
                }
            });
        });
        jQuery(object).find('.ftt-invitate-button.deny').click(function(){
            module.ajax('deny', null, function(denyResponse){
                var denyResponse = storage.getJSON(denyResponse.responseText);
                if(denyResponse){
                    window.location = storage.baseurl+'index.php/first-page';
                }
            });
        })
    }

    fn.unset = function(){
        var bottom = jQuery('div.footer');
        var div = jQuery('<div class="ftt-invite-footer"></div>');
        jQuery(bottom).parent().append(div);
        jQuery(div).append(bottom);
        storage.core.modulesPullObject.unset('JMBInvitateObject');
    }

    fn.checkUser(function(json){
        var cont, object;
        fn.unset();
        if(json.success){
             cont = fn.boxIfUserExist(json);
             jQuery(obj).append(cont);
             return;
        } else {
            if(!json.sender){
                storage.alert(module.getMsg('ALERT_INVITATION_LINK_NO_LONGER_VALID'));
                window.location.href = storage.baseurl + 'index.php/first-page';
                return false;
            } else {
                cont = fn.boxInvitation(json);
            }
        }
        object = jQuery(cont);
        jQuery('.content').css('width', '100%').css('margin-top', '30px').css('max-width', 'none');
        jQuery('div.right').hide();
        jQuery(obj).append(object);
        fn.boxFamily(json, object);
        fn.handlerButtonClick(object)
    });
}

JMBInvitateObject.prototype = {
	ajax:function(func, params, callback){
        storage.callMethod("invitate", "JMBInvitateClass", func, params, function(res){
				callback(res);
		})
	},
    getMsg:function(n){
        var module = this;
        var t = 'FTT_MOD_INVITATE_'+n.toUpperCase();
        if(typeof(module.msg[t]) != 'undefined'){
            return module.msg[t];
        }
        return '';
    },
    setMsg:function(msg){
        var module = this;
        for(var key in module.msg){
            if(typeof(msg[key]) != 'undefined'){
                module.msg[key] = msg[key];
            }
        }
        return true;
    }
}

