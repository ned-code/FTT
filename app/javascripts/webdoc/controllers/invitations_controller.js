/**
 * @author Julien Bachmann
 */
//= require <webdoc/model/document>

WebDoc.InvitationsController = $.klass({
  initialize: function() {
    var self = this;
    
    this.emailInvitationForm = new WebDoc.EmailInvitationController('invitations_email_form');
    this.domNode = jQuery("#invite_people");
    
    this.emailForm = jQuery("#invitations_email_form");
    this.emailForm.bind( 'submit', this.sendInvitationsByEmail.pBind(this) );
  },
  
  init: function(){
    this.emailInvitationForm.init();
    this.cleanFields();
    this.domNode.show();
  },
  
  sendInvitationsByEmail: function(e) {
    ddd('submit !!!');
    e.preventDefault();
    var invitations = { invitations : {
                            emails : this.emailInvitationForm.getEmailsList(),
                            message : this.emailInvitationForm.getMessage()
                           }
                         };
                         
    var url = '/invitations/';
    WebDoc.ServerManager.request(url,function(data){
      ddd('email send with sucess');
    }.pBind(this), 'POST', invitations);
  },
  
  cleanFields: function(){
    this.emailInvitationForm.cleanFields();
  }
});
