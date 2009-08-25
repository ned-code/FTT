/**
 * Uniboard tool bar widget
**/
com.mnemis.core.Provide("com/mnemis/core/ServerManager.js");

com.mnemis.core.ServerManager = function()
{
    this.status = 1;
    console.log("will create DB");
    this.db = google.gears.factory.create('beta.database');
    console.log("DB created");
    this.db.open('uniboard');
    this.db.execute('create table if not exists json_content' +
           ' (url text, json text)');

};


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
           that.status = 1;
           callback.call(that, data);
           that.db.execute('insert into json_content values (?, ?)', [url, $.toJSON(data)]);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           that.status = 0;
           console.log("we are offline");
           var rs = that.db.execute('select * from json_content where url = "' + url + '"');
           var data;
           while (rs.isValidRow()) {
               data = $.evalJSON(rs.field(1));
               rs.next();
           }
           rs.close();
           callback.call(that, data);
       }
   });
}

com.mnemis.core.ServerManager.prototype.getHtml = function(url, callback)
{

}