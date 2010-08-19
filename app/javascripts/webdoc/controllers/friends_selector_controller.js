/**
 * @author Jonathan Biolaz
 */

// TODO: manage the email panel
WebDoc.FriendsSelectorController = $.klass({
  initialize: function(domNodeId) {
    this.domNodeId = domNodeId;
    this.domNode = jQuery("#"+this.domNodeId);
    this.friendsListNode = this.domNode.find('.friends_list');
    this.domNode.find('.select_all_friends').bind('click', this.selectAllFriends.pBind(this));
  },
  
  selectFriend: function(e){
    var friendNode = jQuery(e.target);
    if(friendNode.hasClass('selected_friend')){
      friendNode.removeClass('selected_friend');
    }
    else{
      friendNode.addClass('selected_friend');
    }
  },
  
  selectAllFriends: function(e){
    e.preventDefault();
    this.domNode.find('.choose_friend').addClass('selected_friend');
  },
  
  cleanFriendsList: function(){
    this.domNode.find('.choose_friend.selected_friend').removeClass('selected_friend');
  },
  
  friendsSelected: function(){
    var friends = this.domNode.find('.choose_friend.selected_friend');
    var friendsList = [];
    var length = friends.length;
    for(var i=0; i<length;i++){
      friendsList.push(jQuery(friends[i]).data('uuid'));
    }
    
    return friendsList;
  },

  _buildFriendsList: function(data){
    var length = data['friends'].length;
    var friendsList = jQuery('<ul/>').attr({'class': 'friends_list'});
    var friendNode, friend;
    for(var i=0;i<data['friends'].length;i++){
      friend = data['friends'][i].user;
      friendNode = jQuery('<li/>')
        .text(friend.username)
        .attr({
          'class': 'choose_friend'
        })
        .data('uuid', friend.uuid);
      friendNode.append('<input type="hidden" value=0 name="friend['+friend.uuid+']"/>');
      friendsList.append(friendNode);
    }
    this.friendsListNode.append(friendsList);
    this.domNode.find('.choose_friend').bind('click', this.selectFriend.pBind(this));
  },
  
  loadFriendList: function(){
    if(!this.domNode.find('ul.friends_list').length){
      $.ajax({
        url: "/friendships/",
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          this._buildFriendsList(data);
        }.pBind(this),
      
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          ddd("error", textStatus);
        }
      });
    }
  }
  
  
});

