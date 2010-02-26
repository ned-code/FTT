/**
 * @author David Matthey
 */
     
WebDoc.SocialPanelController = $.klass({
  initialize: function() {
    this.domNode = $('#social-panel');
    this.currentDocument = WebDoc.application.pageEditor.currentDocument;
    this._loadCreator();
  },
  
  _loadCreator: function() {
    $.ajax({
      url: "/documents/" + this.currentDocument.uuid() + "/creators",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        this._loadCreatorInformation(data);
      }.pBind(this),
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);          
      }
    });
  },
  
  _loadCreatorInformation: function(data) {
    var creator = data.user;
    ddd("CREATOR received:"+creator.username);
    if (creator.avatar_thumb_url) {
      $('#creator-info').prepend($('<img>').attr('src', creator.avatar_thumb_url));
    }
    $('#creator-name').html(creator.username);
    $('#creator-bio').html(creator.bio);
    $('#creator-docs-count').html(creator.documents_count + ' ' + (creator.documents_count>1? 'webdocs' : 'webdoc'));
  }
});