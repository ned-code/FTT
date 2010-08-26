/**
 * @author Jonathan Biolaz
 */

WebDoc.FriendsSelectorController = $.klass({
  initialize: function(domNodeId) {
    this.domNodeId = domNodeId;
    this.domNode = jQuery("#"+this.domNodeId);
    this.friendsListNode = this.domNode.find('.friends_list');
  },
  
  selectFriend: function(e){
    var friendNode = jQuery(e.target).closest('li');
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
  
  clean: function(){
    this.domNode.find('.choose_friend.selected_friend').removeClass('selected_friend');
  },
  
  getFriendsSelected: function(){
    var friends = this.domNode.find('.choose_friend.selected_friend');
    var friendsList = [];
    var length = friends.length;
    for(var i=0; i<length;i++){
      friendsList.push(jQuery(friends[i]).data('uuid'));
    }
    
    return friendsList;
  },
  
  getList: function(){
    return this.selectListNode.attr('checked');
  },

  _buildFriendsList: function(data){
    ddd('_buildFriendsList',data);
    var length = data['friends'].length;
    this.friendsList = jQuery('<ul/>').attr({'class': 'horizontal index friends_selector_index friends_list'});
    var friendNode, friend;
    var klass = 'choose_friend';
    for(var i=0;i<data['friends'].length;i++){
      friend = data['friends'][i].user;
      /*
      Available data:
      avatar:   friend.avatar_thumb_url
      bio:      friend.bio
      email:    friend.email
      username: friend.username
      first_name: friend.first_name
      last_name:  friend.last_name
      id/uuid:  friend.uuid
      gender:   friend.gender
      website: friend.website
      */
      klass = 'choose_friend';
      if(this.alreadySelectedFriends.length){
        if(jQuery.inArray(friend.uuid, this.alreadySelectedFriends) != -1){
          klass = 'choose_friend selected_friend';
        }
      }
      
      var friendCard = '<div class="card friendselector" style="background-image: url(\''+friend.avatar_thumb_url+'\');">'+friend.first_name+'<br />'+friend.last_name+'</div>';
    	
      friendNode = jQuery('<li/>')
        .html(friendCard)
        .attr({
          'class': klass
        })
        .data('uuid', friend.uuid);
        
          
      friendNode.append('<input type="hidden" value=0 name="friend['+friend.uuid+']"/>');
      this.friendsList.append(friendNode);
    }
    
    var selectAllLink = jQuery('<a/>', {href: '', 'class' : 'select_all_friends', })
      .html('Select All friends');
      
    this.selectListNode = jQuery('<input/>',{type: 'checkbox', 'class' :'share_list', name: 'share_list'});
    var selectListLabelNode = jQuery('<label/>', {'for' : 'share_list'}).html('Share with all present and future friends');

    this.friendsListNode.append(selectAllLink);
    this.friendsListNode.append(selectListLabelNode);
    this.friendsListNode.append(this.selectListNode);
    this.friendsListNode.append(this.friendsList);
    this.selectListNode.bind('change', this.shareListClicked.pBind(this));
    this.domNode.find('.select_all_friends').bind('click', this.selectAllFriends.pBind(this));
    this.domNode.find('.choose_friend').bind('click', this.selectFriend.pBind(this));
    this.domNode.show();
  },
  
  loadFriendList: function(alreadySelectedFriends){
    this.alreadySelectedFriends = alreadySelectedFriends;
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
  },
  
  shareListClicked: function(e){
    e.preventDefault();
    ddd('shareListClicked');
    var value = this.selectListNode.attr('checked');
    if(value === false){
      this.friendsList.show();
    }
    else{
      this.friendsList.hide();
    }
  }
  
});

