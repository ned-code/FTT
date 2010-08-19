/**
 * @author Julien Bachmann
 */
//= require <webdoc/model/document>

WebDoc.DocumentCollaborationController = $.klass({
  
  documentAccessDialog: null,
  documentShareTabs: null,
  
  initialize: function() {
    var self = this;
    
    this.friendsSelector = new WebDoc.FriendsSelectorController('invite_co_authors');
    this.domNode = $("#document_access_list");
    this.documentAccessDialog = $("#invite_co_authors");
    this.chooseFriendsForm = $("#collaborate_by_connection_form");
    this.byEmailForm = $("#collaborate_by_email_form");
    this.emailsNode = $('#wb-invitation-add-editors');
    this.failedEmailsWrapper = $('#wb-invitation-failed');
    
    this.chooseFriendsForm.bind( 'submit', this.sendInvitationsByFriends.pBind(this) );
    this.byEmailForm.bind( 'submit', this.sendInvitationsByEmail.pBind(this) );
    this.domNode.delegate("a[href='#delete']", "click", this.deleteAccess.pBind(this));
    jQuery('.collaborate_form').bind('click', this.toggleForm.pBind(this) );
    
    this.documentAccessDialog
    //.remove()
    //.css({ display: '' });
  },
  
  showAccess: function(e, document) {
    var that = this;
    
    this.document = document;
    this.cleanInvitationFields();
    this.cleanFriendsList();
    // document access can be changed only when we are online. So we can do ajax request here
    $.ajax({
      url: this.url(),
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        ddd("access", data);
        this.documentAccessDialog.show();
        
        // this.documentAccessDialog.pop({
        //   attachTo: $( e.currentTarget ),
        //   initCallback: function(){
        //     that.documentAccessForm
        //     .bind( 'submit', that.sendInvitations.pBind(that) );
        //     that.domNode.delegate("a[href='#delete']", "click", that.deleteAccess.pBind(that));
        //   }
        // });
        this.friendsSelector.loadFriendList();
        this.loadAccess(data);
      }.pBind(this),
      
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);          
      }
    });
  },
  
  deleteAccess: function(e) {
    e.preventDefault();
    var node = jQuery(e.target).parent();
    var userId = node.data('uuid');
    var role = node.data('role');
    $.ajax({
      url: this.url(),
      type: 'DELETE',
      dataType: 'json',    
      data: this.getDeleteAccess(userId, role),             
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
    if (userInfos.role === "editor" || userInfos.role === "contributor" ) {
      ddd(userInfos.id +", "+userInfos.role);
      var accessEntry = $("<li>")
        .data('uuid', userInfos.uuid)
        .data('role', userInfos.role)
        .addClass("user_access")
        .html(userInfos.username + "(" + userInfos.email + ")" + "|" + userInfos.role);
    
      var deleteItem = $('<a/>', {'class': "delete", href: "#delete", title: "delete editor"}).html("Delete");
      if(userInfos.creator) { deleteItem.hide(); }  
      accessEntry.append(deleteItem);    
      this.domNode.append(accessEntry);
    }
  },

  sendInvitationsByEmail: function(e) {
    ddd('Send sendInvitationsByEmail');
    e.preventDefault();
    var recipients = $("#wb-invitation-add-editors").val();
    var message = $("#wb-invitation-add-editors-message").val();
    
    var role_type = jQuery('input[name="role_type_email"]:checked').val()
    
    this.createRightsToRecipients( this.getInvitationAccess(recipients, message) );
  },
  
  sendInvitationsByFriends: function(e) {
    e.preventDefault();
    var role_type = jQuery('input[name="role_type_friends"]:checked').val();
    var friendsList = this.friendsSelector.friendsSelected();
    this.createFriendsRights(friendsList, role_type)
  },
  
  createFriendsRights: function(friendsList, role_type){
    var access_content = { role : role_type,
                           users : friendsList
                         };
    var jSONData = { accesses : access_content };
    
    $.ajax({
      url: this.url(),
      type: 'POST',
      dataType: 'json',
      data: jSONData,    
      success: function(data) {
        ddd('createFriendsRights success');
        this.cleanFriendsList();
        this.loadAccess(data);
      }.pBind(this),    
      error: function(MLHttpRequest, textStatus, errorThrown) {
        ddd("createFriendsRights error", textStatus);
      }
    });
  },
  
  getDeleteAccess: function(userId, role) {
    var access_content = { role: role, user_id: userId };
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
    if (window._gaq) {
      _gaq.push(['_trackEvent', 'share', 'coeditor_invite', this.document.uuid(), accesses_editors.length]);
    }      
    var access_content = { role: "editor", recipients: accesses_editors, message: message };
    return { accesses : $.toJSON(access_content) };
  },
  
  createRightsToRecipients: function(jSONData) {
    $.ajax({
      url: this.url(),
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
  
  cleanFriendsList: function(){
    this.friendsSelector.cleanFriendsList();
  },
  
  closeDialog: function() {
      $(this).dialog('close');
  },
  
  toggleForm: function(e){
    e.preventDefault();
    this.byEmailForm.toggle();
    this.chooseFriendsForm.toggle();
  },
  
  url: function(){
    return '/documents/' + this.document.uuid() + '/roles';
  }
});
