/**
 * @author David Matthey
 */
     
WebDoc.SocialPanelController = $.klass({
  
  subscribeButton: null,
  unsubscribeButton: null,
  
  initialize: function() {
    subscribeButton = $('#subscribe-button');
    unsubscribeButton = $('#unsubscribe-button');
    
    this.domNode = $('#social-panel');
    this.currentDocument = WebDoc.application.pageEditor.currentDocument;
    this.creator = WebDoc.application.pageEditor.creator;
    subscribeButton.click(this._subscribeAction.pBind(this));
    unsubscribeButton.click(this._unSubscribeAction.pBind(this));
    this._loadCreatorInformation();
  },
  
  _loadCreatorInformation: function() {
    if (this.creator.avatar_thumb_url) {
      $('#creator-info').prepend($('<img>').attr('src', this.creator.avatar_thumb_url));
    }
    $('#creator-name').html(this.creator.username);
    $('#creator-bio').html(this.creator.bio);
    $('#creator-docs-count').html(this.creator.documents_count + ' ' + (this.creator.documents_count>1? 'webdocs' : 'webdoc'));
    
    if(this._isCreatorCurrentUser()) {
      unsubscribeButton.hide();
      subscribeButton.hide();
    }
    else {
      if(this.creator.following_info) {
        unsubscribeButton.show();
        subscribeButton.hide();
      }
      else {
        unsubscribeButton.hide();
        subscribeButton.show();
      }
    }
  },
  
  _subscribeAction: function() {
    ddd("Clicked on subscribe");
    $.ajax({
      url: "/followships/",
      type: 'POST',
      data: { following_id :this.creator.id }, 
      dataType: 'json',              
      success: function(data, textStatus) {
        ddd('Must changed button to unsubscribe');
        this._changeButtonStatus();
      }.pBind(this),
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);          
      }
    });
  },
  
  _unSubscribeAction: function() {
    ddd("Clicked on unsubscribe");
    $.ajax({
      url: "/followships/",
      type: 'DELETE',
      data: { following_id :this.creator.id }, 
      dataType: 'json',              
      success: function(data, textStatus) { 
        ddd('Must changed button to subscribe');
        this._changeButtonStatus();
      }.pBind(this),
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);          
      }
    });
  },
  
  _changeButtonStatus: function() {
    //$('#subscribe-button')
  },
  
  _isCreatorCurrentUser: function() {
    return WebDoc.application.pageEditor.currentUser.id === this.creator.id;
  }
  
});