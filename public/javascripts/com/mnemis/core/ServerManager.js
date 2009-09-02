/**
 * Uniboard tool bar widget
**/
if (com.mnemis.core.Provide("com/mnemis/core/ServerManager.js"))
{
    com.mnemis.core.ServerManager = $.inherit(
    {
        __constructor: function()
        {
            console.log("Init server manager");
        },

        getJson: function(url, callback)
        {
            console.log("server manager get url " + url);
            var that = this;
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function(data) {
                    console.log("we are online");
                    callback.call(that, data);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("we are offline");
                    callback.call(that, {});
                }
            });
        }
    });
}