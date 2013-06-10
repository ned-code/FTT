$FamilyTreeTop.create("myfamily", function($){
    'use strict';
    var $this = this, $box, $search, $fn;

    $box = $("#myFamilyOnFacebook");

    $fn = {
        getRelation: function(object){
            var facebook_id = object.from.id;
            var obj = $search[facebook_id];
            if("undefined" !== typeof(obj)){
                return '<i class="icon-leaf"></i>';
            }
            return "";
        },
        getName: function(object){
            return object.from.name;
        },
        createImage: function(object){
            return $('<img class="img-rounded" src="https://graph.facebook.com/'+object.from.id+'/picture"/>');
        },
        createBody: function(object){
            var parentDiv = $('<div class="row-fluid"><div class="span12"></div></div>');
            $(parentDiv).find('.span12').append('<div>'+$fn.getName(object)+'</div>');
            $(parentDiv).find('.span12').append('<div>'+$fn.getRelation(object)+'</div>');

            return parentDiv;
        },
        createTd: function(){
            return $('<td></td>');
        },
        createTr: function(object){
            var tr = $('<tr></tr>');
            $(tr).append($($fn.createTd()).append($fn.createImage(object)));
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