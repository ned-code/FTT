/**
 * ServerManager is responsible for server access.
 * All access to the server should be done through this singleton. All the logic of online and offline will be managed by this class.
 * Currently all call are forwarded to the server with ajax but later data will be fetched and edited locally on the local database and then
 * synchronized with the server when connection is available.
 *
 * @author Julien Bachmann
 **/
//= require <mtools/server_cache>

WebDoc.ServerManager = jQuery.klass({
  initialize: function() {
    ddd("Init server manager");
  }
});

jQuery.extend(WebDoc.ServerManager, {
  
  /**
  * cache used by the ServerManager singleton 
  */
  cache: new WebDoc.ServerCache(),
  
  /**
   * Fetch record object from the server
   * @param {Object} recordClass the record class to fetch
   * @param {Object} uuid the uuid of the record or null if we want all records
   * @param {function} callBack function that is called with the fetched records.
   *                 function callback(WebDoc.Record[])
   * @param {Object} args arguments used for the fetch. Arguments depends on the record class. It can be arguments needed for nested resources (@see WebDoc.Record.rootUrl() documentation)
   *                 In the futur it can be attributes for the fetch (page number, etc...)
   */
  getRecords: function(recordClass, uuid, callBack, args) {
    // we can check the cache if we search a record by uuid. Otherwise we need to request the database.
    if (uuid) {
      var cachedRecord = WebDoc.ServerManager.cache.get(recordClass, uuid);
      if (cachedRecord) {
        callBack.call(this, [cachedRecord]);
        return;
      }
    }
    var pluralizedRecordClassName = recordClass.pluralizedClassName();
    var url = recordClass.rootUrl(args) + "/" + pluralizedRecordClassName;
    if (uuid) {
      url += "/" + uuid;
    }
    url += ".json";
    
    var ajaxParams = args && args.ajaxParams ? args.ajaxParams : {};
    jQuery.ajax({
      type: "GET",
      url: url,
      data: (ajaxParams),
      dataType: "json",
      success: function(data) {
        var result = [];

        // ==================================================================================================================
        // = Discuss with Julien, but we probably should standardize the server response and never return directly an array =
        // = but always assume there will be some kind of additional data passed like pagination...                         =
        // ==================================================================================================================

        if (jQuery.isArray(data)) {
          // the server returned a list of records with no other additional info: [{image1}, {image2}, ...]
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              var currentRecord = new recordClass(data[i]);
              result.push(currentRecord);
            }
          }
          callBack.call(this, result);
        }
        else {
          if (data && typeof data == 'object' && pluralizedRecordClassName in data) { //if data is a dictionary (not an array) this will search among all the keys of the dictionary
            // the server returned a list of records along with additional information (like pagination data): { images:[{image1},{image2},...], total:432 }
            var recordsData = data[pluralizedRecordClassName];
            if (recordsData.length > 0) {
              for (var i = 0; i < recordsData.length; i++) {
                var record = new recordClass(recordsData[i]);
                result.push(record);
              }
            }
            data[pluralizedRecordClassName] = result;
            callBack.call(this, data);
          }
          else {
            // the server returned a single record
            if (data) {
              var record = new recordClass(data);
              result.push(record);
            }
            callBack.call(this, result);
          }
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error " + textStatus + " " + errorThrown);
        ddd(XMLHttpRequest);
        callBack.call(this, {});
      }
    });
  },
  
  /**
   * fetch object from the server with a specified URL.
   * @deprecated. Use getRecords instead
   * @param {Object} url URL to get the object(s) TODO should be changed to support offline
   * @param {Object} objectClass the class of object to fetch. Returned objects will be of this class
   * @param {Object} callback the callback function that will be called when object(s) are fetched.
   *                 callback recieve the fetched object or an array of fetched object if more than one objects are fetched.
   * @param {Object} context a context for the callback function. if null context is the ajax request.
   */
  getObjects: function(url, objectClass, callback, context) {
  
    jQuery.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      success: function(data) {
        if (objectClass) {
          var result = [];
          if (jQuery.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
              var aJson = data[i];
              result.push(new objectClass(aJson));
            }
          }
          else {
            if (data) {
              result.push(new objectClass(data));
            }
          }
          callback.call(context ? context : this, result);
        }
        else {
          callback.call(context ? context : this, data);
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error " + textStatus + " " + errorThrown);
        ddd(XMLHttpRequest);
        callback.call(context, {});
      }
    });
  },
  
  /**
   * Make a new object persitant. Do an HTTP POST. (some value can be created on the server side). object is automatically refresh with the data recieved by the server
   * @param object the new object to persist
   * @param callBack function that called when object is persisted.
   *        callback recieve an array that has the created object.
   **/
  newObject: function(object, callBack, synch) {
    var message = {
      xmpp_client_id: WebDoc.ServerManager.xmppClientId
    };    
    jQuery.extend(message, object.to_json(true));
    $.ajax({
      async: !synch,
      type: 'POST',
      url: object.rootUrl() + "/" + object.pluralizedClassName(),
      data: message,
      success: function(data, textstatus) {
        // refresh is needed because some values are generated on server side
        // i.e. page size and background and id
        object.refresh(data);
        object.isNew = false;
        // we must update the cache with the id that comes from the server
        WebDoc.ServerManager.cache.store(object);
        callBack.apply(this, [[object]]);        
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        throw errorThrown;
      },      
      dataType: "json"
    });
    
  },
  
  /**
   * Update an existing object with new values
   * @param {Object} object the modified object
   * @param {Object} callBack function that called when object is updated
   *        callback recieve an array that has the updated object.
   */
  updateObject: function(object, callBack, withRelationships, synch) {
    var param = {
      xmpp_client_id: WebDoc.ServerManager.xmppClientId,
      _method: "PUT"
    };
    jQuery.extend(param, object.to_json(withRelationships));
    $.ajax({
      async: !synch,
      type: 'POST',
      url: object.rootUrl() + "/" + object.className() + "s/" + object.uuid(),
      data: param,
      success: function(data, textstatus) {
        // if we save objects with relationshipd we must refresh object because its relations can be new objects. So we need to take the id of those new objects
        if (withRelationships) {
          object.refresh(data);
        }
        callBack.apply(this, [[object]]);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        throw errorThrown;
      },      
      dataType: "json"
    });    
  },
  
  /**
   *
   * @param {Object} object the object to delete
   * @param {Object} callBack function that called when object is deleted
   *        callback recieve an array that has the updated object.
   */
  deleteObject: function(object, callBack) {
    var param = {
      xmpp_client_id: WebDoc.ServerManager.xmppClientId,
      _method: "DELETE"
    };
    jQuery.post(object.rootUrl() + "/" + object.className() + "s/" + object.uuid(), param, function(data, textstatus) {
      callBack.apply(this, [object]);
    }, "json");
  },

  /**
   * Send a request to the server with a object
   * @param {Object} object the object
   * @params {Object} callBack function that called
   * @params {String} verb the HTTP Verb
   * @params {String} action the action
   * @params {Array} parameters to happends to the request
   */
  sendObject: function(object, callBack, verb, action, extraParams) {
    var params = {
      xmpp_client_id: WebDoc.ServerManager.xmppClientId
    };

    if (extraParams !== null) {
      for(key in extraParams) {
        params[key] = extraParams[key];
      }
    }

    var url = object.rootUrl() + "/" + object.className() + "s/" + object.uuid() + "/" + action;

    this.request(url, callBack, verb, params);
  },
  
  /**
   * Send a request to the server
   * @param {String} url
   * @params {Object} callBack function that called
   * @params {String} verb the HTTP Verb
   * @params {Array} parameters to append to the request
   */
  request: function(url, callBack, verb, extraParams) {

    jQuery.ajax({
      type: verb.toUpperCase(),
      url: url,
      data: extraParams,
      dataType: "json",
      success: function(data, textstatus) {    	
         callBack.call(this, data);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error " + textStatus + " " + errorThrown);
        ddd(XMLHttpRequest);
      }
    });
  }
});
