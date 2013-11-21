$FamilyTreeTop.create("myfamily", function($){
    'use strict';
    var $this = this, $box, $gedcom, $facebook, $fn;

    $box = $("#myFamilyOnFacebook");

    $fn = {
        getRelation: function(object){
            if(object.familytreetop.gedcom_id){
                return $this.mod('usertree').user(object.familytreetop.gedcom_id).relation;
            } else if("undefined" !== typeof(object.familytreetop.relationship)){
                return object.familytreetop.relationship;
            }
            return "";
        },
        getName: function(object){
            return object.facebook.from.name;
        },
        getMessage: function(object){
            var f = object.facebook;
            var message = f.message || f.description || f.story || f.name || _getMessageFromLink_(f);

            return message;
            function _getMessageFromLink_(f){
                if(f.type == "link"){
                    return "Link posted";
                }
                return "";
            }
        },
        getLink: function(object){
            return object.facebook.link || _getCommentLink_();
            function _getCommentLink_(){
                if("undefined" !== typeof(object.facebook.actions)){
                    return object.facebook.actions[0].link;
                }
                return false;
            }
        },
        getFacebookSign: function(object){
            var link = $fn.getLink(object);
            var div = '<div familytreetop="facebook-sign" style="position:absolute; top: 0; right: 0; cursor: pointer;">';
            if(link){
                div += '<a style="text-decoration: none;" target="_blank" href="'+link+'"><i class="icon-facebook-sign icon-2x familytreetop-icon-muted"></i></a>';
            }
            div += '</div>';
            return div;
        },
        getPicture: function(object){
            if("undefined" === typeof(object.facebook.picture)) {
                return "";
            } else {
                return '<a target="_blank" href="'+$fn.getLink(object)+'"><img align="left" vspace="5" hspace="5" class="img-polaroid" src="'+object.facebook.picture+'" /></a>';
            }
        },
        getTime: function(object){
            return $fn.timeAgo(object.facebook.updated_time);
        },
        getGedcomId: function(object){
            if(object.familytreetop.gedcom_id){
                return object.familytreetop.gedcom_id;
            }
            return 0;
        },
        setImageSize:function(img, parentWidth){
            if("undefined" !== typeof(img.naturalWidth)){
                var width = img.naturalWidth;
                var halfWidth = Math.floor(parentWidth/2);
                var isBigImg = (width>halfWidth);
                $(img).css('width', ((isBigImg)?"90%":width+"px"));
                $(img).parent().parent().css('width', ((isBigImg)?"40%":(width+20)+"px"));
            }
        },
        setWidnowResize:function(){
            var parentWidth = $($box).width() - 70;
            var table = $($box).find('table');
            $(window).resize(function(){
                console.log(parentWidth);
            });
        },
        timeAgo: function(date_str){
            if (!date_str) {return;}
            date_str = $.trim(date_str);
            date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
            date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
            date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
            date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
            var parsed_date = new Date(date_str);
            var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
            var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
            delta=(delta<2)?2:delta;
            var r = '';
            if (delta < 60) {
                r = delta + ' seconds ago';
            } else if(delta < 120) {
                r = 'a minute ago';
            } else if(delta < (45*60)) {
                r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
            } else if(delta < (2*60*60)) {
                r = 'an hour ago';
            } else if(delta < (24*60*60)) {
                r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
            } else if(delta < (48*60*60)) {
                r = 'a day ago';
            } else {
                r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
            }
            return 'about ' + r;
        },
        createImage: function(object){
            return $('<img class="img-rounded" src="https://graph.facebook.com/'+object.facebook.from.id+'/picture"/>');
        },
        createBody: function(object){
            var parentDiv = $('<div class="row-fluid"><div class="span12" style="position:relative;"></div></div>');
            $(parentDiv).find('.span12').append($fn.getFacebookSign(object));
            $(parentDiv).find('.span12').append('<div style="color:#4c5797; font-size:12px; font-weight: bold;"><span style="cursor: pointer;" gedcom_id="'+$fn.getGedcomId(object)+'" familytreetop="profile">'+$fn.getName(object)+'</span></div>');
            $(parentDiv).find('.span12').append('<div style="color: #797979;font-size: 12px;">'+$fn.getRelation(object)+'</div>');
            $(parentDiv).find('.span12').append('<div><table><tr><td familytreetop-image style="border:none;">'+$fn.getPicture(object)+'</td><td style="border:none;vertical-align: top;">'+$fn.getMessage(object)+'</td></tr></table></div>');
            $(parentDiv).find('.span12').append('<div class="pull-right familytreetop-myfamily-buttons"><small>'+$fn.getTime(object)+'</small></div>');
            return parentDiv;
        },
        createTd: function(style){
            var td = $('<td></td>');
            if("undefined" !== typeof(style)){
                $(td).attr('style', style);
            }
            return td;
        },
        createTr: function(object){
            var tr = $('<tr></tr>');
            if(object.familytreetop.gedcom_id){
                $(tr).attr('gedcom_id', object.familytreetop.gedcom_id);
            }
            $(tr).append($($fn.createTd("width:50px")).append($fn.createImage(object)));
            $(tr).append($($fn.createTd()).append($fn.createBody(object)));
            return tr;
        },
        initPopovers: function(){
            $($box).find('[familytreetop="profile"]').each(function(index, element){
                if($(element).attr('gedcom_id') != 0){
                    $this.mod('popovers').render({
                        target: element
                    });
                }
            });
        }
    }

    $this.render = function(json){
        var table = $($box).find('table');
        var parentWidth = $($box).width() - 70;
        $(json).each(function(index, element){
            var tr = $fn.createTr(element);
            $(tr).find('[familytreetop-image] img').load(function(e){
                $fn.setImageSize(e.target, parentWidth);
            });
            if($(tr).attr('gedcom_id') != 0 ){
                $this.mod('familyline').bind(tr, $(tr).attr('gedcom_id'));
            }
            $(tr).find('[familytreetop="facebook-sign"]').hover(function(){
                $(this).find('i').removeClass('familytreetop-icon-muted');
            }, function(){
                $(this).find('i').addClass('familytreetop-icon-muted');
            });
            $(table).append(tr);
        });
        //$fn.setWidnowResize();
        $fn.initPopovers();
    }
});