/**
 * Uniboard tool bar widget
**/
if (com.mnemis.core.Provide("com/mnemis/core/ServerManager.js"))
{
    com.mnemis.core.ServerManager = $.inherit(
    {
        __constructor: function()
        {
            console.log("Init server manager");
        },

        getJson: function(url, callback, context, objectClass)
        {
            console.log("server manager get url " + url);
            if (!context)
            {
                context = this;
            }
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function(data) {
                    console.log("we are online");
                    if (objectClass)
                    {
                        var result = [];
                        for (var i = 0; i < data.length; i++)
                        {
                            var aJson = data[i];
                            result.push(new objectClass(aJson));
                        }
                        callback.call(context, result);
                    }
                    else
                    {
                        callback.call(context, data);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("we are offline");
                    callback.call(context, {});
                }
            });
        },

        getObjects: function(url, objectClass, callback, context)
        {
            console.log("server manager get url " + url);
            if (!context)
            {
                context = this;
            }
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function(data) {
                    console.log("we are online");
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
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("we are offline");
                    callback.call(context, {});
                }
            });
        },

        newObject: function(url, object, callBack)
        {
            $.post(url, object.data, function(data, textstatus)
            {
                var createdObject = new object.constructor(data);
                callBack.apply(this, [createdObject]);
            }, "json");
        },

        updateObject: function(url, object, callBack)
        {
            var param = {_method: "PUT"};
            $.extend(param, object.data);
            $.post(url, param, function(data, textstatus)
            {
                console.log(data);
                object.refresh(data);
                callBack.apply(this, [object]);
            }, "json");
        },

        deleteObject: function(url, object, callBack)
        {
            var param = {_method: "DELETE"};
            $.extend(param, object.data);
            $.post(url, param, function(data, textstatus)
            {
                callBack.apply(this, [object]);
            }, "json");
        }
    });
}