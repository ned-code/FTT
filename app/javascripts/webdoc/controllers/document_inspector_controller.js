/**
 * @author David Matthey
 */

(function($, undefined){

 var documentTitleField,
     documentDescriptionField,
     documentKeywordsField,
     currentDocument;
     
WebDoc.DocumentInspectorController = $.klass({
  initialize: function() {
    
    documentTitleField = $("#document-title");
    documentDescriptionField = $("#document-description");
    documentKeywordsField = $("#document-keywords");
    currentDocument = WebDoc.application.pageEditor.currentDocument;
    
    documentTitleField.bind("change", this._changeDocumentTitle);
    documentDescriptionField.bind("change", this._changeDocumentDescription);
    documentKeywordsField.bind("change", this._changeDocumentKeywords);
    
    currentDocument.addListener(this);
    
    this._updateFields();
    this.domNode = $('#document-inspector');
  },
  
  _updateFields: function() {
    documentTitleField.val(currentDocument.title());
    documentDescriptionField.val(currentDocument.description());
    documentKeywordsField.val(currentDocument.keywords());
    
    // Also update toolbar title field
    $("#tb_1_document_title").text(currentDocument.title());
  },
  
  _changeDocumentTitle: function() {
    currentDocument.setTitle(documentTitleField.val());
  },
  
  _changeDocumentDescription: function() {
    currentDocument.setDescription(documentDescriptionField.val());
  },
  
  _changeDocumentKeywords: function() {
    currentDocument.setKeywords(documentKeywordsField.val());
  },
  
  documentPropertiesChanged: function() {
    this._updateFields();
  }
  
});

})(jQuery);