/**
 * Base class for all persitent objects.
 * Record object are object that can be created, read, updated, and deleted (CRUD) by using a REST interface.
 * Each Record object has a data attribute that correspond the persistent data of the object.
 * By default each object has two persistent attributes: uuid and created_at. Those two attributes are automatically generated when a new Record is created.
 * Each subclass of Record must implement the function className. This method return a String that represent the kind of object and it is used to generate the REST URL.
 * (Typically if className return page, generated URL will be http://host/pages/...). A 's' is added to the classname and pluralize is not supported for the moment.
 * Record can also define a function rootUrl that allow to add prefix to the generated REST URL.
 * (Typically is rootUrl resturn '/documents/', generated URL will be http://host/documents/pages/...)
 * Each Record can be saved with the save function. This function will do an ajax call to create or update the record with the corresponding REST URL.
 * Destroy function will delete the record by doing an HTTP DELETE. In fact it is a POST with a parameter _method = delete. (it works with rails REST implementation)
 * Record can be initialized from a json comming from the server. This json must contain an attribute with name className (ie document). This attribute
 * contains the persistent data as a json object.
 * {
 *   person : { uuid: "12456216286", created_at: "12-05-1975T10:23:10", name: "Julien" }
 * }
 * 
 * @author Julien Bachmann
 */
WebDoc.Record = jQuery.klass(
{
  /**
   * constructor take a json as parameter to initialize the data of the object
   * @param {Object} json. If object is passed then it initialized the Record with this data and object is considered as an existing object.
   *                       If null is passed, object is initialized with an UUID and creation date and it is considered as a new object.
   */
  initialize: function(json) {
    this.isNew = true;
    this.data = {};    
    this.listeners = [];
    if (!json) {
      this.isNew = true;
      this.data = {};
      this.data.created_at = new Date().toISO8601String();
      this.data.uuid = new WebDoc.UUID().toString();
    }
    else {
      this.refresh(json);
    }
    WebDoc.ServerManager.cache.store(this);
  },
  
  /**
   * Return the data object of the record. Data object represent the persistent data of the record.
   * @param {boolean} withRelationShip if true, then relationship of record are present in the returned object. 
   */
  getData: function(withRelationShip) {
    return this.data;
  },
  
  id: function() {
    return this.data.uuid;
  },
  
  /**
   * @return {String} the uuid of the record. You should always use this function instead of directly reading the datauuid attribute.
   */
  uuid: function() {
    return this.data.uuid;
  },
  
  /**
   * @return {Date} the creation date of the record.
   */
  creationDate: function() {
    var result = new Date();
    result.setISO8601(this.data.created_at);
    return result;
  },

  
  /**
   * @deprecated. use the className class function instead.
   * @return the class name of the record. Class name is the class name that is defined on the server side.
   */
  className: function() {
    if (this.constructor.className) {
      return this.constructor.className();
    }
    else {
      ddd("no class name");
      ddt();
    }
  }, 
   
  /**
   * @deprecated. use the pluralizedClassName class function instead.
   * @return the class name of the record that will match the right route on the server.
   */
  pluralizedClassName: function() {
    if (this.constructor.pluralizedClassName) {
      return this.constructor.pluralizedClassName();
    }
    else {
      ddd("no class name");
      ddt();
    }
  },  
  
  /**
   * @deprecated. use the rootUrl class function instead.
   * @return the root url corresponding to this record.  
   */
  rootUrl: function() {
    return this.constructor.rootUrl(this.rootUrlArgs());
  }, 
  
  /**
   * @return {object} return an object that contains value needed to construct the root URL. It is typically used for nesed resources accessed with a REST URL.
   * Returned object must contain keys that are used by the rootUrl class method of the record type.
   */
  rootUrlArgs: function() {
    return null;  
  },
  
  /**
   * Add a listener on the objet changed.
   * @param {Object} listener a listen on the object changed. By default listener must implement objectChanged function.
   */
  addListener: function(listener) {
    this.listeners.push(listener);
  },
  
  /**
   * Remove record listener
   * @param {Object} listener to remove
   */
  removeListener: function(listener) {
    var index = jQuery.inArray(listener, this.listeners);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  },  
  
  /**
   * private method used to notify listeners when record has changed.
   * @param options options is an object hat will be passes to the listener.
   */
  fireObjectChanged: function(options) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].objectChanged) {
        this.listeners[i].objectChanged(this, options);
      }
    }
  },
  
  /**
   *  refresh record data from a json object
   * @param {Object} object containing record persistant data. This object must contain 1 attribute with name classname.
   */
  refresh: function(json, onlyMissingValues) {
    this.isNew = false;
    if (!this.data) {
      this.data = {};
    }
    var newValues = json[this.className()];
    if (onlyMissingValues) {
      jQuery.extend(newValues, this.data);
      this.data = newValues;
    }
    else {
      jQuery.extend(this.data, newValues);
    }
           
    this._initRelationShips(json);
    this.fireObjectChanged({ refresh: true });
  },
  
  _initRelationShips: function(json) {
    if (this.hasMany) {
      for (var manyAttribute in this.hasMany) {
        var manyClass = this.hasMany[manyAttribute];
        this[manyAttribute] = [];    
        if (this.data[manyAttribute] && $.isArray(this.data[manyAttribute])) {
          for (var i = 0; i < this.data[manyAttribute].length; i++) {
            var manyData = {};
            manyData[manyClass.className()] = this.data[manyAttribute][i];
             
            var newManyClass = new manyClass(manyData, this);
            this[manyAttribute].push(newManyClass);            
          }
        }          
      }
    }
    if (this.belongsTo) {
      for (var belongsToAttribute in this.belongsTo) {
        var belongsToClass = this.belongsTo[belongsToAttribute];
        if (this.data[belongsToAttribute]) {
          var belongsTodata = {};
          belongsTodata[belongsToClass.className()] = this.data[belongsToAttribute];
          this[belongsToAttribute] = new belongsToClass(belongsTodata, this);
        }
      }
    }
  },
  
  /**
   * to_json return a rails compatible json object (className[attr1] : value1)
   * @withRelationShips boolean. define if relationship must be present in the rail json object. 
   * @return an object that can be used to post or put to a rails server
   */
  to_json: function(withRelationShips) {
    var result = {};
    WebDoc.Record.convertToRailsJSon(this.getData(withRelationShips), result, this.className());
    return result;
  },
  
  /**
   * save the record using REST URL. It use the correct URL depending on if the object is new or updated
   * @param {Object} callBack a callback method that is called when object has been saved.
   */
  save: function(callBack, withRelationships, synch) {
    if (this.isNew) {
      WebDoc.ServerManager.newObject(this, function(persitedDoc) {
        if (callBack) {callBack.apply(persitedDoc[0], [persitedDoc[0], "OK"]);}
      }, synch);
    }
    else {
      WebDoc.ServerManager.updateObject(this, function(persitedDoc) {
        if (callBack) {callBack.apply(persitedDoc[0], [persitedDoc[0], "OK"]);}
      }, withRelationships, synch);
    }
  },
  
  /**
   * delete the object using a REST URL.
   * @param {Object} callBack a callback method that is called when object has been deleted
   */
  destroy: function(callBack) {
    WebDoc.ServerManager.deleteObject(this, function(persitedDoc) {
      if (callBack) {callBack.apply(persitedDoc[0], [persitedDoc[0], "OK"]);}
    });
  },
  
  /**
   * Used to copy a record. All sub class must extend this method to copy their attributes
   * @return a copy of the record
   */
  copy: function() {
    var recordCopy = new this.constructor();
    return recordCopy;
  },
  
  _isAttributeModified: function(options, attributeName) {
    if (options && options.modifedAttribute) {
      return (options.modifedAttribute.indexOf(attributeName) !== -1);
    }
    return true;
  }
});

