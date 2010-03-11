/**
 * @author Julien Bachmann
 */
//= require <webdoc/model/document>

WebDoc.DocumentCollaborationController = $.klass({
  
  documentAccessDialog: null,
  documentAccessTabs: null,
  documentShareTabs: null,
  
  initialize: function() {
    this.roles = ["reader", "editor"];
    this.domNode = $("#document_access_list");
    $(".delete_access").live("click", this.deleteAccess.pBind(this));    
    documentAccessTabs = $("#wb-document-collaborate-tabs");
    documentAccessDialog = $("#wb-change-access-dialog");
    documentAccessTabs.tabs( {
      select: this.changeActionsButtons.pBind(this),
    });
    
    documentAccessDialog.dialog(
    {
        bgiframe: true,
        autoOpen: false,
        height: 400,
        width: 440,
        modal: true,
        buttons: 
        {
            Send: this.sendInvitations.pBind(this),
            Cancel: this.closeDialog,
        }
    });
  },
  
  changeActionsButtons: function(event, ui) {
    // Change buttons and actions dynamically
    if( ui.index === 0 ) {
      // Invitation tab
      documentAccessDialog.dialog('option', 'buttons', { "Send": this.sendInvitations.pBind(this), "Cancel":  this.closeDialog});
    }
    else {
      // Listing tab
      documentAccessDialog.dialog('option', 'buttons', { "Cancel":  this.closeDialog});
    }
  },
  
  showAccess: function(document) {
    this.document = document;
    this.cleanInvitationFields();

    // document access can be changed only when we are online. So we can do ajax request here
    $.ajax({
      url: "/documents/" + document.uuid() + "/document_roles",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        ddd("access", data);
        documentAccessDialog.dialog('option', 'title', 'Invite co-editors on "' + document.title() + '"');
        documentAccessDialog.dialog('open');
        this.loadAccess(data);
      }.pBind(this),
    
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);          
      }
    });
  },
  
  deleteAccess: function(e) {
    e.preventDefault();
    var userId = $(e.target).parent().attr("id");
    ddd("delete editor role for: "+userId);
    $.ajax({
      url: "/documents/" + this.document.uuid() + "/document_roles",
      type: 'DELETE',
      dataType: 'json',    
      data: this.getDeleteAccess(userId),             
      success: function(data, textStatus) {
        $(e.target).parent().remove();
      }.pBind(this),
    
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);          
      }
    });
  },  
  
  loadAccess: function(json) {
    this.domNode.empty();
    this.access = json.access;
    for (var i = 0; i < this.access.length; i++) {
      this.createAccessItem(this.access[i][0]);     
    }
    var failedEmailsWrapper = $('#wb-invitation-failed');
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
      this.cleanInvitationFields();
    }
  },
  
  createAccessItem: function(userInfos) {
    if (userInfos.role === "editor" ) {
      ddd(userInfos.id +", "+userInfos.role);
      var accessEntry = $("<li>").attr({ id: userInfos.id}).addClass("user_access").html(userInfos.username + "(" + userInfos.email + ")");
    
      var deleteItem = $('<a href="#"/>').addClass("delete_access").attr("title", "Delete").html("Delete");
      if(userInfos.creator) { deleteItem.hide(); }  
      accessEntry.append(deleteItem);    
      this.domNode.append(accessEntry);
    }
  },

  sendInvitations: function() {
    var recipients = $("#wb-invitation-add-editors").val();
    var message = $("#wb-invitation-add-editors-message").val();
    this.createRightsToRecipients(this.getInvitationAccess(recipients, message));
  },
  
  getDeleteAccess: function(userId) {
    var access_content = { role: "editor", user_id: userId };
    return { accesses : $.toJSON(access_content) }
  },
  
  getInvitationAccess: function(recipients, message) {
    var accesses_editors = [];
    if( recipients !== "") {
      var recipients_emails = recipients.split(/[;,]/);
      for (var i = 0; i < recipients_emails.length; i++) {
        accesses_editors[i] = recipients_emails[i];
      }
    }
    var access_content = { role: "editor", recipients: accesses_editors, message: message };
    return { accesses : $.toJSON(access_content) };
  },
  
  createRightsToRecipients: function(jSONData) {
    $.ajax({
      url: '/documents/' + this.document.uuid() + '/document_roles',
      type: 'POST',
      dataType: 'json',
      data: jSONData,    
      success: function(data) {
        this.loadAccess(data);
        documentAccessTabs.tabs('select', 1);
      }.pBind(this),    
      error: function(MLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);
      }
    });
  },  
  
  cleanInvitationFields: function() {
    $("#wb-invitation-add-editors").val("");
    $("#wb-invitation-add-editors-message").val("");
  },
  
  closeDialog: function() {
      $(this).dialog('close');
  }
});
