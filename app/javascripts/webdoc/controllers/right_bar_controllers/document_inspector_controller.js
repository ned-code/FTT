/**
 * @author David Matthey
 */

(function(jQuery, undefined){

var inpsector,
    form,
    documentTitleField,
    documentDescriptionField,
    documentCategoryField,
    currentDocument;
    
WebDoc.DocumentInspectorController = jQuery.klass(WebDoc.RightBarInspectorController, {
  DOCUMENT_INSPECTOR_BUTTON_SELECTOR: "a[href='#document-inspector']",  
  
  initialize: function() {
    this.domNode = inspector = jQuery('#document-inspector');
    
    form = inspector.find('form.properties');
    documentTitleField = jQuery("#document-title", inspector);
    documentDescriptionField = jQuery("#document-description", inspector);
    documentCategoryField = jQuery("#document-category", inspector)
    currentDocument = WebDoc.application.pageEditor.currentDocument;
    
    form
    .bind('submit', function(e){
      e.preventDefault();
    })
    .delegate('#document-title', 'change', this._changeDocumentTitle)
    .delegate('#document-description', 'change', this._changeDocumentDescription)
    .delegate('#document-category', 'change', this._changeDocumentCategory);
    
    currentDocument.addListener(this);
    
    this._loadDocumentCategories();
    this._updateFields();
  },
  
  buttonSelector: function() {
    return this.DOCUMENT_INSPECTOR_BUTTON_SELECTOR;  
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