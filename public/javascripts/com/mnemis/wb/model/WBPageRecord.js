
com.mnemis.core.Provide("com/mnemis/wb/model/WBPageRecord.js");


if (!com.mnemis.wb.model) { com.mnemis.wb.model = {}};

com.mnemis.wb.model.WBPageRecord = function(url, json)
{
    console.log("create page record");
    this.db = google.gears.factory.create('beta.database');
    console.log("DB created");
    this.db.open('uniboard');
    this.db.execute('create table if not exists pages' +
           ' (url text, uuid, data text)');
    this.db.execute('create table if not exists items' +
           ' (url text, uuid text, data text)');
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
    this.db.execute('delete  from items where url = "' + this.url + '"');
    var rs = this.db.execute('select * from pages where url = "' + this.url + '"');
    if (rs.isValidRow())
    {
        this.db.execute('update pages set data = ? where url = "' + this.url+ '"', [$.toJSON(this.json.data)]);
    }
    else
    {
        this.db.execute('insert into pages values (?, ?, ?)', [this.url, this.json.uuid, $.toJSON(this.json.data)]);
    }

    // now update items
    for (var i = 0; i < this.json.page_objects.length; i++)
    {
        anObject = this.json.page_objects[i];
        this.createOrUpdateItem(anObject);
    }
}

com.mnemis.wb.model.WBPageRecord.prototype.refreshFromDatabase = function()
{
    this.json = {};
    var rs = this.db.execute('select * from pages where url = "' + this.url + '"');
    if (rs.isValidRow()) {
        this.json.uuid = rs.field(1);
        this.json.data = $.evalJSON(rs.field(2));
    }
    rs.close();

    this.json.page_objects = [];
    rs = this.db.execute('select * from items where url = "' + this.url + '"');
    while (rs.isValidRow()) {
        this.json.page_objects.push($.evalJSON(rs.field(2)));
        rs.next();
    }
    rs.close();
}

com.mnemis.wb.model.WBPageRecord.prototype.json = function()
{
    return this.json;
}

com.mnemis.wb.model.WBPageRecord.prototype.createOrUpdateItem = function(itemData)
{
    console.log("update item " + itemData.uuid);
    rs = this.db.execute('select * from items where uuid = "' + itemData.uuid + '"');
    if (rs.isValidRow())
    {
        this.db.execute('update items set data = ? where uuid = "' + itemData.uuid+ '"', [$.toJSON(itemData)]);
    }
    else
    {
        this.db.execute('insert into items values (?, ?, ?)', [this.url, itemData.uuid, $.toJSON(itemData)]);
    }
}