//**************
// Class method
//**************
jQuery.extend(WebDoc.Record, {
  _hasManyRelationships: [],
  /**
   * Convert an oject to a rails conpatible json object
   * @param {Object} objectToConvert the object to convert
   * @param {Object} destinationObject an object in which the conversion is done. Used because this method is recursive
   * @param {Object} prefix a prefix for the conversion.
   */
  convertToRailsJSon: function (objectToConvert, destinationObject, prefix) {
    for (var key in objectToConvert) {
      var value = objectToConvert[key];
      // array are serialized in standard json. I assume that all array of data are relationships and currently it is not
      // possible to passe this to rails in a correct format.
      // so all relationships must then have a special treatment on the server side.
      if (jQuery.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          var arrayItem = value[i];
          this.convertToRailsJSon(arrayItem, destinationObject, prefix + '[' + key + '_attributes][' + i +']');
        }               
      }
      else if (value && typeof value == 'object') {
        var empty = true;
        for (var att in value) {
          empty = false;
          break;
        }
        if (!empty) {
          this.convertToRailsJSon(value, destinationObject, prefix + '[' + key + ']');
        }
        // if we want rails generate an object on the server side we must at least have 1 key. Se we put a dummy key (rails_empty).
        else if (value) {
          destinationObject[prefix + '[' + key + '][rails_empty]'] = "dummy";
        }
      }
      else {
        destinationObject[prefix + '[' + key + ']'] = value;
      }
    }   
  },
  
  /**
   * All sub class must implement this method and return the class name. ClassName is used to construct REST URL for create, edit and delete object.
   * Also ClassName is the name of the attribute of json containing the data (Rails convention)
   */
  className: function() {
    throw ("className function not implemented");
  },  
  
  /**
   * sub class can implement this method to allow having nested resources. For example /documents/:document_id/pages/:uuid. In this case rootUrl is
   * /document/:document_id
   */
  rootUrl: function(args) {
    return "";
  }
});

