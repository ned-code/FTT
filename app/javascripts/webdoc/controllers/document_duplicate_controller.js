/**
 * @author Noé
 */

WebDoc.DocumentDuplicateController = $.klass({
  initialize: function() {
    this.document = null;
    this.domNode = null;
    this._form = null;
    this._title = null;
    this._screenLayer = null;
  },

  showDialog: function(e, document) {
    this.document = document;

    if (this.domNode === null) {
      this._createDialog(e);
    }

    if (this._screenLayer === null) {
      this._createScreenLayer();
    }
    
    var that = this;
    this.domNode.pop({
      attachTo: $(e.currentTarget),
      initCallback: function(){
        that._title.focus();
        that._form.bind('submit', function(){
          that.domNode.hide();
          $('body').append(that._screenLayer);
          that._confirmDuplicate(that._title.val());
          return false;
        });
	  }
    });

  },

  _createDialog: function(e) {
    var label = $('<label/>', { 'class': 'underlay' }).text('Document title'),
        title = $('<input/>', { type: 'text', title: 'Document title', name: 'document-title', value: 'Copy of ' + this.document.data.title, autocomplete: 'off' }),
        cancel = $('<a/>', { 'href': '#cancel', 'class': 'cancel'}).text('Cancel'),
        button = $('<input/>', { 'type': 'submit', 'value': 'Duplicate document'});

    this._title = title;
    this._form = $('<form/>');
    this.domNode = $('<div/>').append(this._form.append(label).append(title).append(cancel).append(button));
  },

  _createScreenLayer: function() {
    this._screenLayer = $('<div/>')
            .addClass('screen layer loading loading-icon')
            .css('z-index', '3');
  },

  _confirmDuplicate: function(newTitle) {
    this.document.duplicate(newTitle);
  }
  
});