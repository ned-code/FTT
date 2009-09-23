/**
 * Base class for all persitent objects.
 */
MTools.Record = $.klass(
{
    isNew: true,
    data: {},
	/**
	 * constructor take a json as parameter to initialize the data of the object
	 * @param {Object} json all the persisted data of the object. if null object is initialized with an UUID and creation date.
	 */
    initialize: function(json)
    {
        if (!json) 
        {
			this.isNew = true;  
          this.data = {};
            this.data.created_at = new Date().toISO8601String();
            this.data.uuid = new MTools.UUID().toString();
        }
        else 
        {
            this.refresh(json);
        }
    },
    
	data: function()
	{
		return this.data;
	},
	
	uuid: function()
	{
		return this.data.uuid;
	},
	
	creationDate: function()
    {
        var result = new Date();
        result.setISO8601(this.data.created_at);
        return result;
    },
	
	/**
	 * All sub class must implement this method and return the class name. ClassName is used to construct REST URL for create, edit and delete object.
	 * Also ClassName is the name of the attribute of json containing the data (Rails convention)
	 */
    className: function()
    {
        throw ("className function not implemented");
    },
	
	/**
	 * sub class can implement this method to allow having nested resources. For example /documents/:document_id/pages/:uuid. In this case rootUrl is 
	 * /document/:document_id
	 */
    rootUrl: function()
	{
		return "";
	},
	
	/**
	 * refresh method refresh record data from a json object
	 * @param {Object} json
	 */
    refresh: function(json)
    {
        this.isNew = false;
        this.data = json[this.className()];
    },
    
    /**
     * to_json return a rails compatible json object (className[attr1] : value1)
     */
    to_json: function()
    {
        var result = {};
        for (var key in this.data) 
        {
			var value = this.data[key];
			if (typeof value == 'object') 
			{
				value = $.toJSON(value);
			}
            result[this.className() + '[' + key + ']'] = value;
        }
        return result;
    },
    
	/**
	 * save the record using REST URL. It use the correct URL depending on if the object is new or updated
	 * @param {Object} callBack a callback method that is called when object has been saved.
	 */
    save: function(callBack)
    {       
        if (this.isNew) 
        {
            MTools.ServerManager.newObject(this.rootUrl() + "/" + this.className() + "s", this, function(persitedDoc)
            {
                callBack ? callBack.call(persitedDoc, "OK"): '';
            });
        }
        else 
        {
            MTools.ServerManager.updateObject(this.rootUrl() + "/" + this.className() + "s/" + this.uuid(), this, function(persitedDoc)
            {
                callBack ? callBack.call(persitedDoc, "OK"): '';
            });
        }
    },
	
	/**
	 * delete the object using a REST URL.
	 * @param {Object} callBack a callback method that is called when object has been deleted
	 */
	destroy: function(callBack)
	{
        MTools.ServerManager.deleteObject(this.rootUrl() + "/" + this.className() + "s/" + this.uuid(), this, function(persitedDoc)
        {
            callBack ? callBack.call(persitedDoc, "OK"): '';
        });
	}
});

