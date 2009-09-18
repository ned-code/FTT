

MTools.Record = $.klass(
{
    isNew: true,
    data: {},
    initialize: function(json)
    {
        if (!json) 
        {
			this.isNew = true;
            this.data = {};
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
	
    className: function()
    {
        throw ("className function not implemented");
    },
	
    rootUrl: function()
	{
		return "";
	},
	
    refresh: function(json)
    {
        this.isNew = false;
        this.data = json[this.className()];
    },
    
    
    to_json: function()
    {
        var result = {};
        for (var key in this.data) 
        {
            result[this.className() + '[' + key + ']'] = this.data[key];
        }
        return result;
    },
    
    save: function(callBack)
    {
        if (this.isNew) 
        {
            MTools.ServerManager.newObject(this.rootUrl() + "/" + this.className() + "s", this, function(persitedDoc)
            {
                callBack.call(persitedDoc, "OK");
            });
        }
        else 
        {
            MTools.ServerManager.updateObject(this.rootUrl() + "/" + this.className() + "s/" + this.uuid(), this, function(persitedDoc)
            {
                callBack.call(persitedDoc, "OK");
            });
        }
    },
	
	destroy: function(callBack)
	{
        MTools.ServerManager.deleteObject(this.rootUrl() + "/" + this.className() + "s/" + this.uuid(), this, function(persitedDoc)
        {
            callBack.call(persitedDoc, "OK");
        }, "json");
	}
});

