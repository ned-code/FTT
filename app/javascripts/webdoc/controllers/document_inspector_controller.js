/**
 * @author David Matthey
 */

(function($, undefined){

 var documentTitleField,
     documentDescriptionField,
     documentCategoryField,
     currentDocument;
     
WebDoc.DocumentInspectorController = $.klass({
  initialize: function() {
    this.domNode = $('#document-inspector');
    documentTitleField = $("#document-title", this.domNode);
    documentDescriptionField = $("#document-description", this.domNode);
    documentCategoryField = $("#document-category", this.domNode)
    currentDocument = WebDoc.application.pageEditor.currentDocument;
    
    documentTitleField.bind("change", this._changeDocumentTitle);
    documentDescriptionField.bind("change", this._changeDocumentDescription);
    documentCategoryField.bind("change", this._changeDocumentCategory);
    
    currentDocument.addListener(this);
    
    this._loadDocumentCategories();
    this._updateFields();
  },
  
  _updateFields: function() {
    documentTitleField.val(currentDocument.title());
    documentDescriptionField.val(currentDocument.description());
    //documentCategoryField.val(currentDocument.category());
    
    // Also update toolbar title field
    $("#tb_1_document_title").text(currentDocument.title());
  },
  
  _loadDocumentCategories: function() {
    // TODO: refactorate this part so that the categories are loaded only once for the global application
    // Waiting for more specs about categories
    MTools.ServerManager.getRecords(WebDoc.Category, null, function(data)
    {
      if (data.length !== 0) {
        $.each(data, function(i, webDocCategory) {
          documentCategoryField.append($('<option>').attr("value", webDocCategory.data.id).html(webDocCategory.data.name));
        });
        documentCategoryField.val(currentDocument.category());
      }
    });
  },
  
  _changeDocumentTitle: function() {
    currentDocument.setTitle(documentTitleField.val());
  },
  
  _changeDocumentDescription: function() {
    currentDocument.setDescription(documentDescriptionField.val());
  },
  
  _changeDocumentCategory: function() {
    currentDocument.setCategory(documentCategoryField.val());
  },
  
  documentPropertiesChanged: function() {
    this._updateFields();
  }
});

})(jQuery);