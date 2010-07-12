/**
 * @author Julien Bachmann
 */

WebDoc.DocumentCategoriesManager = {
  _initialized: false,
  _documentCategories: undefined,
  init: function(callBack) {
    if (!this._initialized) {
      this._initialize(callBack);
    }  
    else {
      callBack.call(this, true);
    }
  },
  
  getInstance: function() {
    return this;    
  },
    
  getAllCategories: function(callBack) {
    return this._documentCategories;
  },
      
  _initialize: function(callBack) {
    this._callBack = callBack;
    if (this._documentCategories === undefined) {
      this._loadDocumentCategories();
    }
    else {
      this._callBack.call(this, WebDoc.DocumentCategoriesManager);            
    }
  },  
  
  _loadDocumentCategories: function() {
    WebDoc.ServerManager.getRecords(WebDoc.Category, null, function(data)
    {
      if (data.length !== 0) {
        this._documentCategories = data;
      }
      else {
        this._documentCategories = [];
      }
      this._callBack.call(this, WebDoc.DocumentCategoriesManager);                  
    }.pBind(this));
  }
};
