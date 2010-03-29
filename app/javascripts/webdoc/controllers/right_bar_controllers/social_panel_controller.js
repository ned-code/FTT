  /**
 * @author David Matthey
 */
     
WebDoc.SocialPanelController = jQuery.klass(WebDoc.RightBarInspectorController, {
  
  SOCIAL_PANEL_BUTTON_SELECTOR: "a[href='#social-inspector']",
  
  initialize: function() {
    this.subscribeButton = jQuery('#subscribe-button');
    this.unsubscribeButton = jQuery('#unsubscribe-button');
    
    this.domNode = jQuery('#social-inspector');
    this.currentDocument = WebDoc.application.pageEditor.currentDocument;
    WebDoc.application.pageEditor.getCreator(function(creator) {
      this.creator = creator;
      this._loadCreatorInformation();
    }.pBind(this));
    this.subscribeButton.click(this._subscribeAction.pBind(this));
    this.unsubscribeButton.click(this._unSubscribeAction.pBind(this));
  },
  
  buttonSelector: function() {
    return this.SOCIAL_PANEL_BUTTON_SELECTOR;
  },  
  
  _loadCreatorInformation: function() {
    if (this.creator.avatar_thumb_url) {
      jQuery('#creator-info').css({
        backgroundImage: "url('" + this.creator.avatar_thumb_url + "')"
      });
    }
    jQuery('#creator-name').html(this.creator.username);
    jQuery('#creator-bio')
    .truncate(this.creator.bio, {
      testContent: '<br/><br/><br/><br/>'  // Truncate to four lines of text
    });
    
    jQuery('#creator-docs-count').html(this.creator.documents_count + ' ' + (this.creator.documents_count>1? 'webdocs' : 'webdoc'));
    
    if(this._isCreatorCurrentUser()) {
      this.unsubscribeButton.hide();
      this.subscribeButton.hide();
    }
    else {
      if(this.creator.following_info) {
        this.unsubscribeButton.show();
        this.subscribeButton.hide();
      }
      else {
        this.unsubscribeButton.hide();
        this.subscribeButton.show();
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
      this.unsubscribeButton.show();
      this.subscribeButton.hide();
    }
    else {
      this.unsubscribeButton.hide();
      this.subscribeButton.show();
    }
  },
  
  _isCreatorCurrentUser: function() {
    return WebDoc.application.pageEditor.currentUser.id === this.creator.id;
  }
  
});