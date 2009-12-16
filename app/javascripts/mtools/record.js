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
MTools.Record = $.klass(
{
  isNew: true,
  data: {},
  /**
   * constructor take a json as parameter to initialize the data of the object
   * @param {Object} json. If object is passed then it initialized the Record with this data and object is considered as an existing object.
   *                       If null is passed, object is initialized with an UUID and creation date and it is considered as a new object.
   */
  initialize: function(json) {
    this.listeners = [];
    if (!json) {
      this.isNew = true;
      this.data = {};
      this.data.created_at = new Date().toISO8601String();
      this.data.uuid = new MTools.UUID().toString();
    }
    else {
      this.refresh(json);
    }
  },
  
  getData: function(withRelationShip) {
    return this.data;
  },
  
  uuid: function() {
    return this.data.uuid;
  },
  
  creationDate: function() {
    var result = new Date();
    result.setISO8601(this.data.created_at);
    return result;
  },
  
  /**
   * @deprecated. use the className class function instead.
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
   * @deprecated. use the rootUrl class function instead.
   */
  rootUrl: function() {
    return this.constructor.rootUrl(this.rootUrlArgs());
  },  
  
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
  
  removeListener: function(listener) {
    var index = $.inArray(listener, this.listeners);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  },  
  
  fireObjectChanged: function() {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].objectChanged) {
        this.listeners[i].objectChanged(this);
      }
    }
  },
  
  /**
   * refresh method refresh record data from a json object
   * @param {Object} json
   */
  refresh: function(json) {
    this.isNew = false;
    this.data = json[this.className()];
    this.fireObjectChanged();
  },
  
  /**
   * to_json return a rails compatible json object (className[attr1] : value1)
   */
  to_json: function(withRelationShips) {
    var result = {};
    MTools.Record.convertToRailsJSon(this.getData(withRelationShips), result, this.className());
    return result;
  },
  
  /**
   * save the record using REST URL. It use the correct URL depending on if the object is new or updated
   * @param {Object} callBack a callback method that is called when object has been saved.
   */
  save: function(callBack) {
    if (this.isNew) {
      MTools.ServerManager.newObject(this.rootUrl() + "/" + this.className() + "s", this, function(persitedDoc) {
        if (callBack) {callBack.apply(persitedDoc[0], [persitedDoc[0], "OK"]);}
      });
    }
    else {
      MTools.ServerManager.updateObject(this.rootUrl() + "/" + this.className() + "s/" + this.uuid(), this, function(persitedDoc) {
        if (callBack) {callBack.apply(persitedDoc[0], [persitedDoc[0], "OK"]);}
      });
    }
  },
  
  /**
   * delete the object using a REST URL.
   * @param {Object} callBack a callback method that is called when object has been deleted
   */
  destroy: function(callBack) {
    MTools.ServerManager.deleteObject(this.rootUrl() + "/" + this.className() + "s/" + this.uuid(), this, function(persitedDoc) {
      if (callBack) {callBack.apply(persitedDoc[0], [persitedDoc[0], "OK"]);}
    });
  },
  
  copy: function() {
    var recordCopy = new this.constructor();
    return recordCopy;
  }
});

$.extend(MTools.Record, {
  convertToRailsJSon: function (objectToConvert, destinationObject, prefix) {
    for (var key in objectToConvert) {
      var value = objectToConvert[key];
      // array are serialized in standard json. I assume that all array of data are relationships and currently it is not
      // possible to passe this to rails in a correct format.
      // so all relationships must then have a special treatment on the server side.
      if ($.isArray(value)) {
        destinationObject[prefix + '[' + key + ']'] = $.toJSON(value);        
      }
      else if (typeof value == 'object') {
        if (value && value.__count__ > 0) {
          this.convertToRailsJSon(value, destinationObject, prefix + '[' + key + ']');
        }
        else {
          destinationObject[prefix + '[' + key + '][rails_empty]'] = "{}";
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

