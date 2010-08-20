/**
 * @author david
 */
//= require <webdoc/model/document>

WebDoc.DocumentShareController = $.klass({
  
  initialize: function() {
    this.document = null;
    
    //$(".delete_reader_role").live("click", this._deleteReaderRole.pBind(this));   
    
    this.friendsSelector = new WebDoc.FriendsSelectorController('share_webdoc');
    
    this.documentShareDialog = jQuery('#share_webdoc');
    this.documentShareForm = jQuery("#wd_share_form");
    
    this.yourConnectionsList = jQuery('#your_connections_list');
    this.onlyParticipantsRadio = jQuery("#only_participants_radio");
    this.yourConnectionsRadio = jQuery("#your_connections_radio");
    this.publicRadio = jQuery("#public_radio");
    this.publicUrlNode = jQuery('#share_public_url');
    this.shareAllowComments = jQuery('#share_allow_comments');
    this.allowCommentsCheckBox = jQuery('#allow_comments_checkbox');
    this.sharedDocUrl = jQuery('#share_public_url');
    this.sharedDocUrlField = jQuery('#shared_webdoc_url');
    this.sharedUsersList = $("#share_webdoc_users_list");
    
    this.onlyParticipantsRadio.bind('change', this._onlyParticipantsRadioChanged.pBind(this));
    this.publicRadio.bind('change', this._publicRadioChanged.pBind(this));
    this.yourConnectionsRadio.bind('change', this._connectionsRadioChanged.pBind(this));
    this.documentShareForm.bind( 'submit', this._submitForm.pBind(this) );
    this.documentShareDialog.delegate("a[href='#delete']", "click", this.deleteAccess.pBind(this));
    //I think the following is useless
    this.shareTabs = jQuery("#wb-document-share-tabs");
    this.shareTabs.tabs();
    
    this.shareDocRadio = jQuery('#share_webdoc_radio');
    this.unshareDocRadio = jQuery('#unshare_webdoc_radio'); 
    
    this.shareWithMembersTabs = jQuery('.unshare-related');
    
    // this.documentShareDialog
    // .remove()
    // .css({display: ''});
  },
  
  showShare: function(e, document) {
    var self = this;
    
    this.document = document;
    this.cleanFriendsList();
    
    jQuery.ajax({
      url: "/documents/" + document.uuid() + "/roles",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        this.documentShareDialog.show();
        // this.documentShareDialog.pop({
        //           attachTo: $(e.currentTarget),
        //           initCallback: function(){
        //             var node = $(this);
        //             
        //             self._initFields();
        //             
        //             self.shareNode.bind('change', function(e){
        //               self.documentShareDialog.removeClass("state-unshared");
        //             });
        //             self.unshareNode.bind('change', function(e){
        //               self.documentShareDialog.addClass("state-unshared");
        //             });
        //             self.sharedDocUrlField.bind('focus', function(e){
        //               $(this).select();
        //             });
        //             
        //             self.shareDocRadio.bind('change', self._shareDocument.pBind(self));
        //             self.unshareDocRadio.bind('change', self._unshareDocument.pBind(self));
        //             
        //             self.documentShareForm.bind('submit', function(e){
        //               self._sendInvitations(e);
        //               
        //               e.preventDefault();
        //             });
        //           }
        //         });
        
        this.loadAccess(data);
      }.pBind(this),
    
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);          
      }
    });
  },
  
  loadAccess: function(json) {
    
    ddd('load_Access');
    
    this.sharedUsersList.empty();
    
    //first we look if the document is public
    if(json.public){
      this.publicRadio.click();
      this.shareAllowComments.show();
      this._initAllowCommentsCheckBox(json.public);
      this._showPublicUrl();
      return;
    }
    
    //document not public, we look if it's share with connection
    var isShared = false;
    this.access = json.access;
    for (var i = 0; i < this.access.length; i++) {
      if(this.access[i][0].role == 'viewer_comment' || this.access[i][0].role == 'viewer_only'){
        if(!isShared){
          isShared = true;
          //we consider that all the user have the same role !!
          this._initAllowCommentsCheckBox(this.access[i][0].role);
        }
        this._createAccessItem(this.access[i][0]);
      }
    }
    
    if(isShared){
      this.yourConnectionsRadio.click();
      this.shareAllowComments.show();
      this.friendsSelector.loadFriendList();
    }
    else{
      //not public and not share to connections -> document not shared
      this.onlyParticipantsRadio.click();
      this.shareAllowComments.hide();
    }
  },
  
  _createAccessItem: function(userInfos) {
    if(userInfos.role === "viewer_comment" || userInfos.role === "viewer_only") {
      ddd(userInfos.uuid +", "+userInfos.role);
      var accessEntry = $("<li>")
        .attr({ id: userInfos.uuid})
        .addClass("user_access")
        .data('uuid', userInfos.uuid)
        .data('role', userInfos.role)
        .html(userInfos.username + "(" + userInfos.email + ")"+ "|" + userInfos.role);
      
      var deleteItem = $('<a/>', {'class': "delete", href: "#delete", title: "delete"}).html("Delete");
      if(userInfos.creator) { deleteItem.hide(); }  
      accessEntry.append(deleteItem);    
      this.sharedUsersList.append(accessEntry);   
    }
  },
  
  _submitForm: function(e){
    e.preventDefault();
    
    var role = 'viewer_only';
    var allowComments = false;
    if(this.onlyParticipantsRadio.attr('checked')){
      this.document.unshare();
    }
    else if(this.yourConnectionsRadio.attr('checked')){
      if(this._getAllowCommentsCheckBoxValue()){
        role = 'viewer_comment';
      }
      
      var friendsList = this.friendsSelector.getFriendsSelected();
      if(friendsList.length == 0){
        //TODO notify the user that there no user selected
        return;
      }
      this._createFriendsRights(friendsList,role);
    }
    else if(this.publicRadio.attr('checked')){
      if(this._getAllowCommentsCheckBoxValue()){
        allowComments = true;
      }
      //google analytics
      if (window._gaq) {
        _gaq.push(['_trackEvent', 'share', 'share_document', this.document.uuid()]);
      }
      this.document.share(allowComments);
    }
    else{
      ddd('no radio button checked !');
      return;
    }
  },
  
  _createFriendsRights: function(friendsList, role_type){
    var access_content = { role : role_type,
                           users : friendsList
                         };
    var url = '/documents/' + this.document.uuid() + '/roles';
    var jSONData = { accesses : access_content };
    WebDoc.ServerManager.request(url,function(data){
      this.friendsSelector.cleanFriendsList();
      this.loadAccess(data);
    }.pBind(this), 'POST', jSONData);
  },
  
  _sendInvitations: function(e) {
    var recipients = $("#wb-invitation-add-readers").val();
    var message = $("#wb-invitation-add-readers-message").val();
    this._createRightsToRecipients(this._getInvitationAccess(recipients, message));
    e.preventDefault();
  },
  
  _getInvitationAccess: function(recipients, message) {
    var accesses_readers = [];
    if( recipients !== "") {
      var recipients_emails = recipients.split(/[;,]/);
      for (var i = 0; i < recipients_emails.length; i++) {
        accesses_readers[i] = recipients_emails[i];
      }
    }
    if (window._gaq) {
      _gaq.push(['_trackEvent', 'share', 'coeditor_invite', this.document.uuid(), accesses_readers.length]);
    }
    var access_content = { role: "reader", recipients: accesses_readers, message: message };
    return { accesses : $.toJSON(access_content) };
  },
  
  _initAllowCommentsCheckBox:function(role){
    if(role == 'viewer_comment'){
      this.allowCommentsCheckBox.attr('checked', 1);
    }
    else{
      this.allowCommentsCheckBox.attr('checked', 0);
    }
  },
  
  cleanFriendsList: function(){
    this.friendsSelector.cleanFriendsList();
  },
  
  _getAllowCommentsCheckBoxValue:function(){
    return this.allowCommentsCheckBox.attr('checked');
  },
  
  deleteAccess: function(e) {
    e.preventDefault();
    var node = jQuery(e.target).parent();
    var userId = node.data('uuid');
    var role = node.data('role');
    var url = '/documents/' + this.document.uuid() + '/roles';
    jQuery.ajax({
      url: url,
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
  
  _cleanInvitationFields: function() {
    $("#wb-invitation-add-readers").val("");
    $("#wb-invitation-add-readers-message").val("");
  },
  
  _closeDialog: function() {
    $(this).dialog('close');
  },
  
  _onlyParticipantsRadioChanged: function(e){
    this.shareAllowComments.hide();
    this.yourConnectionsList.hide();
    this.sharedDocUrl.hide();
  },
  
  _publicRadioChanged: function(e){
    this.shareAllowComments.show();
    this.yourConnectionsList.hide();
    this._showPublicUrl();
  },
  
  _connectionsRadioChanged: function(e){
    this.shareAllowComments.show();
    this.yourConnectionsList.show();
    this.friendsSelector.loadFriendList();
    this.sharedDocUrl.hide();
  },
  
  _showPublicUrl: function(){
    this.sharedDocUrl.show();
    this.sharedDocUrlField.val('http://webdoc.com/' + this.document.uuid());
  }
});