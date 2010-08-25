WebDoc.InvitationsController = $.klass({
  initialize: function() {
    var self = this;
    
    this.emailInvitationForm = new WebDoc.EmailInvitationController('invitations_email_form');
    this.domNode = jQuery("#invite_people");
    
    this.emailForm = jQuery("#invitations_email_form");
    this.emailForm.bind( 'submit', this.sendInvitationsByEmail.pBind(this) );
    
    this.domNode.find('.cancel').bind('click', this.close.pBind(this));
  },
  
  init: function(){
    this.emailInvitationForm.init();
    this.cleanFields();
    this.domNode.show();
  },
  
  sendInvitationsByEmail: function(e) {
    e.preventDefault();
    var invitations = { invitation : {
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
  },
  
  close: function(e){
    e.preventDefault();
    this.domNode.hide();
  }
});
