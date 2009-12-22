/**
 * ServerManager is responsible for server access.
 * All access to the server should be done through this singleton. All the logic of online and offline will be managed by this class.
 * Currently all call are forwarded to the server with ajax but later data will be fetched and edited locally on the local database and then
 * synchronized with the server when connection is available.
 *
 * @author Julien Bachmann
 **/
//= require <mtools/server_cache>

MTools.ServerManager = $.klass({
  initialize: function() {
    ddd("Init server manager");
  }
});

$.extend(MTools.ServerManager, {

  cache: new MTools.ServerCache(),
  
  getRecords: function(recordClass, uuid, callBack, args) {
    // we can check the cache if we search a record by uuid. Otherwise we need to request the database.
    if (uuid) {
      var cachedRecord = MTools.ServerManager.cache.get(recordClass, uuid);
      if (cachedRecord !== undefined) {
        callBack.call(this, [cachedRecord]);
        return;
      }
    }
    var pluralizedRecordClassName = recordClass.className() + "s";
    var url = recordClass.rootUrl(args) + "/" + pluralizedRecordClassName;
    if (uuid) {
      url += "/" + uuid;
    }
    url += ".json";
    
    var ajaxParams = args && args.ajaxParams && args.ajaxParams.page ? { page: args.ajaxParams.page } : {};
    
    $.ajax({
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

        if ($.isArray(data)) {
          // the server returned a list of records with no other additional info: [{image1}, {image2}, ...]
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              var record = new recordClass(data[i]);
              MTools.ServerManager.cache.store(record);
              result.push(record);
            }
          }
          callBack.call(this, result);
        }
        else {
          if (pluralizedRecordClassName in data) { //if data is a dictionary (not an array) this will search among all the keys of the dictionary
            // the server returned a list of records along with additional information (like pagination data): { images:[{image1},{image2},...], total:432 }
            var recordsData = data[pluralizedRecordClassName];
            if (recordsData.length > 0) {
              for (var i = 0; i < recordsData.length; i++) {
                var record = new recordClass(recordsData[i]);
                MTools.ServerManager.cache.store(record);
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
              MTools.ServerManager.cache.store(record);
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
   *
   * @param {Object} url URL to get the object(s) TODO should be changed to support offline
   * @param {Object} objectClass the class of object to fetch. Returned objects will be of this class
   * @param {Object} callback the callback function that will be called when object(s) are fetched.
   *                 callback recieve the fetched object or an array of fetched object if more than one objects are fetched.
   * @param {Object} context a context for the callback function. if null context is the ajax request.
   */
  getObjects: function(url, objectClass, callback, context) {
  
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      success: function(data) {
        if (objectClass) {
          var result = [];
          if ($.isArray(data)) {
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
   * Make a new object persitant. Do an HTTP POST.
   * @param url the url to call for persisting a new object. TODO must be changed for offline
   * @param object the new object to persist
   * @param callBack function that called when object is persisted.
   *        callback recieve an array that has the created object.
   *        context for the callback function is the ajax request. created object is an object of the same class but can be a different one
   *        (some value can be created on the server side)
   **/
  newObject: function(url, object, callBack) {
    var message = {
      source: MTools.ServerManager.sourceId
    };
    $.extend(message, object.to_json(true));
    $.post(url, message, function(data, textstatus) {
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
  updateObject: function(url, object, callBack) {
    var param = {
      source: MTools.ServerManager.sourceId,
      _method: "PUT"
    };
    $.extend(param, object.to_json());
    $.post(url, param, function(data, textstatus) {
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
  deleteObject: function(url, object, callBack) {
    var param = {
      source: MTools.ServerManager.sourceId,
      _method: "DELETE"
    };
    $.post(url, param, function(data, textstatus) {
      callBack.apply(this, [object]);
    }, "json");
  }
});
