/**
 * @author Noé
 */

WebDoc.DocumentDuplicateController = $.klass({
  initialize: function() {
    this.document = null;
  },

  showDialog: function(e, document) {
    this.document = document;

    this._createDialog(e);
  },

  _createDialog: function(e) {
    ddd('create dialog for duplicate');

    var that = this;
    
    var node = $('<div/>');
    var form = $('<form/>');
    var cancel = $('<a/>').attr('href', '#cancel').addClass('cancel').text('Cancel');
    var button = $('<input/>').attr('type', 'submit').attr('value', 'Duplicate document');

    node.append(form.append(cancel).append(button));

    node.pop({
      attachTo: $(e.currentTarget),
      initCallback: function(){
        form.bind('submit', function(){
          that.confirmDuplicate();
          return false;
        });
	  }
    });

  },

  confirmDuplicate: function() {
    WebDoc.application.pageEditor.currentDocument.duplicate();
  }
  
});