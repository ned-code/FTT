

WebDoc.PasteboardManager = $.klass(
{  
  initialize: function()    
  {
    this._pasteBoardContentType = null;
    this._pasteBoardContent = null;
  },
  
  isEmpty: function() {
    return (this._pasteBoardContent === null);
  },
  
  putIntoPasboard: function(type, anObject) {
    this._pasteBoardContentType = type;
    this._pasteBoardContent = anObject;
  },
  
  getFromPasteBoard: function(type) {
    if (this._pasteBoardContentType === type) {
      return this._pasteBoardContent;
    }
    return null;
  }
  
});
