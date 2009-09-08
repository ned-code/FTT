
if (com.mnemis.core.Provide("com/mnemis/wb/model/WBDocument.js"))
{

    com.mnemis.wb.model.WBDocument = $.inherit(
    {
        data: {},
        __constructor: function(json)
        {
            if (!json)
            {
                this.data = {};
                this.data.created_at = new Date().toISO8601String();
                this.data.uuid = new com.mnemis.core.UUID().toString();
            }
            else
            {
                this.refresh(json);
            }
        },

        refresh: function(json)
        {
            this.data = json.ub_document;
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
        
    });
}
