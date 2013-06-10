$FamilyTreeTop.create("myfamily", function($){
    'use strict';
    var $this = this, $box, $search, $fn;

    $box = $("#myFamilyOnFacebook");

    $fn = {
        getRelation: function(object){
            var facebook_id = object.from.id;
            var obj = $search[facebook_id];
            if("undefined" !== typeof(obj)){
                var relation = "undefined"!==typeof(obj.gedcom_id)?$this.mod('usertree').user(obj.gedcom_id).relation:obj.relationship;
                return '<i class="icon-leaf"></i>'+relation;
            }
            return "";
        },
        getName: function(object){
            return object.from.name;
        },
        getMessage: function(object){
            var str = object.message || object.description || object.story || (("undefined" !== typeof("undefined"!==typeof(object.type)&&object.type=="link"))?"Likes on " + object.application.name :"") || "";
            return str.replace(/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/, "...");
        },
        getPicture: function(object){
            return '<a target="_blank" href="'+object.link+'"><img class="img-polaroid" src="'+object.picture+'" /></a>';
        },
        getTime: function(object){
            return $fn.timeAgo(object['updated_time']);
        },
        timeAgo: function(time){
            var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
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
            return $('<img class="img-rounded" src="https://graph.facebook.com/'+object.from.id+'/picture"/>');
        },
        createBody: function(object){
            var parentDiv = $('<div class="row-fluid"><div class="span12"></div></div>');
            $(parentDiv).find('.span12').append('<div familytreetop="profile">'+$fn.getName(object)+'</div>');
            $(parentDiv).find('.span12').append('<div style="color: #797979;font-size: 12px;">'+$fn.getRelation(object)+'</div>');
            $(parentDiv).find('.span12').append('<div>'+$fn.getMessage(object)+'</div>');
            if("undefined" !== typeof(object.picture)){
                $(parentDiv).find('.span12').append('<div>'+$fn.getPicture(object)+'</div>');
            }
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
            $(tr).append($($fn.createTd("width:50px;")).append($fn.createImage(object)));
            $(tr).append($($fn.createTd()).append($fn.createBody(object)));
            return tr;
        }
    }

    $this.render = function(json){
        var table = $($box).find('table');
        $search = json.search;

        console.log(json);
        $(json.sort).each(function(index, element){
            $(table).append($fn.createTr(element));
        });
    }
});