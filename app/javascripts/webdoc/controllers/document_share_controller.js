/**
 * @author david
 */
//= require <webdoc/model/document>

WebDoc.DocumentShareController = $.klass({
  
  initialize: function() {
    this.document = null;
    this.domNode = $("#document_readers_list");
    $(".delete_reader_role").live("click", this._deleteReaderRole.pBind(this));   
    this.documentShareDialog = $("#wb-share-document-dialog");
    this.documentShareDialog.dialog(
    {
        bgiframe: true,
        autoOpen: false,
        height: 500,
        width: 400,
        modal: true,
        buttons: 
        {
            Cancel: this._closeDialog,
        }
    });
    this.shareTabs = $("#wb-document-share-tabs");
    this.shareTabs.tabs();
    
    this.shareDocRadio = $('#share_webdoc_radio');
    this.unshareDocRadio = $('#unshare_webdoc_radio'); 
    this.sharedDocUrlField = $('#shared_webdoc_url'); 
    this.shareWithMembersTabs = $('.unshare-related');
    this.shareDocRadio.bind('change', this._shareDocument.pBind(this));
    this.unshareDocRadio.bind('change', this._unshareDocument.pBind(this));
  },  
  
  _changeActionsButtons: function(showSend) {
    // Change buttons and actions dynamically
    if(showSend) {
      // Invitation tab
      this.documentShareDialog.dialog('option', 'buttons', { "Send": this._sendInvitations.pBind(this), "Cancel":  this._closeDialog});
    }
    else {
      // Listing tab
      this.documentShareDialog.dialog('option', 'buttons', { "Cancel":  this._closeDialog});
    }
  },
  
  
  showShare: function(document) {
    this.document = document;
    this._initFields();
    
    $.ajax({
      url: "/documents/" + document.uuid() + "/document_roles",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        this.documentShareDialog.dialog('open');
        this._loadAccess(data);
      }.pBind(this),
    
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);          
      }
    });
  },
  
  _loadAccess: function(json) {
    this.domNode.empty();
    this.access = json.access;
    for (var i = 0; i < this.access.length; i++) {
      this._createAccessItem(this.access[i][0]);  
    }
    var failedEmailsWrapper = $('#wb-readers-invitation-failed');
    if(json.failed && json.failed.length > 0) {
      failedEmailsWrapper.empty();
      failedEmailsWrapper.append($('<p>').html('The following addresses were not found in the system'));
      var addresses = "";
      for (var i = 0; i < json.failed.length; i++) {
        addresses += json.failed[i];
        if(i !== json.failed.length -1) { addresses += ", "; }
      }
      failedEmailsWrapper.append($('<p>').html(addresses));
      failedEmailsWrapper.show();
      this.domNode.before(failedEmailsWrapper);
    }
    else { 
      failedEmailsWrapper.hide(); 
      this._cleanInvitationFields();
    }
    // Check if must enable or not readers list tab
    var nbReadersListed = this.domNode.children().length;
    nbReadersListed>0? this.shareTabs.tabs('enable', 1) : this.shareTabs.tabs('disable', 1);
  },
  
  _createAccessItem: function(userInfos) {
    if(userInfos.role === "reader") {
      ddd(userInfos.id +", "+userInfos.role);
      var accessEntry = $("<li>").attr({ id: userInfos.id}).addClass("user_access").html(userInfos.username + "(" + userInfos.email + ")");
    
      var deleteItem = $('<a href="#"/>').addClass("delete_reader_role").attr("title", "Delete").html("Delete");
      if(userInfos.creator) { deleteItem.hide(); }  
      accessEntry.append(deleteItem);    
      this.domNode.append(accessEntry);   
    }
  },
  
  _sendInvitations: function() {
    var recipients = $("#wb-invitation-add-readers").val();
    var message = $("#wb-invitation-add-readers-message").val();
    this._createRightsToRecipients(this._getInvitationAccess(recipients, message));
  },
  
  _getInvitationAccess: function(recipients, message) {
    var accesses_readers = [];
    if( recipients !== "") {
      var recipients_emails = recipients.split(/[;,]/);
      for (var i = 0; i < recipients_emails.length; i++) {
        accesses_readers[i] = recipients_emails[i];
      }
    }
    var access_content = { role: "reader", recipients: accesses_readers, message: message };
    return { accesses : $.toJSON(access_content) };
  },
  
  _shareDocument: function() {
    this.document.share();
    this.document.save(function(persistedDoc) {
        WebDoc.application.documentEditor.filter.changeShareStatus(persistedDoc);
    });
    this.sharedDocUrlField.removeAttr('disabled');
    this.shareWithMembersTabs.hide();
    this._changeActionsButtons(false);
  },
  
  _unshareDocument: function() {
    this.document.unshare();
    this.document.save(function(persistedDoc) {
        WebDoc.application.documentEditor.filter.changeShareStatus(persistedDoc);
    });
    this.sharedDocUrlField.attr('disabled', 'disabled');
    this.shareWithMembersTabs.show();
    this._changeActionsButtons(true);
  },
  
  _initFields: function() {
    if(this.document.isShared()) { 
      this.shareDocRadio.attr('checked', true); 
      this.sharedDocUrlField.removeAttr('disabled');
      //this.shareTabs.tabs('disable', 1);
      this.shareWithMembersTabs.hide();
      this._changeActionsButtons(false);
    }
    else { 
      this.unshareDocRadio.attr('checked', true); 
      this.sharedDocUrlField.attr('disabled', 'disabled');
      //this.shareTabs.tabs('enable', 1);
      this.shareWithMembersTabs.show();
      this._changeActionsButtons(true);
    }
    this.sharedDocUrlField.val("http://" + window.location.host + "/documents/" + this.document.uuid() + "#1");
  },
  
  _createRightsToRecipients: function(jSONData) {
    $.ajax({
      url: '/documents/' + this.document.uuid() + '/document_roles',
      type: 'POST',
      dataType: 'json',
      data: jSONData,    
      success: function(data) {
        this._loadAccess(data);
        this.shareTabs.tabs('select', 1);
      }.pBind(this),    
      error: function(MLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);
      }
    });
  },  
  
  _deleteReaderRole: function(e) {
     e.preventDefault();
     var userId = $(e.target).parent().attr("id");
     ddd("delete reader role for: "+userId);
     $.ajax({
       url: "/documents/" + this.document.uuid() + "/document_roles",
       type: 'DELETE',
       dataType: 'json',    
       data: this._getDeleteAccess(userId),             
       success: function(data, textStatus) {
         $(e.target).parent().remove();
       }.pBind(this),

       error: function(XMLHttpRequest, textStatus, errorThrown) {
         ddd("error", textStatus);          
       }
     });
   },
   
   _getDeleteAccess: function(userId) {
      var access_content = { role: "reader", user_id: userId };
      return { accesses : $.toJSON(access_content) }
    },
  
  _cleanInvitationFields: function() {
    $("#wb-invitation-add-readers").val("");
    $("#wb-invitation-add-readers-message").val("");
  },
  
  _closeDialog: function() {
    $(this).dialog('close');
  },
});