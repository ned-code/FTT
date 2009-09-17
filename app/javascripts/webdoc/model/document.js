

WebDoc.Document = $.klass(
{
    data: {},
    initialize: function(json)
    {
        if (!json) 
        {			
            this.data = {};
            this.data.created_at = new Date().toISO8601String();
            this.data.uuid = new MTools.UUID().toString();
        }
        else 
        {
            this.refresh(json);
        }
    },
    
    refresh: function(json)
    {
        this.data = json.document;
    },
    
    title: function()
    {
        return this.data.title;
    },
    
    setTitle: function(title)
    {
        this.data.title = title;
    },
    
    creationDate: function()
    {
        var result = new Date();
        result.setISO8601(this.data.created_at);
        return result;
    },
    
    uuid: function()
    {
        return this.data.uuid;
    },
	
	to_json: function()
	{
		var result = {};
            for (var key in this.data) 
			{
				result['document[' + key + ']'] = this.data[key];
			}
		return result;
	}	

});

