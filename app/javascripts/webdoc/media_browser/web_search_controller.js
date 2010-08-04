/*
  @author Jonathan
*/

WebDoc.WebSearchController = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super('media-browser-web');
    this.domNode = $('#media-browser-web');
    this.createHandlers(this.domNode, 'click', this._webHandlers);
    this.webImagesSearch = new WebDoc.WebImagesSearch('web_images_search_field', this);
    this.webVideosSearch = new WebDoc.WebVideosSearch('web_videos_search_field', this);

    // Checkbox filters listening
    $(".filters>input[type='checkbox']")
      .attr("checked", 1)
      .change(function(){
        var panelNode = $("#"+$(this).attr("name"));
        if($(this).attr("checked")){
            panelNode.show();
        }else{
            panelNode.hide();
        }
      });
  },
  
  _webHandlers: {
    'search_images':  function(e){ WebDoc.application.mediaBrowserController.webSearchController.showImagesSearch(); },
    'search_videos':  function(e){ WebDoc.application.mediaBrowserController.webSearchController.showVideosSearch(); },
  },
  
  showImagesSearch: function(){
    this.hideAll();
    $('#web-images').show();
    $('#web_images_result').show();
  },
  
  showVideosSearch: function(){
    this.hideAll();
    $('#web-videos').show();
    $('#web_videos_result').show();
  },
  
  hideAll: function(){
    $('.web-search-tab').hide();
    $('.web_search_result').hide();
  }
  
});