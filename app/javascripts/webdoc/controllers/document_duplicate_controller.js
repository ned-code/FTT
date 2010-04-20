/**
 * @author Noé
 */

WebDoc.DocumentDuplicateController = $.klass({
  initialize: function() {
    this.document = null;
    this.dialog = null;

    

  },

  showDialog: function(e, document) {
    this.document = document;
    // WebDoc.application.pageEditor.currentDocument.duplicate();
  }
  
});