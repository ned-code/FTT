/**
 * @author david
 */
//= require <webdoc/model/document>

WebDoc.DocumentShareController = $.klass({
  
  initialize: function() {
    this.document = null;
    
    
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
    var friends_access = [];
    for (var i = 0; i < this.access.length; i++) {
      if(this.access[i][0].role == 'viewer_comment' || this.access[i][0].role == 'viewer_only'){
        var userInfos = this.access[i][0];
        if(!isShared){
          isShared = true;
          //we consider that all the user have the same role !!
          this._initAllowCommentsCheckBox(userInfos.role);
        }
        friends_access.push(userInfos.uuid);
        this._createAccessItem(userInfos);
      }
    }
    
    if(isShared){
      this.yourConnectionsRadio.click();
      this.shareAllowComments.show();
      this.friendsSelector.loadFriendList(friends_access);
      this.yourConnectionsList.show();
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
      ddd('friendsList',friendsList);
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
      ddd('no radio button checked !')
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
      //this.friendsSelector.cleanFriendsList();
      this.loadAccess(data);
    }.pBind(this), 'POST', jSONData);
  },
  
  //Todo for email invitations
  _sendInvitations: function(e) {
    var recipients = $("#wb-invitation-add-readers").val();
    var message = $("#wb-invitation-add-readers-message").val();
    this._createRightsToRecipients(this._getInvitationAccess(recipients, message));
    e.preventDefault();
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
  
  //TODO for mail invitation
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
    this.friendsSelector.loadFriendList([]);
    this.friendsSelector.cleanFriendsList();
    this.sharedDocUrl.hide();
  },
  
  _showPublicUrl: function(){
    this.sharedDocUrl.show();
    this.sharedDocUrlField.val('http://webdoc.com/' + this.document.uuid());
  }
});