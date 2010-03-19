/**
 * @author Julien Bachmann
 */
//= require <webdoc/model/document>

WebDoc.DocumentCollaborationController = $.klass({
  
  documentAccessDialog: null,
  documentShareTabs: null,
  
  initialize: function() {
    var self = this;
    
    this.roles = ["reader", "editor"];
    this.domNode = $("#document_access_list");
    this.documentAccessDialog = $("#wb-change-access-dialog");
    this.emailsNode = $('#wb-invitation-add-editors');
    this.failedEmailsWrapper = $('#wb-invitation-failed');
    
    $(".delete_access").live("click", this.deleteAccess.pBind(this));
    
    this._popSetupObj = {
      initCallback: function(){
        self.documentAccessDialog.bind( 'submit', self.sendInvitations.pBind(self) );
      }
    };
    
    this.documentAccessDialog
    .remove()
    .css({ display: '' });
  },
  
  showAccess: function(e, document) {
    this.document = document;
    this.cleanInvitationFields();

    // document access can be changed only when we are online. So we can do ajax request here
    $.ajax({
      url: "/documents/" + document.uuid() + "/roles",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        ddd("access", data);
        this._popSetupObj.attachTo = $( e.currentTarget );
        this.documentAccessDialog.pop( this._popSetupObj );
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
      url: "/documents/" + this.document.uuid() + "/roles",
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
    
    // TODO: instead of listing the emails again, take the successful ones out of the field, leaving the unsuccessful ones
    // Display the message - these didn't work - then give them a choice to send a sign up for webdoc email
    
    if(json.failed && json.failed.length > 0) {
      this.failedEmailsWrapper
      .empty()
      .append( $('<p/>').html('These people are not yet webdoc users!') )
      .show()
      // TODO: Flaky, do it better
      .parent()
      .addClass('error');
      
      var addresses = "";
      for (var i = 0; i < json.failed.length; i++) {
        addresses += json.failed[i];
        if(i !== json.failed.length -1) { addresses += "\n"; }
      }
      
      this.emailsNode.val( addresses );
      return false;
    }
    else { 
      this.failedEmailsWrapper.hide(); 
      this.cleanInvitationFields();
      return true;
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

  sendInvitations: function(e) {
    ddd('Send invitations');
    
    var recipients = $("#wb-invitation-add-editors").val();
    var message = $("#wb-invitation-add-editors-message").val();
    this.createRightsToRecipients( this.getInvitationAccess(recipients, message) );
    e.preventDefault();
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
      url: '/documents/' + this.document.uuid() + '/roles',
      type: 'POST',
      dataType: 'json',
      data: jSONData,    
      success: function(data) {
        this.loadAccess(data);
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
