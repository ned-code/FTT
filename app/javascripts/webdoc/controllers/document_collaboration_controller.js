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
    this.emailInvitationForm = new WebDoc.EmailInvitationController('collaborate_by_email_form');
    this.domNode = jQuery("#document_access_list");
    this.documentAccessDialog = jQuery("#invite_co_authors");
    this.chooseFriendsForm = jQuery("#collaborate_by_connection_form");
    this.byEmailForm = jQuery("#collaborate_by_email_form");
    
    this.chooseFriendsForm.bind( 'submit', this.sendInvitationsByFriends.pBind(this) );
    this.byEmailForm.bind( 'submit', this.sendInvitationsByEmail.pBind(this) );
    this.domNode.delegate("a[href='#delete']", "click", this.deleteAccess.pBind(this));
    jQuery('#collaborate_by_connection_link').bind('click', this.showConnectionsForm.pBind(this) );
    jQuery('#collaborate_by_email_link').bind('click', this.showEmailForm.pBind(this) );
    
    //this.documentAccessDialog
    //.remove()
    //.css({ display: '' });
  },
  
  showAccess: function(e, document) {
    var that = this;
    
    this.document = document;
    this.cleanInvitationFields();
    this.cleanFriendsList();
    // document access can be changed only when we are online. So we can do ajax request here
    jQuery.ajax({
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
  
  getDeleteAccess: function(userId, role) {
    var access_content = { role: role, user_id: userId };
    return { accesses : $.toJSON(access_content) }
  },
  
  loadAccess: function(json) {
    this.domNode.empty();
    this.access = json.access;
    var friendslist = [];
    var user;
    for (var i = 0; i < this.access.length; i++) {
      user = this.access[i][0];
      if (user.role === "editor" || user.role === "contributor" ) {
        friendslist.push(user.uuid);
        this.createAccessItem(user);
      }
    }
    
    this.friendsSelector.loadFriendList(friendslist);
  },
  
  createAccessItem: function(userInfos) {
      var accessEntry = $("<li>")
        .data('uuid', userInfos.uuid)
        .data('role', userInfos.role)
        .addClass("user_access")
        .html(userInfos.username + "(" + userInfos.email + ")" + "|" + userInfos.role);
    
      var deleteItem = $('<a/>', {'class': "delete", href: "#delete", title: "delete editor"}).html("Delete");
      if(userInfos.creator) { deleteItem.hide(); }  
      accessEntry.append(deleteItem);    
      this.domNode.append(accessEntry);
  },
  
  
  //TODO actually not supported, will be implemented at the same time that invitations
  sendInvitationsByEmail: function(e) {
    ddd('Send sendInvitationsByEmail');
    e.preventDefault();
    ddd('email list', this.emailInvitationForm.getEmailsList());
    
    var role_type = jQuery('input[name="role_type_email"]:checked').val()
    ddd(role_type);
    //this.createRightsToRecipients( this.getInvitationAccess(recipients, message) );
  },
  
  sendInvitationsByFriends: function(e) {
    e.preventDefault();
    var role_type = jQuery('input[name="role_type_friends"]:checked').val();
    var friendsList = this.friendsSelector.getFriendsSelected();
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
        this.loadAccess(data);
      }.pBind(this),
      error: function(MLHttpRequest, textStatus, errorThrown) {
        ddd("createFriendsRights error", textStatus);
      }
    });
  },
  
  
  //Todo manage the email form
  cleanInvitationFields: function() {
    jQuery("#wb-invitation-add-editors").val("");
    jQuery("#wb-invitation-add-editors-message").val("");
  },
  
  cleanFriendsList: function(){
    this.friendsSelector.cleanFriendsList();
  },
  
  toggleForm: function(e){
    e.preventDefault();
    this.byEmailForm.toggle();
    this.chooseFriendsForm.toggle();
  },
  
  showEmailForm: function(e){
    ddd('showEmailForm');
    e.preventDefault();
    this.chooseFriendsForm.hide();
    if(!this.emailInvitationForm.domBuilded){
      this.emailInvitationForm.buildDom();
    }
    this.byEmailForm.show();
  },
  
  showConnectionsForm: function(e){
    ddd('showConnectionsForm');
    e.preventDefault();
    this.chooseFriendsForm.show();
    this.byEmailForm.hide();
  },
  
  url: function(){
    return '/documents/' + this.document.uuid() + '/roles';
  }
});
