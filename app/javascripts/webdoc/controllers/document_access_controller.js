/**
 * @author Julien Bachmann
 */
//= require <webdoc/model/document>

WebDoc.DocumentAccessController = $.klass({
  
  documentAccessDialog: null,
  documentAccessTabs: null,
  
  initialize: function() {
    this.roles = ["reader", "editor"];
    this.domNode = $("#document_access_list");
    $(".delete_access").live("click", this.deleteAccess.pBind(this));    
    documentAccessTabs = $("#wb-document-access-tabs");
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
            Invite: this.applyInvitations.pBind(this),
            Cancel: this.closeDialog,
        }
    });
  },
  
  changeActionsButtons: function(event, ui) {
    // Change buttons and actions dynamically
    if( ui.index === 0 ) {
      // Invitation tab
      documentAccessDialog.dialog('option', 'buttons', { "Invite": this.applyInvitations.pBind(this), "Cancel":  this.closeDialog});
    }
    else {
      // Listing tab
      documentAccessDialog.dialog('option', 'buttons', { "Apply": this.applyAccess.pBind(this), "Cancel":  this.closeDialog});
    }
  },
  
  deleteAccess: function(e) {
    e.preventDefault();
    ddd("delete");
    $(e.target).parent().parent().remove();
  },
  
  showAccess: function(document) {
    this.document = document;
    $("#wb-invitation-add-editors").val("");
    $("#wb-invitation-add-readers").val("");
    $("#wb-invitation-add-editors-message").val("");
    $("#wb-invitation-add-viewers-message").val("");
    
    // document access can be changed only when we are online. So we can do ajax request here
    $.ajax({
      url: "/documents/" + document.uuid() + "/accesses",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        ddd("access", data);
        documentAccessDialog.dialog('option', 'title', 'Collaborate on "' + document.title() + '"');
        documentAccessDialog.dialog('open');
        this.loadAccess(data);
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
      var accessEntry = this.createAccessItem(this.access[i][0]);
      this.domNode.append(accessEntry);      
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
      $('#document_access_list').before(failedEmailsWrapper);
    }
    else { 
      failedEmailsWrapper.hide(); 
      this.cleanInvitationFields();
    }
  },
  
  createAccessItem: function(userInfos) {
    ddd(userInfos.id +", "+userInfos.role);
    var result = null;
    result = $("<div/>").attr({ id: userInfos.id}).addClass("user_access");
    result.append($('<div/>').addClass("user_email").text(userInfos.username).data('user_id', userInfos.id));
      
    var accessActions = $('<div id="access_actions"/>');
    var rolesPopup = $('<select id="user_role"/>').addClass("user_role");   

    for (var i = 0; i < this.roles.length; i++) {
      var aRole = this.roles[i];
      var roleItem = $('<option/>').attr("value", aRole).text(aRole);    
      if (userInfos.role == aRole) { roleItem.attr("selected", "true"); } 
      rolesPopup.append(roleItem);      
    }
    var deleteItem = $('<a href="#"/>').addClass("delete_access").attr("title", "Delete");
    if(userInfos.creator) {
      rolesPopup.attr("disabled", "true");
      deleteItem.hide();
    }
    accessActions.append(deleteItem);
    accessActions.append(rolesPopup);    
    result.append(accessActions);    
    return result;
  },

  applyInvitations: function() {
    var inviteAsEditorRecipients = $("#wb-invitation-add-editors").val();
    var inviteAsViewerRecipients = $("#wb-invitation-add-viewers").val();
    var invitationEditorsMessage = $("#wb-invitation-add-editors-message").val();
    var invitationReadersMessage = $("#wb-invitation-add-viewers-message").val();
    this.createRightsToRecipients(this.getInvitationAccess(inviteAsEditorRecipients, inviteAsViewerRecipients, invitationEditorsMessage, invitationReadersMessage));
  },
  
  getAccess: function() {
    var accesses_editors = [];
    var accesses_readers = [];
    var allAccess = $(".user_access");
    var role = "";
    var indexEditor = 0;
    var indexReader = 0;
    for (var i = 0; i < allAccess.length; i++) {
      var anAccess = $(allAccess[i]);   
      var emailNode = anAccess.find(".user_email");
      role = this.roles[anAccess.find(".user_role")[0].selectedIndex];
      if(role === "reader") {
        accesses_readers[indexReader] = emailNode.data('user_id');
        indexReader++;
      }
      else if(role == "editor") {
        accesses_editors[indexEditor] = emailNode.data('user_id');
        indexEditor++;
      }
    }
    ddd("Editors: " + accesses_editors);
    ddd("Readers: " + accesses_readers);
    var access_content = { editors: accesses_editors, readers: accesses_readers};
    
    return { accesses : $.toJSON(access_content) };
  },
  
  getInvitationAccess: function(editorRecipients, readerRecipients, messageForEditors, messageForReaders) {
    var accesses_editors = [];
    var accesses_readers = [];
    if( editorRecipients !== "") {
      var recipients = editorRecipients.split(';');
      for (var i = 0; i < recipients.length; i++) {
        accesses_editors[i] = recipients[i];
      }
    }
    if( readerRecipients !== "" ) {
      var recipients = readerRecipients.split(';');
      for (var i = 0; i < recipients.length; i++) {
        accesses_readers[i] = recipients[i];
      }
    }
    var access_content = { editors: accesses_editors, readers: accesses_readers, editorsMessage: messageForEditors, readersMessage: messageForReaders };
    return { accesses : $.toJSON(access_content) };
  },
  
  applyAccess: function() {
    $.ajax({
      url: '/documents/' + this.document.uuid() + '/accesses',
      type: 'PUT',
      dataType: 'json',
      data: this.getAccess(),    
      success: function(data) {
        documentAccessDialog.dialog('close');
      },    
      error: function(MLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);
      }
    });    
  },
  
  createRightsToRecipients: function(jSONData) {
    $.ajax({
      url: '/documents/' + this.document.uuid() + '/accesses',
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
    $("#wb-invitation-add-viewers").val("");
    $("#wb-invitation-add-editors-message").val("");
    $("#wb-invitation-add-viewers-message").val("");
  },
  
  closeDialog: function() {
      $(this).dialog('close');
  },
      
});
