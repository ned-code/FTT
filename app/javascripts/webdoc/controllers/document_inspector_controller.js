/**
 * @author David Matthey
 */

(function(jQuery, undefined){

 var documentTitleField,
     documentDescriptionField,
     documentCategoryField,
     currentDocument;
     
WebDoc.DocumentInspectorController = jQuery.klass({
  DOCUMENT_INSPECTOR_BUTTON_SELECTOR: "a[href='#document-inspector']",  
  
  initialize: function() {
    this.domNode = jQuery('#document-inspector');
    this.buttonSelector = this.DOCUMENT_INSPECTOR_BUTTON_SELECTOR;
    documentTitleField = jQuery("#document-title", this.domNode);
    documentDescriptionField = jQuery("#document-description", this.domNode);
    documentCategoryField = jQuery("#document-category", this.domNode)
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
    documentCategoryField.val(currentDocument.category());
    
    // Also update toolbar title field
    jQuery(".document-title").text(currentDocument.title());
  },
  
  _loadDocumentCategories: function() {
    if(WebDoc.application.categoriesController.documentCategories) {
      var categories = WebDoc.application.categoriesController.documentCategories;
      jQuery.each(categories, function(i, webDocCategory) {
        documentCategoryField.append(jQuery('<option>').attr("value", webDocCategory.data.id).html(webDocCategory.data.name));
      });
    }
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