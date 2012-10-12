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

    module.borders = module._generateBorders(100);
    module.border_iter = 0;
    module.spouse_border = {};
    module.childsPos = {};

    module.msg = {
        FTT_MOD_INVITATE_MESSAGE_YOU_LOGGED_INTO: "You are currently logged into Facebook as %%. This person is already registered in Family Tree Top.",
        FTT_MOD_INVITATE_MESSAGE_CLICK_TO_LOG_INTO_FACEBOOK: "Click <a id='logout' href='#'>here</a> to log into Facebook with a different account.",
        FTT_MOD_INVITATE_HELLO: "Hello",
        FTT_MOD_INVITATE_HAS_INVITED_YOU: "has invited you to join your family tree on <span style='font-weight: bold;'>Family TreeTop</span>. This is a private space that can only be seen by members of your family.",
        FTT_MOD_INVITATE_ACCEPT: "Accept Invitation",
        FTT_MOD_INVITATE_DENY: "No, thanks",
        FTT_MOD_INVITATE_ALERT_INVITATION_LINK_NO_LONGER_VALID: "This invitation link is no longer valid.",
        FTT_MOD_INVITATE_YOUR : "Your",
        FTT_MOD_INVITATE_NOT_SURE : "Not Sure",
        FTT_MOD_INVITATE_CLICK : "Click",
        FTT_MOD_INVITATE_HERE : "here",
        FTT_MOD_INVITATE_TO_VIEW_FACEBOOK_PROFILE_FOR : "to view the Facebook profile for",
        FTT_MOD_INVITATE_IF_YOU_WISH_TO_CONTACT : "If you wish to contact",
        FTT_MOD_INVITATE_YOU_MAY_EMAIL_HIM_AT : "you may email him at"
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
            sb._('<div>')._(module.getMsg('MESSAGE_YOU_LOGGED_INTO').replace('%%', user.name))._('</div>');
            sb._('<div>')._(module.getMsg('MESSAGE_CLICK_TO_LOG_INTO_FACEBOOK'))._('</div>');
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
        return fn.getObjectbyId(json.family, json.data.target.Id);
    }

    fn.getSender = function(json){
        return json.data.sender;
    }

    fn.getRelation = function(json){
        var relation = json.data.relation;
        var relation = "6th cousin";
        var arg = relation.split(" ");
        var regExp = /(\W|^)(self|spouse|father|mother|daughter|son|brother|sister|cousin|uncle|aunt|nephew|niece|grandmother|grandfather|granddaughter|grandson|great\sgrandfather|great\sgrandmother)(\W|$)/;
        if(arg.length == 1){
            return relation;
        }
        return regExp.exec(relation)[0];
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

    fn.getSenderName = function(sender){
        return [sender.FirstName, sender.LastName].join(' ');
    }

    fn.getSenderFacebookLink = function(object, text){
        var sb = storage.stringBuffer();
        sb._('<a href="http://facebook.com/')._(object.FacebookId)._('" target="_blank">');
        sb._(text);
        sb._('</a>');
        return sb.result();
    }

    fn.getFirstSenderName = function(sender){
        return sender.FirstName;
    }

    fn.boxInvitation = function(json){
        var sb = storage.stringBuffer();
        var target = fn.getTarget(json);
        var sender = fn.getSender(json);

        sb._('<div class="ftt-invitate-header">');
            sb._('<div class="ftt-invitate-header-body">');
                sb._('<div class="ftt-invitate-hello">')._(module.getMsg('hello'))._(' <span style="font-weight: bold;">')._(fn.getFacebookName(target))._('</span>!</div>');
                sb._('<div class="ftt-invitate-message">');
                    sb._(module.getMsg('YOUR'))._(' ')._(fn.getRelation(json))._(', <span id="facebook" style="color:blue;cursor:pointer">')._(fn.getSenderFacebookLink(sender, fn.getSenderName(sender)))._('</span>, ')._(module.getMsg('HAS_INVITED_YOU'));
                sb._('</div>');
                sb._('<div class="ftt-invitate-buttons">');
                    sb._('<div class="ftt-invitate-button accept">')._(module.getMsg('accept'))._('</div>');
                    sb._('<div class="ftt-invitate-button deny">')._(module.getMsg('deny'))._('</div>');
                sb._('</div>');
            sb._('</div>');
        sb._('</div>');
        sb._('<div class="ftt-invitate-content"></div>');
        sb._('<div class="ftt-invitate-footer">');
        sb._('<div class="ftt-invitate-footer-body">')._(module.getMsg('not_sure'))._('? ')._(module.getMsg('click'))._(' ');
                sb._(fn.getSenderFacebookLink(sender, module.getMsg('here')));
                sb._(' ')._(module.getMsg('to_view_facebook_profile_for'))._(' ');
                sb._(fn.getFirstSenderName(sender));
                sb._('. ')._(module.getMsg('if_you_wish_to_contact'))._(' ');
                sb._(fn.getFirstSenderName(sender));
                sb._(', ')._(module.getMsg('you_may_email_him_at'))._(' ');
                sb._(fn.getSenderEmail(json));
                sb._('</div>');
        sb._('</div>');
        return sb.result();
    }

    fn.setGlobalData = function(json){
        if(json.data && json.data.target && json.data.target.TreeId){
            storage.usertree.tree_id = json.data.target.TreeId;
        }
    }

    fn.boxFamily = function(json, object){
        if(json.family&&json.family.length==0) return false;
        var cont = _create(),
            family = _sort(json.family),
            target = fn.getTarget(json),
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
            jQuery(cont[0]).css({top:"21px",left:"155px"}).attr('id', target.user.gedcom_id).append(sircar);
        }

        if(spouses.length != 0){
            info = _info(target, spouses[0]);
            jQuery(cont[1]).css({top:"113px", left:"312px"}).append(info);

            spouse = _spouse(spouses[0], _getBorderColor(spouses.length>1?spouses[0]:false));
            if(spouse){
                jQuery(cont[2]).attr('id', spouses[0][1]).css({top:"21px",left:"430px"}).append(spouse);
            }
        }

        if(spouses.length != 0){
            _setFormerBySircar(cont, spouses);
            //_setFormerBySpouse(cont, spouses[0]);
        }

        startTop = _getStartTop(spouses.length) + 50;
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
        function _getBorderColor(sp){
            return (function(sp){
                if(!sp) return "#000000";
                var _color = module.borders[module.border_iter];
                module.border_iter++;
                module.spouse_border[sp[0]] = _color;
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
                    var	_imageSize = module.imageSize,
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
            return (function(target){
                if(!target) return [];
                var _families = target.families, _spouses = [], _k, _f, _sp, _def;
                if(_families==null) return [];
                for(_k in _families){
                    if(!_families.hasOwnProperty(_k)) continue;
                    if('length' !== _k){
                        _f = _families[_k];
                        if(null != _f.spouse){
                            _sp = [_f.id, _f.spouse];
                            _spouses.push(_sp);
                        }
                    }
                }
                _def = target.user.default_family;
                return _spouses.sort(function(){
                    if(arguments[0][1] == _def){
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
        function _getTopFormerSpouseBox(s){
            return (function(s){
                var l = s.length;
                switch(l){
                    case 2:
                        return '69px';
                        break;

                    default:
                        return '0';
                        break;
                }
            })(s);
        }
        function _sort(family){
            return (function(family){
                if(family&&family.length == 0) return [];
                var _ar = {};
                for(var _k = 0 ; _k <= family.length; _k++){
                    var _o = family[_k];
                    if(_o){
                        var _id = _o.user.gedcom_id;
                        _ar[_id] = _o;
                    }
                }
                return _ar;
            })(family);
        }
        function _setFormer(cont, spouses, position){
            return (function(cont, spouses, position){
                var _i, _sp;
                if(spouses.length != 0){
                    if(spouses.length > 1){
                        for( _i = 1 ; _i < spouses.length ; _i++ ){
                            _sp =  _former_spouse(spouses[_i], _getBorderColor(spouses[_i]), position);
                            if(_sp){
                                jQuery(cont).append(_sp);
                            }
                        }
                        jQuery(cont).addClass('active');
                        if(spouses.length > 3){
                            jQuery(cont).addClass('scroll');
                        }
                    } else {
                        jQuery(cont).removeClass('active');
                    }
                } else {
                    jQuery(cont).removeClass('active');
                }
            })(cont, spouses, position);
        }
        function _setFormerBySircar(cont, spouses){
            return (function(cont, spouses){
                _setFormer(cont[4], spouses, 'right');
                jQuery(cont[4]).css({top:_getTopFormerSpouseBox(spouses),left:"10px"});
            })(cont, spouses);
        }
        function _setFormerBySpouse(cont, sp){
            return (function(cont, sp){
                var _object = family[sp[1]],
                    _spouses = _getSpouses(_object, sp[0]);
                if(_spouses.length != 0){
                    _setFormer(cont[3], _spouses, 'left');
                    jQuery(cont[3]).css({top:_getTopFormerSpouseBox(_spouses),left:"600px"});
                }
            })(cont, sp);
        }
        function _create(){
            return (function(){
                var _sb = storage.stringBuffer();
                _sb._('<div class="ftt-invite-sircar">&nbsp;</div>');
                _sb._('<div class="ftt-invite-event">&nbsp;</div>');
                _sb._('<div class="ftt-invite-spouse">&nbsp;</div>');
                _sb._('<div class="ftt-invite-former-spouse-container">&nbsp;</div>');
                _sb._('<div class="ftt-invite-former-sircar-container">&nbsp;</div>');
                return jQuery(_sb.result());
            })();
        }
        function _sircar(object){
            return (function(object){
                var _sb = storage.stringBuffer();
                var _gedcomId = object.user.gedcom_id;
                var _info = storage.usertree.parse(object);
                _sb._('<div>');
                    _sb._('<div id="')._(_gedcomId)._('-view" type="imgContainer" class="ftt-invite-parent-img">');
                        _sb._(_getAvatar(object, 'parent', 1));
                    _sb._('</div>');
                _sb._('</div>');
                _sb._('<div>');
                    _sb._('<div class="ftt-invite-parent-name">')._(_getName(_info))._('</div>');
                    _sb._('<div class="ftt-invite-parent-date">')._(_getDate(_info))._('</div>');
                _sb._('</div>');
                if(object.families!=null){
                    _sb._('<div class="ftt-invite-arrow-left">&nbsp</div>');
                }
                return jQuery(_sb.result());
            })(object);
        }
        function _info(object, spouse){
            return (function(object, spouse){
                if(!spouse) return '';
                var _sb = host.stringBuffer(),
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
                    return jQuery(_sb.result());
                }
                return '';
            })(object, spouse);
        }
        function _spouse(spouse, bcolor){
            return (function(spouse, bcolor){
                var _sb = storage.stringBuffer(),
                    _gedcomId = spouse[1],
                    _object = family[_gedcomId],
                    _info = storage.usertree.parse(_object);
                _sb._('<div>');
                    _sb._('<div id="')._(_gedcomId)._('-view" type="imgContainer" class="ftt-invite-parent-img" style="border:2px solid #')._(bcolor)._(';">');
                        _sb._(_getAvatar(_object, 'parent', 1));
                    _sb._('</div>');
                _sb._('</div>');
                _sb._('<div>');
                    _sb._('<div class="ftt-invite-parent-name">')._(_getName(_info))._('</div>');
                    _sb._('<div class="ftt-invite-parent-date">')._(_getDate(_info))._('</div>');
                _sb._('</div>');
                if(_object.families!=null){
                    _sb._('<div class="ftt-invite-arrow-right" style="background:#')._(bcolor)._(';">&nbsp</div>');
                }
                return jQuery(_sb.result());
            })(spouse, bcolor);
        }
        function _former_spouse(spouse, bcolor, position){
            return (function(spouse, bcolor, position){
                var _sb = storage.stringBuffer(),
                    _gedcomId = spouse[1],
                    _object = family[_gedcomId],
                    _info = storage.usertree.parse(_object);
                _sb._('<div id="')._(_gedcomId)._('" class="ftt-invite-spouse-div ')._(position)._('">');
                    _sb._('<div id="')._(_gedcomId)._('-view" type="imgContainer" class="ftt-invite-former-img" style="border:2px solid #')._(bcolor)._(';">');
                        _sb._(_getAvatar(_object, 'parent', 0.5));
                    _sb._('</div>');
                    _sb._('<div>');
                        _sb._('<div class="ftt-invite-parent-name former">')._(_getName(_info))._('</div>');
                        _sb._('<div class="ftt-invite-parent-date former">')._(_getDate(_info))._('</div>');
                    _sb._('</div>');
                        _sb._('<div class="ftt-invite-former-arrow-')._(position)._('" style="background:')._(bcolor)._(';">&nbsp</div>');
                        _sb._('<div class="ftt-invite-former-arrow-')._(position)._(' text" style="color:')._(bcolor)._(';">')._(_info.marr(spouse[0], 'date', 2))._('</div>');
                    _sb._('</div>');
                _sb._('</div>');
                return jQuery(_sb.result());
            })(spouse, bcolor, position);
        }
        function _child(child, len, position){
            return (function(child, len, position){
                var _sb = storage.stringBuffer(),
                    _gedcomId = child.gedcom_id,
                    _object = family[_gedcomId],
                    _bcolor = (len>1)?module.spouse_border[child.family_id]:"000000",
                    _info = storage.usertree.parse(_object);

                _sb._('<div id="');
                    _sb._(_gedcomId);
                    _sb._('" class="ftt-invite-child" style="height:170px;top:');
                    _sb._(position.top);
                    _sb._('px;left:');
                    _sb._(position.left);
                _sb._('px;">');
                _sb._('<div id="')._(_gedcomId)._('-view" type="imgContainer" style="height:80px;width:72px;border:2px solid #');
                    _sb._(_bcolor);
                    _sb._('" class="ftt-invite-child-img">');
                    _sb._(_getAvatar(_object, 'child', 1));
                _sb._('</div>');
                _sb._('<div>');
                    _sb._('<div class="ftt-invite-child-name">')._(_getName(_info))._('</div>');
                    _sb._('<div class="ftt-invite-child-date">')._(_getDate(_info))._('</div>');
                _sb._('</div>');
                _sb._('<div class="ftt-invite-arrow-up" style="background:#')._(_bcolor)._(';">&nbsp</div>');
                _sb._('</div>');
                return jQuery(_sb.result());
            })(child, len, position);
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
        });
        jQuery(object).find('a#logout').click(function(){
            module.relogin();
            return false;
        });
    }

    fn.setFooterPosition = function(obj){
        var $box = jQuery(obj).find('div.exist');
        var height = jQuery(window).height();
        var size = (height / 2 - 150)  + 'px';
        jQuery($box).css('margin-top', size).css('margin-bottom', size);
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
             fn.handlerButtonClick(obj);
             fn.setFooterPosition(obj);
            jQuery(window).resize(function(){
                fn.setFooterPosition(obj);
            });
             return;
        } else {
            if(!json.sender){
                storage.alert(module.getMsg('ALERT_INVITATION_LINK_NO_LONGER_VALID'), function(){
                    window.location.href = storage.baseurl + 'index.php/first-page';
                });
                return false;
            } else {
                if(json.data.language != storage.usertree.user.language){
                    storage.login.menu.viewLanguage({def:json.data.language}, function(langauge){
                        module.ajax('setInvitationLanguage', [langauge, storage.usertree.user.token].join(','), function(){})
                    });
                }
                cont = fn.boxInvitation(json);
            }
        }
        object = jQuery(cont);
        jQuery('.content').css('width', '100%').css('margin-top', '30px').css('max-width', 'none');
        jQuery('div.right').hide();
        jQuery(obj).append(object);
        fn.setGlobalData(json);
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
    _generateBorders:function(n){
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
    },
    login:function(token){
        FB.login(function (response) {
            if (response.status === 'connected') {
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        jQuery.ajax({
                            url: jfbcBase + 'index.php?option=com_jfbconnect&task=loginFacebookUser&return=' + jfbcReturnUrl,
                            type: "POST",
                            global: false,
                            dataType: "json",
                            complete : function (req, err) {
                                if(token.length > 1){
                                    window.location = storage.baseurl + 'index.php/invitation?token='+token;
                                } else {
                                    window.location.reload();
                                }
                            }
                        });
                    }
                });
            }
        }, {
            scope:jfbcRequiredPermissions
        });


        // jfbc.login.login_custom();
    },
    logout:function(){
        var module = this;
        module.ajax('logout', null,function(res){
            var token = res.responseText;
            module.login(token);
        });
    },
    relogin:function(){
        var module = this;
        if (jfbcLogoutFacebook) {
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    FB.logout(function (response) {
                        module.logout();
                    });
                }
                else {
                    module.logout();
                }
            });
        }
        else {
            module.logout();
        }
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

