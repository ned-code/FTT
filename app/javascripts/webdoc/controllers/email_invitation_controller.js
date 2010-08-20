/**
 * @author Jonathan Biolaz
 */

WebDoc.EmailInvitationController = $.klass({
  initialize: function(domNodeId) {
    this.domNodeId = domNodeId;
    this.domNode = jQuery("#"+this.domNodeId);
    this.emailsInvitationNode = this.domNode.find('.emails_invitation');
    this.domBuilded = false;
  },
  
  cleanFields: function(){
    
  },
  
  getEmailsList: function(){
    var emailsList = [];
    
    return emailsList;
  },
  
  buildDom: function(){
    var mainNode = jQuery('<div/>', {'class': 'email_invitation'});
    var titleNode = jQuery('<div/>', {'class': 'email_invitation_title'})
      .html('invite someone to bla bla bla');
    
    this.emailsListNode = jQuery('<div/>', {'class' : 'emailslist'});
    var addEmailNode = jQuery('<div/>', {'class' : 'add_email'}).html('add email');
    var messageLabel = jQuery('<label/>').html('Add a personal message');
    var messageInput = jQuery('<input/>', {type: 'textarea', 'class': 'email_message'});
    
    this.emailsListNode.append(this.buildEmailInput);
    mainNode
      .append(titleNode)
      .append(this.emailsListNode)
      .append(addEmailNode)
      .append(messageLabel)
      .append(messageInput);
    this.emailsInvitationNode.append(mainNode);
    this.domBuilded = true;
    
    this.domNode.find('.add_email').bind('click', this.addEmailInput.pBind(this));
  },
  
  buildEmailInput: function(){
    return jQuery('<input/>', {type: 'text', 'class': 'email_input'}).attr({placeholder: 'email address'});
  },
  
  addEmailInput: function(){
    this.emailsListNode.append(this.buildEmailInput);
  }
});

