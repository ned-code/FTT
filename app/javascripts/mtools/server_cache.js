/**
 * ServerCache is responsible for caching records
 * 
 * @author Julien Bachmann
 **/
MTools.ServerCache = $.klass(
{
    initialize: function()
    {
        ddd("Init server cache");
        this.stores = {};
    },
    
    store: function(record) {
      var store = this.getStoreForrecordClass(record.constructor);
      store[record.uuid()] = record;
    },
    
    invalidate: function(record) {
      var store = this.getStoreForrecordClass(record.constructor);
      delete store[record.uuid()];      
    },
    
    get: function(recordClass, uuid) {
      var store = this.getStoreForrecordClass(recordClass);
      var cachedRecord = store[uuid];
      return cachedRecord;      
    },
    
    clear: function() {
      delete this.store;
      this.store = {};
    },
    
    getStoreForrecordClass: function(record) {
      var store = this.stores[record.constructor]; 
      if (store === undefined) {
        store = {};
        this.stores[record.constructor] = store;
      }
      return store;
    }
    
});