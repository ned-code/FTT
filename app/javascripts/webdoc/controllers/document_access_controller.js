/**
 * @author Julien Bachmann
 */
//= require <webdoc/model/document>

WebDoc.DocumentAccessController = $.klass({
  initialize: function() {
    ddd("init document access controller");
    this.roles = ["reader", "owner", "editor"];
    this.domNode = $("#document_access_list");
    $("#add_access").click(this.addAccess.pBind(this));
    $(".delete_access").live("click", this.deleteAccess.pBind(this));    
    $("#wb-change-access-dialog").dialog(
    {
        bgiframe: true,
        autoOpen: false,
        height: 300,
        modal: true,
        buttons: 
        {
            Save: this.applayAccess.pBind(this),
            Cancel: function()
            {
                $(this).dialog('close');
            }
        }
    });
  },
  
  addAccess: function() {
    this.domNode.prepend(this.createAccessItem());      
  },
  
  deleteAccess: function(e) {
    e.preventDefault();
    ddd("delete");
    $(e.target).parent().parent().remove();
  },
  
  showAccess: function(document) {
    this.document = document;
    // document access can be change only when we are online. So we can do ajax request here
    $.ajax({
      url: "/documents/" + document.uuid() + "/user_access",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        ddd("access", data);
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
    for (var email in this.access) {
      var accessEntry = this.createAccessItem(email, this.access[email]);
      this.domNode.append(accessEntry);      
    }
  },
  
  createAccessItem: function(email, role) {
    ddd(email,role);
    var result = null;
    if (arguments.length == 2) {
      result = $("<div/>").attr({ id: email}).addClass("user_access");
      result.append($('<div/>').addClass("user_email").text(email));
    } 
    else {
      result = $("<div/>").addClass("user_access");
      result.append($('<input/>').addClass("user_email"));      
    }  
    var accessActions = $('<div id="access_actions"/>');
    var rolesPopup = $('<select id="user_role"/>').addClass("user_role");   

    for (var i = 0; i < this.roles.length; i++) {
      var aRole = this.roles[i];
      var roleItem = $('<option/>').attr("value", aRole).text(aRole);    
      if (role == aRole) { roleItem.attr("selected", "true")}; 
      rolesPopup.append(roleItem);      
    }
    accessActions.append(rolesPopup);
    accessActions.append($('<a href="#"/>').addClass("delete_access").attr("title", "Delete").text("Delete"));
    result.append(accessActions);    
    return result;
  },
  
  getAccess: function() {
    var accesses = {};
    var allAccess = $(".user_access");
    for (var i = 0; i < allAccess.length; i++) {
      var anAccess = $(allAccess[i]);   
      var email = "";
      var emailNode = anAccess.find(".user_email");
      if (emailNode[0].tagName == "INPUT") { email = emailNode.attr("value")}
      else { email = emailNode.text()}
      accesses[email] = this.roles[anAccess.find(".user_role")[0].selectedIndex];
    }
    ddd("roles",accesses);
    return { access : $.toJSON(accesses) };
  },
  
  applayAccess: function() {
    $.ajax({
      url: '/documents/' + this.document.uuid() + '/change_user_access',
      type: 'PUT',
      dataType: 'json',
      data: this.getAccess(),    
      success: function() {
        $("#wb-change-access-dialog").dialog('close');
      },    
      error: function(MLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);
      }
    });    
  }
    
});

$.extend(WebDoc.PageBrowserController, {});
