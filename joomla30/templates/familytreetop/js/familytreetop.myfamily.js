$FamilyTreeTop.create("myfamily", function($){
    'use strict';
    var $this = this, $box, $gedcom, $facebook, $fn;

    $box = $("#myFamilyOnFacebook");

    $fn = {
        getRelation: function(object){
            var facebook_id = object.actor_id;
            var obj = $gedcom[facebook_id];
            if("undefined" !== typeof(obj)){
                var relation = "undefined"!==typeof(obj.gedcom_id)?$this.mod('usertree').user(obj.gedcom_id).relation:obj.relationship;
                return '<i class="icon-leaf"></i>'+relation;
            }
            return "";
        },
        getName: function(object){
            return $facebook[object.actor_id].name;
        },
        getMessage: function(object){
            var str = object.message || object.description || "";
            if(str.length == 0){
                switch(object.type){
                    case 11: str = '- Group created';
                    case 12: str = '- Event created';
                    case 46: str = '- Status update';
                    case 56: str = '- Post on wall from another user';
                    case 66: str = '- Note created';
                    case 80: str = '- Link posted';
                    case 128: str = '- Video posted';
                    case 247: str = '- Photos posted';
                    case 237: str = '- App story';
                    case 257: str = '- Comment created';
                    case 272: str = '- App story';
                    case 285: str = '- Checkin to a place';
                    case 308: str = '- Post in Group';
                }
            }
            return str.replace(/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/, "...");
        },
        getFacebookSign: function(object){
            var div = '<div familytreetop="facebook-sign" style="position:absolute; top: 0; right: 0; cursor: pointer;">';
            if("undefined" !== typeof(object.permalink) && object.permalink.length > 0){
                div += '<a style="text-decoration: none;" target="_blank" href="'+object.permalink+'"><i class="icon-facebook-sign icon-2x familytreetop-icon-muted"></i></a>';
            }
            div += '</div>';
            return div;
        },
        getPicture: function(object){
            if("undefined" === typeof(object.attachment.media)) {
                return "";
            } else {
                var media = object.attachment.media[0];
                return '<a target="_blank" href="'+media.href+'"><img align="left" vspace="5" hspace="5" class="img-polaroid" src="'+media.src+'" /></a>';
            }
        },
        getTime: function(object){
            return $fn.timeAgo(object['updated_time']);
        },
        getGedcomId: function(object){
            var facebook_id = object.actor_id;
            var obj = $gedcom[facebook_id];
            if("undefined" !== typeof(obj) && "undefined" !== typeof(obj.gedcom_id)){
                return obj.gedcom_id;
            }
            return 0;
        },
        timeAgo: function(time){
            var date = new Date(parseInt(time)*1000),
                diff = (((new Date()).getTime() - date.getTime()) / 1000),
                day_diff = Math.floor(diff / 86400);

            if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
                return;

            return day_diff == 0 && (
                diff < 60 && "just now" ||
                    diff < 120 && "1 minute ago" ||
                    diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
                    diff < 7200 && "1 hour ago" ||
                    diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
                day_diff == 1 && "Yesterday" ||
                day_diff < 7 && day_diff + " days ago" ||
                day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
        },
        createImage: function(object){
            return $('<img class="img-rounded" src="https://graph.facebook.com/'+object.actor_id+'/picture"/>');
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
            var tr = $("<tr "+(($gedcom[object.actor_id])?'gedcom_id="'+$gedcom[object.actor_id].gedcom_id+'"':'')+"></tr>");
            var tr = $('<tr gedcom_id="'+( ("undefined"!==typeof($gedcom[object.actor_id]))?$gedcom[object.actor_id]:0 )+'"></tr>');
            $(tr).append($($fn.createTd("width:50px;")).append($fn.createImage(object)));
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
        $gedcom = json.gedcom;
        $facebook = json.facebook;
        $(json.data).each(function(index, element){
            var tr = $fn.createTr(element);
            $(tr).find('[familytreetop-image] img').load(function(e){
                if("undefined" !== typeof(e.target.naturalWidth)){
                    var width = e.target.naturalWidth;
                    if(width > Math.floor(parentWidth/2)){
                        width = Math.floor(parentWidth/2);
                    }
                    $(e).css('width', width + "px");
                }
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
        $fn.initPopovers();
    }
});