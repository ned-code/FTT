
com.mnemis.core.Provide("com/mnemis/wb/model/WBPageRecord.js");


if (!com.mnemis.wb.model) { com.mnemis.wb.model = {}};

com.mnemis.wb.model.WBPageRecord = function(url, json)
{
    console.log("create page record");
    this.url = url;
    this.json = json;
    if (this.json)
    {
        this.updateDatabase()
    }
    else
    {
        this.refreshFromDatabase()
    }
}

com.mnemis.wb.model.WBPageRecord.prototype.updateDatabase = function()
{
}

com.mnemis.wb.model.WBPageRecord.prototype.refreshFromDatabase = function()
{
 
}

com.mnemis.wb.model.WBPageRecord.prototype.json = function()
{
    return this.json;
}

com.mnemis.wb.model.WBPageRecord.prototype.createOrUpdateItem = function(itemData)
{
      
}