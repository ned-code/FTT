/**
 * ServerManager is responsible for server access.
 * All access to the server should be done through this singleton. All the logic of online and offline will be managed by this class.
 * Currently all call are forwarded to the server with ajax but later data will be fetched and edited locally on the local database and then 
 * synchronized with the server when connection is available.
 * 
 * @author Julien Bachmann
 **/
MTools.ServerManager = $.klass(
{
    initialize: function()
    {
        ddd("Init server manager");
    }
});

$.extend(MTools.ServerManager, 
{
  /**
   * 
   * @param {Object} url URL to get the object(s) TODO should be changed to support offline
   * @param {Object} objectClass the class of object to fetch. Returned objects will be of this class
   * @param {Object} callback the callback function that will be called when object(s) are fetched.
   *                 callback recieve the fetched object or an array of fetched object if more than one objects are fetched.
   * @param {Object} context a context for the callback function. if null context is the ajax request.
   */
    getObjects: function(url, objectClass, callback, context)
    {
 
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
                      if (data) {
                        result.push(new objectClass(data));
                      }
                    }
                    callback.call(context?context:this, result);
                }
                else 
                {
                    callback.call(context?context:this, data);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown)
            {
                ddd("error " + textStatus + " " + errorThrown);
                ddd(XMLHttpRequest);
                callback.call(context, {});
            }
        });
    },
    
    /**
     * Make a new object persitant. Do an HTTP POST.
     * @param url the url to call for persisting a new object. TODO must be changed for offline
     * @param object the new object to persist
     * @param callBack function that called when object is persisted.
     *        callback recieve an array that has the created object.
     *        context for the callback function is the ajax request. created object is an object of the same class but can be a different one
     *        (some value can be created on the server side)
     **/
    newObject: function(url, object, callBack)
    {
        $.post(url, object.to_json(true), function(data, textstatus)
        {
            // refresh is needed because some values are generaed on server side
            // i.e. page size and background.
            object.refresh(data);
            object.isNew = false;
            callBack.apply(this, [[object]]);
        }, "json");
    },
    
    /**
     * Update an existing object with new values
     * @param {Object} url the url to update the object. TODO change for offline
     * @param {Object} object the modified object
     * @param {Object} callBack function that called when object is updated
     *        callback recieve an array that has the updated object.
     */
    updateObject: function(url, object, callBack)
    {
        var param = 
        {
            _method: "PUT"
        };
        $.extend(param, object.to_json());
        $.post(url, param, function(data, textstatus)
        {
            //object.refresh(data);
            callBack.apply(this, [[object]]);
        }, "json");
    },
    
    /**
     * 
     * @param {Object} url the url to delete the object. TODO change for offline
     * @param {Object} object the object to delete
     * @param {Object} callBack function that called when object is deleted
     *        callback recieve an array that has the updated object.
     */
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
