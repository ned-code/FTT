/**
 * @author david
 */
//= require <webdoc/model/document>

WebDoc.DocumentShareController = $.klass({
  
  initialize: function() {
    this.document = null;
    
    
    this.friendsSelector = new WebDoc.FriendsSelectorController('share_webdoc');
    this.emailInvitationForm = new WebDoc.EmailInvitationController('wd_email_share_form');
    
    this.shareDialog = jQuery('#share_webdoc');
    this.ShareForm = jQuery("#wd_share_form");
    this.emailShareForm = jQuery('#wd_email_share_form');
    
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
    this.ShareForm.bind( 'submit', this._submitForm.pBind(this) );
    this.emailShareForm.bind( 'submit', this._sendInvitations.pBind(this) );
    this.shareDialog.delegate("a[href='#delete']", "click", this.deleteAccess.pBind(this));
    this.shareDialog.find('.cancel').bind('click', this.close.pBind(this));
  },
  
  showShare: function(e, document) {
    var self = this;
    
    this.document = document;
    this.cleanFields();
    
    jQuery.ajax({
      url: "/documents/" + document.uuid() + "/roles",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        this.shareDialog.show();
        this.emailInvitationForm.init();
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
    if(json['public']){
      this.publicRadio.click();
      this.shareAllowComments.show();
      this._initAllowCommentsCheckBox(json['public']);
      this._showPublicUrl();
      return;
    }
    
    //document not public, we look if it's share with connection
    var isShared = false;
    this.access = json.access;
    var friends_access = [];
    for (var i = 0; i < this.access.length; i++) {
      if(this.access[i].role == 'viewer_comment' || this.access[i].role == 'viewer_only'){
        var userInfos = this.access[i];
        if(!isShared){
          isShared = true;
          //we consider that all the user have the same role !!
          this._initAllowCommentsCheckBox(userInfos.role);
        }
        friends_access.push(userInfos.uuid);
        this._createAccessItem(userInfos);
      }
    }
    
    //we also look if it's share with a list
    //UserList access
    this.listAccess = json.list_access;
    var lists = [];
    var list;
    for(var i = 0; i < this.listAccess.length; i++){
      list = this.listAccess[i];
      if (list.role === "viewer_comment" || list.role === "viewer_only" ) {
        if(!isShared){
          isShared = true;
          //we consider that all the user have the same role !!
          this._initAllowCommentsCheckBox(list.role);
        }
        lists.push(list);
      }
    }
        
    if(isShared){
      this.yourConnectionsRadio.click();
      this.shareAllowComments.show();
      this.friendsSelector.loadFriendList(friends_access);
      this.createListAccessItems(lists);
      this.yourConnectionsList.show();
    }
    else{
      //not public and not share to connections -> document not shared
      this.onlyParticipantsRadio.click();
      this.shareAllowComments.hide();
    }
  },
  
  createListAccessItems: function(lists){
    var accessEntry, deleteItem;
    for(var i=0; i< lists.length; i++){
      accessEntry = jQuery("<li>")
        .data('uuid', lists[i].uuid)
        .data('role', lists[i].role)
        .addClass("list_access")
        .html(lists[i].name + " | " + lists[i].role);
      deleteItem = $('<a/>', {'class': "delete", href: "#delete", title: "delete editor"}).html("Delete");
      accessEntry.append(deleteItem);    
      this.sharedUsersList.append(accessEntry);
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
      this.loadAccess(data);
    }.pBind(this), 'POST', jSONData);
  },
  
  _sendInvitations: function(e) {
    e.preventDefault();
    var role;
    if(this._getAllowCommentsCheckBoxValue()){
      role = 'viewer_comment';
    }
    else{
      role = 'viewer_only';
    }
    
    var invitations = { invitations : {
                            role : role,
                            emails : this.emailInvitationForm.getEmailsList(),
                            message : this.emailInvitationForm.getMessage(),
                            document_id: this.document.uuid()
                           }
                         };
                         
    var url = '/invitations/';
    WebDoc.ServerManager.request(url,function(data){
      ddd('email send with sucess');
    }.pBind(this), 'POST', invitations);
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
  
  cleanFields: function(){
    this.emailInvitationForm.cleanFields();
    this.friendsSelector.clean();
  },
    
  close: function(e){
    e.preventDefault();
    this.shareDialog.hide();
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
    this.friendsSelector.clean();
    this.sharedDocUrl.hide();
  },
  
  _showPublicUrl: function(){
    this.sharedDocUrl.show();
    this.sharedDocUrlField.val('http://webdoc.com/' + this.document.uuid());
  }
});