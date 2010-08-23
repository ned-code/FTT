/**
 * @author Jonathan Biolaz
 
 This class allow you to append an email formular anywhere.
 It doesn't handle the form.
 You can get all the valid email entered by calling getEmailsList
 */

WebDoc.EmailInvitationController = $.klass({
  initialize: function(domNodeId) {
    this.domNodeId = domNodeId;
    this.domNode = jQuery("#"+this.domNodeId);
    this.emailsInvitationNode = this.domNode.find('.emails_invitation');
    this.domBuilded = false;
  },
  
  //init the email form. MUST be called to see something !
  init: function(){
    if(!this.domBuilded){
      this._buildDom();
    }
  },
  
  //clean all fields
  cleanFields: function(){
    this.domNode.find('.email_message').val('');
    this.domNode.find('.email_message').val('');
  },
  
  //return an array of all valid emails entered
  getEmailsList: function(){
    var emailsList = [];
    var emailsInput = this.domNode.find('.email_input');
    for(var i=0; i<emailsInput.length;i++){
      jQuery(emailsInput[i]).validate({
        pass: function( value ){
          emailsList.push(value);
        }
      });
    }
    return emailsList;
  },
  
  //return the personnal message
  getMessage: function(){
    return this.domNode.find('.email_message').val();
  },
  
  //Add an input to add more email
  addEmailInput: function(){
    this.emailsListNode.append(this._buildEmailInput);
  },
  
  _buildEmailInput: function(){
    return jQuery('<input/>', {type: 'email', 'class': 'email_input'}).attr({placeholder: 'email address', 'data-type': 'email'});
  },
  
  _buildDom: function(){
    var mainNode = jQuery('<div/>', {'class': 'email_invitation'});
    var titleNode = jQuery('<div/>', {'class': 'email_invitation_title'})
      .html('invite someone to bla bla bla');
    
    this.emailsListNode = jQuery('<div/>', {'class' : 'emailslist'});
    var addEmailNode = jQuery('<div/>', {'class' : 'add_email'}).html('add email');
    var messageLabel = jQuery('<label/>').html('Add a personal message');
    var messageInput = jQuery('<input/>', {type: 'textarea', 'class': 'email_message'});
    
    this.emailsListNode.append(this._buildEmailInput);
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
});

