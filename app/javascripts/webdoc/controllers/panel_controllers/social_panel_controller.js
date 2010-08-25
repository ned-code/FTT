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
    this.creator = WebDoc.application.pageEditor.getCreator(); 
    this.subscribeButton.click(this._subscribeAction.pBind(this));
    this.unsubscribeButton.click(this._unSubscribeAction.pBind(this));
  },
  
  _subscribeAction: function() {
    ddd("Clicked on subscribe");
    jQuery.ajax({
      url: "/followships/follow",
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
      url: "/followships/unfollow",
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