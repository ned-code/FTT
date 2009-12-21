/**
 * ServerCache is responsible for caching records
 * Cache is a map with the following structure:
 * { 
 *  record_class : { 
 *                   record_uuid : record
 *                 }
 * }
 * Cache is used by the ServerManager to avoid fetching multiple times the same record. 
 * @author Julien Bachmann
 **/
MTools.ServerCache = $.klass(
{
    initialize: function()
    {
        ddd("Init server cache");
        this.stores = {};
    },
    
    /**
     * store a record in the cache. If record is already in the cache, cache is updated with the new version of the record
     * @param {Object} record
     */
    store: function(record) {
      var store = this.getStoreForRecordClass(record.constructor);
      store[record.uuid()] = record;
    },
    
    /**
     * Remove the record from the cache
     * @param {Object} record
     */
    invalidate: function(record) {
      var store = this.getStoreForRecordClass(record.constructor);
      delete store[record.uuid()];      
    },
    
    /**
     * Get a record from the cache based on a record class and uuid
     * @param {Object} recordClass the record class we want
     * @param {Object} uuid the uuidwe want
     * @return {Object} cached record or undefined if record with uuid is not in the cache
     */
    get: function(recordClass, uuid) {
      var store = this.getStoreForRecordClass(recordClass);
      var cachedRecord = store[uuid];
      return cachedRecord;      
    },
    
    /**
     * clear the cache
     */
    clear: function() {
      delete this.store;
      this.store = {};
    },
    
    /**
     * return  the cache used for a specified record class
     * @param {Object} recordClass the recordClass we want the cache
     */
    getStoreForRecordClass: function(recordClass) {
      var store = this.stores[recordClass]; 
      if (store === undefined) {
        store = {};
        this.stores[recordClass] = store;
      }
      return store;
    }
    
});