/**
 * Uniboard tool bar widget
**/
com.mnemis.core.Provide("com/mnemis/core/ServerManager.js");

com.mnemis.core.Import("com/mnemis/wb/model/WBPageRecord.js");


com.mnemis.core.ServerManager = function()
{
    console.log("Init server manager");
};

com.mnemis.core.ServerManager.prototype.getPage = function(url, callback)
{
   console.log("server manager get page " + url);
   var that = this;
   $.ajax({
       type: "GET",
       url: url,
       dataType: "json",
       success: function(data) {
           console.log("we are online");
           var page = new com.mnemis.wb.model.WBPageRecord(url, data);
           callback.call(that, page);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           console.log("we are offline");
           var page = new com.mnemis.wb.model.WBPageRecord(url, null);
           callback.call(that, page);
       }
   });
}

com.mnemis.core.ServerManager.prototype.getJson = function(url, callback)
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
