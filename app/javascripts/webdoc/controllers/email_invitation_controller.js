/**
 * @author Jonathan Biolaz
 */

WebDoc.EmailInvitationController = $.klass({
  initialize: function(domNodeId) {
    this.domNodeId = domNodeId;
    this.domNode = jQuery("#"+this.domNodeId);
    this.emailsListNode = this.domNode.find('.emails_list');
    this.domBuilded = false;
  },
  
  cleanFields: function(){
    
  },
  
  getEmailsList: function(){
    var emailsList = [];
    
    return emailsList;
  },
  
  buildDom: function(){
    ddd('email invitation buildDom');
    var mainNode = jQuery('<div/>', {'class': 'email_invitation'});
    var titleNode = jQuery('<div/>', {'class': 'email_invitation_title'})
      .html('invite someone to bla bla bla');
    
    var emailsListNode = jQuery('<div/>', {'class' : 'emailslist'});
    var emailInput = jQuery('<input/>', {type: 'text', 'class': 'email_input', placeholder: 'email address'});
    var messageLabel = jQuery('<label/>').html('Add a personal message');
    var messageInput = jQuery('<input/>', {type: 'textarea', 'class': 'email_message'});
    
    emailsListNode.append(emailInput);
    mainNode
      .append(titleNode)
      .append(emailsListNode)
      .append(messageLabel)
      .append(messageInput);
    this.emailsListNode.append(mainNode);
    this.domBuilded = true;
  }
});

