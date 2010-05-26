/**
 * @author david
 */

WebDoc.DocumentCategoriesManager = $.klass({
  initialize: function(callBack) {
    this._callBack = callBack;
    this._documentCategories = undefined;
    this._loadDocumentCategories();
  },   
  
  getAllCategories: function(callBack) {
    return this._documentCategories;
  },
  
  _loadDocumentCategories: function() {
    WebDoc.ServerManager.getRecords(WebDoc.Category, null, function(data)
    {
      if (data.length !== 0) {
        this._documentCategories = data;
        this._callBack.call(this, WebDoc.DocumentCategoriesManager);
      }
    }.pBind(this));
  }
});

$.extend(WebDoc.DocumentCategoriesManager, {  
  
  init: function(callBack) {
    if (!this._instance) {
      this._instance = new WebDoc.DocumentCategoriesManager(callBack);
    }  
    else {
      callBack.call(this, true);
    }
  },
  
  getInstance: function() {
    return this._instance;    
  }
});