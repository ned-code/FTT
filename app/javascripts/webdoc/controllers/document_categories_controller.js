/**
 * @author david
 */

//= require <mtools/server_manager>
//= require <webdoc/model/category>

WebDoc.DocumentCategoriesController = $.klass({
  initialize: function() {
    this.listeners = [];
    this.loadDocumentCategories();
  },   
  
  loadDocumentCategories: function() {
    MTools.ServerManager.getRecords(WebDoc.Category, null, function(data)
    {
      if (data.length !== 0) {
        this.documentCategories = data;
        this._fireCategoriesLoaded();
      }
    }.pBind(this));
  },
  
  /**
    * Add a listener to be informed when the data are loaded.
    * @param {Object} listener waiting for a loading operation. Listener must implement categoriesLoaded function.
    */
   addListener: function(listener) {
     this.listeners.push(listener);
   },
   
   _fireCategoriesLoaded: function() {
     for (var i = 0; i < this.listeners.length; i++) {
       if (this.listeners[i].categoriesLoaded) {
         this.listeners[i].categoriesLoaded();
       }
     }
   }
});