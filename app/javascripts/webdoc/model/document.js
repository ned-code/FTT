
//= require <mtools/record>

WebDoc.Document = $.klass(MTools.Record,
{
    initialize: function($super, json)
    {
		$super(json);   
    },
    
	className: function()
	{
		return "document";
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
    }

});

