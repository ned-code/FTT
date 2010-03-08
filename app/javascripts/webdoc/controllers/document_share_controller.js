/**
 * @author david
 */
//= require <webdoc/model/document>

WebDoc.DocumentShareController = $.klass({
  
  initialize: function() {
    this.document = null;
    this.documentShareDialog = $("#wb-share-document-dialog");
    this.documentShareDialog.dialog(
    {
        bgiframe: true,
        autoOpen: false,
        height: 200,
        width: 330,
        modal: true,
        buttons: 
        {
            Cancel: this._closeDialog,
        }
    });
    this.shareDocRadio = $('#share_webdoc_radio');
    this.unshareDocRadio = $('#unshare_webdoc_radio'); 
    this.sharedDocUrlField = $('#shared_webdoc_url'); 
    this.shareDocRadio.bind('change', this._shareDocument.pBind(this));
    this.unshareDocRadio.bind('change', this._unshareDocument.pBind(this));
  },  
  
  showShare: function(document) {
    this.document = document;
    this._initFields();
    this.documentShareDialog.dialog('open');
  },
  
  _shareDocument: function() {
    this.document.share();
    this.document.save(function(persistedDoc) {
        WebDoc.application.documentEditor.filter.changeShareStatus(persistedDoc);
    });
    this.sharedDocUrlField.removeAttr('disabled');
  },
  
  _unshareDocument: function() {
    this.document.unshare();
    this.document.save(function(persistedDoc) {
        WebDoc.application.documentEditor.filter.changeShareStatus(persistedDoc);
    });
    this.sharedDocUrlField.attr('disabled', 'disabled');
  },
  
  _initFields: function() {
    if(this.document.isShared()) { 
      this.shareDocRadio.attr('checked', true); 
      this.sharedDocUrlField.removeAttr('disabled');
    }
    else { 
      this.unshareDocRadio.attr('checked', true); 

      this.sharedDocUrlField.attr('disabled', 'disabled');
    }
    this.sharedDocUrlField.val("http://" + window.location.host + "/documents/" + this.document.uuid() + "#1");
  },
  
  _closeDialog: function() {
    $(this).dialog('close');
  },
});