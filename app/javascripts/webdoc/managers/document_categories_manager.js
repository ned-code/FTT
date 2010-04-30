/**
 * @author david
 */

WebDoc.DocumentCategoriesManager = $.klass({
  initialize: function() {
    this._callBack = [];
    this._documentCategories = undefined;
    this._loadDocumentCategories();
  },   
  
  getAllCategories: function(callBack) {
    if (this._documentCategories) {
      callBack.call(this, this._documentCategories);
    }
    else {
      this._callBack.push(callBack);
    }
  },
  
  _loadDocumentCategories: function() {
    MTools.ServerManager.getRecords(WebDoc.Category, null, function(data)
    {
      if (data.length !== 0) {
        this._documentCategories = data;
        this._notifyCallBacks();
      }
    }.pBind(this));
  },
    
  _notifyCallBacks: function() {
    for (var i= 0; i < this._callBack.length; i++) {
      this._callBack[i].call(this, this._documentCategories);
    }
  }
});