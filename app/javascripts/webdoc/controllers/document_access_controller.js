/**
 * @author Julien Bachmann
 */
//= require <webdoc/model/document>

WebDoc.DocumentAccessController = $.klass({
  initialize: function() {
    this.roles = ["reader", "editor"];
    this.domNode = $("#document_access_list");
    //$("#add_access").click(this.addAccess.pBind(this));
    $(".delete_access").live("click", this.deleteAccess.pBind(this));    
    
    $("#wb-document-access-tabs").tabs( {
      select: this.changeActionsButtons.pBind(this),
    });
    
    $("#wb-change-access-dialog").dialog(
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
      $('#wb-change-access-dialog').dialog('option', 'buttons', { "Invite": this.applyInvitations.pBind(this), "Cancel":  this.closeDialog});
    }
    else {
      // Listing tab
      $('#wb-change-access-dialog').dialog('option', 'buttons', { "Apply": this.applyAccess.pBind(this), "Cancel":  this.closeDialog});
    }
  },
  
  // addAccess: function() {
  //   this.domNode.prepend(this.createAccessItem());      
  // },
  
  deleteAccess: function(e) {
    e.preventDefault();
    ddd("delete");
    $(e.target).parent().parent().remove();
  },
  
  showAccess: function(document) {
    this.document = document;
    $("#wb-invitation-add-editors").val("");
    $("#wb-invitation-add-readers").val("");
    $("#wb-invitation-add-editors-message").attr("disabled", "true");
    $("#wb-invitation-add-viewers-message").attr("disabled", "true");
    
    // document access can be change only when we are online. So we can do ajax request here
    $.ajax({
      url: "/documents/" + document.uuid() + "/accesses",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        ddd("access", data);
        $("#wb-change-access-dialog").dialog('option', 'title', 'Change access to document "' + document.title() + '"');
        $("#wb-change-access-dialog").dialog('open');
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
  },
  
  createAccessItem: function(userInfos) {
    ddd("Passage createAccessItem")
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
      if (userInfos.role === 'owner' && aRole === 'editor') { 
        roleItem.attr("selected", "true"); 
        rolesPopup.attr("disabled", "true");
      }
      rolesPopup.append(roleItem);      
    }
    accessActions.append($('<a href="#"/>').addClass("delete_access").attr("title", "Delete"));
    accessActions.append(rolesPopup);    
    result.append(accessActions);    
    return result;
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
  
  getInvitationAccess: function(editorRecipients, readerRecipients) {
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
    var access_content = { editors: accesses_editors, readers: accesses_readers};
    return { accesses : $.toJSON(access_content) };
  },
  
  applyAccess: function() {
    $.ajax({
      url: '/documents/' + this.document.uuid() + '/accesses',
      type: 'PUT',
      dataType: 'json',
      data: this.getAccess(),    
      success: function(data) {
        // $(this).dialog('close');
      },    
      error: function(MLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);
      }
    });    
  },
  
  applyInvitations: function() {
    var inviteAsEditorRecipients = $("#wb-invitation-add-editors").val();
    var inviteAsViewerRecipients = $("#wb-invitation-add-viewers").val();
    this.createRightsToRecipients(this.getInvitationAccess(inviteAsEditorRecipients, inviteAsViewerRecipients));
  },
  
  closeDialog: function() {
      $(this).dialog('close');
  },
  
  createRightsToRecipients: function(jSONData) {
    $.ajax({
      url: '/documents/' + this.document.uuid() + '/accesses',
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
      
});

$.extend(WebDoc.PageBrowserController, {});
