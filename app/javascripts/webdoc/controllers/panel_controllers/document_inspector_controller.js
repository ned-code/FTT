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
    documentSizeWidthField = jQuery('#document-size-width', inspector);
    documentSizeHeightField = jQuery('#document-size-height', inspector);
    currentDocument = WebDoc.application.pageEditor.currentDocument;
    
    form
    .bind('submit', function(e){
      e.preventDefault();
    })
    .delegate('#document-title', 'change', this._changeDocumentTitle)
    .delegate('#document-description', 'change', this._changeDocumentDescription)
    .delegate('#document-category', 'change', this._changeDocumentCategory)
    .delegate('#document-size-width', 'change', this._changeDocumentWidth)
    .delegate('#document-size-height', 'change', this._changeDocumentHeight)
    .delegate('#document-featured', 'change', this._changeDocumentFeatured);
    
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
    documentFeaturedField.val(currentDocument.featured());
    documentSizeWidthField.val(currentDocument.size().width);
    documentSizeHeightField.val(currentDocument.size().height);
    // Also update toolbar title field
    jQuery(".document-title").text(currentDocument.title());
  },
  
  _loadDocumentCategories: function() {
    var categories = WebDoc.DocumentCategoriesManager.getInstance().getAllCategories();    
    jQuery.each(categories, function(i, webDocCategory) {
      documentCategoryField.append(jQuery('<option>').attr("value", webDocCategory.uuid()).html(webDocCategory.data.name));
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
  
  _changeDocumentWidth: function() {
    currentDocument.setSize({ width: documentSizeWidthField.val(), height: currentDocument.size().height});
  },
  
  _changeDocumentHeight: function() {
      currentDocument.setSize({  width: currentDocument.size().width, height: documentSizeHeightField.val()});
  },
  
  objectChanged: function() {
    this._updateFields();
  }
});

})(jQuery);