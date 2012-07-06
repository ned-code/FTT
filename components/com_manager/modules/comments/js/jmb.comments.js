function JMBCommentsObject(object){
    var module = this,
        alias = jQuery(document.body).attr('_alias');

    if(alias == 'feedback'){
        var iframe = '<iframe width="100%" height="500px"" align="middle" style="border: medium none;" src="http://www.familytreetop.com/index.php/component/obsuggest/18-report-a-problem"></iframe>';
        jQuery(object).append(iframe);

    } else {
        module.ajax('get', alias, function(res){
            console.log(res);
        })
    }
}

JMBCommentsObject.prototype = {
    ajax:function(func, params, callback){
        storage.callMethod("comments", "JMBComments", func, params, function(res){
            //var json = jQuery.parseJSON(res.responseText);
            var json = storage.getJSON(res.responseText);
            callback(json);
        });
    }
}




