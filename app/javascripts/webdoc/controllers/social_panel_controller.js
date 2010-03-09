/**
 * @author David Matthey
 */
     
WebDoc.SocialPanelController = jQuery.klass({
  
  subscribeButton: null,
  unsubscribeButton: null,
  
  initialize: function() {
    subscribeButton = jQuery('#subscribe-button');
    unsubscribeButton = jQuery('#unsubscribe-button');
    
    this.domNode = jQuery('#social-panel');
    this.currentDocument = WebDoc.application.pageEditor.currentDocument;
    this.creator = WebDoc.application.pageEditor.creator;
    subscribeButton.click(this._subscribeAction.pBind(this));
    unsubscribeButton.click(this._unSubscribeAction.pBind(this));
    this._loadCreatorInformation();
  },
  
  _loadCreatorInformation: function() {
    if (this.creator.avatar_thumb_url) {
      jQuery('#creator-info').prepend(jQuery('<img>').attr('src', this.creator.avatar_thumb_url));
    }
    jQuery('#creator-name').html(this.creator.username);
    jQuery('#creator-bio').html(this.creator.bio);
    jQuery('#creator-docs-count').html(this.creator.documents_count + ' ' + (this.creator.documents_count>1? 'webdocs' : 'webdoc'));
    
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
    jQuery.ajax({
      url: "/follow",
      type: 'POST',
      data: { following_id :this.creator.id }, 
      dataType: 'json',              
      success: function(data, textStatus) {
        ddd('Must changed button to unsubscribe');
        this._changeButtonStatus(true);
      }.pBind(this),
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);          
      }
    });
  },
  
  _unSubscribeAction: function() {
    ddd("Clicked on unsubscribe");
    jQuery.ajax({
      url: "/unfollow",
      type: 'DELETE',
      data: { following_id :this.creator.id }, 
      dataType: 'json',              
      success: function(data, textStatus) { 
        ddd('Must changed button to subscribe');
        this._changeButtonStatus(false);
      }.pBind(this),
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);          
      }
    });
  },
  
  _changeButtonStatus: function(isSubscribing) {
    if(isSubscribing) {
      unsubscribeButton.show();
      subscribeButton.hide();
    }
    else {
      unsubscribeButton.hide();
      subscribeButton.show();
    }
  },
  
  _isCreatorCurrentUser: function() {
    return WebDoc.application.pageEditor.currentUser.id === this.creator.id;
  }
  
});