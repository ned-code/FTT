
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
    }

});

