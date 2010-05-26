/**
 * @author David Matthey
 */

(function(jQuery, undefined){

var inpsector,
    form,
    documentTitleField,
    documentDescriptionField,
    documentCategoryField,
	documentFeaturedField,
    currentDocument;
    
WebDoc.DocumentInspectorController = jQuery.klass(WebDoc.RightBarInspectorController, {
  DOCUMENT_INSPECTOR_BUTTON_SELECTOR: "a[href='#document-inspector']",  
  
  initialize: function() {
    this.domNode = inspector = jQuery('#document-inspector');
    
    form = inspector.find('form.properties');
    documentTitleField = jQuery("#document-title", inspector);
    documentDescriptionField = jQuery("#document-description", inspector);
    documentCategoryField = jQuery("#document-category", inspector);
    documentFeaturedField = jQuery("#document-featured", inspector);
    currentDocument = WebDoc.application.pageEditor.currentDocument;
    
    form
    .bind('submit', function(e){
      e.preventDefault();
    })
    .delegate('#document-title', 'change', this._changeDocumentTitle)
    .delegate('#document-description', 'change', this._changeDocumentDescription)
    .delegate('#document-category', 'change', this._changeDocumentCategory)
    .delegate('#document-featured', 'change', this._changeDocumentFeatured);
    
    currentDocument.addListener(this);
    
    WebDoc.application.categoriesManager.getAllCategories(this._loadDocumentCategories.pBind(this));
    this._updateFields();
  },
  
  buttonSelector: function() {
    return this.DOCUMENT_INSPECTOR_BUTTON_SELECTOR;  
  },
  
  _updateFields: function() {
    documentTitleField.val(currentDocument.title());
    documentDescriptionField.val(currentDocument.description());
    documentCategoryField.val(currentDocument.category());
    documentFeaturedField.val(currentDocument.featured());
    // Also update toolbar title field
    jQuery(".document-title").text(currentDocument.title());
  },
  
  _loadDocumentCategories: function(categories) {
      jQuery.each(categories, function(i, webDocCategory) {
        documentCategoryField.append(jQuery('<option>').attr("value", webDocCategory.data.id).html(webDocCategory.data.name));
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

  _changeDocumentFeatured: function() {
    currentDocument.setFeatured(documentFeaturedField.val());
  },
  
  objectChanged: function() {
    this._updateFields();
  }
});

})(jQuery);