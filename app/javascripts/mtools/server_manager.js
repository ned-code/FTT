/**
 * ServerManager is responsible for server access.
 **/
MTools.ServerManager = $.klass(
{
    initialize: function()
    {
        console.log("Init server manager");
    }
});

$.extend(MTools.ServerManager, 
{
    getObjects: function(url, objectClass, callback, context)
    {
        if (!context) 
        {
            context = this;
        }
        $.ajax(
        {
            type: "GET",
            url: url,
            dataType: "json",
            success: function(data)
            {
                if (objectClass) 
                {
                    var result = [];
                    if ($.isArray(data)) 
                    {
                        for (var i = 0; i < data.length; i++) 
                        {
                            var aJson = data[i];
                            result.push(new objectClass(aJson));
                        }
                    }
                    else 
                    {
                        result.push(new objectClass(data));
                    }
                    callback.call(context, result);
                }
                else 
                {
                    callback.call(context, data);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown)
            {
                console.log("error " + textStatus);
                callback.call(context, {});
            }
        });
    },
    
    /*
     * Make a new object persitant
     * @param url the url to call for persisting a new object
     * @param object the new object to persist
     * @param callBack function that called when object is persisted
     *  callBack(AjaxRequest, createdObject). created object is an object of the same class but can be a different one
     *  (some value can be created on the server side)
     */
    newObject: function(url, object, callBack)
    {
        $.post(url, object.to_json(), function(data, textstatus)
        {
            object.refresh(data);
            callBack.apply(this, [object]);
        }, "json");
    },
    
    updateObject: function(url, object, callBack)
    {
        var param = 
        {
            _method: "PUT"
        };
        $.extend(param, object.to_json());
        $.post(url, param, function(data, textstatus)
        {
            console.log(data);
            object.refresh(data);
            callBack.apply(this, [object]);
        }, "json");
    },
    
    deleteObject: function(url, object, callBack)
    {
        var param = 
        {
            _method: "DELETE"
        };
        $.post(url, param, function(data, textstatus)
        {
            callBack.apply(this, [object]);
        }, "json");
    }
});
