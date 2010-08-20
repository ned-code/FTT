/**
 * @author Jonathan Biolaz
 */

WebDoc.FriendsSelectorController = $.klass({
  initialize: function(domNodeId) {
    this.domNodeId = domNodeId;
    this.domNode = jQuery("#"+this.domNodeId);
    this.emailsListNode = this.domNode.find('.emails_list');
  },
  
  cleanFields: function(){
    
  },
  
  getEmailsList: function(){
    var emailsList = [];
    
    return emailsList;
  },
  
  buildDom: function(){
    
  }
});

