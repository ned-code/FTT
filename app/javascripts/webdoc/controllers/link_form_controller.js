/**
 * @author noe
 */

WebDoc.LinkFormController = $.klass({
  
  initialize: function() {
    ddd('[LinkFormController] init');
    this.domNode = null;
    this._form = null;
    this._label = null;
    this._link = null;
  },

  showDialog: function(e, oldLink, callback) {
    ddd('[LinkFormController] show dialog');

    if (this.domNode === null) {
      this._createDialog(e);
    }
    this.domNode.delegate('input[name=radio_link]', 'change', this._refreshTypeFromRadio.pBind(this));


    this._refreshRadioFormType();
    if(oldLink) {
      this._link.attr('value', oldLink);
      this._refreshRadioFormType();
    }
    else {
      this._link.attr('value', '');
      this._refreshTypeFromRadio();
    }
    
    this.domNode.show();
    
    var that = this;
    this.domNode.pop({
      attachTo: $(e.currentTarget),
      initCallback: function(){
        that._link.focus();
        that._form.bind('submit', function(){
          that.domNode.hide();
          callback.call(that, that._link.val());
          return false;
        });
	    }
    });
  },

  _createDialog: function(e) {
    var labelWeb    = $('<label/>', {}).text('Web'),
        labelMail   = $('<label/>', {}).text('E-Mail'),
        labelWebdoc = $('<label/>', {}).text('Page'),
        cancel      = $('<a/>', { href: '#cancel', 'class': 'cancel'}).text('Cancel'),
        button      = $('<input/>', { type: 'submit', value: 'Ok'});

    this._label      = $('<label/>', { 'class': 'underlay' }).text('Link');
    this._link       = $('<input/>', { type: 'text', title: 'Link', name: 'link', value: '', autocomplete: 'off' });
    this._radioWeb    = $('<input/>', { type: 'radio', 'data-webdoc-link-type': 'web', name: 'radio_link', checked: 'checked' });
    this._radioMail   = $('<input/>', { type: 'radio', 'data-webdoc-link-type': 'mail', name: 'radio_link' });
    this._radioWebdoc = $('<input/>', { type: 'radio', 'data-webdoc-link-type': 'webdoc', name: 'radio_link' });
    this._form       = $('<form/>');
    this.domNode     = $('<div/>', { style: 'width: 200px;' })
            .append(this._form
              .append(this._label)
              .append(this._link)
              .append(this._radioWeb)
              .append(labelWeb)
              .append($('<div/>')
                .append(this._radioMail)
                .append(labelMail)
              )
              .append($('<div/>')
                .append(this._radioWebdoc)
                .append(labelWebdoc)
              )
              .append($('<div/>')
                .append(cancel)
                .append(button)
              )
            );

  },


  _refreshTypeFromRadio: function() {

    var type = $('input[name=radio_link]:checked').attr('data-webdoc-link-type');

    ddd('[LinkFormController] refresh type form radio with type '+type);

    switch(type) {
      case('mail'):
        this._label.text('Email');
        this._link.val('mailto:');
        break;
      case('webdoc'):
        this._label.text('Page');
        this._link.val('#');
        break;
      default: // + web type
        this._label.text('Link');
        this._link.val('http://');
        break;
    }

    this._link.focus();
  },

  _refreshRadioFormType: function() {
    if(this._link.val()[0] === '#') {
      this._radioWebdoc.attr('checked', 'checked');
    }
    else if(this._link.val().substring(0,7) === 'mailto:') {
      this._radioMail.attr('checked', 'checked');
    }
    else {
      this._radioWeb.attr('checked', 'checked');
    }
  }

});
