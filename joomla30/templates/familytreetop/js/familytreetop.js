(function(w, undefined){
    'use strict';

    var $FamilyTreeTop = function(){
        this.app = {
           config:{
                appId:false,
                channelUrl: false,
                frictionlessRequests : true,
                status: true,
                cookie: true,
                oauth: true
            },
            data:false,
            permissions:false
        }

        this.template = "";

        this.currenturl = "";
        this.rooturl = "";
        this.baseurl = "";
        this.templateurl = "";

        this.users = false;

        this.bindPull = [];

        this.moduleLinkPull = {};
        this.modulePull = [];

        this.dataString = "";
        this.userString = "";
        this.facebookString = "";
        this.facebookAccessToken = "";

        this.languagesString = "";


    }

    $FamilyTreeTop.prototype.fn = {
        ajax:function(task, args,callback){
            jQuery.ajax({
                url:"index.php?option=com_familytreetop&task="+task,
                data:args,
                type: "POST",
                dataType:"json"
            }).done(callback);
        },
        accessToken: function(){
            return this.facebookAccessToken;
        },
        mod: function(name){
            return w.$FamilyTreeTop.mod(name);
        },
        app:function(){
            var ftt = w.$FamilyTreeTop;
            return {
                link: function(){
                    return ftt.app.data.link
                },
                description: function(){
                    return ftt.app.data.description;
                }
            }
        },
        url: function(path){
            var ftt = w.$FamilyTreeTop;
            if("undefined" === typeof(path)){
                path = "";
            }
            return {
                app: function(){
                    return $FamilyTreeTop.prototype.fn.app().link() ;
                },
                base: function(e){
                    if("undefined" !== typeof(e)){
                        return ftt.baseurl + path;
                    }
                    return ftt.rooturl + path;
                },
                template: function(e){
                    if("undefined" !== typeof(e)){
                        return ftt.templateurl + path;
                    }
                    return ftt.rooturl + '/templates/' + ftt.template + path;
                }
            }
        },
        stringBuffer: function(){
            return (function(){
                var b = "";
                this.length = 0;
                return  {
                    _: function (s) {
                        if (arguments.length > 1) {
                            var tmp = "", l = arguments.length;
                            switch (l) {
                                case 9:
                                    tmp = "" + arguments[8] + tmp;
                                case 8:
                                    tmp = "" + arguments[7] + tmp;
                                case 7:
                                    tmp = "" + arguments[6] + tmp;
                                case 6:
                                    tmp = "" + arguments[5] + tmp;
                                case 5:
                                    tmp = "" + arguments[4] + tmp;
                                case 4:
                                    tmp = "" + arguments[3] + tmp;
                                case 3:
                                    tmp = "" + arguments[2] + tmp;
                                case 2:
                                {
                                    b += "" + arguments[0] + arguments[1] + tmp;
                                    break;
                                }
                                default:
                                {
                                    var i = 0;
                                    while (i < arguments.length) {
                                        tmp += arguments[i++];
                                    }
                                    b += tmp;
                                }
                            }
                        } else {
                            b += s;
                        }
                        this.length = b.length;
                        return this;
                    },
                    del: function () {
                        b = "";
                        this.length = 0;
                        return this;
                    },
                    ret: function () {
                        return b;
                    }
                }
            }).call(this);
        },
        alert:function(args, type){
            var date = (new Date()).toString();
            if("undefined" === typeof(args) || "object" !== typeof(args)){
                args = { title: "", content: date }
            }
            if("undefined" === typeof(args.title)){
                args.title = "";
            }
            if("undefined" === typeof(args.content)){
                args.content = date
            }

            if("undefined" === typeof(type)){
                type = "error"
            }
            var alertObject = $("#" + type).clone();
            $(alertObject).find('h4').text(args.title);
            $(alertObject).find('p').text(args.content);

            $('#system-message').append(alertObject);
            $(alertObject).alert();
            setTimeout(function(){
                $(alertObject).alert('close');
            }, 3000);
            return alertObject;
        },
        error:function(args){
            this.alert(args, "error");
        },
        success:function(args){
            this.alert(args, "success");
        },
        warning:function(args){
            this.alert(args, "warning");
        },
        generateKey:function(){
            var s4 = function(){return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);}
            return s4()+s4()+s4()+s4()+s4()+s4()+s4()+s4();
        },
        encode64: function(input) {
            input = escape(input);
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },
        decode64:function(input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return unescape(output);
        },
        trim: function(){return this.replace(/^\s+|\s+$/g, '');},
        isExist:function(array, name, value){
            var items = name.split('.'), prop, object, key, element;
            for(prop in array){
                if(!array.hasOwnProperty(prop)) continue;
                object = array[prop];
                for(key in items){
                    if(!items.hasOwnProperty(key)) continue;
                    element = items[key];
                    if("$" !== element && "undefined" !== typeof(object[element])){
                        object = object[element];
                    }
                }
                if(object == value){
                    return true;
                }
            }
            return false;
        }
    }

    $FamilyTreeTop.prototype.init = function(){
        var $this = this;

        $FamilyTreeTop.prototype.clearUploadTemplates();

        $this.app.data = jQuery.parseJSON($this.app.data);

        //init modules;
        $this.modulePull.forEach(function(el, id){
            var F = el.constructor;
            F.prototype = $FamilyTreeTop.prototype.fn;
            $this.modulePull[id].object = new F(jQuery);
        });
        //init scripts
        $this.bindPull.forEach(function(el){
            var F = function(){};
            F.prototype = $FamilyTreeTop.prototype.fn;
            el.call(new F(), jQuery);
        });

        //init
        $this.mod('tabs').init();
    }

    $FamilyTreeTop.prototype.clearUploadTemplates = function(){
        var download = jQuery('#template-download').text();
        var upload = jQuery('#template-upload').text();

        jQuery('#template-download').text(download.replace(/#/gi,""));
        jQuery('#template-upload').text(upload.replace(/#/gi,""));
    }

    $FamilyTreeTop.prototype.mod = function(name){
        var id;
        if("undefined" !== typeof(this.moduleLinkPull[name])){
            id = this.moduleLinkPull[name];
            return this.modulePull[id].object;
        }
        return false;
    }

    $FamilyTreeTop.prototype.create = function(name, mod){
        this.modulePull.push({constructor:mod, object: null});
        this.moduleLinkPull[name] = this.modulePull.length - 1;
    }

    $FamilyTreeTop.prototype.bind = function(call){
        this.bindPull.push(call);
    }

    w.$FamilyTreeTop = new $FamilyTreeTop();
})(window)